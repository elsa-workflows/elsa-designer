import {Component, h, Method, Prop} from '@stencil/core';
import activityDefinitionStore from '../../services/ActivityDefinitionStore';
import {ActivityComponent} from "../../models";

@Component({
  tag: 'wf-activity-library',
  shadow: true
})
export class ActivityLibrary {

  @Prop({reflect: true })
  myTest: string;

  @Method()
  async registerActivity(activity: ActivityComponent) {
    activityDefinitionStore.addActivity(activity);
  }

  public render() {
    return (
      <host>
        <slot />
      </host>
    );
  }
}
