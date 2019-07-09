import { Component, Element, Event, EventEmitter, h, Method, Prop} from '@stencil/core';
import { Connection as JsPlumbConnection, DragEventCallbackOptions, Endpoint, EndpointOptions, jsPlumb } from "jsplumb";
import { CssMap } from "../../../utils";
import { JsPlumbUtils } from "./jsplumb-utils";
import { Activity as ActivityInstance } from "../activity/activity";
import { Connection as ConnectionComponent } from "../connection/connection";
import { ActivityModel } from "./models";
import uuid from 'uuid-browser/v4';
import { Activity, ActivityDefinition, ActivityDisplayMode, Workflow } from "../../../models";
import { Point } from "../../../models";
import { ActivityMap } from "../../../services/activity-definition-store";

@Component({
  tag: 'wf-designer',
  styleUrl: 'designer.scss',
  shadow: false
})
export class Designer {

  @Element()
  private el: HTMLElement;

  @Prop()
  public workflow: Workflow = {
    activities: [],
    connections: []
  };

  @Prop()
  activityDefinitions: ActivityMap = {};

  @Event({ eventName: 'edit-activity' })
  private editActivityEvent: EventEmitter;

  @Event({ eventName: 'add-activity' })
  private addActivityEvent: EventEmitter;

  @Method()
  public async addActivity(activityDefinition: ActivityDefinition) {
    const left = !!this.lastClickedLocation ? this.lastClickedLocation.left : 150;
    const top = !!this.lastClickedLocation ? this.lastClickedLocation.top : 150;

    const activity: Activity = {
      id: uuid(),
      top: top,
      left: left,
      type: activityDefinition.type,
      state: {}
    };

    this.lastClickedLocation = null;
    const activities = [...this.workflow.activities, activity];
    this.workflow = { ...this.workflow, activities };
  }

  @Method()
  public async updateActivity(activity: Activity) {
    this.updateActivityInternal(activity);
  }

  private jsPlumb = JsPlumbUtils.createInstance(this.el);
  private lastClickedLocation: Point = null;
  private activityContextMenu: HTMLWfContextMenuElement;
  private selectedActivity: Activity;

  public async componentWillLoad() {
    const activities = Array.from(this.el.querySelectorAll('wf-activity')).map(x => ActivityInstance.getModel(x));
    const connections = Array.from(this.el.querySelectorAll('wf-connection')).map(x => ConnectionComponent.getModel(x));

    this.workflow = { ...this.workflow, activities, connections };
  }

  public componentDidLoad() {
    this.setupJsPlumb();
  }

  public componentDidUpdate() {
    this.jsPlumb.reset();
    this.setupJsPlumb();
  }

  public findActivityByType = (type: string): ActivityDefinition => this.activityDefinitions[type];

  public render() {
    const activities = this.createActivityModels();
    return (
      <div class="workflow-canvas">
        { activities.map((model: ActivityModel) => {
          const activity = model.activity;
          const styles: CssMap = { 'left': `${ activity.left }px`, 'top': `${ activity.top }px` };

          return (
            <div id={ `wf-activity-${ activity.id }` } data-activity-id={ activity.id } class="activity" style={ styles } onDblClick={ () => this.onEditActivity(activity) } onContextMenu={ (e) => this.onActivityContextMenu(e, activity) }>
              <wf-activity-renderer activity={ activity } activityDefinition={ model.definition } displayMode={ ActivityDisplayMode.Design } />
            </div>);
        }) }
        <wf-context-menu target={ this.el }>
          <wf-context-menu-item text="Add Activity" onClick={ this.onAddActivityClick } />
        </wf-context-menu>
        <wf-context-menu ref={ (el) => this.activityContextMenu = el }>
          <wf-context-menu-item text="Edit" onClick={ this.onEditActivityClick } />
          <wf-context-menu-item text="Delete" onClick={ this.onDeleteActivityClick } />
        </wf-context-menu>
      </div>
    );
  }

  private deleteActivity = (activity: Activity) => {
    const activities = this.workflow.activities.filter(x => x.id !== activity.id);
    this.workflow = { ...this.workflow, activities };
  };

  private createActivityModels(): Array<ActivityModel> {
    return this.workflow.activities.map((activity: Activity) => {

      const definition = this.findActivityByType(activity.type);

      return {
        activity,
        definition
      };
    });
  }

  private setupJsPlumb = () => {
    this.setupJsPlumbEventHandlers();
    this.jsPlumb.batch(() => {
      this.getActivityElements().forEach(this.setupActivityElement);
      this.setupConnections();
    });
  };

  private setupActivityElement = (element: Element) => {
    this.setupDragDrop(element);
    this.setupTargets(element);
    this.setupOutcomes(element);
    jsPlumb.revalidate(element);
  };

