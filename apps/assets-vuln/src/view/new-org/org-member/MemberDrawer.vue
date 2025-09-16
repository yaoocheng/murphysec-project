<template>
    <a-drawer :headerStyle="{ display: 'none' }" placement="right"
              @close="$emit('update:open', false)" size="large"
              :root-style="{
                  'z-index': '1001'
              }" root-class-name="root-class-name" :maskClosable="false">
        <div class="flex items-center justify-between mb-6">
            <div class="text-3c font-medium text-base">
                {{ memberDrawerData.organize_user_id ? '编辑' : '新增' }}成员
            </div>
            <div class="flex items-center gap-1">
                <span @click="$emit('update:open', false)" class="text-button-gray w-6 h-6">
                    <Svg  name="drawer_close" class="cursor-pointer"
                          color="#999999"></Svg>
                </span>
            </div>
        </div>

        <div class="mb-6">
            <div class="flex items-center justify-between mb-2">
                <span class="text-[#3C3C3C] text-xs font-medium">姓名 <span class="text-red-500">*</span></span>
            </div>
            <a-input v-model:value.trim="formData.name" class="w-full" :maxlength="30" show-count
                     placeholder="请输入" />
        </div>

        <div class="mb-6">
            <div class="flex items-center justify-between mb-2">
                <span class="text-[#3C3C3C] text-xs font-medium">邮箱 <span class="text-red-500">*</span></span>
            </div>
            <a-input :disabled="memberDrawerData.organize_user_id!==undefined" v-model:value.trim="formData.email" class="w-full"
                     placeholder="请输入" />
            <div v-if="formData.email && !isEmailValid" class="text-red-500 text-xs mt-1" style="font-size: 12px;">
                请输入正确的邮箱格式
            </div>
        </div>

        <div class="mb-6">
            <div class="flex items-center justify-between mb-2">
                <span class="text-[#3C3C3C] text-xs font-medium">所属组织 <span class="text-red-500">*</span></span>
            </div>

            <OrgTreeCheckSelect class="base-tree-select w-full" @updateField="(fieldData) => {
                formData.organize_ids = fieldData;
            }" show-search v-model:value="formData.organize_ids" :organization="formData.organize_ids" placeholder="请搜索并选择"
            />
        </div>

        <div class="mb-6">
            <div class="flex items-center justify-between mb-2">
                <span class="text-[#3C3C3C] text-xs font-medium">用户名 <span class="text-red-500">*</span></span>
            </div>
            <a-input v-model:value.trim="formData.username" class="w-full" :maxlength="30" show-count
                     placeholder="请输入" />
        </div>

        <div class="mb-6">
            <div class="flex items-center justify-between mb-2">
                <span class="text-[#3C3C3C] text-xs font-medium">密码</span>
            </div>
            <a-input class="w-full" disabled placeholder="注册邮箱" />
        </div>

        <template #footer>
            <div class="flex items-center justify-end gap-3">
                <a-button class="text-xs h-8 rounded-3" @click="$emit('update:open', false)">取消</a-button>
                <a-button :disabled="!formData.name || !formData.email || !formData.username || !formData.organize_ids?.length || !isEmailValid" class="text-sm h-8 rounded-3 bg-primary text-white" @click="handleSave">保存</a-button>
            </div>
        </template>
    </a-drawer>
</template>

<script setup>
import { ref, computed } from 'vue';
import { message } from 'ant-design-vue';
import { createOrgUserApi, editUserApi } from '@/api/org';

const { memberDrawerData } = defineProps({
    memberDrawerData: {
        type: Object,
        default: () => ({}),
    },
});
const emit = defineEmits(['update:open', 'updateData']);

const formData = ref({
    name: memberDrawerData.name || '',
    email: memberDrawerData.email || '',
    organize_ids: memberDrawerData.organize_ids || [],
    username: memberDrawerData.username || '',
    id: memberDrawerData.organize_user_id || undefined,
});

// 邮箱格式验证
const isEmailValid = computed(() => {
    if (!formData.value.email) return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(formData.value.email);
});

const handleSave = async () => {
    const organize_ids = formData.value.organize_ids.map((item) => item.value);
    if (formData.value.id) {
        try {
            await editUserApi({
                ...formData.value,
                organize_ids,
            });
            message.success('保存成功');
            emit('updateData');
            emit('update:open', false);
        } catch (error) {
            console.error(error);
        }
    } else {
        try {
            await createOrgUserApi({
                ...formData.value,
                organize_ids,
            });
            message.success('保存成功');
            emit('updateData');
            emit('update:open', false);
        } catch (error) {
            console.error(error);
        }
    }
};
</script>

<style lang="less">
.root-class-name {
    .ant-drawer-content-wrapper {
        width: 610px !important;
    }

    .ant-drawer-footer {
        padding: 24px;
    }
}
</style>
