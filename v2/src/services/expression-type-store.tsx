import {ExpressionType} from "../models";
import {injectable} from "inversify";
import {h} from "@stencil/core";

@injectable()
export class ExpressionTypeStore {
  private readonly types: Array<ExpressionType> = [];

  constructor() {
    this.types = [
      {
        type: 'Literal', typeName: 'LiteralExpression', displayName: 'Literal', editor: (name, expression) => {
          return <elsa-literal-expression name={name} expression={expression} class="flex-fill" />;
        }
      },
      {
        type: 'JavaScript', typeName: 'JavaScriptExpression', displayName: 'JavaScript', editor: (name, expression) => {
          return <elsa-javascript-expression name={name} expression={expression} class="flex-fill" />;
        }
      },
      {
        type: 'Liquid', typeName: 'LiquidExpression', displayName: 'Liquid', editor: (name, expression) => {
          return <elsa-liquid-expression name={name} expression={expression} class="flex-fill" />;
        }
      }
    ];
  }

  list = (): Array<ExpressionType> => [...this.types];
}
