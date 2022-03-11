<template>
  <Loading :images="images" :scripts="scripts" :done="done"></Loading>
  <Debug></Debug>
  <div id="container"></div>
</template>

<script setup lang="ts">
import { Game } from "../gamebase/Game";
import { onMounted, ref } from "vue";
import { SPRITES_URL } from "../../utils/constDefinition";
import { MainSence } from "./script/MainSence";
import { loadSprites } from "../gamebase/SpritesLoader"
import Debug from "../../components/debug.vue"
import Loading from "../../components/loading.vue";
import { GameImage } from "../gamebase/Source";
window.Debug = true

let images = {
  enemy: "/sprites/plane/enemy.png",
  mine: "/sprites/mine/mine.png",
  attack_effect: "/sprites/plane/attack_effect.png",
}
let scripts = {
  attack_effect: "/sprites/plane/attack_effect.json",
}
let done = function (sources: Map<string, GameImage>) {
  let g = new Game("container", sources, {
    enableCollide: true, enableGravity: true
  });
  let ms = new MainSence(g);
  g.setSence(ms);
  g.run();
}
</script>
