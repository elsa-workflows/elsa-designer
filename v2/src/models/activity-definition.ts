import {ActivityState} from "../services";

export interface ActivityDefinition {
    id: string
    type: string
    name?: string
    displayName?: string
    state: ActivityState
    left: number;
    top: number
}
