import { Game } from './Game'
import { GameObject } from './GameObject'
type actionTimes = 0 | 1
export interface ObjectAction {
    callBack: (status: KeyStatus) => void
}
export interface KeyStatus {
    // status: keyStatus = "RELEASE"
    // times: number = 0
    // handled: boolean = false
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
    keys: Map<string, KeyStatus>
    actions: Map<string, ObjectAction>
    // onceAction: Map<string, ObjectAction>;
    mouseupEvents: Function[]
    mousedownEvents: Function[] = []
    mousemoveEvents: Function[] = []
    private keydown: boolean = false
    private aidElement: GameObject | undefined
    // game:Game;
    constructor(game: Game) {
        this.game = game
        this.elements = []
        this.keys = new Map<string, KeyStatus>()
        this.actions = new Map<string, ObjectAction>()
        // this.onceAction = new Map<string, ObjectAction>();
        this.mouseupEvents = []
    }

    public addElement<T extends GameObject>(e: T): void {
        this.elements.push(e)
    }

    public removeElement<T extends GameObject>(e: T): void {
        let i = this.elements.indexOf(e)
        this.elements.splice(i, 1)
    }

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
        if (this.aidElement) {
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

    // public registerMouseAction(actionType: string, callback: Function): void {
    //   if (actionType == MOUSE_PRESS) {
    //     this.mousedownEvents.push(callback);
    //   } else if (actionType == MOUSE_MOVING) {
    //     this.mousemoveEvents.push(callback);
    //   } else if (actionType == MOUSE_RELEASE) {
    //     this.mouseupEvents.push(callback);
    //   }
    // }

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
        for (const e of this.elements) {
            e.elementUpdate()
        }
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        for (const e of this.elements) {
            e.elementDraw(ctx)
        }
    }
}
