<template>
  <div class="head">
    <el-collapse v-model="activeName">
      <el-collapse-item title="参赛选手" name="1">
        <div v-for="(m, i) of members" class="collapse-row member-row">
          <span>
            <el-tag class="btn" size="large">
              <span class="member-name">{{ m.name }}</span>
            </el-tag>
          </span>
          <span>{{ m.value }}</span>
        </div>
        <div class="collapse-row">
          <el-button type="primary" @click="addMember"> + </el-button>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
  <el-dialog v-model="memberDialog.visible" width="80%">
    <el-form>
      <el-form-item label="名字">
        <el-input size="large" v-model="temp"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button style="width: 100%" type="primary" @click="handleMemberAdd"
          >添加</el-button
        >
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script setup lang="ts">
// import { Trophy } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { PropType, reactive, ref } from "vue";
import { member, record } from "../../models/record";

const prop = defineProps({
  members: {
    type: Array as PropType<Array<member>>,
    require: true,
  },
  records: {
    type: Array as PropType<Array<record>>,
    require: true,
  },
});
const emits = defineEmits(["update:members", "update:records"]);
const temp = ref("");
const activeName = ref("1");
const memberDialog = reactive({
  visible: false,
});
const addMember = () => {
  memberDialog.visible = true;
};

const handleMemberAdd = () => {
  if (!temp.value){
    ElMessage.error("不能为空");
    return;
  }
  let mems = prop.members;
  if (mems === undefined) return;
  let filted = mems.filter((m) => m.name === temp.value);
  if (filted.length > 0) {
    ElMessage.error("重复");
    return;
  }
  mems.push({
    name: temp.value,
    value: 0,
  });
  memberDialog.visible = false;
  temp.value = "";
  localStorage.setItem("members", JSON.stringify(mems));
  emits("update:members", mems);
};

const calcTotal = (m: any) => {
  let total = 0;
  let records = prop.records;
  if (records === undefined) return;
  for (const r of records) {
    for (const mem of r.members) {
      if (mem.name == m) {
        total += mem.value;
      }
    }
  }
  return total;
};
</script>
<style>
.collapse-row {
  padding: 5px 10px;
}
.member-row {
  display: flex;
}
.member-row * {
  flex: 1;
}
</style>
