import { Component, Element, h, Method, Event, EventEmitter, Prop, Watch } from '@stencil/core';
//import Handlebars from 'handlebars/dist/handlebars';
import activityDefinitionStore from '../../../services/activity-definition-store';
import { Activity, ActivityDefinition, ActivityDisplayMode } from "../../../models";
import { FormUpdater } from "../../../utils";
import $ from "jquery";
import 'bootstrap';

@Component({
  tag: 'wf-activity-editor-modal',
  styleUrl: 'activity-editor-modal.scss',
  shadow: true
})
export class ActivityEditorModal {

  @Element()
  el: HTMLElement;

  @Prop()
  activity: Activity;

  @Watch('activity')
  activityChangeHandler(newValue: Activity) {
    this.activityDefinition = activityDefinitionStore.findActivityByType(newValue.type);
  }

  @Method()
  async show() {
    $(this.modal).modal('show');
  }

  @Method()
  async hide() {
    $(this.modal).modal('hide');
  }

  @Event({ eventName: 'update-activity' })
  submit: EventEmitter;

  activityDefinition: ActivityDefinition;

  public componentWillRender() {
    if (!this.activity)
      return;

    if (!this.activityDefinition) {
      console.log(`No activity of type ${ this.activity.type } exists in the library.`);
      return;
    }
  }

  modal: HTMLElement;

  async onSubmit(e: Event) {
    e.preventDefault();

    const form: any = e.target;
    const formData = new FormData(form);
    const updateEditor = FormUpdater.updateEditor;
    const updatedActivity: Activity = updateEditor(this.activity, formData);
    this.submit.emit(updatedActivity);
    await this.hide();
  }

  render() {
    const activity = this.activity;
    const activityDefinition = this.activityDefinition;

    if(!activityDefinition)
      return null;

    return (
      <div>
        <div class="modal" tabindex="-1" role="dialog" ref={ el => this.modal = el as HTMLElement }>
          <div class="modal-dialog modal-xl" role="document">
            <div class="modal-content">
              <form onSubmit={ e => this.onSubmit(e) }>
                <div class="modal-header">
                  <h5 class="modal-title">Edit { activityDefinition.displayName }</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <wf-activity-renderer activity={ activity } activityDefinition={ activityDefinition } displayMode={ ActivityDisplayMode.Edit } />
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                  <button type="submit" class="btn btn-primary">Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // private static parseHandlebars(source: string, activity: Activity): string {
  //   const template = Handlebars.compile(source);
  //   return template({...activity.state, activity});
  // }
}
