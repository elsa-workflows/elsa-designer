import { Activity, Connection, Workflow } from "../../models";

export const ADD_ACTIVITY = 'ADD_ACTIVITY';
export const REMOVE_ACTIVITY = 'REMOVE_ACTIVITY';
export const ADD_CONNECTION = 'ADD_CONNECTION';
export const REMOVE_CONNECTION = 'REMOVE_CONNECTION';
export const NEW_WORKFLOW = 'NEW_WORKFLOW';
export const LOAD_WORKFLOW = 'LOAD_WORKFLOW';

export interface AddActivity {
  type: string;
  activity: Activity;
}

export interface RemoveActivity {
  type: string;
  activityId: string;
}

export interface AddConnection {
  type: string;
  connection: Connection;
}

export interface RemoveConnection {
  type: string;
  sourceActivityId: string;
  destinationActivityId: string;
  outcome: string;
}

export interface NewWorkflow {
}

export interface LoadWorkflow {
  workflow: Workflow
}

export function addActivity(activity: Activity): AddActivity {
  return {
    type: ADD_ACTIVITY,
    activity: activity
  };
}

export function removeActivity(activityId: string): RemoveActivity {
  return {
    type: REMOVE_ACTIVITY,
    activityId: activityId
  };
}

export function addConnection(connection: Connection): AddConnection {
  return {
    type: ADD_CONNECTION,
    connection: connection
  };
}

export function removeConnection(sourceActivityId: string, destinationActivityId: string, outcome: string): RemoveConnection {
  return {
    type: REMOVE_CONNECTION,
    sourceActivityId: sourceActivityId,
    destinationActivityId: destinationActivityId,
    outcome: outcome
  };
}

export function newWorkflow(): NewWorkflow {
  return {};
}

export function loadWorkflow(workflow: Workflow): LoadWorkflow {
  return {
    workflow: workflow
  };
}
