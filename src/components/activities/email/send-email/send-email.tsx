import { Component, Prop } from '@stencil/core';
import activityDefinitionStore from '../../../../services/activity-definition-store';
import { Activity, ActivityDefinition } from "../../../../models";

@Component({
  tag: 'wf-send-email',
  shadow: true
})
export class SendEmail implements ActivityDefinition {

  @Prop({ reflect: true })
  type: string = "SendEmail";

  @Prop({ reflect: true })
  displayName: string = "Send Email";

  @Prop({ reflect: true })
  description: string = "Send an email message.";

  @Prop({ reflect: true })
  category: string = "Email";

  public componentDidLoad() {
    activityDefinitionStore.addActivity(this);
  }

  getOutcomes(_: Activity): string[] {
    return ['Done'];
  }

  properties = [
    {
      name: 'from',
      type: 'workflow-expression',
      label: 'From',
      hint: 'The sender\'s email address'
    },
    {
      name: 'to',
      type: 'workflow-expression',
      label: 'To',
      hint: 'The recipient\'s email address'
    },
    {
      name: 'subject',
      type: 'workflow-expression',
      label: 'Subject',
      hint: 'The subject of the email message.'
    },
    {
      name: 'body',
      type: 'workflow-expression',
      label: 'Body',
      hint: 'The body of the email message.'
    }];
}
