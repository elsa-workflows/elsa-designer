import { Component, Prop } from '@stencil/core';
import { Activity} from "../../../../models";
import { Store } from "@stencil/redux";
import { RootState } from "../../../../redux/reducers";
import { Action, addActivityDefinition } from "../../../../redux/actions";
import { ComponentHelper } from "../../../../utils/ComponentHelper";

@Component({
  tag: 'wf-send-masstransit-message',
  shadow: true
})
export class SendMassTransitMessage {

  @Prop({ context: 'store' })
  store: Store<RootState, Action>;

  @Prop({ reflect: true })
  type: string = 'SendMassTransitMessage';

  @Prop({ reflect: true })
  displayName: string = 'Send Message';

  @Prop({ reflect: true })
  description: string = 'Send a message via MassTransit.';

  @Prop({ reflect: true })
  category: string = 'MassTransit';

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
          name: 'messageType',
          type: 'text',
          label: 'Message Type',
          hint: 'The assembly-qualified type name of the message to send.'
        },
          {
            name: 'message',
            type: 'workflow-expression',
            label: 'Message',
            hint: 'An expression that evaluates to the message to send.'
          }],
        getOutcomes: (_: Activity): string[] => {
          return ['Done'];
        }
      }
    );
  }
}
