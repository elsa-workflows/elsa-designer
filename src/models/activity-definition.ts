import { ActivityPropertyDescriptor } from "./";

export type Lambda<T = any> = string | T;

export interface ActivityDefinition {
  type: string;
  displayName: string;
  description: string;
  category: string;
  properties: Array<ActivityPropertyDescriptor>;
  designer?: {
    description?: Lambda<string>,
    outcomes?: Lambda<Array<string>>
  }
}
