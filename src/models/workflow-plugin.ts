import { ActivityDefinition } from "./activity-definition";

export interface WorkflowPlugin {
  getActivityDefinitions: () => Array<ActivityDefinition>
}
