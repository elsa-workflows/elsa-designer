import {Component, Event, Prop, Element, h, Host, Method, EventEmitter} from '@stencil/core';
import {jsPlumbInstance} from "jsplumb";
import {Activity, ActivityDefinition, ActivityDescriptor, emptyWorkflow, Workflow} from "../../models";
import {
  createActivityElementId,
  createJsPlumb,
  displayWorkflow
} from "./jsplumb-utils";
import {createPanzoom} from "./panzoom-utils";
import {PanzoomObject} from "@panzoom/panzoom/dist/src/types";
import {Container} from "inversify";
import {ActivityDisplayManager, Node} from "../../services";
import {ActivityArgs, WorkflowArgs} from "./models";
import {CssClassMap} from "../../utils/css-class-map";

interface ActivityDisplayMap {
  [id: string]: Node;
}

@Component({
  tag: 'elsa-designer',
  styleUrl: 'designer.scss',
  scoped: true
})
export class DesignerComponent {

  private workflowCanvasElement: HTMLElement;
  private jsPlumb: jsPlumbInstance;
  private panzoom: PanzoomObject;
  private displayManager: ActivityDisplayManager;
  private activityDisplays: ActivityDisplayMap;

  @Element() private element: HTMLElsaDesignerElement;

  @Prop() container: Container;
  @Prop() activityDescriptors: Array<ActivityDescriptor> = [];
  @Prop({mutable: true}) workflow: Workflow = {...emptyWorkflow};
  @Prop() readonly: boolean;

  @Event({eventName: 'workflow-contextmenu'}) workflowContextMenuEvent: EventEmitter<WorkflowArgs>;
  @Event({eventName: 'activity-contextmenu'}) activityContextMenuEvent: EventEmitter<ActivityArgs>;
  @Event({eventName: 'activity-doubleclick'}) activityDoubleClickEvent: EventEmitter<ActivityArgs>;

  @Method()
  async registerService(action: (container: Container) => void): Promise<void> {
    action(this.container);
  }

  @Method()
  async getWorkflow(): Promise<Workflow> {
    return {...this.workflow};
  }

  @Method()
  async getActivity(id: string): Promise<Activity> {
    const activity = this.workflow.activities.find(x => x.id === id);
    return {...activity};
  }

  @Method()
  async addActivity(activity: Activity) {
    const activities = [...this.workflow.activities, activity];
    this.workflow = {...this.workflow, activities};
  }

  @Method()
  async deleteActivity(id: string): Promise<void> {
    const activities = this.workflow.activities.filter(x => x.id !== id);
    this.workflow = {...this.workflow, activities: activities};
  };

  @Method()
  async updateActivity(activity: Activity) {
    const activities = [...this.workflow.activities];
    const index = activities.findIndex(x => x.id == activity.id);

    activities[index] = {...activity};

    this.workflow = {...this.workflow, activities};
  }

  @Method()
  async getTransform(): Promise<{ x: number, y: number, scale: number }> {
    const rect = this.workflowCanvasElement.getBoundingClientRect();
    const scale = this.panzoom.getScale();
    return {x: rect.x, y: rect.y, scale};
  }

  componentWillLoad() {
    this.displayManager = this.container.get<ActivityDisplayManager>(ActivityDisplayManager);
  }

  componentDidLoad() {
    this.panzoom = createPanzoom(this.workflowCanvasElement, zoom => this.jsPlumb.setZoom(zoom));
  }

  async componentWillRender() {
    const displayManager = this.displayManager;
    const workflow = this.workflowOrDefault();
    const map = this.activityDisplays = {};

    for (const activity of workflow.activities)
      map[activity.id] = await displayManager.displayDesigner(activity);
  }

  componentDidRender() {
    this.setupJsPlumb();
  }

  private workflowOrDefault = () => this.workflow || {...emptyWorkflow};

  private setupJsPlumb = () => {
    let jsPlumb = this.jsPlumb;

    if (!!jsPlumb) {
      jsPlumb.unbind('connection');
      jsPlumb.unbind('connectionDetached');
    } else
      jsPlumb = this.jsPlumb = createJsPlumb(this.workflowCanvasElement);

    jsPlumb.deleteEveryEndpoint();
    jsPlumb.deleteEveryConnection();

    displayWorkflow(jsPlumb, this.workflowCanvasElement, this.workflow, this.activityDescriptors);

    jsPlumb.bind('connection', this.connectionCreated);
    jsPlumb.bind('connectionDetached', this.connectionDetached);
  };

  private connectionCreated = (info) => {
    const workflow = this.workflowOrDefault();
    const connection = info.connection;
    const sourceEndpoint = info.sourceEndpoint;
    const outcome = sourceEndpoint.getParameter('outcome');
    const labelOverLayId = sourceEndpoint.connectorOverlays[0][1].id;
    const labelOverlay = connection.getOverlay(labelOverLayId);

    labelOverlay.setLabel(outcome);

    // Check if we already have this connection.
    const sourceActivityId = info.source.getAttribute('data-activity-id');
    const targetActivityId = info.target.getAttribute('data-activity-id');
    const wfConnection = workflow.connections.find(x => x.sourceActivityId === sourceActivityId && x.targetActivityId === targetActivityId);

    if (!wfConnection) {
      // Add created connection to list.
      workflow.connections.push({
        sourceActivityId: sourceActivityId,
        targetActivityId: targetActivityId,
        outcome: outcome
      });
    }
  };

  private connectionDetached = (info) => {
    const workflow = this.workflowOrDefault();
    const sourceEndpoint = info.sourceEndpoint;
    const outcome = sourceEndpoint.getParameter('outcome');
    const sourceActivityId = info.source.getAttribute('data-activity-id');
    const targetActivityId = info.target.getAttribute('data-activity-id');

    workflow.connections = workflow.connections.filter(x => !(x.sourceActivityId === sourceActivityId && x.targetActivityId === targetActivityId && x.outcome === outcome));
  };

  private renderActivity = (activity: Activity) => {

    if (!this.activityDisplays)
      return;

    const activityDefinition = this.activityDescriptors.find(x => x.type === activity.type);
    const displayName = activity.displayName || activityDefinition.displayName;
    const icon = activityDefinition.icon || 'fas fa-cog';
    const statusClass = activity.executed ? 'activity-executed' : null;
    const classes: CssClassMap = {
      ['activity noselect panzoom-exclude']: true,
      ['activity-executed']: !!activity.executed,
      ['activity-blocking']: !!activity.blocking,
      ['activity-faulted']: !!activity.faulted
    };

    const styles = {
      left: `${activity.left}px`,
      top: `${activity.top}px`
    };

    let display = this.activityDisplays[activity.id];

    if (!display || display.length === 0)
      display = (<h5><i class={icon}/>{displayName}</h5>);

    return (
      <div key={activity.id} id={createActivityElementId(activity.id)}
           data-activity-id={activity.id}
           class={classes}
           style={styles}
           onContextMenu={e => this.activityContextMenuEvent.emit({activity, mouseEvent: e})}
           onDblClick={e => this.activityDoubleClickEvent.emit({activity, mouseEvent: e})}>
        {display}
      </div>
    );
  };

  render() {
    const workflow = this.workflowOrDefault();

    return (
      <Host>
        <div class="workflow-canvas-container">
          <div class="workflow-canvas"
               ref={el => this.workflowCanvasElement = el}
               onContextMenu={e => this.workflowContextMenuEvent.emit({mouseEvent: e})}>
            {workflow.activities.map(this.renderActivity)}
          </div>
        </div>

      </Host>
    );
  }
}
