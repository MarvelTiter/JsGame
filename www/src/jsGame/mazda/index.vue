<template>
  <Loading :images="images" :scripts="scripts" :done="done"></Loading>
  <div id="container"></div>
</template>

<script setup lang="ts">
import { Game } from "../gamebase/Game";
import { onUnmounted } from "vue";
import { StartSence } from "./script/StartSence";
import Loading from "../../components/loading.vue";
import { GameImage } from "../gamebase/Source";
let game: Game | undefined
let images = {}
let scripts = {}
let done = function (sources: Map<string, GameImage>) {
  game = new Game("container", sources);
  let ms = new StartSence(game);
  game.setSence(ms);
  game.run();
}
onUnmounted(() => {
  game?.clear()
  game = undefined
})
</script>
