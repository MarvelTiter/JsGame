import { BaseSence } from "../BaseSence";
import { Size } from "../data/Size";
import { Game } from "../Game";
import { CircleRigid } from "../rigid/CircleRigid";
import { RectRigid } from "../rigid/RectRigid";
import { GameObject } from "./GameObject";

export class CustomObject extends GameObject {
    constructor(game: Game, sence: BaseSence) {
        super(game, sence);
    }
    public addRectRigid (size: Size, name?: string): void {
        let rg = new RectRigid(size, 0);
        rg.bind(this);
        this.addComponent(name ?? Math.random().toString(36).slice(2), rg);
    }
    public addCircleRigid (radius: number, name?: string): void {
        let cg = new CircleRigid(radius, 0);
        cg.bind(this);
        this.addComponent(name ?? Math.random().toString(36).slice(2), cg);
    }
    public addTriangleRigid (): void { }
}
