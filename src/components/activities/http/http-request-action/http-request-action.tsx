import { Component, Prop } from '@stencil/core';
import { Store } from "@stencil/redux";
import { RootState } from "../../../../redux/reducers";
import { Action, addActivityDefinition } from "../../../../redux/actions";
import { ComponentHelper } from "../../../../utils/ComponentHelper";
import { OutcomeNames } from "../../../../models/outcome-names";

@Component({
  tag: 'wf-http-request-action',
  shadow: true
})
export class HttpRequestAction {

  @Prop({ context: 'store' })
  store: Store<RootState, Action>;

  @Prop({ reflect: true })
  type: string = "HttpRequestAction";

  @Prop({ reflect: true })
  displayName: string = "Send HTTP Request";

  @Prop({ reflect: true })
  description: string = "Send an outgoing HTTP request.";

  @Prop({ reflect: true })
  category: string = "HTTP";

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
          name: 'url',
          type: 'uri',
          label: 'URL',
          hint: 'The URL to send the HTTP request to.'
        },
          {
            name: 'method',
            type: 'string',
            label: 'Method',
            hint: 'The HTTP method to use when making the request.'
          },
          {
            name: 'content',
            type: 'expression',
            label: 'Content',
            hint: 'The HTTP content to send along with the request.'
          },{
            name: 'statusCodes',
            type: 'list',
            label: 'Status Codes',
            hint: 'A list of possible HTTP status codes to handle.'
          }],
        designer: {
          outcomes: 'x => !!x.state.statusCodes ? x.state.statusCodes : []'
        }
      }
    );
  }
}
