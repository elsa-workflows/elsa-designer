import {ActivityDescriptor} from "../models";
import {inject, injectable} from "inversify";
import {ServerConfiguration} from "./server-configuration";
import request from "graphql-request";

@injectable()
export class ActivityDescriptorStore {

  private items: Array<ActivityDescriptor> = [];


  constructor(@inject(ServerConfiguration) private config: ServerConfiguration) {
  }

  initialize = (items?: Array<ActivityDescriptor>) => this.items = !!items ? [...this.items] : [];
  addRange = (items: Array<ActivityDescriptor>) => this.items = [...this.items, ...items];

  list = async (): Promise<Array<ActivityDescriptor>> => {
    const url = this.config.serverUrl;
    const query = `{
        activityDescriptors {
          type
          category
          description
          displayName
          icon
          outcomes
        }
      }`;
    const graph = await request(url, query);
    return graph.activityDescriptors;
  };

  get = async (type: string): Promise<ActivityDescriptor> => {
    const url = this.config.serverUrl;
    const query = `
    query getActivityDescriptor($typeName: ID!) {
        activityDescriptor(typeName: $typeName) {
          type
          category
          description
          displayName
          icon
          outcomes
          properties {
            name
            type
            label
            hint
            options
          }
        }
      }
    `;

    const variables = {typeName: type};
    const graph = await request(url, query, variables);
    return graph.activityDescriptor;
  };

  contains = (type: string): boolean => this.items.findIndex(x => x.type === type) >= 0;
}
