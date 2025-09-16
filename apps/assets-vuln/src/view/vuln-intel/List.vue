<template>
    <div class="main-content">
        <div class="select-content mb-2 bg-white py-[10px] px-6">
            <div class="flex gap-2 mb-4">
                <Input class="base-input" v-model:value="filters.title" placeholder="搜索漏洞名称" />

                <Input class="base-input" v-model:value="filters.mps_id" placeholder="搜索MPS/CVE漏洞编号" />

                <!-- <Select :popupClassName="'base-select-dropdown'" class="w-[140px]" v-model:value="filters.severity" :options="intelligence_level" placeholder="情报级别" />

                <Select :popupClassName="'base-select-dropdown'" class="w-[140px]" v-model:value="filters.type" :options="intelligence_type" placeholder="情报类型" />

                <Select :popupClassName="'base-select-dropdown'" class="w-[140px]"  v-model:value="filters.analysis_status" :options="intelligence_status" placeholder="情报状态" /> -->

                <!-- <a-button allowClear @click="resetFilter(filters)">重置</a-button> -->
            </div>

            <!-- <a-button type="primary" @click="openSecAbilityModal = true;editSecAbility =false" class="ml-auto">关联资产风险</a-button> -->

            <Filter />
        </div>

        <div class="px-6 pt-4 gap-6 bg-white box-border pb-6">
            <a-table class="base-table" :pagination="false" :ellipsis="true" :loading="{ indicator, spinning: loading }" :columns="columns"
                     :scroll="{ x: '100%',y:'calc(100vh - 300px)' }" :data-source="listData">

                <template #emptyText>
                    <Empty />
                </template>
                <template #bodyCell="{ column, text, record ,index}">

                    <template v-if="column.dataIndex === 'title' || column.dataIndex === 'mps_id'
                        || column.dataIndex === 'application_name' || column.dataIndex === 'repo_name' || column.dataIndex === 'carrier_type' ">
                        <a-tooltip arrowPointAtCenter>
                            <template #title>{{ text }}</template>
                            <span v-if="column.dataIndex === 'title'" @click="RouteJump(index)" class="ellipsis hover" style="width: 248px;">
                                {{ text || '-'}}
                            </span>
                            <span v-else>{{ text }}</span>
                        </a-tooltip>
                    </template>

                    <template v-if="column.dataIndex === 'cve_id' || column.dataIndex === 'attack_vector'">
                        {{ text || '-' }}
                    </template>

                    <template v-if="column.dataIndex === 'poc'">
                        {{ text ? '有' : '无'}}
                    </template>

                    <template v-if="column.dataIndex === 'vuln_type'">
                        <a-tooltip>
                            <template #title>{{ record.problem_type.meaning }}</template>
                            <span class="ellipsis"> {{ record.problem_type.meaning }}</span>
                        </a-tooltip>
                    </template>

                    <template v-if="column.dataIndex === 'tags'">
                        <a-tag v-if="text.length >=1">{{ text[0] }}</a-tag>

                        <span v-else>-</span>

                        <a-popover v-if="text.length >1">
                            <template #content>
                                <a-tag v-for="item in text.slice(1)" :key="item">{{ item}}</a-tag>
                            </template>
                            <a-tag>+{{ text.length-1}}</a-tag>
                        </a-popover>

                    </template>

                    <template v-if="column.dataIndex === 'severity'">
                        <SecIssueLevel :text />
                    </template>

                    <template v-if="column.dataIndex === 'public_time' || column.dataIndex === 'last_updated_time'">
                        {{ formatDate(text , 'YYYY-MM-DD') }}
                    </template>

                    <template v-if="column.dataIndex === 'problem_type_desc'">
                        {{ record.is_sole ? '独家漏洞' :  record.problem_type.cwe == 'CWE-506' ? '投毒情报' : '公开漏洞'}}
                    </template>
                </template>

            </a-table>

            <div class="flex justify-end mt-6">
                <a-pagination class="pagination" :show-total="total => `共 ${total.toLocaleString()} 条`"
                              show-quick-jumper :total=pageConfig.total  @change="changePageHandle"
                              v-model:current="pageConfig.current" v-model:pageSize="filters.limit" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { getChainIntelligenceListApi } from 'api/app';
import { indicator, formatDate } from 'utils';
import { useRouter } from 'vue-router';
import { usePageList } from '@/hooks';
import Filter from './components/filter.vue';
import { filters } from './components/filter.js';

const router = useRouter();

const {
    listData,
    loading,
    pageConfig,
    changePageHandle,
} = usePageList(getChainIntelligenceListApi, filters);

const columns = ref([
    {
        title: '漏洞名称',
        dataIndex: 'title',
        width: 280,
        fixed: 'left',
        ellipsis: true,
    },
    {
        title: '墨菲编号',
        dataIndex: 'mps_id',
        width: 160,
    },
    {
        title: 'CVE编号',
        dataIndex: 'cve_id',
        width: 160,
    },
    {
        title: '情报级别',
        dataIndex: 'severity',
        width: 90,
    },
    {
        title: '处置优先级',
        dataIndex: 'suggest',
        width: 120,
    },
    {
        title: '漏洞分类',
        dataIndex: 'problem_type_desc',
        width: 120,
    },
    {
        title: '漏洞类型',
        dataIndex: 'vuln_type',
        width: 178,
    },
    {
        title: '漏洞状态',
        dataIndex: 'status',
        width: 150,
    },
    {
        title: 'POC',
        dataIndex: 'poc',
        width: 80,
    },
    {
        title: '利用成本',
        dataIndex: 'exploit_cost',
        width: 100,
    },
    {
        title: '攻击向量',
        dataIndex: 'attack_vector',
        width: 100,
    },
    {
        title: '公开时间',
        dataIndex: 'public_time',
        width: 120,
    },
    {
        title: '更新时间',
        dataIndex: 'last_updated_time',
        width: 120,
    },

]);

// 带着数据跳转路由
const RouteJump = (index) => {
    const record = listData.value[index];
    router.push(`/vuln-intel/detail/${record.mps_id}`);
};

</script>

<style >
.ant-popover-inner{
    .ant-popover-inner-content{
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
}
</style>
