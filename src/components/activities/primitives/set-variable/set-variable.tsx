import { Component, Element, Prop } from '@stencil/core';
import activityDefinitionStore from '../../../../services/activity-definition-store';
import { Activity, ActivityDefinition} from "../../../../models";

@Component({
  tag: 'wf-set-variable',
  shadow: true
})
export class SetVariable implements ActivityDefinition {

  @Element()
  el: HTMLElement;

  @Prop({ reflect: true })
  type: string = "SetVariable";

  @Prop({ reflect: true })
  displayName: string = "Set Variable";

  @Prop({ reflect: true })
  description: string = "Set a variable on the workflow";

  @Prop({ reflect: true })
  category: string = "Primitives";

  public componentDidLoad() {
    activityDefinitionStore.addActivity(this);
  }

  getOutcomes(_: Activity): string[] {
    return ['Done'];
  }

  properties = [{
    name: 'variableName',
    type: 'text',
    label: 'Variable Name',
    hint: 'The name of the variable to store the value into.'
  }, {
    name: 'variableExpression',
    type: 'text',
    label: 'Variable Expression',
    hint: 'An expression that evaluates to the value to store in the variable.'
  }];
}
