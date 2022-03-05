<template>
  <Loading :percent="percent">
    <canvas id="canvas"></canvas>
  </Loading>
  <Debug></Debug>
</template>

<script setup lang="ts">
import { Game } from "../gamebase/Game";
import { onMounted, ref } from "vue";
import { SPRITES_URL } from "../../utils/constDefinition";
import { loadSprites } from "../gamebase/SpritesLoader"
import Debug from "../../components/debug.vue";
import Loading from "../../components/loading.vue";
let percent = ref(0)
onMounted(async () => {
  let images = {
    
  }
  let sources = await loadSprites(images, {}, (c, t) => {
    percent.value = c / t
  })
  let g = new Game(sources, {
    enableCollide: true
  });
});
</script>
