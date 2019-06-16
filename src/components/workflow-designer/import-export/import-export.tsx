import {Component, Element, Method} from '@stencil/core';
import {WorkflowFormatDescriptor} from "../../../models";

@Component({
  tag: 'wf-import-export',
  shadow: true
})
export class ImportExport {

  @Element()
  el: HTMLElement;

  @Method()
  async export(designer: HTMLWfDesignerElement, formatDescriptor: WorkflowFormatDescriptor) {
    let blobUrl = this.blobUrl;

    if (!!blobUrl) {
      window.URL.revokeObjectURL(blobUrl)
    }

    const data = await designer.export(formatDescriptor.format);
    const blob = new Blob([data], {type: formatDescriptor.mimeType});

    this.blobUrl = blobUrl = window.URL.createObjectURL(blob);

    const downloadLink = document.createElement('a');
    downloadLink.setAttribute('href', blobUrl);
    downloadLink.setAttribute('download', `workflow.${formatDescriptor.fileExtension}`);

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  blobUrl: string;

}
