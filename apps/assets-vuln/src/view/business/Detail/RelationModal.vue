<template>
    <a-modal title="关联应用" centered @cancel="emits('update:open', false)" :confirmLoading="globalState.loading"
             :destroyOnClose="true" @ok="okHandle" :width="676" okText="确认" cancelText="取消"
             :ok-button-props="{ disabled: targetKeys.length === 0 }">
        <a-transfer class="mt-6 base-transfer" v-model:target-keys="targetKeys" :data-source="mockData" show-search
                    :titles="['未关联应用', '已关联应用']" :list-style="{
                        flex: 1,
                        height: '500px',
                    }" :rowKey="record => record.application_id" :render="item => item.application_name"
                    :pagination="{pageSize:20, hideOnSinglePage:true , simple:false , showLessItems:true}"
        >
        </a-transfer>
    </a-modal>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { getAppListApi, bindAppApi } from 'api/bus';
import { useRoute } from 'vue-router';
import { globalState } from '@/store';

const route = useRoute();

const emits = defineEmits(['update:open', 'updateList']);

const targetKeys = ref([]); // 已关联
const mockData = ref([]); // 未关联 整体

onBeforeMount(async () => {
    try {
        const { data } = await getAppListApi({
            business_system_id: Number(route.params.id),
        });
        mockData.value = [...data.data.UnAssociationApplications.filter((item) => item.business_system_id === 0), ...data.data.AssociationApplications];
        targetKeys.value = data.data.AssociationApplications.map((item) => item.application_id);
    } catch (error) {
        console.log(error);
    }
});

const okHandle = async () => {
    try {
        await bindAppApi({
            application_id: targetKeys.value,
            business_system_id: Number(route.params.id),
        });
        emits('update:open', false);
        emits('updateData');
    } catch (error) {
        console.log(error);
    }
};

</script>
