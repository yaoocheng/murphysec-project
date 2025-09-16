<template>
    <div class="px-6 py-2 mb-2 bg-white flex items-center gap-4">
        <div class="flex items-center gap-2">
            <Input class="base-input" v-model:value="filters.component_name" placeholder="搜索软件成分名称" />

            <Select :popupClassName="'base-select-dropdown'" class="base-select" v-model:value="filters.security_capability_id" :options="SOFTWARE_COMPONENT_CATEGORY" placeholder="分类" />

        <!-- <Select :popupClassName="'base-select-dropdown'" class="w-[140px]" v-model:value="filters.ecosystem" :options="SecAble" placeholder="生态" />

        <Select :popupClassName="'base-select-dropdown'" class="w-[140px]" v-model:value="filters.warehouse" :options="SecAble" placeholder="仓库" /> -->
        </div>

        <a-button class="base-button" @click="resetFilter(filters)">重置</a-button>
    </div>

    <div class="px-6 py-4 bg-white">
        <a-table class="base-table" :pagination="false" :ellipsis="true" :loading="{ indicator, spinning: loading }"
                 @change="changePageHandle" :columns="columns" :scroll="{ x: '100%' }" :data-source="listData">
            <template #emptyText>
                <Empty />
            </template>
            <template #bodyCell="{ column, record,text }">

                <template v-if="column.dataIndex === 'component_name' || column.dataIndex === 'repo_name'
                    || column.dataIndex === 'application_name' || column.dataIndex === 'repo_name' || column.dataIndex === 'carrier_type' ">
                    <a-tooltip arrowPointAtCenter>
                        <template #title>{{ text }}</template>
                        <span v-if="column.dataIndex === 'component_name'" class="hover:text-primary hover:underline cursor-pointer">{{ record.component_name }}</span>
                        <span v-else>{{ text }}</span>
                    </a-tooltip>
                </template>

                <template v-else-if="column.type === 'date'">
                    {{ formatDate(text) }}
                </template>

                <template v-else-if="column.dataIndex === 'ecosystem'">
                    <a-tooltip v-if="text" arrowPointAtCenter>
                        <template #title>{{ text }}</template>
                        <span class="ellipsis">{{ text }}</span>
                    </a-tooltip>
                    <span v-else>-</span>
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
import { useRoute } from 'vue-router';
import { getChainListApi } from 'api/app';
import { indicator, resetFilter, formatDate } from 'utils';
import { usePageList } from '@/hooks';
import { SOFTWARE_COMPONENT_CATEGORY } from '@/constants/softwareComponent';

const route = useRoute();
const filters = reactive({
    application_id: Number(route.params.id),
    component_name: undefined,
    component_type: undefined,
    carrier_type: undefined,
});

const {
    pageConfig,
    listData,
    loading,
    changePageHandle,
} = usePageList(getChainListApi, filters);

const columns = ref([
    {
        title: '软件成分名称',
        dataIndex: 'component_name',
        width: 178,
        flex: 'left',
    },
    {
        title: '版本',
        dataIndex: 'component_version',
        width: 178,
        customRender({ text }) { return text || '-'; },
    },
    {
        title: '分类',
        dataIndex: 'component_type',
        width: 178,
        customRender({ text }) { return text || '-'; },
    },
    {
        title: '状态',
        dataIndex: 'status',
        width: 178,
        customRender({ text }) { return text || '-'; },
    },
    {
        title: '供应商',
        dataIndex: 'supplier',
        width: 178,
        customRender({ text }) { return text || '-'; },
    },
    {
        title: '生态',
        dataIndex: 'ecosystem',
        width: 200,
    },
    {
        title: '仓库',
        dataIndex: 'warehouse',
        width: 178,
        customRender({ text }) { return text || '-'; },
    },
    {
        title: '标签',
        dataIndex: 'tag',
        width: 178,
        customRender({ text }) { return text || '-'; },
    },
    {
        title: '创建时间',
        dataIndex: 'created_at',
        width: 250,
        customRender({ text }) { return formatDate(text) || '-'; },
    },
    {
        title: '更新时间',
        dataIndex: 'updated_at',
        width: 250,
        customRender({ text }) { return formatDate(text) || '-'; },
    },
]);

</script>
