import type { MandelbrotUniforms } from "./mandelbrot-shader";
import { Mat3, Vec2 } from "./math";

export class FractalViewerState {
    screenSize = $state(new Vec2(1, 1));
    iterations = $state(1000);
    center = $state(Vec2.ZERO);
    zoom = $state(1);

    viewMatrix = $derived(Mat3.makeTransformation(this.center, this.zoom));

    createUniforms(): MandelbrotUniforms {
        return {
            uScreenSize: this.screenSize,
            uIterations: this.iterations,
            uViewMat: this.viewMatrix,
        };
    }


}