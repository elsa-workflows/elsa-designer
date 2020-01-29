import {Component, Element, Event, EventEmitter, h, Prop, State, Watch} from '@stencil/core';
import {Activity, ActivityDefinition} from "../../models";
import {Container} from "inversify";
import {ActivityDriver, ActivityEditorContext, Symbols} from "../../services";

@Component({
  tag: 'elsa-activity-editor',
  styleUrl: 'activity-editor.css',
  scoped: true
})
export class ActivityEditor {

  private modal: HTMLBsModalElement;

  @Element() el: HTMLElement;

  @Prop() container: Container;
  @Prop() activityDefinition?: ActivityDefinition;
  @Prop() activity?: Activity;
  @Prop({attribute: 'show-modal', reflect: true}) showModal: boolean;

  @Event({eventName: 'hidden'}) hiddenEvent: EventEmitter;

  @State() private activityDisplays: Array<string>;

  @Watch('activity')
  async handleActivityChanged(newValue: Activity) {
    const drivers = this.container.getAll<ActivityDriver>(Symbols.ActivityDriver);
    const activityDrivers = drivers.filter(x => x.activityType === newValue.type);
    const activityDefinition = this.activityDefinition;
    const editorContext: ActivityEditorContext = {activity: newValue, activityState: newValue.state || {}, activityDefinition};
    this.activityDisplays = await Promise.all(activityDrivers.map(async x => await x.getEditDisplay(editorContext)));
  }

  componentDidRender() {
    if (!!this.modal)
      this.modal.removeEventListener('hidden.bs.modal', this.emitHiddenEvent);
    this.modal.addEventListener('hidden.bs.modal', this.emitHiddenEvent);
  }

  private emitHiddenEvent = () => this.hiddenEvent.emit();

  render() {
    const activityDefinition = this.activityDefinition;
    const activity = this.activity;

    return (
      <div>
        <bs-modal class="modal fade" tabindex="-1" role="dialog" aria-hidden="true" showModal={this.showModal} ref={el => this.modal = el}>
          <div class="modal-dialog modal-xl" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Available Activities</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                {this.activityDisplays}
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-primary">Save</button>
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
              </div>
            </div>
          </div>
        </bs-modal>
      </div>
    )
  }

}
