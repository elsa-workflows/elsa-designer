import {Component, Element, h, Listen} from '@stencil/core';
import {Activity, ActivityComponent} from "../../../models";

@Component({
  tag: 'wf-designer-host',
  shadow: true
})
export class DesignerHost {

  @Element()
  el: HTMLElement;

  @Listen('activity-picked')
  async onActivityPicked(e: CustomEvent<ActivityComponent>){
    await this.designer.addActivity(e.detail);
  }

  @Listen('edit-activity')
  async onEditActivity(e: CustomEvent<Activity>){
    this.activityEditor.activity = e.detail;
    await this.activityEditor.show();
  }

  @Listen('add-activity')
  async onAddActivity(){
    await this.activityPicker.show();
  }

  @Listen('update-activity')
  async onUpdateActivity(e: CustomEvent<Activity>){
    await this.designer.updateActivity(e.detail);
  }

  activityPicker: HTMLWfActivityPickerElement;
  activityEditor: HTMLWfActivityEditorModalElement;
  designer: HTMLWfDesignerElement;

  async componentDidLoad(){
    this.activityPicker = this.el.querySelector<HTMLWfActivityPickerElement>('wf-activity-picker');
    this.activityEditor = this.el.querySelector<HTMLWfActivityEditorModalElement>('wf-activity-editor-modal');
    this.designer = this.el.querySelector<HTMLWfDesignerElement>('wf-designer');
  }

  render(){
    return (<host><slot/></host>);
  }
}
