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
let images = {
  n0: "/sprites/mine/n0.png",
  n1: "/sprites/mine/n1.png",
  n2: "/sprites/mine/n2.png",
  n3: "/sprites/mine/n3.png",
  n4: "/sprites/mine/n4.png",
  n5: "/sprites/mine/n5.png",
  n6: "/sprites/mine/n6.png",
  n7: "/sprites/mine/n7.png",
  n8: "/sprites/mine/n8.png",
  normal: "/sprites/mine/normal.png",
  flag: "/sprites/mine/flag.png",
  unknow: "/sprites/mine/unknow.png",
  over: "/sprites/mine/over.png",
  mine: "/sprites/mine/mine.png",
  mineFail: "/sprites/mine/mine_b.png",
  bg: "/sprites/mine/bg.jpg",
  button: "/sprites/mine/button.png",
  firework_green: "/sprites/other/firework_green.png",
  firework_red: "/sprites/other/firework_red.png",
  attack_effect: "/sprites/plane/attack_effect.png",
  attack_effect_explode: "/sprites/plane/attack_effect_explode.png",
}

let scripts = {
  firework_green: "/sprites/other/firework_green.json",
  firework_red: "/sprites/other/firework_red.json",
  attack_effect: "/sprites/plane/attack_effect.json",
  attack_effect_explode: "/sprites/plane/attack_effect_explode.json",
}
let done = function (sources: Map<string, GameImage>) {
  game = new Game("container", sources);
  let ms = new StartSence(game);
  game.setSence(ms);
  game.run();
}
onUnmounted(() => {
  game!.clear()
  game = undefined
})
</script>
