import { Component, Prop } from '@stencil/core';
import activityDefinitionStore from '../../../../services/activity-definition-store';
import { Activity, ActivityDefinition } from "../../../../models";

@Component({
  tag: 'wf-http-response-task',
  shadow: true
})
export class HttpResponseTask implements ActivityDefinition {

  @Prop({ reflect: true })
  type: string = "HttpResponseTask";

  @Prop({ reflect: true })
  displayName: string = "Send HTTP Response";

  @Prop({ reflect: true })
  description: string = "Send an HTTP response.";

  @Prop({ reflect: true })
  category: string = "HTTP";

  public componentDidLoad() {
    activityDefinitionStore.addActivity(this);
  }

  getOutcomes(_: Activity): string[] {
    return ['Done'];
  }

  properties = [{
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
    }];
}
