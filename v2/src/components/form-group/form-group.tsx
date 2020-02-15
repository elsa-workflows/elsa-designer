import {h, FunctionalComponent} from '@stencil/core';
import {Hint} from "../hint/hint";

interface Props {
  htmlId?: string;
  label?: string;
  hint?: string;
}

const renderLabel = (props: Props) => !!props && !!props.label ? <label htmlFor={props.htmlId}>{props.label}</label> : null;
const renderHint = (props: Props) => !!props && !!props.hint ? <Hint text={props.hint}/> : null;

export const FormGroup: FunctionalComponent<Props> = (props: Props, children) => (
  <div class="form-group">
    {renderLabel(props)}
    {children}
    {renderHint(props)}
  </div>
);
