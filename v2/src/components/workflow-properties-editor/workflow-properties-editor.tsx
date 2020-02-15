import {Component, Element, Event, EventEmitter, h, Prop} from '@stencil/core';
import {Workflow, WorkflowPersistenceBehavior, WorkflowPersistenceBehaviors} from "../../models";
import {Container} from "inversify";
import {FormGroup} from "../form-group/form-group";
import {Checkbox} from "../checkbox/checkbox";

export interface WorkflowUpdatedArgs {
  workflow: Workflow
}

@Component({
  tag: 'elsa-workflow-properties-editor',
  scoped: true
})
export class WorkflowPropertiesEditor {

  private modal: HTMLBsModalElement;

  @Element() el: HTMLElement;

  @Prop() container: Container;
  @Prop({mutable: true}) workflow: Workflow;
  @Prop({attribute: 'show-modal', reflect: true}) showModal: boolean;

  @Event({eventName: 'hidden'}) hiddenEvent: EventEmitter;
  @Event({eventName: 'workflow-updated'}) workflowUpdated: EventEmitter<WorkflowUpdatedArgs>;

  componentDidRender() {
    if (!!this.modal) {
      this.modal.removeEventListener('hidden.bs.modal', this.emitHiddenEvent);
      this.modal.addEventListener('hidden.bs.modal', this.emitHiddenEvent);
    }
  }

  private emitHiddenEvent = () => this.hiddenEvent.emit();

  private onSubmit = async (e: Event) => {
    e.preventDefault();

    const formElement = e.target as HTMLFormElement;
    const formData = new FormData(formElement);
    const workflow = this.workflow;

    workflow.name = formData.get('name').toString().trim();
    workflow.description = formData.get('description').toString().trim();
    workflow.isDisabled = !formData.get('isEnabled');
    workflow.isSingleton = !!formData.get('isSingleton');
    workflow.deleteCompletedInstances = !!formData.get('deleteCompletedInstances');
    workflow.persistenceBehavior = formData.get('persistenceBehavior').toString() as WorkflowPersistenceBehavior;

    this.workflowUpdated.emit({workflow: this.workflow});
    this.modal.showModal = false;
  };

  render() {
    return (
      <div>
        <bs-modal class="modal" tabindex="-1" role="dialog" aria-hidden="true" showModal={this.showModal} ref={el => this.modal = el}>
          <form method="POST" onSubmit={this.onSubmit}>
            <div class="modal-dialog modal-xl" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Workflow Properties</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  {this.renderBody()}
                </div>
                <div class="modal-footer">
                  <button type="submit" class="btn btn-primary">Save</button>
                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                </div>
              </div>
            </div>
          </form>
        </bs-modal>
      </div>
    )
  }

  private renderBody = () => {
    const workflow = this.workflow;

    if (!workflow)
      return null;

    const selectedPersistenceBehavior = workflow.persistenceBehavior;

    return (
      <div>
        <FormGroup htmlId="name" label="Name">
          <input id="name" type="text" name='name' class="form-control" value={workflow.name}/>
        </FormGroup>
        <FormGroup htmlId="description" label="Description">
          <textarea id="description" name='description' class="form-control" value={workflow.description}/>
        </FormGroup>
        <FormGroup htmlId="persistenceBehavior" label="Persistence Strategy" hint="Specify the persistence strategy that will control when workflow instances will be persisted.">
          <select id="persistenceBehavior" name="persistenceBehavior" class="form-control">
            <option value={WorkflowPersistenceBehaviors.Suspended} selected={selectedPersistenceBehavior == WorkflowPersistenceBehaviors.Suspended}>Suspended</option>
            <option value={WorkflowPersistenceBehaviors.ActivityExecuted} selected={selectedPersistenceBehavior == WorkflowPersistenceBehaviors.ActivityExecuted}>Activity Executed</option>
            <option value={WorkflowPersistenceBehaviors.WorkflowExecuted} selected={selectedPersistenceBehavior == WorkflowPersistenceBehaviors.WorkflowExecuted}>Workflow Executed</option>
          </select>
        </FormGroup>
        <FormGroup hint="When enabled, this workflow will only have one running instance at any one time.">
          <Checkbox htmlName="isSingleton" label="Singleton" checked={workflow.isSingleton}/>
        </FormGroup>
        <FormGroup hint="When checked, completed workflow instances will be automatically deleted from the workflow instance store.">
          <Checkbox htmlName="deleteCompletedInstances" label="Delete Completed Instances" checked={this.workflow.deleteCompletedInstances}/>
        </FormGroup>
        <FormGroup hint="Check to enable/disable this workflow.">
          <Checkbox htmlName="isEnabled" label="Enabled" checked={!workflow.isDisabled}/>
        </FormGroup>
      </div>
    );
  };

}
