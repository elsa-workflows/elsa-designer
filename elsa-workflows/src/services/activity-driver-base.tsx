import {Render} from "./types";
import {ActivityDisplayContext, ActivityDriver} from "./activity-driver";
import {h} from "@stencil/core";
import {injectable} from "inversify";

@injectable()
export abstract class ActivityDriverBase implements ActivityDriver {
  supportsActivity = (context: ActivityDisplayContext): boolean => context.activity.type === this.activityType;
  protected activityType: string;

  async displayDesigner(context: ActivityDisplayContext): Promise<Render> {
    return null;
  }

  displayEditor(context: ActivityDisplayContext): Promise<Render> {
    return null;
  }

  async updateActivity(context: ActivityDisplayContext, formData: FormData): Promise<void> {
  }

}
