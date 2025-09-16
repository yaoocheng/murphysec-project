<template>
    <div>
        <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
                <Input class="base-input" v-model:value="filters.component_name" placeholder="搜索软件成分名称" />

                <Select :popupClassName="'base-select-dropdown'" class=" base-select" v-model:value="filters.security_capability_id" :options="SOFTWARE_COMPONENT_CATEGORY" placeholder="分类" />

            <!-- <Select :popupClassName="'base-select-dropdown'" class="w-[140px]" v-model:value="filters.ecosystem" :options="SecAble" placeholder="生态" />

            <Select :popupClassName="'base-select-dropdown'" class="w-[140px]" v-model:value="filters.warehouse" :options="SecAble" placeholder="仓库" /> -->
            </div>

            <a-button class="base-button" @click="resetFilter(filters)">重置</a-button>
        </div>

        <a-table class="base-table" :pagination="false"  :loading="{ indicator, spinning: loading }"
                 @change="changePageHandle" :columns="columns" :scroll="{ x: '100%' }" :data-source="listData">
            <template #emptyText>
                <Empty />
            </template>
            <template #bodyCell="{ column,text, record }">

                <template v-if="column.dataIndex === 'component_name'">
                    <a-tooltip arrowPointAtCenter>
                        <template #title>{{ text }}</template>
                        <span  @click="$router.push(`/software-component/detail/${record.component_id}`)"
                               class="ellipsis hover font-normal">
                            {{ text || '-' }}
                        </span>
                    </a-tooltip>
                </template>

                <template v-if="column.dataIndex === 'business_system_name' || column.dataIndex === 'organize_name'">
                    <a-tooltip arrowPointAtCenter>
                        <template #title>{{ text }}</template>
                        <span class="ellipsis"> {{ text || '-' }} </span>
                    </a-tooltip>
                </template>

                <template v-if="column.dataIndex === 'owner_name'">
                    <User v-if="record.owner_name" :users="[record.owner_name]" />
                    <span v-else>-</span>
                </template>

                <template v-if="column.dataIndex === 'created_at'">
                    <span>{{ formatDate(text) || '-' }}</span>
                </template>

            </template>        </a-table>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { getCarrierRelatedComponentsApi } from 'api/app';
import { indicator, resetFilter, formatDate } from 'utils';
import { usePageList } from '@/hooks';
import { SOFTWARE_COMPONENT_CATEGORY, findSoftwareComponentStatusLabel, findSoftwareComponentCategoryLabel } from '@/constants/softwareComponent';

const { carrier_id } = defineProps(['carrier_id']);

const filters = reactive({
    limit: 1000,
    carrier_id: Number(carrier_id),
    component_name: null,
});

const {
    listData,
    loading,
} = usePageList(getCarrierRelatedComponentsApi, filters);

const columns = ref([
    {
        title: '软件成分名称',
        dataIndex: 'component_name',
        width: 280,
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
        dataIndex: 'asset_type',
        width: 178,
        customRender({ text }) { return findSoftwareComponentCategoryLabel(text) || '-'; },
    },
    {
        title: '状态',
        dataIndex: 'status',
        width: 120,
        customRender({ text }) { return findSoftwareComponentStatusLabel(text) || '-'; },
    },
    {
        title: '供应商',
        dataIndex: 'supplier_name',
        width: 178,
        customRender({ text }) { return text || '-'; },
    },
    {
        title: '生态',
        dataIndex: 'ecosystem',
        width: 120,
        ellipsis: true,
        customRender({ text }) { return text || '-'; },
    },
    {
        title: '仓库',
        dataIndex: 'warehouse',
        width: 120,
        ellipsis: true,
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
        width: 178,
        customRender({ text }) { return formatDate(text) || '-'; },
    },
    {
        title: '更新时间',
        dataIndex: 'updated_at',
        width: 178,
        customRender({ text }) { return formatDate(text) || '-'; },
    },
    // {
    //     title: '操作',
    //     dataIndex: 'operate',
    //     width: 90,
    //     fixed: 'right',
    // },
]);
</script>
