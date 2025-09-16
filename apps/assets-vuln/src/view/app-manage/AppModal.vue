<template>
    <a-modal centered :title="edit ? '编辑应用' : '新增应用'" :afterClose="clearFormHandle"
             @cancel="emits('update:open', false)" @ok="okHandle" :width="600" :okButtonProps="{ disabled: okBtndisabled }"
             okText="确认" cancelText="取消">
        <div class="mt-6">
            <a-form class="base-form" ref="formRef" :model="formState" layout="vertical">
                <a-form-item label="应用名称" name="application_name" :rules="[{ required: true, message: '必填项不能为空' }]">
                    <a-input class="base-input" v-model:value="formState.application_name" placeholder="请输入应用名称" show-count :maxlength="30" autocomplete="off"/>
                </a-form-item>

                <a-form-item label="所属业务系统" name="business_system_id">
                    <div class="absolute top-[-25px] right-0">
                        <span v-if="!formState.business_system_id" class="text-gradient-pending text-xs font-medium flex items-center">
                            <Svg name="data-time" class="mr-1" color="#6C9FFF" style="width:14px;height:14px;"></Svg>
                            信息待完善
                        </span>
                        <!-- <span v-else class="text-[#2B5FFF] text-xs font-medium flex items-center">
                            <Svg name="data-icon_yes_outlined" class="mr-1" color="#6C9FFF"
                                 style="width:14px;height:14px;"></Svg>
                            <span class="done-text">已完成</span>
                        </span> -->
                    </div>
                    <TreeSelect class="base-tree-select" allow-clear v-model:value="formState.business_system_id" :field-names="{
                        children: 'child',
                        label: 'business_system_name',
                        value: 'business_system_id',
                    }" :tree-data="sysTree" placeholder="请选择所属业务系统" />
                </a-form-item>

                <a-form-item label="应用版本" name="application_version">
                    <a-input class="base-input" v-model:value="formState.application_version" placeholder="请输入应用版本" show-count :maxlength="15" autocomplete="off"/>
                </a-form-item>

                <a-form-item label="应用状态" name="application_status" :rules="[{ required: true, message: '必填项不能为空' }]">
                    <Select class="base-select" :popupClassName="'base-select-dropdown'" v-model:value="formState.application_status" :options="APP_STATUS_OPTION" placeholder="请选择应用状态" />
                </a-form-item>

                <a-form-item label="应用负责人" name="owner_id">
                    <div class="absolute top-[-25px] right-0">
                        <span v-if="!formState.application_owner_id"  class="text-gradient-pending text-xs font-medium flex items-center">
                            <Svg name="data-time" class="mr-1" color="#6C9FFF" style="width:14px;height:14px;"></Svg>
                            信息待完善
                        </span>
                        <!-- <span v-else class="text-[#2B5FFF] text-xs font-medium flex items-center">
                            <Svg name="data-icon_yes_outlined" class="mr-1" color="#6C9FFF"
                                 style="width:14px;height:14px;"></Svg>
                            <span class="done-text">已完成</span>
                        </span> -->
                    </div>
                    <UserSelect class="user-select" :showSearch="true"  :popupClassName="'user-select-dropdown'" v-model:value="formState.application_owner_id" placeholder="请搜索并选择应用负责人"  :userid="formState.application_owner_id"
                    />
                </a-form-item>
            </a-form>
        </div>
    </a-modal>
</template>

<script setup>
import {
    reactive, ref, computed, onBeforeMount, h,
    watchEffect,
} from 'vue';
import { addAppApi, updateAppApi } from 'api/app';
import { getBusinessListApi } from 'api/bus';
import { Modal } from 'ant-design-vue';
import { userInfo } from '@/store';
import { APP_STATUS_OPTION } from '@/constants/app';
import infoIcon from '/src/assets/svg/data/icon_info_colorful.svg';

const editShowName = ref(null);

const { editAppData, edit } = defineProps(['editAppData', 'edit']);
const emits = defineEmits(['update:open', 'updateList']);
const formRef = ref();
const sysTree = ref();
const formState = reactive({
    application_name: '',
    business_system_id: undefined,
    application_version: '',
    application_owner_id: undefined,
    application_status: 'active',
});
watchEffect(() => {
    if (editAppData) {
        console.log(editAppData);
        Object.assign(formState, editAppData);
        formState.business_system_id = sysTree.value?.find((item) => item.business_system_name === formState.business_system_name)?.business_system_id;

        formState.application_owner_id = editAppData.owner_id || editAppData.application_owner_id;

        editShowName.value = {
            organize_nick_name: editAppData.application_owner_nick_name,
            organize_user_id: editAppData.application_owner_id,
            organize_user_enterprise_email: editAppData.organize_user_enterprise_email,
            organize_name: editAppData.organize_name,
        };
    }
});

const okBtndisabled = computed(() => !formState.application_name || !formState.application_status);

onBeforeMount(async () => {
    try {
        const { data } = await getBusinessListApi({
            organize_id: userInfo.value.org_id,
        });
        sysTree.value = data.data.data_list;
    } catch (error) {
        console.log(error);
    }
});

const clearFormHandle = () => formRef.value.resetFields();

const okHandle = async () => {
    try {
        if (!formState.application_owner_id || !formState.business_system_id) {
            Modal.confirm({
                title: '信息待完善',
                icon: h('span', { role: 'img', 'aria-label': 'exclamation-circle', class: 'anticon anticon-exclamation-circle' }, [
                    h('img', { src: infoIcon, alt: '信息图标' }),
                ]),
                content: '存在待完善的信息，确定后，数据将进入“数据预审”',
                okCancel: '取消',
                okText: '确定',
                async onOk() {
                    if (formState.application_id) {
                        await updateAppApi(formState);
                    } else {
                        await addAppApi(formState);
                    }
                    emits('update:open', false);
                    emits('updateList');
                },
                onCancel() {},
            });
        } else {
            if (formState.application_id) {
                await updateAppApi(formState);
            } else {
                await addAppApi(formState);
            }
            emits('update:open', false);
            emits('updateList');
        }
    } catch (error) {
        console.log(error);
    }
};
</script>

<style>
.text-gradient-pending {
    background: linear-gradient(90deg, #6C9FFF 0%, #6C87FF 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}
</style>
