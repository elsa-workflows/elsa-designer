import {Component, Host, h, Prop} from '@stencil/core';

@Component({
  tag: 'elsa-context-menu-item',
  styleUrl: 'context-menu-item.css',
  scoped: true
})
export class ContextMenuItem {

  @Prop() text;

  public render() {
    return (
      <a class="dropdown-item" href="#" onClick={e => e.preventDefault()}><slot>{this.text}</slot></a>
    )
  }

}
