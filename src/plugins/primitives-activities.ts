import { OutcomeNames } from "../models/outcome-names";
import { WorkflowPlugin } from "../models";
import { ActivityDefinition } from "../models";
import pluginStore from '../services/workflow-plugin-store';

export class PrimitiveActivities implements WorkflowPlugin {
  private static readonly Category: string = "Primitives";

  getName = (): string => "PrimitiveActivities";
  getActivityDefinitions = (): Array<ActivityDefinition> => ([this.log(), this.setVariable()]);

  private log = (): ActivityDefinition => ({
    type: "Log",
    displayName: "Log",
    description: "Log a message.",
    category: PrimitiveActivities.Category,
    properties: [{
      name: 'message',
      type: 'text',
      label: 'Message',
      hint: 'The text to log.'
    },
      {
        name: 'logLevel',
        type: 'text',
        label: 'Log Level',
        hint: 'The log level to use.'
      }],
    designer: {
      description: 'x => !!x.state.message ? `Log <strong>${x.state.logLevel}: ${x.state.message}</strong>` : x.definition.description',
      outcomes: [OutcomeNames.Done]
    }
  });

  private setVariable = (): ActivityDefinition => ({
    type: "SetVariable",
    displayName: "Set Variable",
    description: "Set a variable on the workflow.",
    category: PrimitiveActivities.Category,
    properties: [{
      name: 'variableName',
      type: 'text',
      label: 'Variable Name',
      hint: 'The name of the variable to store the value into.'
    }, {
      name: 'expression',
      type: 'expression',
      label: 'Variable Expression',
      hint: 'An expression that evaluates to the value to store in the variable.'
    }],
    designer: {
      description: 'x => !!x.state.variableName ? `${x.state.expression.syntax}: <strong>${x.state.variableName}</strong> = <strong>${x.state.expression.expression}</strong>` : x.definition.description',
      outcomes: [OutcomeNames.Done]
    }
  });
}

pluginStore.add(new PrimitiveActivities());
