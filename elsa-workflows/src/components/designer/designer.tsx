import {Component, Prop, Element, h, Host, Watch, State, Method} from '@stencil/core';
import {jsPlumbInstance} from "jsplumb";
import Panzoom from "@panzoom/panzoom";
import {Activity, Workflow} from "../../models";
import {
  createActivityElementId,
  createJsPlumb,
  displayWorkflow
} from "./jsplumb-utils";
import {createPanzoom} from "./panzoom-utils";

const emptyWorkflow: Workflow = {
  id: null,
  activities: [],
  connections: []
};

@Component({
  tag: 'elsa-designer',
  styleUrl: 'designer.scss',
  scoped: true
})
export class DesignerComponent {

  private workflowCanvasElement: HTMLElement;
  private jsPlumb: jsPlumbInstance;
  private panzoom: Panzoom;
  private currentWorkflow: Workflow;

  @Prop() workflow: Workflow;
  @Element() element: HTMLElsaDesignerElement;

  @Watch('workflow')
  workflowHandler(newValue: Workflow) {
    this.currentWorkflow = newValue;
  }

  @Method()
  async getWorkflow(): Promise<Workflow> {
    return {...this.currentWorkflow};
  }

  componentWillLoad() {
    this.jsPlumb = createJsPlumb(this.workflowCanvasElement);
  }

  componentDidRender() {
    this.setup();
  }

  private workflowOrDefault = () => this.workflow || emptyWorkflow;

  private setup = () => {
    this.setupJsPlumb();
    this.setupPanzoom();
  };

  private setupJsPlumb = () => {
    const jsPlumb = this.jsPlumb;
    jsPlumb.reset();
    jsPlumb.bind('connection', this.connectionCreated);
    jsPlumb.bind('connectionDetached', this.connectionDetached);

    const workflow = this.workflowOrDefault();
    displayWorkflow(jsPlumb, this.workflowCanvasElement, workflow);
  };

  private setupPanzoom = () => {
    if (!!this.panzoom)
      this.panzoom.destroy();

    this.panzoom = createPanzoom(this.workflowCanvasElement, zoom => (this.jsPlumb as any).setZoom(zoom));
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
    const workflow = this.workflowOrDefault();
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
      left: `${activity.left}px`,
      top: `${activity.top}px`
    };

    return (
      <div key={activity.id} id={createActivityElementId(activity.id)} data-activity-id={activity.id} class="activity noselect panzoom-exclude" style={styles}>
        <h5><i class="fas fa-cog"/>{activity.displayName}</h5>
      </div>
    );
  };

  render() {
    const workflow = this.workflowOrDefault();

    return (
      <Host>
        <div class="workflow-canvas-container">
          <div class="workflow-canvas" ref={el => this.workflowCanvasElement = el}>
            {workflow.activities.map(this.renderActivity)}
          </div>
        </div>
      </Host>
    );
  }
}
