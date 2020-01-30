import {ActivityState} from "../services";

export interface Activity {
  id: string
  type: string
  name?: string
  displayName?: string
  state: ActivityState
  left: number;
  top: number
}
