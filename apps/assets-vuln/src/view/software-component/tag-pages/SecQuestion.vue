<template>

    <a-table class="base-table" :pagination="false" :ellipsis="true" :columns="sec_columns" :scroll="{ x: '100%' }"
             :data-source="listData">
        <template #emptyText>
            <Empty />
        </template>
        <template #bodyCell="{ column, text }">

            <template v-if="column.dataIndex === 'issue_level'">
                <div :class="[text === 'critical' ? 'serious' : text === 'high' ? 'high_risk'
                    : text === 'medium' ? 'medium_risk' : 'low_risk']">
                    <span v-if="text === 'critical'">严重</span>
                    <span v-else-if="text === 'high'">高危</span>
                    <span v-else-if="text === 'medium'">中危</span>
                    <span v-else>低危</span>
                </div>
            </template>

            <template v-if="column.dataIndex === 'issue_owner_name'">
                <div v-if="text !== ''">
                    <a-avatar>{{ text.charAt(0) }}</a-avatar>
                    <p>{{ text }}</p>
                </div>
                <div v-else>
                    <span>-</span>
                </div>
            </template>

        </template>

    </a-table>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getComponentRelatedSecIssuesApi } from 'api/app';
import { DISPOSAL_STATUS } from 'view/app-manage/constats';
import { formatDate } from 'utils';

const props = defineProps({
    component_id: String,
});

const listData = ref([]);

const getComponentRelatedSecIssues = async () => {
    const response = await getComponentRelatedSecIssuesApi(props.component_id);

    listData.value = response.data.data;
};

onMounted(() => {
    getComponentRelatedSecIssues();
});

const sec_columns = ref([
    {
        title: '安全问题',
        dataIndex: 'issue_title',
        width: 280,
        fixed: 'left',
        ellipsis: true,
        customRender({ text }) { return text || '-'; },
    },
    {
        title: '安全问题级别',
        dataIndex: 'issue_level',
        width: 178,
    },
    {
        title: '漏洞数量',
        dataIndex: 'vuln_count',
        width: 178,
        customRender({ text }) { return text || '-'; },
    },
    {
        title: '负责人',
        dataIndex: 'issue_owner_name',
        width: 178,
    },
    {
        title: '处置状态',
        dataIndex: 'issue_status',
        width: 178,
        customRender({ text }) { return DISPOSAL_STATUS.find((item) => item.value === text)?.label || '-'; },
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
