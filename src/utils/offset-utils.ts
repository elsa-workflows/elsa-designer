import {Point} from "../models";

export class Offset {
  public static fromMouseEvent(e: MouseEvent): Point {
    //const element = e.currentTarget as HTMLElement;

    const relX =  e.pageX;
    const relY = e.pageY;

    return {
      left: relX,
      top: relY
    };
  }
}
