import {FieldDisplayContext, FieldDriverBase, FieldTypes} from "../../services";
import {h} from "@stencil/core";
import {inject, injectable} from "inversify";
import {FormGroup} from "../../components/form-group/form-group";
import {ExpressionTypeStore} from "../../services/expression-type-store";
import {Expression} from "../../models";

@injectable()
export class ExpressionDriver extends FieldDriverBase {
  fieldType: string = FieldTypes.Expression;

  constructor(@inject(ExpressionTypeStore) private expressionTypeStore: ExpressionTypeStore) {
    super();
  }

  display = async (context: FieldDisplayContext): Promise<Node> => {
    const property = context.descriptor;
    const name = property.name;
    const options = property.options;
    const baseTypeName = 'LiteralExpression';
    const returnType = options.returnType;
    const typeName = `${baseTypeName}[${returnType}]`;
    const value: Expression = context.value || { type: 'Literal', typeName, expression: '' };
    const expression = value.expression;
    const multiline: boolean = (property.options || {}).multiline || false;
    const types = this.expressionTypeStore.list();
    const selectedType = types.find(x => x.type === value.type) || types[0];

    return (
      <FormGroup htmlId={property.name} label={property.label} hint={property.hint}>
        <elsa-expression-field name={name} selectedType={selectedType} expression={expression} multiline={multiline} availableTypes={types}/>
      </FormGroup>
    );
  };

  update = async (context: FieldDisplayContext, formData: FormData): Promise<void> => {
    const property = context.descriptor;
    const state = context.state;
    const options = property.options;
    const expressionFieldName = `${property.name}.expression`;
    const typeFieldName = `${property.name}.type`;
    const typeNameFieldName = `${property.name}.typeName`;
    const expression = formData.get(expressionFieldName).toString().trim();
    const type = formData.get(typeFieldName).toString();
    const baseTypeName = formData.get(typeNameFieldName).toString();
    const returnType = options.returnType;
    const typeName = `${baseTypeName}[${returnType}]`;

    state[property.name] = {
      type: type,
      expression: expression,
      typeName: typeName
    };
  }
}
