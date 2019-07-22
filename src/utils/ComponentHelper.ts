export class ComponentHelper {
  static rootComponentReady(){
    return document.querySelector("wf-designer-host").componentOnReady();
  }
}
