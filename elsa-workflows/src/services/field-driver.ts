import {Node} from "./types";
import {ActivityPropertyDescriptor} from "../models";
import {injectable} from "inversify";

export interface FieldDisplayContext {
  descriptor: ActivityPropertyDescriptor
  value: any
}

﻿export interface FieldDriver {
  supports(context: FieldDisplayContext): boolean;

  display(context: FieldDisplayContext): Node

  update(context: FieldDisplayContext, formData: FormData): void
}

@injectable()
export class FieldDriverBase implements FieldDriver {
  fieldType: string = null;

  supports = (context: FieldDisplayContext): boolean => context.descriptor.type === this.fieldType;

  display = (context: FieldDisplayContext): Node => null;

  update = (context: FieldDisplayContext, formData: FormData): void => {
  };
}
