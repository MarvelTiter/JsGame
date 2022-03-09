<template>
  <Loading :images="images" :scripts="scripts" :done="done"></Loading>
  <div id="container"></div>
  <Debug></Debug>
</template>

<script setup lang="ts">
import { Game } from "../gamebase/Game";
import { onUnmounted, ref } from "vue";
import { SPRITES_URL } from "../../utils/constDefinition";
import Debug from "../../components/debug.vue";
import Loading from "../../components/loading.vue";
import { MainSence } from "./script/MainSence";
import { GameImage } from "../gamebase/Source";
let game: Game | undefined

let images = {
  allSprites_retina: "/sprites/tank/allSprites_retina.png",
  onlyObjects_retina: "/sprites/tank/onlyObjects_retina.png",
  tileSand1: "/sprites/tank/png/tileSand1.png",
  barricadeWood: "/sprites/tank/png/barricadeWood.png",
  barricadeMetal: "/sprites/tank/png/barricadeMetal.png",
  explosion: "/sprites/tank/png/explosion.png",
  explosionSmoke: "/sprites/tank/png/explosionSmoke.png",
}
let scripts = {
  allSprites_retina: "/sprites/tank/allSprites_retina.json",
  onlyObjects_retina: "/sprites/tank/onlyObjects_retina.json",
  explosion: "/sprites/tank/png/explosion.json",
  explosionSmoke: "/sprites/tank/png/explosionSmoke.json",
}
let src = ref("")
let done = function (sources: Map<string, GameImage>) {
  game = new Game("container", sources, {
    enableCollide: true
  });
  let ms = new MainSence(game)
  game.setSence(ms)
  game.run()
}

onUnmounted(() => {
  game?.clear()
  game = undefined
})
</script>
