const width = 50
const gutter = 5
let data;
let ctx;

function run() {

    data = createMap(10, 10)
    let canvas = document.querySelector('#canvas')
    ctx = canvas.getContext('2d')
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('click', handleClick)
    window.setInterval(() => {
        draw()
    }, 1000 / 30)
}

function createMap(row, column) {
    let grid = []
    for (let r = 0; r < row; r++) {
        let row = []
        for (let c = 0; c < column; c++) {
            const col = new cell(r, c)
            row.push(col)
        }
        grid.push(row)
    }
    return grid
}

function cell(rowIndex, columnIndex) {
    this.row = rowIndex
    this.column = columnIndex
    this.x = this.column * width + (this.column + 1) * gutter
    this.y = this.row * width + (this.row + 1) * gutter
    this.color = "rgba(0, 0, 200, 0.5)"
    this.flag = 0
}

cell.prototype.updateState = function() {
    this.flag = (this.flag + 1) % 3
}
cell.prototype.draw = function(context) {
    context.fillStyle = this.color
    context.clearRect(this.x, this.y, width, width)
    context.fillRect(this.x, this.y, width, width)
}
cell.prototype.isMouseOver = function(x, y) {
    let flag = (x > this.x && x < this.x + width && y > this.y && y < this.y + width)
    this.color = flag ? "rgb(200,0,0)" : "rgba(0, 0, 200, 0.5)"
    return flag
}

function draw() {
    for (let row = 0; row < data.length; row++) {
        const col = data[row];
        for (let cell = 0; cell < col.length; cell++) {
            const c = col[cell];
            c.draw(ctx)
        }
    }
}

function check(x, y) {
    for (let row = 0; row < data.length; row++) {
        const col = data[row];
        for (let cell = 0; cell < col.length; cell++) {
            const c = col[cell];
            c.isMouseOver(x, y)
        }
    }
}

function handleMouseMove(e) {
    check(e.offsetX, e.offsetY)
}

function handleClick(e) {
    console.log(e)
}

run()
