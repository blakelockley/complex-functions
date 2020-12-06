export type complex = [number, number];

export const I: complex = [0, 1];

// Components
export function real(z: complex): number {
    return z[0]
}

export function imag(z: complex): number {
    return z[1]
}

// Unary operations
export function conjugate(z: complex): complex {
    return [real(z), -imag(z)]
}

export const conj = conjugate;

/*
 * Multiplies self by conjugate and returns the real value.
 *
 * z = a + bi
 * z * conj(z) = a^2 * b^2 = |z|^2
 */
function zz(z: complex): number {
    return real(mul(z, conjugate(z)))
}

export function modulus(z: complex): number {
    return Math.sqrt(zz(z));
}

export const mod = modulus;
export const abs = modulus;

export function arg(z: complex): number {
    return Math.atan2(imag(z), real(z));
}

// Binary operations (complex)
export function add(z0: complex, z1: complex): complex {
    const [a, b] = z0;
    const [c, d] = z1;

    return [a + c, b + d];
}

export function mul(z0: complex, z1: complex): complex {
    const [a, b] = z0;
    const [c, d] = z1;

    return [(a * c) - (b * d), (a * d) + (c * b)];
}

export function sub(z0: complex, z1: complex): complex {
    return add(z0, mul(z1, [-1, 0]));
}

export function div(z0: complex, z1: complex): complex {
    const n = mul(z0, conjugate(z1));
    const d = zz(z1);

    return [real(n) / d, imag(n) / d];
}

export function exp(z0: complex, z1: complex): complex {
    const [c, d] = z1;
    const m = Math.pow(modulus(z0), c);
    const theta = (c * arg(z0)) + (d * Math.log(modulus(z0)));

    return [m * Math.cos(theta), m * Math.sin(theta)];
}

// Misc
export function lerp(z0: complex, z1: complex, t: number): complex {
    return add(z0, mul(sub(z1, z0), [t, 0]));
}

export function toString(z: complex): string {
    const a = Math.round(real(z) * 1000) / 1000;
    const b = Math.round(imag(z) * 1000) / 1000;

    if (a === 0) return `${a}i`;
    if (b === 0) return `${b}`;

    return `${a} + ${b}i`;
} 