import {VersionOptions, Workflow, WorkflowDefinitionSummary} from "../models";
import {inject, injectable} from "inversify";
import request from "graphql-request";
import {ServerConfiguration} from "./server-configuration";

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
export class WorkflowStore {

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

  get = async (id: string): Promise<Workflow> => {
    const url = this.config.serverUrl;
    const query = `
      query workflowDefinition($id: ID!) {
        workflowDefinition(id: $id) {
          ${workflowDetailFragment}
        }
      }
    `;

    const variables = {id};
    const graph = await request(url, query, variables);
    return this.readWorkflowDefinition(graph.workflowDefinition);
  };

  save = async (workflow: Workflow, publish: boolean): Promise<Workflow> => {
    const url = this.config.serverUrl;
    const query = `
      mutation saveWorkflowDefinition(
        $id: String
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

  private readWorkflowDefinition = (model: any): Workflow => {
    const workflow: Workflow = {...model};

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
  }

}
