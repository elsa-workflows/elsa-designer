import { OutcomeNames } from "../models/outcome-names";
import { WorkflowPlugin } from "../models";
import { ActivityDefinition } from "../models";
import pluginStore from '../services/workflow-plugin-store';

export class ConsoleActivities implements WorkflowPlugin {
  private static readonly Category: string = "Console";

  getActivityDefinitions = (): Array<ActivityDefinition> => ([this.readLine(), this.writeLine()]);

  private readLine = (): ActivityDefinition => ({
    type: "ReadLine",
    displayName: "Read Line",
    description: "Read text from standard in.",
    category: ConsoleActivities.Category,
    properties: [{
      name: 'variableName',
      type: 'text',
      label: 'Variable Name',
      hint: 'The name of the variable to store the value into.'
    }],
    designer: {
      description: 'a => !!a.state.variableName ? `Read text from standard in and store into <strong>${ a.state.variableName }</strong>.` : \'Read text from standard in.\'',
      outcomes: [OutcomeNames.Done]
    }
  });

  private writeLine = (): ActivityDefinition => ({
    type: "WriteLine",
    displayName: "Write Line",
    description: "Write text to standard out.",
    category: ConsoleActivities.Category,
    properties: [{
      name: 'textExpression',
      type: 'expression',
      label: 'Text',
      hint: 'The text to write.'
    }],
    designer: {
      description: `x => !!x.state.textExpression ? \`Write <strong>\${ x.state.textExpression.expression }</strong> to standard out.\` : x.definition.description`,
      outcomes: [OutcomeNames.Done]
    }
  });
}

pluginStore.add(new ConsoleActivities());
