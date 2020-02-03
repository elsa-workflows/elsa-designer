import {Node} from "../services";
import {HtmlFragment} from "../components/html-fragment/html-fragment";
import {h} from "@stencil/core";

// A 'Node' can be an array of html string literals, JSX nodes (vdoms) or Render objects themselves.
// So for each element, see if it is an array and map each element to either an HTML fragment or return the node as-is.
export class NodeUtils {
  static normalize = (node: Node): Node => {
    if (Array.isArray(node))
      return node.filter(x => !!x).map(NodeUtils.normalize);
    if (typeof node === 'string')
      return <HtmlFragment content={node}/>;
    else
      return node;
  };
}
