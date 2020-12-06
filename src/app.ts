import { complex, imag, mul, exp, real, I } from "./complex.js";

const REFRESH = 30;   // Animation resfresh rate (times per second)

const UNIT_SIZE = 100; // Pixel size of a unit
const HALF_AXIS_UNITS = 2; // How many units in half of an axis
const HALF_AXIS_SIZE = UNIT_SIZE * HALF_AXIS_UNITS;

const EDGE = HALF_AXIS_SIZE;

var t = 0;
var img = new Image();

var canvas: HTMLCanvasElement;
var src: ImageData, dst: ImageData;

var fn: (z: complex, t: number) => complex = (z: complex) => {
    return exp(z, [1, 1])
}

window.onload = () => {
    canvas = <HTMLCanvasElement>document.getElementById("plane");
    setInterval(render, 1000 / REFRESH);

    const ctx = canvas.getContext('2d');

    src = new ImageData(canvas.width, canvas.height);
    drawLines(src);

    dst = new ImageData(src.width, src.height);
}

function render() {
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    dst.data.set(ctx.getImageData(0, 0, canvas.width, canvas.height).data);

    for (var x = 0; x < 400; x++) {
        for (var y = 0; y < 400; y++) {
            const colour = rgb(...getPixel(src, x, y));

            const a = (x - 200) / UNIT_SIZE;
            const b = (y - 200) / UNIT_SIZE;

            const z: complex = [a, b];
            const w = fn(z, t);

            const nx = Math.round(real(w) * UNIT_SIZE + 200);
            const ny = Math.round(imag(w) * UNIT_SIZE + 200);

            if ((nx < 0 || nx >= 400) || (ny < 0 || ny >= 400))
                continue;

            setPixel(dst, nx, ny, colour);
        }
    }

    ctx.putImageData(dst, 0, 0);
    t += 0.025;

    if (t > Math.E) t = 0
}

// "./static/img/piggy.png"
function loadImage(url) {
    const ctx = canvas.getContext('2d');

    img.src = url;
    img.onload = () => {
        ctx.drawImage(img, 0, 0);
        src = new ImageData(canvas.width, canvas.height);

        src.data.set(ctx.getImageData(0, 0, canvas.width, canvas.height).data);
        dst = new ImageData(src.width, src.height);
    };
}

function drawLines(data) {
    const black = rgb(0, 0, 0);
    const white = rgb(255, 255, 255);
    const primary = rgb(82, 127, 135);
    const secondary = rgb(214, 186, 129);

    // x-axis (micro)
    for (var u = EDGE - UNIT_SIZE; u < EDGE + UNIT_SIZE; u += UNIT_SIZE / 5)
        for (var x = 100; x < 300; x++)
            setPixel(data, x, u, secondary);

    // y-axis (micro)
    for (var u = EDGE - UNIT_SIZE; u < EDGE + UNIT_SIZE; u += UNIT_SIZE / 5)
        for (var y = 100; y < 300; y++)
            setPixel(data, u, y, secondary);

    // x-axis (sub)
    for (var u = UNIT_SIZE; u < 2 * EDGE; u += UNIT_SIZE)
        for (var x = 0; x < 400; x++)
            setPixel(data, x, u, primary);

    // y-axis (sub)
    for (var u = UNIT_SIZE; u < 2 * EDGE; u += UNIT_SIZE)
        for (var y = 0; y < 400; y++)
            setPixel(data, u, y, primary);

    // x-axis
    for (var x = 0; x < 400; x++)
        for (var d = -1; d <= 1; d++)
            setPixel(data, x, 200 + d, white);

    // y-axis
    for (var y = 0; y < 400; y++)
        for (var d = -1; d <= 1; d++)
            setPixel(data, 200 + d, y, white);
}

function rgb(r: number, g: number, b: number): Uint8Array {
    return Uint8Array.from([r, g, b])
}

function setPixel(d: ImageData, x: number, y: number, colour: Uint8Array) {
    const idx = 4 * (x * d.width + y);
    d.data.set(colour, idx);
}

function getPixel(d: ImageData, x: number, y: number): [number, number, number] {
    const idx = 4 * (x * d.width + y);
    return [d.data[idx], d.data[idx + 1], d.data[idx + 2]];
}
