import {Component, Element, h} from '@stencil/core';
import {WorkflowFormatDescriptors} from "../../../models";

@Component({
  tag: 'wf-export-button',
  styleUrl: 'export-button.scss',
  shadow: true
})
export class ExportButton {

  @Element()
  el: HTMLElement;

  public render() {

    return (
      <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle" type="button" id="exportButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Export
        </button>
        <div class="dropdown-menu" aria-labelledby="exportButton">
          {Object.keys(WorkflowFormatDescriptors).map(key => {
            const descriptor = WorkflowFormatDescriptors[key];
            return (<a class="dropdown-item" href="#" onClick={this.handleExportClick}>{descriptor.displayName}</a>);
          })}
        </div>
      </div>
    )
  }

  private handleExportClick = () => {

  }

}
