<template>
    <a-modal title="关联应用载体" centered @cancel="emits('update:open', false)" :confirmLoading="globalState.loading"
             :destroyOnClose="true" @ok="okHandle" :width="'calc(100vw - 80px)'" okText="确认" cancelText="取消">
        <a-transfer class="mt-6 base-transfer" :show-select-all="false" v-model:target-keys="targetKeys" :data-source="mockData"
                    show-search :titles="['未关联应用载体', '已关联应用载体']" :list-style="{
                        flex: 1,
                        height: 'calc(100vh - 218px)',
                    }" :rowKey="record => record.carrier_id"
                    :filter-option="(inputValue, item) => item.name?.includes(inputValue)"
                    :locale="{ itemUnit: '项', itemsUnit: '项', notFoundContent: '列表为空', searchPlaceholder: '请输入载体名称' }">
            <template #children="{ filteredItems, selectedKeys, onItemSelect, onItemSelectAll }">
                <div class="p-3 ">
                    <a-table class="base-table" :pagination="{hideOnSinglePage:true, showTotal: () => `共 ${filteredItems?.length} 条`}" rowKey="carrier_id" :row-selection="getRowSelection({ selectedKeys, onItemSelect, onItemSelectAll })"
                             :data-source="filteredItems" :columns="columns" size="small"  :scroll="{ y: '520px'}">
                        <template #emptyText>
                            <Empty />
                        </template>
                        <template #bodyCell="{ column, text }">
                            <template v-if="column.dataIndex === 'carrier_type' ">
                                {{ CARRIER_OPTION.find((item) => item.value === text)?.label }}
                            </template>
                        </template>
                    </a-table>
                </div>
            </template>
        </a-transfer>
    </a-modal>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { getAppCarrierApi, bindAppCarrierApi } from 'api/app';
import { useRoute } from 'vue-router';
import { CARRIER_OPTION } from 'constants/app';
import { globalState } from '@/store';

const route = useRoute();
const { type } = defineProps(['type']);
const emits = defineEmits(['update:open', 'updateList']);

const targetKeys = ref([]); // 已关联
const mockData = ref([]); // 未关联 整体

onBeforeMount(async () => {
    try {
        const { data } = await getAppCarrierApi({
            application_id: Number(route.params.id),
        });
        mockData.value = [...(data.data.bind_list || []), ...data.data.unbind_list];
        targetKeys.value = data.data.bind_list?.map((item) => item.carrier_id);
    } catch (error) {
        console.log(error);
    }
});

const okHandle = async () => {
    try {
        await bindAppCarrierApi({
            application_id: Number(route.params.id),
            carrier_type: type,
            carrier_id: targetKeys.value,
        });
        emits('update:open', false);
        emits('updateList');
    } catch (error) {
        console.log(error);
    }
};

const columns = ref();

columns.value = [
    {
        dataIndex: 'name',
        title: '载体名称',
        ellipsis: true,
        flex: 'left',
    },
    {
        dataIndex: 'carrier_type',
        title: '载体类型',
        ellipsis: true,
    },
];

// if (type === 'code_repo') {
//     columns.value = [
//         {
//             dataIndex: 'repo_name',
//             title: '仓库名称',
//             ellipsis: true,
//         },
//         {
//             dataIndex: 'repo_url',
//             title: '仓库地址',
//             ellipsis: true,
//         },
//     ];
// } else if (type === 'artifact') {
//     columns.value = [
//         {
//             dataIndex: 'repo_name',
//             title: '制品名称',
//             ellipsis: true,
//         },
//         {
//             dataIndex: 'repo_url',
//             title: '制品地址',
//             ellipsis: true,
//         },
//     ];
// } else {
//     columns.value = [
//         {
//             dataIndex: 'repo_name',
//             title: '服务名称',
//             ellipsis: true,
//         },
//         {
//             dataIndex: 'repo_url',
//             title: '服务地址',
//             ellipsis: true,
//         },
//         {
//             dataIndex: 'repo_port',
//             title: '服务端口号',
//             ellipsis: true,
//         },
//     ];
// }

// 表格选择
const getRowSelection = ({ selectedKeys, onItemSelect, onItemSelectAll }) => ({
    onSelectAll(selected, selectedRows) {
        onItemSelectAll(selectedRows.map(({ key }) => key), selected);
    },
    onSelect({ key }, selected) {
        onItemSelect(key, selected);
    },
    selectedRowKeys: selectedKeys,
});
</script>
