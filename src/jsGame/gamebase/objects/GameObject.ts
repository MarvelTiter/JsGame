import { BaseSence } from "../BaseSence"
import { Game } from "../Game"
import { Vector2 } from "../data/Vector2"
import { MouseArgs } from "../MouseArgs"
import { Bound } from "../data/Bound"
import { RigidBase } from "../rigid/RigidBase"
import { Contact } from "../collision/Contact"
import { IRectangle, IRect, createBoxRect } from "../data/Rect"
import { ISolveCollide } from "../interfaces/ISolveCollide"
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

const zIndex = (function (): Function {
    let count = 1
    return function () {
        return count++
    }
})()

/**
 * 所有对象的基类
 */
export abstract class GameObject implements IRectangle {
    //#region props

    private _id: string
    public get id(): string {
        return this._id
    }
    protected set id(v: string) {
        this._id = v
    }
    /**
     * 用于碰撞检测，属于相同的组的对象不检测
     */
    group: string = "All"

    zIndex: number

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

    posPrev: Vector2 = new Vector2()
    private _pos: Vector2
    public get pos(): Vector2 {
        return this._pos
    }
    public set pos(v: Vector2) {
        this.posPrev = this._pos
        this._pos = v
    }

    private _offset: Vector2
    public get offset(): Vector2 {
        return this._offset
    }
    public set offset(v: Vector2) {
        this._offset = v
    }

    private _rect: IRect
    public get rect(): IRect {
        return this._rect
    }
    public set rect(v: IRect) {
        this._rect = v
    }

    private _radius: number | undefined
    public get radius(): number {
        return this._radius || 0
    }
    public set radius(v: number) {
        this._radius = v
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

    private _theta: number = 0
    public get angle(): number {
        return this._theta
    }
    public set angle(v: number) {
        this._theta = v
    }

    //#endregion
    constructor(game: Game, sence: BaseSence) {
        this._id = Math.random().toString(36).slice(2)
        this._game = game
        this._sence = sence
        this._pos = new Vector2()
        this._offset = new Vector2()
        this._rect = createBoxRect(0, 0)
        this._focus = false
        this._hasChanged = true
        this.zIndex = zIndex()
    }
    getRect(): IRect {
        return this.rect
    }

    checkFocu(x: number, y: number) {
        let centre = this.pos.copy().add(this.offset)
        let { w, h } = this.rect
        let isfocus = x > centre.x - w / 2 && x < centre.x + w / 2 && y > centre.y - h / 2 && y < centre.y + h / 2
        if (isfocus !== this.focus) {
            this.focus = isfocus
        }
        return this.focus
    }

    public get IsRigid(): boolean {
        return this._components !== undefined
    }
    private _components: RigidBase | undefined
    protected addComponent<T extends RigidBase>(com: T): void {
        this._components = com
    }

    public get rigidBody(): RigidBase {
        if (this._components === undefined) {
            throw new Error(`${this.id} did not set component`)
        }
        return this._components
    }

    onClick(e: MouseArgs) {}
    onMouseOver(e: MouseArgs) {}
    onMouseUp() {}
    onTouchStart(e: MouseArgs[]) {
        this.onClick(e[0])
    }
    onTouchMove(e: MouseArgs[]) {}
    onTouchEnd(e: MouseArgs[]) {}
    canDraw(): boolean {
        return true
    }
    onCollide(other: ISolveCollide) {}
    updateRequest() {
        return this.hasChanged
    }
    // 子类复写
    update(delta: number, timeScale: number, correction: number) {}

    // 子类复写
    draw(ctx: CanvasRenderingContext2D) {}

    // sence调用
    elementUpdate(delta: number, timeScale: number, correction: number) {
        // if (!this.updateRequest()) return
        this.update(delta, timeScale, correction)
        if (this.IsRigid) this.rigidBody.update(delta, timeScale, correction)
        if (this._onTick) this.onTick(this)
        // this.hasChanged = false
    }

    // sence调用
    elementDraw(ctx: CanvasRenderingContext2D) {
        if (!this.canDraw()) return
        this.draw(ctx)
    }
}
