import { Component, Prop } from '@stencil/core';
import activityDefinitionStore from '../../../../services/activity-definition-store';
import { Activity, ActivityDefinition } from "../../../../models";

@Component({
  tag: 'wf-send-masstransit-message',
  shadow: true
})
export class SendMassTransitMessage implements ActivityDefinition {

  @Prop({ reflect: true })
  type: string = 'SendMassTransitMessage';

  @Prop({ reflect: true })
  displayName: string = 'Send Message';

  @Prop({ reflect: true })
  description: string = 'Send a message via MassTransit.';

  @Prop({ reflect: true })
  category: string = 'MassTransit';

  public componentDidLoad() {
    activityDefinitionStore.addActivity(this);
  }

  getOutcomes(_: Activity): string[] {
    return ['Done'];
  }

  properties = [{
    name: 'messageType',
    type: 'text',
    label: 'Message Type',
    hint: 'The assembly-qualified type name of the message to send.'
  },
    {
      name: 'message',
      type: 'workflow-expression',
      label: 'Message',
      hint: 'An expression that evaluates to the message to send.'
    }];
}
