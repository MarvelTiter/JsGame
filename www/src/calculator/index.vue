<template>
    <div id="layout">
        <div id="left">
            <div id="screen">{{ pattern }}</div>
            <div id="buttons">
                <div v-for="(row, index) of keyboard" :key="index">
                    <span v-for="cell of row" :key="cell" @click="append(cell)">{{ cell }}</span>
                </div>
            </div>
        </div>
        <div id="right">
            <el-button @click="treeTest"></el-button>
        </div>
    </div>
</template>
<script setup lang="ts">import { onMounted, reactive, ref } from 'vue';
import { TestFunc, traversal } from '../utils/binaryTree';
import { parseReversePolish, solveReversePolish } from './polish'
const pattern = ref("")
const tree: string[] = reactive([])
const keyboard = [
    ["AC", "BACK"],
    ["7", "8", "9", "+", "-"],
    ["4", "5", "6", "*", "/"],
    ["1", "2", "3", "Cos", "Sin"],
    ["0", ".", "=", "(", ")"],
]
const append = (content: string) => {
    if (content === "=") {
        let result = parseReversePolish(pattern.value)
        let value = solveReversePolish(result).toString()
        pattern.value += " = " + value
    } else if (content === "AC") {
        pattern.value = ""
    } else if (content === "BACK") {
        pattern.value = pattern.value.removeEnd()
    } else {
        pattern.value += content
    }
}
const treeTest = () => {
    let tree = TestFunc()
    traversal(tree)
}

onMounted(() => {
    window.addEventListener("keydown", e => {
        if (e.key.isNumeric() || e.key.isDot() || e.key.isOperator()) {
            append(e.key)
        } else if (e.key === "Enter") {
            append("=")
        } else if (e.key === "Backspace") {
            append("BACK")
        }

    })
})


</script>

<style lang="scss" scoped>
#layout {
    display: flex;
    width: 100vw;
    height: 100vh;
    #left {
        display: flex;
        flex-direction: column;
        height: 100vh;
        width: 400px;
        #screen {
            height: 100%;
        }
        #buttons {
            height: 600px;
            div {
                display: flex;
                span {
                    flex: 1;
                    text-align: center;
                    padding: 15px;
                    margin: 5px;
                    border: 1px solid #000;
                    border-radius: 5px;
                    box-shadow: 0 0 12px rgb(0 0 0 / 10%);
                }
            }
        }
    }
}
</style>
