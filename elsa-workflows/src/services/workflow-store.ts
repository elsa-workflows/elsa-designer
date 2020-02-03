import {ActivityDefinition, Workflow} from "../models";
import {injectable} from "inversify";

@injectable()
export class WorkflowStore {

  private workflow: Workflow;

  constructor() {
    this.workflow = this.loadWorkflow();
  }

  get = async (id: string): Promise<Workflow> => this.workflow;

  private loadWorkflow = () => {
    return {
      id: '1',
      activities: [],
      connections: []
    };
  };

}
