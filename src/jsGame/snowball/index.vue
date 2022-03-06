<template>
  <Loading :percent="percent">
    <canvas id="canvas"></canvas>
  </Loading>
  <Debug></Debug>
</template>

<script setup lang="ts">
import { Game } from "../gamebase/Game";
import { onMounted, ref, onUnmounted } from "vue";
import { SPRITES_URL } from "../../utils/constDefinition";
import { MainSence } from "./script/MainSence";
import { loadSprites } from "../gamebase/SpritesLoader"
import Debug from "../../components/debug.vue";
import Loading from "../../components/loading.vue";
let percent = ref(0)
let game: Game | undefined
onMounted(async () => {
  let images = {
    tree: `${SPRITES_URL}/ballgame/terr.png`,
    return: `${SPRITES_URL}/ballgame/return.png`,
    setting: `${SPRITES_URL}/ballgame/setting.png`,
    yes: `${SPRITES_URL}/ballgame/yes.png`,
  }
  let sources = await loadSprites(images, {}, (c, t) => {
    percent.value = c / t
  })
  game = new Game(sources, {
    enableCollide: true
  });
  let ms = new MainSence(game);
  game.setSence(ms);
  game.run();
});
onUnmounted(() => {  
  game?.clear()
  game = undefined
})
</script>
