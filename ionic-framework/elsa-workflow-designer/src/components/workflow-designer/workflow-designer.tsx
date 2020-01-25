import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'elsa-workflow-designer',
  styleUrl: 'workflow-designer.css',
  shadow: true
})
export class WorkflowDesigner {

  render() {
    return (
      <Host>
        Workflow Designer
      </Host>
    );
  }

}
