import 'bs-components';
import '../../utils/array-utils';
import {Component, h, Host, Listen, Method, Prop, State, Watch} from '@stencil/core';
import {
  Activity,
  ActivityDefinition,
  ActivityDescriptor,
  emptyWorkflow,
  Workflow,
  WorkflowDefinition,
  WorkflowInstance,
  WorkflowStatus
} from '../../models';
import uuid from 'uuid-browser/v4';
import {Container} from "inversify";
import {
  ActivityDriver,
  CustomDriverStore,
  FieldDriver,
  Symbols,
  ActivityDisplayManager,
  WorkflowFactory
} from '../../services';
import {ActivityUpdatedArgs} from '../activity-editor/activity-editor';
import {Notification} from "../notifications/models";
import {ActivityArgs, WorkflowArgs} from "../designer/models";
import {ContextMenuItem} from "../context-menu/context-menu-item";
import {ContextMenuDivider} from "../context-menu/context-menu-divider";
import {WorkflowUpdatedArgs} from "../workflow-properties-editor/workflow-properties-editor";
import {Hint} from "../hint/hint";
import {FieldDisplayManager} from "../../services/field-display-manager";
import {ExpressionTypeStore} from "../../services/expression-type-store";
import {CommonDriver, DynamicPropsDriver} from "../../drivers/activity-drivers";
import {ExpressionDriver, ListDriver, SelectDriver, TextDriver} from "../../drivers/field-drivers";

@Component({
  tag: 'sample-designer-host-2',
  styleUrl: 'sample-designer-host-2.scss',
  scoped: true
})
export class DesignerHostComponent2 {

  private designer: HTMLElsaDesignerElement;
  private lastClickedLocation: { x: number, y: number } = {x: 250, y: 250};
  private workflowFactory: WorkflowFactory;
  private customDriverStore: CustomDriverStore;
  private workflowContextMenu: HTMLElsaContextMenuElement;
  private activityContextMenu: HTMLElsaContextMenuElement;

  @Prop({attribute: 'server-url'}) serverUrl: string;

  @State() private container: Container;
  @State() private activityDescriptors: Array<ActivityDescriptor>;
  @State() private workflowDefinition: WorkflowDefinition;
  @State() private workflow: Workflow = {...emptyWorkflow};
  @State() private workflowInstance: WorkflowInstance;
  @State() private workflowInstanceDefinition: WorkflowDefinition;
  @State() private workflowInstanceWorkflow: Workflow;
  @State() private activityPickerIsVisible: boolean;
  @State() private showActivityEditor: boolean;
  @State() private selectedActivity?: Activity;
  @State() private showWorkflowPicker: boolean;
  @State() private showWorkflowInstancePicker: boolean;
  @State() private workflowInstancePickerStatus: WorkflowStatus;
  @State() private showWorkflowProperties: boolean;
  @State() private showDeleteWorkflowConfirmationDialog: boolean;
  @State() private notifications: Array<Notification> = [];


  @Watch('workflow')
  async onWorkflowChanged(newValue: Workflow) {
    const definitionId = newValue.definitionId;
  }

  @Method()
  async configureServices(action: (container: Container) => void): Promise<void> {
    action(this.container);
  }

  @Method()
  async addActivityDriver(constructor: { new(...args: any[]): ActivityDriver }): Promise<void> {
    this.addActivityDriverInternal(this.container, constructor);
  }

  @Method()
  async addFieldDriver(constructor: { new(...args: any[]): FieldDriver }): Promise<void> {
    this.addFieldDriverInternal(this.container, constructor);
  }

  @Listen('workflow-contextmenu')
  async handleWorkflowContextMenu(e: CustomEvent<WorkflowArgs>) {
    await this.workflowContextMenu.show(e.detail.mouseEvent);
  }

  @Listen('activity-contextmenu')
  async handleActivityContextMenu(e: CustomEvent<ActivityArgs>) {
    await this.activityContextMenu.show(e.detail.mouseEvent, e.detail.activity);
  }

  @Listen('activity-doubleclick')
  async handleActivityDoubleClick(e: CustomEvent<ActivityArgs>) {
    await this.editActivity(e.detail.activity.id);
  }

  @Listen('activity-updated')
  async handleActivityEditorActivityUpdated(e: CustomEvent<ActivityUpdatedArgs>) {
    const activity = e.detail.activity;

    if (!activity.id) {
      activity.id = uuid();
      await this.designer.addActivity(activity)
    } else {
      await this.designer.updateActivity(activity);
    }
  }

