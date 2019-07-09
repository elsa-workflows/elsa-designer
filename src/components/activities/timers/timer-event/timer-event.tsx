import { Component, Prop } from '@stencil/core';
import activityDefinitionStore from '../../../../services/activity-definition-store';
import { Activity, ActivityDefinition } from "../../../../models";

@Component({
  tag: 'wf-timer-event',
  shadow: true
})
export class TimerEvent implements ActivityDefinition {

  @Prop({ reflect: true })
  type: string = "TimerEvent";

  @Prop({ reflect: true })
  displayName: string = "Timer";

  @Prop({ reflect: true })
  description: string = "Triggers after a specified amount of time.";

  @Prop({ reflect: true })
  category: string = "Timers";

  public componentDidLoad() {
    activityDefinitionStore.addActivity(this);
  }

  getOutcomes(_: Activity): string[] {
    return ['Done'];
  }

  properties = [
    {
      name: 'timeoutExpression',
      type: 'workflow-expression',
      label: 'Timeout Expression',
      hint: 'The amount of time to wait before this timer event is triggered. Format: \'d.HH:mm:ss\'.',
      defaultValue: () => '00:05:00'
    }];
}
