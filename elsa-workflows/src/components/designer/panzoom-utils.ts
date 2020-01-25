import Panzoom from "@panzoom/panzoom";

export function createPanzoom (element: HTMLElement, zoomCallback: Function) {
  const panzoom = Panzoom(element, {
    maxScale: 2,
    overflow: 'hidden',
    contain: 'outside'
  });

  element.parentElement.addEventListener('wheel', panzoom.zoomWithWheel);

  element.addEventListener('panzoomchange', (e: CustomEvent) => {
    const zoom = e.detail.scale;
    zoomCallback(zoom);
  });

  return panzoom;
}
