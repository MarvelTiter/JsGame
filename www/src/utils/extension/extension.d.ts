declare global {
    interface Number {
        actualPixel(): number
        angleToRadian(): number
        radianToAngle(): number
    }
    interface String {
        isNumeric(): boolean
        isOperator(): boolean
        isBracketLeft(): boolean
        isBracketRight(): boolean
        isDot(): boolean
        priority(compare: string): boolean
        parseNumber(): number
        removeEnd(): string
    }
}
export { }
