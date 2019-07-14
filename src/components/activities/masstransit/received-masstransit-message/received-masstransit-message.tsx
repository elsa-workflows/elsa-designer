import { Component, Prop } from '@stencil/core';
import { Activity } from "../../../../models";
import { Action, addActivityDefinition } from "../../../../redux/actions";
import { Store } from "@stencil/redux";
import { RootState } from "../../../../redux/reducers";

@Component({
  tag: 'wf-receive-masstransit-message',
  shadow: true
})
export class ReceiveMassTransitMessage {

  @Prop({ context: 'store' })
  store: Store<RootState, Action>;

  @Prop({ reflect: true })
  type: string = 'ReceiveMassTransitMessage';

  @Prop({ reflect: true })
  displayName: string = 'Receive Message';

  @Prop({ reflect: true })
  description: string = 'Receive a message via MassTransit.';

  @Prop({ reflect: true })
  category: string = 'MassTransit';

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
          name: 'messageType',
          type: 'text',
          label: 'Message Type',
          hint: 'The assembly-qualified type name of the message to receive.'
        }],
        getOutcomes: (_: Activity): string[] => {
          return ['Done'];
        }
      }
    );
  }
}
