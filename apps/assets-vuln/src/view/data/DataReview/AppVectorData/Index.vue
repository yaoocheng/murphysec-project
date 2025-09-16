<template>
    <div class="h-full flex flex-col">
        <div style="border-bottom: 8px solid #f2f2f2;" class="select-content h-fit bg-white py-[8px] px-[24px] flex flex-row justify-between gap-[8px]">
            <div class="flex items-center gap-4">
                <div class="flex items-center gap-2">
                    <Input v-model:value="filters.name" placeholder="搜索应用载体名称" class="w-[240px] base-input" />
                    <Select :popupClassName="'base-select-dropdown'" class=" base-select"
                            v-model:value="filters.carrier_type" :options="CARRIER_OPTION" placeholder="载体类型" />
                    <Select :popupClassName="'base-select-dropdown'" class=" base-select" v-model:value="filters.source"
                            :options="APP_VECTOR_SOURCE_OPTIONS" placeholder="来源" />
                    <Select :popupClassName="'base-select-dropdown'" class=" base-select"
                            v-model:value="filters.data_status" :options="DATA_STATUS_OPTIONS" placeholder="数据状态" />
                </div>
                <a-button class="base-button" @click="resetFilter(filters);emitter.emit('getdatareviewtotal')">重置</a-button>
            </div>
            <!-- <div v-if="selectedSecIssue.length > 0" @click="bulkRelease" class="text-button-blue-line">
                <span>
                    批量发布
                    {{ ' ' + selectedSecIssue.length }}
                </span>
            </div> -->
            <div>
                <a-button class="base-button mr-2" @click="emitter.emit('getdatareviewtotal');getData()">刷新列表</a-button>

                <a-popover :overlayStyle="{ zIndex: 1050 }" :overlayInnerStyle="{ padding: '6px 0px', width: '160px' }"
                           placement="bottomRight" :arrow="false">
                    <template #content>
                        <div class="cursor-pointer">
                            <div class="table-operation-item px-6 py-2 " @click="()=>selectBulkData.length > 0 && bulkRelease()"
                                 :class="selectBulkData.length > 0 ? 'text-primary' : 'text-[#00000040] cursor-not-allowed'">
                                批量发布（{{ selectBulkData.length }}）
                            </div>
                            <div class="table-operation-item px-6 py-2 " @click="()=>selectedSecIssue.length > 0 && bulkDelete()"
                                 :class="selectedSecIssue.length > 0 ? 'text-error' : 'text-[#00000040] cursor-not-allowed'">
                                批量删除（{{ selectedSecIssue.length }}）
                            </div>
                            <div @click="fullReleaseHandle" class="table-operation-item px-6 py-2 text-primary">
                                全量发布
                            </div>
                            <div @click="fullDeleteHandle" class="table-operation-item px-6 py-2 text-error">
                                全量删除
                            </div>
                        </div>
                    </template>

                    <a-button class="base-button group">
                        更多操作
                        <Svg height="12px" width="12px" class="ml-1 hidden group-hover:inline"
                             name="software_component-Group"></Svg>
                        <Svg height="12px" width="12px" class="ml-1 group-hover:hidden"
                             name="software_component-drop-black"></Svg>
                    </a-button>
                </a-popover>
            </div>

        </div>

        <div class="flex-1 px-[24px] py-[16px] gap-[24px] flex flex-col">
            <a-table :row-selection="rowSelection" class="base-table-select" :pagination="false"
                     :loading="{ indicator, spinning: loading }" :columns="columns" :scroll="{ x: '100%',y: 'calc(100vh - 320px)' }"
                     :data-source="listData" rowKey="carrier_id">
                <template #emptyText>
                    <Empty />
                </template>
                <template #headerCell="{ column }">
                    <template v-if="column.dataIndex === 'updated_at'">
                        <span class="flex items-center">
                            {{ column.title }}
                            <Svg v-if="filters.update_time_sort === 'asc'" @click="filters.update_time_sort = 'desc'" name="asc" class="ml-2 cursor-pointer" height="16px" width="16px"></Svg>
                            <Svg v-else @click="filters.update_time_sort = 'asc'" name="desc" class="ml-2 cursor-pointer" height="16px" width="16px"></Svg>                        </span>
                    </template>
                </template>
                <template #bodyCell="{ column, text, record, index }">
                    <template v-if="column.dataIndex === 'name'">
                        <a-tooltip arrowPointAtCenter>
                            <template #title>{{ record.data_status === 'imperfect' ? '数据状态为待完善，不可用于批量发布':  text }}</template>
                            <!-- <span  v-if="column.dataIndex === 'application_name'" class="ellipsis hover w-full">
                                {{ text }}
                            </span> -->
                            <span class="max-w-full truncate">
                                {{ text || '-' }}
                            </span>
                        </a-tooltip>
                    </template>

                    <template v-else-if="column.dataIndex === 'data_status'">
                        <div class="flex items-center gap-2">
                            <span class="w-1.5 h-1.5 rounded-full" :style="{
                                backgroundColor: text === 'imperfect' ? '#6C9FFF' : text === 'perfect' ? '#B273FF' : '#ccc'
                            }"></span>
                            {{ findDataStatusLabel(text) }}
                        </div>
                    </template>

                    <template v-else-if="column.dataIndex === 'created_at' || column.dataIndex === 'updated_at'">
                        {{ formatDate(text) }}
                    </template>

                    <template v-else-if="column.dataIndex === 'carrier_type'">
                        {{ findCarrierTypeLabel(text) || '-' }}
                    </template>

                    <template v-else-if="column.dataIndex === 'applications'">

                        <span v-if="!text || text.length === 0">-</span>

                        <a-tooltip arrowPointAtCenter v-else>
                            <template #title>
                                <div class="max-h-[76px] overflow-auto max-w-[400px]">
                                    {{text.map(app => app.application_name).join('、')}}
                                </div>
                            </template>
                            <span class="ellipsis font-normal">
                                {{text.map(app => app.application_name).join('、')}}
                            </span>
                        </a-tooltip>
                    </template>

                    <template v-else-if="column.type === 'person'">
                        <User v-if="text" :users="[text]" />
                        <span v-else>-</span>
                    </template>

                    <template v-else-if="column.dataIndex === 'operation'">
                        <div class="flex gap-4 items-center">
                            <span class="text-purple-500 cursor-pointer" @click="handleEdit(record, index)">编辑</span>
                            <span v-if="record.data_status === 'perfect'" class="text-purple-500 cursor-pointer"
                                  @click="handleRelease(record)">发布</span>
                            <span v-else class="text-gary-200 cursor-not-allowed">发布</span>

                            <a-popover :overlayStyle="{ zIndex: 500 }"
                                       :overlayInnerStyle="{ padding: '6px 0px', width: '142px' }" placement="bottomLeft"
                                       :arrow="false">
                                <template #content>
                                    <div class="cursor-pointer">
                                        <div @click="turnOnLog(record.carrier_id)"
                                             class="table-operation-item px-6 py-2">
                                            <span>操作日志</span>
                                        </div>

                                        <div class="table-operation-item text-error px-6 py-2"
                                             @click="handledelete(record)">
                                            <span>删除</span>
                                        </div>
                                    </div>

                                </template>
                                <span class="icon-hover w-6 h-6 hover:bg-[#E5EAFF] cursor-pointer">
                                    <EllipsisOutlined class="text-primary text-base" />
                                </span>
                            </a-popover>
                        </div>
                    </template>

                    <template v-else>
                        <a-tooltip arrowPointAtCenter>
                            <template #title>{{ text }}</template>
                            <!-- <span  v-if="column.dataIndex === 'application_name'" class="ellipsis hover w-full">
                                {{ text }}
                            </span> -->
                            <span class="max-w-full ellipsis">
                                {{ text || '-' }}
                            </span>
                        </a-tooltip>
                    </template>

                </template>

            </a-table>

            <div class="flex justify-end mt-4">
                <a-pagination class="pagination" :show-total="total => `共 ${total.toLocaleString()} 条`"
                              show-quick-jumper :total=pageConfig.total @change="changePageHandle"
                              v-model:current="pageConfig.current" v-model:pageSize="filters.limit" />
            </div>
        </div>
    </div>
    <OperationLogModal v-model:open="opetateLog" v-if="opetateLog" :logfilter="logfilter" />
    <Drawer @getData="getData();selectedSecIssue=[];selectBulkData=[]" v-model:open="opendrawer" v-if="opendrawer" :listData="listData"
            :clickindex="clickindex" />
