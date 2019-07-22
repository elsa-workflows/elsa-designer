import { Activity, ActivityPropertyDescriptor } from "./";

export type Lambda<T = any> = string;

export interface ActivityDefinition {
  type: string;
  displayName: string;
  description: string;
  category: string;
  properties: Array<ActivityPropertyDescriptor>;
  getOutcomes(activity: Activity): string[];
  designer?: {
    description?: Lambda<string>,
    outcomes?: Lambda<Array<string>>
  }
}
