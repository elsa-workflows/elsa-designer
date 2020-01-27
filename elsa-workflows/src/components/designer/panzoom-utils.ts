import panzoom from "pan-zoom";

export function createPanzoom (element: HTMLElement, zoomCallback?: Function) {

  return panzoom(element, e => {
    // let scale = parseFloat(element.getAttribute('data-zoom'));
    //
    // if(isNaN(scale))
    //   scale = 1.0;
    //
    // const currentRect = element.getBoundingClientRect();
    //
    // console.debug(currentRect);
    //
    // const delta = e.dz / 3000;
    // scale -= delta;
    //
    // if(scale < 0.1)
    //   scale = 0.1;
    //
    // else if(scale > 2)
    //   scale = 2;
    //
    // element.setAttribute('data-zoom', scale.toString());
    // element.style.transform = `scale(${scale})`;
    // element.style.transformOrigin = '0 0';
    //
    //
    // let scaledX = currentRect.x + (e.dx);
    // let scaledY = currentRect.y + (e.dy);
    //
    // if(scaledX > 0)
    //   scaledX = 0;
    //
    // if(scaledY > 0)
    //   scaledY = 0;
    //
    // e.target.style.left = `${scaledX}px`;
    // e.target.style.top = `${scaledY}px`;
    //
    // if(!!zoomCallback)
    //   zoomCallback(scale);
  });
}