</template>

<script setup>
import {
    ref, reactive, onBeforeMount, h, computed,
} from 'vue';
import {
    getPreparationAppCarrierListApi, delPreparationAppCarrierApi, pushPreparationAppCarrierApi, batchDelPluginApi, batchPublishPluginApi,
} from 'api/data';
import {
    indicator, formatDate, resetFilter, emitter,
} from 'utils';
import {
    findCarrierTypeLabel, getSecurityCapabilityList,
    CARRIER_OPTION,
} from 'constants/app';
import { Modal, message } from 'ant-design-vue';
import Drawer from './Drawer.vue';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';
import { DATA_STATUS_OPTIONS, APP_VECTOR_SOURCE_OPTIONS, findDataStatusLabel } from '../../constants/datareview';
import { usePageList } from '@/hooks';
import warningIcon from '/src/assets/svg/data/icon_warning_colorful-dm.svg';
import InfoIcon from '/src/assets/svg/data/icon_info_colorful.svg';

const opetateLog = ref(false);
const logfilter = ref({
    entity_type: 'Carrier',
    entity_id: null, // 这里可以根据实际情况设置
});
// 开启操作日志
const turnOnLog = (carrier_id) => {
    opetateLog.value = true;
    logfilter.value.entity_id = String(carrier_id);
};

