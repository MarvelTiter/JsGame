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
import { MainSence } from "./script/MainSence";
let percent = ref(0)
onMounted(async () => {
  let images = {
    allSprites_retina:`${SPRITES_URL}/tank/allSprites_retina.png`,
    onlyObjects_retina:`${SPRITES_URL}/tank/onlyObjects_retina.png`
  }
  let scripts = {
    allSprites_retina:`/sprites/tank/allSprites_retina.json`,
    onlyObjects_retina:`/sprites/tank/onlyObjects_retina.json`
  }
  let sources = await loadSprites(images, scripts, (c, t) => {
    percent.value = c / t
  })
  let g = new Game(sources, {
    enableCollide: true
  });
  let ms = new MainSence(g)
  g.setSence(ms)
  g.run()
});
</script>
