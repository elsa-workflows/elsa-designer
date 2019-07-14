import {Component, Element, Prop} from '@stencil/core';
import { ActivityDefinition as ActivityDefinitionModel, ActivityPropertyDescriptor } from "../../../models";
import { Store } from "@stencil/redux";
import { RootState } from "../../../redux/reducers";
import { Action, addActivityDefinition } from "../../../redux/actions";

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

  @Prop({ context: 'store' })
  store: Store<RootState, Action>;

  properties: Array<ActivityPropertyDescriptor> = [];

  addActivityDefinition!: typeof addActivityDefinition;

  getOutcomes(){
    return this.outcomes.split(',').map(x => x.trim());
  }

  componentWillLoad(){
    this.store.mapDispatchToProps(this, { addActivityDefinition });
  }

  componentDidLoad() {
    const propertyElements = this.el.querySelectorAll('wf-activity-definition-property') as NodeListOf<HTMLWfActivityDefinitionPropertyElement>;

    propertyElements.forEach(value => {
      this.properties.push(value);
    });

    addActivityDefinition(this);
  }
}
