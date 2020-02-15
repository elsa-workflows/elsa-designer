import {WorkflowStatus} from "./workflow-status";

export interface WorkflowInstanceSummary {
  id: string
  status: WorkflowStatus
  version: number
  createdAt: Date
  fault?: {
    faultedActivityId: string
    message: string
  }
}
