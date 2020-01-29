import {Activity, ActivityDefinition} from "../models";

export interface ActivityEditorContext {
  activityDefinition: ActivityDefinition
  activity: Activity
  activityState: any
}

export interface UpdateActivityContext extends ActivityEditorContext {
}

﻿export interface ActivityDriver {
  readonly activityType: string
  getEditDisplay(context: ActivityEditorContext): Promise<string>
  updateActivity(editorDisplay: Element, context: UpdateActivityContext): Promise<void>
}
