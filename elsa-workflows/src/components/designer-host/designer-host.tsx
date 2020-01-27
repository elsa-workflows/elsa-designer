import {Component, Host, h, State, Listen, Prop, Watch} from '@stencil/core';
import {Activity, ActivityDefinition, Workflow} from "../../models";
import {AddActivityArgs, EditActivityArgs} from "../designer/designer";
import uuid from 'uuid-browser/v4';
import 'bs-components';

@Component({
  tag: 'elsa-designer-host',
  styleUrl: 'designer-host.scss',
  scoped: true
})
export class DesignerHostComponent {

  private designer: HTMLElsaDesignerElement;
  private lastClickedLocation: { x: number, y: number } = {x: 150, y: 150};

  @Prop() activityDefinitions: Array<ActivityDefinition>;
  @Prop() workflow: Workflow | string;

  @State() private workflowModel: Workflow;
  @State() private showActivityPicker: boolean;

  @Watch('workflow')
  workflowHandler(newValue: Workflow | string) {
    this.workflowModel = this.parseWorkflow(newValue);
  }

  @Listen('add-activity')
  handleAddActivity(e: CustomEvent<AddActivityArgs>) {
    const x = e.detail.mouseEvent.x;
    const y = e.detail.mouseEvent.y;
    this.lastClickedLocation = {x, y};
    this.showActivityPicker = true;
  }

  @Listen('edit-activity')
  handleEditActivity(e: CustomEvent<EditActivityArgs>) {
    alert(`Show Activity Editor for ${e.detail.activityId}`);
  }

  @Listen('activity-selected')
  async handleActivitySelected(e: CustomEvent<ActivityDefinition>) {
    const activityDefinition = e.detail;
    const transform = await this.designer.getTransform();
    const left = (this.lastClickedLocation.x / transform.scale) - (transform.x / transform.scale);
    const top = (this.lastClickedLocation.y / transform.scale) - (transform.y / transform.scale);

    const activity: Activity = {
      type: activityDefinition.type,
      displayName: activityDefinition.displayName,
      id: uuid(),
      left: left,
      top: top,
      state: {}
    };

    await this.designer.addActivity(activity);
  }

  componentWillLoad() {
    this.workflowModel = this.parseWorkflow(this.workflow);
  }

  private parseWorkflow = (value: Workflow | string): Workflow =>
    !!value ? value instanceof String ? JSON.parse(value as string) : value as Workflow : null;

  render() {
    return (
      <Host>
        <elsa-designer workflow={this.workflowModel} activityDefinitions={this.activityDefinitions} ref={el => this.designer = el}/>
        <elsa-activity-picker
          activityDefinitions={this.activityDefinitions}
          showModal={this.showActivityPicker}
          onHidden={() => this.showActivityPicker = false}
        />
      </Host>
    );
  }

}
