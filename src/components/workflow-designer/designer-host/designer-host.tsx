import { Component, Element, h, Listen, Method, Prop, State } from '@stencil/core';
import 'dragscroll';
import {
  Activity,
  ActivityDefinition,
  Workflow,
  WorkflowFormatDescriptor
} from "../../../models";
import DisplayManager from '../../../services/display-manager';
import { TextFieldDriver } from "../../../drivers/text-field-driver";
import { ExpressionFieldDriver } from "../../../drivers/expression-field-driver";
import { ListFieldDriver } from "../../../drivers/list-field-driver";
import '../../../plugins/console-activities';
import pluginStore from '../../../services/workflow-plugin-store';

@Component({
  tag: 'wf-designer-host',
  styleUrl: 'designer-host.scss',
  shadow: false
})
export class DesignerHost {

  activityEditor: HTMLWfActivityEditorElement;
  activityPicker: HTMLWfActivityPickerElement;
  designer: HTMLWfDesignerElement;
  importExport: HTMLWfImportExportElement;

  @Element()
  el: HTMLElement;

  @State()
  activityDefinitions: Array<ActivityDefinition> = [];

  @Prop({ reflect: true, attribute: "canvas-height" })
  canvasHeight: string;

  @Prop({ mutable: true })
  workflow: Workflow = {
    activities: [],
    connections: []
  };

  @Method()
  async newWorkflow() {
    await this.designer.newWorkflow();
  }

  @Method()
  async showActivityPicker() {
    await this.activityPicker.show();
  }

  @Method()
  async export(formatDescriptor: WorkflowFormatDescriptor) {
    await this.importExport.export(this.designer, formatDescriptor);
  }

  @Method()
  async import() {
    await this.importExport.import();
  }

  @Method()
  async load(workflow: Workflow) {
    await this.designer.loadWorkflow(workflow);
  }

  @Listen('activity-picked')
  async onActivityPicked(e: CustomEvent<ActivityDefinition>) {
    await this.designer.addActivity(e.detail);
  }

  @Listen('edit-activity')
  async onEditActivity(e: CustomEvent<Activity>) {
    this.activityEditor.activity = e.detail;
    this.activityEditor.show = true;
  }

  @Listen('add-activity')
  async onAddActivity() {
    await this.showActivityPicker();
  }

  @Listen('update-activity')
  async onUpdateActivity(e: CustomEvent<Activity>) {
    await this.designer.updateActivity(e.detail);
  }

  @Listen('export-workflow')
  async onExportWorkflow(e: CustomEvent<WorkflowFormatDescriptor>) {
    if (!this.importExport)
      return;

    await this.importExport.export(this.designer, e.detail);
  }

  @Listen('import-workflow')
  async onImportWorkflow(e: CustomEvent<Workflow>) {
    this.designer.workflow = e.detail;
  }

  private loadActivityDefinitions = (): Array<ActivityDefinition> => {
    return pluginStore
      .list()
      .filter(x => !!x.getActivityDefinitions)
      .map(x => x.getActivityDefinitions())
      .reduce((a, b) => a.concat(b), []);
  };

  componentWillLoad() {
    this.activityDefinitions = this.loadActivityDefinitions();
    DisplayManager.addDriver('text', new TextFieldDriver());
    DisplayManager.addDriver('expression', new ExpressionFieldDriver());
    DisplayManager.addDriver('list', new ListFieldDriver());
  }

  render() {
    const activityDefinitions = this.activityDefinitions;

    return (
      <host>
        <wf-activity-picker activityDefinitions={ activityDefinitions } ref={ el => this.activityPicker = el } />
        <wf-activity-editor activityDefinitions={ activityDefinitions } ref={ el => this.activityEditor = el } />
        <wf-import-export ref={ el => this.importExport = el } />
        <div class="workflow-designer-wrapper dragscroll">
          <wf-designer activityDefinitions={ activityDefinitions } workflow={ this.workflow } ref={ el => this.designer = el } canvasHeight={ this.canvasHeight } />
        </div>
      </host>
    );
  }
}
