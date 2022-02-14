import { Camera } from "./Camera"
import { Size } from "./data/Size"
import { Vector2 } from "./data/Vector2"
import { Game } from "./Game"
import { GameObject } from "./objects/GameObject"
type actionTimes = 0 | 1
export interface ObjectAction {
    callBack: (status: KeyStatus) => void
}
export interface KeyStatus {
    status: boolean
    times: actionTimes
    handled: boolean
}
/**
 * 场景基类，
 * 负责渲染场景元素，
 * 注册、分发事件
 */
export class BaseSence {
    game: Game
    private elements: GameObject[]
    private elementMap: Map<string, GameObject>
    private keys: Map<string, KeyStatus>
    private actions: Map<string, ObjectAction>
    // onceAction: Map<string, ObjectAction>;

    private _camera: Camera | undefined
    public get camera(): Camera {
        if (this._camera === undefined) {
            this._camera = new Camera(this, this.game.context, this.game.area)
        }
        return this._camera
    }
    // public set camera(v: Camera) {
    //     this._camera = v
    // }
    size: Size
    minX: number | undefined
    maxX: number | undefined
    minY: number | undefined
    maxY: number | undefined
    private keydown: boolean = false
    private aidElement: GameObject | undefined
    // game:Game;
    constructor(game: Game) {
        this.game = game
        this.elements = []
        this.elementMap = new Map<string, GameObject>()
        this.keys = new Map<string, KeyStatus>()
        this.actions = new Map<string, ObjectAction>()
        this.size = game.area
    }

    public addElement<T extends GameObject>(e: T): void {
        this.elements.push(e)
        this.elementMap.set(e.id, e)
    }

    public removeElement<T extends GameObject>(e: T): void {
        let index = this.elements.indexOf(e)
        this.elements.splice(index, 1)
        this.elementMap.delete(e.id)
    }

    //#region Dom事件注册和处理
    public handleMousemove(e: MouseEvent): void {
        let { offsetX, offsetY } = e
        for (let index = this.elements.length - 1; index > -1; index--) {
            const element = this.elements[index]
            if (element.checkFocu(offsetX, offsetY)) {
                this.aidElement = element
                element.onMouseOver({
                    button: e.button,
                    buttons: e.buttons,
                    x: e.offsetX,
                    y: e.offsetY
                })
                break
            }
        }
    }

    public handleMouseup(e: MouseEvent): void {
        this.aidElement?.onMouseUp()
        this.aidElement = undefined
    }

    public handleMousedown(e: MouseEvent): void {
        if (this.aidElement !== undefined) {
            this.aidElement.onClick({
                button: e.button,
                buttons: e.buttons,
                x: e.offsetX,
                y: e.offsetY
            })
            return
        }
        let { offsetX, offsetY } = e
        for (let index = this.elements.length - 1; index > -1; index--) {
            const element = this.elements[index]
            if (element.checkFocu(offsetX, offsetY)) {
                element.onClick({
                    button: e.button,
                    buttons: e.buttons,
                    x: e.offsetX,
                    y: e.offsetY
                })
                break
            }
        }
    }

    public handleTouchStart(e: TouchEvent): void {
        let { pageX, pageY } = e.touches[0]
        for (let index = this.elements.length - 1; index > -1; index--) {
            const element = this.elements[index]
            if (element.checkFocu(pageX, pageY)) {
                this.aidElement = element
                element.onTouchStart({
                    button: 0,
                    buttons: 0,
                    x: pageX,
                    y: pageY
                })
                break
            }
        }
    }

    public handleTouchMove(e: TouchEvent): void {
        this.aidElement?.onTouchMove({
            button: 0,
            buttons: 0,
            x: e.touches[0].pageX,
            y: e.touches[0].pageY
        })
        this.aidElement = undefined
    }

    public handleTouchEnd(e: TouchEvent): void {
        this.aidElement?.onTouchEnd()
        this.aidElement = undefined
    }

    public handleKeydown(e: KeyboardEvent): void {
        this.keydown = true
        let ks = this.keys.get(e.key)
        if (ks == undefined) {
            return
        }
        ks.status = true
        ks.handled = false
    }

    public handleKeyup(e: KeyboardEvent): void {
        this.keydown = false
        let ks = this.keys.get(e.key)
        if (ks === undefined) {
            return
        }
        ks.status = false
        ks.handled = true
    }

    //#endregion

    /**
     * 注册按键处理函数
     * @param key 按下的键
     * @param element 函数调用的对象(函数内部有this)
     * @param callback 按键回调函数
     */
    public registerKeyAction(key: string, callback: (status: KeyStatus) => void, times?: actionTimes): void {
        this.keys.set(key, {
            status: false,
            times: times ?? 0,
            handled: true
        })
        this.actions.set(key, {
            callBack: callback
        })
    }

    public getCenter(): Vector2 {
        return this.camera.getCenter()
    }

    public getWindowSize(): Size {
        return this.camera.window
    }

    public findElement<T extends GameObject>(id: string): T {
        // for (const e of this.elements.values()) {
        //     if (e.id === id) return e as T
        // }
        let e = this.elementMap.get(id)
        if (e === undefined) {
            throw new Error(`element [${id}] not found`)
        }
        return e as T
    }

    public outOfWindow(obj: GameObject): boolean {
        let { w, h } = this.camera.window
        let { x, y } = this.camera.pos
        if (obj.pos.x + obj.size.w < x || obj.pos.x > x + w || obj.pos.y + obj.size.h < y || obj.pos.y > y + h) return true
        else return false
    }

    public update(): void {
        if (this.keydown) {
            for (const actionKey of this.actions.keys()) {
                let ks = this.keys.get(actionKey)!
                if (ks.handled) continue
                if (ks.status) {
                    let f = this.actions.get(actionKey)!
                    f.callBack(ks)
                    if (ks.times == 1) {
                        ks.handled = true
                    }
                }
            }
        }
        for (const e of this.elements.values()) {
            e.elementUpdate()
        }
        this.camera.trace()
        this.draw(this.game.context)
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        for (const e of this.elements.values()) {
            e.elementDraw(ctx)
        }
    }
}
