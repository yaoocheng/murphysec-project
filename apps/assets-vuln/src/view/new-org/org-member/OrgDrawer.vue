<template>
    <a-drawer :headerStyle="{ display: 'none' }" placement="right"
              @close="$emit('update:open', false)" size="large" :root-style="{
                  'z-index': '1001'
              }" root-class-name="root-class-name" :maskClosable="false">
        <div class="flex items-center justify-between mb-6">
            <div class="text-3c font-medium text-base">
                {{orgData.organize_id ? '编辑组织' : '新增组织'}}
            </div>
            <div class="flex items-center gap-1">
                <span @click="$emit('update:open', false)" class="text-button-gray w-6 h-6">
                    <Svg name="drawer_close" class="cursor-pointer"
                         color="#999999"></Svg>
                </span>
            </div>
        </div>

        <div class="mb-6">
            <div class="flex items-center justify-between mb-2">
                <span class="text-[#3C3C3C] text-xs font-medium">组织名称 <span class="text-red-500">*</span></span>
            </div>
            <a-input v-model:value.trim="formData.organize_name" class="w-full" :maxlength="100" show-count
                     placeholder="请输入" />
        </div>

        <div class="mb-6">
            <div class="flex items-center justify-between mb-2">
                <span class="text-[#3C3C3C] text-xs font-medium">上级组织</span>
            </div>
            <OrgTreeSelect class="base-tree-select w-full" allowClear :isDisabledLowerOrg="true" show-search v-model:value="formData.organize_pid" placeholder="请搜索并选择上级组织" :otherOrgId="formData.organize_id" :organizeId="formData.organize_pid"
            />
        </div>

        <div class="mb-6">
            <div class="flex items-center justify-between mb-2">
                <span class="text-[#3C3C3C] text-xs font-medium">组织负责人</span>
            </div>
            <UserSelect class="user-select w-full select-dom" allowClear
                        :popupClassName="'user-select-dropdown'"
                        v-model:value="formData.organize_leader" placeholder="请搜索并选择组织负责人"
                        :showSearch="true"
                        :userid="formData.organize_leader" />
        </div>

        <template #footer>
            <div class="flex items-center justify-end gap-3">
                <a-button class="text-xs h-8 rounded-3" @click="$emit('update:open', false)">取消</a-button>
                <a-button :disabled="!formData.organize_name" class="text-sm h-8 rounded-3 bg-primary text-white" @click="handleSave">保存</a-button>
            </div>
        </template>
    </a-drawer>
</template>

<script setup>
import { ref } from 'vue';
import { createOrgApi, updateCurOrgApi } from 'api/org';
import { message } from 'ant-design-vue';
import { emitter } from '@/utils';

const { orgData } = defineProps({
    orgData: {
        type: Object,
        default: () => ({}),
    },
});

const emit = defineEmits(['update:open', 'updateTree']);

const formData = ref({
    organize_name: orgData.organize_name || '',
    organize_pid: (orgData.organize_pid && orgData.organize_pid !== '0') ? orgData.organize_pid : undefined,
    organize_leader: orgData.organize_leader && orgData.organize_leader !== '0' ? orgData.organize_leader : undefined,
    organize_id: orgData.organize_id || undefined,
    source: 'hand',
});

const handleSave = async () => {
    if (formData.value.organize_id) {
        try {
            await updateCurOrgApi(
                {
                    ...formData.value,
                    // organize_leader: formData.value.organize_leader ? Number(formData.value.organize_leader) : undefined,
                },
            );
            message.success('更新成功');
            emit('updateTree');
            emitter.emit('updateMember');
            emitter.emit('updateGlobalOrgTree');

            emit('update:open', false);
        } catch (error) {
            console.err(error);
        }
    } else {
        try {
            await createOrgApi({
                ...formData.value,
                // organize_leader: formData.value.organize_leader ? Number(formData.value.organize_leader) : undefined,
            });
            message.success('创建成功');
            emit('updateTree');
            emitter.emit('updateMember');
            emitter.emit('updateGlobalOrgTree');

            emit('update:open', false);
        } catch (error) {
            console.err(error);
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
