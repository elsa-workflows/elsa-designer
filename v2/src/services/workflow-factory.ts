import {injectable} from "inversify";
import {Activity, ActivityDefinition, Workflow, WorkflowDefinition, WorkflowInstance} from "../models";

@injectable()
export class WorkflowFactory {
  fromDefinition = (workflowDefinition: WorkflowDefinition): Workflow => {
    return {
      ...workflowDefinition,
      activities: workflowDefinition.activities.map(this.fromActivityDefinition)
    }
  };

  toDefinition = (workflow: Workflow): WorkflowDefinition => {
    return {
      ...workflow,
      activities: workflow.activities.map(this.toActivityDefinition),
    }
  };

  fromInstance = (workflowInstance: WorkflowInstance, workflowDefinition: WorkflowDefinition): Workflow => {
    const workflow = this.fromDefinition(workflowDefinition);
    const log = workflowInstance.executionLog || [];
    const blockingActivities = workflowInstance.blockingActivities || [];

    for (const activity of workflow.activities) {
      const hasExecuted = !!log.find(x => x.activityId === activity.id);
      const isBlocking = !!blockingActivities.find(x => x.activityId === activity.id);
      const hasFaulted = !!workflowInstance.fault && workflowInstance.fault.faultedActivityId === activity.id;

      activity.executed = hasExecuted;
      activity.blocking = isBlocking;
      activity.faulted = hasFaulted;
    }

    return workflow;
  };

  fromActivityDefinition = (activityDefinition: ActivityDefinition): Activity => {
    return {
      ...activityDefinition,
      executed: false
    }
  };

  toActivityDefinition = (activityDefinition: Activity): ActivityDefinition => {
    return {
      ...activityDefinition,
    }
  };
}
