<template>
    <a-modal title="关联应用" centered @cancel="emits('update:open', false)" :confirmLoading="globalState.loading"
             :destroyOnClose="true" @ok="okHandle" :width="676" okText="确认" cancelText="取消"
             :ok-button-props="{ disabled: targetKeys.length === 0 }">
        <a-transfer class="mt-6" v-model:target-keys="targetKeys" :data-source="mockData" show-search
                    :titles="['未关联应用', '已关联应用']" :list-style="{
                        flex: 1,
                        height: '500px',
                    }" :locale="{ itemUnit: '个', itemsUnit: '个', notFoundContent: '列表为空', searchPlaceholder: '搜索应用名称' }" :rowKey="record => record.application_id" :render="item => item.application_name" />
    </a-modal>
</template>

<script setup>
import { ref, onBeforeMount, watch } from 'vue';
import { getAppListApi } from 'api/app';
import { globalState, userInfo } from '@/store';

const emits = defineEmits(['update:open', 'updateApplicationId']);

const { app_id_list } = defineProps(['app_id_list']);

const targetKeys = ref([]); // 已关联
const mockData = ref([]); // 未关联 整体

watch(() => app_id_list, (newVal) => {
    targetKeys.value = newVal;
}, { immediate: true });

onBeforeMount(async () => {
    try {
        const res = await getAppListApi({
            organize_id: userInfo.value.org_id,
            page: 1,
            page_size: 1000,
        });
        mockData.value = res.data.data.data_list;
    } catch (error) {
        console.log(error);
    }
});

const okHandle = async () => {
    console.log(targetKeys.value);
    emits('updateApplicationId', mockData.value.filter((item) => targetKeys.value.includes(item.application_id)));
    emits('update:open', false);
};

</script>
