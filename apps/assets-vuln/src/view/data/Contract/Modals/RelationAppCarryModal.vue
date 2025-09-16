<template>
    <a-modal title="关联应用载体" centered @cancel="emits('update:open', false)" :confirmLoading="globalState.loading"
             :destroyOnClose="true" @ok="okHandle" :width="676" okText="确认" cancelText="取消"
             :ok-button-props="{ disabled: targetKeys?.length === 0 }">
        <a-spin :spinning="globalState.loading" tip="加载中...">
            <a-transfer class="mt-6" v-model:target-keys="targetKeys" :data-source="mockData" show-search
                        :titles="['未关联应用载体', '已关联应用载体']" :list-style="{
                            flex: 1,
                            height: '500px',
                        }" :locale="{ itemUnit: '个', itemsUnit: '个', notFoundContent: '列表为空', searchPlaceholder: '搜索应用载体名称' }" :rowKey="record => record.carrier_id" :render="item => item.name" />
        </a-spin>
    </a-modal>
</template>

<script setup>
import { ref, onBeforeMount, watch } from 'vue';
import { getSoftwareComponentBindCarrierApi, bindSoftwareComponentCarrierApi } from 'api/software';
import { getCarrierListByOrganizeApi } from 'api/app';
import { globalState, userInfo } from '@/store';

const emits = defineEmits(['update:open', 'updateList', 'changeCarrierList', 'updateList']);

const { app_carry_list, softwareComponentId } = defineProps(['app_carry_list', 'softwareComponentId']);

const targetKeys = ref([]); // 已关联
const mockData = ref([]); // 未关联 整体

onBeforeMount(async () => {
    if (softwareComponentId) {
        const response = await getCarrierListByOrganizeApi({
            limit: 100000,
            page: 1,
            organize_id: userInfo.value.org_id,
        });

        const allData = response.data.data.data_list;

        const { data: bindData } = await getSoftwareComponentBindCarrierApi(softwareComponentId);
        targetKeys.value = bindData.data?.map((item) => item.carrier_id) || [];

        mockData.value = [...allData || []];
    } else {
        const response = await getCarrierListByOrganizeApi({
            limit: 100000,
            page: 1,
            organize_id: userInfo.value.org_id,
        });

        mockData.value = response.data.data.data_list;
    }
});

watch(() => app_carry_list, (newVal) => {
    targetKeys.value = newVal;
}, { immediate: true });

const okHandle = async () => {
    if (softwareComponentId) {
        await bindSoftwareComponentCarrierApi({
            component_id: softwareComponentId,
            carrier_id: targetKeys.value,
        });
        emits('updateList');
    } else {
        emits('changeCarrierList', mockData.value.filter((item) => targetKeys.value.includes(item.carrier_id)));
    }
    emits('update:open', false);
};

</script>
