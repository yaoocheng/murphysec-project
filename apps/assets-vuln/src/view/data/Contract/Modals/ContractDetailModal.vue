<template>
    <a-modal class="invite-collaboration-modal" title="合同识别详情" :open="open" centered @cancel="emits('update:open', false)" :footer="null" :width="840" :destroyOnClose="true">
        <div class="flex flex-col gap-6">

            <!-- 软件成分列表 -->
            <a-table v-if="contractDetail.associated_component" class="contract-component-table" :columns="componentColumns" :data-source="[contractDetail.associated_component]" :pagination="false">
                <template #emptyText>
                    <Empty />
                </template>
                <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex === 'operation'">
                        <div class="flex gap-2 w-full items-center justify-center">
                            <div @click="handleDetail(record)" class="text-button-blue">详情</div>
                            <div @click="handleInvite(record)" class="text-button-blue">邀请协作</div>
                        </div>
                    </template>
                </template>

            </a-table>

            <!-- 锚点导航 -->
            <a-anchor :target-offset="100" direction="horizontal">
                <a-anchor-link href="#basic" title="基本信息" />
                <a-anchor-link href="#purchase" title="采购与供应商信息" />
            </a-anchor>

            <!-- 基本信息 -->
            <div id="basic" class=" flex flex-col gap-3">
                <span class="text-[15px] font-semibold text-gary-700 leading-[1.5em]">
                    基本信息
                </span>
                <div class="bg-[#F2F2F280] grid grid-cols-2 gap-4 p-6">
                    <div class="">
                        <div class="info-label">合同文件名称</div>
                        <div class="flex gap-1 items-center">
                            <span>{{ contractDetail.contract?.filename }}</span>
                            <div v-if="contractDetail.contract?.filename" @click="getContractIdentify('componentContractBasisFor')" class="text-button-blue">查看合同</div>
                        </div>
                    </div>
                    <div class="">
                        <div class="info-label">软件成分名称</div>
                        <div class="flex gap-1 items-center">
                            <span>{{ contractDetail.contract?.component_name || '-' }}</span>
                            <div v-if="contractDetail.contract?.component_name" @click="getContractIdentify('softwareCostNameBasisFor')" class="text-button-blue">识别依据</div>
                        </div>
                    </div>
                    <div class="">
                        <div class="info-label">版本</div>
                        <div class="flex gap-1 items-center">
                            <span>{{ contractDetail?.contract?.component_version || '-' }}</span>
                            <div v-if="contractDetail.contract?.component_version" @click="getContractIdentify('componentVersionBasisFor')" class="text-button-blue">识别依据</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 采购与供应商信息 -->
            <div id="purchase" class="flex flex-col gap-3">
                <span class="text-[15px] font-semibold text-gary-700 leading-[1.5em]">
                    采购与供应商信息
                </span>
                <div class="bg-[#F2F2F280] grid grid-cols-2 gap-4 p-6">
                    <div class="">
                        <div class="info-label">合同编号</div>
                        <div class="flex gap-1 items-center">
                            <span>{{ contractDetail?.llm_resp?.采购合同信息?.合同编号?.value || '-' }}</span>
                            <div v-if="contractDetail.llm_resp?.采购合同信息?.合同编号?.value" @click="getContractIdentify('contractNumberBasisFor')" class="text-button-blue">识别依据</div>
                        </div>
                    </div>
                    <div class="">
                        <div class="info-label">负责人</div>
                        <div class="flex gap-1 items-center">
                            <div class="flex items-center gap-2">
                                <span>{{ contractDetail?.llm_resp?.甲方联系人?.联系人?.value || '-' }}</span>
                            </div>
                            <div v-if="contractDetail.contract?.component_contract_id" @click="getContractIdentify('attributeOwnerBasisFor')" class="text-button-blue">识别依据</div>
                        </div>
                    </div>
                    <div class="">
                        <div class="info-label">供应商名称</div>
                        <div class="flex gap-1 items-center">
                            <div class="flex items-center gap-2">
                                <span>{{ contractDetail?.contract?.vendor_name || '-' }}</span>
                            </div>
                            <div v-if="contractDetail.contract?.vendor_name" @click="getContractIdentify('attributeSupplierNameBasisFor')" class="text-button-blue">识别依据</div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </a-modal>

    <!-- PDF 预览弹窗 -->
    <a-modal v-model:open="pdfPreviewVisible" title="PDF预览" :width="800" :footer="null" @cancel="handlePdfPreviewClose" class="pdf-preview-modal">
        <div class="pdf-preview-container">
            <a-spin :spinning="pdfLoading" tip="PDF加载中...">
                <vue-pdf-embed v-if="pdfSource" :source="pdfSource" @rendered="handlePdfRendered" @error="handlePdfError" />
            </a-spin>
        </div>
    </a-modal>

    <InviteCollaborationModal v-model:open="openInviteCollaborationModal" v-if="openInviteCollaborationModal" :component_id="contractDetail.contract.component_contract_id"/>
</template>

<script setup>
import { onMounted, ref, h } from 'vue';
import { Modal } from 'ant-design-vue';
import VuePdfEmbed from 'vue-pdf-embed';
import { getSoftwareComponentContractDetailApi, getSoftwareComponentContractIdentifyApi } from '@/api/software';
import router from '@/router';
import { findSoftwareComponentCategoryLabel } from '@/constants/softwareComponent';
import InviteCollaborationModal from './InviteCollaborationModal.vue';

const emits = defineEmits(['update:open']);

const { contractId, open } = defineProps(['contractId', 'open']);

const contractDetail = ref({});

const pdfPreviewVisible = ref(false);
const pdfSource = ref(null);
const pdfLoading = ref(false);

