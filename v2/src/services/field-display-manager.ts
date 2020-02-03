import {ActivityPropertyDescriptor} from "../models";
import {injectable, multiInject} from "inversify";
import {FieldDisplayContext, FieldDriver} from "./field-driver";
import {Symbols} from "./symbols";
import {ActivityState, Node} from "./types";
import {NodeUtils} from "../utils/node-utils";

@injectable()
export class FieldDisplayManager {

  constructor(@multiInject(Symbols.FieldDriver) private drivers) {
  }

  display = async (descriptor: ActivityPropertyDescriptor, state: ActivityState): Promise<Node> => await this.invokeDriversFor(descriptor, state, (driver, context) => driver.display(context));
  getDriversFor = (context: FieldDisplayContext): Array<FieldDriver> => this.drivers.filter(x => x.supports(context));

  update = async (descriptor: ActivityPropertyDescriptor, state: ActivityState, formData: FormData): Promise<void> => {
    const displayContext = this.createDisplayContextFor(descriptor, state);
    const drivers = this.getDriversFor(displayContext);
    drivers.map(async x => await x.update(displayContext, formData));
  };

  private invokeDriversFor = async (descriptor: ActivityPropertyDescriptor, state: ActivityState, displayAction: (driver: FieldDriver, context: FieldDisplayContext) => Node): Promise<Node> => {
    const displayContext = this.createDisplayContextFor(descriptor, state);
    const drivers = this.getDriversFor(displayContext);
    let nodes = await Promise.all(drivers.map(async x => await displayAction(x, displayContext)));

    return NodeUtils.normalize(nodes);
  };

  private createDisplayContextFor = (descriptor: ActivityPropertyDescriptor, state: ActivityState): FieldDisplayContext => ({descriptor, state, value: state[descriptor.name]});
}
