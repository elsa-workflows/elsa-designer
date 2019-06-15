import {Component, Element, Method, Prop} from '@stencil/core';
import {WorkflowFormat, WorkflowFormatDescriptors} from "../../../models";

@Component({
  tag: 'wf-import-export',
  shadow: true
})
export class ImportExport {

  @Element()
  el: HTMLElement;

  @Prop()
  designer: HTMLWfDesignerElement;

  @Method()
  async export(format: WorkflowFormat) {
    let blobUrl = this.blobUrl;
    const formatDescriptor = WorkflowFormatDescriptors[format];

    if (!!blobUrl) {
      window.URL.revokeObjectURL(blobUrl)
    }

    const designer = this.designer;
    const data = await designer.export(format);
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
