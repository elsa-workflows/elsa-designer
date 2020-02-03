import {ExpressionType} from "../models/expression-type";
import {injectable} from "inversify";

@injectable()
export class ExpressionTypeStore {
  private types: Array<ExpressionType> = [];

  constructor() {
    this.types = [
      {type: 'Literal', displayName: 'Literal'},
      {type: 'JavaScript', displayName: 'JavaScript'},
      {type: 'Liquid', displayName: 'Liquid'},
    ];
  }

  list = (): Array<ExpressionType> => [...this.types];
}
