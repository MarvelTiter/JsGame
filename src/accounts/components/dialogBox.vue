<template>
  <el-dialog v-model="visible" width="95%" @close="close">
    <el-form>
      
    </el-form>
  </el-dialog>
</template>
<script setup lang="ts">
import { ElMessage } from "element-plus";
import { PropType } from "vue";
import { memberRecord, record } from "../../models/record";

const prop = defineProps({
  visible: Boolean,
  com: String,
  records: {
    type: Array as PropType<Array<record>>,
    require: true,
  },
  members: {
    type: Array as PropType<Array<string>>,
    require: true,
  },
});

</script>
