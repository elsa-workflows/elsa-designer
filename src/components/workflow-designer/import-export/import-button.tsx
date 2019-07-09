import {Component, Element, EventEmitter, h, Event} from '@stencil/core';
import {WorkflowFormat} from "../../../models";

@Component({
  tag: 'wf-import-button',
  styleUrl: 'import-export-button.scss',
  shadow: false
})
export class ImportButton {

  @Element()
  el: HTMLElement;

  @Event({eventName: 'import-workflow'})
  importEvent: EventEmitter;

  fileInput: HTMLInputElement;

  public render() {
    return (
      <host>
        <input type="file" id="import" onChange={this.importWorkflow} ref={el => this.fileInput = el} />
        <button class="btn btn-secondary" onClick={this.browseWorkflow}>Import</button>
      </host>
    )
  }

  private browseWorkflow = () => {
    this.fileInput.click();
  };

  private importWorkflow = () => {
    console.debug('file selected');

    const file = this.fileInput.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const data = reader.result as string;
      const format: WorkflowFormat = 'json';

      this.importEvent.emit({ data, format });
      (this.fileInput as any).val('');
    };

    reader.readAsText(file);
  };
}
