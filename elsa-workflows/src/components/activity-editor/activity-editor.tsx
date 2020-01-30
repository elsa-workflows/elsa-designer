import {Component, Element, Event, EventEmitter, h, Prop, State, Watch} from '@stencil/core';
import {Activity, ActivityDefinition} from "../../models";
import {Container, inject} from "inversify";
import {ActivityDefinitionStore, ActivityDriver, ActivityEditorContext, DisplayManager, Render, Symbols, UpdateActivityContext} from "../../services";

@Component({
  tag: 'elsa-activity-editor',
  styleUrl: 'activity-editor.css',
  scoped: true
})
export class ActivityEditor {

  private modal: HTMLBsModalElement;
  private displayManager: DisplayManager;

  @Element() el: HTMLElement;

  @Prop() container: Container;
  @Prop() activity?: Activity;
  @Prop({attribute: 'show-modal', reflect: true}) showModal: boolean;

  @Event({eventName: 'hidden'}) hiddenEvent: EventEmitter;

  @State() private activityDisplays: Array<string>;


  @Watch('activity')
  async handleActivityChanged(newValue: Activity) {
    const drivers = this.container.getAll<ActivityDriver>(Symbols.ActivityDriver);
    const store = this.container.get<ActivityDefinitionStore>(ActivityDefinitionStore);
    const activity = newValue;
    const activityDefinition = store.get(activity.type);
    const activityDrivers = drivers.filter(x => x.activityType === activity.type);
    const editorContext: ActivityEditorContext = {activity: activity, state: activity.state || {}, activityDefinition};
    this.activityDisplays = await Promise.all(activityDrivers.map(async x => await x.getEditDisplay(editorContext)));
  }

  componentDidRender() {
    if (!!this.modal) {
      this.modal.removeEventListener('hidden.bs.modal', this.emitHiddenEvent);
      this.modal.addEventListener('hidden.bs.modal', this.emitHiddenEvent);
    }
  }

  private emitHiddenEvent = () => this.hiddenEvent.emit();

  private onSubmit = async (e: Event) => {
    e.preventDefault();

    const drivers = this.container.getAll<ActivityDriver>(Symbols.ActivityDriver);
    const store = this.container.get<ActivityDefinitionStore>(ActivityDefinitionStore);
    const activity = this.activity;
    const activityDefinition = store.get(activity.type);
    const activityDrivers = drivers.filter(x => x.activityType === activity.type);
    const formElement = e.target as HTMLFormElement;
    const updateContext: UpdateActivityContext = {
      activity: activity,
      state: activity.state || {},
      activityDefinition,
      formData: new FormData(formElement)
    };

    for (const driver of activityDrivers) {
      await driver.updateActivity(updateContext);
    }
  };

  render() {
    const activity = this.activity;
    const activityDisplayName = !!activity ? activity.displayName : null;
    const activityId = !!activity ? activity.id : null;
    const activityDisplays = this.activityDisplays || [];
    const displayManager = this.container.get<DisplayManager>(DisplayManager);

    return (
      <div>
        <bs-modal class="modal fade" tabindex="-1" role="dialog" aria-hidden="true" showModal={this.showModal} ref={el => this.modal = el}>
          <form method="POST" onSubmit={this.onSubmit}>
            <div class="modal-dialog modal-xl" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Edit {activityDisplayName}</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body" key={activityId}>
                  {displayManager.display(activityDisplays)}
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
