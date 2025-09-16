<template>
    <a-modal title="关联应用" centered @cancel="emits('update:open', false)" :confirmLoading="globalState.loading"
             :destroyOnClose="true" @ok="okHandle" :width="676" okText="确认" cancelText="取消"
             :ok-button-props="{ disabled: targetKeys.length === 0 }">
        <a-transfer class="mt-6 base-transfer" v-model:target-keys="targetKeys" :data-source="mockData" show-search
                    :titles="['未关联应用', '已关联应用']" :list-style="{
                        flex: 1,
                        height: '500px',
                    }" :rowKey="record => record.application_id" :render="item => item.application_name" />
    </a-modal>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import {
    getCarrierBindApplicationListApi, bindCarrierApplicationApi, getAppListApi,
} from 'api/app';
import { emitter } from 'utils';
import { globalState, userInfo } from '@/store';

const { carrierId } = defineProps(['carrierId']);
const emits = defineEmits(['update:open', 'updateList']);
const targetKeys = ref([]); // 已关联
const mockData = ref([]); // 未关联 整体

onBeforeMount(async () => {
    try {
        const { data: allData } = await getAppListApi({
            limit: 1000,
            page: 1,
            organize_id: userInfo.value?.org_id,
        });

        const { data } = await getCarrierBindApplicationListApi({
            carrier_id: Number(carrierId),
        });
        console.log(data);
        targetKeys.value = data.data.bind_list.map((item) => item.application_id);
        console.log(targetKeys.value);
        mockData.value = [...allData.data.data_list];
    } catch (error) {
        console.log(error);
    }
});

const okHandle = async () => {
    try {
        await bindCarrierApplicationApi({
            application_id: targetKeys.value,
            carrier_id: Number(carrierId),
        });
        emits('update:open', false);
        // emits('updateList');
        emitter.emit('updateList');
    } catch (error) {
        console.log(error);
    }
};

</script>
