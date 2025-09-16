<template>

    <a-table class="base-table" :pagination="false" :ellipsis="true" :columns="application_columns  "
             :scroll="{ x: '100%' }" :data-source="listData">
        <template #emptyText>
            <Empty />
        </template>
        <template #bodyCell="{ column, text  }">

            <template v-if="column.dataIndex === 'owner_name'">
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
import { ref, onMounted, computed } from 'vue';
import { getComponentRelatedApplicationsApi } from 'api/app';
import { formatDate } from 'utils';
import { userInfo } from '@/store';

const organize_id = computed(() => userInfo.value.org_id);

const props = defineProps({
    component_id: String,
});

const listData = ref([]);

const getComponentRelatedApplications = async () => {
    const response = await getComponentRelatedApplicationsApi({
        component_id: props.component_id,
        org_id: organize_id.value,
    });
    listData.value = response.data.data;
};

onMounted(() => {
    getComponentRelatedApplications();
});
const application_columns = ref([
    {
        title: '应用名称 ',
        dataIndex: 'application_name',
        width: 280,
        fixed: 'left',
        ellipsis: true,
        customRender({ text }) { return text || '-'; },
    },
    {
        title: '应用版本',
        dataIndex: 'application_version',
        width: 178,
        customRender({ text }) { return text || '-'; },
    },
    {
        title: '应用状态',
        dataIndex: 'application_status',
        width: 178,
        customRender({ text }) { return text || '-'; },
    },
    {
        title: '应用负责人 ',
        dataIndex: 'owner_name',
        width: 178,
        customRender({ text }) { return text || '-'; },
    },
    {
        title: '所属业务系统',
        dataIndex: 'business_system_name',
        width: 178,
        ellipsis: true,
        customRender({ text }) { return text || '-'; },
    },
    {
        title: '所属组织',
        dataIndex: 'organize_name',
        width: 178,
        ellipsis: true,
        customRender({ text }) { return text || '-'; },
    },
    {
        title: '更新时间',
        dataIndex: 'updated_at',
        width: 178,
        customRender({ text }) { return formatDate(text) || '-'; },
    },
]);
</script>
