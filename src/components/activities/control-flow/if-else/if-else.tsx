import { Component, Prop } from '@stencil/core';
import { Activity, ActivityDefinition, RenderDesignerResult } from "../../../../models";
import { Store } from "@stencil/redux";
import { RootState } from "../../../../redux/reducers";
import { Action, addActivityDefinition } from "../../../../redux/actions";
import ActivityManager from '../../../../services/activity-manager';
import { ComponentHelper } from "../../../../utils/ComponentHelper";

@Component({
  tag: 'wf-if-else',
  shadow: true
})
export class IfElse {

  @Prop({ context: 'store' })
  store: Store<RootState, Action>;

  @Prop({ reflect: true })
  type: string = 'IfElse';

  @Prop({ reflect: true })
  displayName: string = 'If/Else';

  @Prop({ reflect: true })
  description: string = 'Evaluate a Boolean expression and continue execution depending on the result.';

  @Prop({ reflect: true })
  category: string = 'Control Flow';

  addActivityDefinition!: typeof addActivityDefinition;

  static onRenderDesigner(activity: Activity, definition: ActivityDefinition): RenderDesignerResult {
    const expression = activity.state.expression;

    return {
      description: !!expression
        ? `Evaluate <strong>${expression}</strong> and continue execution depending on the result.`
        : definition.description
    };
  }

  static updateEditor(activity: Activity, formData: FormData): Activity {
    const newState = { ...activity.state };

    newState.expression = formData.get('expression');

    return { ...activity, state: newState };
  }

  async componentWillLoad() {
    await ComponentHelper.rootComponentReady();
    this.store.mapDispatchToProps(this, { addActivityDefinition });

    ActivityManager.addHandler(this.type, {
      renderDesigner: IfElse.onRenderDesigner,
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
        }],
        getOutcomes: (_: Activity): string[] => ['True', 'False']
      }
    );
  }
}
