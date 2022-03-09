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

const dpr = window.devicePixelRatio || 1
/**
 * 获取屏幕实际像素比 有部分屏幕是 2K 的实际像素就要 * 2
 * @param pixel
 * @returns
 */
export function getActualPixel(pixel: number) {
    return pixel * dpr
    return pixel
}
