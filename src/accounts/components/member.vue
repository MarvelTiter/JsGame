<template>
	<div class="head">
		<el-collapse v-model="activeName">
			<el-collapse-item title="参赛选手" name="1">
				<div v-for="(m, i) of members" class="collapse-row member-row" :class="!m.exit ? 'leave' : ''" :key="i">
					<!-- 人名部分 -->
					<span>
						<el-tag size="large" :type="m.value > -1 ? '' : 'danger'">
							<span class="member-name">{{ m.name }}</span>
						</el-tag>
					</span>
					<!-- 积分部分 -->
					<span>{{ m.value }}</span>
					<!-- 离场入场按钮 -->
					<span>
						<el-tag @click="m.exit = !m.exit" size="large" :type="m.exit ? '' : 'danger'">{{ m.exit ? "离场" : "重新加入" }}</el-tag>
					</span>
				</div>
				<div class="collapse-row">
					<el-button type="primary" @click="addMember">
						添加一个倒霉蛋
					</el-button>
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
				<el-button style="width: 100%" type="primary" @click="handleMemberAdd">添加</el-button>
			</el-form-item>
		</el-form>
	</el-dialog>
</template>
<script setup lang="ts">
// import { Trophy } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { PropType, reactive, ref } from "vue";
import { member } from "../../models/record";

const prop = defineProps({
	members: {
		type: Array as PropType<Array<member>>,
		required: true,
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
	if (!temp.value) {
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
		exit: true,
	});
	memberDialog.visible = false;
	temp.value = "";
	localStorage.setItem("members", JSON.stringify(mems));
	emits("update:members", mems);
};
</script>
<style lang="scss">
.collapse-row {
	padding: 5px 10px;
	text-align: center;
}
.member-row {
	display: flex;
	* {
		flex: 1;
	}
	span {
		text-align: center;
	}
	&.leave {
		filter: opacity(0.5);
	}
}
</style>
