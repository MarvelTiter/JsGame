export function randomBetween(max: number, min: number): number {
    return Math.random() * (max - min) + min
}

/**
 * 获取屏幕实际像素比 有部分屏幕是 2K 的实际像素就要 * 2
 * @param px
 */
 export const getActualPixel = (px: number) => {
    const devicePixelRatio: number = window.devicePixelRatio || 1;
    return px * devicePixelRatio;
  };
