<template>
  <Loading :percent="percent">
    <canvas id="canvas"></canvas>
  </Loading>
</template>

<script setup lang="ts">
import { Game } from "../gamebase/Game";
import { onMounted, ref } from "vue";
// import { MineSence, basis } from "./script/MineSence";
import { SPRITES_URL } from "../../utils/constDefinition";
import { StartSence } from "./script/StartSence";
import { loadSprites } from "../gamebase/SpritesLoader"
import Loading from "../../components/loading.vue";
let percent = ref(0)
onMounted(async () => {
  let images = {
    n0: `${SPRITES_URL}/mine/n0.png`,
    n1: `${SPRITES_URL}/mine/n1.png`,
    n2: `${SPRITES_URL}/mine/n2.png`,
    n3: `${SPRITES_URL}/mine/n3.png`,
    n4: `${SPRITES_URL}/mine/n4.png`,
    n5: `${SPRITES_URL}/mine/n5.png`,
    n6: `${SPRITES_URL}/mine/n6.png`,
    n7: `${SPRITES_URL}/mine/n7.png`,
    n8: `${SPRITES_URL}/mine/n8.png`,
    normal: `${SPRITES_URL}/mine/normal.png`,
    flag: `${SPRITES_URL}/mine/flag.png`,
    unknow: `${SPRITES_URL}/mine/unknow.png`,
    over: `${SPRITES_URL}/mine/over.png`,
    mine: `${SPRITES_URL}/mine/mine.png`,
    mineFail: `${SPRITES_URL}/mine/mine_b.png`,
    bg: `${SPRITES_URL}/mine/bg.jpg`,
    button: `${SPRITES_URL}/mine/button.png`,
    firework_green: `${SPRITES_URL}/other/firework_green.png`,
    firework_red: `${SPRITES_URL}/other/firework_red.png`,
    attack_effect: `${SPRITES_URL}/plane/attack_effect.png`,
    attack_effect_explode: `${SPRITES_URL}/plane/attack_effect_explode.png`,
  }

  let scripts = {
    firework_green: `/sprites/other/firework_green.json`,
    firework_red: `/sprites/other/firework_red.json`,
    attack_effect: `/sprites/plane/attack_effect.json`,
    attack_effect_explode: `/sprites/plane/attack_effect_explode.json`,
  }

  let sources = await loadSprites(images, scripts, (c, t) => {
    percent.value = c / t

  })
  let g = new Game(sources);
  let ms = new StartSence(g);
  g.setSence(ms);
  g.run();
});
</script>
