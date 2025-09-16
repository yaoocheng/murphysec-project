<template>
    <div>
        <div class="flex justify-between">
            <div class="flex items-center gap-4">
                <div class="flex items-center gap-2">
                    <Input class="base-input" v-model:value="filters.name" placeholder="搜索安全能力名称" />

                    <!-- <Select :showArrow="true" :popupClassName="'security-capability-type-select'" class="min-w-[140px]" :max-tag-count="1" mode="multiple" v-model:value="filters.type" :options="SECURITY_CAPABILITY_TYPE" placeholder="安全能力类型" :maxTagPlaceholder="(omittedValues) => '+'+omittedValues.length" /> -->

                    <Select :popupClassName="'security-capability-type-select'" class="base-select"  v-model:value="filters.type" :options="SECURITY_CAPABILITY_TYPE" placeholder="安全能力类型" />

                    <Select :popupClassName="'base-select-dropdown'" class="base-select" v-model:value="filters.source" :options="COVERED_SECURITY_CAPABILITY_SOURCE" placeholder="来源" />
                </div>

                <a-button class="base-button" @click="resetFilter(filters)">重置</a-button>
            </div>

            <a-button class="base-button" @click="openRelatedSecAbilityModal = true" type="primary">补充安全能力</a-button>
        </div>

        <!-- <a-table class="base-table" :pagination="false"  :loading="{ indicator, spinning: loading }"
                 @change="changePageHandle" :columns="columns" :scroll="{ x: '100%' }" :data-source="listData"> -->
        <a-table class="base-table" :pagination="false"
                 :columns="columns" :scroll="{ x: '100%' }" :data-source="tableList">
            <template #emptyText>
                <Empty />
            </template>
            <template #headerCell="{ column }">
                <template v-if="column.dataIndex === 'source_type'">
                    <span class="flex items-center gap-1">
                        来源
                        <a-tooltip>
                            <template #title>
                                <div>
                                    接入漏洞数据时，系统将根据扫描记录识别应用载体覆盖了哪些安全能力；若未识别到，可通过手动添加已覆盖的安全能力
                                </div>
                            </template>
                            <Svg name="maybe_filled" color="#6C87FF" height="16px" width="16px" ></Svg>
                        </a-tooltip>
                    </span>
                </template>
            </template>

            <template #bodyCell="{ column,text, record }">

                <template v-if="column.dataIndex === 'component_name'">
                    <a-tooltip arrowPointAtCenter>
                        <template #title>{{ text }}</template>
                        <span  @click="$router.push(`/supply-component/detail/${record.component_id}`)"
                               class="ellipsis hover font-normal">
                            {{ text || '-' }}
                        </span>
                    </a-tooltip>
                </template>

                <template v-if="column.dataIndex === 'operate'">
                    <!-- <div @click="delSecAble(record.security_capability_id)" class="text-button-red">删除</div> -->
                    <div @click="unbindSecAbility(record.security_capability_id)" class="text-button-red">取消关联</div>
                </template>

            </template>
        </a-table>

        <RelatedSecAbilityModal v-if="openRelatedSecAbilityModal" v-model:open="openRelatedSecAbilityModal" :carrier_id="carrier_id" />
    </div>
</template>

<script setup>
import {
    ref, onMounted, reactive, watch,
} from 'vue';
import { getCarrierSecurityCapabilityApi } from 'api/app';
import { resetFilter, formatDate, emitter } from 'utils';
import { SECURITY_CAPABILITY_TYPE, getSecurityCapabilityShortName } from 'constants/safetyCapabilities';
import { unbindAppCarrierSecAbility } from 'api/appcarrier';
import RelatedSecAbilityModal from '../RelatedSecAbilityModal.vue';
import { COVERED_SECURITY_CAPABILITY_SOURCE, findCoverSecCapabilitySource } from '../constants';
import Svg from '@/components/Svg.vue';

const { carrier_id } = defineProps(['carrier_id']);
const openRelatedSecAbilityModal = ref(false);

const filters = reactive({
    name: null,
    type: null,
    source: null,
});

const listData = ref([]);
const tableList = ref([]);

watch(filters, () => {
    let filteredList = listData.value;

    if (filters.name) {
        filteredList = filteredList.filter((item) => item.capability_name.includes(filters.name));
    }
    if (filters.type) {
        filteredList = filteredList.filter((item) => item.capability_type.includes(filters.type));
    }
    if (filters.source) {
        filteredList = filteredList.filter((item) => item.source_type.includes(filters.source));
    }

    tableList.value = filteredList;
});

const getCarrierSecurityCapability = async () => {
    const res = await getCarrierSecurityCapabilityApi(carrier_id);
    listData.value = res.data.data;
    tableList.value = res.data.data;
    console.log(res.data);
};

onMounted(() => {
    getCarrierSecurityCapability();
});
const columns = ref([
    {
        title: 'ID',
        dataIndex: 'security_capability_id',
        width: 100,
    },
    {
        title: '安全能力名称',
        dataIndex: 'capability_name',
        width: 280,
    },
    {
        title: '安全能力类型',
        dataIndex: 'capability_type',
        width: 180,
        customRender({ text }) { return getSecurityCapabilityShortName(text) || '-'; },
    },
    {
        title: '来源',
        dataIndex: 'source_type',
        width: 180,
        customRender({ text }) { return findCoverSecCapabilitySource(text)?.label || '-'; },
    },
    {
        title: '创建时间',
        dataIndex: 'created_at',
        width: 180,
        customRender({ text }) { return formatDate(text) || '-'; },
    },
    {
        title: '操作',
        dataIndex: 'operate',
        width: 100,
        fixed: 'right',
    },
]);

// 删除安全能力
// const delSecAble = async (id) => {
//     const res = await delSecAbleApi({ id });
//     console.log(res);
// };

// 解绑安全能力
const unbindSecAbility = async (id) => {
    const res = await unbindAppCarrierSecAbility({
        carrier_id: Number(carrier_id),
        security_capability_id: [id],
    });
    console.log(res);
    getCarrierSecurityCapability();
};

emitter.on('updateCarrierSecurityCapabilityList', getCarrierSecurityCapability);

</script>
