<template>
    <a-modal centered :confirmLoading="globalState.loading" :title="editData ? '编辑安全能力' : '添加安全能力'" :afterClose="clearFormHandle"
             @cancel="emits('update:open', false)" @ok="okHandle" :width="600" :okButtonProps="{ disabled: okBtndisabled }"
             okText="确认" cancelText="取消">
        <div class="mt-6">
            <a-form class="base-form" ref="formRef" :model="formState" layout="vertical">
                <a-form-item label="安全能力名称" name="name" :rules="[{ required: true, message: '必填项不能为空' }]">
                    <a-input class="base-input" v-model:value.trim="formState.name" placeholder="请输入安全能力名称" show-count :maxlength="30" autocomplete="off"/>
                </a-form-item>

                <a-form-item name="capability_unique_id" :rules="[{ required: true, message: '必填项不能为空' }]">
                    <template #label>
                        安全能力标识
                        <a-tooltip overlayClassName="sec-ability-tooltip" placement="right">
                            <template #title>
                                <div>
                                    安全能力的唯一英文标识，主要用于 API调用和系统集成。
                                    只能包含字母、数字和短横线(-)
                                </div>
                            </template>
                            <Svg name="maybe_filled" class="ml-1" height="14" width="14"></Svg>
                        </a-tooltip>
                    </template>
                    <a-input class="base-input" :disabled="editData" v-model:value.trim="formState.capability_unique_id" placeholder="请输入能力标识，例如：codeql" autocomplete="off"/>
                </a-form-item>

                <a-form-item label="安全能力类型" name="type" :rules="[{ required: true, message: '必填项不能为空' }]">
                    <Select class="base-select" :popupClassName="'base-select-dropdown'" v-model:value="formState.type" :options="SECURITY_CAPABILITY_TYPE" placeholder="请选择安全能力类型" />
                </a-form-item>

                <a-form-item ref="missingRate" name="missing_rate_value" :rules="formState.is_user_defined_rate ? [
                    { required: true, message: '必填项不能为空' },
                    { validator: (rule, value) => {
                        if (value && (value < 0 || value > 99)) {
                            throw new Error('请输入0-99的正整数');
                        }
                        if (value && !/^\d+$/.test(value)) {
                            throw new Error('请输入0-99的正整数');
                        }
                    }}
                ] : []">
                    <template #label>
                        安全能力缺失率
                        <a-tooltip overlayClassName="sec-ability-tooltip" placement="right">
                            <template #title>
                                <div>
                                    由于安全能力覆盖能力存在差异（如攻击面安全能力，只能覆盖外网应用），这种场景下，驾驶舱按默认规则统计覆盖率时可能与实际情况不符，可自定义覆盖率从而更准确的进行统计
                                </div>
                            </template>
                            <Svg name="maybe_filled" class="ml-1" height="14" width="14"></Svg>
                        </a-tooltip>
                    </template>
                    <div class="flex flex-col gap-2">
                        <a-radio-group @change="formState.missing_rate_value=!formState.is_user_defined_rate?undefined:formState.missing_rate_value" v-model:value="formState.is_user_defined_rate">
                            <a-radio :value="false">默认系统计算</a-radio>
                            <a-radio :value="true">自定义</a-radio>
                        </a-radio-group>
                        <span v-if="formState.is_user_defined_rate" class="flex items-center gap-1.5">
                            <span>设置缺失率</span>
                            <a-input class="flex-1 base-input" v-model:value="formState.missing_rate_value" placeholder="请输入0-99的正整数" autocomplete="off"/>
                            <span>%</span>
                        </span>
                    </div>
                </a-form-item>

                <a-form-item label="安全能力的描述" name="desc" >
                    <TextArea v-model.trim="formState.desc" placeholder="请输入安全能力描述" show-count
                              :maxlength="100" :rows="4" />
                </a-form-item>

            </a-form>
        </div>
    </a-modal>
</template>

<script setup>
import {
    reactive, ref, computed, watch,
} from 'vue';
import { addSecAbleApi, updateSecAbleApi } from 'api/app';
import { globalState } from '@/store';
import { SECURITY_CAPABILITY_TYPE } from '@/constants/safetyCapabilities';

const { editData } = defineProps(['editData']);
const emits = defineEmits(['update:open', 'updateList']);
const formRef = ref();
const formState = reactive({
    id: editData?.security_capability_id,
    name: editData?.capability_name,
    type: editData?.capability_type,
    desc: editData?.capability_desc,
    missing_rate_value: editData?.is_user_defined_rate ? ((editData?.missing_rate_value || 0) * 100).toFixed(0) : undefined,
    is_user_defined_rate: editData?.is_user_defined_rate || false,
    capability_unique_id: editData?.capability_unique_id,
});

// 安全能力缺失率
const missingRate = ref();

// 切换至默认系统计算时，清空报错
watch(formState.is_user_defined_rate, (newVal) => {
    if (newVal === false) {
        missingRate.value.clearValidate();
    }
});

const okBtndisabled = computed(() => {
    const basicCheck = !formState.name || !formState.type || !formState.capability_unique_id;
    if (!formState.is_user_defined_rate) return basicCheck;

    const rate = formState.missing_rate_value;
    return basicCheck || !rate || rate < 0 || rate > 99 || !/^\d+$/.test(rate);
});

const clearFormHandle = () => formRef.value.resetFields();

const okHandle = async () => {
    try {
        if (formState.id) {
            formState.missing_rate_value /= 100;
            await updateSecAbleApi(formState);
        } else {
            formState.missing_rate_value /= 100;
            await addSecAbleApi(formState);
        }
        emits('update:open', false);
        emits('updateList');
    } catch (error) {
        console.log(error);
    }
};

</script>

<style>
.sec-ability-tooltip {
    .ant-tooltip-content{
        width: 400px !important;
    }
}
</style>
