<script lang="ts">
	import { FractalViewerState } from "$lib/viewer-state.svelte";
	import { CircleQuestionMark, Settings, Settings2 } from "@lucide/svelte";
	import FloatingOverlay from "./FloatingOverlay.svelte";
	import FullScreenCanvas from "./FullScreenCanvas.svelte";
	import ViewerControls from "./ViewerControls.svelte";

    let viewerState = $state<FractalViewerState>(new FractalViewerState());
</script>

<FullScreenCanvas viewerState={viewerState}/>

<FloatingOverlay side="right">
    {#snippet icon()}
        <CircleQuestionMark color="currentColor" size=24/>
    {/snippet}
    Controls
    <ul style="margin: 0 1rem 0 0; padding-left: 1.5rem;">
        <li>Pan by holding left-click</li>
        <li>Zoom with scroll wheel</li>
        <li>Hold shift to zoom faster</li>
    </ul>
</FloatingOverlay>

<FloatingOverlay side="left">
    {#snippet icon()}
        <Settings2 color="currentColor" size=24/>
    {/snippet}
    <ViewerControls state={viewerState}/>
</FloatingOverlay>