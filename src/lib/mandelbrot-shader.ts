import { ShaderProgram, UniformType } from "./shader-canvas-context";

const VERTEX_SHADER = `
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
    uniform vec2 uCenter;
    uniform float uZoom;

    varying vec2 vPos;

    void main() {

        vec2 z = vec2(0.0, 0.0);
        vec2 c = (vPos + uCenter) * uZoom;

        int escapeIter = 0;
        float magnitudeSqr = pow(z.x, 2.0) + pow(z.y, 2.0);

        for (int i = 0; i < MAX_ITERATIONS; i++) {
            if (i > uIterations) {
                break;
            }

            z = z + c;
            z = vec2(pow(z.x, 2.0) - pow(z.y, 2.0), 2.0 * z.x * z.y);
            magnitudeSqr = pow(z.x, 2.0) + pow(z.y, 2.0);

            if (magnitudeSqr > ESCAPE_RADIUS_SQR && escapeIter == 0) {
                escapeIter = i;
            }
        }

        if (magnitudeSqr < ESCAPE_RADIUS_SQR) {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        } else {
            float lightness = pow(float(escapeIter) / float(uIterations), 0.25);
            gl_FragColor = vec4(0.0, 0.0, lightness, 1.0);
        }
    }
`;

export interface MandelbrotUniforms {
    uScreenSize: [number, number],
    uIterations: number,
    uCenter: [number, number],
    uZoom: number,
}

const UNIFORMS: {[K in keyof(MandelbrotUniforms)]: UniformType} = {
    uScreenSize: UniformType.VEC_2,
    uIterations: UniformType.INT,
    uCenter: UniformType.VEC_2,
    uZoom: UniformType.FLOAT
};

export function createMandelbrotShader(gl: WebGLRenderingContext): ShaderProgram {
    console.debug("Creating shader program");
    return new ShaderProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER, UNIFORMS);
}
