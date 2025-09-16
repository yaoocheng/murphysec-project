<template>
    <a-modal class="add-app-carry-modal" :confirmLoading="globalState.loading" title="新增应用"
             @cancel="emits('update:open', false)" @ok="okHandle" :width="600" :okButtonProps="{ disabled: okBtndisabled }"
             okText="确认" cancelText="取消">
        <div class="mt-6">
            <div class="bg-white flex items-center justify-between">
                <Input class="w-full base-input" v-model:value="filters.name" placeholder="搜索应用名称" />
            </div>

            <div class="flex-1 overflow-hidden py-4 bg-white">
                <div class="h-full">
                    <a-table class="base-table" :row-selection="rowSelection" :pagination="false" :ellipsis="true" :loading="{ indicator, spinning: loading }" rowKey="application_id"
                             @change="changePageHandle" :columns="columns" :scroll="{ x: '100%' }" :data-source="listData">

                        <template #emptyText>
                            <Empty />
                        </template>
                        <template #bodyCell="{ column,text, record }">

                            <template v-if="column.dataIndex === 'application_name'">
                                <a-tooltip arrowPointAtCenter>
                                    <template #title>{{ text }}</template>
                                    <span
                                        class="ellipsis font-normal">
                                        {{ record.application_name }}
                                    </span>
                                </a-tooltip>
                            </template>

                            <template v-if="column.dataIndex === 'business_system_name' || column.dataIndex === 'organize_name'">
                                <a-tooltip arrowPointAtCenter>
                                    <template #title>{{ text }}</template>
                                    <span class="ellipsis"> {{ text || '-' }} </span>
                                </a-tooltip>
                            </template>

                            <template v-if="column.dataIndex === 'owner_name'">
                                <User v-if="record.owner_nick_name || record.owner_name" :users="[record.owner_nick_name || record.owner_name]" />
                                <span v-else>-</span>
                            </template>

                        </template>
                    </a-table>

                    <div class="flex justify-end mt-4">
                        <a-pagination class="pagination" :total=pageConfig.total  @change="changePageHandle" :showSizeChanger="false"
                                      v-model:current="pageConfig.current" v-model:pageSize="filters.limit" />
                    </div>
                </div>
            </div>
        </div>
    </a-modal>
</template>

<script setup>
import {
    ref, reactive, onMounted,
} from 'vue';
import { getAppListApi } from 'api/app';
import { indicator } from 'utils';
import { useRoute } from 'vue-router';
import { usePageList } from '@/hooks';
import { globalState } from '@/store';

const emits = defineEmits(['update:open', 'changeAppList']);

const { app_list } = defineProps(['app_list']);

const route = useRoute();

const filters = reactive({
    name: route.query.name || '',
    status: route.query.status || undefined,
    security_capability_type: route.query.security_capability_type || null,
    limit: 10,
});

// 初始化页码配置，从URL查询参数中获取当前页
const initialPage = Number(route.query.page) || 1;

const {
    pageConfig,
    listData,
    loading,
    changePageHandle,
    getData,
} = usePageList(getAppListApi, filters, initialPage);

// 处理初始加载和刷新时的显示
onMounted(() => {
    getData();
});

const columns = ref([
    {
        title: '应用名称',
        dataIndex: 'application_name',
        width: 280,
        fixed: 'left',
    },
    {
        title: '所属业务系统',
        dataIndex: 'business_system_name',
        width: 280,
    },
    {
        title: '所属组织',
        dataIndex: 'organize_name',
        width: 178,
    },
    {
        title: '负责人',
        dataIndex: 'owner_name',
        width: 178,
    },

]);

const selectedApp = ref([]);

const rowSelection = {

    onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        selectedApp.value = selectedRows;
        console.log('selectedApp', selectedApp.value);
    },
    getCheckboxProps: (record) => ({
        disabled: (app_list || []).map((item) => item.application_id).includes(record.application_id),
        // Column configuration not to be checked
        name: record.name,
    }),
};

const okHandle = () => {
    console.log('okHandle', selectedApp.value);
    emits('changeAppList', selectedApp.value);
    emits('update:open', false);
};

onMounted(() => {
    console.log('app_list', app_list);
});

</script>

<style>
.add-app-carry-modal {

    margin: 60px 0 0px;
    left: 50%;
    top: 0;
    margin-left: -500px;
    padding-bottom: 0;

    .ant-modal-content{
        padding: 24px;
        /* width: 840px !important; */
        width: 1000px !important;
    }

    .ant-form-item{
        margin-bottom: 0;
    }

}

.app-table{
    .ant-table-thead>tr>th, .ant-table-tbody>tr>td{
        padding: 7px 24px;
        height: 36px;
        font-size: 14px;
    }
    .ant-table-thead>tr>th{
        background-color: #F2F2F2;
        border-bottom: 1px solid #F2F2F2;
        font-weight: 500;
    }

    .ant-table-tbody>tr>td{
        padding: 9px 24px;
        height: 40px;
        font-weight: 400;
    }
}
</style>
