import { BaseSence } from "../BaseSence"
import { Size } from "../data/Size"
import { Vector2 } from "../data/Vector2"
import { Game } from "../Game"
import { CircleRigid } from "../rigid/CircleRigid"
import { RectRigid } from "../rigid/RectRigid"
import { TriangleRigid } from "../rigid/TriangleRigid"
import { GameObject } from "./GameObject"

export class CustomObject extends GameObject {
    constructor(game: Game, sence: BaseSence) {
        super(game, sence)
    }
    public addRectRigid(size: Size, offset?: Vector2, name?: string): void {
        let rg = new RectRigid(size, offset)
        rg.bind(this)
        this.addComponent(name ?? Math.random().toString(36).slice(2), rg)
    }
    public addCircleRigid(radius: number, name?: string): void {
        let cg = new CircleRigid(radius, 0)
        cg.bind(this)
        this.addComponent(name ?? Math.random().toString(36).slice(2), cg)
    }
    public addTriangleRigid(len: number, theta: number, name?: string): void {
        let tg = new TriangleRigid(len, theta)
        tg.bind(this)
        this.addComponent(name ?? Math.random().toString(36).slice(2), tg)
    }
}