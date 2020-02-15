
export class WorkflowStates {
  public static readonly Idle = 'IDLE';
  public static readonly Running = 'RUNNING';
  public static readonly Suspended = 'SUSPENDED';
  public static readonly Faulted = 'FAULTED';
  public static readonly Completed = 'COMPLETED';
}

export type WorkflowStatus = 'IDLE' | 'RUNNING' | 'SUSPENDED' | 'FAULTED' | 'COMPLETED';

