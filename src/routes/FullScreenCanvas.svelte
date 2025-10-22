<script lang="ts">
	import { createMandelbrotShader, type MandelbrotUniforms } from "$lib/mandelbrot-shader";
	import { Mat3, Vec2 } from "$lib/math";
	import { ShaderCanvasContext } from "$lib/shader-canvas-context";
	import { FractalViewerState } from "$lib/viewer-state.svelte";
    
    let canvas = $state<HTMLCanvasElement | null>(null);
    let context = $state<ShaderCanvasContext | null>(null);
    let viewerState = $state<FractalViewerState>(new FractalViewerState());
    
    // create rendering context on canvas mount
    $effect(() => {
        if (canvas != null) {
            console.debug("Creating canvas context");
            const ctx = new ShaderCanvasContext(canvas);
            const shader = createMandelbrotShader(ctx.gl);
            ctx.setShader(shader);
            onResize();
            context = ctx;

            return () => {
                console.debug("Destroying canvas context");
                ctx.destroy();
                context = null;
            };
        }
    });

    // re-render on canvas resize
    $effect(() => {
        if (context != null) {
            const uniforms = viewerState.createUniforms();
            context.updateUniforms(uniforms);
            context.render();
        }
    });

    function onResize() {
        if (canvas != null) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        viewerState.screenSize = new Vec2(window.innerWidth, window.innerHeight);
    }

    function onScroll(evt: WheelEvent) {
        const aspect = viewerState.screenSize.y / viewerState.screenSize.x;
        const screenPos = new Vec2(evt.clientX, evt.clientY).div(viewerState.screenSize.scale(0.5)).sub(new Vec2(1, 1)).div(new Vec2(aspect, -1));

        const worldPosBefore = viewerState.viewMatrix.mulVec(screenPos);
        
        if (evt.deltaY > 0) {
            viewerState.zoom *= 1.1;
        } else {
            viewerState.zoom *= 0.9;
        }
        
        const futureViewMatrix = Mat3.makeTransformation(viewerState.center, viewerState.zoom);
        const worldPosAfter = futureViewMatrix.mulVec(screenPos);
        const offset = worldPosAfter.sub(worldPosBefore);
        
        viewerState.center = viewerState.center.sub(offset);
    }

    function onDrag(evt: MouseEvent) {
        if ((evt.buttons & 1) > 0) {
            const scale = viewerState.screenSize.y * 0.5 * (1/viewerState.zoom);
            const offset = new Vec2(-evt.movementX, evt.movementY).scale(1/scale);
            viewerState.center = viewerState.center.add(offset);
        }
    }
</script>

<svelte:window onresize={onResize}/>

<canvas bind:this={canvas} onwheel={onScroll} onmousemove={onDrag}></canvas>

<style>
    canvas {
        width: 100%;
        height: 100%;
    }
</style>