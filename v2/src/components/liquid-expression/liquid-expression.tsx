import {Component, Host, h, Prop, Event, EventEmitter} from '@stencil/core';
import {ExpressionChangedArgs} from "../expression-field/expression-field";

@Component({
  tag: 'elsa-liquid-expression',
  scoped: true
})
export class LiquidExpression {

  @Prop() name: string;
  @Prop() multiline: boolean;
  @Prop({mutable: true}) expression: string;
  @Event({eventName: 'expression-changed'}) expressionChangedEvent: EventEmitter<ExpressionChangedArgs>;

  private onExpressionChange = (e: Event) => {
    if (e.target instanceof HTMLTextAreaElement)
      this.expression = (e.target as HTMLTextAreaElement).value;
    else
      this.expression = (e.target as HTMLInputElement).value;

    this.expressionChangedEvent.emit({expression: this.expression});
  };

  render() {
    const name = this.name;
    const expression = this.expression;

    if (this.multiline)
      return <textarea id={name} name={`${name}.expression`} class="form-control" rows={3} onChange={this.onExpressionChange}>{expression}</textarea>;

    return <input type="text" id={name} name={`${name}.expression`} value={expression} class="form-control" onChange={this.onExpressionChange}/>;
  }

}
