import { combineReducers } from 'redux';
import { ActivityDefinitionState, activityDefinitionReducer } from './activity-definition-reducer';

export interface RootState {
  activityDefinitions: ActivityDefinitionState;
}

export const rootReducer = combineReducers({
  activityDefinitions: activityDefinitionReducer
});

export default { rootReducer };
