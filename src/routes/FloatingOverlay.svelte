<script lang="ts">
	import { CircleQuestionMark } from "@lucide/svelte";
	import type { Snippet } from "svelte";

    const {children, side}: {children?: Snippet, side: "left" | "right"} = $props();

    let open = $state(false);
</script>

<div class="container" class:left={side=="left"} class:right={side=="right"}>
    <button onclick={() => {open = !open}}>
        <CircleQuestionMark color="currentColor" size=24/>
    </button>

    <div class="content" class:hidden={!open}>
        {@render children?.()}
    </div>
</div>

<style>
    :root {
        --bg-color: #222a;
    }
    button {
        aspect-ratio: 1;
        background-color: var(--bg-color);
        border: 0;
        color: currentColor;

        &:hover {
            background-color: #0002;
            cursor: pointer;
        }
    }

    .container {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 1.25rem;
        margin: 9px;
        position: absolute;
        top: 0;
        display: flex;
        flex-direction: column;
        gap: 8px;

        color: #ccc;
    }

    .left {
        left: 0;
        align-items: start;
    }

    .right {
        right: 0;
        align-items: end;
    }

    .content {
        background-color: var(--bg-color);
        padding: 12px;
    }

    .hidden {
        display: none;
    }
</style>