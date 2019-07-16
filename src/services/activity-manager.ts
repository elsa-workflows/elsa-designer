import { Activity, ActivityDefinition, ActivityHandlerMap, RenderDesignerResult } from "../models";
import { ActivityHandler } from "./activity-handler";

export class ActivityManager {
  constructor(){
    this.handlers= {};
  }

  private readonly handlers: ActivityHandlerMap;

  public addHandler = (activityTypeName: string, handler: ActivityHandler) => {
    this.handlers[activityTypeName] = {...handler};
  };

  public renderDesigner = (activity: Activity, definition: ActivityDefinition): RenderDesignerResult => {
    const handler = this.handlers[activity.type];

    if(!handler || !handler.renderDesigner)
      return {
        description: definition.description
      };

    return handler.renderDesigner(activity, definition);
  }
}

export default new ActivityManager();
