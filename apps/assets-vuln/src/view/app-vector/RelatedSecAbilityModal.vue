<template>
    <a-modal title="关联安全能力" centered @cancel="emits('update:open', false)" :confirmLoading="globalState.loading"
             :destroyOnClose="true" @ok="okHandle" :width="'calc(100vw - 80px)'" okText="确认" cancelText="取消">
        <a-transfer class="mt-6 base-transfer" :show-select-all="false" v-model:target-keys="targetKeys" :data-source="mockData"
                    show-search :titles="['未关联安全能力', '已关联安全能力']" :list-style="{
                        flex: 1,
                        height: 'calc(100vh - 218px)',
                    }" :rowKey="record => record.security_capability_id"
                    :filter-option="(inputValue, item) => item.capability_name?.includes(inputValue)"
                    :locale="{ itemUnit: '项', itemsUnit: '项', notFoundContent: '列表为空', searchPlaceholder: '通过安全能力名称搜索' }">
            <template #children="{ filteredItems, selectedKeys, onItemSelect, onItemSelectAll }">
                <div class="p-3 ">
                    <a-table class="base-table" :pagination="{hideOnSinglePage:true, showTotal: () => `共 ${filteredItems?.length} 条`, showSizeChanger: false}" rowKey="security_capability_id" :row-selection="getRowSelection({ selectedKeys, onItemSelect, onItemSelectAll })"
                             :data-source="filteredItems" :columns="columns" size="small"  :scroll="{ y: '100%'}">
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
import { CARRIER_OPTION } from 'constants/app';
import { emitter } from 'utils';
import { globalState } from '@/store';
import { getAppCarrierBindSecAbilityList, getAppCarrierUnbindSecAbilityList, bindAppCarrierSecAbility } from '@/api/appcarrier';
import { getSecurityCapabilityName } from '@/constants/safetyCapabilities';

const { carrier_id } = defineProps(['type', 'carrier_id']);
const emits = defineEmits(['update:open', 'updateList']);

const targetKeys = ref([]); // 已关联
const mockData = ref([]); // 未关联 整体

onBeforeMount(async () => {
    try {
        const { data: bindData } = await getAppCarrierBindSecAbilityList(carrier_id);
        const { data: unbindData } = await getAppCarrierUnbindSecAbilityList({
            carrier_id: Number(carrier_id),
            limit: 1000,
            page: 1,
        });
        console.log(bindData.data, unbindData.data.data_list);
        mockData.value = [...bindData.data, ...unbindData.data.data_list];
        targetKeys.value = bindData.data.map((item) => item.security_capability_id);

        console.log(mockData.value, targetKeys.value);
    } catch (error) {
        console.log(error);
    }
});

const okHandle = async () => {
    try {
        await bindAppCarrierSecAbility({
            carrier_id,
            security_capability_id: targetKeys.value,
        });
        emits('update:open', false);
        emitter.emit('updateCarrierSecurityCapabilityList');
    } catch (error) {
        console.log(error);
    }
};

const columns = ref();

columns.value = [
    {
        dataIndex: 'capability_name',
        title: '安全能力名称',
        ellipsis: true,
        flex: 'left',
    },
    {
        dataIndex: 'capability_type',
        title: '能力类型',
        ellipsis: true,
        customRender({ record }) { return getSecurityCapabilityName(record.capability_type) || '-'; },
    },
];

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