  @Listen('workflow-updated')
  handleWorkflowPropertiesEditorWorkflowUpdated(e: CustomEvent<WorkflowUpdatedArgs>) {
    this.workflow = e.detail.workflow;
  }

  @Listen('activity-selected')
  async handleActivityPickerSelected(e: CustomEvent<ActivityDefinition>) {
    const activityDefinition = e.detail;
    const transform = await this.designer.getTransform();
    const left = (this.lastClickedLocation.x / transform.scale) - (transform.x / transform.scale);
    const top = (this.lastClickedLocation.y / transform.scale) - (transform.y / transform.scale);

    this.selectedActivity = {
      id: null,
      type: activityDefinition.type,
      displayName: activityDefinition.displayName,
      left: left,
      top: top,
      state: {},
      executed: false
    };

    this.showActivityEditor = true;
  }

  async componentWillLoad() {
    const container = this.createContainer();

    this.container = container;
    this.workflowFactory = container.get<WorkflowFactory>(WorkflowFactory);
    this.customDriverStore = container.get<CustomDriverStore>(CustomDriverStore);
    this.activityDescriptors = await this.loadActivityDescriptors();
  }

  private editActivity = async (id: string) => {
    this.selectedActivity = await this.designer.getActivity(id);
    this.showActivityEditor = true;
  };

  private onAddActivityClick = (e: MouseEvent) => {
    const x = e.x;
    const y = e.y;
    this.lastClickedLocation = {x, y};
    this.activityPickerIsVisible = true;
  };

  private onAddActivityFromToolbarClick = () => this.activityPickerIsVisible = true;
  private deleteActivity = async (id: string) => await this.designer.deleteActivity(id);
  private addActivityDriverInternal = (container: Container, constructor: { new(...args: any[]): ActivityDriver }) => container.bind<ActivityDriver>(Symbols.ActivityDriver).to(constructor).inSingletonScope();
  private addFieldDriverInternal = (container: Container, constructor: { new(...args: any[]): FieldDriver }) => container.bind<FieldDriver>(Symbols.FieldDriver).to(constructor).inSingletonScope();

  private onNewWorkflowClick = (e: MouseEvent) => {
    e.preventDefault();
    this.workflow = {...emptyWorkflow};
  };

  private onLoadWorkflowClick = (e: MouseEvent) => {
    e.preventDefault();
    this.showWorkflowPicker = true;
  };

  private onEditActivityClick = async (e: MouseEvent) => {
    e.preventDefault();
    this.editActivity((await this.activityContextMenu.getContext() as Activity).id);
  };

  private onDeleteActivityClick = async (e: MouseEvent) => {
    e.preventDefault();
    this.deleteActivity((await this.activityContextMenu.getContext() as Activity).id);
  };

  private onPropertiesClick = (e: MouseEvent) => {
    e.preventDefault();
    this.showWorkflowProperties = true;
  };

  private onDeleteWorkflowClick = (e: MouseEvent) => {
    e.preventDefault();
    this.showDeleteWorkflowConfirmationDialog = true;
  };

  private onShowWorkflowInstancePicker = (e: MouseEvent, status: WorkflowStatus) => {
    e.preventDefault();
    this.workflowInstancePickerStatus = status;
    this.showWorkflowInstancePicker = true;
  };

  private onCloseWorkflowViewerClick = () => {
    this.workflowInstanceDefinition = null;
  };

  private loadActivityDescriptors = async (): Promise<Array<ActivityDescriptor>> => {
    return [{
      category: "Demo",
      description: "Write a line of text",
      displayName: "Write Line",
      type: "WriteLine",
      icon: "fas fa-pencil",
      outcomes: ["Done"],
      properties: [{
        type: "text",
        hint: "The text to write",
        label: "Text",
        name: "Text"
      }]
    }];
  };

