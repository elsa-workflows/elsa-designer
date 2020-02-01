import {h} from '@stencil/core'
import {ActivityDisplayContext, ActivityDriverBase, ActivityState, CustomDriverStore, Node, Symbols} from '../../services'
import {inject, injectable} from 'inversify'
import {ActivityPropertyDescriptor} from '../../models'
import {FieldDisplayManager} from '../../services/field-display-manager';

﻿
@injectable()
export class DynamicPropsDriver extends ActivityDriverBase {

  constructor(
    @inject(CustomDriverStore) private customDriverStore: CustomDriverStore,
    @inject(FieldDisplayManager) private fieldDisplayManager: FieldDisplayManager) {
    super();
  }

  supportsActivity = (context: ActivityDisplayContext): boolean => !this.customDriverStore.hasCustomDriverFor(context.activity.type);

  displayEditor = async (context: ActivityDisplayContext): Promise<Node> => {
    const activityDefinition = context.activityDefinition;
    const props = activityDefinition.properties || [];
    return props.map(x => this.renderField(context.state, x));
  };

  updateActivity = async (context: ActivityDisplayContext, formData: FormData): Promise<void> => {
    context.activity.name = formData.get('name') as string;
    context.activity.displayName = formData.get('displayName') as string;
  };

  private renderField = (state: ActivityState, property: ActivityPropertyDescriptor): Node => this.fieldDisplayManager.display(property, state)
}
