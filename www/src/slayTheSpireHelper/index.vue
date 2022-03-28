<template>
    <el-card class="card">
        <el-button @click="init('Card')">攻击牌</el-button>
        <el-button @click="init('Card')">技能牌</el-button>
        <el-button @click="init('Card')">能力牌</el-button>
        <el-button @click="init('Relic')">遗物</el-button>
        <el-button @click="init('Status')">状态</el-button>
    </el-card>
    <el-card class="card">
        <div class="canvas-box">
            <div class="box left">
                <p>{{ size1.w }} × {{ size1.h }}</p>
                <canvas :width="size1.w" :height="size1.h"></canvas>
            </div>
            <div class="box right">
                <p>{{ size2.w }} × {{ size2.h }}</p>
                <canvas :width="size2.w" :height="size2.h"></canvas>
            </div>
        </div>
    </el-card>
</template>
<script setup lang="ts">
import { reactive } from 'vue';
import { ISize } from './data/ISize';
type PictureType = "Card" | "Relic" | "Status"
const size1 = reactive<ISize>({
    w: 0,
    h: 0
})
const size2 = reactive<ISize>({
    w: 0,
    h: 0
})
const init = (type: PictureType) => {
    if (type === "Card") {
        size1.w = 500
        size1.h = 380
        size2.w = 250
        size2.h = 190
    } else if (type === "Relic") {
        size1.w = 128
        size1.h = 128
        size2.w = 128
        size2.h = 128
    } else {
        size1.w = 84
        size1.h = 84
        size2.w = 32
        size2.h = 32
    }
}

</script>

<style scoped lang="scss">
.card {
    box-sizing: border-box;
    margin: 10px 10px 0 10px;
}
.canvas-box {
    display: flex;
    align-items: center;
    width: 100%;
    .box {
        p {
            text-align: center;
        }
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        canvas {
            width: 100%;
        }
    }
}
</style>
