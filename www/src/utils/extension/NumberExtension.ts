import { getActualPixel } from "../helper"

Number.prototype.actualPixel = function(): number {  
    return getActualPixel(Number(this))
}  
export {}
