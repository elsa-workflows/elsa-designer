import {Component, Host, h, Prop} from '@stencil/core';
import {ActivityDescriptor, ExecutionLogEntry, WorkflowDefinition} from '../../models';

@Component({
  tag: 'elsa-execution-log',
  scoped: true
})
export class ExecutionLog {

  @Prop() workflowDefinition: WorkflowDefinition;
  @Prop() activityDescriptors: Array<ActivityDescriptor> = [];
  @Prop() log: Array<ExecutionLogEntry> = [];

  render() {

    if (!this.workflowDefinition)
      return;

    return (
      <div class="card m-2">
        <div class="card-header">
          Execution Log
        </div>
        <div class="card-body p-0">
          <table class="table align-items-center table-flush ">
            <thead class="thead-light">
            <tr>
              <th scope="col">Timestamp</th>
              <th scope="col">Activity</th>
            </tr>
            </thead>
            <tbody>
            {this.log.map(this.renderRow)}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  private renderRow = (entry: ExecutionLogEntry) => {
    const activityDefinition = this.workflowDefinition.activities.find(x => x.id === entry.activityId);
    const activityDescriptor = this.activityDescriptors.find(x => x.type === x.type);
    const displayName = !!activityDefinition.displayName ? activityDefinition.displayName : activityDescriptor.displayName;

    return (
      <tr>
        <td>{entry.timestamp}</td>
        <td>{displayName}</td>
      </tr>
    );
  };
}
