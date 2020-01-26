import {Component, Host, h, State, Prop, Element, Listen, Method, Event, EventEmitter} from '@stencil/core';

@Component({
  tag: 'elsa-context-menu',
  styleUrl: 'context-menu.css',
  scoped: true
})
export class ContextMenu {

  private context?: any;
  @Element() el: HTMLElement;

  @Event({eventName: 'context-menu', bubbles: true})
  contextMenuEvent: EventEmitter;

  @State() isHidden: boolean = true;
  @State() left: number = 0;
  @State() top: number = 0;

  @Listen('click', {target: 'body'})
  handleBodyClick() {
    this.isHidden = true;
  }

  @Listen('context-menu', {target: 'body'})
  handleContextMenu() {
    this.isHidden = true;
  }

  @Method()
  async show(e: MouseEvent, context?: any) {
    this.context = context;
    this.onContextMenu(e);
  }

  @Method()
  async getContext(): Promise<any> {
    return this.context;
  }

  private onContextMenu = (e: MouseEvent) => {
    if (e.defaultPrevented)
      return;

    e.preventDefault();
    this.contextMenuEvent.emit();
    this.left = e.pageX;
    this.top = e.pageY;
    this.isHidden = false;
  };

  private onContextMenuClick = () => {
    this.isHidden = true;
  };

  public render() {
    const css = {
      left: `${this.left}px`,
      top: `${this.top}px`,
      display: this.isHidden ? 'none' : 'block'
    };
    return (
      <Host class="dropdown-menu context-menu canvas-context-menu position-fixed" style={css} onClick={this.onContextMenuClick}>
        <slot/>
      </Host>
    )
  }

}
