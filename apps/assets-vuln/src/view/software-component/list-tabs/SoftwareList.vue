<template>
    <div class="main-content flex flex-col">
        <div class="select-content mb-2 bg-white py-2 px-6 flex justify-between items-center">
            <div class="flex items-center gap-2">
                <Input class="base-input" v-model:value="filters.component_name" placeholder="搜索软件成分名称" />

                <Select :allowClear="true" :popupClassName="'base-select-dropdown'" class="base-select" v-model:value="filters.asset_type" :options="SOFTWARE_COMPONENT_CATEGORY" placeholder="分类" />

                <!-- <Select :popupClassName="'base-select-dropdown'" class="w-[140px]" v-model:value="filters.ecosystem" :options="SecAble" placeholder="生态" />

                <Select :popupClassName="'base-select-dropdown'" :not-found-content="null" class="w-[140px]" v-model:value="filters.repository" :options="SecAble" placeholder="仓库" /> -->

                <!-- <a-button @click="resetFilter(filters)">重置</a-button> -->
            </div>

            <a-button @click="handleAddSoftwareComponent" class="text-center base-button" type="primary">新增软件成分</a-button>
        </div>

        <div class="px-[24px] py-[16px] bg-white h-full overflow-auto">
            <a-table class="base-table" :pagination="false" :ellipsis="true" :loading="{ indicator, spinning: loading }" :columns="columns"
                     :scroll="{ x: '100%' }" :data-source="listData">

                <!-- <template #headerCell="{ column }">
                    <template v-if="column.dataIndex === 'operate'">
                        <div class="flex items-center justify-center">
                            <div>
                                编辑
                            </div>
                        </div>
                    </template>

                </template> -->
                <template #emptyText>
                    <Empty />
                </template>
                <template #bodyCell="{ column, text, record }">

                    <template v-if="column.dataIndex === 'component_name'">
                        <a-tooltip arrowPointAtCenter>
                            <template #title>{{ text }}</template>
                            <span v-if="column.dataIndex === 'component_name'" @click="router.push(`/software-component/detail/${record.component_id}`)" class="ellipsis hover">{{ text }}</span>
                            <span v-else>{{ text }}</span>
                        </a-tooltip>
                    </template>

                    <template v-else-if="column.dataIndex === 'asset_type'">
                        <span>{{ SOFTWARE_COMPONENT_CATEGORY.find((item) => item.value === text)?.label }}</span>
                    </template>

                    <template v-else-if="column.dataIndex === 'status'">
                        <span>{{ SOFTWARE_COMPONENT_STATUS.find((item) => item.value === text)?.label }}</span>
                    </template>

                    <template v-else-if="column.type === 'date'">
                        {{  formatDate(text) || '-'}}
                    </template>

                    <template v-else-if="column.dataIndex === 'tags'">
                        <span v-if="!text">-</span>
                        <a-tag v-else>{{ text?.[0] }}</a-tag>
                        <a-popover v-if="text?.length >1">
                            <template #content>
                                <a-tag v-for="item in text.slice(1)" :key="item">{{ item}}</a-tag>
                            </template>
                            <a-tag>+{{ text.length-1}}</a-tag>
                        </a-popover>
                    </template>

                    <template v-else-if="column.dataIndex === 'operate'">
                        <div class="flex gap-4 items-center">
                            <div @click="handleEditSoftwareComponent(record)" class="text-button-blue ">
                                编辑
                            </div>

                            <a-popover :overlayStyle="{ zIndex: 500 }"
                                       :overlayInnerStyle="{ padding: '6px 0px', width: '142px' }" placement="bottomLeft" :arrow="false">
                                <template #content>
                                    <div class="cursor-pointer">
                                        <div @click="turnOnLog(record.component_id)" class="table-operation-item px-6 py-2">
                                            <span>操作日志</span>
                                        </div>
                                    </div>

                                </template>
                                <span class="icon-hover hover:bg-f2 cursor-pointer">
                                    <EllipsisOutlined class="text-3c text-base" />
                                </span>
                            </a-popover>
                        </div>

                    </template>

                    <template v-else>
                        <a-tooltip arrowPointAtCenter>
                            <template #title>{{ text }}</template>
                            <span class="ellipsis">{{ text || '-' }}</span>
                        </a-tooltip>
                    </template>

                </template>

            </a-table>

            <div class="flex justify-end mt-4">
                <a-pagination class="pagination" :show-total="total => `共 ${total.toLocaleString()} 条`"
                              show-quick-jumper :total=pageConfig.total  @change="changePageHandle"
                              v-model:current="pageConfig.current" v-model:pageSize="filters.limit" />
            </div>
        </div>

        <OperationLogModal v-model:open="opetateLog" v-if="opetateLog" :logfilter="logfilter" />
        <SoftModal :softwareComponentId="softwareComponentId" v-if="openSoftModal" v-model:open="openSoftModal" @updateList="getData" />
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { getSoftwareComponentListApi } from 'api/software';
import { indicator, formatDate } from 'utils';
import { usePageList } from '@/hooks';
import { SOFTWARE_COMPONENT_CATEGORY, SOFTWARE_COMPONENT_STATUS } from '../constants';
import router from '@/router';

