import {Component, Element, h, Prop} from '@stencil/core';
import activityDefinitionStore from '../../services/ActivityDefinitionStore';
import {Activity, ActivityComponent, RenderResult} from "../../models";
import {FormUpdater} from "../../utils/form-updater";

@Component({
  tag: 'wf-log',
  shadow: true
})
export class Log implements ActivityComponent {

  @Element()
  el: HTMLElement;

  @Prop({reflect: true})
  type: string = "Log";

  @Prop({reflect: true})
  displayName: string = "Log";

  @Prop({reflect: true})
  description: string = "Log a message";

  @Prop({reflect: true})
  category: string = "Primitives";

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
        <p>{activity.state.messageExpression ? activity.state.messageExpression : this.description}</p>
      </div>
    );
  }

  editorTemplate(activity: Activity): RenderResult {
    return (<div class="form-group">
      <label htmlFor="messageExpression">Message</label>
      <input id="messageExpression" name="messageExpression" type="text" class="form-control" value={activity.state.messageExpression} />
      <small class="form-text text-muted">The message to log.</small>
    </div>);
  }

  updateEditor(activity: Activity, formData: FormData): Activity {
    return FormUpdater.updateEditor(activity, formData);
  }
}
