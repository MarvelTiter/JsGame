export interface IRect {
    readonly x: number
    readonly y: number
    w: number
    h: number
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
}

export function createBoxRect(w: number, h: number): IRect {
    return new Rect(w, h)
}

export interface IRectangle {
    getRect: () => IRect
}
