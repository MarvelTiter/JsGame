<template>
  <Loading :images="images" :done="done"></Loading>
  <div id="container"></div>
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
import { GameImage } from "../gamebase/Source";
let game: Game | undefined
let images = {
  tree: "/sprites/ballgame/terr.png",
  return: "/sprites/ballgame/return.png",
  setting: "/sprites/ballgame/setting.png",
  yes: "/sprites/ballgame/yes.png",
}
let done = function (sources: Map<string, GameImage>) {
  game = new Game("container", sources, {
    enableCollide: true
  });
  let ms = new MainSence(game);
  game.setSence(ms);
  game.run();
}

onUnmounted(() => {
  game?.clear()
  game = undefined
})
</script>
