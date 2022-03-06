import { BaseSence } from "../../gamebase/BaseSence"
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

        this.registerKeyAction("a", status => {
            player.turnDirection = -1
            player.turn()
        })
        this.registerKeyAction("d", status => {
            player.turnDirection = 1
            player.turn()
        })
        this.registerKeyAction("w", status => {
            player.forwardDirection = 1
            player.move()
        })
        this.registerKeyAction("s", status => {
            player.forwardDirection = -1
            player.move()
        })
        this.registerKeyAction(
            " ",
            status => {
                player.fire()
            },
            1
        )
    }
}
