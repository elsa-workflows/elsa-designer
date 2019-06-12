import {Component, Element, Prop} from '@stencil/core';
import {Activity as ActivityModel} from "../../models/activity";

@Component({
  tag: 'wf-activity',
  shadow: true
})
export class Activity {

  @Element()
  el: HTMLElement;

  @Prop({reflect: true})
  type: string;

  @Prop({reflect: true, attribute: 'activity-id'})
  activityId: string;

  @Prop({reflect: true})
  left: number;

  @Prop({reflect: true})
  top: number;

  static getModel = (element: HTMLWfActivityElement): ActivityModel => {
    return ({
      id: element.activityId,
      type: element.type,
      left: element.left,
      top: element.top,
      state: {}
    });
  };
}
