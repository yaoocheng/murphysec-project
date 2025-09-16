<template>
    <div class="main-content">
        <div class="select-content py-2 mb-2 bg-white px-6 flex justify-between items-center">
            <div class="flex items-center gap-2">
                <Input class="base-input" v-model:value="filters.keyword" placeholder="搜索合同文件 /软件成分名称" />

                <Select :popupClassName="'base-select-dropdown'" class="base-select" v-model:value="filters.status" :options="COMPONENT_CONTRACT_OCR_STATUS" placeholder="识别状态" />

            </div>

            <a-button @click="openUploadContractModal = true" class="text-center base-button" type="primary">上传合同</a-button>
        </div>

        <div class="px-[24px] py-[16px] bg-white overflow-y-auto">
            <a-table class="base-table" :pagination="false" :ellipsis="true" :loading="{ indicator, spinning: loading }" :columns="columns"
                     :scroll="{ x: '100%' }" :data-source="listData">
                <template #emptyText>
                    <Empty />
                </template>
                <template #bodyCell="{ column, text, record }">

                    <template v-if="column.dataIndex === 'component_name'">
                        <a-tooltip arrowPointAtCenter>
                            <template #title>{{ text }}</template>
                            <span v-if="column.dataIndex === 'component_name'" @click="handleOpenContractDetailModal(record)" class="ellipsis hover">{{ text }}</span>
                            <span v-else>{{ text }}</span>
                        </a-tooltip>
                    </template>

                    <template v-if="contract_keys.includes(column.dataIndex)">

                        <span v-if="column.dataIndex === 'filename'">
                            <a-tooltip v-if="record.contract[column.dataIndex].length > 40" arrowPointAtCenter>
                                <template #title>{{ record.contract[column.dataIndex] || '-' }}</template>
                                <span @click="handleOpenContractDetailModal(record)" class="ellipsis hover">{{ record.contract[column.dataIndex] || '-' }}</span>
                            </a-tooltip>
                            <span @click="handleOpenContractDetailModal(record)" class="hover" v-else>{{ record.contract[column.dataIndex] || '-' }}</span>
                        </span>

                        <span v-else-if="column.dataIndex === 'ocr_status'">
                            {{ findComponentContractOcrStatusLabel(record.contract[column.dataIndex]) }}
                        </span>

                        <span v-else class="ellipsis">{{ record.contract[column.dataIndex] || '-' }}</span>
                    </template>

                    <template v-if="column.dataIndex === 'operate'">
                        <div class="flex items-center justify-left gap-2">
                            <a-tooltip v-if="record.contract.is_bound || record.contract.ocr_status !== 'completed'" placement="top">
                                <template #title>
                                    <div>
                                        {{ record.contract.ocr_status !== 'completed' ? '合同识别未完成/已失败，无法编辑' : '合同已绑定软件成分，无法编辑' }}
                                    </div>
                                </template>
                                <div class="px-1 py-0.5 text-gary-200">
                                    <span>编辑</span>
                                </div>
                            </a-tooltip>
                            <div v-else class="text-button-blue" @click="editContract(record)">
                                编辑
                            </div>

                            <a-popconfirm
                                overlayClassName="popconfirm-delete"
                                title="确定删除该合同吗？"
                                ok-text="确定"
                                cancel-text="取消"
                                @confirm="deleteContract(record)"
                            >
                                <div class="text-button-red">
                                    删除
                                </div>
                            </a-popconfirm>
                        </div>

                    </template>

                </template>

            </a-table>

            <div class="flex justify-end mt-4">
                <a-pagination class="pagination" :show-total="total => `共 ${total.toLocaleString()} 条`"
                              show-quick-jumper :total=pageConfig.total  @change="changePageHandle"
                              v-model:current="pageConfig.current" v-model:pageSize="filters.limit" />
            </div>
        </div>

        <UploadContractModal :open="openUploadContractModal" v-if="openUploadContractModal" @update:open="openUploadContractModal = false" @updateList="getData" />

        <ContractDetailModal :contractId="contractId" :open="openContractDetailModal" @update:open="openContractDetailModal = false" v-if="openContractDetailModal" />

        <EditIdentificationInformationModal :contractData="contractData" :open="openEditIdentificationInformationModal" :contractId="contractId"
                                            v-if="openEditIdentificationInformationModal" @update:open="openEditIdentificationInformationModal = false" />
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { getSoftwareComponentContractListApi, deleteSoftwareComponentContractApi } from 'api/software';
import { message } from 'ant-design-vue';
import ContractDetailModal from './Modals/ContractDetailModal.vue';
import EditIdentificationInformationModal from './Modals/EditIdentificationInformationModal.vue';
import UploadContractModal from './Modals/UploadContractModal.vue';
import { formatDate } from '@/utils';
import { COMPONENT_CONTRACT_OCR_STATUS, findComponentContractOcrStatusLabel } from '../constants/contract';
import { usePageList } from '@/hooks';

