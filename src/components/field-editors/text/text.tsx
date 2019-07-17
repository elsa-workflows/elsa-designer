import { Component, h, Host, Prop } from '@stencil/core';
import { ActivityPropertyDescriptor } from "../../../models";

@Component({
  tag: 'wf-field-editor-text',
  styleUrl: 'text.scss',
  shadow: false
})
export class FieldEditorText {

  @Prop()
  propertyValue: any;

  @Prop()
  propertyDescriptor: ActivityPropertyDescriptor;

  render() {
    const property = this.propertyDescriptor;
    const name = property.name;
    const label = property.label;
    const value = this.propertyValue;

    return (
      <Host>
        <label htmlFor={ name }>{ label }</label>,
        <input id={ name } name={ name } type="text" class="form-control" value={ value } />
      </Host>);
  }
}
