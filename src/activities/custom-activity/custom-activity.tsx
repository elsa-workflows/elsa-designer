import {Component, Element, h, Prop} from '@stencil/core';
import Handlebars from 'handlebars/dist/handlebars';
import activityDefinitionStore from '../../services/ActivityDefinitionStore';
import {FormUpdater} from "../../utils/form-updater";
import {Activity, ActivityComponent, RenderResult} from "../../models";


@Component({
  tag: 'wf-custom-activity',
  shadow: true
})
export class CustomActivity implements ActivityComponent {

  @Element()
  el: HTMLWfCustomActivityElement;

  @Prop({reflect: true})
  type: string;

  @Prop({reflect: true})
  displayName: string;

  @Prop({reflect: true})
  description: string;

  @Prop({reflect: true})
  category: string;

  @Prop()
  outcomes: string;

  public componentDidLoad() {
    activityDefinitionStore.addActivity(this);
  }

  private getDefaultDisplay = _ => {
    return (
      <div>
        <h5>{this.displayName}</h5>
        <p>{this.description}</p>
      </div>
    );
  };

  private getDefaultEditor = () => (
    <div>
    </div>
  );

  displayTemplate(activity: Activity): RenderResult {
    const displayTemplate: any = this.el.querySelector('[slot=display]');

    if (!displayTemplate)
      return this.getDefaultDisplay(activity);

    const source = displayTemplate.innerHTML;
    const template = Handlebars.compile(source);
    return template({...activity.state, activity});
  }

  editorTemplate(activity: Activity): RenderResult {
    const editorTemplate: any = this.el.querySelector('[slot=editor]');

    if (!editorTemplate)
      return this.getDefaultEditor();

    const source = editorTemplate.innerHTML;
    const template = Handlebars.compile(source);
    return template({...activity.state, activity});
  }

  getOutcomes(_: Activity): string[] {
    return this.outcomes ? this.outcomes.split(",").map(x => x.trim()) : [];
  }

  updateEditor(activity: Activity, formData: FormData): Activity {
    return FormUpdater.updateEditor(activity, formData);
  }
}
