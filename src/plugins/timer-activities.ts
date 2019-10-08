import { OutcomeNames } from "../models/outcome-names";
import { WorkflowPlugin } from "../models";
import { ActivityDefinition } from "../models";
import pluginStore from '../services/workflow-plugin-store';

export class TimerActivities implements WorkflowPlugin {
  private static readonly Category: string = "Timers";

  getName = (): string => "TimerActivities";
  getActivityDefinitions = (): Array<ActivityDefinition> => ([this.timerEvent()]);

  private timerEvent = (): ActivityDefinition => ({
    type: "TimerEvent",
    displayName: "Timer Event",
    description: "Triggers after a specified amount of time.",
    category: TimerActivities.Category,
    icon: 'fas fa-hourglass-start',
    properties: [
      {
        name: 'expression',
        type: 'expression',
        label: 'Timeout Expression',
        hint: 'The amount of time to wait before this timer event is triggered. Format: \'d.HH:mm:ss\'.'
      }],
    designer: {
      description: 'x => !!x.state.expression ? `Triggers after <strong>${ x.state.expression.expression }</strong>` : x.definition.description',
      outcomes: [OutcomeNames.Done]
    }
  });
}

pluginStore.add(new TimerActivities());
