<script>
    //export let target;
    let hidden = true;
    let position = {left: 0, top: 0};

    $: css = {
        left: `${position.left}px`,
        top: `${position.top}px`,
        display: hidden ? 'none' : 'block'
    };
    
    export function show(e){
        onContextMenu(e);
    }

    function onContextMenu(e) {
        if (e.defaultPrevented)
            return;

        e.preventDefault();
        //this.contextMenuEvent.emit();
        position = {left: e.pageX, top: e.pageY};
        hidden = false;
    }

    function onContextMenuClick() {
        hidden = true;
    }

    // $: {
    //     if (!!target) {
    //         target.addEventListener('contextmenu')
    //     }
    // }
</script>

<svelte:body on:click={hidden=true} on:contextmenu={hidden=true}/>

<div class="dropdown-menu context-menu canvas-context-menu position-fixed" style={css} on:click={onContextMenuClick}>
    Hello Context
</div>