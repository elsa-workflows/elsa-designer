import {
  ADD_ACTIVITY,
  ADD_CONNECTION,
  REMOVE_ACTIVITY,
  REMOVE_CONNECTION,
  NEW_WORKFLOW,
  AddActivity,
  AddConnection,
  RemoveActivity, RemoveConnection, LOAD_WORKFLOW, LoadWorkflow
} from "../actions";
import { Workflow } from "../../models";

export interface WorkflowState {
  workflow: Workflow;
}

const addActivity = (workflow: Workflow, action: AddActivity) => {
  return { ...workflow, activities: [...workflow.activities, action.activity] };
};

const removeActivity = (workflow: Workflow, action: RemoveActivity) => {
  const activityId = action.activityId;
  const activities = workflow.activities.filter(x => x.id !== activityId);
  const connections = workflow.connections.filter(x => x.sourceActivityId != activityId && x.destinationActivityId != activityId);

  return { ...workflow, activities, connections };
};

const addConnection = (workflow: Workflow, action: AddConnection) => {
  return { ...workflow, connections: [...workflow.connections, action.connection] };
};

const removeConnection = (workflow: Workflow, action: RemoveConnection) => {
  const { sourceActivityId, destinationActivityId, outcome } = action;
  const connections = this.workflow.connections.filter(x => !(x.sourceActivityId === sourceActivityId && x.destinationActivityId === destinationActivityId && x.outcome === outcome));

  return { ...workflow, connections };
};

const newWorkflow = (_: Workflow, __: RemoveConnection) => {
  return { activities: [], connections: [] };
};

const loadWorkflow = (_: Workflow, action: LoadWorkflow) => {
  return { ...action.workflow };
};

export function workflowReducer(state: any = {}, action: any) {
  switch (action.type) {
    case ADD_ACTIVITY:
      return addActivity(state, action);
    case REMOVE_ACTIVITY:
      return removeActivity(state, action);
    case ADD_CONNECTION:
      return addConnection(state, action);
    case REMOVE_CONNECTION:
      return removeConnection(state, action);
    case NEW_WORKFLOW:
      return newWorkflow(state, action);
    case LOAD_WORKFLOW:
      return loadWorkflow(state, action);
    default:
      return state;
  }
}
