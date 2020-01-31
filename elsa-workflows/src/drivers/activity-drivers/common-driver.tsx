﻿﻿import {h, Host} from '@stencil/core';
import {ActivityDisplayContext, ActivityDriverBase, Render} from '../../services';
import {injectable} from "inversify";

interface CommonProps {
  name: string;
  displayName: string;
}

@injectable()
export class CommonDriver extends ActivityDriverBase {
  supportsActivity = (context: ActivityDisplayContext): boolean => true;

  async displayEditor(context: ActivityDisplayContext): Promise<Render> {

    const props: CommonProps = context.state;

    return (
      [<div class="form-group">
        <label htmlFor="name">Name</label>
        <input id="name" type="text" name='name' class="form-control" value={props.name}/>
        <small class="form-text text-muted">We'll never share your email with anyone else.</small>
      </div>,
        <div class="form-group">
          <label htmlFor="name">Display Name</label>
          <input id="name" type="text" name='displayName' class="form-control" value={props.displayName}/>
        </div>
      ]
    );
  }

  updateActivity = async (context: ActivityDisplayContext, formData: FormData): Promise<void> => {
    context.activity.state.name = formData.get('name');
    context.activity.state.displayName = formData.get('displayName');
  }
}
