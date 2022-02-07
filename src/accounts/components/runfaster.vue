<template>
  <el-dialog v-model="visible" width="95%" @close="close" @open="onDialogOpen">
    <el-form label-position="top">
      <el-form-item :label="`倍数: ${times}`">
        <el-button type="success" @click="times /= 2">÷2</el-button>
        <el-button type="success" @click="times *= 2">×2</el-button>
      </el-form-item>
      <el-form-item v-for="m of newRecord" class="record-item">
        <template v-slot:label>
          <span v-if="m.name == winner" style="color: red; font-size: 18px"
            >Winner |
          </span>
          <span>{{ m.name }} : {{ m.value }}</span>
          <el-tag
            v-if="winner !== m.name"
            @click="winner = m.name"
            style="margin-left: 10px"
            >获胜</el-tag
          >
        </template>
        <div v-if="m.name !== winner">
          <el-button type="danger" @click="updateValue(m, -5)">5</el-button>
          <el-button type="danger" @click="updateValue(m, -4)">4</el-button>
          <el-button type="danger" @click="updateValue(m, -3)">3</el-button>
          <el-button type="danger" @click="updateValue(m, -2)">2</el-button>
          <el-button type="danger" @click="updateValue(m, -1)">1</el-button>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleRecordAdd" type="primary" style="width: 100%"
          >确定</el-button
        >
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script setup lang="ts">
import { ElMessage } from "element-plus";
import { PropType, reactive, ref, watch } from "vue";
import { member, memberRecord, record } from "../models";

const prop = defineProps({
  visible: Boolean,
  records: {
    type: Array as PropType<Array<record>>,
    required: true,
  },
  members: {
    type: Array as PropType<Array<member>>,
    required: true,
  },
});
const emits = defineEmits(["update:visible", "update:records"]);
const newRecord: memberRecord[] = reactive([]);

// 倍数
const times = ref(1);
const winner = ref("");

const updateValue = (mem: memberRecord, v: number) => {
  if (!winner.value) {
    ElMessage.error("谁赢了??");
    return;
  }
  if (v == -5) v *= 2;
  mem.value = v * times.value;
  if (!winner || winner.value == mem.name) return;
  const b = newRecord.filter((m) => m.name == winner.value)[0];
  let lost = 0;
  for (const m of newRecord) {
    if (m.name == winner.value) continue;
    lost += m.value;
  }
  b.value = 0 - lost;
};

const handleRecordAdd = () => {
  let total = 0;
  for (const m of newRecord) {
    total += m.value;
  }
  let records = prop.records;
  let members = prop.members;
  if (total == 0) {
    const nr = {
      winner: winner.value,
      sequence: records.length + 1,
      members: [...newRecord],
    };
    records.unshift(nr);
    emits("update:records", records);
    localStorage.setItem("records", JSON.stringify(records));
    // 更新参与者总分
    for (const m of members) {
      let rm = newRecord.filter((nr) => nr.name === m.name);
      if (rm.length === 1) m.value += rm[0].value;
    }
    localStorage.setItem("members", JSON.stringify(members));
    close();
  } else {
    ElMessage.error("总数异常");
  }
};
const close = () => {
  emits("update:visible", false);
};

watch(times, (nv, ov) => {
  for (const m of newRecord) {
    if (nv > ov) {
      m.value *= 2;
    } else {
      m.value /= 2;
    }
  }
});

let onDialogOpen = () => {
  let mems = prop.members;
  newRecord.splice(0);
  winner.value = "";
  times.value = 1;
  for (const e of mems) {
    if (!e.exit) continue;
    newRecord.push({
      name: e.name,
      value: 0,
    });
  }
};
</script>
