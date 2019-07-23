import { Component, Prop } from '@stencil/core';
import { Store } from "@stencil/redux";
import { RootState } from "../../../../redux/reducers";
import { Action, addActivityDefinition } from "../../../../redux/actions";
import { ComponentHelper } from "../../../../utils/ComponentHelper";

@Component({
  tag: 'wf-switch',
  shadow: true
})
export class Switch {

  @Prop({ context: 'store' })
  store: Store<RootState, Action>;

  @Prop({ reflect: true })
  type: string = 'Switch';

  @Prop({ reflect: true })
  displayName: string = 'Switch';

  @Prop({ reflect: true })
  description: string = 'Switch execution based on a given expression.';

  @Prop({ reflect: true })
  category: string = 'Control Flow';

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
      }
    );
  }
}
