<template>
    <a-modal centered :confirmLoading="globalState.loading"
             :title="`${editSysData ? '编辑业务系统' : '新增业务系统'}`" :afterClose="clearFormHandle"
             @cancel="emits('update:open', false)" @ok="okHandle" :width="600" :okButtonProps="{ disabled: okBtndisabled }"
             okText="确认" cancelText="取消">
        <div class="mt-6 h-[500px] overflow-auto pr-3">
            <a-form class="base-form" ref="formRef" :model="formState" layout="vertical">
                <a-form-item label="名称" name="business_system_name" :rules="[{ required: true, message: '必填项不能为空' }]">
                    <a-input class="base-input" v-model:value="formState.business_system_name" placeholder="请输入业务系统名称" show-count autocomplete="off"
                             :maxlength="30" />

                </a-form-item>

                <a-form-item name="business_system_pid">
                    <template #label>
                        <div class="flex items-center">
                            上级业务系统
                            <!-- <a-tooltip>
                                <template #title>最多支持创建 3 级业务系统</template>
                                <Svg name="icon_maybe_filled" class="ml-1" style="width:14px;height:14px;"></Svg>

                                <QuestionCircleOutlined class="text-85 text-[13px]" />
                            </a-tooltip> -->
                        </div>
                    </template>
                    <TreeSelect class="base-tree-select" v-model:value="formState.business_system_pid" :field-names="{
                        children: 'child',
                        label: 'business_system_name',
                        value: 'business_system_id',
                    }" :tree-data="sysTree" placeholder="请选择上级业务系统" allowClear="true"/>
                </a-form-item>

                <a-form-item label="状态" name="business_system_status" :rules="[{ required: true, message: '必填项不能为空' }]">
                    <Select :popupClassName="'base-select-dropdown'" class="base-select" v-model:value="formState.business_system_status" :options="SYSTEM_STATUS_OPTION" placeholder="请选择业务系统状态" />
                </a-form-item>

                <a-form-item label="负责人" name="business_system_owner_id">
                    <div class="absolute top-[-25px] right-0">
                        <span v-if="!formState.business_system_owner_id" class="text-gradient-pending text-[#2B5FFF] text-xs font-medium flex items-center">
                            <Svg name="data-time" class="mr-1" color="#6C9FFF" style="width:14px;height:14px;"></Svg>
                            信息待完善
                        </span>
                        <!-- <span v-else class="text-[#2B5FFF] text-xs font-medium flex items-center">
                            <Svg name="data-icon_yes_outlined" class="mr-1" color="#6C9FFF"
                                 style="width:14px;height:14px;"></Svg>
                            <span class="done-text">已完成</span>
                        </span> -->
                    </div>
                    <UserSelect class="user-select w-full" :popupClassName="'user-select-dropdown'" v-model:value="formState.business_system_owner_id" placeholder="请搜索并选择业务系统负责人"
                                :showSearch="true" :userid="formState.business_system_owner_id"
                    />
                </a-form-item>

                <a-form-item label="所属组织" name="organize_id" >
                    <div class="absolute top-[-25px] right-0">
                        <span v-if="!formState.organize_id" class="text-gradient-pending text-[#2B5FFF] text-xs font-medium flex items-center">
                            <Svg name="data-time" class="mr-1" color="#6C9FFF" style="width:14px;height:14px;"></Svg>
                            信息待完善
                        </span>
                        <!-- <span v-else class="text-[#2B5FFF] text-xs font-medium flex items-center">
                            <Svg name="data-icon_yes_outlined" class="mr-1" color="#6C9FFF"
                                 style="width:14px;height:14px;"></Svg>
                            <span class="done-text">已完成</span>
                        </span> -->
                    </div>

                    <OrgTreeSelect class="base-tree-select" v-model:value="formState.organize_id" placeholder="请选择业务系统所属组织"   :organizeId="formState.organize_id" show-search
                    />
                </a-form-item>

                <a-form-item label="描述" name="business_system_desc">
                    <TextArea v-model="formState.business_system_desc" :maxlength="200" :rows="4" placeholder="请输入业务系统描述" />
                </a-form-item>
            </a-form>
        </div>
    </a-modal>
</template>

<script setup>
import {
    reactive, ref, computed, h, onBeforeMount,
    watch,
} from 'vue';
import {
    addBusSysApi, updateBusSysApi, getBusinessListApi,
} from 'api/bus';
import { Modal } from 'ant-design-vue';
import { editSysData } from './constants';
import { globalState, userInfo } from '@/store';
import { SYSTEM_STATUS_OPTION } from '@/constants/app';
import infoIcon from '/src/assets/svg/data/icon_info_colorful.svg';
import OrgTreeSelect from '../../components/OrgTreeSelect.vue';

import { emitter } from '@/utils';

const emits = defineEmits(['update:open', 'updateList']);
const formRef = ref();
const formState = reactive({
    organize_id: undefined,
    business_system_id: undefined,
    business_system_name: '',
    business_system_pid: undefined,
    business_system_owner_id: undefined,
    business_system_desc: '',
    business_system_status: 'active',
});

if (editSysData.value) {
    console.log(editSysData.value);
    Object.assign(formState, editSysData.value);
    formState.business_system_pid = formState.business_system_pid === 0 ? null : formState.business_system_pid;

    formState.organize_id = formState.organize_id === '0' ? null : formState.organize_id;

    formState.business_system_owner_id = formState.business_system_owner_id === '0' ? null : formState.business_system_owner_id;

    formState.business_system_status = editSysData.value.business_system_status === '' ? null : editSysData.value.business_system_status;
}

const okBtndisabled = computed(() => !formState.business_system_name);

const clearFormHandle = () => formRef.value.resetFields();

const okHandle = async () => {
    try {
        if (!formState.business_system_owner_id || !formState.organize_id) {
            Modal.confirm({
                title: '信息待完善',
                icon: h('span', { role: 'img', 'aria-label': 'exclamation-circle', class: 'anticon anticon-exclamation-circle' }, [
                    h('img', { src: infoIcon, alt: '信息图标' }),
                ]),
                content: '存在待完善的信息，确定后，数据将进入“数据预审”',
                okCancel: '取消',
                okText: '确定',
                async onOk() {
                    if (formState.business_system_id !== undefined) {
                        await updateBusSysApi(formState);
                    } else {
                        await addBusSysApi(formState);
                    }
                    emits('update:open', false);
                    emits('updateList');
                    emitter.emit('updateSysTree');
                },
                onCancel() {},
            });
        } else {
            if (formState.business_system_id !== undefined) {
                await updateBusSysApi(formState);
            } else {
                await addBusSysApi(formState);
            }
            emits('update:open', false);
            emits('updateList');
            emitter.emit('updateSysTree');
        }
    } catch (error) {
        console.log(error);
    }
};

const sysTree = ref([]);
const getSysTree = async () => {
    try {
        const { data } = await getBusinessListApi({
            organize_id: userInfo.value.org_id,
        });
        sysTree.value = data.data.data_list;
    } catch (error) {
        console.log(error);
    }
};

watch(() => userInfo.value.org_id, async () => {
    await getSysTree();
});

onBeforeMount(async () => {
    await getSysTree();
});
</script>

<style>

.text-gradient-pending {
    background: linear-gradient(90deg, #6C9FFF 0%, #6C87FF 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}
</style>
