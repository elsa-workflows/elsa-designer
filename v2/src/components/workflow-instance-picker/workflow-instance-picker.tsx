import {Component, Host, h, Element, Prop, State, Event, EventEmitter} from '@stencil/core';
import {Container} from "inversify";
import {Workflow, WorkflowInstanceSummary, WorkflowStatus} from "../../models";
import {WorkflowInstanceStore} from "../../services";

export interface WorkflowInstanceSelectedArgs {
  id: string
}

@Component({
  tag: 'elsa-workflow-instance-picker',
  scoped: true
})
export class WorkflowInstancePicker {

  private modal: HTMLBsModalElement;
  private workflowInstanceStore: WorkflowInstanceStore;

  @Element() el: HTMLElement;

  @Prop() container: Container;
  @Prop() workflow: Workflow;
  @Prop() status: WorkflowStatus;
  @Prop({attribute: 'show-modal', reflect: true}) showModal: boolean;

  @Event({eventName: 'hidden'}) hiddenEvent: EventEmitter;
  @Event({eventName: 'workflow-instance-selected'}) workflowSelectedEvent: EventEmitter<WorkflowInstanceSelectedArgs>;

  @State() private workflowInstances: Array<WorkflowInstanceSummary> = [];

  componentDidLoad() {
    this.workflowInstanceStore = this.container.get<WorkflowInstanceStore>(WorkflowInstanceStore);
  }

  componentDidRender() {
    if (!!this.modal) {
      this.modal.removeEventListener('hidden.bs.modal', this.hiddenEvent.emit);
      this.modal.removeEventListener('show.bs.modal', this.onShow);
      this.modal.addEventListener('hidden.bs.modal', this.hiddenEvent.emit);
      this.modal.addEventListener('show.bs.modal', this.onShow);
    }
  }

  private onShow = async () => {
    const workflow = this.workflow;

    if(!workflow)
      return;

    const definitionId = workflow.definitionId;
    this.workflowInstances = await this.workflowInstanceStore.listByDefinitionId(definitionId, this.status);
  };

  private selectWorkflow = (e: MouseEvent, id: string) => {
    e.preventDefault();

    this.showModal = false;
    this.workflowSelectedEvent.emit({id});
  };

  render() {
    const workflowInstances = this.workflowInstances;

    return (
      <div>
        <bs-modal class="modal" tabindex="-1" role="dialog" aria-hidden="true" showModal={this.showModal} ref={el => this.modal = el}>
          <div class="modal-dialog modal-xl" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Workflow Definitions</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <table class="table align-items-center table-flush table-borderless">
                  <thead class="thead-dark">
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Version</th>
                    <th scope="col">Status</th>
                    <th scope="col">Created</th>
                    <th scope="col">Message</th>
                  </tr>
                  </thead>
                  <tbody>
                  {workflowInstances.map(this.renderRow)}
                  </tbody>
                </table>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
              </div>
            </div>
          </div>
        </bs-modal>
      </div>
    );
  }

  private renderRow = (workflowInstance: WorkflowInstanceSummary) => {
    return (
      <tr>
        <th scope="row">
          <div class="media align-items-center">
            <div class="media-body">
              <a class="mb-0 text-sm" href="#" onClick={e => this.selectWorkflow(e, workflowInstance.id)}>{workflowInstance.id}</a>
            </div>
          </div>
        </th>
        <td>{workflowInstance.version}</td>
        <td>{workflowInstance.status}</td>
        <td>{workflowInstance.createdAt}</td>
        <td>{workflowInstance.fault?.message}</td>
      </tr>
    )
  };
}
