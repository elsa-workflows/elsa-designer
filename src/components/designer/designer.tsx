import {Component, Element, Event, EventEmitter, h, Method, State} from '@stencil/core';
import {Connection as JsPlumbConnection, DragEventCallbackOptions, Endpoint, EndpointOptions, jsPlumb} from "jsplumb";
import {CssMap} from "../../utils/css-class-map";
import {JsPlumbUtils} from "./jsplumb-utils";
import {Activity as ActivityInstance} from "../activity/activity";
import {Connection as ConnectionComponent} from "../connection/connection";
import {ActivityModel} from "./models";
import uuid from 'uuid-browser/v4';
import activityDefinitionStore from '../../services/ActivityDefinitionStore';
import {Activity, ActivityComponent, Connection} from "../../models";

@Component({
  tag: 'wf-designer',
  styleUrl: 'designer.scss',
  shadow: false
})
export class Designer {

  @Element()
  private el: HTMLElement;

  @State()
  private activities: Activity[] = [];

  @State()
  private connections: Connection[] = [];

  @Event({eventName: 'edit-activity'})
  private editActivity: EventEmitter;

  @Method()
  public async addActivity(activityDefinition: ActivityComponent) {
    const activity: Activity = {
      id: uuid(),
      top: 150,
      left: 150,
      type: activityDefinition.type,
      state: {}
    };

    this.activities = [...this.activities, activity];
  }

  @Method()
  public async updateActivity(activity: Activity) {
    this.updateActivityInternal(activity);
  }

  private jsPlumb = JsPlumbUtils.createInstance(this.el);
  private activityModels: ActivityModel[] = [];

  public async componentWillLoad() {
    this.activities = Array.from(this.el.querySelectorAll('wf-activity')).map(x => ActivityInstance.getModel(x));
    this.connections = Array.from(this.el.querySelectorAll('wf-connection')).map(x => ConnectionComponent.getModel(x));
  }

  public async componentWillRender() {
    await this.createActivityModels();
  }

  public componentDidLoad() {
    this.setupJsPlumb();
  }

  public componentDidUpdate() {
    console.log(`Resetting JsPlumb.`);
    this.jsPlumb.reset();
    this.setupJsPlumb();
    console.log(`Resetting JsPlumb completed.`);
  }

  public render() {
    return (
      <div class="workflow-canvas">
        {this.activityModels.map((model: ActivityModel) => {
          const activity = model.activity;
          const styles: CssMap = {'left': `${activity.left}px`, 'top': `${activity.top}px`};
          const isHtml = typeof (model.display) === 'string';
          const innerHtml = isHtml ? model.display : null;
          const innerJsx = isHtml ? null : model.display;
          return (
            <div id={`wf-activity-${activity.id}`} data-activity-id={activity.id} class="activity" style={styles} innerHTML={innerHtml} onDblClick={() => this.onEditActivity(activity)}>
              {innerJsx}
            </div>);
        })}
      </div>
    );
  }

  private async createActivityModels() {
    this.activityModels = await Promise.all(this.activities.map(async (activity: Activity) => {
      const definition = activityDefinitionStore.findActivityByType(activity.type);
      const display = definition.displayTemplate
        ? definition.displayTemplate(activity)
        : <div><h5>{definition.displayName}</h5><p>{definition.description}</p></div>;

      return {
        activity,
        definition,
        display
      };
    }));
  }

  private setupJsPlumb = () => {
    this.setupJsPlumbEventHandlers();
    this.jsPlumb.batch(() => {
      this.getActivityElements().forEach(this.setupElement);
      this.setupConnections();
    });
  };

  private setupElement = (element: Element) => {
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
        dragStart = {left: params.e.screenX, top: params.e.screenY};
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
      dropOptions: {hoverClass: 'hover'},
      anchor: 'Continuous',
      endpoint: ['Blank', {radius: 4}]
    });
  }

  private setupOutcomes(element: Element) {
    const activity = this.findActivityByElement(element);
    const definition = activityDefinitionStore.findActivityByType(activity.type);
    const outcomes = definition.getOutcomes(activity);

    for (let outcome of outcomes) {
      const sourceEndpointOptions: EndpointOptions = JsPlumbUtils.getSourceEndpointOptions(activity.id, outcome);
      this.jsPlumb.addEndpoint(element, null, sourceEndpointOptions);
    }
  }

  private setupConnections = () => {
    for (let connection of this.connections) {
      const sourceEndpointId: string = JsPlumbUtils.createEndpointUuid(connection.sourceActivityId, connection.outcome);
      const sourceEndpoint: Endpoint = this.jsPlumb.getEndpoint(sourceEndpointId);
      const destinationElementId: string = `wf-activity-${connection.destinationActivityId}`;

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

  private findActivityById = (id: string): Activity => this.activities.find(x => x.id === id);

  private updateActivityInternal(activity: Activity) {
    const updatedActivities = [...this.activities];
    const index = updatedActivities.findIndex(x => x.id == activity.id);

    updatedActivities[index] = activity;

    this.activities = updatedActivities;
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
    const wfConnection = this.connections.find(x => x.sourceActivityId === sourceActivity.id && x.destinationActivityId == destinationActivity.id);

    if (!wfConnection) {
      // Add created connection to list.
      this.connections = [...this.connections, {
        sourceActivityId: sourceActivity.id,
        destinationActivityId: destinationActivity.id,
        outcome: outcome
      }];
    }
  };

  private connectionDetached = (info: any) => {
    const sourceEndpoint: any = info.sourceEndpoint;
    const outcome: string = sourceEndpoint.getParameter('outcome');
    const sourceActivity: Activity = this.findActivityByElement(info.source);
    const destinationActivity: Activity = this.findActivityByElement(info.target);

    this.connections = this.connections.filter(x => !(x.sourceActivityId === sourceActivity.id && x.destinationActivityId === destinationActivity.id && x.outcome === outcome));
  };

  private onEditActivity(activity: Activity) {
    this.editActivity.emit(activity);
  }
}
