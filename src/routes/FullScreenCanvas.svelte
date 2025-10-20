<script lang="ts">
	import { createMandelbrotShader, type MandelbrotUniforms } from "$lib/mandelbrot-shader";
	import { ShaderCanvasContext } from "$lib/shader-canvas-context";
    
    let canvas = $state<HTMLCanvasElement | null>(null);
    let context = $state<ShaderCanvasContext | null>(null);
    let uniforms = $state<MandelbrotUniforms>({
        uScreenSize: [1, 1],
        uIterations: 1000,
        uCenter: [0, 0],
        uZoom: 1
    });
    
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
            context.updateUniforms(uniforms);
            context.render();
        }
    });

    function onResize() {
        if (canvas != null) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        uniforms.uScreenSize = [window.innerWidth, window.innerHeight];
    }

    function onScroll(evt: WheelEvent) {
        // TODO: zoom into actual pointer position

        if (evt.deltaY > 0) {
            uniforms.uZoom *= 1.1;
        } else {
            uniforms.uZoom *= 0.9;
        }
    }

    function onDrag(evt: MouseEvent) {
        if ((evt.buttons & 1) > 0) {
            const scale = Math.min(uniforms.uScreenSize[0], uniforms.uScreenSize[1]) * 0.5;
            uniforms.uCenter[0] -= evt.movementX / scale;
            uniforms.uCenter[1] += evt.movementY / scale;
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