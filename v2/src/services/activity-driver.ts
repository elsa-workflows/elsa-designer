import {Activity, ActivityDefinition, ActivityDescriptor} from "../models";
import {ActivityState, Node} from "./types";
import {injectable} from "inversify";

export interface ActivityDisplayContext {
  activityDescriptor: ActivityDescriptor
  activity: Activity
  state: ActivityState
}

﻿export interface ActivityDriver {
  supportsActivity(context: ActivityDisplayContext): boolean;

  displayDesigner(context: ActivityDisplayContext): Promise<Node>

  displayEditor(context: ActivityDisplayContext): Promise<Node>

  updateActivity(context: ActivityDisplayContext, formData: FormData): Promise<void>
}

@injectable()
export abstract class ActivityDriverBase implements ActivityDriver {
  protected activityType: string;

  supportsActivity = (context: ActivityDisplayContext): boolean => context.activity.type === this.activityType;

  displayDesigner = async (context: ActivityDisplayContext): Promise<Node> => null;

  displayEditor = (context: ActivityDisplayContext): Promise<Node> => null;

  updateActivity = async (context: ActivityDisplayContext, formData: FormData): Promise<void> => {
  }

}
