import { BaseSence } from "../../gamebase/BaseSence"
import { Vector2 } from "../../gamebase/data/Vector2"
import { Game } from "../../gamebase/Game"
import { GameObject } from "../../gamebase/objects/GameObject"
import { Ground } from "./ground"
import { EnemyTank } from "./tank/enemy"
import { PlayerTank } from "./tank/player"
import { Wall } from "./wall"

export class MainSence extends BaseSence {
    constructor(game: Game) {
        super(game)
        this.maxX = 56 * 200
        this.minX = 0
        this.maxY = 56 * 50
        this.minY = 0
        this.camera.direction = "Both"
        this.setup()
    }
    canCollide(objectA: GameObject, objectB: GameObject): boolean {
        return objectA.group !== objectB.group || objectA.group === "All" || objectB.group === "All"
    }
    setup() {
        let ground = new Ground(this.game, this)
        this.addElement(ground)
        let player = new PlayerTank(this.game, this, 200, 200)
        let enemy = new EnemyTank(this.game, this, 400, 400)
        this.addElement(player)
        this.addElement(enemy)
        this.camera.bind(player)

        let left = new Wall(this.game, this, "LEFT")
        let top = new Wall(this.game, this, "TOP")
        let right = new Wall(this.game, this, "RIGHT")
        let bottom = new Wall(this.game, this, "BOTTOM")
        this.addElement(left)
        this.addElement(top)
        this.addElement(right)
        this.addElement(bottom)

        if (this.game.device === "MOBILE")
            this.configJoystick([
                {
                    type: "Stick",
                    x: 100,
                    y: this.getWindowSize().h - 100,
                    events: {
                        onChange: (direction, scale) => {
                            player.moveDirectly(direction, scale)
                        }
                    }
                },
                {
                    type: "Button",
                    x: this.getWindowSize().w - 100,
                    y: this.getWindowSize().h - 100,
                    events: {
                        onButtonX: () => {
                            player.fire()
                        }
                    }
                }
            ])

        this.registerKeyAction("a", () => {
            player.turn(-1)
        })
        this.registerKeyAction("d", () => {
            player.turn(1)
        })
        this.registerKeyAction("w", () => {
            player.move(1)
        })
        this.registerKeyAction("s", () => {
            player.move(-1)
        })
        this.registerKeyAction(
            " ",
            () => {
                player.fire()
            },
            1
        )
        window.Update.push(() => {
            let v1 = Vector2.new(0, 1)
            let v2 = Vector2.new(0, -1)
            let cos = v1.dot(v2) / v1.length() / v2.length()
            console.log(cos, Math.acos(cos))
        })
    }
}
