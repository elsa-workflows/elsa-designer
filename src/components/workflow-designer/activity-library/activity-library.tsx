import {Component, h, Method} from '@stencil/core';
import activityDefinitionStore from '../../../services/ActivityDefinitionStore';
import {ActivityComponent} from "../../../models";

@Component({
  tag: 'wf-activity-library',
  shadow: true
})
export class ActivityLibrary {

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
