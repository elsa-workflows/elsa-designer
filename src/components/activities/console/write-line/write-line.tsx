import { Component, Prop } from '@stencil/core';
import { Activity } from "../../../../models";
import { Store } from "@stencil/redux";
import { RootState } from "../../../../redux/reducers";
import { Action, addActivityDefinition } from "../../../../redux/actions";

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

  componentWillLoad() {
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
          type: 'text',
          label: 'Text',
          hint: 'The text to write.'
        }],
        getOutcomes: (_: Activity): string[] => {
          return ['Done'];
        }
      }
    );
  }
}
