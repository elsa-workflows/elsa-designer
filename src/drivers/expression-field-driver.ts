import { FieldDriver } from "../services/field-driver";
import { Activity, ActivityPropertyDescriptor, RenderResult, WorkflowExpression } from "../models";

export class ExpressionFieldDriver implements FieldDriver {
  displayEditor = (activity: Activity, property: ActivityPropertyDescriptor): RenderResult => {
    const name = property.name;
    const label = property.label;
    const value: WorkflowExpression = activity.state[name] || { expression: '', syntax: 'PlainText' };

    return `<wf-expression-field name="${ name }" label="${ label }" hint="${ property.hint }" value="${ value.expression }" syntax="${ value.syntax }"></wf-expression-field>`;
  };

  updateEditor = (activity: Activity, property: ActivityPropertyDescriptor, formData: FormData) => {
    const expressionFieldName = `${ property.name }.expression`;
    const syntaxFieldName = `${ property.name }.syntax`;

    activity.state[property.name] = {
      expression: formData.get(expressionFieldName).toString(),
      syntax: formData.get(syntaxFieldName).toString()
    };
  };

}
