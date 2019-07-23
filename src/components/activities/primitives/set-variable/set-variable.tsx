import { Component, Prop } from '@stencil/core';
import { Store } from "@stencil/redux";
import { RootState } from "../../../../redux/reducers";
import { Action, addActivityDefinition } from "../../../../redux/actions";
import { ComponentHelper } from "../../../../utils/ComponentHelper";
import { OutcomeNames } from "../../../../models/outcome-names";

@Component({
  tag: 'wf-set-variable',
  shadow: true
})
export class SetVariable {

  @Prop({ context: 'store' })
  store: Store<RootState, Action>;

  @Prop({ reflect: true })
  type: string = "SetVariable";

  @Prop({ reflect: true })
  displayName: string = "Set Variable";

  @Prop({ reflect: true })
  description: string = "Set a variable on the workflow.";

  @Prop({ reflect: true })
  category: string = "Primitives";

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
          outcomes: [OutcomeNames.Done]
        }
      }
    );
  }
}
