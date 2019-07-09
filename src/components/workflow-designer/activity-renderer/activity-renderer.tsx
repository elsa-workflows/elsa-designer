import { Component, h, Host, Prop } from '@stencil/core';
import {
  Activity, ActivityDefinition,
  ActivityDisplayMode,
  ActivityPropertyDescriptor,
  RenderResult
} from "../../../models";

@Component({
  tag: 'wf-activity-renderer',
  styleUrl: 'activity-renderer.scss',
  shadow: false
})
export class ActivityRenderer {

  @Prop()
  activityDefinition: ActivityDefinition;

  @Prop()
  activity: Activity;

  @Prop()
  displayMode: ActivityDisplayMode = ActivityDisplayMode.Design;

  render() {
    switch (this.displayMode) {
      case ActivityDisplayMode.Design:
        return this.renderDesigner();
      case ActivityDisplayMode.Edit:
        return this.renderEditor();
    }
  }

  renderDesigner() {
    const definition = this.activityDefinition;

    return (
      <div>
        <h5>{ definition.displayName }</h5>
        <p>{ definition.description }</p>
      </div>
    );
  }

  renderEditor() {
    const activity = this.activity;
    const definition = this.activityDefinition;
    const properties = definition.properties;

    return (
      <Host>
        { properties.map(x => {
          const propertyValue = activity.state[x.name];

          return (<div class="form-group">
            <label htmlFor={ x.name }>{ x.label }</label>
            <input id={ x.name } name={ x.name } type="text" class="form-control" value={ propertyValue } />
            { this.renderHint(x) }
          </div>);
        })
        }
      </Host>
    );
  }

  renderHint(propertyDescriptor: ActivityPropertyDescriptor): RenderResult {
    if (!propertyDescriptor.hint)
      return null;

    return <small class="form-text text-muted">{ propertyDescriptor.hint }</small>;
  }
}
