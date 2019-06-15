import {Component, Element, Prop} from '@stencil/core';
import {Connection as ConnectionModel} from "../../../models/connection";

@Component({
  tag: 'wf-connection',
  shadow: true
})
export class Connection {

  @Element()
  el: HTMLElement;

  @Prop({reflect: true, attribute: 'source-id'})
  sourceActivityId: string;

  @Prop({reflect: true, attribute: 'destination-id'})
  destinationActivityId: string;

  @Prop({reflect: true, attribute: 'outcome'})
  outcome: string;

  static getModel = (element: HTMLWfConnectionElement): ConnectionModel => ({
      sourceActivityId: element.sourceActivityId,
      destinationActivityId: element.destinationActivityId,
      outcome: element.outcome
  });
}
