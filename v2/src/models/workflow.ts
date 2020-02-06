import {Activity} from "./activity";
import {Connection} from "./connection";
import {WorkflowPersistenceBehavior} from "./workflow-persistence-behavior";

export interface Workflow {
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
  activities: Array<Activity>
  connections: Array<Connection>
}

export const emptyWorkflow: Workflow = {
  id: null,
  definitionId: null,
  activities: [],
  connections: []
};
