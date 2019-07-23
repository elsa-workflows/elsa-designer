import { Component, Prop } from '@stencil/core';
import { Store } from "@stencil/redux";
import { RootState } from "../../../../redux/reducers";
import { Action, addActivityDefinition } from "../../../../redux/actions";
import { ComponentHelper } from "../../../../utils/ComponentHelper";
import { OutcomeNames } from "../../../../models/outcome-names";

@Component({
  tag: 'wf-join',
  shadow: true
})
export class Fork {

  @Prop({ context: 'store' })
  store: Store<RootState, Action>;

  @Prop({ reflect: true })
  type: string = "Join";

  @Prop({ reflect: true })
  displayName: string = "Join";

  @Prop({ reflect: true })
  description: string = "Merge workflow execution back into a single branch.";

  @Prop({ reflect: true })
  category: string = "Control Flow";

  addActivityDefinition!: typeof addActivityDefinition;

  async componentWillLoad() {
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
          name: 'joinMode',
          type: 'text',
          label: 'Join Mode',
          hint: 'Either \'WaitAll\' or \'WaitAny\''
        }],
        designer: {
          description: 'x => !!x.state.joinMode ? `Merge workflow execution back into a single branch using mode <strong>${ x.state.joinMode }</strong>` : x.definition.description',
          outcomes: [OutcomeNames.Done]
        }
      }
    );
  }
}
