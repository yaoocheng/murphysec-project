<template>
    <div>
        <div>
            <Input class="mr-2 base-input" v-model:value="filters.issue_title" placeholder="根据安全问题搜索" />
            <Select :popupClassName="'base-select-dropdown'" class="mr-2 base-select" v-model:value="filters.issue_level" :options="SEC_LEVEL_OPTION" placeholder="安全问题级别" />
            <Select :popupClassName="'base-select-dropdown'" class="mr-2 base-select" v-model:value="filters.issue_status" :options="DISPOSAL_STATUS" placeholder="处置状态" />
            <Select :popupClassName="'base-select-dropdown'" class="mr-4 base-select" v-model:value="filters.security_capability_id" :options="SECURITY_CAPABILITY_OPTION" placeholder="安全能力" />
            <a-button class="base-button" @click="resetFilter(filters)">重置</a-button>
        </div>

        <a-table class="base-table" :pagination="false"  :loading="{ indicator, spinning: loading }"
                 @change="changePageHandle" :columns="columns" :scroll="{ x: '100%' }" :data-source="listData">
            <template #emptyText>
                <Empty />
            </template>
            <template #bodyCell="{ column,text, record }">

                <template v-if="column.dataIndex === 'issue_title'">
                    <a-tooltip arrowPointAtCenter>
                        <template #title>{{ text }}</template>
                        <span class="ellipsis hover" @click="$router.push(`/sec-issue/detail/${record.issue_id}`)">
                            {{ record.issue_title }}
                        </span>
                    </a-tooltip>
                </template>

                <template v-if="column.dataIndex === 'issue_level'">
                    <SecIssueLevel :text="text" />
                </template>

                <template v-if="column.dataIndex === 'issue_status'">
                    <span>{{ DISPOSAL_STATUS.find(item => item.value === text)?.label || '-' }}</span>
                </template>

                <template v-if="column.dataIndex === 'issue_owner_nick_name'">
                    <User v-if="text" :users="[text]" />
                    <span v-else>-</span>
                </template>

                <template v-if="column.dataIndex === 'carrier_name'">
                    <a-tooltip arrowPointAtCenter>
                        <template #title>{{ text }}</template>
                        <span class="ellipsis">
                            {{ text || '-' }}
                        </span>
                    </a-tooltip>
                </template>

                <template v-if="column.dataIndex === 'created_at' || column.dataIndex === 'discovery_at'">
                    <span>{{ formatDate(text) || '-' }}</span>
                </template>

            </template>
        </a-table>

        <div class="flex justify-end mt-4">
            <a-pagination class="pagination" :show-total="total => `共 ${total.toLocaleString()} 条`"
                          show-quick-jumper :total=pageConfig.total  @change="changePageHandle"
                          v-model:current="pageConfig.current" v-model:pageSize="filters.limit" />
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { getCarrierRelatedSecIssuesApi } from 'api/app.js';
import { indicator, resetFilter, formatDate } from 'utils';
import { SEC_LEVEL_OPTION, DISPOSAL_STATUS, SECURITY_CAPABILITY_OPTION } from 'constants/app';
import { usePageList } from '@/hooks';

const { carrier_id } = defineProps(['carrier_id']);

const filters = reactive({
    limit: 15,
    carrier_id: Number(carrier_id),
    issue_level: null,
    issue_status: null,
    security_capability_id: null,
    issue_title: null,
});

const {
    changePageHandle, pageConfig, listData, loading,
} = usePageList(getCarrierRelatedSecIssuesApi, filters);

const columns = ref([
    {
        title: '安全问题',
        dataIndex: 'issue_title',
        width: 280,
        fixed: 'left',
    },
    {
        title: '安全问题级别',
        dataIndex: 'issue_level',
        width: 178,
    },
    {
        title: '所属应用载体',
        dataIndex: 'carrier_name',
        width: 280,
        customRender({ text }) { return text || '-'; },
    },
    {
        title: '安全能力',
        dataIndex: 'security_capability_name',
        width: 178,
        customRender({ text }) { return text || '-'; },
    },
    {
        title: '漏洞数',
        dataIndex: 'vuln_count',
        width: 178,
    },
    {
        title: '负责人',
        dataIndex: 'issue_owner_nick_name',
        width: 100,
    },
    {
        title: '处置状态',
        dataIndex: 'issue_status',
        width: 200,
    },

    {
        title: '漏洞发现时间',
        dataIndex: 'discovery_at',
        width: 200,
    },
    {
        title: '创建时间',
        dataIndex: 'created_at',
        width: 178,
    },

]);

</script>
