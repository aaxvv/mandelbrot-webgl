
export class Vec2 {
    static ZERO = new Vec2(0, 0);

    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    add(other: Vec2): Vec2 {
        return new Vec2(this.x + other.x, this.y + other.y);
    }

    sub(other: Vec2): Vec2 {
        return new Vec2(this.x - other.x, this.y - other.y);
    }

    mul(other: Vec2): Vec2 {
        return new Vec2(this.x * other.x, this.y * other.y);
    }

    div(other: Vec2): Vec2 {
        return new Vec2(this.x / other.x, this.y / other.y);
    }

    scale(scalar: number): Vec2 {
        return new Vec2(this.x * scalar, this.y * scalar);
    }

    length(): number {
        return Math.sqrt(this.length());
    }

    lengthSqr(): number {
        return Math.pow(this.x, 2) + Math.pow(this.y, 2);
    }
}

// 3x3 matrix limited only to affine transformations
export class Mat3 {
    static IDENTITY = new Mat3(new Float64Array([1, 0, 0, 0, 1, 0, 0, 0, 1]));

    // column major order, i.e. down left-most column, then middle column, then right column
    m: Float64Array;

    constructor(values: Float64Array) {
        this.m = values;
        this.m.set(values);
    }

    mulMat(other: Mat3): Mat3 {
        const result = new Float64Array(9);
    
        // For column-major matrices: result = this * other
        // result[col][row] = sum of this[k][row] * other[col][k] for k = 0,1,2
        
        for (let col = 0; col < 3; col++) {
            for (let row = 0; row < 3; row++) {
                let sum = 0;
                for (let k = 0; k < 3; k++) {
                    // Column-major: index = col * 3 + row
                    sum += this.m[k * 3 + row] * other.m[col * 3 + k];
                }
                result[col * 3 + row] = sum;
            }
        }

        return new Mat3(result);
    }

    mulVec(vec: Vec2): Vec2 {
        const x = (vec.x * this.m[0]) + (vec.y * this.m[3]) + this.m[6];
        const y = (vec.x * this.m[1]) + (vec.y * this.m[4]) + this.m[7];
        return new Vec2(x, y);
    }

    inv(): Mat3 {
        // var   | index | value
        // a b c | 0 3 6 | ? ? ?
        // d e f | 1 4 7 | ? ? ?
        // g h i | 2 5 8 | 0 0 1

        // A =  e      D = -b     G =  (bf-ce) 
        // B = -d      E =  a     H = -(af-cd) 
        // C =  0      F =  0     I =  (ae-bd)
        const m = this.m;

        const det = (m[0]*m[4]) + (m[3]*-m[1]);
        const di = 1/det;

        // row major: A B C D E F G H I
        return new Mat3(new Float64Array([
            di*m[4], -di*m[1], 0, 
            -di*m[3], di*m[0], 0,
            di*((m[3]*m[7])-(m[6]*m[4])), -di*((m[0]*m[7])-(m[6]*m[1])), 1,
        ]));
    }

    static makeTranslation(offset: Vec2): Mat3 {
        return new Mat3(new Float64Array([1, 0, 0, 0, 1, 0, offset.x, offset.y, 1]));
    }

    static makeScaling(scale: number): Mat3 {
        return new Mat3(new Float64Array([scale, 0, 0, 0, scale, 0, 0, 0, 1]));
    }

    static makeTransformation(offset: Vec2, scale: number): Mat3 {
        return Mat3.makeTranslation(offset).mulMat(Mat3.makeScaling(scale));
    }
}