// 初始化筛选条件，优先从URL查询参数中获取
const filters = reactive({
    limit: 15,
    name: null,
    carrier_type: null,
    source: null,
    data_status: null,
    update_time_sort: 'desc',
});
const { showDeleteConfirm } = useDeleteConfirm();

const opendrawer = ref(false);
const clickindex = ref(0);

const {
    getData, changePageHandle, pageConfig, loading, listData,
} = usePageList(getPreparationAppCarrierListApi, filters);

const selectedSecIssue = ref([]); // 选中的行数据
const selectBulkData = ref([]); // 能批量选中的数据

const selectedRowKeys = computed(() => selectedSecIssue.value.map((item) => item.carrier_id)); // 处理回显
const rowSelection = {
    selectedRowKeys,

    onSelect: (record, selected, selectedRows) => {
        if (selected) {
            selectedSecIssue.value.push(record);
            if (record.data_status === 'perfect') {
                selectBulkData.value.push(record);
            }
        } else {
            selectedSecIssue.value = selectedSecIssue.value.filter((item) => item.carrier_id !== record.carrier_id);
            selectBulkData.value = selectBulkData.value.filter((item) => item.carrier_id !== record.carrier_id);
        }

        console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows) => {
        console.log(selected, selectedRows);
        selectedRows = selectedRows.filter((item) => item);
        if (selected) {
            selectedSecIssue.value.push(...selectedRows);
            selectBulkData.value = [...selectBulkData.value, ...selectedRows.filter((item) => item.data_status === 'perfect')];
        } else {
            selectedSecIssue.value = selectedSecIssue.value.filter((item) => !listData.value.some((listItem) => listItem.carrier_id === item.carrier_id));

            const curList = listData.value.filter((item) => item.data_status === 'perfect');
            selectBulkData.value = selectBulkData.value.filter((item) => !curList.some((listItem) => listItem.carrier_id === item.carrier_id));
        }
    },

    getCheckboxProps: (record) => ({
        name: record.name,
    }),
};

