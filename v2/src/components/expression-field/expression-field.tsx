import {Component, Host, h, Prop, State, Watch, Method, Listen} from '@stencil/core';
import {Expression, ExpressionType} from '../../models';

export interface ExpressionChangedArgs {
  expression: string
}

@Component({
  tag: 'elsa-expression-field',
  styleUrl: 'expression-field.css',
  scoped: true
})
export class ExpressionField {

  @Prop() name: string;
  @Prop() multiline: boolean;
  @Prop({mutable: true}) expression: Expression;
  @Prop({mutable: true}) selectedType: ExpressionType;
  @Prop() availableTypes: Array<ExpressionType> = [];

  @Listen('expression-changed')
  expressionChangedHandler(e: CustomEvent<ExpressionChangedArgs>) {
    this.expression = e.detail.expression;
  }

  private onTypeOptionClick = (e: Event, expressionType: ExpressionType) => {
    e.preventDefault();
    this.selectedType = expressionType;
  };

  private renderInputField = () => {
    const name = this.name;
    const expression = this.expression;

    return this.selectedType.editor(name, expression);
  };

  private renderTypeOption = (expressionType: ExpressionType) => <a onClick={e => this.onTypeOptionClick(e, expressionType)} class="dropdown-item" href="#">{expressionType.displayName}</a>;

  render() {
    const name = this.name;
    const types = this.availableTypes;
    const selectedType = this.selectedType;

    if (!selectedType)
      return null;

    return (
      <bs-dropdown class="dropdown">
        <div class="input-group">
          <input type="hidden" name={`${name}.type`} value={selectedType.type}/>
          <input type="hidden" name={`${name}.typeName`} value={selectedType.typeName}/>
          {this.renderInputField()}

          <div class="input-group-append">

            <button class="btn btn-primary dropdown-toggle" type="button" id={`${name}_dropdownMenuButton`} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{selectedType.displayName}</button>
            <div class="dropdown-menu" aria-labelledby={`${name}_dropdownMenuButton`}>
              {types.map(this.renderTypeOption)}
            </div>

          </div>

        </div>
      </bs-dropdown>);
  }

}
