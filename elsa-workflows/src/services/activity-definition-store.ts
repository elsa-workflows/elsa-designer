import {ActivityDefinition} from "../models";
import {injectable} from "inversify";
import {PropertyTypes} from "./property-types";

@injectable()
export class ActivityDefinitionStore {

  private items: Array<ActivityDefinition> = [];

  constructor() {
    this.items = this.loadActivityDefinitions();
  }

  initialize = (items?: Array<ActivityDefinition>) => this.items = !!items ? [...this.items] : [];
  addRange = (items: Array<ActivityDefinition>) => this.items = [...this.items, ...items];
  list = () => this.items;
  find = (predicate: (x: ActivityDefinition) => boolean) => this.items.find(predicate);
  get = (type: string) => this.items.find(x => x.type === type);
  contains = (type: string): boolean => this.items.findIndex(x => x.type === type) >= 0;

  private loadActivityDefinitions = ()=> {
    const readLine: ActivityDefinition = {
      type: 'ReadLine',
      displayName: 'Read Line',
      description: 'Read a line of text from an input stream.',
      category: 'Console',
      icon: 'fas fa-terminal',
      outcomes: ['Done'],
    };

    const writeLine: ActivityDefinition = {
      type: 'WriteLine',
      displayName: 'Write Line',
      description: 'Write a line of text to an output stream.',
      category: 'Console',
      icon: 'fas fa-terminal',
      outcomes: ['Done'],
      properties: [{
        name: 'Text',
        type: PropertyTypes.Expression,
        label: 'Text',
        hint: 'The text to write.'
      }]
    };

    const httpRequestReceived: ActivityDefinition = {
      type: 'HttpRequestReceived',
      displayName: 'Receive HTTP Request',
      description: 'Block execution until an HTTP request is received.',
      category: 'HTTP',
      icon: 'fas fa-cloud',
      outcomes: ['Done'],
      properties: [{
        name: 'RequestPath',
        type: PropertyTypes.Text,
        label: 'Request Path',
        hint: 'The request path that invokes this workflow.'
      }]
    };

    return [readLine, writeLine, httpRequestReceived];
  };
}
