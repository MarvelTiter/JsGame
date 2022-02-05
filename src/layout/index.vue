<template>
  <div class="nav">
    <router-link to="calc">计算器</router-link>
    <router-link to="mine">扫雷</router-link>
  </div>
  <!-- <router-view></router-view> -->
</template>
<style>
.nav {
  display: flex;
  justify-content: center;
}
.nav * {
  margin: 10px;
  padding: 20px;
  border: 1px solid #ccc;
}
</style>
