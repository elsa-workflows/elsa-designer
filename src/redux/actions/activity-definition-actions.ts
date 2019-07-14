import { ActivityDefinition } from "../../models";

export const ADD_ACTIVITY_DEFINITION = 'ADD_ACTIVITY_DEFINITION';

export interface AddActivityDefinition {
  type: string;
  activityDefinition: ActivityDefinition;
}

export function addActivityDefinition(activityDefinition: ActivityDefinition): AddActivityDefinition {
  return {
    type: ADD_ACTIVITY_DEFINITION,
    activityDefinition: activityDefinition
  };
}
