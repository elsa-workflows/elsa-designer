import { Component, h, Host, Prop } from '@stencil/core';
import {
  Activity,
  ActivityDefinition,
  ActivityDisplayMode,
  ActivityPropertyDescriptor,
  RenderResult
} from "../../../models";
import ActivityManager from '../../../services/activity-manager';

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

    if (!this.activity || !this.activityDefinition)
      return null;

    switch (this.displayMode) {
      case ActivityDisplayMode.Design:
        return this.renderDesigner();
      case ActivityDisplayMode.Edit:
        return this.renderEditor();
    }
  }

  renderDesigner() {
    const activity = this.activity;
    const definition = this.activityDefinition;

    const result = ActivityManager.renderDesigner(activity, definition);

    return (
      <div>
        <h5>{ definition.displayName }</h5>
        <p innerHTML={ result.description }/>
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
          let propertyValue = activity.state[x.name];

          if (!propertyValue && !!x.defaultValue)
            propertyValue = x.defaultValue();

          return (<div class="form-group">
            { this.renderInput(activity, x, propertyValue) }
            { this.renderHint(x) }
          </div>);
        })
        }
      </Host>
    );
  }

  renderInput = (activity: Activity, property: ActivityPropertyDescriptor, propertyValue: any) : RenderResult => {
    switch(property.type)
    {
      case 'expression':
      case 'text':
      default:
        return this.renderTextInput(activity, property, propertyValue);
    }
  };

  renderTextInput = (_: Activity, property: ActivityPropertyDescriptor, propertyValue: any): RenderResult => {
    return [<label htmlFor={ property.name }>{ property.label }</label>,
      <input id={ property.name } name={ property.name } type="text" class="form-control" value={ propertyValue } />];
  };

  renderHint = (propertyDescriptor: ActivityPropertyDescriptor): RenderResult => {
    if (!propertyDescriptor.hint)
      return null;

    return <small class="form-text text-muted">{ propertyDescriptor.hint }</small>;
  };
}
