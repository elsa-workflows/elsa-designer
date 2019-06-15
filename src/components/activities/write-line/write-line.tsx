import {Component, Element, h, Prop} from '@stencil/core';
import activityDefinitionStore from '../../../services/ActivityDefinitionStore';
import {Activity, ActivityComponent, RenderResult} from "../../../models";
import {FormUpdater} from "../../../utils/form-updater";

@Component({
  tag: 'wf-write-line',
  shadow: true
})
export class WriteLine implements ActivityComponent {

  @Element()
  el: HTMLElement;

  @Prop({reflect: true})
  type: string = "WriteLine";

  @Prop({reflect: true})
  displayName: string = "Write Line";

  @Prop({reflect: true})
  description: string = "Write text to standard out";

  @Prop({reflect: true})
  category: string = "Console";

  public componentDidLoad() {
    activityDefinitionStore.addActivity(this);
  }

  getOutcomes(_: Activity): string[] {
    return ['next'];
  }

  displayTemplate(activity: Activity): RenderResult {
    return (
      <div>
        <h5>{this.displayName}</h5>
        <p>{activity.state.textExpression ? activity.state.textExpression : this.description}</p>
      </div>
    );
  }

  editorTemplate(activity: Activity): RenderResult {
    return (<div class="form-group">
      <label htmlFor="textExpression">Text</label>
      <input id="textExpression" name="textExpression" type="text" class="form-control" value={activity.state.textExpression} />
      <small class="form-text text-muted">The text to write.</small>
    </div>);
  }

  updateEditor(activity: Activity, formData: FormData): Activity {
    return FormUpdater.updateEditor(activity, formData);
  }
}
