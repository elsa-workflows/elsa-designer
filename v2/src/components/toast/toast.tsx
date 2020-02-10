import {h, FunctionalComponent} from '@stencil/core';

interface Props {
  id?: string
  title?: string
  icon?: string
}

export const Toast: FunctionalComponent<Props> = (props: Props, children) => {
  const iconClass = props.icon || `fas fa-info-circle`;

  return (
    <bs-toast key={props.id} id={props.id} class="toast fade show" role="alert" aria-live="assertive" aria-atomic="true" autohide={true} delay={1000} noSelfRemoveFromDom={true}>
      <div class="toast-header">
        <i class={iconClass}/>
        <strong class="ml-1 mr-auto">{props.title}</strong>
        <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="toast-body">
        {children}
      </div>
    </bs-toast>
  );
};
