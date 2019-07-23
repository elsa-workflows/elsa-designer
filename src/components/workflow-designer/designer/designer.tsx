import { Component, Element, Event, EventEmitter, h, Method, Prop, State } from '@stencil/core';
import { Store } from '@stencil/redux';
import {
  Connection as JsPlumbConnection,
  DragEventCallbackOptions,
  Endpoint,
  EndpointOptions,
  jsPlumbInstance
} from "jsplumb";
import { CssMap } from "../../../utils";
import { JsPlumbUtils } from "./jsplumb-utils";
import { Activity as ActivityInstance } from "../activity/activity";
import { Connection as ConnectionComponent } from "../connection/connection";
import { ActivityModel } from "./models";
import uuid from 'uuid-browser/v4';
import {
  Activity,
  ActivityDefinition,
  ActivityDisplayMode,
  Workflow,
  Point,
  ActivityDefinitionMap
} from "../../../models";
import { addActivity, loadWorkflow, newWorkflow } from "../../../redux/actions";
import { ComponentHelper } from "../../../utils/ComponentHelper";
import ActivityManager from '../../../services/activity-manager';

@Component({
  tag: 'wf-designer',
  styleUrl: 'designer.scss',
  shadow: false
})
export class Designer {

  constructor() {
    this.jsPlumb = JsPlumbUtils.createInstance(this.elem());
  }

  @Element()
  private el: HTMLElement;

  @Prop({ context: 'store' })
  store: Store;

  @State()
  activityDefinitions: ActivityDefinitionMap = {};

  @State()
  workflow: Workflow = {
    activities: [],
    connections: []
  };

  @Method()
  async newWorkflow() {
    this.newWorkflowInternal();
  }

  @Method()
  async getWorkflow() {
    return { ...this.workflow };
  }

  @Method()
  async loadWorkflow(workflow: Workflow) {
    this.loadWorkflowInternal(workflow);
  }

  @Method()
  async addActivity(activityDefinition: ActivityDefinition) {
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

    this.addActivityInternal(activity);
  }

  @Method()
  async updateActivity(activity: Activity) {
    await this.updateActivityInternal(activity);
  }

  @Event({ eventName: 'edit-activity' })
  private editActivityEvent: EventEmitter;

  @Event({ eventName: 'add-activity' })
  private addActivityEvent: EventEmitter;

  jsPlumb: jsPlumbInstance;
  lastClickedLocation: Point = null;
  activityContextMenu: HTMLWfContextMenuElement;
  selectedActivity: Activity;

  addActivityInternal!: typeof addActivity;
  newWorkflowInternal!: typeof newWorkflow;
  loadWorkflowInternal!: typeof loadWorkflow;

  private elem = (): HTMLElement => this.el;

  async componentWillLoad() {
    await ComponentHelper.rootComponentReady();
    const activities = Array.from(this.elem().querySelectorAll('wf-activity')).map(x => ActivityInstance.getModel(x));
    const connections = Array.from(this.elem().querySelectorAll('wf-connection')).map(x => ConnectionComponent.getModel(x));

    this.store.mapDispatchToProps(this, {
      addActivityInternal: addActivity,
      newWorkflowInternal: newWorkflow,
      loadWorkflowInternal: loadWorkflow
    });

    this.store.mapStateToProps(this, state => {
      return {
        activityDefinitions: this.createActivityDefinitionLookup(state.activityDefinitions),
        workflow: state.workflow
      }
    });

    await this.loadWorkflow({ ...this.workflow, activities, connections });
  }

  componentDidRender() {
    this.setupJsPlumb();
  }