import SoftModal from '../Modals/SoftModal.vue';

const opetateLog = ref(false);
const logfilter = ref({
    entity_type: 'Component',
    entity_id: null, // 这里可以根据实际情况设置
});
// 开启操作日志
const turnOnLog = (component_id) => {
    opetateLog.value = true;
    logfilter.value.entity_id = String(component_id);
};

const openSoftModal = ref(false);
const softwareComponentId = ref(null);
const filters = reactive({
    limit: 15,
    component_name: '',
    asset_type: null, // 分类
    ecosystem: null, // 生态
    repository: null, // 仓库
});

const {
    changePageHandle,
    listData,
    pageConfig,
    loading,
    getData,
} = usePageList(getSoftwareComponentListApi, filters);

const columns = ref([
    {
        title: '软件成分名称',
        dataIndex: 'component_name',
        width: '300px',
        fixed: 'left',
    },
    {
        title: '版本',
        dataIndex: 'component_version',
        width: '120px',
        customRender({ text }) { return text || '-'; },
    },
    {
        title: '分类',
        dataIndex: 'asset_type',
        width: '178px',
        // customRender({ text }) { return text || '-'; },
    },
    {
        title: '状态',
        dataIndex: 'status',
        width: '100px',
        // customRender({ text }) { return text || '-'; },
    },
    {
        title: '供应商',
        dataIndex: 'supplier_name',
        width: '120px',
        customRender({ text }) { return text || '-'; },
    },
    {
        title: '生态',
        dataIndex: 'ecosystem',
        width: '100px',
        customRender({ text }) { return text || '-'; },
    },
    {
        title: '仓库',
        dataIndex: 'repository',
        width: '100px',
        customRender({ text }) { return text || '-'; },
    },
    // {
    //     title: '标签',
    //     dataIndex: 'tags',
    //     width: 178,
    //     // customRender({ text }) { return text || '-'; },
    // },
    {
        title: '创建时间',
        dataIndex: 'created_at',
        width: '178px',
        type: 'date',
        // customRender({ text }) { return formatDate(text) || '-'; },
    },
    {
        title: '更新时间',
        dataIndex: 'updated_at',
        width: '178px',
        type: 'date',
        // customRender({ text }) { return formatDate(text) || '-'; },
    },
    {
        title: '操作',
        dataIndex: 'operate',
        width: '120px',
        align: 'center',
        fixed: 'right',
    },
]);

const handleEditSoftwareComponent = (record) => {
    softwareComponentId.value = record.component_id;
    openSoftModal.value = true;
};

const handleAddSoftwareComponent = () => {
    softwareComponentId.value = null;
    openSoftModal.value = true;
};

</script>
