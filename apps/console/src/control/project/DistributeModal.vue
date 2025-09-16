<template>
    <el-dialog width="600px" @close="emits('update:modelValue', false)" :close-on-click-modal="false">
        <template #header>
            <div class="text-base text-3c mb-2">
                更改项目分发场景
            </div>
            <div class="text-85 text-sm font-normal">
                分发场景变更后，只更新最新一次检测任务的结果
            </div>
        </template>

        <div class="text-sm mb-2 font-medium">
            <span class="text-err">*</span>
            分发场景
        </div>
        <el-select v-model="formData.distribution" placeholder="请选择分发场景" class="w-full">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>

        <template #footer>
            <el-button @click="emits('update:modelValue', false)" class="minor_btn w-20 h-8">取消</el-button>
            <el-button @click="confirmHandle" class="w-20">确认</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { reactive } from 'vue';
import { detailDistributeApi } from 'api/detail';
import { distributionLinApi } from 'api/set';
import { useRoute } from 'vue-router';
import { showMessage } from '@/utils/tools';

const emits = defineEmits(['update:modelValue', 'update']);

const route = useRoute();
const { pid, name } = defineProps(['pid', 'name']);

const formData = reactive({
    distribution: name,
    project_id: pid,
});

const options = [
    {
        label: '外部',
        value: 'external',
    },
    {
        label: '内部',
        value: 'internal',
    },
    {
        label: 'SaaS',
        value: 'saas',
    },
    {
        label: '开源',
        value: 'open_source',
    },
];

const confirmHandle = async () => {
    if (route.path.includes('/detail')) {
        try {
            await detailDistributeApi({
                distribution: formData.distribution,
                subtask_id: route.params.sid,
            });
            emits('update:modelValue', false);
            emits('update');
            showMessage('修改成功', 'success');
        } catch (error) {
            console.log(error);
        }
    } else {
        try {
            await distributionLinApi(formData);
            emits('update:modelValue', false);
            emits('update');
            showMessage('修改成功', 'success');
        } catch (error) {
            console.log(error);
        }
    }
};
</script>
