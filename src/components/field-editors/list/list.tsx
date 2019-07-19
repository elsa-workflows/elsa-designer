import { Component, h, Host, Prop } from '@stencil/core';
import { ActivityPropertyDescriptor } from "../../../models";

@Component({
  tag: 'wf-field-editor-list',
  styleUrl: 'list.scss',
  shadow: false
})
export class FieldEditorList {

  @Prop()
  propertyValue: Array<any>;

  @Prop()
  propertyDescriptor: ActivityPropertyDescriptor;

  render() {
    debugger;
    const property = this.propertyDescriptor;
    const name = property.name;
    const label = property.label;
    const items = this.propertyValue as Array<any> || [];
    const value = items.join(', ');

    return (
      <Host>
        <label htmlFor={ name }>{ label }</label>
        <input id={ name } name={ name } type="text" class="form-control" value={ value } />
      </Host>);
  }
}
