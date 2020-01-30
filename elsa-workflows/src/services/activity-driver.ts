import {Activity, ActivityDefinition} from "../models";
import {ActivityState, Render} from "./types";

export interface ActivityEditorContext {
  activityDefinition: ActivityDefinition
  activity: Activity
  state: ActivityState
}

export interface UpdateActivityContext extends ActivityEditorContext {
  formData: FormData;
}

﻿export interface ActivityDriver {
  readonly activityType: string
  getEditDisplay(context: ActivityEditorContext): Promise<Render>
  updateActivity(context: UpdateActivityContext): Promise<void>
}
