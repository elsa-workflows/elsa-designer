import {Component, Prop} from '@stencil/core';
import { Activity} from "../../../../models";
import { Store } from "@stencil/redux";
import { RootState } from "../../../../redux/reducers";
import { Action, addActivityDefinition } from "../../../../redux/actions";

@Component({
  tag: 'wf-log',
  shadow: true
})
export class Log {

  @Prop({ context: 'store' })
  store: Store<RootState, Action>;

  @Prop({reflect: true})
  type: string = "Log";

  @Prop({reflect: true})
  displayName: string = "Log";

  @Prop({reflect: true})
  description: string = "Log a message.";

  @Prop({reflect: true})
  category: string = "Primitives";

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
          name: 'message',
          type: 'text',
          label: 'Message',
          hint: 'The text to log.'
        }],
        getOutcomes: (_: Activity): string[] => {
          return ['Done'];
        }
      }
    );
  }
}
