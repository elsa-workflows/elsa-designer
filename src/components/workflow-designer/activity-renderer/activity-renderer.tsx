import { Component, h, Host, Method, Prop } from '@stencil/core';
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
        <p innerHTML={ result.description } />
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

          return (
            <div class="form-group">
              { this.renderInput(activity, x, propertyValue) }
              { this.renderHint(x) }
            </div>
          );
        })
        }
      </Host>
    );
  }

  @Method()
  async updateEditor(formData: FormData) : Promise<Activity> {
    const activity = this.activity;
    const definition = this.activityDefinition;
    const properties = definition.properties;
    const newState = {...activity.state};

    for(const property of properties)
    {
      this.updateProperty(newState, property, formData);
    }

    debugger;
    return { ...activity, state: newState }
  }

  renderInput = (activity: Activity, property: ActivityPropertyDescriptor, propertyValue: any): RenderResult => {
    switch (property.type) {
      case 'expression':
        return this.renderExpressionInput(activity, property, propertyValue);
      case 'list':
        return this.renderListInput(activity, property, propertyValue);
      case 'text':
      default:
        return this.renderTextInput(activity, property, propertyValue);
    }
  };

  updateProperty = (state: any, property: ActivityPropertyDescriptor, formData: FormData) => {
    switch (property.type) {
      case 'expression':
        this.updateExpressionInput(state, property, formData);
        break;
      case 'list':
        this.updateListInput(state, property, formData);
        break;
      case 'text':
      default:
        this.updateTextInput(state, property, formData);
    }
  };

  renderExpressionInput = (_: Activity, property: ActivityPropertyDescriptor, propertyValue: any): RenderResult => {
    return (<wf-field-editor-expression propertyDescriptor={ property } propertyValue={ propertyValue } />);
  };

  updateExpressionInput = (state: any, property: ActivityPropertyDescriptor, formData: FormData) => {
    const expressionPropertyName = `${property.name}_expression`;
    const syntaxPropertyName = `${property.name}_syntax`;

    state[expressionPropertyName] = formData.get(expressionPropertyName);
    state[syntaxPropertyName] = formData.get(syntaxPropertyName);
  };

  renderTextInput = (_: Activity, property: ActivityPropertyDescriptor, propertyValue: any): RenderResult => {
    return (<wf-property-editor-text propertyDescriptor={ property } propertyValue={ propertyValue } />);
  };

  updateTextInput = (state: any, property: ActivityPropertyDescriptor, formData: FormData) => {
    state[property.name] = formData.get(property.name);
  };

  renderListInput = (_: Activity, property: ActivityPropertyDescriptor, propertyValue: any): RenderResult => {
    debugger;
    return (<wf-field-editor-list propertyDescriptor={ property } propertyValue={ propertyValue } />);
  };

  updateListInput = (state: any, property: ActivityPropertyDescriptor, formData: FormData) => {
    const formValue = formData.get(property.name);
    const value = formValue ? formValue.toString() : '';
    state[property.name] = value.split(',').map(x => x.trim());
  };

  renderHint = (propertyDescriptor: ActivityPropertyDescriptor): RenderResult => {
    if (!propertyDescriptor.hint)
      return null;

    return <small class="form-text text-muted">{ propertyDescriptor.hint }</small>;
  };
}
