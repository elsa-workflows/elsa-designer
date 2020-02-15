import {Activity, ActivityDescriptor} from "../../models";

const isExpression = (value: string) => value.indexOf('=>') >= 0;

export const evaluateOutcome = (outcome: string, activity: Activity, activityDescriptor: ActivityDescriptor): Array<string> => {
  if(!isExpression(outcome))
    return [outcome];

  const value = eval(outcome);
  let results:Array<string> = [];

  if (value instanceof Function) {
    try {
      results = value({ activity, activityDescriptor: activityDescriptor, state: activity.state });
    } catch (e) {
      console.warn(e);
    }
  }

  return results;
};
