import { OutcomeNames } from "../models/outcome-names";
import { WorkflowPlugin } from "../models";
import { ActivityDefinition } from "../models";
import pluginStore from '../services/workflow-plugin-store';

export class HttpActivities implements WorkflowPlugin {
  private static readonly Category: string = "HTTP";

  getActivityDefinitions = (): Array<ActivityDefinition> => ([
    this.sendHttpRequest(),
    this.sendHttpResponse(),
    this.handleHttpRequest()
  ]);

  private sendHttpRequest = (): ActivityDefinition => ({
    type: "SendHttpRequest",
    displayName: "Send HTTP Request",
    description: "Send an HTTP request.",
    category: HttpActivities.Category,
    properties: [{
      name: 'url',
      type: 'text',
      label: 'URL',
      hint: 'The URL to send the HTTP request to.'
    },
      {
        name: 'method',
        type: 'text',
        label: 'Method',
        hint: 'The HTTP method to use when making the request.'
      },
      {
        name: 'content',
        type: 'expression',
        label: 'Content',
        hint: 'The HTTP content to send along with the request.'
      }, {
        name: 'statusCodes',
        type: 'list',
        label: 'Status Codes',
        hint: 'A list of possible HTTP status codes to handle.'
      }],
    designer: {
      outcomes: 'x => !!x.state.statusCodes ? x.state.statusCodes : []'
    }
  });

  private handleHttpRequest = (): ActivityDefinition => ({
    type: "HandleHttpRequest",
    displayName: "Handle HTTP Request",
    description: "Handle an incoming HTTP request.",
    category: HttpActivities.Category,
    properties: [{
      name: 'path',
      type: 'text',
      label: 'Path',
      hint: 'The relative path that triggers this activity.'
    },
      {
        name: 'method',
        type: 'text',
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
      description: `x => !!x.state.path ? \`Handle <strong>\${ x.state.method } \${ x.state.path }</strong>.\` : x.definition.description`,
      outcomes: [OutcomeNames.Done]
    }
  });

  private sendHttpResponse = (): ActivityDefinition => ({
    type: "SendHttpResponse",
    displayName: "Send HTTP Response",
    description: "Send an HTTP response.",
    category: HttpActivities.Category,
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
    designer: {
      outcomes: [OutcomeNames.Done]
    }
  });
}

pluginStore.add(new HttpActivities());