const openContractDetailModal = ref(false);
const openEditIdentificationInformationModal = ref(false);
const contractId = ref(null);
const filters = reactive({
    limit: 15,
    keyword: '',
    status: null,
    ecosystem: null, // 生态
    warehouse: null, // 仓库
});

const contractData = ref(null);

const {
    changePageHandle, pageConfig, listData, loading, getData, indicator,
} = usePageList(getSoftwareComponentContractListApi, filters);

const openUploadContractModal = ref(false);

const contract_keys = ref([
    'filename',
    'component_contract_id',
    'component_name',
    'component_version',
    'vendor_name',
    'department',
    'human',
    'ocr_status',
]);

const columns = ref([
    {
        title: '合同文件名称',
        dataIndex: 'filename',
        // width: 380,
        flex: 'left',
        // customRender({ text }) { return text || '-'; },
    },
    // {
    //     title: '合同编号',
    //     dataIndex: 'component_contract_id',
    //     width: 178,
    //     // customRender({ text }) { return text || '-'; },
    // },
    // {
    //     title: '软件成分名称',
    //     dataIndex: 'component_name',
    //     width: 280,
    //     // customRender({ text }) { return text || '-'; },
    // },
    // {
    //     title: '版本',
    //     dataIndex: 'component_version',
    //     width: 178,
    //     // customRender({ text }) { return text || '-'; },
    // },
    // {
    //     title: '供应商名称',
    //     dataIndex: 'vendor_name',
    //     width: 178,
    //     customRender({ text }) { return text || '-'; },
    // },
    // {
    //     title: '负责部门',
    //     dataIndex: 'department',
    //     width: 178,
    //     customRender({ text }) { return text || '-'; },
    // },
    // {
    //     title: '负责人',
    //     dataIndex: 'human',
    //     width: 178,
    //     customRender({ text }) { return text || '-'; },
    // },
    {
        title: '识别状态',
        dataIndex: 'ocr_status',
        width: 178,
        customRender({ text }) { return text || '-'; },
    },
    {
        title: '创建时间',
        dataIndex: 'created_at',
        width: 178,
        customRender({ record }) { return formatDate(record.contract.created_at) || '-'; },
    },
    {
        title: '更新时间',
        dataIndex: 'updated_at',
        width: 178,
        customRender({ record }) { return formatDate(record.contract.updated_at) || '-'; },
    },
    {
        title: '操作',
        dataIndex: 'operate',
        width: 118,
        align: 'left',
        fixed: 'right',
    },
]);

// 删除合同
const deleteContract = async (record) => {
    await deleteSoftwareComponentContractApi(record.contract.component_contract_id);
    await getData();
};

// 编辑合同
const editContract = (record) => {
    console.log(record);
    if (record.contract.ocr_status !== 'completed') {
        message.warning('合同未识别完成，无法编辑');
        return;
    }

    contractData.value = record;
    contractId.value = record.contract.component_contract_id;
    openEditIdentificationInformationModal.value = true;
};

// 打开合同详情
const handleOpenContractDetailModal = (record) => {
    if (record.contract.ocr_status !== 'completed') {
        message.warning('合同识别未完成/已失败，无法查看详情');
        return;
    }

    openContractDetailModal.value = true;
    contractId.value = record.contract.component_contract_id;
};

</script>