// 发布
const handleRelease = (record) => {
    Modal.confirm({
        title: '确认发布此条数据吗？',
        icon: h('span', { role: 'img', 'aria-label': 'exclamation-circle', class: 'anticon anticon-exclamation-circle' }, [
            h('img', { src: InfoIcon, alt: '信息图标' }),
        ]),
        content: '发布后数据将被视为正式数据进行统计',
        async onOk() {
            try {
                await pushPreparationAppCarrierApi({
                    carrier_ids: [record.carrier_id],
                });
                getData();
            } catch {
                console.log('Oops errors!');
            } finally {
                getData();
                emitter.emit('getdatareviewtotal');
            }
        },
        onCancel() { },
    });
};

// 显示删除错误弹窗
const showDeleteErrorModal = (failedItems) => {
    const errorContent = failedItems.map((item) => `${item.name}: ${item.msg}`).join('\n');

    Modal.error({
        title: '删除失败',
        icon: h('span', { role: 'img', 'aria-label': 'exclamation-circle', class: 'anticon anticon-exclamation-circle' }, [
            h('img', { src: warningIcon, alt: '信息图标' }),
        ]),
        content: h('div', { style: { whiteSpace: 'pre-line' } }, [
            h('p', '以下载体无法删除：'),
            h('div', { style: { color: '#ff4d4f', marginTop: '8px' } }, errorContent),
        ]),
        okText: '确定',
    });
};

// 删除
const handledelete = (record) => {
    Modal.confirm({
        class: 'delete-confirm-modal',
        title: '确认删除此数据吗？',
        icon: h('span', { role: 'img', 'aria-label': 'exclamation-circle', class: 'anticon anticon-exclamation-circle' }, [
            h('img', { src: warningIcon, alt: '信息图标' }),
        ]),
        content: '数据删除后将不可恢复，请谨慎操作！',
        async onOk() {
            try {
                console.log('删除', record);
                const { data } = await delPreparationAppCarrierApi([record.carrier_id]);

                // 检查删除结果
                if (data.data.fail_count > 0) {
                    // 有删除失败的载体，显示错误弹窗
                    const failedItems = data.data.details.filter((item) => !item.success);
                    showDeleteErrorModal(failedItems);
                } else {
                    // 删除成功
                    message.success('删除成功');
                }
            } catch (err) {
                console.log('删除失败', err);
                message.error('删除失败，请重试');
            } finally {
                getData();
                emitter.emit('getdatareviewtotal');
            }
        },
        onCancel() { },
    });
};

// 批量发布
const bulkRelease = () => {
    Modal.confirm({
        title: `确认批量发布 ${selectBulkData.value.length} 条数据吗？`,
        icon: h('span', { role: 'img', 'aria-label': 'exclamation-circle', class: 'anticon anticon-exclamation-circle' }, [
            h('img', { src: InfoIcon, alt: '信息图标' }),
        ]),
        content: '发布后数据将被视为正式数据进行统计',
        async onOk() {
            try {
                const { data } = await pushPreparationAppCarrierApi({
                    carrier_ids: selectBulkData.value.map((item) => item.carrier_id),
                });
                message.success(`成功发布 ${data.data.success_count} 条数据，失败 ${data.data.fail_count} 条数据`);
            } catch {
                console.log('Oops errors!');
            } finally {
                getData();
                selectBulkData.value = [];
                selectedSecIssue.value = [];
                emitter.emit('getdatareviewtotal');
            }
        },
        onCancel() { },
    });
};

// 编辑
const handleEdit = (record, index) => {
    opendrawer.value = true;
    clickindex.value = index;
};

