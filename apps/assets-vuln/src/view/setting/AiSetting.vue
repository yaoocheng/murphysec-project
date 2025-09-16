<template>
    <div class="w-full h-[calc(100%-56px)] p-6 box-border overflow-auto">
        <div v-if="modelList.length !== 0" class="grid grid-cols-3 gap-4">
            <div class="flex justify-between items-center col-span-3">
                <div class=" text-sm font-medium text-gary-700">适用于兼容 OpenAI API 的模型供应商</div>
                <a-button class="base-button" type="primary" @click="addModel">添加模型</a-button>
            </div>
            <div v-for="item in modelList" :key="item.name" class="bg-[#F2F2F2]/20 border-solid border border-[#E6E6E6]/60 rounded py-3 px-4">
                <div class="flex flex-col gap-2">
                    <div class="flex justify-between items-center">
                        <div class="flex flex-1 w-0 items-center gap-2">
                            <a-switch
                                :checked="item.enabled"
                                :loading="item.loading"
                                @change="(checked) => handleSwitchChange(checked, item)"
                                class="bg-[#D1D1D1] base-switch"
                                size="small"
                            />
                            <a-tooltip overlayClassName="ai-setting-tooltip" v-if="isTextOverflow(item.name)" arrowPointAtCenter>
                                <template #title>{{ item.name }}</template>
                                <span class="text-sm font-medium text-[#3C3C3C] flex-1 ellipsis">{{ item.name }}</span>
                            </a-tooltip>
                            <span v-else class="text-sm font-medium text-[#3C3C3C] ellipsis max-w-[300px]">{{ item.name }}</span>
                        </div>

                        <a-popover :overlayStyle="{ zIndex: 500 }"
                                   :overlayInnerStyle="{ padding: '6px 0px', width: '142px' }" placement="bottomLeft" :arrow="false">
                            <template #content>
                                <div class="cursor-pointer">
                                    <div @click='editModel(item)' class="table-operation-item px-6 py-2">
                                        <span>编辑</span>
                                    </div>

                                    <div @click='handledelete(item.id)' class="table-operation-item text-error px-6 py-2">删除</div>
                                </div>
                            </template>
                            <span class="icon-hover hover:bg-f2 cursor-pointer">
                                <EllipsisOutlined class="text-3c text-base" />
                            </span>
                        </a-popover>
                    </div>

                    <div class="text-xs text-[#3C3C3C]">
                        <div class="multi-ellipsis">API endpoint URL：
                            <a-tooltip overlayClassName="ai-setting-tooltip" v-if="isTextOverflow(item.api_url, 69)" arrowPointAtCenter>
                                <template #title>{{ item.api_url }}</template>
                                <span>{{ item.api_url }}</span>
                            </a-tooltip>
                            <span v-else class="text-sm font-medium text-[#3C3C3C]">{{ item.api_url }}</span>
                        </div>
                        <!-- <div>API Key：{{ item.api_secret }}</div> -->
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="flex flex-col justify-center items-center h-full">

            <a-empty class="mt-[25px] mb-2 text-[#2A2B32] " :image="simpleImage" >
                <template #description>
                    <span class="font-normal text-base text-[#2A2B32] mt-1">
                        暂无AI模型配置
                    </span>
                    <br/>
                    <span class="text-sm text-gary-400 font-normal mt-4">配置后可通过模型识别合同</span>
                </template>
            </a-empty>

            <a-button class="base-button" type="primary" @click="addModel">添加模型</a-button>
        </div>

        <AiConfigModal v-model:config="aiConfig"  ref="aiConfigModal" v-if="openAiConfigModal" v-model:open="openAiConfigModal" @updateList="getModelList" />
    </div>
</template>

<script setup>
import { ref, onMounted, h } from 'vue';
import { message, Empty, Modal } from 'ant-design-vue';
import { getAiModelListApi, deleteAiModelApi, updateAiModelApi } from 'api/setting';
import AiConfigModal from './AiConfigModal.vue';
import warningIcon from '/src/assets/svg/data/icon_warning_colorful-dm.svg';

