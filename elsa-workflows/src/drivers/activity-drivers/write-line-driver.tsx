﻿﻿import {h} from '@stencil/core';
import {ActivityDriver, ActivityEditorContext, ActivityState, Render, UpdateActivityContext} from '../../services';
import {injectable} from "inversify";

@injectable()
export class WriteLineDriver implements ActivityDriver {
  readonly activityType: string = 'WriteLine';

  async getEditDisplay(context: ActivityEditorContext): Promise<Render> {
    const text = context.state.text.expression || '';
    return (
      <div class="form-group">
        <label htmlFor="exampleInputEmail1">Texts</label>
        <input type="text" name='text' class="form-control" value={text}/>
      </div>
    );
  }

  async updateActivity(context: UpdateActivityContext): Promise<void> {
    const data = context.formData;

    context.activity.state.text = {syntax: 'Literal', expression: data.get('text')};
  }

}
