import { WorkflowPlugin } from "../models";
import { WorkflowPluginStore } from "./workflow-plugin-store";

export interface Elsa {
  pluginStore: WorkflowPluginStore
}
