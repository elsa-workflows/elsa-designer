import {Activity} from "./activity";
import {Connection} from "./connection";

export type Workflow = {
  id?: string
  name?: string
  description?: string
  version?: string
  activities: Array<Activity>
  connections: Array<Connection>
}
