<template>
  <div style="text-align: center">
    <canvas id="canvas" width="1200" height="800"></canvas>
  </div>
</template>

<script setup lang="ts">
import { Game } from "../gamebase/Game";
import { onMounted } from "vue";
import { MineSence } from "./script/MineSence"
import { SPRITES_URL } from "../../utils/constDefinition";
onMounted(() => {
  let images = {
    n0: `${SPRITES_URL}/mine/n0.gif`,
    n1: `${SPRITES_URL}/mine/n1.gif`,
    n2: `${SPRITES_URL}/mine/n2.gif`,
    n3: `${SPRITES_URL}/mine/n3.gif`,
    n4: `${SPRITES_URL}/mine/n4.gif`,
    n5: `${SPRITES_URL}/mine/n5.gif`,
    n6: `${SPRITES_URL}/mine/n6.gif`,
    n7: `${SPRITES_URL}/mine/n7.gif`,
    n8: `${SPRITES_URL}/mine/n8.gif`,
    normal: `${SPRITES_URL}/mine/normal.gif`,
    flag: `${SPRITES_URL}/mine/flag.gif`,
    unknow: `${SPRITES_URL}/mine/unknow.gif`,
    over: `${SPRITES_URL}/mine/over.gif`,
    mine: `${SPRITES_URL}/mine/mine.gif`,
    mineFail: `${SPRITES_URL}/mine/mine_b.gif`,
    bg: `${SPRITES_URL}/mine/bg.jpg`,
    button: `${SPRITES_URL}/mine/button.png`,
    fireworks_g:`${SPRITES_URL}/mine/yanhua.green.png`,
    fireworks_r:`${SPRITES_URL}/mine/yanhua_red.png`,
  };
  let g = new Game()
  g.loadSources(images).then((game) => {
    let ms = new MineSence(game);
    game.setSence(ms);
    game.run();
  });
});
</script>
