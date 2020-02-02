import {FieldDisplayContext, FieldDriverBase, FieldTypes} from "../../services";
import {h} from "@stencil/core";
import {inject, injectable} from "inversify";
import {FormGroup} from "../../components/form-group/form-group";
import {ExpressionTypeStore} from "../../services/expression-type-store";

@injectable()
export class ExpressionDriver extends FieldDriverBase {
  fieldType: string = FieldTypes.Expression;

  constructor(@inject(ExpressionTypeStore) private expressionTypeStore: ExpressionTypeStore) {
    super();
  }

  display = async (context: FieldDisplayContext): Promise<Node> => {
    const property = context.descriptor;
    const name = property.name;
    const value = context.value || {type: '', expression: ''};
    const type = value.type;
    const expression = value.expression;
    const multiline: boolean = (property.options || {}).multiline || false;
    const types = this.expressionTypeStore.list();

    return (
      <FormGroup htmlId={property.name} label={property.label} hint={property.hint}>
        <elsa-expression-field name={name} type={type} defaultType={'Literal'} expression={expression} multiline={multiline} availableTypes={types}/>
      </FormGroup>
    );
  };

  update = async (context: FieldDisplayContext, formData: FormData): Promise<void> => {
    const property = context.descriptor;
    const state = context.state;
    const expressionFieldName = `${property.name}.expression`;
    const typeFieldName = `${property.name}.type`;
    const expression = formData.get(expressionFieldName).toString().trim();
    const type = formData.get(typeFieldName).toString();

    state[property.name] = {
      expression: expression,
      type: type
    };
  }
}
