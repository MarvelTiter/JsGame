<template>
  <Loading :percent="percent">
    <canvas id="canvas"></canvas>
  </Loading>
  <Debug></Debug>
</template>

<script setup lang="ts">
import { Game } from "../gamebase/Game";
import { onMounted, onUnmounted, ref } from "vue";
import { SPRITES_URL } from "../../utils/constDefinition";
import { loadSprites } from "../gamebase/SpritesLoader"
import Debug from "../../components/debug.vue";
import Loading from "../../components/loading.vue";
import { MainSence } from "./script/MainSence";
let percent = ref(0)
let game: Game | undefined
onMounted(async () => {
  let images = {
    allSprites_retina: `${SPRITES_URL}/tank/allSprites_retina.png`,
    onlyObjects_retina: `${SPRITES_URL}/tank/onlyObjects_retina.png`,
    tileSand1: `${SPRITES_URL}/tank/png/tileSand1.png`,
    barricadeWood: `${SPRITES_URL}/tank/png/barricadeWood.png`,
    barricadeMetal: `${SPRITES_URL}/tank/png/barricadeMetal.png`,
    explosion: `${SPRITES_URL}/tank/png/explosion.png`,
  }
  let scripts = {
    allSprites_retina: `/sprites/tank/allSprites_retina.json`,
    onlyObjects_retina: `/sprites/tank/onlyObjects_retina.json`,
    explosion: `/sprites/tank/png/explosion.json`,
  }
  let sources = await loadSprites(images, scripts, (c, t) => {
    percent.value = c / t
  })
  game = new Game(sources, {
    enableCollide: true
  });
  let ms = new MainSence(game)
  game.setSence(ms)
  game.run()
});
onUnmounted(() => {
  game?.clear()
  game = undefined
})
</script>
