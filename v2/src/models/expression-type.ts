import {Expression} from "./expression";

export interface ExpressionType {
  type: string
  typeName: string
  displayName: string
  editor: (name: string, expression: Expression) => any
}
