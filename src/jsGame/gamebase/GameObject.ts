import { BaseSence } from "./BaseSence"
import { Game } from "./Game"
import { Vector2 } from "./data/Vector2"
import { MouseArgs } from "./MouseArgs"
import { Size } from "./data/Size"
// export function observe(data: any) {
//     if (!data || typeof data !== "object") {
//         return
//     }
//     // 取出所有属性遍历
//     Object.keys(data).forEach(key => {
//         if (key == "hasChanged") return
//         defineProp(data, key, data[key])
//     })
// }
// function defineProp(data: any, key: string, childVal: any) {
//     // observe(childVal); //监听子属性
//     Object.defineProperty(data, key, {
//         set: newVal => {
//             data.hasChanged = true
//             childVal = newVal
//         },
//         get: () => {
//             return childVal
//         },
//         enumerable: true, // 可枚举
//         configurable: false // 不能再define
//     })
// }

/**
 * 所有对象的基类
 */
export class GameObject {
    // onTick: Function | undefined

    //#region props

    private _id: string
    public get id(): string {
        return this._id
    }
    protected set id(v: string) {
        this._id = v
    }

    private _game: Game
    public get game(): Game {
        return this._game
    }
    public set game(v: Game) {
        this._game = v
    }

    private _sence: BaseSence
    public get sence(): BaseSence {
        return this._sence
    }
    public set sence(v: BaseSence) {
        this._sence = v
    }

    private _pos: Vector2
    public get pos(): Vector2 {
        return this._pos
    }
    public set pos(v: Vector2) {
        this._pos = v
    }

    private _offset: Vector2
    public get offset(): Vector2 {
        return this._offset
    }
    public set offset(v: Vector2) {
        this._offset = v
    }

    private _size: Size
    public get size(): Size {
        return this._size
    }
    public set size(v: Size) {
        this._size = v
    }

    private _focus: boolean
    public get focus(): boolean {
        return this._focus
    }
    public set focus(v: boolean) {
        this._focus = v
    }

    private _hasChanged: boolean
    public get hasChanged(): boolean {
        return this._hasChanged
    }
    public set hasChanged(v: boolean) {
        this._hasChanged = v
    }

    private _onTick: Function | undefined
    public get onTick(): Function {
        if (this._onTick === undefined) throw new Error("onTick is undefined")
        return this._onTick
    }
    public set onTick(v: Function) {
        this._onTick = v
    }

    //#endregion
    constructor(game: Game, sence: BaseSence) {
        this._id = Math.random().toString(36).slice(2)
        this._game = game
        this._sence = sence
        this._pos = new Vector2()
        this._offset = new Vector2()
        this._size = new Size()
        this._focus = false
        this._hasChanged = true
    }

    checkFocu(x: number, y: number) {
        let isfocus = x - this.offset.x > this.pos.x && x - this.offset.x < this.pos.x + this.size.w && y - this.offset.y > this.pos.y && y - this.offset.y < this.pos.y + this.size.h
        if (isfocus !== this.focus) {
            this.focus = isfocus
        }
        return this.focus
    }

    onClick(e: MouseArgs) {}
    onMouseOver(e: MouseArgs) {}
    onMouseUp() {}
    onTouchStart(e: MouseArgs) {
        this.onClick(e)
    }
    onTouchMove(e: MouseArgs) {}
    onTouchEnd() {}
    canDraw(): boolean {
        return true
    }
    updateRequest() {
        return this.hasChanged
    }
    // 子类复写
    update() {}

    // 子类复写
    draw(ctx: CanvasRenderingContext2D) {}

    // sence调用
    elementUpdate() {
        // if (!this.updateRequest()) return
        this.update()
        if (this._onTick) this.onTick(this)
        // this.hasChanged = false
    }

    // sence调用
    elementDraw(ctx: CanvasRenderingContext2D) {
        if (!this.canDraw()) return
        this.draw(ctx)
    }
}
