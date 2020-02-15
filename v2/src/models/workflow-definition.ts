import {WorkflowPersistenceBehavior} from "./workflow-persistence-behavior";
import {Activity} from "./activity";
import {Connection} from "./connection";
import {ActivityDefinition} from "./activity-definition";

export interface WorkflowDefinition {
    id: string
    definitionId: string
    name?: string
    description?: string
    isSingleton?: boolean
    isDisabled?: boolean
    deleteCompletedInstances?: boolean
    isPublished?: boolean
    isLatest?: boolean
    version?: number
    variables?: any
    persistenceBehavior?: WorkflowPersistenceBehavior
    activities: Array<ActivityDefinition>
    connections: Array<Connection>
}
