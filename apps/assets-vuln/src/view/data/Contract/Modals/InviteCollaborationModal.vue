<template>
    <a-modal class="invite-collaboration-modal" title="邀请协作" :open="open" centered @cancel="emits('update:open', false)" :footer="null" :width="480" :destroyOnClose="true">
        <div class="flex flex-col gap-6">
            <div class="text-sm text-gray-400 leading-[1.7]">
                邀请相关部门负责人补充完善软件成分关键信息
            </div>

            <div class="flex flex-col gap-4">
                <div class="flex justify-between items-center">
                    <span class="text-sm font-normal text-gray-700 leading-[1.57]">获得链接的人</span>
                    <span class="text-sm  font-medium text-gray-700">可补充软件成分信息并更新至成分详情</span>
                    <!-- 这里可以根据需要添加权限选择，暂时省略 -->
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-sm font-normal text-gray-700 leading-[1.57]">链接有效期</span>
                    <span class="text-sm font-medium text-gray-700 leading-[1.57]">3天</span>
                </div>
            </div>

            <a-button class="copy-link-button base-button" type="primary" block @click="copyLinkHandle">复制链接</a-button>
        </div>
    </a-modal>
</template>

<script setup>
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import useClipboard from 'vue-clipboard3';
import { stage2CreateShareUrlApi } from '@/api/software';

const { toClipboard } = useClipboard();
const { component_id } = defineProps(['component_id']);

const emits = defineEmits(['update:open']);

// 协作链接
const collaborationLink = ref('');

const copyLinkHandle = async () => {
    try {
        // 调用 API 获取分享 ID
        const response = await stage2CreateShareUrlApi(component_id, {});
        const shareId = response.data.data?.share_id;

        // 生成完整的协作链接
        const fullLink = `${window.location.origin}/invite-collaboration/${shareId}`;
        collaborationLink.value = fullLink;

        // 复制链接到剪贴板
        await toClipboard(collaborationLink.value);
        message.success('链接已复制到剪贴板');
        emits('update:open', false);
    } catch (err) {
        console.error('Failed to copy: ', err);
        message.error('复制链接失败');
    }
};

</script>

<style>
/* 可以根据需要添加局部样式 */
.invite-collaboration-modal {
    .ant-modal-content {
        padding: 24px;
    }

    .copy-link-button {
        height: fit-content;
        padding: 9px 16px;
        border-radius: 6px;
    }
}
</style>
