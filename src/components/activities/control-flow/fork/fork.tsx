import { Component, Prop } from '@stencil/core';
import { Activity } from "../../../../models";
import { Store } from "@stencil/redux";
import { RootState } from "../../../../redux/reducers";
import { Action, addActivityDefinition } from "../../../../redux/actions";
import { ComponentHelper } from "../../../../utils/ComponentHelper";

@Component({
  tag: 'wf-fork',
  shadow: true
})
export class Fork {

  @Prop({ context: 'store' })
  store: Store<RootState, Action>;

  @Prop({ reflect: true })
  type: string = "Fork";

  @Prop({ reflect: true })
  displayName: string = "Fork";

  @Prop({ reflect: true })
  description: string = "Fork workflow execution into multiple branches.";

  @Prop({ reflect: true })
  category: string = "Control Flow";

  addActivityDefinition!: typeof addActivityDefinition;

  async componentWillLoad(){
    await ComponentHelper.rootComponentReady();
    this.store.mapDispatchToProps(this, { addActivityDefinition });
  }

  componentDidLoad() {
    this.addActivityDefinition({
        type: this.type,
        displayName: this.displayName,
        description: this.description,
        category: this.category,
        properties: [{
          name: 'branches',
          type: 'text',
          label: 'Branches',
          hint: 'Enter one or more names representing branches, separated with a comma. Example: Branch 1, Branch 2'
        }],
        getOutcomes: (activity: Activity): string[] => {
          const state = activity.state;
          const branchesText = state.branches;
          const branches = !!state.branches ? branchesText.split(',').map(x => x.trim()) : [];
          return [...branches];
        }
      }
    );
  }
}
