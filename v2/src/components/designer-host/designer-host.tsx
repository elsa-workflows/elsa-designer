import 'bs-components';
import '../../utils/array-utils';
import {Component, h, Host, Listen, Method, Prop, State} from '@stencil/core';
import {Activity, ActivityDefinition, emptyWorkflow, Workflow} from '../../models';
import uuid from 'uuid-browser/v4';
import {Container} from "inversify";
import {ActivityDefinitionStore, ActivityDriver, CustomDriverStore, FieldDriver, Symbols, WorkflowStore} from '../../services';
import {ActivityUpdatedArgs} from '../activity-editor/activity-editor';
import {createContainer} from "../../services/container";
import {WorkflowDefinitionVersionSelectedArgs} from "../workflow-picker/workflow-picker";
import {Notification, NotificationType} from "../notifications/models";
import {ActivityArgs, WorkflowArgs} from "../designer/models";
import {ContextMenuItem} from "../context-menu/context-menu-item";
import {ContextMenuDivider} from "../context-menu/context-menu-divider";
import {WorkflowUpdatedArgs} from "../workflow-properties-editor/workflow-properties-editor";
import {Hint} from "../hint/hint";

@Component({
  tag: 'elsa-designer-host',
  styleUrl: 'designer-host.scss',
  scoped: true
})
export class DesignerHostComponent {

  private designer: HTMLElsaDesignerElement;
  private lastClickedLocation: { x: number, y: number } = {x: 250, y: 250};
  private workflowStore: WorkflowStore;
  private activityDefinitionStore: ActivityDefinitionStore;
  private customDriverStore: CustomDriverStore;
  private workflowContextMenu: HTMLElsaContextMenuElement;
  private activityContextMenu: HTMLElsaContextMenuElement;

  @Prop({attribute: 'server-url'}) serverUrl: string;

  @State() private container: Container;
  @State() private activityDefinitions: Array<ActivityDefinition>;
  @State() private workflow: Workflow = {...emptyWorkflow};
  @State() private activityPickerIsVisible: boolean;
  @State() private showActivityEditor: boolean;
  @State() private selectedActivity?: Activity;
  @State() private showWorkflowPicker: boolean;
  @State() private showWorkflowProperties: boolean;
  @State() private showDeleteWorkflowConfirmationDialog: boolean;
  @State() private notifications: Array<Notification> = [];

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
      state: {}
    };

    this.showActivityEditor = true;
  }

  @Listen('workflow-definition-version-selected')
  async handleWorkflowSelected(e: CustomEvent<WorkflowDefinitionVersionSelectedArgs>) {
    const id = e.detail.id;
    const workflow = await this.workflowStore.get(id);

    this.workflow = {...workflow};
  }

  async componentWillLoad() {
    const serverUrl = this.serverUrl;
    const container = createContainer(serverUrl);

    this.container = container;
    this.workflowStore = container.get<WorkflowStore>(WorkflowStore);
    this.activityDefinitionStore = container.get<ActivityDefinitionStore>(ActivityDefinitionStore);
    this.customDriverStore = container.get<CustomDriverStore>(CustomDriverStore);
    this.activityDefinitions = await this.activityDefinitionStore.list();
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

    workflow = this.workflow = await this.workflowStore.save(workflow, publish);
    const message = publish ? `Workflow published as version ${workflow.version}` : `Workflow saved as draft version ${workflow.version}`;
    const title = publish ? 'Published' : 'Saved as Draft';
    const notification: Notification = {title, message, type: NotificationType.Success};

    this.notifications = [notification];
  };

  private onNewWorkflowClick = (e: MouseEvent) => {
    e.preventDefault();
    this.workflow = {...emptyWorkflow};
  };

  private deleteActivity = async (id: string) => await this.designer.deleteActivity(id);
  private addActivityDriverInternal = (container: Container, constructor: { new(...args: any[]): ActivityDriver }) => container.bind<ActivityDriver>(Symbols.ActivityDriver).to(constructor).inSingletonScope();
  private addFieldDriverInternal = (container: Container, constructor: { new(...args: any[]): FieldDriver }) => container.bind<FieldDriver>(Symbols.FieldDriver).to(constructor).inSingletonScope();
  private onEditActivityClick = async () => this.editActivity((await this.activityContextMenu.getContext() as Activity).id);
  private onDeleteActivityClick = async () => this.deleteActivity((await this.activityContextMenu.getContext() as Activity).id);
  private onLoadWorkflowClick = () => this.showWorkflowPicker = true;
  private onSaveDraftClick = () => this.saveWorkflow(false);
  private onPublishClick = () => this.saveWorkflow(true);
  private onPropertiesClick = () => this.showWorkflowProperties = true;

  private onDeleteWorkflowClick = () => {
    this.showDeleteWorkflowConfirmationDialog = true;
  };

  private deleteWorkflow = async () => {
    const workflow = {...this.workflow};
    await this.workflowStore.deleteDefinition(workflow.definitionId);

    this.showDeleteWorkflowConfirmationDialog = false;
    this.workflow = {...emptyWorkflow};

    const workflowName = !!workflow.name && workflow.name.trim().length > 0 ? workflow.name : '[Untitled]';
    const message = `Deleted workflow ${workflowName}`;
    const title = 'Workflow Deleted';
    const notification: Notification = {title, message, type: NotificationType.Success};

    this.notifications = [notification];
  };

  render() {
    const workflow = this.workflow;

    return (
      <Host>
        <div id="header" class="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-dark border-bottom shadow-sm">
          <h5 class="my-3 mr-md-auto mb-sm-3 mb-md-3 font-weight-normal">Workflow Designer</h5>
          <ul class="nav">
            <li class="nav-item">
              <button class="btn btn-primary" onClick={this.onAddActivityFromToolbarClick}><i class="fas fa-plus"/> Add Activity</button>
            </li>
          </ul>
        </div>
        <div class="d-flex flex-column flex-fill">
          <elsa-designer container={this.container} workflow={workflow} activityDefinitions={this.activityDefinitions} ref={el => this.designer = el}/>
          <elsa-notifications notifications={this.notifications}/>
          <elsa-activity-picker
            container={this.container}
            activityDefinitions={this.activityDefinitions}
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
          <elsa-workflow-picker container={this.container} showModal={this.showWorkflowPicker} onHidden={() => this.showWorkflowPicker = false}/>
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
            <ul class="list-unstyled">
              <li><span class="badge badge-primary">3</span> suspended</li>
              <li><span class="badge badge-warning">3</span> faulted</li>
              <li><span class="badge badge-success">3</span> completed</li>
            </ul>
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
  }

}
