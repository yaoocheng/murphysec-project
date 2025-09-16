<template>
    <div class="main-content">
        <div class="mb-2 bg-white py-2 px-6 flex items-center justify-between">
            <div class="flex items-center gap-4">
                <div class="flex items-center gap-2">
                    <Input class="base-input" v-model:value="filters.repo_name" placeholder="搜索载体名称" />
                    <Select class="base-select" :popupClassName="'base-select-dropdown'"  v-model:value="filters.carrier_type" :options="CARRIER_OPTION" placeholder="载体类型" />

                    <!-- <Select :showArrow="true" :popupClassName="'security-capability-type-select'" class="min-w-[140px]" :max-tag-count="1" mode="multiple" v-model:value="filters.type" :options="SECURITY_CAPABILITY_TYPE" placeholder="安全能力类型" :maxTagPlaceholder="(omittedValues) => '+'+omittedValues.length" /> -->

                    <Select class="base-select" :popupClassName="'security-capability-type-select'"  v-model:value="filters.type" :options="SECURITY_CAPABILITY_TYPE" placeholder="安全能力类型" />

                </div>

                <a-button class="base-button" @click="resetFilter(filters)">重置</a-button>
            </div>

            <a-button @click="openRelation=true" type="primary" class="float-right base-button">关联应用载体</a-button>
        </div>

        <div class="px-6 py-4 bg-white">
            <a-table class="base-table" :pagination="false" :ellipsis="true" :loading="{ indicator, spinning: loading }"
                     @change="changePageHandle" :columns="columns" :scroll="{ x: '100%' }" :data-source="listData">
                <template #emptyText>
                    <Empty />
                </template>
                <template #bodyCell="{ column, record,text }">
                    <template v-if="column.dataIndex === 'operate'">
                        <a-popconfirm title="确认取消关联？" @confirm="unBindCarrier({
                            application_id: Number($route.params.id), carrier_id: record.carrier_id
                        }, getData)" placement="left" ok-text="确认" cancel-text="取消">
                            <span class="cursor-pointer text-error">取消关联</span>
                        </a-popconfirm>
                    </template>

                    <template v-if="column.dataIndex === 'name'">
                        <a-tooltip arrowPointAtCenter>
                            <template #title>{{ text }}</template>
                            <span  @click="$router.push(`/app-vector/detail/${record.carrier_id}`)"
                                   class="hover ellipsis">
                                {{ record.name }}
                            </span>
                        </a-tooltip>
                    </template>

                    <template v-if="column.dataIndex === 'updated_at' || column.dataIndex === 'created_at'">
                        {{ formatDate(text) }}
                    </template>

                    <template v-if="column.dataIndex === 'carrier_type' ">
                        {{ CARRIER_OPTION.find((item) => item.value === text)?.label }}
                    </template>

                    <template v-if="column.dataIndex === 'repo_name' || column.dataIndex === 'repo_url'
                        || column.dataIndex === 'application_name' || column.dataIndex === 'repo_name' ">
                        <a-tooltip arrowPointAtCenter>
                            <template #title>{{ text }}</template>
                            <span>{{ text }}</span>
                        </a-tooltip>
                    </template>

                    <template v-if="column.dataIndex === 'capability_type'">
                        <a-tag>{{  getSecurityCapabilityLabel(text?.[0]) }}</a-tag>

                        <a-popover v-if="text?.length >1">
                            <template #content>
                                <a-tag v-for="item in text.slice(1)" :key="item">{{ getSecurityCapabilityLabel(item) }}</a-tag>
                            </template>
                            <a-tag>+{{ text.length-1}}</a-tag>
                        </a-popover>

                    </template>
                </template>
            </a-table>
        </div>

        <RelationModal v-model:open="openRelation" :type="'code_repo'" @updateList="getData" v-if="openRelation" />
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { indicator, formatDate } from 'utils';
import { useRoute } from 'vue-router';
import { getBindAppCarrierApi } from 'api/app';
import { CARRIER_OPTION } from 'constants/app';
import { SECURITY_CAPABILITY_TYPE, getSecurityCapabilityLabel } from 'constants/safetyCapabilities';
import { unBindCarrier, getAppCarrierTypeList } from '../../constats';
import { usePageList } from '@/hooks';
import RelationModal from './RelationModal.vue';

const route = useRoute();
const openRelation = ref(false);
const filters = reactive({
    repo_name: undefined,
    repo_type: undefined,
    application_id: Number(route.params.id),
    carrier_type: undefined,
    limit: 1000,
});
getAppCarrierTypeList(Number(route.params.id));

const {
    listData,
    loading,
    changePageHandle,
    getData,
} = usePageList(getBindAppCarrierApi, filters);

const columns = ref([
    {
        title: '载体名称',
        dataIndex: 'name',
        width: 'flex-1',
        flex: 'left',
    },
    {
        title: '载体类型',
        dataIndex: 'carrier_type',
        width: 178,
    },
    {
        title: '来源',
        dataIndex: 'source',
        width: 178,
    },
    {
        title: '安全能力类型',
        dataIndex: 'capability_type',
        width: 240,
    },
    {
        title: '创建时间',
        dataIndex: 'created_at',
        width: 178,
    },
    {
        title: '更新时间',
        dataIndex: 'updated_at',
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
