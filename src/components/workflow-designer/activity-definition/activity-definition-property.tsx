import { Component, Prop } from '@stencil/core';
import { ActivityPropertyDescriptor } from "../../../models";

@Component({
  tag: 'wf-activity-definition-property',
  shadow: true
})
export class ActivityDefinitionProperty implements ActivityPropertyDescriptor {

  @Prop({ reflect: true })
  name: string;

  @Prop({ reflect: true })
  type: string;

  @Prop({ reflect: true })
  label: string;

  @Prop({ reflect: true })
  hint: string;
}
