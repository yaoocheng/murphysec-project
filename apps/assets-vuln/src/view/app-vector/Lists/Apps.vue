<template>
    <div>
        <a-table class="base-table" :pagination="false"  :loading="{ indicator, spinning: loading }"
                 @change="changePageHandle" :columns="columns" :scroll="{ x: '100%' }" :data-source="listData">
            <template #emptyText>
                <Empty />
            </template>
            <template #bodyCell="{ column,text, record }">

                <template v-if="column.dataIndex === 'application_name'">
                    <a-tooltip arrowPointAtCenter>
                        <template #title>{{ text }}</template>
                        <span  @click="$router.push(`/app-manage/detail/${record.application_id}`)"
                               class="ellipsis hover font-normal">
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

                <template v-if="column.dataIndex === 'application_owner_nick_name'">
                    <User v-if="text" :users="[text]" />
                    <span v-else>-</span>
                </template>

                <template v-if="column.dataIndex === 'update_at'">
                    <span>{{ formatDate(text) || '-' }}</span>
                </template>

            </template>
        </a-table>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getCarrierRelatedAppsApi } from 'api/app';
import { indicator, formatDate, emitter } from 'utils';
import { findApplicationStatusLabel } from '@/constants/app';

const { carrier_id } = defineProps(['carrier_id']);

const columns = ref([
    {
        title: '应用名称',
        dataIndex: 'application_name',
        width: 280,
        fixed: 'left',
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
        customRender({ text }) { return findApplicationStatusLabel(text) || '-'; },
    },
    {
        title: '应用负责人',
        dataIndex: 'application_owner_nick_name',
        width: 178,
    },
    {
        title: '所属业务系统',
        dataIndex: 'business_system_name',
        width: 280,
        ellipsis: true,
        customRender({ text }) { return text || '-'; },
    },
    {
        title: '所属组织',
        dataIndex: 'organize_name',
        width: 280,
        ellipsis: true,
    },
    {
        title: '最近更新时间',
        dataIndex: 'update_at',
        width: 178,
    },

]);

const listData = ref([]);

const loading = ref(false);

const getListData = async () => {
    loading.value = true;
    const response = await getCarrierRelatedAppsApi(carrier_id);
    listData.value = response.data.data;
    loading.value = false;
};

emitter.on('updateList', getListData);

onMounted(async () => {
    getListData();
});
</script>
