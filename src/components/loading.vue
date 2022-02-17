<template>
    <div id="container" :class="visible ? '' : 'done'">
        <div id="process" :class="visible ? '' : 'done'">
            <h3>资源加载中</h3>
            <div id="process-bound">
                <div id="done" :style="widStyle"></div>
            </div>
            <h3>{{ loadingText }}</h3>
        </div>
        <slot></slot>
    </div>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue';
const prop = defineProps({
    percent: {
        type: Number,
        required: true
    }
})
const visible = ref(true)
watch(() => prop.percent, (nv, ov) => {
    if (nv === 1) {
        visible.value = false
    }
})
// let width = ref(0)
let widStyle = computed(() => {
    return {
        width: (prop.percent * 100).toFixed(2) + '%'
    }
})

let loadingText = computed(() => {
    return (prop.percent * 100).toFixed(2) + '%'

})

</script>
<style lang="scss">
#container {
    text-align: center;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: rgb(64, 149, 175);
    &.done {
        background-color: white;
    }
}
#process {
    position: absolute;
    width: 80%;
    background-color: transparent;
    &.done {
        display: none;
    }
    h3 {
        color: white;
    }
}
#process-bound {
    height: 1em;
    border-radius: 0.5em;
    overflow: hidden;
}
#done {
    position: relative;
    height: 100%;
    background-color: aquamarine;
}
</style>
