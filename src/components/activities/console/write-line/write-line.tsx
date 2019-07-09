import {Component, Element, Prop} from '@stencil/core';
import activityDefinitionStore from '../../../../services/activity-definition-store';
import { Activity, ActivityDefinition } from "../../../../models";

@Component({
  tag: 'wf-write-line',
  shadow: true
})
export class WriteLine implements ActivityDefinition {

  @Element()
  el: HTMLElement;

  @Prop({reflect: true})
  type: string = "WriteLine";

  @Prop({reflect: true})
  displayName: string = "Write Line";

  @Prop({reflect: true})
  description: string = "Write text to standard out";

  @Prop({reflect: true})
  category: string = "Console";

  properties = [{
    name: 'textExpression',
    type: 'text',
    label: 'Text',
    hint: 'The text to write.'
  }];

  public componentDidLoad() {
    activityDefinitionStore.addActivity(this);
  }

  getOutcomes(_: Activity): string[] {
    return ['Done'];
  }
}
