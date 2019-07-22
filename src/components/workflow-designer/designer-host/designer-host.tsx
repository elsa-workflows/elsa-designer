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
import DisplayManager from '../../../services/display-manager';
import { TextFieldDriver } from "../../../drivers/text-field-driver";
import { ExpressionFieldDriver } from "../../../drivers/expression-field-driver";
import { ListFieldDriver } from "../../../drivers/list-field-driver";

@Component({
  tag: 'wf-designer-host',
  shadow: false
})
export class DesignerHost {

  @Element()
  el: HTMLElement;

  @Prop({ context: 'store' })
  store: Store;

  @Prop({ attribute: 'onready' })
  onReady: any;

  @Listen('activity-picked')
  async onActivityPicked(e: CustomEvent<ActivityDefinition>){
    await this.designer.addActivity(e.detail);
  }

  @Listen('edit-activity')
  async onEditActivity(e: CustomEvent<Activity>){
    this.activityEditor.activity = e.detail;
    this.activityEditor.show = true;
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

  @Prop()
  activityPicker: HTMLWfActivityPickerElement;

  @Prop()
  activityEditor: HTMLWfActivityEditorElement;

  @Prop()
  designer: HTMLWfDesignerElement;

  @Prop()
  importExport: HTMLWfImportExportElement;

  componentWillLoad() {
    this.store.setStore(configureStore({
      activityDefinitions: [],
      workflow: {
        activities: [],
        connections: []
      }
    }));

    DisplayManager.addDriver('text', new TextFieldDriver());
    DisplayManager.addDriver('expression', new ExpressionFieldDriver());
    DisplayManager.addDriver('list', new ListFieldDriver());
  }

  componentDidLoad(){
    this.activityPicker = this.el.querySelector<HTMLWfActivityPickerElement>('wf-activity-picker');
    this.activityEditor = this.el.querySelector<HTMLWfActivityEditorElement>('wf-activity-editor');
    this.designer = this.el.querySelector<HTMLWfDesignerElement>('wf-designer');
    this.importExport = this.el.querySelector<HTMLWfImportExportElement>('wf-import-export');

    if(!!this.onReady)
      eval(this.onReady);
  }

  render(){
    return (<host><slot/></host>);
  }
}
