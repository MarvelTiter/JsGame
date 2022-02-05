<template>
  <el-dialog v-model="visible" width="95%" @close="close" @open="onDialogOpen">
    <el-form label-position="top">
      <el-form-item :label="`倍数: ${times}`">
        <el-button type="success" @click="times--">-1</el-button>
        <el-button type="success" @click="times++">+1</el-button>
      </el-form-item>
      <el-form-item v-for="m of newRecord" class="record-item">
        <template v-slot:label>
          <span v-if="m.name == winner" style="color: red; font-size: 18px"
            >Winner |
          </span>
          <span>{{ m.name }} : {{ m.value }}</span>
          <el-tag @click="winner = m.name">获胜</el-tag>
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
import { PropType, reactive, ref } from "vue";
import { member, memberRecord, record } from "../../models/record";

const prop = defineProps({
  visible: Boolean,
  records: {
    type: Array as PropType<Array<record>>,
    require: true,
  },
  members: {
    type: Array as PropType<Array<member>>,
    require: true,
  },
});
const emits = defineEmits(["update:visible", "update:records"]);

const times = ref(1);
const winner = ref("");
const newRecord: memberRecord[] = reactive([]);

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
  if (total == 0 && records !== undefined) {
    const nr = {
      winner: winner.value,
      sequence: records.length + 1,
      members: [...newRecord],
    };
    records.unshift(nr);
    emits("update:records", records);
    localStorage.setItem("records", JSON.stringify(records));
    // 更新参与者总分
    let members = prop.members;
    for (const m of members ?? []) {
      let rm = newRecord.filter((nr) => nr.name === m.name);
      if (rm.length === 1) m.value += rm[0].value;
    }
    close();
  } else {
    ElMessage.error("总数异常");
  }
};
const close = () => {
  emits("update:visible", false);
};

let onDialogOpen = () => {
  let mems = prop.members;
  if (mems === undefined) return;
  newRecord.splice(0);
  for (const e of mems) {
    newRecord.push({
      name: e.name,
      value: 0,
    });
  }
};
</script>
