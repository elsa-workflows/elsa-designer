import {Component, Element, EventEmitter, h, Host, Listen, Method, Prop, State, Watch, Event} from '@stencil/core';
import {CssMap} from "../../utils";
import {Point} from "../../models";

@Component({
  tag: 'wf-context-menu',
  styleUrl: 'context-menu.scss',
  shadow: true
})
export class ContextMenu {

  @Element()
  el: HTMLElement;

  @Prop()
  target: HTMLElement;

  @Prop({reflect: true, attribute: 'target'})
  targetSelector: string;

  @State()
  isHidden: boolean = true;

  @State()
  position: Point = {left: 0, top: 0};

  @Watch('target')
  targetChangeHandler(newValue: HTMLElement, oldValue: HTMLElement) {
    if (!!oldValue) {
      oldValue.removeEventListener('contextmenu', this.onContextMenu);
    }

    this.setupTarget(newValue);
  }

  @Watch('targetSelector')
  targetSelectorChangeHandler(newValue: string) {
    this.target = document.querySelector(newValue);
  }

  @Listen('click', {target: 'body'})
  handleBodyClick() {
    this.isHidden = true;
  }

  @Listen('context-menu', { target: 'body' })
  handleContextMenu() {
    this.isHidden = true;
  }

  @Event({eventName: 'context-menu', bubbles: true})
  contextMenuEvent: EventEmitter;

  @Method()
  async handleContextMenuEvent(e: MouseEvent) {
    this.onContextMenu(e);
  }

  public componentDidLoad() {
    this.setupTarget(this.target);
  }

  public render() {
    const css: CssMap = {
      left: `${this.position.left}px`,
      top: `${this.position.top}px`,
      display: this.isHidden ? 'none' : 'block'
    };
    return (
      <Host class="dropdown-menu context-menu canvas-context-menu position-fixed" style={css} onClick={this.onContextMenuClick}>
        <slot />
      </Host>
    )
  }

  private setupTarget(value: HTMLElement) {
    if (!!value) {
      value.addEventListener('contextmenu', this.onContextMenu, {capture: false});
    }
  }

  private onContextMenu = (e: MouseEvent) => {
    if (e.defaultPrevented)
      return;

    e.preventDefault();
    this.contextMenuEvent.emit();
    this.position = {left: e.pageX, top: e.pageY};
    this.isHidden = false;
  };

  private onContextMenuClick = () => {
    this.isHidden = true;
  }
}
