import {inject, injectable, multiInject} from "inversify";
import {Node} from "./types";
import {h} from "@stencil/core";
import {Activity} from "../models";
import {ActivityDisplayContext, ActivityDriver} from "./activity-driver";
import {Symbols} from "./symbols";
import {NodeUtils} from "../utils/node-utils";
import {ActivityDescriptorStore} from "./activity-descriptor-store";

@injectable()
export class ActivityDisplayManager {

  constructor(
    @inject(ActivityDescriptorStore) private activityDescriptorStore: ActivityDescriptorStore,
    @multiInject(Symbols.ActivityDriver) private drivers: Array<ActivityDriver>
  ) {
  }

  displayDesigner = async (activity: Activity): Promise<Node> => this.invokeDriversFor(activity, (driver, context) => driver.displayDesigner(context));
  displayEditor = async (activity: Activity): Promise<Node> => this.invokeDriversFor(activity, (driver, context) => driver.displayEditor(context));
  getDriversFor = (context: ActivityDisplayContext): Array<ActivityDriver> => this.drivers.filter(x => x.supportsActivity(context));

  updateActivity = async (activity: Activity, formData: FormData): Promise<void> => {
    const displayContext = await this.createDisplayContextFor(activity);
    const activityDrivers = this.getDriversFor(displayContext);
    await Promise.all(activityDrivers.map(async x => await x.updateActivity(displayContext, formData)));
  };

  private invokeDriversFor = async (activity: Activity, displayAction: (driver: ActivityDriver, context: ActivityDisplayContext) => Promise<Node>) => {
    const displayContext = await this.createDisplayContextFor(activity);
    const activityDrivers = this.getDriversFor(displayContext);
    let nodes = await Promise.all(activityDrivers.map(async x => await displayAction(x, displayContext)));

    return NodeUtils.normalize(nodes);
  };

  private createDisplayContextFor = async (activity: Activity): Promise<ActivityDisplayContext> => {
    const activityDescriptor = await this.activityDescriptorStore.get(activity.type);
    return {activity: activity, state: activity.state || {}, activityDescriptor: activityDescriptor};
  };
}
