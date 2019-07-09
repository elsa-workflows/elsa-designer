import {Component, Prop} from '@stencil/core';
import activityDefinitionStore from '../../../../services/activity-definition-store';
import { Activity, ActivityDefinition} from "../../../../models";

@Component({
  tag: 'wf-log',
  shadow: true
})
export class Log implements ActivityDefinition {

  @Prop({reflect: true})
  type: string = "Log";

  @Prop({reflect: true})
  displayName: string = "Log";

  @Prop({reflect: true})
  description: string = "Log a message.";

  @Prop({reflect: true})
  category: string = "Primitives";

  public componentWillLoad() {
    activityDefinitionStore.addActivity(this);
  }

  getOutcomes(_: Activity): string[] {
    return ['Done'];
  }

  properties = [{
    name: 'message',
    type: 'text',
    label: 'Message',
    hint: 'The text to log.'
  }];
}
