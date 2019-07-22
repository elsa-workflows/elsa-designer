import { Component, Prop } from '@stencil/core';
import { Activity, ActivityDefinition, RenderDesignerResult } from "../../../../models";
import { Store } from "@stencil/redux";
import { RootState } from "../../../../redux/reducers";
import { Action, addActivityDefinition } from "../../../../redux/actions";
import ActivityManager from '../../../../services/activity-manager';
import { ComponentHelper } from "../../../../utils/ComponentHelper";

@Component({
  tag: 'wf-switch',
  shadow: true
})
export class Switch {

  @Prop({ context: 'store' })
  store: Store<RootState, Action>;

  @Prop({ reflect: true })
  type: string = 'Switch';

  @Prop({ reflect: true })
  displayName: string = 'Switch';

  @Prop({ reflect: true })
  description: string = 'Switch execution based on a given expression.';

  @Prop({ reflect: true })
  category: string = 'Control Flow';

  addActivityDefinition!: typeof addActivityDefinition;

  static onRenderDesigner(activity: Activity, definition: ActivityDefinition): RenderDesignerResult {
    const expression = activity.state.expression;

    return {
      description: !!expression
        ? `Switch execution based on <strong>${ expression }</strong>.`
        : definition.description
    };
  }

  async componentWillLoad() {
    await ComponentHelper.rootComponentReady();
    this.store.mapDispatchToProps(this, { addActivityDefinition });

    ActivityManager.addHandler(this.type, {
      renderDesigner: Switch.onRenderDesigner,
    })
  }

  componentDidLoad() {
    this.addActivityDefinition({
        type: this.type,
        displayName: this.displayName,
        description: this.description,
        category: this.category,
        properties: [{
          name: 'expression',
          type: 'expression',
          label: 'Expression',
          hint: 'The expression to evaluate. The evaluated value will be used to switch on.'
        },
          {
            name: 'cases',
            type: 'list',
            label: 'Cases',
            hint: 'A comma-separated list of possible outcomes of the expression.'
          }],
        getOutcomes: (activity: Activity): string[] => {
          const cases = activity.state.cases as Array<object> || [];
          return cases.map(x => x.toString());
        }
      }
    );
  }
}
