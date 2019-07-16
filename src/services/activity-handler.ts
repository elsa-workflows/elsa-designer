import { Activity, ActivityDefinition, RenderDesignerResult } from "../models";

export interface ActivityHandler {
  renderDesigner?: (activity: Activity, definition: ActivityDefinition) => RenderDesignerResult
}
