import { Component, Method, Prop} from '@stencil/core';
import activityDefinitionStore from '../../../services/activity-definition-store';
import { ActivityDefinition } from "../../../models";

@Component({
  tag: 'wf-activity-library',
  shadow: true
})
export class ActivityLibrary {

  @Method()
  async registerActivity(activity: ActivityDefinition) {
    activityDefinitionStore.addActivity(activity);
  }
}
