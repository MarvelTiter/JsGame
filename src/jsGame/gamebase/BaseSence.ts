import { Camera } from "./Camera"
import { collides } from "./collision/collides"
import { Vector2 } from "./data/Vector2"
import { Game } from "./Game"
import { GameObject } from "./objects/GameObject"
import { ContactManage } from "./collision/ContactManage"
import { CollisionInfo } from "./collision/CollisionInfo"
import { RigidBase } from "./rigid/RigidBase"
import { broadphase } from "./collision/broadphase"
import { randomBetween } from "../../utils/random"
import { IRect } from "./data/Rect"
import { Joystick } from "./virtualJoystick/Joystick"
import { MouseArgs } from "./MouseArgs"
import { JoyStruct } from "./virtualJoystick/JoyStruct"
type actionTimes = 0 | 1
export interface ObjectAction {
    status: boolean
    handled: boolean
    times: actionTimes
    down: () => void
    up?: () => void
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
export abstract class BaseSence {
    game: Game
    protected elements: GameObject[] = []
    private rigidElements: Map<string, RigidBase>
    private elementMap: Map<string, GameObject>
    private requiredUpdateCache: boolean = false
    private keys: Map<string, string>
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
            this._camera = new Camera(this, this.game.area)
        }
        return this._camera
    }

    private _enableJoystick: boolean = false
    public get enableJoystick(): boolean {
        return this._enableJoystick
    }

    public configJoystick(options: JoyStruct[]): void {
        this._joystick = new Joystick(this.game, this, options)
        this._enableJoystick = true
    }

    private _joystick: Joystick | undefined
    public get joystick(): Joystick {
        return this._joystick!
    }

    minX: number = 0
    maxX: number = Number.MAX_VALUE
    minY: number = 0
    maxY: number = Number.MAX_VALUE
    private keydown: boolean = false
    private aidElement: GameObject | undefined
    // game:Game;
    constructor(game: Game) {
        this.game = game
        this._ContactsMag = new ContactManage()
        this.elementMap = new Map<string, GameObject>()
        this.rigidElements = new Map<string, RigidBase>()
        this.keys = new Map<string, string>()
        this.actions = new Map<string, ObjectAction>()
    }

    public addElement<T extends GameObject>(e: T): void {
        this.elements.push(e)
        this.elementMap.set(e.id, e)
        if (e.IsRigid) {
            this.requiredUpdateCache = true
            this.rigidElements.set(e.id, e.rigidBody)
        }
    }

    public removeElement<T extends GameObject>(e: T): void {
        let index = this.elements.indexOf(e)
        this.elements.splice(index, 1)
        this.elementMap.delete(e.id)
        this.rigidElements.delete(e.id)
        this.requiredUpdateCache = true
        this.ContactsMag.afterElementRemoved(e.id)
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

    private getTouches(e: TouchEvent): MouseArgs[] {
        let ret: MouseArgs[] = []
        for (let index = 0; index < e.touches.length; index++) {
            const element = e.touches[index]
            ret.push({
                button: 0,
                buttons: 0,
                x: element.pageX,
                y: element.pageY
            })
        }
        return ret.sort((a, b) => a.x - b.x)
    }
    public handleTouchStart(e: TouchEvent): void {
        let touches = this.getTouches(e)
        if (this.enableJoystick) {
            e.preventDefault()
            if (this.joystick.checkFocu(touches[0].x, touches[0].y)) {
                this.aidElement = this.joystick
                this.joystick.onTouchStart(touches)
                return
            }
        }
        for (let index = this.elements.length - 1; index > -1; index--) {
            const element = this.elements[index]
            if (element.checkFocu(touches[0].x, touches[0].y)) {
                this.aidElement = element
                element.onTouchStart(touches)
                break
            }
        }
    }

    public handleTouchMove(e: TouchEvent): void {
        let touches = this.getTouches(e)
        this.aidElement?.onTouchMove(touches)
        // this.aidElement = undefined
    }

    public handleTouchEnd(e: TouchEvent): void {
        let touches = this.getTouches(e)
        this.aidElement?.onTouchEnd(touches)
        if (e.touches.length === 0) this.aidElement = undefined
    }

    public handleKeydown(e: KeyboardEvent): void {
        this.keydown = true
        let ks = this.actions.get(e.key)
        if (ks === undefined || ks.status) {
            return
        }
        this.keys.set(e.key, e.key)
        ks.status = true
        ks.handled = false
    }

    public handleKeyup(e: KeyboardEvent): void {
        let ks = this.actions.get(e.key)
        if (ks === undefined) {
            return
        }

        this.actions.get(e.key)!.up?.call(null)
        this.keys.delete(e.key)
        this.keydown = this.keys.size !== 0
        ks.status = false
        ks.handled = true
    }
    /**
     * 注册按键处理函数
     * @param key 按下的键
     * @param callback 按键回调函数
     * @param times 0按住触发，1按下触发一次
     */
    public registerKeyAction(key: string, down: () => void, times: actionTimes = 0, up?: () => void): void {
        this.actions.set(key, {
            status: false,
            handled: false,
            times: times,
            down: down,
            up: up
        })
    }
    //#endregion

    public getCenter(): Vector2 {
        return this.camera.getCenter()
    }

    public getWindowPos(): Vector2 {
        return this.camera.pos
    }

    public getWindowSize(): IRect {
        return this.camera.window
    }

    public updateWindow(w: number, h: number) {
        this._camera!.window.w = w
        this._camera!.window.h = h
    }

    public outOfWindow(obj: GameObject): boolean {
        let { w, h } = this.camera.window
        let { x, y } = this.camera.pos
        if (obj.pos.x + obj.rect.w < x || obj.pos.x > x + w || obj.pos.y + obj.rect.h < y || obj.pos.y > y + h) return true
        else return false
    }

    public update(): void {}

    public draw(ctx: CanvasRenderingContext2D): void {
        for (const e of this.elements.values()) {
            e.elementDraw(ctx)
            if (window.Debug && e.IsRigid) {
                let c = e.rigidBody
                c.drawDebug(ctx)
            }
        }
        if (window.Debug) {
            for (const c of this.ContactsMag.list) {
                if (!c.collision.collided) continue
                for (const p of c.collision.supports) {
                    ctx.fillStyle = randomColor()
                    ctx.beginPath()
                    ctx.arc(p.point.x, p.point.y, 2, 0, Math.PI * 2)
                    ctx.closePath()
                    ctx.fill()
                }
            }
        }
        if (this.enableJoystick) this.joystick!.draw(ctx)
    }

    private handleKeyboardEvents(): void {
        if (this.keydown) {
            for (const action of this.actions.values()) {
                if (action.handled) continue
                if (action.status) {
                    action.down()
                    if (action.times == 1) {
                        action.handled = true
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
    canCollide(objectA: GameObject, objectB: GameObject): boolean {
        return true
    }
    private collitionTest(objects: RigidBase[]): CollisionInfo[] {
        if (!this.game.options.enableCollide) {
            return []
        }
        let ret: CollisionInfo[] = []
        let temp = broadphase(objects, this.getWindowSize(), true)
        for (const t of temp) {
            if (this.canCollide(t.bodyA.target, t.bodyB.target)) {
                let coll = collides(this.ContactsMag, t.bodyA, t.bodyB)
                ret.push(coll)
            }
        }
        // for (let ii = 0; ii < objects.length; ii++) {
        //     const eii = objects[ii]
        //     for (let jj = ii + 1; jj < objects.length; jj++) {
        //         const ejj = objects[jj]
        //         if (eii.isStatic && ejj.isStatic) continue
        //         let coll = collides(this.ContactsMag, eii, ejj)
        //         // if (coll !== undefined)
        //         ret.push(coll)
        //     }
        // }
        return ret
    }
    private _rigidsCache: RigidBase[] | undefined
    get rigidsCache(): RigidBase[] {
        if (this.requiredUpdateCache || this._rigidsCache === undefined) {
            this._rigidsCache = Array.from(this.rigidElements.values())
            this.requiredUpdateCache = false
        }
        return this._rigidsCache
    }
    private findCollide(): void {}
    private solvePosition(): void {
        this.ContactsMag.preSolve()
        for (let i = 0; i < 6; i++) {
            this.ContactsMag.solve()
        }
        this.ContactsMag.postSolve(this.rigidsCache)
    }
    private solveVelocity(): void {
        this.ContactsMag.preSolveVelocity()
        for (let i = 0; i < 6; i++) {
            this.ContactsMag.solveVelocity()
        }
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
        if (this.enableJoystick) this.joystick.update(delta, this.timing.timeScale, correction)
        this.applyGravity(this.rigidsCache)
        for (const e of this.elements.values()) {
            e.elementUpdate(delta, this.timing.timeScale, correction)
        }
        this.update()
        //
        let colls = this.collitionTest(this.rigidsCache)
        this.ContactsMag.Update(colls, this.timing.timestamp)
        this.ContactsMag.removeOld(this.timing.timestamp)
        this.solvePosition()
        this.solveVelocity()
        for (const coll of colls) {
            if (coll.collided) {
                coll.targetA.onCollide(coll.targetB)
                coll.targetB.onCollide(coll.targetA)
            }
        }
        this.clearForce(this.rigidsCache)
        this.camera.trace(this.game.context)
        this.draw(this.game.context)
    }

    clear() {
        this.elements.splice(0)
        this.elementMap.clear()
    }
}

function randomColor() {
    let r = randomBetween(0, 255)
    let g = randomBetween(0, 255)
    let b = randomBetween(0, 255)
    return `rbga(${r},${g},${b},1)`
}
