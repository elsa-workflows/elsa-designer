import {Component, Host, h, Element, Prop, State, Event, EventEmitter} from '@stencil/core';
import {Container} from "inversify";
import {WorkflowDefinitionSummary} from "../../models";
import {WorkflowStore} from "../../services";

export interface WorkflowDefinitionVersionSelectedArgs {
  id: string
}

@Component({
  tag: 'elsa-workflow-picker',
  styleUrl: 'workflow-picker.css',
  scoped: true
})
export class WorkflowPicker {

  private modal: HTMLBsModalElement;
  private workflowStore: WorkflowStore;

  @Element() el: HTMLElement;

  @Prop() container: Container;
  @Prop({attribute: 'show-modal', reflect: true}) showModal: boolean;

  @Event({eventName: 'hidden'}) hiddenEvent: EventEmitter;
  @Event({eventName: 'workflow-definition-version-selected'}) workflowSelectedEvent: EventEmitter<WorkflowDefinitionVersionSelectedArgs>;

  @State() private workflowDefinitions: Array<WorkflowDefinitionSummary> = [];

  componentDidLoad() {
    this.workflowStore = this.container.get<WorkflowStore>(WorkflowStore);
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
    this.workflowDefinitions = await this.workflowStore.list({latestOrPublished: true});
  };

  private selectWorkflow = (e: MouseEvent, id: string) => {
    e.preventDefault();
    
    this.showModal = false;
    this.workflowSelectedEvent.emit({id});
  };

  render() {
    const workflowDefinitions = this.workflowDefinitions;
    const groups = workflowDefinitions.groupBy('definitionId');

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
                    <th scope="col">Name</th>
                    <th scope="col">Description</th>
                    <th scope="col">Instances</th>
                    <th scope="col">Latest Version</th>
                    <th scope="col">Published Version</th>
                    <th scope="col">Enabled</th>
                    <th scope="col"/>
                  </tr>
                  </thead>
                  <tbody>
                  {Object.keys(groups).map(x => this.renderRow(groups[x]))}
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

  private renderRow = (group: Array<WorkflowDefinitionSummary>) => {
    const latest = group.filter(x => x.isLatest)[0];
    const published = group.filter(x => x.isPublished);
    const publishedVersion = published.length > 0 ? published[0].version.toString() : "-";
    const name = latest.name;
    const description = latest.description;
    const latestVersion = latest.version;

    return (
      <tr>
        <th scope="row">
          <div class="media align-items-center">
            <div class="media-body">
              <a class="mb-0 text-sm" href="#" onClick={e => this.selectWorkflow(e, latest.id)}>{name}</a>
            </div>
          </div>
        </th>
        <td>{description}</td>
        <td>
          <ul class="list-unstyled">
            <li>
              <i class="bg-info"/>
              <a>1 Executing</a>
            </li>
          </ul>
        </td>
        <td>{latestVersion}</td>
        <td>{publishedVersion}</td>
        <td>
          <span class="fas fa-check"/>
        </td>
        <td class="text-right">
          <bs-dropdown class="dropdown">
            <a class="btn btn-sm btn-icon-only" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <i class="fas fa-ellipsis-v"/>
            </a>
            <div class="dropdown-menu dropdown-menu-right dropdown-menu-arrow">
              <a class="dropdown-item" href="#">Edit</a>
              <a class="dropdown-item" href="#">Publish Draft</a>
              <a class="dropdown-item" href="#">Unpublish</a>
              <a class="dropdown-item" href="#">History</a>
              <a class="dropdown-item" href="#">Delete</a>
            </div>
          </bs-dropdown>
        </td>
      </tr>
    )
  };
}
