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
    const defaultDisplayName = context.activityDefinition.displayName;

    return (
      [<div class="form-group">
        <label htmlFor="name">Name</label>
        <input id="name" type="text" name='name' class="form-control" value={props.name} />
        <small class="form-text text-muted">Optionally provide a technical name for this activity that can be used to reference it from workflow expressions used in other activities.</small>
      </div>,
        <div class="form-group">
          <label htmlFor="displayName">Display Name</label>
          <input id="displayName" type="text" name='displayName' class="form-control" value={props.displayName} placeholder={defaultDisplayName}/>
          <small class="form-text text-muted">Optionally provide a friendly name for this activity that is used on the workflow designer, making it easier to see what this activity does in a quick glance.</small>
        </div>
      ]
    );
  }

  updateActivity = async (context: ActivityDisplayContext, formData: FormData): Promise<void> => {
    context.activity.name = formData.get('name') as string;
    context.activity.displayName = formData.get('displayName') as string;
  }
}
