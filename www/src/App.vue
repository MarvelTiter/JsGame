<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { Back } from "@element-plus/icons-vue";
import { computed } from "@vue/runtime-core";
import { useRouter } from "vue-router";
let router = useRouter();
let isRoot = computed(() => {
  return router.currentRoute.value.path === "/";
});
let goBack = () => {
  if (window.document.fullscreen) window.document.exitFullscreen();
  router.push("/");
};
</script>
<template>
  <router-view></router-view>
  <div class="back" @click="goBack" v-if="!isRoot">
    <el-icon>
      <back />
    </el-icon>
  </div>
</template>
<style lang="scss">
.back {
  position: fixed;
  width: 40px;
  height: 40px;
  border: 1px solid #ccc;
  background-color: #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  top: 20px;
  right: 20px;
}
canvas {
  // height: 100vh;
  width: 100vw;
}
* {
  -moz-user-select: none;
  -o-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
