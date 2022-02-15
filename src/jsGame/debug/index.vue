<template>
  <div style="text-align: center">
    <Loading :percent="percent">
      <canvas id="canvas"></canvas>
    </Loading>
    <br />
    <Debug></Debug>
  </div>
</template>

<script setup lang="ts">
import { Game } from "../gamebase/Game";
import { onMounted, ref } from "vue";
import { SPRITES_URL } from "../../utils/constDefinition";
import { MainSence } from "./script/MainSence";
import { loadSprites } from "../gamebase/SpritesLoader"
import Debug from "../../components/debug.vue"
import Loading from "../../components/loading.vue";
window.Debug = true
let percent = ref(0)
onMounted(async () => {
  let images = {
    enemy: `${SPRITES_URL}/plane/enemy.png`,
    mine: `${SPRITES_URL}/mine/mine.png`,
    attack_effect: `${SPRITES_URL}/plane/attack_effect.png`,
  }
  let scripts = {
    attack_effect: `/sprites/plane/attack_effect.json`,
  }
  let sources = await loadSprites(images, scripts, (c, t) => percent.value = c / t)
  let g = new Game(sources);
  let ms = new MainSence(g);
  g.setSence(ms);
  g.run();

});
</script>
