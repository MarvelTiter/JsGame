<template>
    <div style="text-align: center;" class="debug">
        <button @click="TogglePause">砸挖撸多</button>
        <button @click="ToggleDebug">神髓显现</button>
        <button @click="StepUpdate">现实介入</button>
    </div>
</template>
<script setup lang="ts">
let TogglePause = () => {
    window.Pause = !window.Pause
}
let ToggleDebug = () => {
    window.Debug = !window.Debug
}
let StepUpdate = () => {
    for (const func of window.Update) {
        func()
    }
}
</script>
<style lang="scss">
.debug {
    position: fixed;
    bottom: 0;
    display: flex;
    justify-content: center;
    width: 100vw;
    button {
        margin: 10px;
    }
}
</style>
