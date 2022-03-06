export interface IRect {
    x: number
    y: number
    w: number
    h: number
    scale(scale: number): void
}

export class Rect implements IRect {
    get x(): number {
        return -this.w / 2
    }
    get y(): number {
        return -this.h / 2
    }
    w: number
    h: number
    constructor(w: number, h: number) {
        this.w = w
        this.h = h
    }
    scale(scale: number) {
        this.w *= scale
        this.h *= scale
    }
}

export function createBoxRect(w: number, h: number): IRect {
    return new Rect(w, h)
}

export interface IRectangle {
    getRect: () => IRect
}
