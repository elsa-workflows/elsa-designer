import { Component, Prop } from '@stencil/core';
import { Activity, ActivityDefinition, RenderDesignerResult } from "../../../../models";
import { Store } from "@stencil/redux";
import { RootState } from "../../../../redux/reducers";
import { Action, addActivityDefinition } from "../../../../redux/actions";
import ActivityManager from '../../../../services/activity-manager';

@Component({
  tag: 'wf-write-line',
  shadow: true
})
export class WriteLine {

  @Prop({ context: 'store' })
  store: Store<RootState, Action>;

  @Prop({ reflect: true })
  type: string = "WriteLine";

  @Prop({ reflect: true })
  displayName: string = "Write Line";

  @Prop({ reflect: true })
  description: string = "Write text to standard out.";

  @Prop({ reflect: true })
  category: string = "Console";

  addActivityDefinition!: typeof addActivityDefinition;

  static onRenderDesigner(activity: Activity, definition: ActivityDefinition): RenderDesignerResult {
    const textExpression = activity.state.textExpression;

    return {
      description: !!textExpression
        ? `Write <strong>${ textExpression }</strong> to standard out.`
        : definition.description
    };
  }

  componentWillLoad() {
    this.store.mapDispatchToProps(this, { addActivityDefinition });

    ActivityManager.addHandler(this.type, {
      renderDesigner: WriteLine.onRenderDesigner
    })
  }

  componentDidLoad() {
    this.addActivityDefinition({
        type: this.type,
        displayName: this.displayName,
        description: this.description,
        category: this.category,
        properties: [{
          name: 'textExpression',
          type: 'expression',
          label: 'Text',
          hint: 'The text to write.'
        }],
        getOutcomes: (_: Activity): string[] => {
          return ['Done'];
        }
      }
    );
  }
}
