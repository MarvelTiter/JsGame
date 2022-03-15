const operators:any = {
    "*":{
        level:2
    },
    "/":{
        level:2
    },
    "+":{
        level:1
    },
    "-":{
        level:1
    }
}

String.prototype.isNumeric = function():boolean {
    let n = Number(this)
    return !isNaN(n)
}
String.prototype.isBracketLeft = function():boolean {
    return String(this) === "(" 
}
String.prototype.isBracketRight = function(): boolean {
    return String(this) === ")"
}
String.prototype.isOperator = function(): boolean {
    let o = operators[String(this)]
    return o !== undefined
}
String.prototype.isDot = function(): boolean {
    return String(this) === "."
}
String.prototype.priority = function(compare:string):boolean {
    let self = operators[String(this)]
    let other = operators[compare]
    return self.level > other.level
}
String.prototype.parseNumber = function(): number {
    return Number(this)
}
export {}
