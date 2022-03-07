import { Vector2 } from "../data/Vector2";

export interface ITraceable {
    getPosInfo(): {
        velocity: Vector2;
        pos: Vector2;
    };
}
