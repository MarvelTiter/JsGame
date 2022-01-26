class StartSence extends BaseSence {
    constructor(game) {
        super(game)
        this.setup()
    }

    setup() {
        let bg = Element.new(this.game, this, "bg");
        let head = Head.new(this.game, this);
        let button = ButtonElement.new(this.game, this, "开始游戏", "button");
        button.x = (1200 - button.w) / 2
        button.y = (800 - button.h) / 2
        this.addElement(bg)
        this.addElement(head)
        this.addElement(button)
    }
}

class ButtonElement extends Element {
    constructor(game, sence, text, texture) {
        super(game, sence, texture)
        this.text = text
        this.eventSetup()
    }
    eventSetup() {
        this.sence.registerMouseAction(MOUSE_PRESS, e => {
            this.onClick(e)
        })
    }

    onClick(e) {
        let { offsetX, offsetY } = e
        if (!this.checkFocu(offsetX, offsetY)) return
        let ms = new MineSence(this.game)
        this.game.setSence(ms)
    }
    draw() {
        let ctx = this.game.context
        let x = this.x + this.offsetX
        let y = this.y + this.offsetY
        ctx.drawImage(
            this.texture,
            x,
            y,
            this.w,
            this.h,
        );
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.font = "24px serif"
        ctx.fillText(this.text, x + this.w / 2, y + this.h / 2)
    }
}
