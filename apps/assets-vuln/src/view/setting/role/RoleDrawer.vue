<template>
    <a-drawer :headerStyle="{ display: 'none' }" :bodyStyle="{paddingBottom: 0}" placement="right" @close="$emit('update:open', false)" size="large" :root-style="{
                  'z-index': '1001'
              }"
              root-class-name="role-drawer" :maskClosable="false">
        <div class="flex items-center justify-between mb-6">
            <div class="text-3c font-medium text-base">
                {{isCheck ? '查看角色' : roleDataId ? '编辑角色' : '新增角色'}}
            </div>
            <div class="flex items-center gap-1">
                <span @click="$emit('update:open', false)" class="text-button-gray w-6 h-6">
                    <Svg name="drawer_close" class="cursor-pointer" color="#999999"></Svg>
                </span>
            </div>
        </div>
        <div class="h-[calc(100%-50px)] overflow-auto">
            <div class="mb-6">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-[#3C3C3C] text-xs font-medium">角色名称 <span class="text-red-500">*</span></span>
                </div>
                <a-input v-model:value.trim="formData.role_name" :disabled="isCheck" class="w-full" :maxlength="30" show-count placeholder="请输入" />
            </div>

            <div class="mb-6">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-[#3C3C3C] text-xs font-medium">角色描述</span>
                </div>
                <a-textarea v-model:value.trim="formData.description" :disabled="isCheck" :auto-size="{ minRows: 4, maxRows: 4 }" class="w-full"
                            :maxlength="200" show-count placeholder="请输入" />
            </div>

            <div class="mb-6">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-[#3C3C3C] text-xs font-medium">功能模块访问权限 <span class="text-red-500">*</span></span>
                </div>
                <ToogleModule :selectedModules="functionModules" :disabled="isCheck" @updateModule="(list) => formData.functional_permissions = list" />
            </div>

            <div class="mb-6">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-[#3C3C3C] text-xs font-medium">功能权限</span>
                </div>
                <ToggleFunc :selectedFunctions="modulesData" :disabled="isCheck"
                            @updateFunction="(list) => formData.exist_open_api = list" />
            </div>

            <div class="mb-6">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-[#3C3C3C] text-xs font-medium">数据访问权限</span>
                </div>
                <div class="flex gap-6">
                    <div>
                        <a-checkbox class="mr-1" :disabled="true" v-model:checked="formData.allDataCheck">
                            <span class="text-gary-700">所属组织及其下级组织数据权限</span>
                        </a-checkbox>
                    </div>
                    <div>
                        <a-checkbox class="mr-1 role_disabled_checked" :disabled="isCheck" v-model:checked="formData.otherDataCheck"
                                    @change="changeOtherDataCheck" >
                            <span class="role_text">额外可访问数据权限</span>
                        </a-checkbox>
                    </div>
                </div>

                <!-- 额外数据权限选择区域 -->
                <div v-if="formData.otherDataCheck" class="mt-3 py-5 px-6 rounded-3 bg-[#F2F2F280]">
                    <div>
                        <a-radio-group class="role_radio_disabled" v-model:value="formData.data_access_type" :disabled="isCheck">
                            <a-radio value="organize-all">
                                <span class="text">
                                    所有组织数据权限
                                </span>
                            </a-radio>
                            <a-radio value="organize-some">
                                <span class="text">
                                    指定组织数据权限
                                </span>
                            </a-radio>
                        </a-radio-group>
                    </div>

                    <OrgTreeCheckSelect v-if="formData.data_access_type === 'organize-some'" class="base-tree-select w-full mt-4" :disabled="isCheck" @updateField="(fieldData) => {
                                            formData.organize_id_str = fieldData;
                                        }" show-search v-model:value="formData.organize_id_str" :organization="formData.organize_id_str"  placement="topRight"
                                        placeholder="请搜索并选择" />
                </div>
            </div>
        </div>

        <template #footer>
            <div v-if="!isCheck" class="flex items-center justify-end gap-3">
                <a-button class="text-xs h-8 rounded-3" @click="$emit('update:open', false)">取消</a-button>
                <a-button :disabled="isCheck || !formData.role_name || !formData.functional_permissions.length"
                          @click="handleSave" class="text-sm h-8 rounded-3 bg-primary text-white">保存</a-button>
            </div>
        </template>
    </a-drawer>
</template>

<script setup>
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import { createRoleApi, getRoleInfoApi, updateRoleApi } from '@/api/user';
import ToogleModule from './ToogleModule.vue';
import ToggleFunc from './ToggleFunc.vue';

const { roleDataId, isCheck } = defineProps({
    isCheck: {
        type: Boolean,
        default: false,
    },
    roleDataId: {
        type: String,
        default: undefined,
    },
});

const emit = defineEmits(['update:open', 'refresh']);

const modulesData = ref([]); // 功能权限
const functionModules = ref([]); // 功能模块访问权限
const formData = ref({
    role_name: undefined,
    description: undefined,
    functional_permissions: [],
    exist_open_api: [],
    data_access_type: '',
    organize_id_str: [],
    // UI 控制
    allDataCheck: true,
    otherDataCheck: false,
});

// 额外可访问数据权限
const changeOtherDataCheck = () => {
    if (!formData.value.otherDataCheck) {
        formData.value.data_access_type = '';
        formData.value.organize_id_str = [];
    } else {
        formData.value.data_access_type = 'organize-all';
    }
};

// 角色数据
const getRoleInfo = async () => {
    if (!roleDataId) {
        return;
    }
    try {
        const { data } = await getRoleInfoApi(roleDataId);
        formData.value = {
            ...formData.value,
            ...data.data,
            otherDataCheck: Boolean(data.data.data_access_type),
            exist_open_api: data.data.exist_open_api ? ['openApiAccess'] : [],
            organize_id_str: data.data.organize_list?.map((item) => ({ value: item.organize_id, label: item.organize_name })),
        };
        modulesData.value = data.data.exist_open_api ? ['openApiAccess'] : [];
        functionModules.value = data.data.functional_permissions;
    } catch (error) {
        console.error('查询角色失败:', error);
    }
};
getRoleInfo();

const handleSave = async () => {
    const saveData = {
        role_name: formData.value.role_name,
        description: formData.value.description,
        functional_permissions: formData.value.functional_permissions,
        data_access_type: formData.value.data_access_type,
        exist_open_api: formData.value.exist_open_api?.includes('openApiAccess'),
        organize_id_str: formData.value.organize_id_str?.map((item) => item.value),
        role_id: roleDataId,
    };
    try {
        if (roleDataId) {
            await updateRoleApi(saveData);
        } else {
            await createRoleApi(saveData);
        }
        message.success('保存成功');
        emit('update:open', false);
        emit('refresh');
        formData.value = {
            role_name: undefined,
            description: undefined,
            functional_permissions: [],
            exist_open_api: [],
            data_access_type: '',
            organize_id_str: [],
            // UI 控制
            allDataCheck: true,
            otherDataCheck: false,
        };
        modulesData.value = [];
        functionModules.value = [];
    } catch (error) {
        console.error('保存角色失败:', error);
    }
};
</script>

<style lang="less">
.role-drawer {
    .ant-drawer-footer {
        padding: 24px;
    }

}
.role_disabled_checked.ant-checkbox-wrapper-disabled .role_text {
    color: #3c3c3c !important;
}

.role_radio_disabled .ant-radio-wrapper .text {
    color: #3c3c3c;
}
</style>
