import { Vector2 } from "../data/Vector2";
/**
 * `camera` `bind`的对象需要实现`ITraceable`
 */
export interface ITraceable {
    getPosInfo(): {
        velocity: Vector2;
        pos: Vector2;
    };
}
