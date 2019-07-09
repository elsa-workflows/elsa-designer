import { Component, Prop } from '@stencil/core';
import activityDefinitionStore from '../../../../services/activity-definition-store';
import { Activity, ActivityDefinition } from "../../../../models";

@Component({
  tag: 'wf-receive-masstransit-message',
  shadow: true
})
export class ReceiveMassTransitMessage implements ActivityDefinition {

  @Prop({ reflect: true })
  type: string = 'ReceiveMassTransitMessage';

  @Prop({ reflect: true })
  displayName: string = 'Receive Message';

  @Prop({ reflect: true })
  description: string = 'Receive a message via MassTransit.';

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
    hint: 'The assembly-qualified type name of the message to receive.'
  }];
}
