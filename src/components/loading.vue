<template>
    <div id="container" :class="visible ? '' : 'done'">
        <div id="process" :class="visible ? '' : 'done'">
            <div id="done" :style="widStyle"></div>
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
        width: prop.percent * 100 + '%'
    }
})

</script>
<style lang="scss">
#container {
    text-align: center;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 600px;
    background-color: rgb(64, 149, 175);
    &.done {
        background-color: white;
    }
}
#process {
    position: absolute;
    height: 1em;
    width: 80%;
    border-radius: 0.5em;
    background-color: white;
    overflow: hidden;
    &.done {
        display: none;
    }
}
#done {
    position: relative;
    height: 100%;
    background-color: aquamarine;
}
</style>
