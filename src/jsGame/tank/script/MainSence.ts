import { BaseSence } from "../../gamebase/BaseSence"
import { Game } from "../../gamebase/Game"
import { GameObject } from "../../gamebase/objects/GameObject"
import { BulletGreen } from "./bullet/bulletGreen"
import { Ground } from "./ground"
import { EnemyTank } from "./tank/enemy"
import { PlayerTank } from "./tank/player"

export class MainSence extends BaseSence {
    constructor(game: Game) {
        super(game)
        this.setup()
        this.maxX = 10000
        this.minX = 0
        this.maxY = 2000
        this.minY = 0
        this.camera.direction = "Both"
    }
    canCollide(objectA: GameObject, objectB: GameObject): boolean {
        return objectA.group !== objectB.group
    }
    setup() {
        let ground = new Ground(this.game, this)
        this.addElement(ground)
        let player = new PlayerTank(this.game, this, 200, 200)
        let enemy = new EnemyTank(this.game, this, 400, 400)
        this.addElement(player)
        this.addElement(enemy)
        this.camera.bind(player)
        this.registerKeyAction("a", status => {
            player.turnTo = true
            player.turnDirection = -1
        })
        this.registerKeyAction("d", status => {
            player.turnTo = true
            player.turnDirection = 1
        })
        this.registerKeyAction("w", status => {
            player.forward = true
            player.forwardDirection = 1
        })
        this.registerKeyAction("s", status => {
            player.forward = true
            player.forwardDirection = -1
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
