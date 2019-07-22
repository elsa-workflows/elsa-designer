import { Activity, ActivityDefinition, ActivityHandlerMap, RenderDesignerResult } from "../models";
import { ActivityHandler } from "./activity-handler";
import { FormUpdater } from "../utils";

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
  };

  public updateEditor = (activity: Activity, formData: FormData): Activity => {
    const handler = this.handlers[activity.type];
    let updater = () => FormUpdater.updateEditor(activity, formData);

    if(!handler)
      return updater();

    if(!handler.updateEditor)
      return updater();

    return handler.updateEditor(activity, formData);
  }
}

export default new ActivityManager();
