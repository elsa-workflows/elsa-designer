import {WorkflowStatus} from "./workflow-status";
import {BlockingActivity} from "./blocking-activity";
import {ExecutionLogEntry} from "./execution-log-entry";
import {WorkflowFault} from "./workflow-fault";
import {ScheduledActivity} from "./scheduled-activity";
import {Variable} from "./variable";

export interface WorkflowInstance {
  id: string
  definitionId: string
  correlationId?: string
  version: number
  status: WorkflowStatus
  output?: any
  blockingActivities: Array<BlockingActivity>
  createdAt:Date
  executionLog: Array<ExecutionLogEntry>
  fault?: WorkflowFault
  scheduledActivities: Array<ScheduledActivity>
  variables?: Array<Variable>
}


