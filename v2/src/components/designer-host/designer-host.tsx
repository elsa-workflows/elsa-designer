import 'bs-components';
import '../../utils/array-utils';
import {Component, h, Host, Listen, Method, Prop, State, Watch} from '@stencil/core';
import {Activity, ActivityDefinition, ActivityDescriptor, emptyWorkflow, VersionOptions, Workflow, WorkflowDefinition, WorkflowInstance, WorkflowInstanceStatusSummary, WorkflowStates, WorkflowStatus} from '../../models';
import uuid from 'uuid-browser/v4';
import {Container} from "inversify";
import {ActivityDescriptorStore, ActivityDriver, CustomDriverStore, FieldDriver, Symbols, WorkflowInstanceStore, WorkflowDefinitionStore} from '../../services';
import {ActivityUpdatedArgs} from '../activity-editor/activity-editor';
import {createContainer} from "../../services/container";
import {WorkflowDefinitionSelectedArgs} from "../workflow-definition-picker/workflow-definition-picker";
import {Notification, NotificationType} from "../notifications/models";
import {ActivityArgs, WorkflowArgs} from "../designer/models";
import {ContextMenuItem} from "../context-menu/context-menu-item";
import {ContextMenuDivider} from "../context-menu/context-menu-divider";
import {WorkflowUpdatedArgs} from "../workflow-properties-editor/workflow-properties-editor";
import {Hint} from "../hint/hint";
import {WorkflowInstanceSelectedArgs} from "../workflow-instance-picker/workflow-instance-picker";
import {WorkflowFactory} from "../../services/workflow-factory";

@Component({
  tag: 'elsa-designer-host',
  styleUrl: 'designer-host.scss',
  scoped: true
})
export class DesignerHostComponent {

  private designer: HTMLElsaDesignerElement;
  private lastClickedLocation: { x: number, y: number } = {x: 250, y: 250};
  private workflowDefinitionStore: WorkflowDefinitionStore;
  private workflowInstanceStore: WorkflowInstanceStore;
  private activityDescriptorStore: ActivityDescriptorStore;
  private workflowFactory: WorkflowFactory
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
  @State() private statusSummaries: Array<WorkflowInstanceStatusSummary> = [];
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
    this.statusSummaries = !!definitionId ? await this.workflowInstanceStore.listStatusSummaries(definitionId) : [];
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

  @Listen('workflow-definition-version-selected')
  async handleWorkflowDefinitionSelected(e: CustomEvent<WorkflowDefinitionSelectedArgs>) {
    const id = e.detail.id;
    const workflowDefinition = await this.workflowDefinitionStore.get(id);
    const workflow: Workflow = this.workflowFactory.fromDefinition(workflowDefinition);

    this.workflow = {...workflow};
  }

  @Listen('workflow-instance-selected')
  async handleWorkflowInstanceSelected(e: CustomEvent<WorkflowInstanceSelectedArgs>) {
    const id = e.detail.id;
    const workflowInstance = await this.workflowInstanceStore.get(id);
    const definitionId = workflowInstance.definitionId;
    const version: VersionOptions = {version: workflowInstance.version};
    const workflowDefinition = await this.workflowDefinitionStore.get(null, definitionId, version);
    const workflow = this.workflowFactory.fromInstance(workflowInstance, workflowDefinition);

    this.workflowInstance = workflowInstance;
    this.workflowInstanceDefinition = workflowDefinition;
    this.workflowInstanceWorkflow = {...workflow};
  }

