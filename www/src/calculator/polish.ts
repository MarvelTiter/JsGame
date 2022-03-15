import "@/utils/extension/StringExtension.ts"
import { CalcFactory } from "./factories"
/**
 * 中序转逆序
 * 
 * 1)初始化两个栈：栈`operators`存储操作符号，栈`ret`存储返回结果
 * 2)从左至右扫描中缀表达式
 * 3)遇到操作数时，判断前一位的字符处理大于10的操作数与小数点
 * 4)遇到运算符时，循环比较其与`operators`栈顶运算符的优先级：
 *      1.如果`operators`为空，则直接将此运算符入栈，循环结束
 *      2.如果`operators`栈顶为左括号，直接入栈，循环结束
 *      3.如果优先级大于`operators`运算符，直接入栈，循环结束
 *      4.否则，运算符压入`ret`，取出`operators`栈顶运算符，继续比较
 * 5)遇到号时：判断左右括号
 *      1.左括号，直接压入`operators`栈中
 *      2.如果是右括号，则依次弹出`operators`栈顶的运算符，井add入`ret`栈，直到遇到左括号为止，此时将这一对括号丢弃
 * 6) 重复步骤2 至 5，直到表达式的最右边
 * 7)将`operators`中剩余的运算符依次弹出并压入`ret`
 * @param content 中序字符串
 */
export function parseReversePolish(content: string): string[] {
    let ret :string[] = []
    let operators :string[] = []
    let pre = prevSolve(content)    
    for (let index = 0; index < pre.length; index++) {
        const cur = pre[index]            
        if (cur.isNumeric()){
            ret.push(cur)
        } else if (cur.isOperator()) {
            let prev = operators.pop()
            while(true){
                if (prev === undefined) {
                    operators.push(cur)
                    break
                }else if (prev.isBracketLeft()){
                    operators.push(prev)
                    operators.push(cur)
                    break
                }else if (cur.priority(prev)) {
                    // cur 优先级大于 prev
                    operators.push(prev)
                    operators.push(cur)
                    break
                } else {
                    ret.push(prev)
                    prev = operators.pop()
                }
            }
        } else if (cur.isBracketLeft()){
            operators.push(cur)
        } else if (cur.isBracketRight()) {
            let prev = operators.pop()!
            while(!prev.isBracketLeft()){
                ret.push(prev)
                prev = operators.pop()!
            }
        }        
    }
    let o = operators.pop()
    while(o !== undefined) {
        ret.push(o)
        o = operators.pop()
    }
    return ret
}

/**
 * 逆波兰表达式求解
 * @param reversePolish 逆波兰表达式 
 */
export function solveReversePolish(reversePolish:string[]): number{
    let temp:number[] = []
    reversePolish.reverse()
    let e = reversePolish.pop()
    while(e !== undefined) {
        if (e.isNumeric()){
            temp.push(e.parseNumber())
        } else {
            let right = temp.pop()
            let left = temp.pop()
            let fa = CalcFactory.Operators.get(e)
            if (fa === undefined){
                throw new Error(`unsupport operator ${e}`)
            }
            let num = fa.calc([left!,right!])
            temp.push(num)
        }
        e = reversePolish.pop()
    }
    return temp.pop()!
}

function prevSolve(content: string): string[] {
    let ret = []
    let index = 0
    let current = content.charAt(index)
    let temp = ""
    while (current !== "") {
        if (current.isNumeric()||current.isDot()){
            temp += current
        } else {
            if (temp){
                ret.push(temp)
                temp = ""
            }
            ret.push(current)
        }
        index++
        current = content.charAt(index)
    }
    if (temp) ret.push(temp)
    return ret
}
