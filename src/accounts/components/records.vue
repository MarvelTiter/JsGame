<template>
  <div class="records">
    <el-card v-for="r of records" :key="r.sequence">
      <el-space spacer="|" wrap>
        <div>
          <span>第{{ r.sequence }}局</span>
        </div>
        <div v-if="r.game == '斗牛'">
          <span>(斗牛)庄家:{{ r.winner }}</span>
        </div>
        <div v-if="r.game == '跑得快'">
          <span>(走得快)Winner:{{ r.winner }}</span>
        </div>
        <div v-for="i of r.members" :key="i.name">
          <el-tag :type="calcType(i.value)">{{ i.name }} | {{ i.value }}</el-tag>
        </div>
      </el-space>
    </el-card>
  </div>
</template>
<script setup lang="ts">
import { PropType } from "vue";
import { record } from "../models";

defineProps({
  records: {
    type: Array as PropType<Array<record>>,
    required: true,
  },
});

let calcType = (v: number) => {
  if (v > 0) {
    return "success";
  } else if (v < 0) {
    return "danger";
  } else {
    return "info";
  }
};

</script>
