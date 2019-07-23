import { Component, Prop } from '@stencil/core';
import { Activity } from "../../../../models";
import { Store } from "@stencil/redux";
import { RootState } from "../../../../redux/reducers";
import { Action, addActivityDefinition } from "../../../../redux/actions";
import { ComponentHelper } from "../../../../utils/ComponentHelper";
import { OutcomeNames } from "../../../../models/outcome-names";

@Component({
  tag: 'wf-if-else',
  shadow: true
})
export class IfElse {

  @Prop({ context: 'store' })
  store: Store<RootState, Action>;

  @Prop({ reflect: true })
  type: string = 'IfElse';

  @Prop({ reflect: true })
  displayName: string = 'If/Else';

  @Prop({ reflect: true })
  description: string = 'Evaluate a Boolean expression and continue execution depending on the result.';

  @Prop({ reflect: true })
  category: string = 'Control Flow';

  addActivityDefinition!: typeof addActivityDefinition;

  static updateEditor(activity: Activity, formData: FormData): Activity {
    const newState = { ...activity.state };

    newState.expression = formData.get('expression');

    return { ...activity, state: newState };
  }

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
      }
    );
  }
}
