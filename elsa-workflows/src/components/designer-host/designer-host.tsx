import {Component, Host, h, State} from '@stencil/core';
import {Activity, Workflow} from "../../models";

@Component({
  tag: 'elsa-designer-host',
  styleUrl: 'designer-host.scss',
  scoped: true
})
export class DesignerHostComponent {

  @State() private workflow: Workflow;

  private designer: HTMLElsaDesignerElement;

  loadWorkflow = (): Workflow => {

    const writeLine1: Activity = {
      id: '1',
      type: 'WriteLine',
      displayName: 'Write Line',
      state: {text: {type: 'Literal', expression: 'Hello World!'}},
      outcomes: ['Done'],
      left: 100,
      top: 50
    };

    const writeLine2: Activity = {
      id: '2',
      type: 'WriteLine',
      displayName: 'Write Line',
      state: {text: {type: 'Literal', expression: 'Hello World!'}},
      outcomes: ['Done'],
      left: 350,
      top: 350
    };

    const readLine1: Activity = {
      id: '3',
      type: 'ReadLine',
      displayName: 'Read Line',
      state: {text: {type: 'Literal', expression: 'Hello World!'}},
      outcomes: ['Done'],
      left: 600,
      top: 250
    };

    return {
      id: '1',
      activities: [writeLine1, writeLine2, readLine1],
      connections: [{sourceActivityId: writeLine1.id, targetActivityId: writeLine2.id, outcome: 'Done'}]
    };
  };

  onLoadClick = e => {
    this.workflow = {id: null, activities: [], connections: []};
    this.workflow = this.loadWorkflow();
  };

  onSaveClick = async e => {
    this.workflow = await this.designer.getWorkflow();
    console.debug(this.workflow);
  };

  render() {
    return (
      <Host>
        <button class="btn btn-primary" onClick={this.onLoadClick}>Load</button>
        <button class="btn btn-primary" onClick={this.onSaveClick}>Save</button>
        <elsa-designer workflow={this.workflow} ref={el => this.designer = el}/>
      </Host>
    );
  }

}
