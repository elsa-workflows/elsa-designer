import { Component, h, Host, Prop, State, Watch } from '@stencil/core';

@Component({
  tag: 'wf-expression-field',
  styleUrl: 'expression-field.scss',
  shadow: false
})
export class ExpressionField {

  @Prop({ reflect: true })
  name: string;

  @Prop({ reflect: true })
  label: string;

  @Prop({ reflect: true })
  hint: string;

  @Prop({ reflect: true })
  value: string;

  @Prop({ reflect: true, mutable: true })
  syntax: string;

  private selectSyntax = (syntax) => this.syntax = syntax;

  render() {
    const name = this.name;
    const label = this.label;
    const hint = this.hint;
    const value = this.value;
    const syntaxes = ['PlainText', 'JavaScript', 'Liquid'];
    const selectedSyntax = this.syntax || 'PlainText';

    return (
      <div class="form-group">
        <label htmlFor={ name }>{ label }</label>
        <div class="input-group">
          <input name={ `${ name }.syntax` } value={ selectedSyntax } type="hidden" />
          <input id={ name } name={ `${ name }.expression` } value={ value } type="text" class="form-control" />
          <div class="input-group-append">
            <button class="btn btn-primary dropdown-toggle" type="button" id={ `${ name }_dropdownMenuButton` } data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{ selectedSyntax }</button>
            <div class="dropdown-menu" aria-labelledby={ `${ name }_dropdownMenuButton` }>
              { syntaxes.map(x => <a onClick={ () => this.selectSyntax(x) } class="dropdown-item" href="#">{ x }</a>) }
            </div>
          </div>
        </div>
        <small class="form-text text-muted">{ hint }</small>
      </div>);
  }
}
