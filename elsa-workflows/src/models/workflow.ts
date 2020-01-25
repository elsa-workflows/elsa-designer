import {Activity} from "./activity";
import {Connection} from "./connection";

export interface Workflow
{
  activities: Array<Activity>
  connections: Array<Connection>
}
