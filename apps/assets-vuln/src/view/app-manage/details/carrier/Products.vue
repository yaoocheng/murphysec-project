<template>
    <div class="main-content">
        <div class="mb-2 bg-white py-2.5 px-6">
            <Input class="mr-2" v-model:value="filters.repo_name" placeholder="搜索制品名称" />
            <Select :popupClassName="'base-select-dropdown'" v-model:value="filters.repo_type" :options="APP_CARRIER_TYPE_OPTION" placeholder="制品类型" />
            <a-button @click="openRelation=true" type="primary" class="float-right base-button">关联应用载体</a-button>
        </div>

        <div class="px-6 py-4 bg-white">
            <a-table class="base-table" :pagination="false" :ellipsis="true" :loading="{ indicator, spinning: loading }"
                     @change="changePageHandle" :columns="columns" :scroll="{ x: '100%' }" :data-source="listData">
                <template #emptyText>
                    <Empty />
                </template>
                <template #bodyCell="{ column, text, record }">
                    <template v-if="column.dataIndex === 'operate'">
                        <a-popconfirm title="确认取消关联？" @confirm="unBindCarrier({
                            application_id: Number($route.params.id), carrier_id: record.carrier_id
                        }, getData)" placement="left" ok-text="确认" cancel-text="取消">
                            <span class="cursor-pointer text-error">取消关联</span>
                        </a-popconfirm>
                    </template>
                    <!-- <template v-if="column.dataIndex === 'carrier_owner_name'">
                        <User :users="[record.carrier_owner_name]" />
                    </template> -->

                    <template v-if="column.dataIndex === 'carrier_owner_name'">
                        <User v-if="text" :users="[text]" />
                        <span v-else>-</span>
                    </template>

                    <template v-if="column.dataIndex === 'created_at'">
                        {{ formatDate(record.created_at) }}
                    </template>

                    <template v-if="column.dataIndex === 'repo_name' || column.dataIndex === 'repo_url'
                        || column.dataIndex === 'application_name' || column.dataIndex === 'repo_name' || column.dataIndex === 'carrier_type' ">
                        <a-tooltip arrowPointAtCenter>
                            <template #title>{{ text }}</template>
                            <span>{{ text }}</span>
                        </a-tooltip>
                    </template>
                </template>
            </a-table>
        </div>
    </div>

    <RelationModal v-model:open="openRelation" :type="'artifact'" @updateList="getData" v-if="openRelation" />
</template>

<script setup>
import { ref, reactive } from 'vue';
import { indicator, formatDate } from 'utils';
import { useRoute } from 'vue-router';
import { getBindAppCarrierApi } from 'api/app';
import { usePageList } from '@/hooks';
import { APP_CARRIER_TYPE_OPTION, unBindCarrier, getAppCarrierTypeList } from '../../constats';
import RelationModal from './RelationModal.vue';

const route = useRoute();
const openRelation = ref(false);
const filters = reactive({
    application_id: Number(route.params.id),
    carrier_type: 'artifact',
    repo_name: undefined,
    repo_type: undefined,
    limit: 1000,

});
getAppCarrierTypeList(Number(route.params.id), 'artifact');

const {
    listData,
    loading,
    getData,
    changePageHandle,
} = usePageList(getBindAppCarrierApi, filters);

const columns = ref([
    {
        title: '制品名称',
        dataIndex: 'repo_name',
        width: 280,
        ellipsis: true,
        flex: 'left',
    },
    {
        title: '制品版本号',
        dataIndex: 'repo_version',
        width: 178,
    },
    {
        title: '制品类型',
        dataIndex: 'repo_type',
        width: 178,
    },
    {
        title: '制品URL',
        dataIndex: 'repo_url',
        width: 280,
        ellipsis: true,
        align: 'right',
    },
    {
        title: '安全能力',
        dataIndex: 'capability_name',
        width: 178,
    },
    {
        title: '创建者',
        dataIndex: 'carrier_owner_name',
        width: 178,
    },
    {
        title: '生成时间',
        dataIndex: 'created_at',
        width: 178,
    },
    {
        title: '操作',
        dataIndex: 'operate',
        width: 90,
        fixed: 'right',
    },
]);
</script>
