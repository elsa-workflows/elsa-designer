import {h, FunctionalComponent} from '@stencil/core';

interface Props {
  text: string;
}

export const Hint: FunctionalComponent<Props> = ({text}) => (
  <small class="form-text text-muted">{text}</small>
);
