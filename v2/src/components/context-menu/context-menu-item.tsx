import {Host, h} from '@stencil/core';
import {FunctionalComponent} from "@stencil/core/dist/declarations/vdom";

interface Props {
  text: string
  onClick?: (e: MouseEvent) => any
}

export const ContextMenuItem: FunctionalComponent<Props> = ({text, onClick}: Props) => <a class="dropdown-item" href="#" onClick={onClick}>{text}</a>;
