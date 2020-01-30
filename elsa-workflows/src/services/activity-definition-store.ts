import {ActivityDefinition} from "../models";
import {injectable} from "inversify";

@injectable()
export class ActivityDefinitionStore {

  private items: Array<ActivityDefinition> = [];

  constructor() {
  }

  public initialize = (items?: Array<ActivityDefinition>) => this.items = !!items ? [...this.items] : [];
  public addRange = (items: Array<ActivityDefinition>) => this.items = [...this.items, ...items];
  public list = () => this.items;
  public find = (predicate: (x: ActivityDefinition) => boolean) => this.items.find(predicate);
  public get = (type: string) => this.items.find(x => x.type === type);
}
