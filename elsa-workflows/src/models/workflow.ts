import {Activity} from "./activity";
import {Connection} from "./connection";

export interface Workflow
{
  id: string
  activities: Array<Activity>
  connections: Array<Connection>
}
