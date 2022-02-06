import { BaseSence } from "../../gamebase/BaseSence";
import { Game } from "../../gamebase/game";
import { GameObject } from "../../gamebase/GameObject";


export class StartButton extends GameObject {
    text: string;
    buttonWidth: number;
    buttonHeight: number;
    buttonX: number;
    buttonY: number;
    click: Function | undefined;
    constructor(game: Game, sence: BaseSence, text: string, name: string) {        
        super(game, sence, name);        
        this.text = text;
        this.buttonWidth = this.texture?.width ?? 0;
        this.buttonHeight = this.texture?.height ?? 0;
        this.w = 1200;
        this.h = 800;
        this.buttonX = (1200 - this.buttonWidth) / 2;
        this.buttonY = (800 - this.buttonHeight) / 2;
    }

   

    onClick(e: MouseEvent) {
        let { offsetX, offsetY } = e;
        if (offsetX > this.buttonX &&
            offsetX < this.buttonX + this.buttonWidth &&
            offsetY > this.buttonY &&
            offsetY < this.buttonY + this.buttonHeight) {
            if (this.click)
                this.click();
            this.sence.removeElement(this);
        }
    }
    draw() {
        let ctx = this.game.context;
        let x = this.buttonX + this.offsetX;
        let y = this.buttonY + this.offsetY;
        ctx.fillStyle = "rgba(0,0,0,0.3)";
        ctx.fillRect(0, 0, this.w, this.h);        
        ctx.drawImage(this.texture, x, y, this.buttonWidth, this.buttonHeight);
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "24px serif";
        ctx.fillText(
            this.text,
            x + this.buttonWidth / 2,
            y + this.buttonHeight / 2
        );
    }
}
