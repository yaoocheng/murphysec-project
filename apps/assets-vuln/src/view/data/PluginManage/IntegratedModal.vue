<template>
    <a-modal :title="formState.plug_market_id ? '编辑插件' : '集成插件'" centered :afterClose="clearFormHandle"
             @cancel="emits('update:open', false)" :confirmLoading="globalState.loading" @ok="okHandle" :width="600"
             :okButtonProps="{ disabled: okBtndisabled }" okText="确认" cancelText="取消">
        <div class="mt-6 h-[500px] overflow-auto pr-3">
            <a-form class="base-form" ref="formRef" :model="formState" layout="vertical">
                <a-form-item label="插件名称" name="plug_name" :rules="[{ required: true, message: '必填项不能为空' }]">
                    <a-input class="base-input" v-model:value="formState.plug_name" placeholder="请输入插件名称" show-count :maxlength="15" />
                </a-form-item>

                <a-form-item label="数据接入类型" name="plug_data_type" :rules="[{ required: true, message: '必填项不能为空' }]">
                    <Select class="base-select" :popupClassName="'base-select-dropdown'" v-model:value="formState.plug_data_type" :options="PLUGIN_TYPE_OPTION"
                            placeholder="请选择数据接入类型" />
                </a-form-item>

                <a-form-item label="插件模板" name="plug_built_id">
                    <Select class="base-select" :popupClassName="'base-select-dropdown'" v-model:value="formState.plug_built_id"
                            @change="changeTemp(formState.plug_built_id, 'plug_built')"
                            :field-names="{ label: 'plug_name', value: 'plug_built_id', }" :options="PLUGIN_TEMP_OPTION"
                            placeholder="请选择插件模板" />
                </a-form-item>

                <a-form-item label="程序实参" name="plug_program_parameters">
                    <TextArea class="base-textarea" v-model="formState.plug_program_parameters" placeholder="请输入程序实参" :rows="4" />
                </a-form-item>

                <a-form-item name="plug_file_text" :rules="[{ required: true, message: '必填项不能为空' }]">
                    <template #label>
                        <div class="font-medium">编写插件</div>
                        <a-tooltip class="ml-1">
                            <template #title>仅支持 Python 语言</template>
                            <Svg name="maybe_filled" class="ml-1" height="14" width="14"></Svg>
                        </a-tooltip>
                    </template>
                    <TextArea class="base-textarea" v-model="formState.plug_file_text" :rows="4" />
                </a-form-item>
            </a-form>
        </div>
    </a-modal>
</template>

<script setup>
import {
    ref, reactive, computed,
} from 'vue';
import { getPluginTempCodeApi, addPluginApi } from 'api/data';
import { globalState } from '@/store';
import {
    PLUGIN_TYPE_OPTION, PLUGIN_TEMP_OPTION, editPluginData,
} from '../constants';

const emits = defineEmits(['update:open', 'updatePlugin']);
const formRef = ref();
const formState = reactive({
    plug_name: '',
    plug_data_type: undefined,
    plug_built_id: undefined,
    plug_program_parameters: undefined,
    plug_file_text: '',
});
if (editPluginData.value) {
    console.log(editPluginData.value);
    Object.assign(formState, editPluginData.value);
    console.log(formState);
    editPluginData.value = null;
}

const okBtndisabled = computed(() => !formState.plug_name || !formState.plug_data_type || !formState.plug_file_text);

const clearFormHandle = () => {
    formRef.value.resetFields();
};

const changeTemp = async (value, type) => {
    if (type === 'plug_built') {
        formState.plug_program_parameters = PLUGIN_TEMP_OPTION.value?.find((item) => item.plug_built_id === value)?.plug_program_parameters;
    }
    try {
        const { data } = await getPluginTempCodeApi({
            plug_type: type,
            plug_id: value,
        });
        formState.plug_file_text = data.data;
    } catch (error) {
        console.log(error);
    }
};
if (formState.plug_market_id) {
    changeTemp(formState.plug_market_id, 'plug_market');
}

const okHandle = async () => {
    try {
        await addPluginApi(formState);
        emits('update:open', false);
        emits('updatePlugin');
    } catch (error) {
        console.log(error);
    }
};
</script>
