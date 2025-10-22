import type { Mat3, Vec2 } from "./math";
import { ShaderProgram, UniformType } from "./shader-canvas-context";

const VERTEX_SHADER = `
    precision highp float;

    attribute vec4 aVertexPosition;
    uniform vec2 uScreenSize;

    varying vec2 vPos;

    void main() {
        gl_Position = aVertexPosition;
        float aspect = uScreenSize.y / uScreenSize.x;
        vPos = vec2(gl_Position.x / aspect, gl_Position.y);
    }
`;

const FRAGMENT_SHADER = `
    precision highp float;
    
    const int MAX_ITERATIONS = 10000;
    const float ESCAPE_RADIUS_SQR = 4.0;
    
    uniform int uIterations;
    uniform mat3 uViewMat;

    varying vec2 vPos;

    void main() {

        vec2 z = vec2(0.0, 0.0);
        vec3 vPosTransformed = uViewMat * vec3(vPos, 1.0);
        vec2 c = vec2(vPosTransformed.x, vPosTransformed.y);

        int escapeIter = 0;
        float magnitudeSqr = pow(z.x, 2.0) + pow(z.y, 2.0);

        for (int i = 1; i < MAX_ITERATIONS; i++) {
            if (i > uIterations) {
                break;
            }

            z = z + c;
            z = vec2(pow(z.x, 2.0) - pow(z.y, 2.0), 2.0 * z.x * z.y);
            magnitudeSqr = pow(z.x, 2.0) + pow(z.y, 2.0);

            if (magnitudeSqr > ESCAPE_RADIUS_SQR && escapeIter == 0) {
                escapeIter = i;
                break;
            }
        }

        if (magnitudeSqr < ESCAPE_RADIUS_SQR) {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        } else {
            float lightness = pow(float(escapeIter) / float(uIterations), 0.25);
            gl_FragColor = vec4(lightness, 0.0, lightness, 1.0);
        }
    }
`;

export interface MandelbrotUniforms {
    uScreenSize: Vec2,
    uIterations: number,
    uViewMat: Mat3,
}

const UNIFORMS: {[K in keyof(MandelbrotUniforms)]: UniformType} = {
    uScreenSize: UniformType.VEC_2,
    uIterations: UniformType.INT,
    uViewMat: UniformType.MAT_3,
};

export function createMandelbrotShader(gl: WebGLRenderingContext): ShaderProgram {
    console.debug("Creating shader program");
    return new ShaderProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER, UNIFORMS);
}
