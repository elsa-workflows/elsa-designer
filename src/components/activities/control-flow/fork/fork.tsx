import { Component, Prop } from '@stencil/core';
import activityDefinitionStore from '../../../../services/activity-definition-store';
import { Activity, ActivityDefinition} from "../../../../models";

@Component({
  tag: 'wf-fork',
  shadow: true
})
export class Fork implements ActivityDefinition {

  @Prop({ reflect: true })
  type: string = "Fork";

  @Prop({ reflect: true })
  displayName: string = "Fork";

  @Prop({ reflect: true })
  description: string = "Fork workflow execution into multiple branches.";

  @Prop({ reflect: true })
  category: string = "Control Flow";

  properties = [{
    name: 'branches',
    type: 'text',
    label: 'Branches',
    hint: 'Enter one or more names representing branches, separated with a comma. Example: Branch 1, Branch 2'
  }];

  public componentDidLoad() {
    activityDefinitionStore.addActivity(this);
  }

  getOutcomes(activity: Activity): string[] {
    const state = activity.state;
    const branchesText = state.branches;
    const branches = !!state.branches ? branchesText.split(',').map(x => x.trim()) : [];
    return [...branches];
  }
}
