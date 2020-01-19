﻿
<script>
    import {onMount, setContext, tick} from 'svelte';
    import Panzoom from '@panzoom/panzoom';
    import {Activity as ActivityModel, Connection, Workflow} from '../../models';
    import Activity from '../Activity/Activity.svelte';
    import {
        createJsPlumbInstance,
        createEndpointUuid,
        createActivityElementId,
        jsPlumbKey
    } from '../../utils/jsPlumbUtils';

    const workflow = new Workflow();
    const writeLine1 = new ActivityModel({
        id: '1',
        type: 'WriteLine',
        displayName: 'Write Line',
        state: {text: {type: 'Literal', expression: 'Hello World!'}},
        outcomes: ['Done'],
        left: 100,
        top: 50
    });
    const writeLine2 = new ActivityModel({
        id: '2',
        type: 'WriteLine',
        displayName: 'Write Line',
        state: {text: {type: 'Literal', expression: 'Goodbye cruel world...'}},
        outcomes: ['Done'],
        left: 350,
        top: 350
    });

    setContext(jsPlumbKey, {
        getPlumber: () => jsPlumb
    });

    workflow.activities = [writeLine1, writeLine2];
    workflow.connections = [new Connection({sourceActivityId: '1', targetActivityId: '2', outcome: 'Done'})];

    let element;
    let jsPlumb;
    let panzoom;

    onMount(() => {
        jsPlumb = createJsPlumbInstance(element);
        jsPlumb.setSuspendDrawing(true);

        // Wait for activity elements to be created.
        tick().then(() => {
            setupJsPlumb(jsPlumb);
        });

        panzoom = createPanzoom();

        return () => {
            jsPlumb.reset();
            panzoom.destroy();
        };
    });

    function setupJsPlumb(jsPlumb) {

        const createConnections = function (jsPlumb) {
            for (const connection of workflow.connections) {
                const sourceEndpointId = createEndpointUuid(connection.sourceActivityId, connection.outcome);
                const sourceEndpoint = jsPlumb.getEndpoint(sourceEndpointId);
                const targetElementId = createActivityElementId(connection.targetActivityId);

                jsPlumb.connect({
                    source: sourceEndpoint,
                    target: targetElementId,
                    cssClass: 'elsa'
                });
            }
        };

        createConnections(jsPlumb);
        jsPlumb.setSuspendDrawing(false, true);
    }

    function createPanzoom() {
        const panzoom = Panzoom(element, {
            maxScale: 4,
            minScale: 0.1,
            overflow: 'hidden',
            contain: 'outside'
        });

        element.parentElement.addEventListener('wheel', panzoom.zoomWithWheel);

        element.addEventListener('panzoomchange', e => {
            const zoom = e.detail.scale;
            jsPlumb.setZoom(zoom);
        });

        return panzoom;
    }

</script>

<style src="./WorkflowCanvas.scss"></style>

<div class="workflow-canvas-container">
    <div class="workflow-canvas" bind:this={element}>
        {#if jsPlumb}
            {#each workflow.activities as activity (activity.id)}
                <Activity activity="{activity}"/>
            {/each}
        {/if}
    </div>
</div>