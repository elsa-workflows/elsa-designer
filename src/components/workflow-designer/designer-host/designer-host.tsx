import { Component, Element, Event, EventEmitter, h, Listen, Method, Prop, State, Watch } from '@stencil/core';
import 'dragscroll';
import {
  Activity,
  ActivityDefinition,
  Workflow,
  WorkflowFormatDescriptor
} from "../../../models";
import "../../../drivers";
import DisplayManager from '../../../services/display-manager';
import pluginStore from '../../../services/workflow-plugin-store';
import { deepClone } from "../../../utils/deep-clone";
import '../../../plugins/console-activities';
import '../../../plugins/control-flow-activities';
import '../../../plugins/email-activities';
import '../../../plugins/http-activities';
import '../../../plugins/mass-transit-activities';
import '../../../plugins/primitives-activities';
import '../../../plugins/timer-activities';
import { BooleanFieldDriver, ExpressionFieldDriver, ListFieldDriver, TextFieldDriver } from "../../../drivers";

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

  @Prop()
  workflow: Workflow;

  @Prop({ reflect: true, attribute: "canvas-height" })
  canvasHeight: string;

  @Method()
  async newWorkflow() {
    await this.designer.newWorkflow();
  }

  @Method()
  async getWorkflow() {
    return await this.designer.getWorkflow();
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
    this.designer.workflow = deepClone(e.detail);
  }

  @Event()
  workflowChanged: EventEmitter;

  private loadActivityDefinitions = (): Array<ActivityDefinition> => {
    return pluginStore
      .list()
      .filter(x => !!x.getActivityDefinitions)
      .map(x => x.getActivityDefinitions())
      .reduce((a, b) => a.concat(b), []);
  };

  private onWorkflowChanged = (e: CustomEvent<Workflow>) => {
    this.workflowChanged.emit(e.detail);
  };

  componentWillLoad() {
    this.activityDefinitions = this.loadActivityDefinitions();
    DisplayManager.addDriver('text', new TextFieldDriver());
    DisplayManager.addDriver('expression', new ExpressionFieldDriver());
    DisplayManager.addDriver('list', new ListFieldDriver());
    DisplayManager.addDriver('boolean', new BooleanFieldDriver());
  }

  render() {
    const activityDefinitions = this.activityDefinitions;

    return (
      <host>
        <wf-activity-picker activityDefinitions={ activityDefinitions } ref={ el => this.activityPicker = el } />
        <wf-activity-editor activityDefinitions={ activityDefinitions } ref={ el => this.activityEditor = el } />
        <wf-import-export ref={ el => this.importExport = el } />
        <div class="workflow-designer-wrapper dragscroll">
          <wf-designer
            activityDefinitions={ activityDefinitions }
            ref={ el => this.designer = el }
            canvasHeight={ this.canvasHeight }
            workflow={ this.workflow }
            onWorkflowChanged={ this.onWorkflowChanged }
          />
        </div>
      </host>
    );
  }
}
