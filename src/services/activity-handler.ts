import { Activity, ActivityDefinition, RenderDesignerResult } from "../models";

export interface ActivityHandler {
  renderDesigner?: (activity: Activity, definition: ActivityDefinition) => RenderDesignerResult
  updateEditor?: (activity: Activity, formData: FormData) => Activity;
}
