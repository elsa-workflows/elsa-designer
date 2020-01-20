﻿<script>
    export let text = 'Untitled';
</script>

<a class="dropdown-item" href="#" on:click|preventDefault>
    <slot>{text}</slot>
</a>