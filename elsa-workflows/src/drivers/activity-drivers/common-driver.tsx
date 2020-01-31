﻿﻿import {h} from '@stencil/core';
import {ActivityDisplayContext, ActivityDriverBase, Render} from '../../services';
import {injectable} from "inversify";

interface State {
  name: string;
  displayName: string;
}

@injectable()
export class CommonDriver extends ActivityDriverBase {
  supportsActivity = (context: ActivityDisplayContext): boolean => true;

  async displayEditor(context: ActivityDisplayContext): Promise<Render> {

    return (
      <div class="form-group">
        <label htmlFor="exampleInputEmail1">Name</label>
        <input type="text" name='expression' class="form-control" value=""/>
      </div>
    );
  }

  updateActivity = async (context: ActivityDisplayContext, formData: FormData): Promise<void> => {
    context.activity.state.text = {type: 'Literal', expression: formData.get('expression')};
  }

}
