import {inject, injectable, multiInject} from "inversify";
import {Render} from "./types";
import {HtmlFragment} from "../components/html-fragment/html-fragment";
import {h} from "@stencil/core";
import {Activity} from "../models";
import {ActivityDefinitionStore} from "./activity-definition-store";
import {ActivityDisplayContext, ActivityDriver} from "./activity-driver";
import {Symbols} from "./symbols";

@injectable()
export class DisplayManager {

  constructor(
    @inject(ActivityDefinitionStore) private activityDefinitionStore: ActivityDefinitionStore,
    @multiInject(Symbols.ActivityDriver) private drivers: Array<ActivityDriver>
  ) {
  }

  displayDesigner = async (activity: Activity): Promise<Render> => this.invokeDriversFor(activity, (driver, context) => driver.displayDesigner(context));
  displayEditor = async (activity: Activity): Promise<Render> => this.invokeDriversFor(activity, (driver, context) => driver.displayEditor(context));
  getDriversFor = (activityType: string): Array<ActivityDriver> => this.drivers.filter(x => x.activityType === activityType && this.activityDefinitionStore.contains(activityType));

  updateActivity = async (activity: Activity, formData: FormData): Promise<void> => {
    const activityDrivers = this.getDriversFor(activity.type);
    const displayContext = this.createDisplayContextFor(activity);
    await Promise.all(activityDrivers.map(async x => await x.updateActivity(displayContext, formData)));
  };

  private invokeDriversFor = async (activity: Activity, displayAction: (driver: ActivityDriver, context: ActivityDisplayContext) => Promise<Render>) => {
    const activityDrivers = this.getDriversFor(activity.type);
    const displayContext = this.createDisplayContextFor(activity);
    let renders = await Promise.all(activityDrivers.map(async x => await displayAction(x, displayContext)));

    renders = renders.filter(x => !!x);
    return DisplayManager.normalize(renders);
  };

  private createDisplayContextFor = (activity: Activity): ActivityDisplayContext => {
    const activityDefinition = this.activityDefinitionStore.get(activity.type);
    return {activity: activity, state: activity.state || {}, activityDefinition};
  };

  // A 'Render' can be an array of html string literals, JSX nodes (vdoms) or Render objects themselves.
  // So for each element, see if it is an array and map each element to either an HTML fragment or return the node as-is.
  private static normalize = (render: Render): Render => {
    if (Array.isArray(render))
      return render.map(DisplayManager.normalize);
    if (typeof render === 'string')
      return <HtmlFragment content={render}/>;
    else return render;
  };

}