const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
const aiConfig = ref(null);

// const openAddAiConfigModal = ref(false);
const openAiConfigModal = ref(false);
const modelList = ref([]);

const isTextOverflow = (text, maxLength = 37) => text.length > maxLength;

// 获取模型列表
const getModelList = async () => {
    try {
        const res = await getAiModelListApi();
        modelList.value = res.data.data.map((item) => ({ ...item, loading: false }));
    } catch (error) {
        message.error('获取模型列表失败');
    }
};

// 删除
const handledelete = (modelId) => {
    Modal.confirm({
        class: 'delete-confirm-modal',
        title: '确认删除此数据吗？',
        icon: h('span', { role: 'img', 'aria-label': 'exclamation-circle', class: 'anticon anticon-exclamation-circle' }, [
            h('img', { src: warningIcon, alt: '信息图标' }),
        ]),
        content: '模型删除后，合同录入功能将不可用，请谨慎操作！',
        async onOk() {
            try {
                await deleteAiModelApi(modelId);
            } catch {
                return console.log('Oops errors!');
            } finally {
                await getModelList();
            }
        },
        onCancel() { },
    });
};

// 更新模型状态
// const updateModelStatus = async (modelId, enabled) => {
//     try {
//         console.log(modelId, enabled);
//         const res = await updateAiModelApi({
//             id: modelId,
//             enabled,
//         });
//         return res.data.success;
//     } catch (error) {
//         message.error('更新模型状态失败');
//         return false;
//     }
// };

// 编辑模型
const editModel = (item) => {
    aiConfig.value = item;
    openAiConfigModal.value = true;
};

// 添加模型
const addModel = () => {
    aiConfig.value = null;
    openAiConfigModal.value = true;
};

// 处理开关切换
const handleSwitchChange = async (checked, currentModel) => {
    console.log(checked, currentModel);
    if (checked === false) {
        try {
            const res = await updateAiModelApi({
                id: currentModel.id,
                enabled: false,
            });
            if (res.data.code === 200) {
                await getModelList();
            }
        } catch (error) {
            message.error('禁用模型失败');
        }
    } else {
        const enabledModel = modelList.value.find((item) => item.enabled && item !== currentModel);
        if (enabledModel) {
            const res = await updateAiModelApi({
                id: enabledModel.id,
                enabled: false,
            });
            if (res.data.code === 200) {
                try {
                    const currentRes = await updateAiModelApi({
                        id: currentModel.id,
                        enabled: true,
                    });
                    if (currentRes.data.code === 200) {
                        await getModelList();
                    }
                } catch (error) {
                    message.error('启用模型失败');
                }
            }
        } else {
            try {
                const res = await updateAiModelApi({
                    id: currentModel.id,
                    enabled: true,
                });
                if (res.data.code === 200) {
                    await getModelList();
                }
            } catch (error) {
                message.error('启用模型失败');
            }
        }
    }
};

onMounted(async () => {
    await getModelList();
});
</script>

<style>

.ai-setting-tooltip {
    .ant-tooltip-inner {
        width: 400px !important;
    }
}

.ai-setting-popover {
    .ant-popover-inner{
        padding:8px 0;
    }

    .button {
        padding: 9px 24px;
        width: 140px;
        height: 40px;
        font-size: 14px;
        font-weight: 400;

        &:hover {
            background-color: #F2F2F2;
            cursor: pointer;
        }

        &.delete {
            color: #FF4D4F;
        }

        &.edit {
            color: #3C3C3C;
        }

    }
}

.multi-ellipsis {
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 限制为2行 */
  line-clamp: 2;          /* 标准属性，增强兼容性 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
}

.name-ellipsis {
  flex: 1;
  margin-right: 8px;
  min-width: 0; /* 防止溢出 */
  /* 省略号样式可保留 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

</style>