  render() {
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
          })
        }
        <wf-context-menu target={ this.elem() }>
          <wf-context-menu-item text="Add Activity" onClick={ this.onAddActivityClick } />
        </wf-context-menu>
        <wf-context-menu ref={ (el) => this.activityContextMenu = el }>
          <wf-context-menu-item text="Edit" onClick={ this.onEditActivityClick } />
          <wf-context-menu-item text="Delete" onClick={ this.onDeleteActivityClick } />
        </wf-context-menu>
      </div>
    );
  }

  private createActivityDefinitionLookup = definitions => {
    const lookup: ActivityDefinitionMap = {};

    for (const definition of definitions) {
      lookup[definition.type] = definition;
    }

    return lookup;
  };

  private deleteActivity = async (activity: Activity) => {
    const activities = this.workflow.activities.filter(x => x.id !== activity.id);
    const connections = this.workflow.connections.filter(x => x.sourceActivityId != activity.id && x.destinationActivityId != activity.id);
    const workflow = { ...this.workflow, activities, connections };

    await this.loadWorkflow(workflow);
  };

  private createActivityModels(): Array<ActivityModel> {
    return this.workflow.activities.map((activity: Activity) => {

      const definition = this.activityDefinitions[activity.type];

      return {
        activity,
        definition
      };
    });
  }

  private setupJsPlumb = () => {
    this.jsPlumb.reset();
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
    this.jsPlumb.revalidate(element);
  };

  private setupDragDrop = (element: Element) => {
    let dragStart: any = null;
    let hasDragged: boolean = false;

    this.jsPlumb.draggable(element, {
      containment: "true",
      start: (params: DragEventCallbackOptions) => {
        dragStart = { left: params.e.screenX, top: params.e.screenY };
      },
      stop: async (params: DragEventCallbackOptions) => {
        hasDragged = dragStart.left !== params.e.screenX || dragStart.top !== params.e.screenY;

        if (!hasDragged)
          return;

        const activity = { ...this.findActivityByElement(element) };
        activity.left = params.pos[0];
        activity.top = params.pos[1];

        await this.updateActivityInternal(activity);
      }
    });
  };

  private setupTargets(element: Element) {
    this.jsPlumb.makeTarget(element, {
      dropOptions: { hoverClass: 'hover' },
      anchor: 'Continuous',
      endpoint: ['Blank', { radius: 4 }]
    });
  }

  private setupOutcomes(element: Element) {
    const activity = this.findActivityByElement(element);
    const definition = this.activityDefinitions[activity.type];
    const outcomes = ActivityManager.getOutcomes(activity, definition);

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
    return this.elem().querySelectorAll(".activity");
  }

  private static getActivityId(element: Element): string {
    return element.attributes['data-activity-id'].value;
  }

  private findActivityByElement = (element: Element): Activity => {
    const id = Designer.getActivityId(element);
    return this.findActivityById(id);
  };

  private findActivityById = (id: string): Activity => this.workflow.activities.find(x => x.id === id);

  private updateActivityInternal = async (activity: Activity) => {
    const activities = [...this.workflow.activities];
    const index = activities.findIndex(x => x.id == activity.id);

    activities[index] = { ...activity };

    await this.loadWorkflow({ ...this.workflow, activities });
  };

  private setupJsPlumbEventHandlers = () => {
    this.jsPlumb.bind('connection', this.connectionCreated);
    this.jsPlumb.bind('connectionDetached', this.connectionDetached);
  };

  private connectionCreated = async (info: any) => {
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

      await this.loadWorkflow({ ...this.workflow, connections });
    }
  };

  private connectionDetached = async (info: any) => {
    const sourceEndpoint: any = info.sourceEndpoint;
    const outcome: string = sourceEndpoint.getParameter('outcome');
    const sourceActivity: Activity = this.findActivityByElement(info.source);
    const destinationActivity: Activity = this.findActivityByElement(info.target);
    const connections = this.workflow.connections.filter(x => !(x.sourceActivityId === sourceActivity.id && x.destinationActivityId === destinationActivity.id && x.outcome === outcome));

    const workflow = { ...this.workflow, connections };
    await this.loadWorkflow(workflow);
  };

  private onEditActivity(activity: Activity) {
    this.editActivityEvent.emit(activity);
  }

  private onAddActivityClick = (e: MouseEvent) => {
    const el = this.elem() as HTMLElement;
    this.lastClickedLocation = {
      left: e.pageX - el.offsetLeft,
      top: e.pageY - el.offsetTop
    };
    this.addActivityEvent.emit();
  };

  private onDeleteActivityClick = async () => {
    await this.deleteActivity(this.selectedActivity);
  };

  private onEditActivityClick = () => {
    this.onEditActivity(this.selectedActivity);
  };

  private async onActivityContextMenu(e: MouseEvent, activity: Activity) {
    this.selectedActivity = activity;
    await this.activityContextMenu.handleContextMenuEvent(e);
  }
}
