/**
 * 夹在min和max
 * @param n
 * @param min
 * @param max
 * @returns
 */
export function clamp(n: number, min: number, max: number): number {
    return n < min ? min : n > max ? max : n
}
