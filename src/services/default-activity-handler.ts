import { ActivityHandler } from "./activity-handler";
import { Activity, ActivityDefinition, RenderDesignerResult } from "../models";

export class DefaultActivityHandler implements ActivityHandler {
  renderDesigner = (activity: Activity, definition: ActivityDefinition): RenderDesignerResult => {
    let description = definition.description;

    if (definition.designer) {
      const lambda = definition.designer.description;
      const fun = eval(lambda);

      description = fun({ activity, definition, state: activity.state });
    }

    return {
      description: description
    }
  }
}
