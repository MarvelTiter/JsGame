import { Rect } from "./Rect"

export class Size {
    w: number
    h: number
    constructor(w?: number, h?: number) {
        this.w = w || 0
        this.h = h || 0
    }
    div(p: number): Size {
        this.w = this.w * p
        this.h = this.h * p
        return this
    }
    set(w: number, h: number): Size {
        this.w = w
        this.h = h
        return this
    }
    copy() {
        return new Size(this.w, this.h)
    }
}


