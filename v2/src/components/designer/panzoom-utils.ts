import Panzoom from '@panzoom/panzoom';
import {PanzoomObject} from "@panzoom/panzoom/dist/src/types";

export function createPanzoom (element: HTMLElement, zoomCallback?: Function): PanzoomObject {
  const instance = Panzoom(element, {
    minScale: 0.1,
    maxScale: 3.0,
    contain: 'outside',
    startX: -500,
    startY: -500
  });

  if(!!zoomCallback)
    element.addEventListener('panzoomchange', (e: any) => {
      zoomCallback(e.detail.scale);
    });

  element.parentElement.addEventListener('wheel', instance.zoomWithWheel);

  return instance;
}
