import {FieldDisplayContext, FieldDriverBase, FieldTypes} from "../../services";
import {h} from "@stencil/core";
import {injectable} from "inversify";
import {FormGroup} from "../../components/form-group/form-group";

@injectable()
export class ListDriver extends FieldDriverBase {
  fieldType: string = FieldTypes.List;

  display = async (context: FieldDisplayContext): Promise<Node> => {
    const property = context.descriptor;
    const value = context.value || [];
    const textValue = value.join(', ');

    return (
      <FormGroup htmlId={property.name} label={property.label} hint={property.hint}>
        <input id={property.name} type="text" name={property.name} class="form-control" value={textValue}/>
      </FormGroup>
    );
  };

  update = async (context: FieldDisplayContext, formData: FormData): Promise<void> => {
    const textValue = formData.get(context.descriptor.name).toString().trim();
    context.state[context.descriptor.name] = textValue.split(',').map(x => x.trim());
  }
}
