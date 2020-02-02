import {FieldDisplayContext, FieldDriverBase, FieldTypes} from "../../services";
import {h} from "@stencil/core";
import {injectable} from "inversify";
import {FormGroup} from "../../components/form-group/form-group";

@injectable()
export class TextDriver extends FieldDriverBase {
  fieldType: string = FieldTypes.Text;

  display = (context: FieldDisplayContext): Node => {
    const property = context.descriptor;
    const value = context.value || null;

    return (
      <FormGroup htmlId={property.name} label={property.label} hint={property.hint}>
        <input id={property.name} type="text" name={property.name} class="form-control" value={value}/>
      </FormGroup>
    );
  };

  update = (context: FieldDisplayContext, formData: FormData): void => {
    context.state[context.descriptor.name] = formData.get(context.descriptor.name).toString().trim();
  }
}
