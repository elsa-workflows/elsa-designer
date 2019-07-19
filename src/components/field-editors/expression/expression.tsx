import { Component, h, Host, Prop, State, Watch } from '@stencil/core';
import { ActivityPropertyDescriptor, WorkflowExpression } from "../../../models";

@Component({
  tag: 'wf-field-editor-expression',
  styleUrl: 'expression.scss',
  shadow: false
})
export class FieldEditorExpression {

  @Prop()
  propertyValue: WorkflowExpression;

  @Watch('propertyValue')
  onPropertyValueChanged(newValue: WorkflowExpression)
  {
    this.selectedSyntax = newValue != null ? newValue.syntax : 'PlainText';
  }

  @Prop()
  propertyDescriptor: ActivityPropertyDescriptor;

  @State()
  selectedSyntax: string;

  private selectSyntax = (syntax) => this.selectedSyntax = syntax;

  public static ReadValue(name: string, formData: FormData): WorkflowExpression {
    const syntaxName = `${ name }_syntax`;
    const expressionName = `${ name }_syntax`;

    return {
      syntax: formData.get(syntaxName).toString(),
      expression: formData.get(expressionName).toString()
    }
  }

  render() {
    const property = this.propertyDescriptor;
    const name = property.name;
    const label = property.label;
    const value = this.propertyValue as WorkflowExpression || { expression: null, syntax: this.selectedSyntax };
    const syntaxes = ['PlainText', 'JavaScript', 'Liquid'];
    const selectedSyntax = value.syntax || 'PlainText';

    return (
      <Host>
        <label htmlFor={ name }>{ label }</label>
        <div class="input-group">
          <input name={ `${ name }_syntax` } value={ selectedSyntax } type="hidden" />
          <input id={ name } name={ `${ name }_expression` } value={ value.expression } type="text" class="form-control" />
          <div class="input-group-append">
            <button class="btn btn-primary dropdown-toggle" type="button" id={ `${ name }_dropdownMenuButton` } data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{ selectedSyntax }</button>
            <div class="dropdown-menu" aria-labelledby={ `${ name }_dropdownMenuButton` }>
              { syntaxes.map(x => <a onClick={ () => this.selectSyntax(x) } class="dropdown-item" href="#">{ x }</a>) }
            </div>
          </div>
        </div>
      </Host>);
  }
}
