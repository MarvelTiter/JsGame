<template>
    <div class="wrapper">
        <el-card class="card">
            <el-button @click="init('Attack')">攻击牌</el-button>
            <el-button @click="init('Skill')">技能牌</el-button>
            <el-button @click="init('Power')">能力牌</el-button>
            <el-button @click="init('Relic')">遗物</el-button>
            <el-button @click="init('Status')">状态</el-button>
        </el-card>
        <div class="card" style="flex: 1;">
            <div class="canvas-box">
                <div class="box left">
                    <p>{{ size1.w }} × {{ size1.h }}</p>
                    <canvas
                        :width="size1.w"
                        :height="size1.h"
                        :style="`height:${size1.h}px;width:${size1.w}px`"
                        ref="canvas1"
                    ></canvas>
                </div>
                <div class="box right">
                    <p>{{ size2.w }} × {{ size2.h }}</p>
                    <canvas
                        :width="size2.w"
                        :height="size2.h"
                        :style="`height:${size2.h}px;width:${size2.w}px`"
                        ref="canvas2"
                    ></canvas>
                </div>
            </div>
        </div>
        <el-card class="card">
            <!-- <input type="file" @change="test($event)" ref="file" /> -->
            <el-space>
                <el-button @click="selectBg">背景</el-button>
                <el-button @click="selectFg">前景</el-button>
                <el-input style="width:200px;" v-model="fgScale" @change="fgChanged">
                    <template #prepend>前景缩放比例</template>
                </el-input>
                <el-button @click="outline">outline</el-button>
                <el-button @click="fgMove(1)">前景上移</el-button>
                <el-button @click="fgMove(3)">前景下移</el-button>
                <el-button @click="fgMove(0)">前景左移</el-button>
                <el-button @click="fgMove(2)">前景右移</el-button>
                <el-button @click="fgMove(-1)">重置</el-button>
            </el-space>
        </el-card>
    </div>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ISize } from './data/ISize';
import { clear, drawBackground, drawForeground, drawOutline, PictureType, sync } from './data/canvasHelper';
import { ElMessage } from 'element-plus';
const file = ref<HTMLInputElement>();
const canvas1 = ref<HTMLCanvasElement>();
const canvas2 = ref<HTMLCanvasElement>();
const size1 = reactive<ISize>({
    w: 0,
    h: 0
})
const size2 = reactive<ISize>({
    w: 0,
    h: 0
})
const fgScale = ref(1)
let offsetX = 0
let offsetY = 0

let cardType: PictureType | undefined
let bgImg: HTMLImageElement | undefined
let fgImg: HTMLImageElement | undefined
const init = (type: PictureType) => {
    clear(canvas1.value, canvas2.value)
    if (type === "Attack" || type === "Skill" || type === "Power") {
        size1.w = 500
        size1.h = 380
        size2.w = 250
        size2.h = 190
        cardType = type
    } else if (type === "Relic") {
        size1.w = 128
        size1.h = 128
        size2.w = 128
        size2.h = 128
        cardType = undefined
    } else {
        size1.w = 84
        size1.h = 84
        size2.w = 32
        size2.h = 32
        cardType = undefined
    }
}

const loadImage = (files: FileList) => {
    return new Promise<HTMLImageElement>((resolve, reject) => {
        if (files.length < 1) {
            reject("未选择文件")
            return
        }
        let sel = files[0]
        if (sel.type.indexOf("image") < 0) {
            reject("非图片格式")
            return
        }
        let ctx1 = canvas1.value!.getContext('2d')
        let ctx2 = canvas2.value!.getContext('2d')
        let reader = new FileReader()
        reader.readAsDataURL(sel)
        reader.onload = function (e) {
            let newUrl = this.result
            let img = new Image()
            img.src = newUrl as string
            img.onload = function () {
                resolve(img)
            }
        };
    })
}

const selectBg = async () => {
    if (size1.w * size1.h === 0) {
        ElMessage.error("选择类型")
        return
    }
    let input = document.createElement("input")
    input.type = "file"
    input.onchange = async e => {
        if (input.files) {
            bgImg = await loadImage(input.files)
            let canva = await drawBackground(bgImg, size1, cardType)
            render(canva)
        }
    }
    input.click()
}
const selectFg = () => {
    if (size1.w * size1.h === 0) {
        ElMessage.error("选择类型")
        return
    }
    let input = document.createElement("input")
    input.type = "file"
    input.onchange = async e => {
        if (input.files) {
            fgImg = await loadImage(input.files)
            let canva = drawForeground(fgImg, size1, fgScale.value, offsetX, offsetY)
            render(canva)
        }
    }
    input.click()
}
const fgChanged = async () => {
    let bg = await drawBackground(bgImg, size1, cardType)
    let f = drawForeground(fgImg, size1, fgScale.value, offsetX, offsetY)
    clear(canvas1.value!, canvas2.value!)
    render(bg, f)
}

const render = (...args: Array<HTMLCanvasElement | undefined>) => {
    let ctx1 = canvas1.value!.getContext('2d')
    for (const c of args) {
        if (c !== undefined)
            ctx1?.drawImage(c, 0, 0, size1.w, size1.h)
    }
    sync(canvas1.value!, canvas2.value!, size2)
}

const outline = () => {
    drawOutline(canvas2.value!)
}

const fgMove = (direction: number) => {
    if (direction === 0) offsetX--
    else if (direction === 1) offsetY--
    else if (direction === 2) offsetX++
    else if (direction === 3) offsetY++
    else if (direction === -1) {
        offsetX = 0
        offsetY = 0
    }
    fgChanged()
}

window.addEventListener("keydown", e => {
    let k = e.key
    if (k === "a" || k === "ArrowLeft") fgMove(0)
    if (k === "w" || k === "ArrowUp") fgMove(1)
    if (k === "d" || k === "ArrowRight") fgMove(2)
    if (k === "s" || k === "ArrowDown") fgMove(3)
})

</script>

<style scoped lang="scss">
.wrapper {
    display: flex;
    flex-direction: column;
    padding: 10px;
}
.card {
    text-align: center;
}
.canvas-box {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    .box {
        p {
            text-align: center;
        }
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
}
</style>
