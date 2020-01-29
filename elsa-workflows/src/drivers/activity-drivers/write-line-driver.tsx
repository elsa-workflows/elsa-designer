﻿﻿import {Component, Host, h, Element, Prop, State, Event, EventEmitter} from '@stencil/core';
import {ActivityDriver, ActivityEditorContext, UpdateActivityContext} from '../../services';
import {injectable} from "inversify";

@injectable()
export class WriteLineDriver implements ActivityDriver
{
  readonly activityType: string = 'WriteLine';

  async getEditDisplay(context: ActivityEditorContext): Promise<string> {
    return (<p>hello world!</p>);
  }

  updateActivity(editorDisplay: Element, context: UpdateActivityContext): Promise<void> {
    return undefined;
  }

}
