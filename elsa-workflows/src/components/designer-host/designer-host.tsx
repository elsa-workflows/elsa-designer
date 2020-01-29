import 'bs-components';
import "reflect-metadata";
import {Component, Host, h, State, Listen, Prop, Watch} from '@stencil/core';
import {Activity, ActivityDefinition, Workflow} from "../../models";
import {AddActivityArgs, EditActivityArgs} from "../designer/designer";
import uuid from 'uuid-browser/v4';
import {Container} from "inversify";
import {ActivityDriver, Symbols} from "../../services";
import {WriteLineDriver} from "../../drivers/activity-drivers/write-line-driver";


@Component({
  tag: 'elsa-designer-host',
  styleUrl: 'designer-host.scss',
  scoped: true
})
export class DesignerHostComponent {

  private designer: HTMLElsaDesignerElement;
  private lastClickedLocation: { x: number, y: number } = {x: 150, y: 150};

  constructor() {
    this.container = new Container();
    this.container.bind<ActivityDriver>(Symbols.ActivityDriver).to(WriteLineDriver);
  }

  @Prop() container: Container;
  @Prop() activityDefinitions: Array<ActivityDefinition>;
  @Prop() workflow: Workflow | string;

  @State() private showActivityPicker: boolean;
  @State() private showActivityEditor: boolean;
  @State() private selectedActivity?: Activity;
  @State() private selectedActivityDefinition?: ActivityDefinition;

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
    this.selectedActivityDefinition = this.activityDefinitions.find(x => x.type === this.selectedActivity.type);
    this.showActivityEditor = true;
  }

  @Listen('activity-selected')
  async handleActivityPickerSelected(e: CustomEvent<ActivityDefinition>) {
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
          activityDefinition={this.selectedActivityDefinition}
          activity={this.selectedActivity}
          showModal={this.showActivityEditor}
          onHidden={() => this.showActivityEditor = false}
        />
      </Host>
    );
  }

}
