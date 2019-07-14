import {Component, Element, EventEmitter, h, Event} from '@stencil/core';

@Component({
  tag: 'wf-new-workflow-button',
  styleUrl: 'buttons.scss',
  shadow: false
})
export class NewWorkflowButton {

  @Element()
  el: HTMLElement;

  @Event({eventName: 'new-workflow'})
  newWorkflowEvent: EventEmitter;

  public render() {
    return (
      <host>
        <button class="btn btn-secondary" onClick={this.createNewWorkflow}>New Workflow</button>
      </host>
    )
  }

  private createNewWorkflow = () => {
    this.newWorkflowEvent.emit();
  };
}
