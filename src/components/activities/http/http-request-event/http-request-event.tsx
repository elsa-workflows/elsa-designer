import { Component, Prop } from '@stencil/core';
import activityDefinitionStore from '../../../../services/activity-definition-store';
import { Activity, ActivityDefinition } from "../../../../models";

@Component({
  tag: 'wf-http-request-event',
  shadow: true
})
export class HttpRequestEvent implements ActivityDefinition {

  @Prop({ reflect: true })
  type: string = "HttpRequestEvent";

  @Prop({ reflect: true })
  displayName: string = "Receive HTTP Request";

  @Prop({ reflect: true })
  description: string = "Receive an incoming HTTP request.";

  @Prop({ reflect: true })
  category: string = "HTTP";

  public componentDidLoad() {
    activityDefinitionStore.addActivity(this);
  }

  getOutcomes(_: Activity): string[] {
    return ['Done'];
  }

  properties = [{
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
    }];
}
