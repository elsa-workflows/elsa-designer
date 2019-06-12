import {Component, Element, h, Prop} from '@stencil/core';
import activityDefinitionStore from '../../services/ActivityDefinitionStore';
import {Activity, ActivityComponent, RenderResult} from "../../models";
import {FormUpdater} from "../../utils/form-updater";

@Component({
  tag: 'wf-set-variable',
  shadow: true
})
export class SetVariable implements ActivityComponent {

  @Element()
  el: HTMLElement;

  @Prop({reflect: true})
  type: string = "SetVariable";

  @Prop({reflect: true})
  displayName: string = "Set Variable";

  @Prop({reflect: true})
  description: string = "Set a variable on the workflow";

  @Prop({reflect: true})
  category: string = "Primitives";

  public componentDidLoad() {
    activityDefinitionStore.addActivity(this);
  }

  getOutcomes(_: Activity): string[] {
    return ['next'];
  }

  displayTemplate(activity: Activity): RenderResult {
    const description = activity.state.variableName
      ? <p>{activity.state.variableName} = {activity.state.valueExpression}</p>
      : <p>{this.description}</p>;

    return (
      <div>
        <h5>{this.displayName}</h5>
        {description}
      </div>
    );
  }

  editorTemplate(activity: Activity): RenderResult {
    return (
      <host>
        <div class="form-group">
          <label htmlFor="variableName">Variable Name</label>
          <input id="variableName" name="variableName" type="text" class="form-control" value={activity.state.variableName} />
          <small class="form-text text-muted">The name of the variable to store the value into.</small>
        </div>
        <div class="form-group">
          <label htmlFor="valueExpression">Value Expression</label>
          <input id="valueExpression" name="valueExpression" type="text" class="form-control" value={activity.state.valueExpression} />
          <small class="form-text text-muted">An expression that evaluates to the value to store in the variable.</small>
        </div>
      </host>
    );
  }

  updateEditor(activity: Activity, formData: FormData): Activity {
    return FormUpdater.updateEditor(activity, formData);
  }
}
