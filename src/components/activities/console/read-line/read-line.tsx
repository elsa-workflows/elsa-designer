import { Component, Prop } from '@stencil/core';
import { Activity, ActivityDefinition, RenderDesignerResult } from "../../../../models";
import { Store } from "@stencil/redux";
import { Action, addActivityDefinition } from "../../../../redux/actions";
import { RootState } from "../../../../redux/reducers";
import ActivityManager from '../../../../services/activity-manager';
import { ComponentHelper } from "../../../../utils/ComponentHelper";

@Component({
  tag: 'wf-read-line',
  shadow: true
})
export class ReadLine {

  @Prop({ context: 'store' })
  store: Store<RootState, Action>;

  @Prop({ reflect: true })
  type: string = "ReadLine";

  @Prop({ reflect: true, attr: 'display-name' })
  displayName: string = "Read Line";

  @Prop({ reflect: true })
  description: string = "Read text from standard in.";

  @Prop({ reflect: true })
  category: string = "Console";

  static onRenderDesigner(activity: Activity, definition: ActivityDefinition): RenderDesignerResult {
    const variableName = activity.state.variableName;

    return {
      description: !!variableName
        ? `Read text from standard in and store into <strong>${ variableName }</strong>.`
        : definition.description
    };
  }

  addActivityDefinition!: typeof addActivityDefinition;

  async componentWillLoad() {
    await ComponentHelper.rootComponentReady();
    this.store.mapDispatchToProps(this, { addActivityDefinition });

    ActivityManager.addHandler(this.type, {
      renderDesigner: ReadLine.onRenderDesigner
    })
  }

  componentDidLoad() {
    this.addActivityDefinition({
        type: this.type,
        displayName: this.displayName,
        description: this.description,
        category: this.category,
        properties: [{
          name: 'variableName',
          type: 'text',
          label: 'Variable Name',
          hint: 'The name of the variable to store the value into.'
        }],
        getOutcomes: (_: Activity): string[] => {
          return ['Done'];
        }
      }
    );
  }
}
