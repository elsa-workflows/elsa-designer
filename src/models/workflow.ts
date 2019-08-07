import {Activity} from "./activity";
import {Connection} from "./connection";

export type Workflow = {
  id?: string
  name?: string
  description?: string
  version?: number
  isPublished?: boolean
  activities: Array<Activity>
  connections: Array<Connection>
}
