import {FieldDisplayContext, FieldDriverBase, FieldTypes} from "../../services";
import {h} from "@stencil/core";
import {injectable} from "inversify";
import {FormGroup} from "../../components/form-group/form-group";

interface SelectOption {
  value: string
  label: string
}

interface SelectOptions {
  items: Array<SelectOption>
}

@injectable()
export class SelectDriver extends FieldDriverBase {
  fieldType: string = FieldTypes.Select;

  display = async (context: FieldDisplayContext): Promise<Node> => {
    const property = context.descriptor;
    const value = context.value || null;
    const options = (context.descriptor.options as SelectOptions || {items: []}).items;

    return (
      <FormGroup htmlId={property.name} label={property.label} hint={property.hint}>
        <select id={property.name} name={property.name} class="form-control">
          {options.map(x => this.renderOption(x, value))}
        </select>
      </FormGroup>
    );
  };

  update = async (context: FieldDisplayContext, formData: FormData): Promise<void> => {
    context.state[context.descriptor.name] = formData.get(context.descriptor.name).toString().trim();
  };

  private renderOption = (option: SelectOption, selectedValue?: string) => {
    const value = !!option.value ? option.value : option.label;
    const selected = !!selectedValue && (value === selectedValue);
    return <option value={option.value} selected={selected}>{option.label}</option>;
  }
}
