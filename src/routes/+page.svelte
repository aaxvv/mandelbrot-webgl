<script lang="ts">
	import FloatingOverlay from "./FloatingOverlay.svelte";
	import FullScreenCanvas from "./FullScreenCanvas.svelte";
</script>

<FullScreenCanvas/>

<FloatingOverlay side="right">
    Controls
    <ul style="margin: 0 1rem 0 0; padding-left: 1.5rem;">
        <li>Pan by holding left-click</li>
        <li>Zoom with scroll wheel</li>
    </ul>
</FloatingOverlay>
