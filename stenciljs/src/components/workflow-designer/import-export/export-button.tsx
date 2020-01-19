import { Component, Element, Event, EventEmitter, h, Prop} from '@stencil/core';
import {
  WorkflowFormatDescriptor,
  WorkflowFormatDescriptorDictionary
} from "../../../models";

@Component({
  tag: 'wf-export-button',
  shadow: false
})
export class ExportButton {

  @Element()
  el: HTMLElement;

  @Event({ eventName: 'export' })
  exportClickedEvent: EventEmitter;

  @Prop({ attribute: 'workflow-designer-host' })
  designerHostId: string;

  @Prop()
  workflowFormats: WorkflowFormatDescriptorDictionary = {
    json: {
      format: 'json',
      fileExtension: '.json',
      mimeType: 'application/json',
      displayName: 'JSON'
    },
    yaml: {
      format: 'yaml',
      fileExtension: '.yaml',
      mimeType: 'application/x-yaml',
      displayName: 'YAML'
    },
    xml: {
      format: 'xml',
      fileExtension: '.xml',
      mimeType: 'application/xml',
      displayName: 'XML'
    },
    object: {
      format: 'object',
      fileExtension: '.bin',
      mimeType: 'application/binary',
      displayName: 'Binary'
    }
  };

  render() {

    const descriptors = this.workflowFormats;

    return (
      <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle" type="button" id="exportButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Export
        </button>
        <div class="dropdown-menu" aria-labelledby="exportButton">
          { Object.keys(descriptors).map(key => {
            const descriptor = descriptors[key];
            return (
              <a class="dropdown-item" href="#" onClick={ e => this.handleExportClick(e, descriptor) }>{ descriptor.displayName }</a>);
          }) }
        </div>
      </div>
    )
  }

  private getWorkflowHost = () => {
    return !!this.designerHostId ? document.querySelector<HTMLWfDesignerHostElement>(`#${ this.designerHostId }`) : null;
  };

  private handleExportClick = async (e: Event, descriptor: WorkflowFormatDescriptor) => {
    e.preventDefault();
    this.exportClickedEvent.emit(descriptor);

    const host = this.getWorkflowHost();
    if (!!host) {
      await host.export(descriptor);
    }
  }

}
