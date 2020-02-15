import {VersionOptions, Workflow, WorkflowDefinitionSummary} from "../models";
import {inject, injectable} from "inversify";
import request from "graphql-request";
import {ServerConfiguration} from "./server-configuration";
import {WorkflowDefinition} from "../models/workflow-definition";

const workflowDetailFragment = `
  id
  definitionId
  description
  isDisabled
  isLatest
  isPublished
  isSingleton
  deleteCompletedInstances
  persistenceBehavior
  name
  version
  variables
  activities {
    id
    type
    name
    description
    displayName
    state
    left
    top
  }
  connections {
    sourceActivityId
    targetActivityId
    outcome
  }
`;

@injectable()
export class WorkflowDefinitionStore {

  constructor(@inject(ServerConfiguration) private config: ServerConfiguration) {
  }

  list = async (version: VersionOptions): Promise<Array<WorkflowDefinitionSummary>> => {
    const url = this.config.serverUrl;
    const query = `
      query workflowDefinitions($version: VersionOptionsInput) {
        workflowDefinitions(version: $version) {
          id
          definitionId
          name
          description
          version
          isLatest
          isPublished
          isSingleton
          isDisabled
          }
        }
      `;

    const variables = {version};
    const graph = await request(url, query, variables);
    return graph.workflowDefinitions;
  };

  get = async (id?: string, definitionId?: string, version?: VersionOptions): Promise<WorkflowDefinition> => {
    const url = this.config.serverUrl;
    const query = `
      query workflowDefinition($id: ID, $definitionId: ID, $version: VersionOptionsInput) {
        workflowDefinition(id: $id, definitionId: $definitionId, version: $version) {
          ${workflowDetailFragment}
        }
      }
    `;

    const variables = {id, definitionId, version};
    const graph = await request(url, query, variables);
    return this.readWorkflowDefinition(graph.workflowDefinition);
  };

  save = async (workflow: Workflow, publish: boolean): Promise<WorkflowDefinition> => {
    const url = this.config.serverUrl;
    const query = `
      mutation saveWorkflowDefinition(
        $id: ID
        $saveAction: WorkflowSaveAction!
        $workflowInput: WorkflowInput!
      ) {
        saveWorkflowDefinition(
          id: $id
          saveAction: $saveAction
          workflowInput: $workflowInput
        ) {
          ${workflowDetailFragment}
        }
      }
    `;

    const id = workflow.id;
    const saveAction = publish ? 'PUBLISH' : 'DRAFT';

    const transformState = (state: any) => {
      const newState = {};

      for (const key of Object.keys(state)) {
        newState[key] = {value: state[key]};
      }

      return JSON.stringify(newState);
    };

    const workflowInput = {
      name: workflow.name,
      description: workflow.description,
      isSingleton: workflow.isSingleton,
      isDisabled: workflow.isDisabled,
      deleteCompletedInstances: workflow.deleteCompletedInstances,
      variables: !!workflow.variables ? JSON.stringify(workflow.variables) : null,
      persistenceBehavior: workflow.persistenceBehavior,
      activities: workflow.activities.map(x => ({
        ...x,
        left: Math.round(x.left),
        top: Math.round(x.top),
        state: transformState(x.state)
      })),
      connections: workflow.connections
    };

    const variables = {id, saveAction, workflowInput};
    const graph = await request(url, query, variables);
    return this.readWorkflowDefinition(graph.saveWorkflowDefinition);
  };

  deleteDefinition = async (id: string): Promise<void> => {
    const url = this.config.serverUrl;
    const query = `
      mutation deleteWorkflowDefinition($id: ID!) {
        deleteWorkflowDefinition(id: $id)
      }
    `;

    const variables = {id};
    await request(url, query, variables);
  };

  private readWorkflowDefinition = (model: any): WorkflowDefinition => {
    const workflow: WorkflowDefinition = {...model};

    workflow.activities = model.activities.map(x => ({...x, state: this.readState(x.state)}));

    return workflow;
  };

  private readState = (state: any): any => {
    const newState = {};

    for (const key of Object.keys(state)) {
      const item = state[key];
      newState[key] = item.value;
    }

    return newState;
  };
}
