import {jsPlumb, jsPlumbInstance} from 'jsplumb';
import {ActivityDefinition, Workflow} from "../../models";
import {evaluateOutcome} from "./outcome-evaluator";

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
    connector: ['Flowchart', {stub: [40, 60], gap: 0, cornerRadius: 5, alwaysRespectStubs: true}],
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

export function createJsPlumb(element) {

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

  p.importDefaults({Anchor: "Continuous"});

  return p;
}

export function displayWorkflow(jsPlumb: jsPlumbInstance, workflowCanvasElement: HTMLElement, workflow: Workflow, activityDefinitions: Array<ActivityDefinition>) {

  const setupActivities = () => {

    const getActivity = id => workflow.activities.find(x => x.id === id);
    const getActivityDefinition = (type):ActivityDefinition => activityDefinitions.find(x => x.type == type);

    const makeTarget = (activityElement) => {
      jsPlumb.makeTarget(activityElement, {
        dropOptions: {hoverClass: 'hover'},
        anchor: 'Continuous',
        endpoint: ['Blank', {radius: 4}]
      });
    };

    const createOutcomeEndpoints = (activityElement: HTMLElement) => {
      const activityId = activityElement.getAttribute('data-activity-id');
      const activity = getActivity(activityId);
      const activityDefinition = getActivityDefinition(activity.type);

      if(!activityDefinition)
      {
        console.warn(`Could not find activity of type ${activity.type}`);
        return;
      }

      const outcomes: Array<string> = activityDefinition.outcomes || [];
      const evaluatedOutcomes = outcomes.map(x => evaluateOutcome(x, activity, activityDefinition)).reduce((a, b) => a.concat(b));

      for (const outcome of evaluatedOutcomes) {
        const sourceEndpointOptions: any = createSourceEndpoint(activity.id, outcome);
        const endpointOptions: any = {
          connectorOverlays: [['Label', {label: outcome, cssClass: 'connection-label'}]],
          cssClass: 'panzoom-exclude'
        };
        jsPlumb.addEndpoint(activityElement, endpointOptions, sourceEndpointOptions);
      }
    };

    const setupDragDrop = (activityElement: HTMLElement) => {
      const activityId = activityElement.getAttribute('data-activity-id');
      const activity = getActivity(activityId);
      let dragStart = null;
      let hasDragged = false;

      const options: any = {
        containment: true,
        start: params => {
          dragStart = {left: params.e.screenX, top: params.e.screenY};
        },
        stop: async params => {
          hasDragged = dragStart.left !== params.e.screenX || dragStart.top !== params.e.screenY;

          if (!hasDragged)
            return;

          activity.left = params.pos[0];
          activity.top = params.pos[1];
        }
      };

      jsPlumb.draggable(activityElement, options);
    };

    workflowCanvasElement.querySelectorAll('.activity').forEach((e: HTMLElement) => {
      makeTarget(e);
      createOutcomeEndpoints(e);
      setupDragDrop(e);
    });
  };

  const createConnections = () => {
    for (const connection of workflow.connections) {
      const sourceEndpointId = createEndpointUuid(connection.sourceActivityId, connection.outcome);
      const sourceEndpoint = jsPlumb.getEndpoint(sourceEndpointId);
      const targetElementId = createActivityElementId(connection.targetActivityId);

      jsPlumb.connect({
        source: sourceEndpoint,
        target: targetElementId,
        cssClass: 'elsa'
      } as any);
    }
  };

  jsPlumb.batch(() => {
    setupActivities();
    createConnections();
  });
}
