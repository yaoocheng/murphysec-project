<template>
    <div class="main-content overflow-auto">
        <div class="py-4 px-6 bg-white mb-2">
            <div class="mb-3">
                <span class="text-white rounded-md px-2 py-1 mr-2 leading-[30px] text-xl"
                      :style="{ background: repaireChangeColor(info.issue_level).color }">
                    {{ repaireChangeColor(info.issue_level).text.slice(0, 2) }}
                </span>
                <span class="font-medium text-xl">{{ info.issue_title }}</span>
            </div>

            <div class="flex justify-start flex-wrap">
                <div class="info-item w-[25%] mt-2" v-for="item in infos" :key="item.value">
                    <div class="text-xs text-99 mb-2">{{ item.title }}</div>
                    <div v-if="item.title === '安全问题负责人'">
                        <User :users="[item.value]" />
                    </div>
                    <div v-else>
                        {{ item.value }}
                    </div>
                </div>
                <div class="info-item mt-2">
                    <div class="text-xs text-99 mb-2">安全问题描述</div>
                    <div>
                        {{ info.issue_desc || '暂无' }}
                    </div>
                </div>
            </div>
        </div>

        <div class="px-6 py-4 bg-white">
            <a-table class="base-table" :pagination="pageConfig" :ellipsis="true" :loading="{ indicator, spinning: loading }"
                     @change="changePageHandle" rowKey="vuln_union_id" :columns="columns" :scroll="{ x: '100%' }" :data-source="listData">
                <template #emptyText>
                    <Empty />
                </template>
                <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex === 'vuln_severity'">
                        <span :style="{color: getDangerLevel(record.vuln_severity).color}">
                            {{ getDangerLevel(record.vuln_severity).text }}
                        </span>
                    </template>
                </template>
                <template #expandedRowRender="{ record }">
                    <div>
                        <div class="font-medium mb-2">漏洞描述：</div>
                        <p class="mb-4">{{ record.vuln_desc || '暂无' }}</p>
                        <div class="font-medium mb-2">修复方案：</div>
                        <p class="mb-4">{{ record.solution || '暂无' }}</p>
                    </div>
                </template>
            </a-table>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { getSecVulnListApi } from 'api/app';
import {
    indicator, repaireChangeColor, formatDate, getDangerLevel,
} from 'utils';
import { useRoute } from 'vue-router';
import { usePageList } from '@/hooks';

const route = useRoute();
const info = ref(JSON.parse(decodeURIComponent(window.atob(route.params.id))));

const filters = reactive({
    issue_id: info.value.issue_id,
});

const {
    pageConfig,
    listData,
    loading,
    changePageHandle,
} = usePageList(getSecVulnListApi, filters);

const infos = ref([
    {
        title: '应用供应链成分',
        value: info.value.component_detail_name,
    },
    {
        title: '安全问题负责人',
        value: info.value.issue_owner_name,
    },
    {
        title: '安全问题创建时间',
        value: formatDate(info.value.created_at),
    },
    {
        title: '安全问题关闭时间',
        value: formatDate(info.value.close_at),
    },
]);

const columns = ref([
    {
        title: '漏洞名称',
        dataIndex: 'vuln_title',
        width: 450,
        ellipsis: true,
        flex: 'left',
    },
    {
        title: '漏洞级别',
        dataIndex: 'vuln_severity',
    },
    {
        title: '供应链成分名称',
        dataIndex: 'component_name',
        customRender({ text }) { return text || '-'; },
        ellipsis: true,
    },
    {
        title: '创建时间',
        dataIndex: 'created_at',
        width: 178,
        customRender({ text }) { return formatDate(text) || '-'; },
    },
    {
        title: '更新时间',
        dataIndex: 'updated_at',
        width: 178,
        customRender({ text }) { return formatDate(text) || '-'; },
    },
]);
</script>
