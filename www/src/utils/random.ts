export function randomBetween(max: number, min: number): number {
    return Math.random() * (max - min) + min
}
