import {Component, Host, h, Prop, State, Watch, Method} from '@stencil/core';
import {Expression, ExpressionType} from '../../models';

@Component({
  tag: 'elsa-expression-field',
  styleUrl: 'expression-field.css',
  scoped: true
})
export class ExpressionField {

  @Prop() name: string;
  @Prop() multiline: boolean;
  @Prop({mutable: true}) expression: string;
  @Prop({mutable: true}) type: string;
  @Prop() defaultType: string = 'Literal';
  @Prop() availableTypes: Array<ExpressionType> = [];

  @Method()
  async getExpression(): Promise<Expression> {
    return {
      type: this.type,
      expression: this.expression
    };
  }

  private onTypeOptionClick = (e: Event, expressionType: ExpressionType) => {
    e.preventDefault();
    this.type = expressionType.type;
  };

  private onExpressionChange = (e: Event) => {
    if (e.target instanceof HTMLTextAreaElement)
      this.expression = (e.target as HTMLTextAreaElement).value;
    else
      this.expression = (e.target as HTMLInputElement).value;
  };

  private renderInputField = () => {
    const name = this.name;
    const expression = this.expression;

    if (this.multiline)
      return <textarea id={name} name={`${name}.expression`} class="form-control" rows={3} onChange={this.onExpressionChange}>{expression}</textarea>;

    return <input type="text" id={name} name={`${name}.expression`} value={expression} class="form-control" onChange={this.onExpressionChange}/>;
  };

  private renderTypeOption = (expressionType: ExpressionType) => <a onClick={e => this.onTypeOptionClick(e, expressionType)} class="dropdown-item" href="#">{expressionType.displayName}</a>;

  render() {
    const name = this.name;
    const types = this.availableTypes;
    const selectedType = this.type || this.defaultType;

    return (
      <bs-dropdown class="dropdown">
        <div class="input-group">
          <input type="hidden" name={`${name}.type`} value={selectedType} />
          {this.renderInputField()}

          <div class="input-group-append">

            <button class="btn btn-primary dropdown-toggle" type="button" id={`${name}_dropdownMenuButton`} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{selectedType}</button>
            <div class="dropdown-menu" aria-labelledby={`${name}_dropdownMenuButton`}>
              {types.map(this.renderTypeOption)}
            </div>

          </div>

        </div>
      </bs-dropdown>);
  }

}
