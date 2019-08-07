import {Component, Element, h, Prop} from '@stencil/core';

@Component({
  tag: 'wf-context-menu-item',
  styleUrl: 'context-menu-item.scss',
  shadow: false
})
export class ContextMenuItem {

  @Element()
  el: HTMLElement;

  @Prop({reflect: true})
  text;

  public render() {
    const text = this.text;

    return (
        <a class="dropdown-item" href="#" onClick={e => e.preventDefault()}>{text}</a>
    )
  }
}
