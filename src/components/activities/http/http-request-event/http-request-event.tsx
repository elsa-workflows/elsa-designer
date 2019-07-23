import { Component, Prop } from '@stencil/core';
import { Store } from "@stencil/redux";
import { RootState } from "../../../../redux/reducers";
import { Action, addActivityDefinition } from "../../../../redux/actions";
import { ComponentHelper } from "../../../../utils/ComponentHelper";
import { OutcomeNames } from "../../../../models/outcome-names";

@Component({
  tag: 'wf-http-request-event',
  shadow: true
})
export class HttpRequestEvent {

  @Prop({ context: 'store' })
  store: Store<RootState, Action>;

  @Prop({ reflect: true })
  type: string = "HttpRequestEvent";

  @Prop({ reflect: true })
  displayName: string = "Receive HTTP Request";

  @Prop({ reflect: true })
  description: string = "Receive an incoming HTTP request.";

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
          name: 'path',
          type: 'uri',
          label: 'Path',
          hint: 'The relative path that triggers this activity.'
        },
          {
            name: 'method',
            type: 'string',
            label: 'Method',
            hint: 'The HTTP method that triggers this activity.'
          },
          {
            name: 'readContent',
            type: 'boolean',
            label: 'Read Content',
            hint: 'Check if the HTTP request content body should be read and stored as part of the HTTP request model. The stored format depends on the content-type header.'
          }],
        designer: {
          outcomes: [OutcomeNames.Done]
        }
      }
    );
  }
}
