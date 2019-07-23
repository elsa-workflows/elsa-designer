import { Component, Prop } from '@stencil/core';
import { Store } from "@stencil/redux";
import { RootState } from "../../../../redux/reducers";
import { Action, addActivityDefinition } from "../../../../redux/actions";
import { ComponentHelper } from "../../../../utils/ComponentHelper";
import { OutcomeNames } from "../../../../models/outcome-names";

@Component({
  tag: 'wf-write-line',
  shadow: true
})
export class WriteLine {

  @Prop({ context: 'store' })
  store: Store<RootState, Action>;

  @Prop({ reflect: true })
  type: string = "WriteLine";

  @Prop({ reflect: true })
  displayName: string = "Write Line";

  @Prop({ reflect: true })
  description: string = "Write text to standard out.";

  @Prop({ reflect: true })
  category: string = "Console";

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
          name: 'textExpression',
          type: 'expression',
          label: 'Text',
          hint: 'The text to write.'
        }],
        designer: {
          description: `x => !!x.state.textExpression ? \`Write <strong>\${ x.state.textExpression.expression }</strong> to standard out.\` : x.definition.description`,
          outcomes: [OutcomeNames.Done]
        }
      }
    );
  }
}