  private createContainer = (): Container => {
    const container = new Container();

    container.bind<Container>(Container).toConstantValue(container);
    container.bind<WorkflowFactory>(WorkflowFactory).toSelf().inSingletonScope();
    container.bind<ActivityDisplayManager>(ActivityDisplayManager).toSelf().inSingletonScope();
    container.bind<FieldDisplayManager>(FieldDisplayManager).toSelf().inSingletonScope();
    container.bind<CustomDriverStore>(CustomDriverStore).toSelf().inSingletonScope();
    container.bind<ExpressionTypeStore>(ExpressionTypeStore).toSelf().inSingletonScope();

    this.addActivityDriverInternal(container, CommonDriver);
    this.addActivityDriverInternal(container, DynamicPropsDriver);
    this.addFieldDriverInternal(container, ExpressionDriver);
    this.addFieldDriverInternal(container, ListDriver);
    this.addFieldDriverInternal(container, SelectDriver);
    this.addFieldDriverInternal(container, TextDriver);

    return container;
  };

  render() {
    return !!this.workflowInstanceDefinition ? this.renderWorkflowViewer() : this.renderWorkflowEditor();
  }

  private renderWorkflowEditor = () => {
    const workflow = this.workflow;
    const activityDescriptors = this.activityDescriptors;

    return (
      <Host>
        <div id="header"
             class="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 bg-dark border-bottom shadow-sm">
          <h5 class="my-3 mr-md-auto mb-sm-3 mb-md-3 font-weight-normal">Workflow Designer</h5>
          <ul class="nav">
            <li class="nav-item">
              <button class="btn btn-primary" onClick={this.onAddActivityFromToolbarClick}><i class="fas fa-plus"/> Add
                Activity
              </button>
            </li>
          </ul>
        </div>
        <div class="d-flex flex-column flex-fill">
          <elsa-designer workflow={workflow} activityDescriptors={activityDescriptors} ref={el => this.designer = el}/>
          <elsa-notifications notifications={this.notifications}/>
          <elsa-activity-picker
            container={this.container}
            activityDescriptors={this.activityDescriptors}
            showModal={this.activityPickerIsVisible}
            onHidden={() => this.activityPickerIsVisible = false}
          />
          <elsa-activity-editor
            container={this.container}
            activity={this.selectedActivity}
            showModal={this.showActivityEditor}
            onHidden={() => this.showActivityEditor = false}
          />
          <elsa-workflow-properties-editor workflow={workflow} showModal={this.showWorkflowProperties}
                                           onHidden={() => this.showWorkflowProperties = false}/>
          <elsa-context-menu ref={el => this.workflowContextMenu = el}>
            <ContextMenuItem text="Add Activity" onClick={this.onAddActivityClick}/>
            <ContextMenuDivider/>
            <ContextMenuItem text="Properties" onClick={this.onPropertiesClick}/>
          </elsa-context-menu>
          <elsa-context-menu ref={el => this.activityContextMenu = el}>
            <ContextMenuItem text="Edit Activity" onClick={this.onEditActivityClick}/>
            <ContextMenuItem text="Delete Activity" onClick={this.onDeleteActivityClick}/>
          </elsa-context-menu>
        </div>
      </Host>
    );
  };

  private renderWorkflowViewer = () => {
    const workflowInstanceDefinition = this.workflowInstanceDefinition;
    const workflowInstance = this.workflowInstance;
    const workflow = this.workflowInstanceWorkflow;
    const log = workflowInstance.executionLog;
    const activityDescriptors = this.activityDescriptors;

    return (
      <Host>
        <div id="header"
             class="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 bg-dark border-bottom shadow-sm">
          <h5 class="my-3 mr-md-auto mb-sm-3 mb-md-3 font-weight-normal">Workflow Viewer</h5>
          <ul class="nav">
          </ul>
        </div>
        <div class="d-flex flex-column flex-fill">
          <div class="d-flex flex-row flex-fill">
            <elsa-execution-log activityDescriptors={this.activityDescriptors}
                                workflowDefinition={workflowInstanceDefinition} log={log}/>
            <div class="flex-fill">
              <elsa-designer workflow={workflow}
                             activityDescriptors={this.activityDescriptors} readonly={true}
                             ref={el => this.designer = el}/>
            </div>
          </div>
        </div>
        <div class="d-flex p-3 px-md-4 border-top">
          <div class="ml-3">
            <span>{workflowInstanceDefinition.name}</span>
            <Hint text={`Version ${workflowInstanceDefinition.version}`}/>
          </div>
          <ul class="nav ml-auto">
            <li class="nav-item">
              <button class="btn btn-primary" onClick={this.onCloseWorkflowViewerClick}>Close</button>
            </li>
          </ul>
        </div>
      </Host>
    );
  };
}
