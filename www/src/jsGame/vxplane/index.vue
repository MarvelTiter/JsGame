<template>
  <Loading :images="images" :done="done">
    <div id="container"></div>
  </Loading>
  <Debug></Debug>
</template>

<script setup lang="ts">
import { Game } from "../gamebase/Game";
import { onMounted, ref } from "vue";
import { SPRITES_URL } from "../../utils/constDefinition";
import { loadSprites } from "../gamebase/SpritesLoader"
import Debug from "../../components/debug.vue";
import Loading from "../../components/loading.vue";
import { GameImage } from "../gamebase/Source";

let images = {

}

let done = function (sources: Map<string, GameImage>) {
  let g = new Game("container", sources, {
    enableCollide: true
  });
}

</script>
