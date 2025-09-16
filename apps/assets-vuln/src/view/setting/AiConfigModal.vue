<template>
    <a-modal class="add-ai-config-modal" :title="config ? '编辑 AI 模型配置' : '添加 AI 模型配置'" centered @cancel="emits('update:open', false)" :confirmLoading="globalState.loading"
             :destroyOnClose="true" @ok="okHandle" :width="676" okText="确定" cancelText="取消"
             :ok-button-props="{ disabled: !formState.name || !formState.api_url || !formState.model_name }">
        <div class="flex flex-col gap-6">
            <div class="text-sm text-gary-400">适用于兼容 OpenAI API 的模型供应商</div>

            <a-form class="base-form" ref="formRef" :model="formState" layout="vertical">
                <a-form-item label="模型名称" name="name" :rules="[{ required: true, message: '必填项不能为空' }]">
                    <a-input class="base-input" v-model:value.trim="formState.name" placeholder="请输入模型名称" autocomplete="off" allow-clear/>
                </a-form-item>

                <a-form-item label="API Key" name="api_secret">
                    <a-input-password class="base-input" v-model:value.trim="formState.api_secret" placeholder="请输入API Key" autocomplete="off" allow-clear/>
                </a-form-item>

                <a-form-item label="API endpoint URL" name="api_url" :rules="[{ required: true, message: '必填项不能为空' }]">
                    <a-input class="base-input" v-model:value.trim="formState.api_url" placeholder="请输入API endpoint URL" autocomplete="off" allow-clear/>
                </a-form-item>

                <a-form-item label="API endpoint中的模型名称" name="model_name" :rules="[{ required: true, message: '必填项不能为空' }]">
                    <div class="flex w-full items-center gap-1">
                        <a-input class="flex-1 base-input" autoSize v-model:value.trim="formState.model_name" placeholder="请输入API endpoint中的模型名称" autocomplete="off" allow-clear/>
                        <div @click="testAiModel" class="text-button-blue rounded-3">测试</div>
                    </div>

                </a-form-item>
            </a-form>

        </div>
    </a-modal>
</template>

<script setup>
import { reactive, watch } from 'vue';
import { createAiModelApi, updateAiModelApi, testAiModelApi } from 'api/setting';
import { message } from 'ant-design-vue';
import { globalState } from '@/store';

const { config } = defineProps(['config']);

console.log(config);

const emits = defineEmits(['update:open', 'updateList']);
const formState = reactive({
    id: null,
    name: '',
    api_secret: '',
    api_url: '',
    model_name: '',
});
watch(() => config, (newVal) => {
    if (newVal) {
        formState.name = newVal.name || '';
        formState.api_secret = newVal.api_secret || '';
        formState.api_url = newVal.api_url || '';
        formState.model_name = newVal.model_name || '';
        formState.id = newVal.id || null;
    } else {
        formState.name = '';
        formState.api_secret = '';
        formState.api_url = '';
        formState.model_name = '';
        formState.id = null;
    }
}, { immediate: true });

const okHandle = async () => {
    try {
        if (formState.id) {
            console.log('编辑');
            await updateAiModelApi(formState);
        } else {
            console.log('新增');
            await createAiModelApi(formState);
        }
    } catch (error) {
        console.error(error);
    }

    emits('update:open', false);
    emits('updateList');
};

const testAiModel = async () => {
    try {
        const res = await testAiModelApi(formState);
        console.log(res);
        if (res.data.code === 200) {
            message.success('大模型测试成功');
        }
    } catch (error) {
        console.error(error);
    }
};
</script>

<style>
.add-ai-config-modal {
    .ant-modal-content {
        padding: 24px;
    }

    .ant-modal-footer {
        margin-top: 0;
    }
}
</style>
