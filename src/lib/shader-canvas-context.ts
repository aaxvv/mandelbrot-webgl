
const ATTRIB_VERTEX_POS = "aVertexPosition";

export enum UniformType {
    FLOAT,
    INT,
    VEC_2,
    VEC_3,
    VEC_4,
    MAT_2,
    MAT_3,
    MAT_4,
}

// Helpful background: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Adding_2D_content_to_a_WebGL_context

export class ShaderCanvasContext {
    canvas: HTMLCanvasElement;
    gl: WebGLRenderingContext;
    shaderProgram: ShaderProgram | null;
    positionBuffer: WebGLBuffer;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        const gl = canvas.getContext("webgl");
        if (gl == null) {
            throw new Error("Failed to initialize context");
        }
        this.gl = gl;
        this.shaderProgram = null;

        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    }

    setShader(program: ShaderProgram) {
        if (this.shaderProgram != null) {
            this.shaderProgram.destroy();
        }
        this.shaderProgram = program;
    }

    render() {
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        if (this.shaderProgram == null) {
            return;
        }
        
        this.gl.useProgram(this.shaderProgram.program);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);

        const vertexAttribLocation = this.shaderProgram.attributeLocations.ATTRIB_VERTEX_POS;
        this.gl.vertexAttribPointer(
            vertexAttribLocation,
            2,              // numComponents
            this.gl.FLOAT,  // type 
            false,          // normalize
            0,              // stride
            0,              // offset
        );
        this.gl.enableVertexAttribArray(vertexAttribLocation);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }

    updateUniforms(values: {[name: string]: any}) {
        this.shaderProgram?.setUniforms(values);
    }

    destroy() {
        console.debug("Destroying canvas context")
        this.shaderProgram?.destroy();
        this.gl.deleteBuffer(this.positionBuffer);
    }
}

export class ShaderProgram {
    gl: WebGLRenderingContext;

    vertexShader: WebGLShader;
    fragmentShader: WebGLShader;
    program: WebGLProgram;

    attributeLocations: {[name: string]: GLuint};
    uniformLocations: {[name: string]: {loc: WebGLUniformLocation, type: UniformType}};

    constructor(gl: WebGLRenderingContext, vsSource: string, fsSource: string, uniforms: {[name: string]: UniformType}) {
        this.gl = gl;
        this.vertexShader = compileShader(gl, "vertex", vsSource);
        this.fragmentShader = compileShader(gl, "fragment", fsSource);

        this.program = gl.createProgram();
        gl.attachShader(this.program, this.vertexShader);
        gl.attachShader(this.program, this.fragmentShader);
        gl.linkProgram(this.program);

        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            const error = gl.getProgramInfoLog(this.program);
            this.destroy();
            throw new Error(`Failed to link shader: ${error}`)
        }

        this.attributeLocations = {
            ATTRIB_VERTEX_POS: gl.getAttribLocation(this.program, ATTRIB_VERTEX_POS)
        }

        this.uniformLocations = {};
        for (const [name, type] of Object.entries(uniforms)) {
            const location = gl.getUniformLocation(this.program, name);
            if (location == null) {
                this.destroy();
                throw new Error(`Failed to find uniform '${name}'`);
            }
            this.uniformLocations[name] = {loc: location, type: type};
        }
    }

    setUniforms(values: {[name: string]: any}) {
        this.gl.useProgram(this.program);
        for (const [name, value] of Object.entries(values)) {
            const uniform = this.uniformLocations[name];
            if (uniform == undefined) {
                throw new Error(`Tried to set unknown uniform '${name}'`);
            }
            switch (uniform.type) {
                case UniformType.FLOAT:
                    this.gl.uniform1f(uniform.loc, value);
                    break;
                case UniformType.INT:
                    this.gl.uniform1i(uniform.loc, value);
                    break;
                case UniformType.VEC_2:
                    this.gl.uniform2f(uniform.loc, value.x, value.y);
                    break;
                case UniformType.VEC_3:
                    this.gl.uniform3f(uniform.loc, value.x, value.y, value.z);
                    break;
                case UniformType.VEC_4:
                    this.gl.uniform4f(uniform.loc, value.x, value.y, value.z, value.w);
                    break;
                case UniformType.MAT_2:
                    this.gl.uniformMatrix2fv(uniform.loc, false, value.m);
                    break;
                case UniformType.MAT_3:
                    this.gl.uniformMatrix3fv(uniform.loc, false, value.m);
                    break;
                case UniformType.MAT_4:
                    this.gl.uniformMatrix4fv(uniform.loc, false, value.m);
                    break;
            }
        }
    }

    destroy() {
        console.debug("Destroying shader program");
        this.gl.deleteProgram(this.program);
        this.gl.deleteShader(this.vertexShader);
        this.gl.deleteShader(this.fragmentShader);
    }
}

function compileShader(gl: WebGLRenderingContext, type: "vertex" | "fragment", source: string): WebGLShader {
    const shader = gl.createShader(type == "vertex" ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER);
    if (shader == null) {
        throw new Error("Failed to create shader");
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const error = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error(`Failed to compile shader: ${error}`)
    }

  return shader;
}