const columns = ref([
    {
        title: '载体名称',
        dataIndex: 'name',
        width: 244,
        fixed: 'left',
        ellipsis: true,
    },
    {
        title: '载体类型',
        dataIndex: 'carrier_type',
        width: 100,
    },
    {
        title: '来源',
        dataIndex: 'source',
        width: 120,
    },
    {
        title: '所属应用',
        dataIndex: 'applications',
        width: 200,
    },
    // {
    //     title: '安全问题负责人',
    //     dataIndex: 'issue_owner_name',
    //     width: 140,
    // },
    {
        title: '数据状态',
        dataIndex: 'data_status',
        width: 120,
    },
    {
        title: '数据处理人',
        dataIndex: 'data_processor_name',
        width: 178,
        type: 'person',
    },
    {
        title: '数据接入时间',
        dataIndex: 'created_at',
        width: 180,
    },
    {
        title: '数据更新时间',
        dataIndex: 'updated_at',
        width: 180,
    },
    {
        title: '操作',
        dataIndex: 'operation',
        fixed: 'right',
        width: '152px',
    },
]);

onBeforeMount(async () => {
    await getSecurityCapabilityList();
});

// 批量删除
const bulkDelete = () => {
    showDeleteConfirm({
        record: selectedSecIssue.value.map((item) => item.carrier_id),
        onDelete: delPreparationAppCarrierApi,
        onSuccess: (data) => {
            getData();
            selectedSecIssue.value = [];
            selectBulkData.value = [];
            message.success(`成功删除 ${data.success_count} 条数据，失败 ${data.fail_count} 条数据`);
            emitter.emit('getdatareviewtotal');
        },
        title: `确定批量删除 ${selectedSecIssue.value.length} 条数据吗？`,
        content: '数据删除后将不可恢复，请谨慎操作！',
    });
};

// 全量发布
const fullReleaseHandle = () => {
    Modal.confirm({
        title: '确认全量发布数据吗？',
        icon: h('span', { role: 'img', 'aria-label': 'exclamation-circle', class: 'anticon anticon-exclamation-circle' }, [
            h('img', { src: InfoIcon, alt: '信息图标' }),
        ]),
        content: '发布后数据将被视为正式数据进行统计',
        async onOk() {
            try {
                const { data } = await batchPublishPluginApi('carrier');
                message.success(`成功发布 ${data.data.success_count} 条数据，失败 ${data.data.fail_count} 条数据`);
            } catch {
                return console.log('Oops errors!');
            } finally {
                getData();
                selectedSecIssue.value = [];
                selectBulkData.value = [];
                emitter.emit('getdatareviewtotal');
            }
        },
        onCancel() { },
    });
};

const fullDeleteHandle = () => {
    showDeleteConfirm({
        record: 'carrier',
        onDelete: batchDelPluginApi,
        onSuccess: (data) => {
            getData();
            selectedSecIssue.value = [];
            selectBulkData.value = [];
            message.success(`成功删除 ${data.success_count} 条数据，失败 ${data.fail_count} 条数据`);
            emitter.emit('getdatareviewtotal');
        },
        title: `确定全量删除 ${pageConfig.total} 条数据吗？`,
        content: '数据删除后将不可恢复，请谨慎操作！',
    });
};
</script>

<style scoped>
:deep(.security-capability-tabs) {

    width: 100%;

    .ant-tabs-nav {
        margin-bottom: 0 !important;
        padding: 0 !important;
    }

    .ant-tabs-nav-list {
        gap: 40px !important;
    }

    .ant-tabs-tab {
        padding: 6px 0px !important;
        margin: 0 !important;
        font-size: 16px !important;

        &:hover {
            color: #6C87FF !important;
        }

        &.ant-tabs-tab-active {
            .ant-tabs-tab-btn {
                color: #6C87FF !important;
                font-weight: 500 !important;
            }
        }
    }

    .ant-tabs-ink-bar {
        background: #6C87FF !important;
    }

    /*
    .ant-tabs-nav-wrap{
        &::after{
            box-shadow: none;
        }
    } */
}

.moreIcon {
    transition: transform 0.3s;
    display: inline-flex;
    align-items: center;
    white-space: nowrap;

    .normal-icon {
        display: block;
    }

    .active-icon {
        display: none;
    }

    span {
        margin-right: 4px;
    }

    &:hover {
        cursor: pointer;

        span {
            color: #6C87FF;
        }

        .normal-icon {
            display: none;
        }

        .active-icon {
            display: block;
        }
    }
}
</style>
