/**
 * 夹在min和max
 * @param n
 * @param min
 * @param max
 * @returns
 */
export function clamp(n: number, min: number, max: number): number {
    if (n < min) {
        return min
    } else if (n > max) {
        return max
    } else {
        return n
    }
}
