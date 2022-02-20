import { BaseSence } from "../BaseSence"
import { Size } from "../data/Size"
import { Vector2 } from "../data/Vector2"
import { Game } from "../Game"
import { CircleRigid } from "../rigid/CircleRigid"
import { RectRigid } from "../rigid/RectRigid"
import { TriangleRigid } from "../rigid/TriangleRigid"
import { GameObject } from "./GameObject"

export class CustomObject extends GameObject {
    public get center(): Vector2 {
        throw new Error("Method not implemented.")
    }
    constructor(game: Game, sence: BaseSence) {
        super(game, sence)
    }
    public addRectRigid(size: Size, offset?: Vector2, name?: string): void {
        let rg = new RectRigid(size, offset)
        rg.bind(this)
        this.addComponent(rg)
    }
    public addCircleRigid(radius: number, name?: string): void {
        let cg = new CircleRigid(radius, 0)
        cg.bind(this)
        this.addComponent(cg)
    }
    public addTriangleRigid(len: number, theta: number, name?: string): void {
        let tg = new TriangleRigid(len, theta)
        tg.bind(this)
        this.addComponent(tg)
    }
}
