export interface ActivityPropertyDescriptor {
  name: string;
  type: string;
  label: string;
  hint?: string;
  defaultValue?: () => any;
}
