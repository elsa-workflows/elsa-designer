import { Action, ADD_ACTIVITY_DEFINITION } from "../actions";
import { ActivityDefinition } from "../../models";

export interface ActivityDefinitionState {
  activityDefinitions: Array<ActivityDefinition>;
}

export function activityDefinitionReducer(state: any = [], action: Action) {
  switch (action.type) {
    case ADD_ACTIVITY_DEFINITION:
      return [...state, { ...action.activityDefinition }];
    default:
      return state;
  }
}