  async componentWillLoad() {
    const serverUrl = this.serverUrl;
    const container = createContainer(serverUrl);

    this.container = container;
    this.workflowDefinitionStore = container.get<WorkflowDefinitionStore>(WorkflowDefinitionStore);
    this.workflowInstanceStore = container.get<WorkflowInstanceStore>(WorkflowInstanceStore);
    this.activityDescriptorStore = container.get<ActivityDescriptorStore>(ActivityDescriptorStore);
    this.workflowFactory = container.get<WorkflowFactory>(WorkflowFactory);
    this.customDriverStore = container.get<CustomDriverStore>(CustomDriverStore);
    this.activityDescriptors = await this.activityDescriptorStore.list();
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

  private saveWorkflow = async (publish: boolean) => {
    let workflow = await this.designer.getWorkflow();
    let workflowDefinition = this.workflowFactory.toDefinition(workflow);

    workflowDefinition = await this.workflowDefinitionStore.save(workflow, publish);
    workflow = this.workflow = this.workflowFactory.fromDefinition(workflowDefinition);

    const message = publish ? `Workflow published as version ${workflow.version}` : `Workflow saved as draft version ${workflow.version}`;
    const title = publish ? 'Published' : 'Saved as Draft';
    const notification: Notification = {title, message, type: NotificationType.Success};

    this.notifications = [notification];
  };

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

  private onSaveDraftClick = (e: MouseEvent) => {
    e.preventDefault();
    this.saveWorkflow(false);
  };

  private onPublishClick = (e: MouseEvent) => {
    e.preventDefault();
    this.saveWorkflow(true);
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

  private deleteWorkflow = async () => {
    const workflow = {...this.workflow};
    await this.workflowDefinitionStore.deleteDefinition(workflow.definitionId);

    this.showDeleteWorkflowConfirmationDialog = false;
    this.workflow = {...emptyWorkflow};

    const workflowName = !!workflow.name && workflow.name.trim().length > 0 ? workflow.name : '[Untitled]';
    const message = `Deleted workflow ${workflowName}`;
    const title = 'Workflow Deleted';
    const notification: Notification = {title, message, type: NotificationType.Success};

    this.notifications = [notification];
  };

  render() {
    return !!this.workflowInstanceDefinition ? this.renderWorkflowViewer() : this.renderWorkflowEditor();
  }

  private renderWorkflowEditor = () => {
    const workflow = this.workflow;
    return (
      <Host>
        <div id="header" class="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 bg-dark border-bottom shadow-sm">
          <h5 class="my-3 mr-md-auto mb-sm-3 mb-md-3 font-weight-normal">Workflow Designer</h5>
          <ul class="nav">
            <li class="nav-item">
              <button class="btn btn-primary" onClick={this.onAddActivityFromToolbarClick}><i class="fas fa-plus"/> Add Activity</button>
            </li>
          </ul>
        </div>
        <div class="d-flex flex-column flex-fill">
          <elsa-designer container={this.container} workflow={workflow} activityDescriptors={this.activityDescriptors} ref={el => this.designer = el}/>
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
          <elsa-workflow-properties-editor workflow={workflow} showModal={this.showWorkflowProperties} onHidden={() => this.showWorkflowProperties = false}/>
          <elsa-workflow-definition-picker container={this.container} showModal={this.showWorkflowPicker} onHidden={() => this.showWorkflowPicker = false}/>
          <elsa-workflow-instance-picker container={this.container} workflow={workflow} status={this.workflowInstancePickerStatus} showModal={this.showWorkflowInstancePicker} onHidden={() => this.showWorkflowInstancePicker = false}/>
          <elsa-confirmation-modal title="Delete Workflow" showModal={this.showDeleteWorkflowConfirmationDialog} onHidden={() => this.showDeleteWorkflowConfirmationDialog = false} onConfirmed={this.deleteWorkflow}>
            <p>Are you sure you want to permanently delete this workflow?</p>
          </elsa-confirmation-modal>
          <elsa-context-menu ref={el => this.workflowContextMenu = el}>
            <ContextMenuItem text="Add Activity" onClick={this.onAddActivityClick}/>
            <ContextMenuDivider/>
            <ContextMenuItem text="Load Workflow" onClick={this.onLoadWorkflowClick}/>
            <ContextMenuDivider/>
            <ContextMenuItem text="Save Draft" onClick={this.onSaveDraftClick}/>
            <ContextMenuItem text="Publish" onClick={this.onPublishClick}/>
            <ContextMenuDivider/>
            <ContextMenuItem text="Properties" onClick={this.onPropertiesClick}/>
          </elsa-context-menu>
          <elsa-context-menu ref={el => this.activityContextMenu = el}>
            <ContextMenuItem text="Edit Activity" onClick={this.onEditActivityClick}/>
            <ContextMenuItem text="Delete Activity" onClick={this.onDeleteActivityClick}/>
          </elsa-context-menu>
        </div>
        <div class="d-flex p-3 px-md-4 border-top">
          <div class="ml-3">
            {this.renderWorkflowStatusSummaries()}
          </div>
          <div class="ml-3">
            <span>{workflow.name}</span>
            <Hint text={`Version ${workflow.version}`}/>
          </div>
          <ul class="nav ml-auto">
            <li class="nav-item">
              <button class="btn btn-danger" onClick={this.onDeleteWorkflowClick} disabled={!workflow.id}>Delete</button>
            </li>
            <li class="nav-item">
              <bs-dropdown class="btn-group dropup">
                <button class="btn btn-secondary dropdown-toggle" type="button" id="loadMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-offset="-80,20">
                  Load
                </button>
                <div class="dropdown-menu" aria-labelledby="loadMenuButton">
                  <a class="dropdown-item" href="#" onClick={this.onLoadWorkflowClick}>Existing Workflow</a>
                  <a class="dropdown-item" href="#" onClick={this.onNewWorkflowClick}>New Workflow</a>
                </div>
              </bs-dropdown>
            </li>
            <li class="nav-item">
              <bs-dropdown class="btn-group dropup">
                <button class="btn btn-success dropdown-toggle " type="button" id="saveMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-offset="-80,20">
                  Save
                </button>
                <div class="dropdown-menu dropdown-menu-left" aria-labelledby="saveMenuButton">
                  <a class="dropdown-item" href="#" onClick={this.onSaveDraftClick}>Save as Draft</a>
                  <a class="dropdown-item" href="#" onClick={this.onPublishClick}>Publish</a>
                </div>
              </bs-dropdown>
            </li>
          </ul>
        </div>
      </Host>
    );
  };

  private renderWorkflowViewer = () => {
    const workflowInstanceDefinition = this.workflowInstanceDefinition;
    const workflowInstance = this.workflowInstance;
    const workflow = this.workflowInstanceWorkflow;
    const log = workflowInstance.executionLog;

    return (
      <Host>
        <div id="header" class="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 bg-dark border-bottom shadow-sm">
          <h5 class="my-3 mr-md-auto mb-sm-3 mb-md-3 font-weight-normal">Workflow Viewer</h5>
          <ul class="nav">
          </ul>
        </div>
        <div class="d-flex flex-column flex-fill">
          <div class="d-flex flex-row flex-fill">
            <elsa-execution-log activityDescriptors={this.activityDescriptors} workflowDefinition={workflowInstanceDefinition} log={log}/>
            <div class="flex-fill">
              <elsa-designer container={this.container} workflow={workflow} activityDescriptors={this.activityDescriptors} readonly={true} ref={el => this.designer = el}/>
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

  private renderWorkflowStatusSummaries = () => {
    const summaries: Array<WorkflowInstanceStatusSummary> = this.statusSummaries || [];

    const renderStatus = (status: WorkflowStatus, displayText: string, iconClass: string) => {
      const count = summaries.filter(x => x.status === status).length;
      return <li><span class={`badge badge-${iconClass}`}>{count}</span> <a href="#" onClick={e => this.onShowWorkflowInstancePicker(e, status)}>{displayText}</a></li>
    };

    return (
      <ul class="list-unstyled">
        {renderStatus(WorkflowStates.Suspended, 'Suspended', 'primary')}
        {renderStatus(WorkflowStates.Faulted, 'Faulted', 'danger')}
        {renderStatus(WorkflowStates.Completed, 'Completed', 'success')}
      </ul>
    )
  };
}
