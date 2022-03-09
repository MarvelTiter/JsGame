<template>
    <div id="loading-container" :class="visible ? '' : 'done'">
        <div id="process" :class="visible ? '' : 'done'">
            <h3>资源加载中</h3>
            <div id="process-bound">
                <div id="done" :style="widStyle"></div>
            </div>
            <h3>{{ loadingText }}</h3>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, PropType, ref, watch, onMounted } from 'vue';
import { GameImage } from '../jsGame/gamebase/Source';
import { loadSprites } from '../jsGame/gamebase/SpritesLoader';
const prop = defineProps({
    images: {
        type: Object,
        required: true
    },
    scripts: {
        type: Object,
        default: function () {
            return []
        }
    },
    done: {
        type: Function as PropType<(sources: Map<string, GameImage>) => void>,
        required: true
    }
})
const visible = ref(true)
const widStyle = ref("width:0px")
const loadingText = ref("0%")
onMounted(async () => {
    let sources = await loadSprites(prop.images, prop.scripts, (process) => {
        widStyle.value = `width:${(process * 100).toFixed(2)}%`
        loadingText.value = `${(process * 100).toFixed(2)}%`
    })
    visible.value = false
    prop.done(sources)
})

</script>
<style lang="scss">
#loading-container {
    text-align: center;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
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
