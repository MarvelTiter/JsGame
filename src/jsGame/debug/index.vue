<template>
  <div style="text-align: center" id="container">
    <canvas id="canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { Game } from "../gamebase/Game";
import { onMounted } from "vue";
import { SPRITES_URL } from "../../utils/constDefinition";
import { MainSence } from "./script/MainSence";
import { loadSprites } from "../gamebase/SpritesLoader"
onMounted(async () => {
//   let images = {
//     tree: `${SPRITES_URL}/ballgame/terr.png`,
//     return: `${SPRITES_URL}/ballgame/return.png`,
//     setting: `${SPRITES_URL}/ballgame/setting.png`,
//     yes: `${SPRITES_URL}/ballgame/yes.png`,
//   }
  let sources = await loadSprites({})
  let g = new Game(sources);
  let ms = new MainSence(g);
  g.setSence(ms);
  g.run();
  
});
</script>
