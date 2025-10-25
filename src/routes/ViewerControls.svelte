<script lang="ts">
	import { MAX_ITERATIONS } from "$lib/mandelbrot-shader";
	import { Vec2 } from "$lib/math";
	import { FractalViewerState } from "$lib/viewer-state.svelte";
	import { ArrowUpCircle, RotateCcw, RotateCcwKey, RotateCcwSquare, Turntable } from "@lucide/svelte";

    const {state}: { state: FractalViewerState } = $props();

    function reset() {
        state.reset();
    }

    type KeyOfType<T, V> = {
        [K in keyof T]: T[K] extends V ? K : never;
    }[keyof T];
</script>

{#snippet numberInput(label: string, key: keyof FractalViewerState, min: number, max: number, step: number = 1, merged = false)}
    <fieldset class:merged={merged}>
        <label>{label}: 
            <input type="number" step={step} min={min} max={max} bind:value={state[key]}>
        </label>
        <input type="range" step={step} min={min} max={max} bind:value={state[key]}>
    </fieldset>
{/snippet}

{#snippet vectorInput<K extends KeyOfType<FractalViewerState, Vec2>>(labels: [string, string], key: K, min: number, max: number, step: number = 1)}
    <fieldset class="merged">
        <label>{labels[0]}: 
            <input type="number" min={min} max={max} step={step} bind:value={() => state[key].x, (val) => state[key] = new Vec2(val, state[key].y)}>
        </label>
        <input type="range" min={min} max={max} step={step} bind:value={() => state[key].x, (val) => state[key] = new Vec2(val, state[key].y)}>
    </fieldset>
    <fieldset>
        <label>{labels[1]}: 
            <input type="number" min={min} max={max} step={step} bind:value={() => state[key].y, (val) => state[key] = new Vec2(state[key].x, val)}>
        </label>
        <input type="range" min={min} max={max} step={step} bind:value={() => state[key].y, (val) => state[key] = new Vec2(state[key].x, val)}>
    </fieldset>
{/snippet}

<div class="controls">
    {@render numberInput("Iterations", "iterations", 1 , MAX_ITERATIONS, 1, true)}
    <fieldset>
        <label>
            Auto Iterations: <input type="checkbox"  bind:checked={state.autoIteration}>
        </label>
    </fieldset>

    {@render numberInput("Render Scale", "renderScale", 0.25, 5, 0.25)}
    {@render numberInput("Zoom", "zoom", 0.00001, 10, 0.1)}

    {@render vectorInput(["X", "Y"], "center", -5, 5, 0.00001)}
    {@render vectorInput(["Zreal", "Zimag"], "initialZ", -5, 5, 0.00001)}

    <button onclick={reset}>
        <RotateCcw/>
        Reset
    </button>
</div>

<style>
    .controls {
        font-size: 1.25rem;
        display: flex;
        flex-direction: column;
    }

    fieldset {
        background-color: #111a;
        padding: 8px;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        margin: 0 0 16px 0;
        border: none;

        &.merged {
            margin: 0;
            padding-bottom: 0;
            border-radius: 8px 8px 0 0;

            & + fieldset {
                padding-top: 0;
                border-radius: 0 0 8px 8px;
            }
        }
    }

    input[type=number] {
        font-family: monospace;
        background-color: #0006;
        padding: 4px;
        border-radius: 8px;
        border: none;
        color: currentColor;
        font-size: 1.25rem;
    }

    button {
        display: flex;
        justify-content: center;
        gap: 8px;
        align-items: center;
        font-family: monospace;
        background-color: #333a;
        padding: 4px;
        border-radius: 8px;
        border: none;
        color: currentColor;
        font-size: 1.25rem;

        &:hover {
            background-color: #444a;
            cursor: pointer;
        }
    }
</style>