import {injectable} from "inversify";
import {Render} from "./types";
import {HtmlFragment} from "../components/html-fragment/html-fragment";
import {h} from "@stencil/core";

@injectable()
export class DisplayManager {
  public display = (render: Render): Render => {
    if (Array.isArray(render))
      return render.map(this.display);
    if (typeof render === 'string')
      return <HtmlFragment content={render}/>;
    else return render;
  }
}
