﻿﻿import {h} from '@stencil/core';
import {ActivityDisplayContext, ActivityDriverBase, Render} from '../../services';
import {injectable} from "inversify";

interface TextState {
  type: string;
  expression: string;
}

@injectable()
export class WriteLineDriver extends ActivityDriverBase {
  readonly activityType: string = 'WriteLine';

  async displayEditor(context: ActivityDisplayContext): Promise<Render> {
    const state: TextState = context.state.text || {type: '', expression: ''};
    const expression = state.expression;
    return (
      <div class="form-group">
        <label htmlFor="expression">Text</label>
        <input id="expression" type="text" name="expression" class="form-control" value={expression}/>
      </div>
    );
  }

  updateActivity = async (context: ActivityDisplayContext, formData: FormData): Promise<void> => {
    context.activity.state.text = {type: 'Literal', expression: formData.get('expression')};
  }

}
