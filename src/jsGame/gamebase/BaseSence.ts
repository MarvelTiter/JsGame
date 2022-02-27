import { Camera } from "./Camera"
import { collides } from "./collision/collides"
import { Bound } from "./data/Bound"
import { Vector2 } from "./data/Vector2"
import { Game } from "./Game"
import { GameObject } from "./objects/GameObject"
import { Contact } from "./collision/Contact"
import { ContactManage } from "./collision/ContactManage"
import { CollisionInfo } from "./collision/CollisionInfo"
import { RigidBase } from "./rigid/RigidComponent"
import { broadphase } from "./collision/broadphase"
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
    protected elements: GameObject[] = []
    private rigidElements: Map<string, RigidBase>
    private elementMap: Map<string, GameObject>
    private keys: Map<string, KeyStatus>
    private actions: Map<string, ObjectAction>
    // onceAction: Map<string, ObjectAction>;

    private _ContactsMag: ContactManage
    public get ContactsMag(): ContactManage {
        return this._ContactsMag
    }
    public set ContactsMag(v: ContactManage) {
        this._ContactsMag = v
    }

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
    size: Bound
    minX: number | undefined
    maxX: number | undefined
    minY: number | undefined
    maxY: number | undefined
    private keydown: boolean = false
    private aidElement: GameObject | undefined
    // game:Game;
    constructor(game: Game) {
        this.game = game
        this._ContactsMag = new ContactManage()
        this.elementMap = new Map<string, GameObject>()
        this.rigidElements = new Map<string, RigidBase>()
        this.keys = new Map<string, KeyStatus>()
        this.actions = new Map<string, ObjectAction>()
        this.size = game.area
    }

    public addElement<T extends GameObject>(e: T): void {
        this.elements.push(e)
        this.elementMap.set(e.id, e)
        if (e.IsRigid) {
            this.rigidElements.set(e.id, e.getComponent())
        }
    }

    public removeElement<T extends GameObject>(e: T): void {
        let index = this.elements.indexOf(e)
        this.elements.splice(index, 1)
        this.elementMap.delete(e.id)
        this.rigidElements.delete(e.id)
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
    public registerKeyAction(
        key: string,
        callback: (status: KeyStatus) => void,
        times?: actionTimes
    ): void {
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

    public getWindowSize(): Bound {
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
        if (
            obj.pos.x + obj.size.w < x ||
            obj.pos.x > x + w ||
            obj.pos.y + obj.size.h < y ||
            obj.pos.y > y + h
        )
            return true
        else return false
    }

    public update(): void {}

    public draw(ctx: CanvasRenderingContext2D): void {
        for (const e of this.elements.values()) {
            e.elementDraw(ctx)
            if (window.Debug) {
                let c = e.getComponent()
                c?.drawDebug(ctx)
            }
        }
        if (window.Debug) {
            ctx.fillStyle = "#00ff00"
            for (const c of this.ContactsMag.list) {
                if (!c.collision.collided) continue
                for (const p of c.collision.supports) {
                    if (p === undefined) continue
                    ctx.beginPath()
                    ctx.arc(p.point.x, p.point.y, 2, 0, Math.PI * 2)
                    ctx.closePath()
                    ctx.fill()
                }
            }
        }
    }

    private handleKeyboardEvents(): void {
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
    }

    /**
     * 更新重力影响
     */
    private applyGravity(objects: RigidBase[]): void {
        if (!this.game.options.enableGravity) {
            return
        }
        let options = this.game.options
        let g = options.gravity.copy().multi(options.gravityScale)
        for (const ee of objects) {
            if (ee.mass > 0) {
                ee.applyGravity(g)
            }
        }
    }
    private collitionTest(objects: RigidBase[]): CollisionInfo[] {
        if (!this.game.options.enableCollide) {
            return []
        }
        let ret: CollisionInfo[] = []
        // let temp = broadphase(objects, this.getWindowSize(), true)
        // // console.log("temp: ", temp)
        // for (const t of temp) {
        //     let coll = collides(this.ContactsMag, t.bodyA, t.bodyB)
        //     if (coll !== undefined) ret.push(coll)
        // }
        for (let ii = 0; ii < objects.length; ii++) {
            const eii = objects[ii]
            for (let jj = 0; jj < objects.length; jj++) {
                const ejj = objects[jj]
                if (eii.isStatic && ejj.isStatic) continue
                let coll = collides(this.ContactsMag, eii, ejj)
                if (coll !== undefined) ret.push(coll)
            }
        }
        return ret
    }
    private _rigidsCache: RigidBase[] | undefined
    get rigidsCache(): RigidBase[] {
        if (this._rigidsCache === undefined) {
            this._rigidsCache = Array.from(this.rigidElements.values())
        }
        return this._rigidsCache
    }
    private findCollide(): void {
        let colls = this.collitionTest(this.rigidsCache)
        this.ContactsMag.Update(colls, this.timing.timestamp)
        this.ContactsMag.removeOld(this.timing.timestamp)
    }
    private clearForce(rigidsCache: RigidBase[]) {
        for (const ri of rigidsCache) {
            ri.clearForce()
        }
    }

    public timing = {
        timestamp: 0,
        timeScale: 1,
        lastDelta: 0,
        lastElapsed: 0
    }

    public Tick(delta: number, correction: number): void {
        this.timing.timestamp += delta * this.timing.timeScale
        // 处理按键事件
        this.handleKeyboardEvents()
        this.applyGravity(this.rigidsCache)
        for (const e of this.elements.values()) {
            e.elementUpdate(delta, this.timing.timeScale, correction)
        }
        this.update()
        //
        this.findCollide()
        this.ContactsMag.preSolve()
        for (let i = 0; i < 6; i++) {
            this.ContactsMag.solve()
        }
        this.ContactsMag.postSolve(this.rigidsCache)
        this.ContactsMag.preSolveVelocity()
        for (let i = 0; i < 6; i++) {
            this.ContactsMag.solveVelocity()
        }
        this.clearForce(this.rigidsCache)
        this.camera.trace()
        this.draw(this.game.context)
    }
}
