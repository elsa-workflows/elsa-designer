import {injectable} from "inversify";

type CustomActivityTypeMap = { [type: string]: any }

@injectable()
export class CustomDriverStore {
  private activityTypes: CustomActivityTypeMap = {};

  useCustomDriverFor = (activityType: string) => this.activityTypes[activityType] = true;
  hasCustomDriverFor = (activityType: string): boolean => !!this.activityTypes[activityType];
}
