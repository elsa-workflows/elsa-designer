import {Component, Element, Prop} from '@stencil/core';
import { ActivityDefinition as ActivityDefinitionModel, ActivityPropertyDescriptor } from "../../../models";
import activityDefinitionStore from '../../../services/activity-definition-store';

@Component({
  tag: 'wf-activity-definition',
  shadow: true
})
export class ActivityDefinition implements ActivityDefinitionModel {

  @Element()
  el: HTMLElement;

  @Prop({reflect: true})
  type: string;

  @Prop({reflect: true, attribute: 'display-name'})
  displayName: string;

  @Prop({reflect: true})
  description: string;

  @Prop({reflect: true})
  category: string;

  @Prop({reflect: true})
  outcomes: string = "Done";

  properties: Array<ActivityPropertyDescriptor> = [];

  getOutcomes(){
    return this.outcomes.split(',').map(x => x.trim());
  }

  componentDidLoad() {
    const propertyElements = this.el.querySelectorAll('wf-activity-definition-property') as NodeListOf<HTMLWfActivityDefinitionPropertyElement>;

    propertyElements.forEach(value => {
      this.properties.push(value);
    });

    activityDefinitionStore.addActivity(this);
  }
}
