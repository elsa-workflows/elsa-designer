import { Activity, ActivityDefinition } from "../../../models";

export class RenderActivityDesignerContext {

  constructor(activity: Activity, activityDefinition: ActivityDefinition)
  {
    this.activity = activity;
    this.activityDefinition = activityDefinition;

  }

  public readonly activity: Activity;
  public readonly activityDefinition: ActivityDefinition;
  public description: string;
}
