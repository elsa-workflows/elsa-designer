import 'bs-components';
import {Component, h, Host, Listen, Method, Prop, State} from '@stencil/core';
import {Activity, ActivityDefinition, Workflow} from '../../models';
import {AddActivityArgs, EditActivityArgs} from '../designer/designer';
import uuid from 'uuid-browser/v4';
import {Container} from "inversify";
import {ActivityDefinitionStore, ActivityDriver, CustomDriverStore, ActivityDisplayManager, FieldDriver, Symbols, WorkflowStore, ServerConfiguration} from '../../services';
import {CommonDriver, DynamicPropsDriver, WriteLineDriver} from '../../drivers/activity-drivers';
import {ActivityUpdatedArgs} from '../activity-editor/activity-editor';
import {ExpressionDriver, TextDriver} from '../../drivers/field-drivers';
import {FieldDisplayManager} from "../../services/field-display-manager";
import {ExpressionTypeStore} from "../../services/expression-type-store";
import {createContainer} from "../../services/container";


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

  constructor() {

  }

  @Prop({attribute: 'server-url'}) serverUrl: string;

  @State() container: Container;
  @State() activityDefinitions: Array<ActivityDefinition>;
  @State() workflow: Workflow | string;
  @State() private showActivityPicker: boolean;
  @State() private showActivityEditor: boolean;
  @State() private selectedActivity?: Activity;

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

  @Listen('add-activity')
  handleDesignerAddActivity(e: CustomEvent<AddActivityArgs>) {
    const x = e.detail.mouseEvent.x;
    const y = e.detail.mouseEvent.y;
    this.lastClickedLocation = {x, y};
    this.showActivityPicker = true;
  }

  @Listen('edit-activity')
  async handleDesignerEditActivity(e: CustomEvent<EditActivityArgs>) {
    const activityId = e.detail.activityId;
    this.selectedActivity = await this.designer.getActivity(activityId);
    this.showActivityEditor = true;
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

  async componentWillLoad() {
    const serverUrl = this.serverUrl;
    const container = createContainer(serverUrl);

    this.container = container;
    this.workflowStore = container.get<WorkflowStore>(WorkflowStore);
    this.activityDefinitionStore = container.get<ActivityDefinitionStore>(ActivityDefinitionStore);
    this.customDriverStore = container.get<CustomDriverStore>(CustomDriverStore);
    this.activityDefinitions = await this.activityDefinitionStore.list();
    this.workflow = await this.workflowStore.get('1');
  }

  private addActivityDriverInternal = (container: Container, constructor: { new(...args: any[]): ActivityDriver }) => container.bind<ActivityDriver>(Symbols.ActivityDriver).to(constructor).inSingletonScope();
  private addFieldDriverInternal = (container: Container, constructor: { new(...args: any[]): FieldDriver }) => container.bind<FieldDriver>(Symbols.FieldDriver).to(constructor).inSingletonScope();

  render() {
    return (
      <Host>
        <elsa-designer container={this.container} workflow={this.workflow} activityDefinitions={this.activityDefinitions} ref={el => this.designer = el}/>
        <elsa-activity-picker
          container={this.container}
          activityDefinitions={this.activityDefinitions}
          showModal={this.showActivityPicker}
          onHidden={() => this.showActivityPicker = false}
        />
        <elsa-activity-editor
          container={this.container}
          activity={this.selectedActivity}
          showModal={this.showActivityEditor}
          onHidden={() => this.showActivityEditor = false}
        />
      </Host>
    );
  }

}
