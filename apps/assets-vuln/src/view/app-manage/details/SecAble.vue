<template>
    <div class="main-content">
        <div>

            <div class="mb-2 bg-white py-2 px-6 flex items-center gap-2">
                <Input class="base-input" v-model:value="filters.keyword" placeholder="搜索安全能力名称" />

                <!-- <Select :showArrow="true" :popupClassName="'security-capability-type-select'" class="min-w-[140px]" :max-tag-count="1" mode="multiple" v-model:value="filters.type" :options="SECURITY_CAPABILITY_TYPE" placeholder="安全能力类型" :maxTagPlaceholder="(omittedValues) => '+'+omittedValues.length" /> -->

                <Select :popupClassName="'security-capability-type-select'" class="base-select" v-model:value="filters.type" :options="SECURITY_CAPABILITY_TYPE" placeholder="安全能力类型" />

                <!-- <a-button @click="resetFilter(filters)">重置</a-button> -->
            </div>

            <a-table class="base-table" :pagination="pageConfig" :ellipsis="true" :loading="{ indicator, spinning: loading }"
                     @change="changePageHandle" :columns="columns" :scroll="{ x: '100%' }" :data-source="listData">
                <template #emptyText>
                    <Empty />
                </template>
                <template #bodyCell="{ column, text }">

                    <template v-if="column.dataIndex === 'capability_name' || column.dataIndex === 'capability_desc'
                        || column.dataIndex === 'application_name' || column.dataIndex === 'repo_name' || column.dataIndex === 'carrier_type' ">
                        <a-tooltip arrowPointAtCenter>
                            <template #title>{{ text }}</template>
                            <span>{{ text }}</span>
                        </a-tooltip>
                    </template>

                    <template v-else-if="column.dataIndex === 'capability_type' ">
                        {{ getSecurityCapabilityLabel(text) }}
                    </template>

                </template>

            </a-table>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { getAppSecAbleApi } from 'api/app';
import { indicator } from 'utils';
import { useRoute } from 'vue-router';
import { SECURITY_CAPABILITY_TYPE, getSecurityCapabilityLabel } from 'constants/safetyCapabilities';
import { usePageList } from '@/hooks';

const route = useRoute();
const filters = reactive({
    application_id: Number(route.params.id),
    limit: 1000,
    // keyword: undefined,
    // type: undefined,
});

const {
    pageConfig,
    listData,
    loading,
    changePageHandle,
} = usePageList(getAppSecAbleApi, filters);

const columns = ref([
    {
        title: 'ID',
        dataIndex: 'security_capability_id',
        width: '178px',
        flex: 'left',
    },
    {
        title: '安全能力名称',
        dataIndex: 'capability_name',
        width: '280px',
    },
    {
        title: '安全能力类型',
        dataIndex: 'capability_type',
        width: '300px',
    },
    {
        title: '关联安全问题数',
        dataIndex: 'issue_number',
        width: '178px',
        align: 'right',
    },
    {
        title: '类型描述',
        dataIndex: 'capability_desc',
    },
]);
</script>
