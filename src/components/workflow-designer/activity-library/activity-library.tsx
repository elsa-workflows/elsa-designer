import { Component, Method, Prop } from '@stencil/core';
import { ActivityDefinition } from "../../../models";
import { Store } from "@stencil/redux";
import { RootState } from "../../../redux/reducers";
import { Action, addActivityDefinition } from "../../../redux/actions";

@Component({
  tag: 'wf-activity-library',
  shadow: true
})
export class ActivityLibrary {

  @Prop({ context: 'store' })
  store: Store<RootState, Action>;

  addActivityDefinition!: typeof addActivityDefinition;

  @Method()
  async registerActivity(activityDefinition: ActivityDefinition) {
    this.addActivityDefinition(activityDefinition);
  }

  componentWillLoad(){
    this.store.mapDispatchToProps(this, { addActivityDefinition });
  }
}
