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
        <div id="right"></div>
    </div>
</template>
<script setup lang="ts">import { ref } from 'vue';
import { parseReversePolish, solveReversePolish } from './polish'
const pattern = ref("")
const keyboard = [
    ["7", "8", "9", "+", "-"],
    ["4", "5", "6", "*", "/"],
    ["1", "2", "3", "Cos", "Sin"],
    ["0", ".", "=", "(", ")"]
]
const append = (content: string) => {
    if (content === "=") {
        let result = parseReversePolish(pattern.value)
        let value = solveReversePolish(result).toString()
        pattern.value += " = " + value
    } else {
        pattern.value += content;
    }
}

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
