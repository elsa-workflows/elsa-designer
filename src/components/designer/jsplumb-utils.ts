import {jsPlumb, jsPlumbInstance} from "jsplumb";

export class JsPlumbUtils {
  static createInstance = (container: any): jsPlumbInstance =>
    jsPlumb.getInstance({
      DragOptions: {cursor: 'pointer', zIndex: 2000},
      ConnectionOverlays: [
        ['Arrow', {
          location: 1,
          visible: true,
          width: 11,
          length: 11
        }],
        ['Label', {
          location: 0.5,
          id: 'label',
          cssClass: 'connection-label'
        }]
      ],
      Container: container
    });

  static createEndpointUuid = (activityId: string, outcome: string) => `activity-${activityId}-${outcome}`;

  static getSourceEndpointOptions = (activityId: string, outcome: string): any => {
    const fill = '#7da7f2';
    const stroke = fill;
    return {
      type: "Dot",
      anchor: 'Continuous',
      paintStyle: {
        stroke: stroke,
        fill: fill,
        strokeWidth: 2
      },
      isSource: true,
      connector: ['Flowchart', {stub: [40, 60], gap: 0, cornerRadius: 5, alwaysRespectStubs: true}],
      connectorStyle: {
        strokeWidth: 2,
        stroke: '#999999',
        fill: 'white',
      },
      hoverPaintStyle: {
        fill: stroke,
        stroke: fill
      },
      connectorHoverStyle: {
        strokeWidth: 3,
        stroke: stroke,
        fill: 'white'
      },
      connectorOverlays: [['Label', {location: [3, -1.5], cssClass: 'endpointSourceLabel'}]],
      dragOptions: {},
      uuid: JsPlumbUtils.createEndpointUuid(activityId, outcome),
      parameters: {
        outcome
      },
      scope: null,
      reattachConnections: true,
      maxConnections: 1
    };
  };
}
