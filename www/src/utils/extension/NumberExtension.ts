import { getActualPixel } from "../helper"

Number.prototype.actualPixel = function (): number {
    return getActualPixel(Number(this))
}

Number.prototype.angleToRadian = function (): number {
    return Number(this) * Math.PI / 180
}

Number.prototype.radianToAngle = function (): number {
    return Number(this) * 180 / Math.PI
}

export { }
