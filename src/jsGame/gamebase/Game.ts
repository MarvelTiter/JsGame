import { getActualPixel } from "../../utils/helper"
import { BaseSence } from "./BaseSence"
import { Rect, IRect } from "./data/Rect"
import { GameOption, IOptions } from "./GameOptions"
import { GameImage } from "./Source"
import { CanvasContext } from "./types/DefineType"

export const RESET = 0x0000
export const MOUSE_MOVE = 0x0001
export const MOUSE_LB_CLICK = 0x0010
export const MOUSE_RB_CLICK = 0x0100
export const MOUSE_MOVING = "MOVE"
export const MOUSE_PRESS = "PRESS"
export const MOUSE_RELEASE = "RELEASE"
export const DEVICE_MOBILE = "MOBILE"
export const DEVICE_PC = "PC"
type DEVICE = "PC" | "MOBILE"
/**
 * Window Attach
 */
declare global {
    interface Window {
        Pause: boolean
        Debug: boolean
        Update: Function[]
    }
}
window.Update = []
export class Game {
    gameCanvas: HTMLCanvasElement
    gameContext: CanvasRenderingContext2D
    UICanvas: HTMLCanvasElement
    UIContext: CanvasRenderingContext2D
    images: Map<string, GameImage>
    sence!: BaseSence
    area!: IRect
    device: DEVICE = DEVICE_PC
    options: IOptions
    container: HTMLDivElement
    public get context(): CanvasContext {
        return {
            game: this.gameContext,
            ui: this.UIContext
        }
    }
    constructor(dom: string | HTMLDivElement, images: Map<string, GameImage>, opts?: Partial<IOptions>, area?: IRect) {
        if (dom instanceof HTMLDivElement) {
            this.container = dom
        } else {
            this.container = document.querySelector("#" + dom) as HTMLDivElement
        }
        this.gameCanvas = document.createElement("canvas") as HTMLCanvasElement
        this.gameContext = this.gameCanvas.getContext("2d") as CanvasRenderingContext2D
        this.UICanvas = document.createElement("canvas") as HTMLCanvasElement
        this.UIContext = this.UICanvas.getContext("2d") as CanvasRenderingContext2D
        this.gameCanvas.style.position = "absolute"
        this.gameCanvas.style.left = "0"
        this.gameCanvas.style.top = "0"
        this.UICanvas.style.position = "absolute"
        this.UICanvas.style.left = "0"
        this.UICanvas.style.top = "0"
        this.container.appendChild(this.gameCanvas)
        this.container.appendChild(this.UICanvas)
        this.images = images
        this.areaSetup(area)
        this.options = GameOption.createOption(opts || {})
        this.eventSetup()
        Object.assign(window, {
            game: this
        })
    }
    areaSetup(area?: IRect) {
        let isMobile = /Android|webOS|iPhone|iPod/i.test(navigator.userAgent)
        if (isMobile) {
            this.device = DEVICE_MOBILE
            // window.document.documentElement.requestFullscreen()
        }
        let w: number = 0
        let h: number = 0
        if (!area) {
            w = getActualPixel(window.document.body.clientWidth)
            h = getActualPixel(window.document.body.clientHeight)
        }
        this.area = area ?? Rect.createBoxRect(w, h)
        this.gameCanvas.width = this.area.w
        this.gameCanvas.height = this.area.h
        this.UICanvas.width = this.area.w
        this.UICanvas.height = this.area.h
    }
    eventSetup() {
        this.container.addEventListener("mouseover", (e: MouseEvent) => {
            e.preventDefault()
            let handleMouseMove = (event: MouseEvent) => {
                event.preventDefault()
                this.sence.handleMousemove(event)
            }
            let handleMouseDown = (event: MouseEvent) => {
                this.sence.handleMousedown(event)
            }
            let handleMouseUp = (event: MouseEvent) => {
                this.sence.handleMouseup(event)
            }
            let handleMoveout = (event: MouseEvent) => {
                this.container.removeEventListener("mousemove", handleMouseMove)
                this.container.removeEventListener("mouseout", handleMoveout)
                this.container.removeEventListener("mousedown", handleMouseDown)
                this.container.removeEventListener("mouseup", handleMouseUp)
            }
            this.container.addEventListener("mousemove", handleMouseMove)
            this.container.addEventListener("mousedown", handleMouseDown)
            this.container.addEventListener("mouseup", handleMouseUp)
            this.container.addEventListener("mouseout", handleMoveout)
        })

        this.container.addEventListener("touchstart", (e: TouchEvent) => {
            if (this.sence) this.sence.handleTouchStart(e)
        })
        this.container.addEventListener("touchmove", (e: TouchEvent) => {
            if (this.sence) this.sence.handleTouchMove(e)
        })
        this.container.addEventListener("touchend", (e: TouchEvent) => {
            if (this.sence) this.sence.handleTouchEnd(e)
        })
        this.container.addEventListener("touchcancel", (e: TouchEvent) => {
            if (this.sence) this.sence.handleTouchEnd(e)
        })
        window.addEventListener("keydown", (e: KeyboardEvent) => {
            if (this.sence) {
                this.sence.handleKeydown(e)
            }
        })
        window.addEventListener("keyup", (e: KeyboardEvent) => {
            if (this.sence) {
                this.sence.handleKeyup(e)
            }
        })
        window.addEventListener("contextmenu", (e: MouseEvent) => {
            e.stopPropagation()
            e.preventDefault()
        })
    }

    public getTextureByName(name: string): GameImage {
        let i = this.images.get(name)
        if (i === undefined) throw new Error(`image named ${name} is not found`)
        return i
    }

    public reSize(w: number, h: number): void {
        this.areaSetup(Rect.createBoxRect(w, h))
    }

    public setSence(sence: BaseSence): void {
        this.sence = sence
    }
    private timePrev: number = 0
    private deltaMin: number = 1000.0 / 60
    private deltaMax: number = 1000.0 / 30
    private delta: number = 1000.0 / 60
    private timeScalePrev: number = 1
    private correction: number = 1
    private deltaSampleSize: number = 60
    private loop(time: number) {
        if (window.Pause) {
            window.requestAnimationFrame(this.loop.bind(this, Date.now()))
            return
        }
        let delta = time - this.timePrev
        this.timePrev = time
        delta = delta < this.deltaMin ? this.deltaMin : delta
        delta = delta > this.deltaMax ? this.deltaMax : delta
        let correction = delta / this.delta
        this.delta = delta
        if (this.timeScalePrev > 0.0001) correction *= this.sence.timing.timeScale / this.timeScalePrev
        if (this.sence.timing.timeScale < 0.0001) correction = 0
        this.timeScalePrev = this.sence.timing.timeScale
        this.correction = correction
        this.sence.Tick(delta, correction)
        window.requestAnimationFrame(this.loop.bind(this, Date.now()))
    }

    run() {
        if (!this.sence) return
        // window.setInterval(() => {
        //     this.loop(Date.now())
        // }, 1000 / 30)
        window.requestAnimationFrame(() => {
            this.loop(Date.now())
        })
    }

    clear() {
        this.sence.clear()
    }
}
