import {Component, Element, Event, EventEmitter, h, Prop} from '@stencil/core';

@Component({
  tag: 'elsa-confirmation-modal',
  scoped: true
})
export class ConfirmationModal {

  private modal: HTMLBsModalElement;

  @Element() el: HTMLElement;

  @Prop({attribute: 'title', reflect: true}) title: string = 'Dialog';
  @Prop({attribute: 'show-modal', reflect: true}) showModal: boolean;

  @Event({eventName: 'hidden'}) hiddenEvent: EventEmitter;
  @Event({eventName: 'confirmed'}) confirmedEvent: EventEmitter;

  componentDidRender() {
    if (!!this.modal) {
      this.modal.removeEventListener('hidden.bs.modal', this.emitHiddenEvent);
      this.modal.addEventListener('hidden.bs.modal', this.emitHiddenEvent);
    }
  }

  private emitHiddenEvent = () => this.hiddenEvent.emit();
  private emitConfirmedEvent = () => this.confirmedEvent.emit();

  render() {
    return (
      <div>
        <bs-modal class="modal" tabindex="-1" role="dialog" aria-hidden="true" showModal={this.showModal} ref={el => this.modal = el}>
          <div class="modal-dialog modal-xl" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">{this.title}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <slot/>
              </div>
              <div class="modal-footer">
                <button type="submit" class="btn btn-primary" onClick={this.emitConfirmedEvent}>OK</button>
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
              </div>
            </div>
          </div>
        </bs-modal>
      </div>
    )
  }
}
