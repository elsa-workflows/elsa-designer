import {Component, Element, Method} from '@stencil/core';
import {ImportedWorkflowData, Workflow, WorkflowFormat, WorkflowFormatDescriptor} from "../../../models";

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

    const workflow = await designer.workflow;
    const data = this.serialize(workflow, formatDescriptor.format);
    const blob = new Blob([data], {type: formatDescriptor.mimeType});

    this.blobUrl = blobUrl = window.URL.createObjectURL(blob);

    const downloadLink = document.createElement('a');
    downloadLink.setAttribute('href', blobUrl);
    downloadLink.setAttribute('download', `workflow.${formatDescriptor.fileExtension}`);

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  @Method()
  async import(designer: HTMLWfDesignerElement, data: ImportedWorkflowData) {
    const workflow = JSON.parse(data.data) as Workflow;

    console.debug('loaded workflow:');
    console.debug(workflow);
    designer.workflow = workflow;
  }

  blobUrl: string;

  private serialize = (workflow: Workflow, format: WorkflowFormat): any => {
    switch (format) {
      case 'json':
        return JSON.stringify(workflow);
      case 'yaml':
        return JSON.stringify(workflow);
      case 'xml':
        return JSON.stringify(workflow);
      default:
        return workflow;
    }
  };
}
