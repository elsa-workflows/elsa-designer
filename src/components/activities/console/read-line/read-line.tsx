import { Component, Prop } from '@stencil/core';
import activityDefinitionStore from '../../../../services/activity-definition-store';
import { Activity, ActivityDefinition} from "../../../../models";

@Component({
  tag: 'wf-read-line',
  shadow: true
})
export class ReadLine implements ActivityDefinition {

  @Prop({ reflect: true })
  type: string = "ReadLine";

  @Prop({reflect: true, attribute: 'display-name'})
  displayName: string = "Read Line";

  @Prop({ reflect: true })
  description: string = "Read text from standard in.";

  @Prop({ reflect: true })
  category: string = "Console";

  properties = [{
    name: 'variableName',
    type: 'text',
    label: 'Variable Name',
    hint: 'The name of the variable to store the value into.'
  }];

  public componentDidLoad() {
    activityDefinitionStore.addActivity(this);
  }

  getOutcomes(_: Activity): string[] {
    return ['Done'];
  }
}
