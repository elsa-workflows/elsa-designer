export interface WorkflowPersistenceBehaviors
{
  Suspended: WorkflowPersistenceBehavior
  WorkflowExecuted: WorkflowPersistenceBehavior
  ActivityExecuted: WorkflowPersistenceBehavior
}

export const WorkflowPersistenceBehaviors: WorkflowPersistenceBehaviors = {
  Suspended: 'SUSPENDED',
  WorkflowExecuted: 'WORKFLOWEXECUTED',
  ActivityExecuted: 'ACTIVITYEXECUTED'
};

export type WorkflowPersistenceBehavior =
  'SUSPENDED' |
  'WORKFLOWEXECUTED' |
  'ACTIVITYEXECUTED';