  private setupDragDrop(element: Element) {
    let dragStart: any = null;
    let hasDragged: boolean = false;

    this.jsPlumb.draggable(element, {
      containment: "true",
      start: (params: DragEventCallbackOptions) => {
        dragStart = { left: params.e.screenX, top: params.e.screenY };
      },
      stop: (params: DragEventCallbackOptions) => {
        hasDragged = dragStart.left !== params.e.screenX || dragStart.top !== params.e.screenY;

        if (!hasDragged)
          return;

        const activity = this.findActivityByElement(element);
        activity.left = params.pos[0];
        activity.top = params.pos[1];

        this.updateActivityInternal(activity);
      }
    });
  }

  private setupTargets(element: Element) {
    this.jsPlumb.makeTarget(element, {
      dropOptions: { hoverClass: 'hover' },
      anchor: 'Continuous',
      endpoint: ['Blank', { radius: 4 }]
    });
  }

  private setupOutcomes(element: Element) {
    const activity = this.findActivityByElement(element);
    const definition = this.findActivityByType(activity.type);
    const outcomes = definition.getOutcomes(activity);

    for (let outcome of outcomes) {
      const sourceEndpointOptions: EndpointOptions = JsPlumbUtils.getSourceEndpointOptions(activity.id, outcome);
      this.jsPlumb.addEndpoint(element, null, sourceEndpointOptions);
    }
  }

  private setupConnections = () => {
    for (let connection of this.workflow.connections) {
      const sourceEndpointId: string = JsPlumbUtils.createEndpointUuid(connection.sourceActivityId, connection.outcome);
      const sourceEndpoint: Endpoint = this.jsPlumb.getEndpoint(sourceEndpointId);
      const destinationElementId: string = `wf-activity-${ connection.destinationActivityId }`;

      this.jsPlumb.connect({
        source: sourceEndpoint,
        target: destinationElementId
      });
    }
  };

  private getActivityElements(): NodeListOf<HTMLElement> {
    return this.el.querySelectorAll(".activity");
  }

  private static getActivityId(element: Element): string {
    return element.attributes['data-activity-id'].value;
  }

  private findActivityByElement = (element: Element): Activity => {
    const id = Designer.getActivityId(element);
    return this.findActivityById(id);
  };

  private findActivityById = (id: string): Activity => this.workflow.activities.find(x => x.id === id);

  private updateActivityInternal(activity: Activity) {
    const activities = [...this.workflow.activities];
    const index = activities.findIndex(x => x.id == activity.id);

    activities[index] = activity;

    this.workflow = { ...this.workflow, activities };
  }

  private setupJsPlumbEventHandlers = () => {
    this.jsPlumb.bind('connection', this.connectionCreated);
    this.jsPlumb.bind('connectionDetached', this.connectionDetached);
  };

  private connectionCreated = (info: any) => {
    const connection: JsPlumbConnection = info.connection;
    const sourceEndpoint: any = info.sourceEndpoint;
    const outcome: string = sourceEndpoint.getParameter('outcome');
    const label: any = connection.getOverlay('label');

    label.setLabel(outcome);

    // Check if we already have this connection.
    const sourceActivity: Activity = this.findActivityByElement(info.source);
    const destinationActivity: Activity = this.findActivityByElement(info.target);
    const wfConnection = this.workflow.connections.find(x => x.sourceActivityId === sourceActivity.id && x.destinationActivityId == destinationActivity.id);

    if (!wfConnection) {
      // Add created connection to list.
      const connections = [...this.workflow.connections, {
        sourceActivityId: sourceActivity.id,
        destinationActivityId: destinationActivity.id,
        outcome: outcome
      }];

      this.workflow = { ...this.workflow, connections };
    }
  };

  private connectionDetached = (info: any) => {
    const sourceEndpoint: any = info.sourceEndpoint;
    const outcome: string = sourceEndpoint.getParameter('outcome');
    const sourceActivity: Activity = this.findActivityByElement(info.source);
    const destinationActivity: Activity = this.findActivityByElement(info.target);
    const connections = this.workflow.connections.filter(x => !(x.sourceActivityId === sourceActivity.id && x.destinationActivityId === destinationActivity.id && x.outcome === outcome));

    this.workflow = { ...this.workflow, connections };
  };

  private onEditActivity(activity: Activity) {
    this.editActivityEvent.emit(activity);
  }

  private onAddActivityClick = (e: MouseEvent) => {
    this.lastClickedLocation = {
      left: e.pageX - this.el.offsetLeft,
      top: e.pageY - this.el.offsetTop
    };
    this.addActivityEvent.emit();
  };

  private onDeleteActivityClick = () => {
    this.deleteActivity(this.selectedActivity);
  };

  private onEditActivityClick = () => {
    this.onEditActivity(this.selectedActivity);
  };

  private async onActivityContextMenu(e: MouseEvent, activity: Activity) {
    this.selectedActivity = activity;
    await this.activityContextMenu.handleContextMenuEvent(e);
  }
}
