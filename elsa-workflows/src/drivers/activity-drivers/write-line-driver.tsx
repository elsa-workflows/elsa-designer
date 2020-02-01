﻿﻿import {h} from '@stencil/core';
import {injectable} from "inversify";
import {ActivityDisplayContext, ActivityDriverBase, Node} from '../../services';
import {FormGroup} from '../../components/form-group/form-group'

interface TextState {
  type: string;
  expression: string;
}

@injectable()
export class WriteLineDriver extends ActivityDriverBase {
  readonly activityType: string = 'WriteLine';

  displayEditor = async (context: ActivityDisplayContext): Promise<Node> => {
    const state: TextState = context.state.text || {type: '', expression: ''};
    const expression = state.expression;

    return (
      <FormGroup htmlId="textExpression" label="Text" hint="The text to write.">
        <input id="expression" type="text" name="expression" class="form-control" value={expression}/>
      </FormGroup>
    );
  };

  updateActivity = async (context: ActivityDisplayContext, formData: FormData): Promise<void> => {
    context.activity.state.text = {type: 'Literal', expression: formData.get('expression')};
  }

}
