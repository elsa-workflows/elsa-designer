import { Component, Element, h, Listen, Prop } from '@stencil/core';
import {
  Activity,
  ActivityDefinition,
  ImportedWorkflowData,
  WorkflowFormatDescriptor
} from "../../../models";
import { configureStore } from "../../../redux/store";
import '@stencil/redux'
import { Store } from "@stencil/redux";

@Component({
  tag: 'wf-designer-host',
  shadow: true
})
export class DesignerHost {

  @Element()
  el: HTMLElement;

  @Prop({ context: 'store' })
  store: Store;

  @Listen('activity-picked')
  async onActivityPicked(e: CustomEvent<ActivityDefinition>){
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

  @Listen('export-workflow')
  async onExportWorkflow(e: CustomEvent<WorkflowFormatDescriptor>){
    if(!this.importExport)
      return;

    await this.importExport.export(this.designer, e.detail);
  }

  @Listen('import-workflow')
  async onImportWorkflow(e: CustomEvent<ImportedWorkflowData>){
    if(!this.importExport)
      return;

    await this.importExport.import(this.designer, e.detail);
  }

  @Listen('new-workflow')
  async onNewWorkflow(){
    await this.designer.newWorkflow();
  }

  activityPicker: HTMLWfActivityPickerElement;
  activityEditor: HTMLWfActivityEditorModalElement;
  designer: HTMLWfDesignerElement;
  importExport: HTMLWfImportExportElement;

  componentWillLoad() {
    this.store.setStore(configureStore({
      activityDefinitions: [],
      workflow: {
        activities: [],
        connections: []
      }
    }));
  }

  async componentDidLoad(){
    this.activityPicker = this.el.querySelector<HTMLWfActivityPickerElement>('wf-activity-picker');
    this.activityEditor = this.el.querySelector<HTMLWfActivityEditorModalElement>('wf-activity-editor-modal');
    this.designer = this.el.querySelector<HTMLWfDesignerElement>('wf-designer');
    this.importExport = this.el.querySelector<HTMLWfImportExportElement>('wf-import-export');
  }

  render(){
    return (<host><slot/></host>);
  }
}
