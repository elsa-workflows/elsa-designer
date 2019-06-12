import {ActivityComponent} from "../models";

type ActivityMap = {
  [typeName: string]: ActivityComponent
};

export class ActivityDefinitionStore {
  private activities: ActivityComponent[] = [];
  private lookup: ActivityMap = {};

  public getActivities = () => [...this.activities];
  public findActivityByType = (type: string) => this.lookup[type];
  public getCategories = () => [...new Set(this.activities.map(x => x.category))];

  public addActivity = (activity: ActivityComponent) => {
    this.updateActivities([...this.activities, activity]);
  };

  public addActivities = (activities: ActivityComponent[]) => {
    this.updateActivities([...this.activities, ...activities]);
  };

  private updateActivities = (value: ActivityComponent[]) => {
    this.activities = value;
    this.updateLookup(value);
  };

  private updateLookup = (value: ActivityComponent[]) => {
    for (const activity of value) {
      this.lookup[activity.type] = activity;
    }
  };
}

export default new ActivityDefinitionStore();
