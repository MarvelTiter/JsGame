export class Size {
    w: number
    h: number
    constructor(w?: number, h?: number) {
        this.w = w || 0
        this.h = h || 0
    }
    div(p: number) {
        this.w = this.w * p
        this.h = this.h * p
    }
}
