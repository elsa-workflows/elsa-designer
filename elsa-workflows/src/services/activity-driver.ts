import {Activity, ActivityDefinition} from "../models";
import {ActivityState, Render} from "./types";

export interface ActivityDisplayContext {
  activityDefinition: ActivityDefinition
  activity: Activity
  state: ActivityState
}

﻿export interface ActivityDriver {
  supportsActivity(context: ActivityDisplayContext): boolean;

  displayDesigner(context: ActivityDisplayContext): Promise<Render>

  displayEditor(context: ActivityDisplayContext): Promise<Render>

  updateActivity(context: ActivityDisplayContext, formData: FormData): Promise<void>
}
