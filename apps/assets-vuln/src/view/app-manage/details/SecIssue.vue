<template>
    <div class="px-6 py-2 mb-2 bg-white">
        <Input class="mr-2 base-input" v-model:value="filters.issue_title" placeholder="搜索安全问题名称" />
        <Select :popupClassName="'base-select-dropdown'" class="base-select mr-2" v-model:value="filters.issue_level" :options="SEC_LEVEL_OPTION" placeholder="安全问题级别" />
        <Select :popupClassName="'base-select-dropdown'" class="base-select mr-2" v-model:value="filters.issue_status" :options="DISPOSAL_STATUS" placeholder="处置状态" />
        <Select :popupClassName="'base-select-dropdown'" class="base-select mr-4" v-model:value="filters.security_capability_id" :options="SECURITY_CAPABILITY_OPTION" placeholder="安全能力" />
        <a-button class="base-button" @click="resetFilter(filters)">重置</a-button>
    </div>

    <div class="px-6 py-4 bg-white">
        <a-table class="base-table" :pagination="false" :ellipsis="true" :loading="{ indicator, spinning: loading }"
                 @change="changePageHandle" :columns="columns" :scroll="{ x: '100%' }" :data-source="listData">
            <template #emptyText>
                <Empty />
            </template>
            <template #bodyCell="{ column,text, record ,index }">

                <template v-if="column.dataIndex === 'issue_title'
                    || column.dataIndex === 'application_name' || column.dataIndex === 'repo_name' || column.dataIndex === 'carrier_type' ">
                    <a-tooltip arrowPointAtCenter>
                        <template #title>{{ text }}</template>
                        <span v-if="column.dataIndex === 'issue_title'" @click="RouteJump(index,record.issue_id)" class="ellipsis hover">
                            {{ record.issue_title }}
                        </span>
                        <span class="ellipsis" v-else>{{ text }}</span>
                    </a-tooltip>
                </template>

                <template v-else-if="column.dataIndex === 'carrier_name'">
                    <a-tooltip arrowPointAtCenter>
                        <template #title>{{ text.join('、') }}</template>
                        <span class="ellipsis">{{ text.join('、') }}</span>
                    </a-tooltip>
                </template>

                <template v-else-if="column.dataIndex === 'issue_level'">
                    <SecIssueLevel :text />
                </template>

                <template v-else-if="column.dataIndex === 'issue_owner_nick_name'">
                    <User v-if="text !== ''" :users="[text]" />
                    <span v-else>-</span>
                </template>

                <template v-else-if="column.dataIndex === 'updated_at'">
                    {{ formatDate(record.updated_at) }}
                </template>

                <template v-else-if="column.dataIndex === 'capability_names'">
                    <a-tag>{{ text[0] }}</a-tag>

                    <a-popover v-if="text.length >1">
                        <template #content>
                            <a-tag v-for="item in text.slice(1)" :key="item">{{ item}}</a-tag>
                        </template>
                        <a-tag>+{{ text.length-1}}</a-tag>
                    </a-popover>

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
import { reactive, ref } from 'vue';
import { indicator, formatDate, resetFilter } from 'utils';
import { getAppSecListApi } from 'api/app';
import { useRoute, useRouter } from 'vue-router';
import { DISPOSAL_STATUS, SECURITY_CAPABILITY_OPTION, SEC_LEVEL_OPTION } from 'constants/app';
import { usePageList } from '@/hooks';
import SecIssueLevel from '../../../components/SecIssueLevel.vue';

const route = useRoute();
const router = useRouter();
const filters = reactive({
    application_id: Number(route.params.id),
    issue_title: undefined,
    issue_level: undefined,
    security_capability_id: undefined,
    issue_status: undefined,
    source: 'sec-issue',
});

const {
    pageConfig,
    listData,
    loading,
    changePageHandle,
    getData,
} = usePageList(getAppSecListApi, filters);

// const checkIssueDetail = (info) => {
//     const str = JSON.stringify(info);
//     router.push(`/app/issue/detail/${window.btoa(encodeURIComponent(str))}`);
// };

// 跳转路由
const RouteJump = (Index, id) => {
    const record = listData.value[Index];
    sessionStorage.setItem('安全问题', JSON.stringify(record));
    router.push(`/app/issue/detail/${id}`);
};

const columns = ref([
    {
        title: '安全问题名称',
        dataIndex: 'issue_title',
        ellipsis: true,
        fixed: 'left',
        width: 280,
    },
    {
        title: '安全问题级别',
        dataIndex: 'issue_level',
        width: 120,
    },
    {
        title: '所属应用载体',
        dataIndex: 'carrier_name',
        width: 120,
    },
    {
        title: '漏洞数',
        dataIndex: 'vuln_count',
        width: 120,
        align: 'right',
    },
    // {
    //     title: '所属载体',
    //     dataIndex: 'carrier_name',
    //     width: 240,
    //     ellipsis: true,
    // },
    // {
    //     title: '安全能力',
    //     dataIndex: 'capability_names',
    //     width: 280,
    // },
    {
        title: '负责人',
        dataIndex: 'issue_owner_nick_name',
        width: 178,
    },
    {
        title: '处置状态',
        dataIndex: 'issue_status',
        width: 178,
        customRender({ text }) { return DISPOSAL_STATUS.find((item) => item.value === text).label || '-'; },
    },
    {
        title: '漏洞发现时间',
        dataIndex: 'updated_at',
        width: 178,
    },
    {
        title: '创建时间',
        dataIndex: 'updated_at',
        width: 178,
    },
]);

// 暴露这个方法
defineExpose({
    getData,
});
</script>
