import 'bs-components';
import '../../utils/array-utils';
import {Component, h, Host, Listen, Method, Prop, State} from '@stencil/core';
import {Activity, ActivityDefinition, Workflow} from '../../models';
import uuid from 'uuid-browser/v4';
import {Container} from "inversify";
import {ActivityDefinitionStore, ActivityDriver, CustomDriverStore, FieldDriver, Symbols, WorkflowStore} from '../../services';
import {ActivityUpdatedArgs} from '../activity-editor/activity-editor';
import {createContainer} from "../../services/container";
import {WorkflowDefinitionVersionSelectedArgs} from "../workflow-picker/workflow-picker";
import {Notification, NotificationType} from "../notifications/models";
import {ActivityArgs, WorkflowArgs} from "../designer/models";

@Component({
  tag: 'elsa-designer-host',
  styleUrl: 'designer-host.scss',
  scoped: true
})
export class DesignerHostComponent {

  private designer: HTMLElsaDesignerElement;
  private lastClickedLocation: { x: number, y: number } = {x: 150, y: 150};
  private workflowStore: WorkflowStore;
  private activityDefinitionStore: ActivityDefinitionStore;
  private customDriverStore: CustomDriverStore;
  private workflowContextMenu: HTMLElsaContextMenuElement;
  private activityContextMenu: HTMLElsaContextMenuElement;

  @Prop({attribute: 'server-url'}) serverUrl: string;

  @State() private container: Container;
  @State() private activityDefinitions: Array<ActivityDefinition>;
  @State() private workflow: Workflow | string;
  @State() private activityPickerIsVisible: boolean;
  @State() private showActivityEditor: boolean;
  @State() private selectedActivity?: Activity;
  @State() private showWorkflowPicker: boolean;
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

  private saveWorkflow = async (publish: boolean) => {
    let workflow = await this.designer.getWorkflow();

    workflow = this.workflow = await this.workflowStore.save(workflow, publish);
    const message = publish ? `Workflow published as version ${workflow.version}` : `Workflow saved as draft version ${workflow.version}`;
    const title = publish ? 'Published' : 'Saved as Draft';
    const notification: Notification = {title, message, type: NotificationType.Success};

    this.notifications = [notification];
  };

  private onWorkflowContextMenu = async (e: MouseEvent) => await this.workflowContextMenu.show(e);
  private onActivityContextMenu = async (e: MouseEvent, activity: Activity) => await this.activityContextMenu.show(e, activity);
  private deleteActivity = async (id: string) => await this.designer.deleteActivity(id);
  private addActivityDriverInternal = (container: Container, constructor: { new(...args: any[]): ActivityDriver }) => container.bind<ActivityDriver>(Symbols.ActivityDriver).to(constructor).inSingletonScope();
  private addFieldDriverInternal = (container: Container, constructor: { new(...args: any[]): FieldDriver }) => container.bind<FieldDriver>(Symbols.FieldDriver).to(constructor).inSingletonScope();
  private onEditActivityClick = async () => this.editActivity((await this.activityContextMenu.getContext() as Activity).id);
  private onActivityDoubleClick = (id: string) => this.editActivity(id);
  private onDeleteActivityClick = async () => this.deleteActivity((await this.activityContextMenu.getContext() as Activity).id);
  private onLoadWorkflowClick = () => this.showWorkflowPicker = true;
  private onSaveDraftClick = () => this.saveWorkflow(false);
  private onPublishClick = () => this.saveWorkflow(true);

  render() {
    return (
      <Host>
        <elsa-designer container={this.container} workflow={this.workflow} activityDefinitions={this.activityDefinitions} ref={el => this.designer = el}/>
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
        <elsa-workflow-picker container={this.container} showModal={this.showWorkflowPicker} onHidden={() => this.showWorkflowPicker = false}/>
        <elsa-context-menu ref={el => this.workflowContextMenu = el}>
          <elsa-context-menu-item onClick={this.onAddActivityClick}>Add Activity</elsa-context-menu-item>
          <elsa-context-menu-item onClick={this.onLoadWorkflowClick}>Load Workflow</elsa-context-menu-item>
          <elsa-context-menu-item onClick={this.onSaveDraftClick}>Save Draft</elsa-context-menu-item>
          <elsa-context-menu-item onClick={this.onPublishClick}>Publish</elsa-context-menu-item>
        </elsa-context-menu>
        <elsa-context-menu ref={el => this.activityContextMenu = el}>
          <elsa-context-menu-item onClick={this.onEditActivityClick}>Edit Activity</elsa-context-menu-item>
          <elsa-context-menu-item onClick={this.onDeleteActivityClick}>Delete Activity</elsa-context-menu-item>
        </elsa-context-menu>
      </Host>
    );
  }

}
