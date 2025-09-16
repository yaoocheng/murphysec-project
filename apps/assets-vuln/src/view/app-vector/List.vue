<template>
    <div class="main-content">
        <div class="h-12 mb-2 bg-white py-[10px] px-6 flex items-center justify-between">
            <div class="flex items-center gap-4">
                <div class="flex items-center gap-2">
                    <Input class="base-input" v-model:value="filters.name" placeholder="搜索载体名称" />

                    <Select :popupClassName="'base-select-dropdown'" class="base-select" v-model:value="filters.type" :options="CARRIER_OPTION" placeholder="载体类型" />

                    <Select :popupClassName="'security-capability-type-select'" class="base-select" v-model:value="filters.source" :options="SECURITY_CAPABILITY_TYPE" placeholder="安全能力类型" />
                </div>

                <a-button class="base-button" @click="resetFilter(filters)">重置</a-button>
            </div>

        </div>

        <div class="h-calc56 px-6 py-4 bg-white overflow-auto">
            <a-table class="base-table" :pagination="false" :loading="{ indicator, spinning: loading }"
                     @change="changePageHandle" :columns="columns" :scroll="{ x: '100%' }" :data-source="listData">
                <template #emptyText>
                    <Empty />
                </template>
                <template #bodyCell="{ column,text, record }">

                    <template v-if="column.dataIndex === 'name'">
                        <a-tooltip arrowPointAtCenter>
                            <template #title>{{ text }}</template>
                            <span  @click="$router.push(`/app-vector/detail/${record.carrier_id}`)"
                                   class="hover ellipsis">
                                {{ record.name }}
                            </span>
                        </a-tooltip>
                    </template>

                    <template v-if="column.dataIndex === 'carrier_type'">
                        <span>{{ CARRIER_OPTION.find(option => option.value === text)?.label || '-' }}</span>
                    </template>

                    <template v-if="column.dataIndex === 'business_system_name' || column.dataIndex === 'organize_name'">
                        <a-tooltip arrowPointAtCenter>
                            <template #title>{{ text }}</template>
                            <span> {{ text || '-' }} </span>
                        </a-tooltip>
                    </template>

                    <template v-if="column.dataIndex === 'owner_name'">
                        <User v-if="record.owner_name" :users="[record.owner_name]" />
                        <span v-else>-</span>
                    </template>

                    <template v-if="column.dataIndex === 'capability_types'">
                        <a-tag>{{ getSecurityCapabilityShortName(text?.[0]) }}</a-tag>

                        <a-popover v-if="text?.length >1">
                            <template #content>
                                <a-tag v-for="item in text.slice(1)" :key="item">{{ getSecurityCapabilityShortName(item) }}</a-tag>
                            </template>
                            <a-tag>+{{ text.length-1}}</a-tag>
                        </a-popover>

                    </template>

                    <template v-if="column.dataIndex === 'operate'">
                        <div class="flex gap-4 items-center">
                            <a-popover :overlayStyle="{ zIndex: 500 }"
                                       :overlayInnerStyle="{ padding: '6px 0px', width: '142px' }" placement="bottomLeft" :arrow="false">
                                <template #content>
                                    <div class="cursor-pointer">
                                        <div class="cursor-pointer">
                                            <div @click="turnOnLog(record.carrier_id)" class="table-operation-item px-6 py-2">
                                                <span>操作日志</span>
                                            </div>
                                        </div>

                                    </div>

                                </template>
                                <span class="icon-hover hover:bg-f2 cursor-pointer">
                                    <EllipsisOutlined class="text-3c text-base" />
                                </span>
                            </a-popover>
                        </div>

                    </template>

                </template>
            </a-table>

            <div class="flex justify-end mt-4">
                <a-pagination class="pagination" :show-total="total => `共 ${total.toLocaleString()} 条`"
                              show-quick-jumper :total=pageConfig.total  @change="changePageHandle"
                              v-model:current="pageConfig.current" v-model:pageSize="filters.limit" />
            </div>
        </div>

        <OperationLogModal v-model:open="opetateLog" v-if="opetateLog" :logfilter="logfilter" />
    </div>

</template>

<script setup>
import { ref, reactive } from 'vue';
import { getCarrierListByOrganizeApi } from 'api/app';
import { indicator, formatDate, resetFilter } from 'utils';
import { CARRIER_OPTION } from 'constants/app';
import { usePageList } from '@/hooks';
import { SECURITY_CAPABILITY_TYPE, getSecurityCapabilityShortName } from '@/constants/safetyCapabilities';

const opetateLog = ref(false);
const logfilter = ref({
    entity_type: 'Carrier',
    entity_id: null, // 这里可以根据实际情况设置
});
// 开启操作日志
const turnOnLog = (carrier_id) => {
    opetateLog.value = true;
    logfilter.value.entity_id = String(carrier_id);
};

const filters = reactive({
    name: '',
    type: null,
    limit: 15,
});

const {
    pageConfig,
    listData,
    loading,
    changePageHandle,
} = usePageList(getCarrierListByOrganizeApi, filters);

const columns = ref([
    {
        title: '载体名称',
        dataIndex: 'name',
        width: 400,
        fixed: 'left',
        ellipsis: true,
    },
    {
        title: '载体类型',
        dataIndex: 'carrier_type',
        width: 100,
        customRender({ text }) { return text || '-'; },
    },
    {
        title: '来源',
        dataIndex: 'source',
        width: 100,
        ellipsis: true,
        customRender({ text }) { return text || '-'; },
    },
    {
        title: '关联应用',
        dataIndex: 'application_count',
        width: 90,
        align: 'right',
    },

    {
        title: '安全问题',
        dataIndex: 'issue_count',
        width: 90,
        align: 'right',
    },
    {
        title: '安全能力类型',
        dataIndex: 'capability_types',
        width: 140,
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
    //     width: 60,
    //     fixed: 'right',
    // },
]);

</script>
