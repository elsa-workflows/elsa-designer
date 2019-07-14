import { Component, Prop } from '@stencil/core';
import { Activity} from "../../../../models";
import { Store } from "@stencil/redux";
import { Action, addActivityDefinition } from "../../../../redux/actions";
import { RootState } from "../../../../redux/reducers";

@Component({
  tag: 'wf-read-line',
  shadow: true
})
export class ReadLine {

  @Prop({ context: 'store' })
  store: Store<RootState, Action>;

  @Prop({ reflect: true })
  type: string = "ReadLine";

  @Prop({reflect: true, attribute: 'display-name'})
  displayName: string = "Read Line";

  @Prop({ reflect: true })
  description: string = "Read text from standard in.";

  @Prop({ reflect: true })
  category: string = "Console";

  addActivityDefinition!: typeof addActivityDefinition;

  componentWillLoad(){
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
        getOutcomes: (_: Activity): string[] => {
          return ['Done'];
        }
      }
    );
  }
}
