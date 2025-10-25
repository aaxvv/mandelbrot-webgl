import type { MandelbrotUniforms } from "./mandelbrot-shader";
import { Mat3, Vec2 } from "./math";

const BASE_ITERATIONS = 1000;
const ITERATIONS_PER_ZOOM_MAGNITUDE = 400;

export class FractalViewerState {
    screenSize = $state(new Vec2(1, 1));
    iterations = $state(1000);
    initialZ = $state(Vec2.ZERO);

    center = $state(Vec2.ZERO);
    zoom = $state(1);

    renderScale = $state(1);
    autoIteration = $state(true);

    viewMatrix = $derived(Mat3.makeTransformation(this.center, this.zoom));
    renderSize = $derived(this.screenSize.scale(this.renderScale));

    constructor() {
        $effect(() => {
            if (this.autoIteration) {

                this.iterations = BASE_ITERATIONS + (-Math.log10(this.zoom) * ITERATIONS_PER_ZOOM_MAGNITUDE);
            }
        });
    }

    createUniforms(): MandelbrotUniforms {
        return {
            uScreenSize: this.renderSize,
            uIterations: this.iterations,
            uInitialZ: this.initialZ,
            uViewMat: this.viewMatrix,
        };
    }

    reset() {
        this.iterations = 1000;
        this.center = Vec2.ZERO;
        this.initialZ = Vec2.ZERO;
        this.zoom = 1;
        this.renderScale = 1;
    }
}
