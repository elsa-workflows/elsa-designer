import { Activity, ActivityDefinition, ActivityHandlerMap, RenderDesignerResult } from "../models";
import { ActivityHandler } from "./activity-handler";
import { FormUpdater } from "../utils";
import { DefaultActivityHandler } from "./default-activity-handler";

export class ActivityManager {
  constructor(){
    this.handlers= {};
  }

  private readonly handlers: ActivityHandlerMap;

  public addHandler = (activityTypeName: string, handler: ActivityHandler) => {
    this.handlers[activityTypeName] = {...handler};
  };

  public renderDesigner = (activity: Activity, definition: ActivityDefinition): RenderDesignerResult => {
    const handler = this.getHandler(activity.type);

    if(!handler.renderDesigner)
      return {
        description: definition.description
      };

    return handler.renderDesigner(activity, definition);
  };

  public updateEditor = (activity: Activity, formData: FormData): Activity => {
    const handler = this.getHandler(activity.type);
    let updater = handler.updateEditor  || FormUpdater.updateEditor;

    return updater(activity, formData);
  };

  public getOutcomes = (activity: Activity, definition: ActivityDefinition): Array<string> => {
    const handler = this.getHandler(activity.type);

    if(!handler.getOutcomes)
      return [];

    return handler.getOutcomes(activity, definition);
  };

  private getHandler = type => this.handlers[type] || new DefaultActivityHandler();
}

export default new ActivityManager();
