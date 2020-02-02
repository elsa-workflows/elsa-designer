import {Component, Element, Event, EventEmitter, h, Host, Prop, State, Watch} from '@stencil/core';
import {Activity} from "../../models";
import {Container} from "inversify";
import {ActivityDefinitionStore, ActivityDisplayManager, Symbols} from "../../services";

export interface ActivityUpdatedArgs {
  activity: Activity
}

@Component({
  tag: 'elsa-activity-editor',
  styleUrl: 'activity-editor.css',
  scoped: true
})
export class ActivityEditor {

  private modal: HTMLBsModalElement;

  @Element() el: HTMLElement;

  @Prop() container: Container;
  @Prop() activity?: Activity;
  @Prop({attribute: 'show-modal', reflect: true}) showModal: boolean;

  @Event({eventName: 'hidden'}) hiddenEvent: EventEmitter;
  @Event({eventName: 'activity-updated'}) activityUpdated: EventEmitter<ActivityUpdatedArgs>;

  private activityDisplays: Array<string>;

  componentDidRender() {
    if (!!this.modal) {
      this.modal.removeEventListener('hidden.bs.modal', this.emitHiddenEvent);
      this.modal.addEventListener('hidden.bs.modal', this.emitHiddenEvent);
    }
  }

  async componentWillRender() {
    const activity = this.activity;

    if (!activity)
      return;

    const displayManager = this.container.get<ActivityDisplayManager>(ActivityDisplayManager);
    this.activityDisplays = await displayManager.displayEditor(this.activity);
  }

  private emitHiddenEvent = () => this.hiddenEvent.emit();

  private onSubmit = async (e: Event) => {
    e.preventDefault();

    const formElement = e.target as HTMLFormElement;
    const formData = new FormData(formElement);
    const displayManager = this.container.get<ActivityDisplayManager>(ActivityDisplayManager);

    await displayManager.updateActivity(this.activity, formData);

    this.activityUpdated.emit({activity: this.activity});
    this.modal.showModal = false;
  };

  render() {
    const activity = this.activity;
    const activityDefinitionStore = this.container.get<ActivityDefinitionStore>(ActivityDefinitionStore);
    const activityDefinition = !!activity ? activityDefinitionStore.get(activity.type) : null;
    const activityDefinitionDisplayName = !!activityDefinition ? activityDefinition.displayName : null;
    const activityId = !!activity ? activity.id : null;
    const activityDisplays = this.activityDisplays || [];
    const icon = !!activityDefinition ? activityDefinition.icon || 'fas fa-cog' : null;
    const title = !!activity && !!activity.id ? `Edit ${activityDefinitionDisplayName}` : `Add ${activityDefinitionDisplayName}`;

    return (

      <div>
        <bs-modal class="modal" tabindex="-1" role="dialog" aria-hidden="true" showModal={this.showModal} ref={el => this.modal = el}>
          <form method="POST" onSubmit={this.onSubmit}>
            <div class="modal-dialog modal-xl" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title"><i class={icon}/>{title}</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body" key={activityId}>
                  {activityDisplays}
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

}
