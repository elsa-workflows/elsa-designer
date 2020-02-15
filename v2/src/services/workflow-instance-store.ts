import {VersionOptions, WorkflowInstance, WorkflowInstanceStatusSummary, WorkflowInstanceSummary, WorkflowStatus} from "../models";
import {inject, injectable} from "inversify";
import request from "graphql-request";
import {ServerConfiguration} from "./server-configuration";

@injectable()
export class WorkflowInstanceStore {

  constructor(@inject(ServerConfiguration) private config: ServerConfiguration) {
  }

  listStatusSummaries = async (definitionId: string): Promise<Array<WorkflowInstanceStatusSummary>> => this.list<WorkflowInstanceStatusSummary>(definitionId, 'status');

  listByDefinitionId = async (definitionId: string, status: WorkflowStatus): Promise<Array<WorkflowInstanceSummary>> => this.list<WorkflowInstanceSummary>(definitionId, `
    id
    version
    status
    correlationId
    createdAt
    fault {
      faultedActivityId
      message
    }
  `, status);

  get = async (id: string): Promise<WorkflowInstance> => {
    const url = this.config.serverUrl;
    const query = `
      query workflowInstance($id: ID!) {
        workflowInstance(id: $id) {
          id
          definitionId
          correlationId
          version
          status
          output
          blockingActivities {
            activityId
            activityType
          }
          correlationId
          createdAt
          executionLog {
            activityId
            timestamp
          }
          fault {
            faultedActivityId
            message
          }
          scheduledActivities {
            activityId
            input
          }
          variables {
            key
            value
          }
        }
      }
    `;

    const variables = {id};
    const graph = await request(url, query, variables);
    return graph.workflowInstance;
  };

  private async list<T>(definitionId: string, fields: string, status?: WorkflowStatus): Promise<Array<T>> {
    const url = this.config.serverUrl;
    const query = `
      query workflowInstances($definitionId: ID!, $status: WorkflowStatus) {
        workflowInstances(definitionId: $definitionId, status: $status) {
          ${fields}
          }
        }
      `;

    const variables = {definitionId, status};
    const graph = await request(url, query, variables);
    return graph.workflowInstances;
  };
}
