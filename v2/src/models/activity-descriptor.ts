import {ActivityPropertyDescriptor} from "./activity-property-descriptor";

export interface ActivityDescriptor {
  type: string
  displayName: string
  description: string
  category: string
  icon?: string
  properties?: Array<ActivityPropertyDescriptor>
  outcomes: Array<string>
}


