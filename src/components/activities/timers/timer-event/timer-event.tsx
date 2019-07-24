import { Component, Prop } from '@stencil/core';
import { Store } from "@stencil/redux";
import { RootState } from "../../../../redux/reducers";
import { Action, addActivityDefinition } from "../../../../redux/actions";
import { ComponentHelper } from "../../../../utils/ComponentHelper";
import { OutcomeNames } from "../../../../models/outcome-names";

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

  async componentWillLoad() {
    await ComponentHelper.rootComponentReady();
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
            name: 'expression',
            type: 'expression',
            label: 'Timeout Expression',
            hint: 'The amount of time to wait before this timer event is triggered. Format: \'d.HH:mm:ss\'.'
          }],
        designer: {
          description: 'x => !!x.state.expression ? `Triggers after <strong>${ x.state.expression.expression }</strong>` : x.definition.description',
          outcomes: [OutcomeNames.Done]
        }
      }
    );
  }
}
