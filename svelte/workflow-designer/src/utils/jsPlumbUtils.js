import {jsPlumb} from 'jsplumb';

const jsPlumbKey = {};

export {jsPlumbKey};

export function createEndpointUuid(activityId, outcome) {
    return `activity-${activityId}-${outcome}`;
}

export function createActivityElementId(activityId) {
    return `activity-${activityId}`;
}

export function createSourceEndpoint(activityId, outcome) {
    return {
        type: "Dot",
        anchor: 'Continuous',
        isSource: true,
        connector: ['Flowchart', { stub: [40, 60], gap: 0, cornerRadius: 5, alwaysRespectStubs: true }],
        dragOptions: {},
        uuid: createEndpointUuid(activityId, outcome),
        parameters: {
            outcome
        },
        scope: null,
        reattachConnections: true,
        maxConnections: 1
    };
}

export function createJsPlumbInstance(element) {

    const p = jsPlumb.getInstance({
        DragOptions: {cursor: 'pointer', zIndex: 2000},
        ConnectionOverlays: [
            ['Arrow', {
                location: 1,
                visible: true,
                width: 11,
                length: 11
            }]
        ],
        Container: element
    });

    p.Defaults.Anchor = "Continuous";

    return p;
}