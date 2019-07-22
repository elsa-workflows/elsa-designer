import {Component, Element, Prop} from '@stencil/core';
import { Activity, ActivityPropertyDescriptor } from "../../../models";
import { Store } from "@stencil/redux";
import { RootState } from "../../../redux/reducers";
import { Action, addActivityDefinition } from "../../../redux/actions";
import { ComponentHelper } from "../../../utils/ComponentHelper";
import ActivityManager from '../../../services/activity-manager';
import { DefaultActivityHandler } from "../../../services/default-activity-handler";

@Component({
  tag: 'wf-activity-definition',
  shadow: true
})
export class ActivityDefinition {

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

  addActivityDefinition!: typeof addActivityDefinition;

  async componentWillLoad(){
    await ComponentHelper.rootComponentReady();
    this.store.mapDispatchToProps(this, { addActivityDefinition });
  }

  componentDidLoad() {
    const propertyElements = this.el.querySelectorAll('wf-activity-definition-property') as NodeListOf<HTMLWfActivityDefinitionPropertyElement>;
    const properties: Array<ActivityPropertyDescriptor> = [];
    const outcomes = this.outcomes.split(',').map(x => x.trim());

    propertyElements.forEach(value => {
      properties.push(value);
    });

    this.addActivityDefinition({
        type: this.type,
        displayName: this.displayName,
        description: this.description,
        category: this.category,
        properties: properties,
        getOutcomes: (_: Activity): string[] => outcomes
      }
    );

    ActivityManager.addHandler(this.type, new DefaultActivityHandler());
  }
}
