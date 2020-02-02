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
    const writeLine1 = {
      id: '1',
      type: 'WriteLine',
      displayName: 'Write Line',
      state: {text: {type: 'Liquid', expression: 'Hello World!'}},
      outcomes: ['Done'],
      left: 700,
      top: 650
    };

    return {
      id: '1',
      activities: [writeLine1],
      connections: []
    };
  };

}
