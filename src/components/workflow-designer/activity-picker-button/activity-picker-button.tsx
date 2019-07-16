import { Component, h, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'wf-activity-picker-button',
  styleUrl: 'activity-picker-button.scss',
  shadow: true
})
export class ActivityPicker {

  @Event({ eventName: 'add-activity'})
  showActivityPickerEvent : EventEmitter;

  showActivityPicker()
  {
    this.showActivityPickerEvent.emit();
  }

  render() {
    return (
      <button class="btn btn-primary" onClick={ () => this.showActivityPicker() }><slot/></button>
    )
  }
}
