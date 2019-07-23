import { Component, Prop } from '@stencil/core';
import { Store } from "@stencil/redux";
import { RootState } from "../../../../redux/reducers";
import { Action, addActivityDefinition } from "../../../../redux/actions";
import { ComponentHelper } from "../../../../utils/ComponentHelper";
import { OutcomeNames } from "../../../../models/outcome-names";

@Component({
  tag: 'wf-send-email',
  shadow: true
})
export class SendEmail {

  @Prop({ context: 'store' })
  store: Store<RootState, Action>;

  @Prop({ reflect: true })
  type: string = "SendEmail";

  @Prop({ reflect: true })
  displayName: string = "Send Email";

  @Prop({ reflect: true })
  description: string = "Send an email message.";

  @Prop({ reflect: true })
  category: string = "Email";

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
        properties: [
          {
            name: 'from',
            type: 'workflow-expression',
            label: 'From',
            hint: 'The sender\'s email address'
          },
          {
            name: 'to',
            type: 'workflow-expression',
            label: 'To',
            hint: 'The recipient\'s email address'
          },
          {
            name: 'subject',
            type: 'workflow-expression',
            label: 'Subject',
            hint: 'The subject of the email message.'
          },
          {
            name: 'body',
            type: 'workflow-expression',
            label: 'Body',
            hint: 'The body of the email message.'
          }],
        designer: {
          outcomes: [OutcomeNames.Done]
        }
      }
    );
  }
}
