import {Component, Prop, Element, h, Host} from '@stencil/core';
import {jsPlumbInstance} from "jsplumb";
import Panzoom from "@panzoom/panzoom";
import {Activity, Workflow} from "../../models";
import {
  createActivityElementId,
  createJsPlumb,
  displayWorkflow
} from "./jsplumb-utils";
import {createPanzoom} from "./panzoom-utils";

@Component({
  tag: 'elsa-designer',
  styleUrl: 'designer.scss',
  scoped: true
})
export class DesignerComponent {

  private workflow: Workflow;
  private workflowCanvasElement: HTMLElement;
  private jsPlumb: jsPlumbInstance;
  private panzoom: Panzoom;

  constructor() {

    const writeLine1: Activity = {
      id: '1',
      type: 'WriteLine',
      displayName: 'Write Line',
      state: {text: {type: 'Literal', expression: 'Hello World!'}},
      outcomes: ['Done'],
      left: 100,
      top: 50
    };

    const writeLine2: Activity = {
      id: '2',
      type: 'WriteLine',
      displayName: 'Write Line',
      state: {text: {type: 'Literal', expression: 'Hello World!'}},
      outcomes: ['Done'],
      left: 350,
      top: 350
    };

    this.workflow = {
      activities: [writeLine1, writeLine2],
      connections: [{sourceActivityId: '1', targetActivityId: '2', outcome: 'Done'}]
    }
  }

  @Element() element: HTMLElsaDesignerElement;

  componentWillUpdate() {
    if (!!this.jsPlumb) {
      this.jsPlumb.reset();
      this.panzoom.destroy();
    }
  }

  componentDidLoad() {
    this.setup();
  }

  componentDidUpdate() {
    this.setup();
  }

  private setup = () => {
    this.jsPlumb = this.setupJsPlumb();
    this.panzoom = createPanzoom(this.workflowCanvasElement, zoom => (this.jsPlumb as any).setZoom(zoom));
  };

  private setupJsPlumb = (): jsPlumbInstance => {
    const jsPlumb = createJsPlumb(this.workflowCanvasElement);

    jsPlumb.bind('connection', this.connectionCreated);
    jsPlumb.bind('connectionDetached', this.connectionDetached);

    displayWorkflow(jsPlumb, this.workflowCanvasElement, this.workflow);
    return jsPlumb;
  };

  private connectionCreated = (info) => {
    const workflow = this.workflow;
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
    const workflow = this.workflow;
    const sourceEndpoint = info.sourceEndpoint;
    const outcome = sourceEndpoint.getParameter('outcome');
    const sourceActivityId = info.source.getAttribute('data-activity-id');
    const targetActivityId = info.target.getAttribute('data-activity-id');

    workflow.connections = workflow.connections.filter(x => !(x.sourceActivityId === sourceActivityId && x.targetActivityId === targetActivityId && x.outcome === outcome));
  };

  private editSelectedActivity = () => {
  };

  private deleteSelectedActivity = () => {
  };

  private renderActivity = (activity: Activity) => {
    const styles = {
      top: `${activity.top}px`,
      left: `${activity.left}px`
    };

    return (
      <div id={createActivityElementId(activity.id)} data-activity-id={activity.id}
           class="activity noselect panzoom-exclude" style={styles}>
        <h5><i class="fas fa-cog"/>{activity.displayName}</h5>
      </div>
    );
  };

  render() {
    return (
      <Host>
        <div class="workflow-canvas-container">
          <div class="workflow-canvas" ref={el => this.workflowCanvasElement = el}>
            {this.workflow.activities.map(this.renderActivity)}
          </div>
        </div>
      </Host>
    );
  }
}
