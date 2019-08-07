import { OutcomeNames } from "../models/outcome-names";
import { WorkflowPlugin } from "../models";
import { ActivityDefinition } from "../models";
import pluginStore from '../services/workflow-plugin-store';

export class EmailActivities implements WorkflowPlugin {
  private static readonly Category: string = "Email";

  getActivityDefinitions = (): Array<ActivityDefinition> => ([this.sendEmail()]);

  private sendEmail = (): ActivityDefinition => ({
    type: "SendEmail",
    displayName: "Send Email",
    description: "Send an email message.",
    category: EmailActivities.Category,
    properties: [
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
      }],
    designer: {
      outcomes: [OutcomeNames.Done]
    }
  });
}

pluginStore.add(new EmailActivities());
