import { OutcomeNames } from "../models/outcome-names";
import { WorkflowPlugin } from "../models";
import { ActivityDefinition } from "../models";
import pluginStore from '../services/workflow-plugin-store';

export class ControlFlowActivities implements WorkflowPlugin {
  private static readonly Category: string = "Control Flow";

  getName = (): string => "ControlFlowActivities";
  getActivityDefinitions = (): Array<ActivityDefinition> => ([
    this.fork(),
    this.ifElse(),
    this.join(),
    this.switch()
  ]);

  private fork = (): ActivityDefinition => ({
    type: "Fork",
    displayName: "Fork",
    description: "Fork workflow execution into multiple branches.",
    category: ControlFlowActivities.Category,
    icon: 'fas fa-code-branch fa-rotate-180',
    properties: [{
      name: 'branches',
      type: 'list',
      label: 'Branches',
      hint: 'Enter one or more names representing branches, separated with a comma. Example: Branch 1, Branch 2'
    }],
    designer: {
      outcomes: 'x => x.state.branches'
    }
  });

  private ifElse = (): ActivityDefinition => ({
    type: "IfElse",
    displayName: "If/Else",
    description: "Evaluate a Boolean expression and continue execution depending on the result.",
    category: ControlFlowActivities.Category,

    properties: [{
      name: 'expression',
      type: 'expression',
      label: 'Expression',
      hint: 'The expression to evaluate. The evaluated value will be used to switch on.'
    }],
    designer: {
      description: 'x => !!x.state.expression ? `Evaluate <strong>${ x.state.expression.expression }</strong> and continue execution depending on the result.` : x.definition.description',
      outcomes: [OutcomeNames.True, OutcomeNames.False]
    }
  });

  private join = (): ActivityDefinition => ({
    type: "Join",
    displayName: "Join",
    description: "Merge workflow execution back into a single branch.",
    category: ControlFlowActivities.Category,
    icon: 'fas fa-code-branch',
    properties: [{
      name: 'joinMode',
      type: 'text',
      label: 'Join Mode',
      hint: 'Either \'WaitAll\' or \'WaitAny\''
    }],
    designer: {
      description: 'x => !!x.state.joinMode ? `Merge workflow execution back into a single branch using mode <strong>${ x.state.joinMode }</strong>` : x.definition.description',
      outcomes: [OutcomeNames.Done]
    }
  });

  private switch = (): ActivityDefinition => ({
    type: "Switch",
    displayName: "Switch",
    description: "Switch execution based on a given expression.",
    category: ControlFlowActivities.Category,
    icon: 'far fa-list-alt',
    properties: [{
      name: 'expression',
      type: 'expression',
      label: 'Expression',
      hint: 'The expression to evaluate. The evaluated value will be used to switch on.'
    },
      {
        name: 'cases',
        type: 'list',
        label: 'Cases',
        hint: 'A comma-separated list of possible outcomes of the expression.'
      }],
    designer: {
      description: 'x => !!x.state.expression ? `Switch execution based on <strong>${ x.state.expression.expression }</strong>.` : x.definition.description',
      outcomes: 'x => x.state.cases.map(c => c.toString())'
    }
  });
}

pluginStore.add(new ControlFlowActivities());
