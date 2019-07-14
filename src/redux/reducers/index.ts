import { combineReducers } from 'redux';
import { ActivityDefinitionState, activityDefinitionReducer } from './activity-definition-reducer';
import { workflowReducer, WorkflowState } from "./workflow-reducer";

export interface RootState {
  activityDefinitions: ActivityDefinitionState;
  workflow: WorkflowState;
}

export const rootReducer = combineReducers({
  activityDefinitions: activityDefinitionReducer,
  workflow: workflowReducer
});

export default { rootReducer };
