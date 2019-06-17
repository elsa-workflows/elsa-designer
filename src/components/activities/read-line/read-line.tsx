import {Component, Element, h, Prop} from '@stencil/core';
import activityDefinitionStore from '../../../services/ActivityDefinitionStore';
import {Activity, ActivityComponent, RenderResult} from "../../../models";
import {FormUpdater} from "../../../utils";

@Component({
  tag: 'wf-read-line',
  shadow: true
})
export class ReadLine implements ActivityComponent {

  @Element()
  el: HTMLElement;

  @Prop({reflect: true})
  type: string = "ReadLine";

  @Prop({reflect: true})
  displayName: string = "Read Line";

  @Prop({reflect: true})
  description: string = "Read text from standard in";

  @Prop({reflect: true})
  category: string = "Console";

  public componentDidLoad() {
    activityDefinitionStore.addActivity(this);
  }

  getOutcomes(_: Activity): string[] {
    return ['next'];
  }

  displayTemplate(activity: Activity): RenderResult {
    const description = activity.state.variableName
      ? <p>Store input in <strong>{activity.state.variableName}</strong></p>
      : <p>{this.description}</p>;

    return (
      <div>
        <h5>{this.displayName}</h5>
        {description}
      </div>
    );
  }

  editorTemplate(activity: Activity): RenderResult {
    return (<div class="form-group">
      <label htmlFor="variableName">Variable Name</label>
      <input id="variableName" name="variableName" type="text" class="form-control" value={activity.state.variableName} />
      <small class="form-text text-muted">The name of the variable to store the input to.</small>
    </div>);
  }

  updateEditor(activity: Activity, formData: FormData): Activity {
    return FormUpdater.updateEditor(activity, formData);
  }
}
