import {Activity} from "./activity";
import {Connection} from "./connection";

export type Workflow = {
  id?: string
  name?: string
  description?: string
  version?: number
  activities: Array<Activity>
  connections: Array<Connection>
}
