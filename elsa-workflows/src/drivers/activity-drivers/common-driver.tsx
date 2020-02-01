import {FormGroup} from '../../components/form-group/form-group';

﻿﻿import {h, Host} from '@stencil/core';
import {ActivityDisplayContext, ActivityDriverBase, Node} from '../../services';
import {injectable} from "inversify";

interface CommonProps {
  name: string;
  displayName: string;
}

@injectable()
export class CommonDriver extends ActivityDriverBase {
  supportsActivity = (context: ActivityDisplayContext): boolean => true;

  displayEditor = async (context: ActivityDisplayContext): Promise<Node> => {

    const props: CommonProps = context.state;
    const defaultDisplayName = context.activityDefinition.displayName;

    return (
      [
        <FormGroup htmlId="name" label="Name" hint="Optionally provide a technical name for this activity that can be used to reference it from workflow expressions used in other activities.">
          <input id="name" type="text" name='name' class="form-control" value={props.name}/>
        </FormGroup>,
        <FormGroup htmlId="displayName" label="Display Name" hint="Optionally provide a friendly name for this activity that is used on the workflow designer, making it easier to see what this activity does in a quick glance.">
          <input id="displayName" type="text" name='displayName' class="form-control" value={props.displayName} placeholder={defaultDisplayName}/>
        </FormGroup>
      ]
    );
  };

  updateActivity = async (context: ActivityDisplayContext, formData: FormData): Promise<void> => {
    context.activity.name = formData.get('name') as string;
    context.activity.displayName = formData.get('displayName') as string;
  }
}
