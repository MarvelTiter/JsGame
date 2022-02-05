<template>
  <Member v-model:members="members" v-model:records="records"></Member>
  <div style="margin-top: 25px; text-align: center">
    <span>游戏</span>
    &nbsp;
    <el-select v-model="game">
      <el-option value="douniu" label="斗牛"></el-option>
      <el-option value="runfaster" label="走得快"></el-option>
    </el-select>
  </div>
  <el-divider></el-divider>
  <Records :records="records"></Records>
  <Runfaster
    v-if="game == 'runfaster'"
    v-model:visible="recordDialogVisible"
    v-model:members="members"
    v-model:records="records"
  ></Runfaster>
  <Douniu
    v-if="game == 'douniu'"
    v-model:visible="recordDialogVisible"
    v-model:members="members"
    v-model:records="records"
  ></Douniu>
  <div class="add">
    <el-button type="primary" @click="addRecord">记录</el-button>
    <el-button type="danger" @click="reset" style="margin-left: 10vw">
      重置
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { member, record } from "../models/record";
import Member from "./components/member.vue";
import Records from "./components/records.vue";
import Runfaster from "./components/runfaster.vue";
import Douniu from "./components/douniu.vue";
import { ElMessage } from "element-plus";

const mems = localStorage.getItem("members") || "[]";
const members: member[] = reactive(JSON.parse(mems));
const recs = localStorage.getItem("records") || "[]";
const records: record[] = reactive(JSON.parse(recs));
const game = ref("");
const recordDialogVisible = ref(false);

const addRecord = () => {
  if (!game.value) {
    ElMessage.error("玩啥游戏呀??");
    return;
  }
  recordDialogVisible.value = true;
};
const reset = () => {
  if (!confirm("将清空所有记录！")) {
    return;
  }
  members.splice(0);
  records.splice(0);
  localStorage.setItem("members", "[]");
  localStorage.setItem("records", "[]");
};
</script>
<style>
/* .head {
  display: flex;
  flex-wrap: wrap;
} */

/* .head .el-badge {
  margin: 5px 20px;
  text-align: center;
} */

/* .btn {
  width: 100%;
} */

.records {
  display: flex;
  flex-direction: column;
}

.records .el-card {
  margin-bottom: 10px;
}

.add {
  position: fixed;
  bottom: 3vh;
  width: 100vw;
  text-align: center;
}

.record-item .el-button + .el-button {
  margin-left: 6px;
}

.member-name {
  display: inherit;
}

.icon {
  width: 14px;
}
</style>
