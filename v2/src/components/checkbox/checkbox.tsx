import {h, FunctionalComponent} from '@stencil/core';

interface Props {
  htmlId?: string
  htmlName: string
  label: string
  checked?: boolean
  value?: string
}

export const Checkbox: FunctionalComponent<Props> = ({htmlId, htmlName, label, checked, value}) => {
  if (!htmlId)
    htmlId = htmlName;

  if (!value)
    value = 'checked';

  return (
    <div class="form-check">
      <input id={htmlId} name={htmlName} type="checkbox" class="form-check-input" value={value} checked={checked}/>
      <label htmlFor={htmlId} class="form-check-label">{label}</label>
    </div>
  );
};
