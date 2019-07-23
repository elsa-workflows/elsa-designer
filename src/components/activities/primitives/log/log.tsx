import { Component, Prop } from '@stencil/core';
import { Store } from "@stencil/redux";
import { RootState } from "../../../../redux/reducers";
import { Action, addActivityDefinition } from "../../../../redux/actions";
import { ComponentHelper } from "../../../../utils/ComponentHelper";
import { OutcomeNames } from "../../../../models/outcome-names";

@Component({
  tag: 'wf-log',
  shadow: true
})
export class Log {

  @Prop({ context: 'store' })
  store: Store<RootState, Action>;

  @Prop({ reflect: true })
  type: string = "Log";

  @Prop({ reflect: true })
  displayName: string = "Log";

  @Prop({ reflect: true })
  description: string = "Log a message.";

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
          name: 'message',
          type: 'text',
          label: 'Message',
          hint: 'The text to log.'
        }],
        designer: {
          description: 'x => !!x.state.message ? `Log <strong>${x.state.message}</strong>` : x.definition.description',
          outcomes: [OutcomeNames.Done]
        }
      }
    );
  }
}
