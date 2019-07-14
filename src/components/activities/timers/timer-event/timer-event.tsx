import { Component, Prop } from '@stencil/core';
import { Activity } from "../../../../models";
import { Store } from "@stencil/redux";
import { RootState } from "../../../../redux/reducers";
import { Action, addActivityDefinition } from "../../../../redux/actions";

@Component({
  tag: 'wf-timer-event',
  shadow: true
})
export class TimerEvent {

  @Prop({ context: 'store' })
  store: Store<RootState, Action>;

  @Prop({ reflect: true })
  type: string = "TimerEvent";

  @Prop({ reflect: true })
  displayName: string = "Timer";

  @Prop({ reflect: true })
  description: string = "Triggers after a specified amount of time.";

  @Prop({ reflect: true })
  category: string = "Timers";

  addActivityDefinition!: typeof addActivityDefinition;

  componentWillLoad() {
    this.store.mapDispatchToProps(this, { addActivityDefinition });
  }

  componentDidLoad() {
    this.addActivityDefinition({
        type: this.type,
        displayName: this.displayName,
        description: this.description,
        category: this.category,
        properties: [
          {
            name: 'timeoutExpression',
            type: 'workflow-expression',
            label: 'Timeout Expression',
            hint: 'The amount of time to wait before this timer event is triggered. Format: \'d.HH:mm:ss\'.',
            defaultValue: () => '00:05:00'
          }],
        getOutcomes: (_: Activity): string[] => {
          return ['Done'];
        }
      }
    );
  }
}
