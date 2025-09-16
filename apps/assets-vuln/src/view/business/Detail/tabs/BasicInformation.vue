<template>
    <div>
        <div class="base_info expanded">
            <div class="info_list">
                <div class="info_item">
                    <span class="label">安全问题 ID</span>

                    <span class="value">{{ basic_information.issue?.issue_id || '-'}}</span>
                </div>

                <div class="info_item">
                    <span class="label">负责人</span>
                    <div class="flex gap-[4px]">
                        <div v-if="basic_information.issue?.issue_owner_name">
                            <a-avatar :size="25">{{ basic_information.issue?.issue_owner_name.charAt(0) }}</a-avatar>
                            <span class="value">{{ basic_information.issue?.issue_owner_name  }}</span>
                        </div>
                        <span v-else class="value">-</span>
                    </div>
                </div>

                <div class="info_item">
                    <span class="label">处置状态</span>

                    <div class="flex gap-[4px] items-center">
                        <span class="value">
                            {{ DISPOSAL_STATUS.find(item => item.value === basic_information.issue?.issue_status )?.label || '-'}}
                        </span>
                        <a-tooltip placement="right">
                            <template #title>
                                更改处置状态
                            </template>
                            <div @click = "modelVisible = !modelVisible" class="edit-svg">
                                <Svg height="16px" width="16px" name="safe-issue-edit"></Svg>
                            </div>

                        </a-tooltip>
                    </div>

                </div>

                <div class="info_item">
                    <span class="label">创建时间</span>

                    <span class="value">{{ formatDate(basic_information.issue?.created_at) || ''}}</span>
                </div>

                <div class="info_item">
                    <span class="label">更新时间</span>

                    <span class="value">{{ formatDate(basic_information.issue?.updated_at) || '-'}}</span>
                </div>

                <div class="info_item" style="width: 100%;">
                    <span class="label">漏洞描述</span>

                    <span class="value">{{ basic_information.issue?.issue_desc || '-'}}</span>

                </div>

            </div>

        </div>

        <a-modal v-model:visible="modelVisible" title="处置状态" @ok="handleOk">
            <Select :popupClassName="'base-select-dropdown'" class="w-full" v-model:value="selectedStatus" :options="DISPOSAL_STATUS" />
        </a-modal>

    </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { DISPOSAL_STATUS } from 'view/app-manage/constats';
import { formatDate } from 'utils';
import { getSecUpdateStatusApi } from 'api/app';
import { message } from 'ant-design-vue';

const { basic_information } = defineProps(['basic_information']);
const emit = defineEmits(['update-status']);
const modelVisible = ref(false);
const selectedStatus = ref();

// 监听 basic_information 的变化
watchEffect(() => {
    if (basic_information?.issue?.issue_status !== undefined) {
        selectedStatus.value = basic_information.issue.issue_status;
    }
});

async function handleOk() {
    const response = await getSecUpdateStatusApi({ issue_id: Number(basic_information.issue?.issue_id), status: selectedStatus.value });
    if (response.status === 200) {
        message.success('更新成功');
        emit('update-status', selectedStatus.value);
    }

    modelVisible.value = false;
}

</script>

<style scoped>
.info_list{
    display: flex;
    flex-wrap: wrap;
    gap: 16px;

    .info_item {
        width: calc((100% - 48px)/4);
        min-height: 48px;
        display: flex;
        flex-direction: column;
        gap: 4px;

        .edit-svg{
            height: 24px;
            width: 24px;
            display: flex;
            padding: 4px;
            border-radius: 4px;

            &:hover{
                background-color: #e6e6e6;
            }

        }

        .label {
            font-size: 12px;
            color: #999999;
            font-weight: 400;
            line-height: 20px;
            display: flex;
            gap: 4px;
        }

        .value {
            font-size: 14px;
            color: #3C3C3C;
            font-weight: 400;
            line-height: 22px;
            padding: 1px 0px;
            gap: 10px;
            /* white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis; */
        }
    }
}
</style>