const openInviteCollaborationModal = ref(false);

const getContractDetail = async () => {
    const res = await getSoftwareComponentContractDetailApi(contractId);
    contractDetail.value = res.data.data;
    console.log(contractDetail.value);
};

onMounted(async () => {
    await getContractDetail();
});

// 获取合同识别依据
const getContractIdentify = async (type) => {
    if (type === 'componentContractBasisFor') {
        // 立即显示弹窗和加载状态
        pdfPreviewVisible.value = true;
        pdfLoading.value = true;

        try {
            const res = await getSoftwareComponentContractIdentifyApi({
                contract_id: contractId,
                type,
            });

            // PDF 预览
            const blob = new Blob([res.data], { type: 'application/pdf' });
            pdfSource.value = URL.createObjectURL(blob);
        } catch (error) {
            console.error('加载PDF失败:', error);
            Modal.error({
                title: '提示',
                content: '加载PDF文件失败，请稍后重试',
            });
            pdfPreviewVisible.value = false;
        }
    } else {
        try {
            // PNG 图片展示
            const res = await getSoftwareComponentContractIdentifyApi({
                contract_id: contractId,
                type,
            });

            const blob = new Blob([res.data], { type: 'image/png' });
            const imageUrl = URL.createObjectURL(blob);

            // 创建图片预览弹窗
            Modal.info({
                title: '识别依据',
                width: 800,
                okText: '关闭',
                class: 'image-preview-modal',
                content: h('div', {
                    style: {
                        textAlign: 'center',
                        maxHeight: 'calc(90vh - 120px)',
                        overflow: 'auto',
                        padding: '12px',
                    },
                }, [
                    h('img', {
                        src: imageUrl,
                        style: {
                            maxWidth: '100%',
                            height: 'auto',
                            display: 'block',
                            margin: '0 auto',
                        },
                    }),
                ]),
                onOk() {
                    URL.revokeObjectURL(imageUrl);
                },
                onCancel() {
                    URL.revokeObjectURL(imageUrl);
                },
            });
        } catch (error) {
            console.error('加载图片失败:', error);
            Modal.error({
                title: '提示',
                content: '加载图片失败，请稍后重试',
            });
        }
    }
};

// PDF 渲染完成的回调
const handlePdfRendered = () => {
    pdfLoading.value = false;
};

// PDF 加载出错的回调
const handlePdfError = () => {
    pdfLoading.value = false;
    Modal.error({
        title: '提示',
        content: 'PDF文件加载失败，请稍后重试',
    });
    pdfPreviewVisible.value = false;
};

const handlePdfPreviewClose = () => {
    if (pdfSource.value) {
        URL.revokeObjectURL(pdfSource.value);
        pdfSource.value = null;
    }
    pdfLoading.value = false;
    pdfPreviewVisible.value = false;
};

// 软件成分列表表格列定义
const componentColumns = [
    {
        title: '软件成分名称',
        dataIndex: 'component_name',
        customRender({ text }) { return text || '-'; },
    },
    {
        title: '软件成分版本',
        dataIndex: 'component_version',
        width: 178,
        customRender({ text }) { return text || '-'; },
    },
    {
        title: '软件成分类型',
        dataIndex: 'asset_type',
        width: 178,
        customRender({ text }) { return findSoftwareComponentCategoryLabel(text) || '-'; },
    },
    {
        title: '操作',
        dataIndex: 'operation',
        width: 170,
    },
];

const handleDetail = (record) => {
    router.push(`/software-component/detail/${record.component_id}`);
    emits('update:open', false);
};

const handleInvite = (record) => {
    console.log(record);
    openInviteCollaborationModal.value = true;
};
</script>

<style>

/* 合同识别详情表格 */
.contract-component-table {
    .ant-table-thead {
        .ant-table-cell {
            background-color: #E5EAFF;
            color: #0025CC;
            font-size: 14px;
            font-weight: 500;
            line-height: 18px;
            letter-spacing: 0px;
            padding: 0 16px;
            height: 36px !important;
        }
    }

    .ant-table-tbody{
        .ant-table-cell {
            height: 40px !important;
            padding: 0 16px;
            font-size: 14px;
            font-weight: 400;
            line-height: 22px;
            letter-spacing: 0px;
        }
    }
}

.info-label {
    color: #999999;
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 12px;
    line-height: 20px;
    letter-spacing: 0px;
}

/* PDF 预览样式 */
.pdf-preview-modal {
    .ant-modal-content {
        padding: 24px;
    }

    .ant-modal-body {
        padding: 0;
        margin-top: 24px;
        text-align: center;
    }

    .ant-spin {
        max-height: inherit;
    }

    .ant-spin-container {
        max-height: inherit;
    }
}

.pdf-preview-container {
    max-height: calc(90vh - 110px);
    overflow: auto;
    background: #ffffff;

    &::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }

    &::-webkit-scrollbar-thumb {
        background: #d9d9d9;
        border-radius: 4px;
    }

    &::-webkit-scrollbar-track {
        background: #f0f0f0;
    }

    .vue-pdf-embed {
        margin: 0 auto;
        max-width: 100%;
    }
}

/* 图片预览弹窗样式 */
:deep(.image-preview-modal) {
    .ant-modal-content {
        padding: 24px;
    }

    .ant-modal-body {
        padding: 0;
        margin-top: 24px;

        /* 自定义滚动条样式 */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }

        ::-webkit-scrollbar-thumb {
            background: #d9d9d9;
            border-radius: 4px;
        }

        ::-webkit-scrollbar-track {
            background: #f0f0f0;
        }
    }
}

</style>
