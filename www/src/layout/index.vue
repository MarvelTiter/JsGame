<template>
	<div class="nav">
		<router-link :class="className" to="calc">计算器</router-link>
		<router-link :class="className" to="account">账本</router-link>
		<router-link :class="className" to="slaythespire">杀戮尖塔照片处理</router-link>
		<router-link :class="className" to="mine">扫雷</router-link>
		<router-link :class="className" to="ball">雪球</router-link>
		<router-link :class="className" to="tank">坦克大战</router-link>
		<router-link :class="className" to="vxplane">飞机大战<br/>(微信版)</router-link>
		<router-link :class="className" to="plane">飞机大战</router-link>
		<router-link :class="className" to="mazda">Gear</router-link>
		<router-link :class="className" to="webrtc">WebRTC</router-link>
		<router-link :class="className" to="debug">Debug</router-link>
	</div>
	<!-- <router-view></router-view> -->
</template>
<script setup lang="ts">import { computed } from 'vue';

let className = computed(() => {
	if (window.innerWidth >= window.innerHeight) return 'vw'
	else return 'vh'
})
</script>
<style lang="scss">
.nav {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
	flex-wrap: wrap;
	background-image: linear-gradient(to top, #e6e9f0 0%, #eef1f5 100%);
	a {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-decoration: none;
		margin: 10px;
		padding: 20px;
		border: 1px solid #ccc;
		border-radius: 10px;
		background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
		&:active {
			color: rgb(119, 119, 119);
		}
		&:visited {
			color: rgb(119, 119, 119);
		}
	}
}

.vw {
	width: 10vw;
	height: 10vw;
}

.vh {
	width: 10vh;
	height: 10vh;
}
</style>
