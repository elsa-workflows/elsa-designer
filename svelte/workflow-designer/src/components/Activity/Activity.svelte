﻿﻿﻿
<script>
    import {onMount, getContext} from "svelte";
    import {createActivityElementId, createSourceEndpoint, jsPlumbKey} from "../../utils/jsPlumbUtils";
    import {Activity} from "../../models";

    export let activity = new Activity();

    let element;
    const {getPlumber} = getContext(jsPlumbKey);
    const plumber = getPlumber();

    onMount(() => {
        makeTarget();
        createOutcomeEndpoints();
        setupDragDrop();
    });

    function makeTarget() {
        plumber.makeTarget(element, {
            dropOptions: {hoverClass: 'hover'},
            anchor: 'Continuous',
            endpoint: ['Blank', {radius: 4}]
        });
    }

    function createOutcomeEndpoints() {
        const outcomes = activity.outcomes || [];

        for (const outcome of outcomes) {
            const sourceEndpointOptions = createSourceEndpoint(activity.id, outcome);
            const endpointOptions = {
                connectorOverlays: [['Label', {label: outcome, cssClass: 'connection-label'}]],
                cssClass: 'panzoom-exclude'
            };
            plumber.addEndpoint(element, endpointOptions, sourceEndpointOptions);
        }
    }

    function setupDragDrop() {
        let dragStart = null;
        let hasDragged = false;

        plumber.draggable(element, {
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
        });
    }

</script>

<style src="./Activity.scss" global></style>

<div id="{createActivityElementId(activity.id)}" data-activity-id="{activity.id}" class="activity noselect panzoom-exclude" bind:this={element} style="top: {activity.top}px; left: {activity.left}px;">
    <h5><i class="fa fa-cog"></i>{activity.displayName}</h5>
</div>