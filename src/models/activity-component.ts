import {Activity} from "./activity";
import {RenderResult} from "./render-result";

export interface ActivityComponent {
  type: string
  displayName: string;
  description: string
  category: string

  getOutcomes(activity: Activity): string[]

  editorTemplate(activity: Activity): RenderResult

  displayTemplate(activity: Activity): RenderResult

  updateEditor(activity: Activity, formData: FormData): Activity
}
