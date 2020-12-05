const len = 3;
const step = 0.01;
let time = -1;
let sign = 1;

const FPS = 30;

var canvas: HTMLCanvasElement;

class Complex {
    real: number;
    imag: number;

    constructor(real: number, imag: number) {
        this.real = real;
        this.imag = imag;
    }

    comps(): [number, number] {
        return [this.real, this.imag];
    }

    magnitude(): number {
        return Math.sqrt(this.multiply(this.conjugate()).real);
    }

    arg(): number {
        return Math.atan(this.imag / this.real);
    }

    conjugate(): Complex {
        return new Complex(this.real, -this.imag);
    }

    scale(scalar: number): Complex {
        const [a, b] = this.comps();
        return new Complex(a * scalar, b * scalar);
    }

    multiply(other: Complex): Complex {
        const [a, b] = this.comps();
        const [c, d] = other.comps();

        return new Complex((a * c) - (b * d), (a * d) + (c * b));
    }

    expn(scalar: number): Complex {
        let a = Math.pow(this.magnitude(), scalar)
        let b = this.arg() * scalar;

        let real = a * Math.cos(b)
        let imag = a * Math.sin(b)

        return new Complex(real, imag);
    }

    exp(other: Complex): Complex {
        const [c, d] = other.comps();

        const modulus = Math.pow(this.magnitude(), c) * Math.exp(-d * this.arg());
        const theta = (c * this.arg()) + (d * Math.log(this.magnitude()));

        const real = modulus * Math.cos(theta);
        const imag = modulus * Math.sin(theta);

        return new Complex(real, imag);
    }

    toString(): string {
        const r = Math.round(this.real * 1000) / 1000;
        const i = Math.round(this.imag * 1000) / 1000;

        if (r === 0) return `${i}i`;
        if (i === 0) return `${r}`;

        return `${r} + ${i}i`;
    }
}

window.onload = () => {
    canvas = <HTMLCanvasElement>document.getElementById("plane");
    setInterval(render, 1000 / FPS)
}

/*
 * Map complex value to canvas coords.
 */
function pixel(z: Complex): [number, number] {
    const x = ((z.real + len) / (len * 2)) * canvas.width;
    const y = ((-z.imag + len) / (len * 2)) * canvas.height;

    return [x, y];
}

function render() {
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    // Horizontal axes
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgb(0, 255, 0)";
    for (let x = -1; x <= 1; x += 0.2) {
        let z0 = new Complex(x, -1);
        let z1 = new Complex(x, 1);

        line(z0, z1);
        line(z0, z1, (z) => z.multiply(new Complex(0, 1)));
    }

    ctx.strokeStyle = "rgb(255, 0, 0)";
    for (let x = -len; x <= len; x += 1) {
        let z0 = new Complex(x, -len);
        let z1 = new Complex(x, len);

        line(z0, z1);
        line(z0, z1, (z) => z.multiply(new Complex(0, 1)));
    }


    // Main axes
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgb(255, 255, 255)";

    let z0 = new Complex(0, -len);
    let z1 = new Complex(0, len);
    line(z0, z1);

    z0 = new Complex(-len, 0);
    z1 = new Complex(len, 0);
    line(z0, z1);

    var fn = (z: Complex) => z.exp(new Complex(1, 1));

    // ctx.strokeStyle = "rgb(0, 127, 255)";
    // line(new Complex(0, 0), new Complex(10, 10), fn)

    fn = (z: Complex) => z.exp(new Complex(0, 1));

    ctx.strokeStyle = "rgb(0, 127, 255)";
    animate(new Complex(0, 0), new Complex(Math.PI * 2, 0), time, fn)

    time += 0.05 * sign;
    if (time >= 2) sign = -1;
    if (time < -1) sign = 1;

}

function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
}

function line(z0: Complex, z1: Complex, fn: (z: Complex) => Complex = id) {
    let t = 0;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();

    let w = fn(z0);
    ctx.moveTo(...pixel(w))

    for (let t = 0; t <= 1; t += step) {
        const [r0, i0] = z0.comps();
        const [r1, i1] = z1.comps();
        const z = new Complex(lerp(r0, r1, t), lerp(i0, i1, t));

        w = fn(z);
        ctx.lineTo(...pixel(w))
    }
    ctx.stroke();
}


function animate(z0: Complex, z1: Complex, t: number, fn: (z: Complex) => Complex = id) {
    const ctx = canvas.getContext('2d');
    ctx.beginPath();

    t = Math.max(0, Math.min(t, 1));
    ctx.moveTo(...pixel(fn(z0)))
    for (let s = step; s <= 1; s += step) {
        const [r0, i0] = z0.comps();
        const [r1, i1] = z1.comps();

        const z = new Complex(lerp(r0, r1, s), lerp(i0, i1, s));
        const w = fn(z);

        const [zr, zi] = z.comps();
        const [wr, wi] = w.comps();
        const zd = new Complex(lerp(zr, wr, t), lerp(zi, wi, t));

        ctx.lineTo(...pixel(zd))
    }
    ctx.moveTo(...pixel(fn(z1)))

    ctx.stroke();
}

function id(z: Complex): Complex {
    return z;
}
