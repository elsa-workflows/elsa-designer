﻿<script>
    let hidden = true;
    let position = {left: 0, top: 0};
    
    $: css = {
        left: `${position.left}px`,
        top: `${position.top}px`,
        display: hidden ? 'none' : 'block'
    };
    
    export function show(e) {
        onContextMenu(e);
    }

    export function hide() {
        hidden = true;
    }

    function onContextMenu(e) {
        if (e.defaultPrevented)
            return;

        e.preventDefault();
        e.stopImmediatePropagation();
        position = {left: e.pageX, top: e.pageY};
        hidden = false;
    }

    function onContextMenuClick(e) {
        hidden = true;
    }
    
    function onClickOutside(e){
        hidden = true;
    }
</script>

<svelte:body on:click={onClickOutside} on:contextmenu={onClickOutside}/>

<div class="dropdown-menu context-menu canvas-context-menu position-fixed" style="left:{css.left};top:{css.top};display:{css.display};" on:click={onContextMenuClick}>
    <slot/>
</div>