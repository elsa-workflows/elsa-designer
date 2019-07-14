import { Activity, ActivityPropertyDescriptor } from "./";

export interface ActivityDefinition {
  type: string;
  displayName: string;
  description: string;
  category: string;
  properties: Array<ActivityPropertyDescriptor>;
  getOutcomes(activity: Activity): string[];
}
