import {h, FunctionalComponent} from '@stencil/core';

interface Props {
  htmlId: string;
  label: string;
  hint?: string;
}

const renderHint = (hint?: string) => !!hint ? <small class="form-text text-muted">{hint}</small> : null;

export const FormGroup: FunctionalComponent<Props> = ({htmlId, label, hint}, children) => (
  <div class="form-group">
    <label htmlFor={htmlId}>{label}</label>
    {children}
    {renderHint(hint)}
  </div>
);
