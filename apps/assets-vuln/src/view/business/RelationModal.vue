<template>
    <a-modal title="关联应用" centered @cancel="emits('update:open', false)" :confirmLoading="globalState.loading"
             :destroyOnClose="true" @ok="okHandle" :width="976" okText="确认" cancelText="取消"
             :ok-button-props="{ disabled: targetKeys.length === 0 }">
        <a-transfer class="mt-6 base-transfer"  v-model:target-keys="targetKeys" :data-source="mockData" show-search showSelectAll :show-select-all="false"
                    :titles="['未关联应用', '已关联应用']" :list-style="{
                        flex: 1,
                        height: 'calc(100vh - 218px)',
                    }" :rowKey="record => record.application_id" :render="item => item.application_name"
                    :select-all-labels="selectAllLabels"
                    :locale="{ itemUnit: '项', itemsUnit: '项', notFoundContent: '列表为空', searchPlaceholder: '搜索应用名称' }"
        >
            <template #children="{ filteredItems, selectedKeys, onItemSelect, onItemSelectAll }">
                <div class="px-3">
                    <a-table class="base-table" :pagination="{pageSize:20, hideOnSinglePage:true , simple:false , showLessItems:true , showSizeChanger:false}" rowKey="application_id" :row-selection="getRowSelection({ selectedKeys, onItemSelect, onItemSelectAll })"
                             :data-source="filteredItems" :columns="columns" size="small"  :scroll="{ y: 'calc(100vh - 428px)'}">
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
import { getAppListApi, bindAppApi } from 'api/bus';
import { globalState } from '@/store';

const { sysId } = defineProps(['sysId']);
const emits = defineEmits(['update:open', 'updateList']);

const targetKeys = ref([]); // 已关联
const mockData = ref([]); // 未关联 整体

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

const columns = [
    {
        dataIndex: 'application_name',
        title: '应用名称',
        ellipsis: true,
        flex: 'left',
    },
    // {
    //     dataIndex: 'carrier_type',
    //     title: '载体类型',
    //     ellipsis: true,
    // },
];

onBeforeMount(async () => {
    try {
        const { data } = await getAppListApi({
            business_system_id: sysId,
        });
        // mockData.value = [...data.data.UnAssociationApplications.filter((item) => item.business_system_id === 0), ...data.data.AssociationApplications];
        mockData.value = [...data.data.UnAssociationApplications, ...data.data.AssociationApplications];
        targetKeys.value = data.data.AssociationApplications.map((item) => item.application_id);
    } catch (error) {
        console.log(error);
    }
});

const okHandle = async () => {
    try {
        await bindAppApi({
            application_id: targetKeys.value,
            business_system_id: sysId,
        });
        emits('update:open', false);
        emits('updateList');
    } catch (error) {
        console.log(error);
    }
};

</script>
