import { ActivityHandler } from "./activity-handler";
import { Activity, ActivityDefinition, RenderDesignerResult } from "../models";
import { FormUpdater } from "../utils";

export class DefaultActivityHandler implements ActivityHandler {
  renderDesigner = (activity: Activity, definition: ActivityDefinition): RenderDesignerResult => {
    let description = definition.description;

    if (!!definition.designer && !!definition.designer.description) {
      const lambda = definition.designer.description;
      const fun = eval(lambda);

      description = fun({ activity, definition, state: activity.state });
    }

    return {
      description: description
    }
  };

  updateEditor = (activity: Activity, formData: FormData): Activity => FormUpdater.updateEditor(activity, formData);

  getOutcomes = (activity: Activity, definition: ActivityDefinition): Array<string> => {
    let outcomes = [];

    if (definition.designer) {
      const lambda = definition.designer.outcomes;

      if (lambda instanceof Array) {
        outcomes = lambda as Array<string>;
      } else {
        const value = eval(lambda);

        if (value instanceof Array)
          outcomes = value;

        else if (value instanceof Function)
          outcomes = value({ activity, definition, state: activity.state });
      }
    }

    return outcomes;
  }
}
