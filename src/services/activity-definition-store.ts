// import { ActivityDefinition } from "../models";
//
// export type ActivityMap = {
//   [typeName: string]: ActivityDefinition
// };
//
// export class ActivityDefinitionStore {
//   private lookup: ActivityMap = {};
//   private activities: Array<ActivityDefinition> = [];
//
//   public getActivities = (): Array<ActivityDefinition> => [...this.activities];
//
//   public getActivityLookup = (): ActivityMap => {
//     return { ...this.lookup };
//   };
//
//   public findActivityByType = (type: string): ActivityDefinition => this.lookup[type];
//   public getCategories = (): Array<string> => [...new Set(this.activities.map(x => x.category))];
//
//   public load(activities: Array<ActivityDefinition>) {
//     this.updateActivities(activities);
//   }
//
//   public addActivity = (activity: ActivityDefinition) => {
//     this.updateActivities([...this.activities, activity]);
//   };
//
//   public addActivities = (activities: ActivityDefinition[]) => {
//     this.updateActivities([...this.activities, ...activities]);
//   };
//
//   private updateActivities = (value: ActivityDefinition[]) => {
//     this.activities = [...value];
//     this.updateLookup(value);
//   };
//
//   private updateLookup = (value: ActivityDefinition[]) => {
//     for (const activity of value) {
//       this.lookup[activity.type] = activity;
//     }
//   };
// }
//
// export default new ActivityDefinitionStore();
