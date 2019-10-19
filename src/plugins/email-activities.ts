import { OutcomeNames } from "../models/outcome-names";
import { WorkflowPlugin } from "../models";
import { ActivityDefinition } from "../models";
import pluginStore from '../services/workflow-plugin-store';

export class EmailActivities implements WorkflowPlugin {
  private static readonly Category: string = "Email";

  getName = (): string => "EmailActivities";
  getActivityDefinitions = (): Array<ActivityDefinition> => ([this.sendEmail()]);

  private sendEmail = (): ActivityDefinition => ({
    type: "SendEmail",
    displayName: "Send Email",
    description: "Send an email message.",
    category: EmailActivities.Category,
    icon: 'far fa-envelope',
    properties: [
      {
        name: 'from',
        type: 'expression',
        label: 'From',
        hint: 'The sender\'s email address'
      },
      {
        name: 'to',
        type: 'expression',
        label: 'To',
        hint: 'The recipient\'s email address'
      },
      {
        name: 'subject',
        type: 'expression',
        label: 'Subject',
        hint: 'The subject of the email message.'
      },
      {
        name: 'body',
        type: 'expression',
        label: 'Body',
        hint: 'The body of the email message.',
        options: {
          multiline: true
        }
      }],
    designer: {
      outcomes: [OutcomeNames.Done]
    }
  });
}

pluginStore.add(new EmailActivities());
