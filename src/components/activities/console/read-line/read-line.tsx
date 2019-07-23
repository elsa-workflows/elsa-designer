import { Component, Prop } from '@stencil/core';
import { Store } from "@stencil/redux";
import { Action, addActivityDefinition } from "../../../../redux/actions";
import { RootState } from "../../../../redux/reducers";
import { ComponentHelper } from "../../../../utils/ComponentHelper";
import { OutcomeNames } from "../../../../models/outcome-names";

@Component({
  tag: 'wf-read-line',
  shadow: true
})
export class ReadLine {

  @Prop({ context: 'store' })
  store: Store<RootState, Action>;

  @Prop({ reflect: true })
  type: string = "ReadLine";

  @Prop({ reflect: true, attr: 'display-name' })
  displayName: string = "Read Line";

  @Prop({ reflect: true })
  description: string = "Read text from standard in.";

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
          name: 'variableName',
          type: 'text',
          label: 'Variable Name',
          hint: 'The name of the variable to store the value into.'
        }],
        designer: {
          description: 'a => !!a.state.variableName ? `Read text from standard in and store into <strong>${ variableName }</strong>.` : \'Read text from standard in.\'',
          outcomes: [OutcomeNames.Done]
        }
      }
    );
  }
}
