import { ActivityHandler } from "../services/activity-handler";

export type ActivityHandlerMap = {
  [typeName: string]: ActivityHandler
};
