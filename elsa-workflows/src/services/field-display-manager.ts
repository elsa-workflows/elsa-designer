import {Activity, ActivityPropertyDescriptor} from "../models";
import {injectable, multiInject} from "inversify";
import {FieldDisplayContext, FieldDriver} from "./field-driver";
import {Symbols} from "./symbols";
import {ActivityState, Node} from "./types";
import {NodeUtils} from "../utils/node-utils";

@injectable()
export class FieldDisplayManager {

  constructor(@multiInject(Symbols.FieldDriver) private drivers) {
  }

  display = (descriptor: ActivityPropertyDescriptor, state: ActivityState): Node => this.invokeDriversFor(descriptor, state, (driver, context) => driver.display(context));
  getDriversFor = (context: FieldDisplayContext): Array<FieldDriver> => this.drivers.filter(x => x.supports(context));

  update = (descriptor: ActivityPropertyDescriptor, state: ActivityState, formData: FormData): void => {
    const displayContext = this.createDisplayContextFor(descriptor, state);
    const drivers = this.getDriversFor(displayContext);
    drivers.map(x => x.update(displayContext, formData));
  };

  private invokeDriversFor = (descriptor: ActivityPropertyDescriptor, state: ActivityState, displayAction: (driver: FieldDriver, context: FieldDisplayContext) => Node) => {
    const displayContext = this.createDisplayContextFor(descriptor, state);
    const drivers = this.getDriversFor(displayContext);
    let nodes = drivers.map(x => displayAction(x, displayContext));

    return NodeUtils.normalize(nodes);
  };

  private createDisplayContextFor = (descriptor: ActivityPropertyDescriptor, state: ActivityState): FieldDisplayContext => ({descriptor, state, value: state[descriptor.name]});
}
