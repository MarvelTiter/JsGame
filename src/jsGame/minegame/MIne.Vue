<template>
  <div style="text-align: center">
    <canvas id="canvas" width="1200" height="800"></canvas>
  </div>
</template>

<script setup lang="ts">
import { Game } from "../gamebase/Game";
import { MineSence } from "./MineSence";
import { onMounted } from "vue";

onMounted(() => {
  let images = {
    n0: "sprites/mine/n0.gif",
    n1: "sprites/mine/n1.gif",
    n2: "sprites/mine/n2.gif",
    n3: "sprites/mine/n3.gif",
    n4: "sprites/mine/n4.gif",
    n5: "sprites/mine/n5.gif",
    n6: "sprites/mine/n6.gif",
    n7: "sprites/mine/n7.gif",
    n8: "sprites/mine/n8.gif",
    flag0: "sprites/mine/normal.gif",
    flag1: "sprites/mine/flag.gif",
    flag2: "sprites/mine/unknow.gif",
    over: "sprites/mine/over.gif",
    mine: "sprites/mine/mine.gif",
    mineFail: "sprites/mine/mine_b.gif",
    bg: "sprites/mine/bg.jpg",
    button: "sprites/mine/button.png",
  };
  let g = new Game()
  g.loadSources(images).then((game) => {
    let ms = new MineSence(game);
    game.setSence(ms);
    game.run();
  });
});
</script>
