import {Component, Element, h, Method, Event, EventEmitter, Prop, Watch} from '@stencil/core';
import Handlebars from 'handlebars/dist/handlebars';
import activityDefinitionStore from '../../services/ActivityDefinitionStore';
import {Activity, ActivityComponent} from "../../models";
import {FormUpdater} from "../../utils/form-updater";

@Component({
  tag: 'wf-activity-editor-modal',
  shadow: false
})
export class ActivityEditorModal {

  @Element()
  el: HTMLElement;

  @Prop()
  activity: Activity;

  @Watch('activity')
  activityChangeHandler(newValue: Activity){
    this.activityComponent = activityDefinitionStore.findActivityByType(newValue.type);
  }

  @Method()
  async show() {
    $(this.modal).modal('show');
  }

  @Method()
  async hide() {
    $(this.modal).modal('hide');
  }

  @Event({eventName: 'update-activity'})
  submit: EventEmitter;

  activityComponent: ActivityComponent;

  public componentWillRender() {
    if (!this.activity)
      return;

    if(!this.activityComponent)
    {
      console.log(`No activity of type ${this.activity.type} exists in the library.`);
      return;
    }

    this.editor = this.activityComponent.editorTemplate ? this.activityComponent.editorTemplate(this.activity) : null;

    if(typeof(this.editor) === 'string')
      this.editor = ActivityEditorModal.parseHandlebars(this.editor, this.activity);
  }

  editor: any;
  modal: HTMLElement;

  async onSubmit(e: Event) {
    e.preventDefault();

    const form: any = e.target;
    const formData = new FormData(form);
    const updateEditor = this.activityComponent.updateEditor ? this.activityComponent.updateEditor : FormUpdater.updateEditor;
    const updatedActivity: Activity = updateEditor(this.activity, formData);
    this.submit.emit(updatedActivity);
    await this.hide();
  }

  render() {
    const isHtml = typeof(this.editor) === 'string';
    const innerHtml = isHtml ? this.editor : null;
    const innerJsx = isHtml ? null : this.editor;
    const activityComponent = this.activityComponent;
    const displayName = activityComponent ? activityComponent.displayName : null;

    return (
      <div>
        <div class="modal" tabindex="-1" role="dialog" ref={el => this.modal = el as HTMLElement}>
          <div class="modal-dialog modal-xl" role="document">
            <div class="modal-content">
              <form onSubmit={e => this.onSubmit(e)}>
                <div class="modal-header">
                  <h5 class="modal-title">Edit {displayName}</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body" innerHTML={innerHtml}>
                  {innerJsx}
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

  private static parseHandlebars(source: string, activity: Activity): string {
    const template = Handlebars.compile(source);
    return template({...activity.state, activity});
  }
}
