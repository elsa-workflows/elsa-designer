import { Component, Prop } from '@stencil/core';
import { Activity} from "../../../../models";
import { Store } from "@stencil/redux";
import { RootState } from "../../../../redux/reducers";
import { Action, addActivityDefinition } from "../../../../redux/actions";

@Component({
  tag: 'wf-http-response-task',
  shadow: true
})
export class HttpResponseTask {

  @Prop({ context: 'store' })
  store: Store<RootState, Action>;

  @Prop({ reflect: true })
  type: string = "HttpResponseTask";

  @Prop({ reflect: true })
  displayName: string = "Send HTTP Response";

  @Prop({ reflect: true })
  description: string = "Send an HTTP response.";

  @Prop({ reflect: true })
  category: string = "HTTP";

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
          name: 'statusCode',
          type: 'text',
          label: 'Status Code',
          hint: 'The HTTP status code to write.'
        },
          {
            name: 'content',
            type: 'workflow-expression',
            label: 'Content',
            hint: 'The HTTP content to write.'
          },
          {
            name: 'contentType',
            type: 'workflow-expression',
            label: 'Content Type',
            hint: 'The HTTP content type header to write.'
          },
          {
            name: 'responseHeaders',
            type: 'workflow-expression',
            label: 'Response Headers',
            hint: 'The headers to send along with the response. One \'header: value\' pair per line.'
          }],
        getOutcomes: (_: Activity): string[] => {
          return ['Done'];
        }
      }
    );
  }
}
