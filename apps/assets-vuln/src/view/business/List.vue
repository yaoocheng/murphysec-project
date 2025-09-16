<template>
    <div class="main-content">
        <div class="h-12 mb-2 bg-white py-[10px] px-6 flex items-center justify-between">
            <div>
                <Input class="mr-2 base-input" v-model:value="filters.name" placeholder="搜索业务系统名称" />
                <!-- <Select :popupClassName="'base-select-dropdown'" class="w-[140px]" v-model:value="filters.status" :options="SYSTEM_STATUS_OPTION" placeholder="系统状态" /> -->
            </div>

            <a-button  @click="addBusinessSystem" class="text-center base-button" type="primary">新增业务系统</a-button>
        </div>

        <div class="h-calc56 px-6 py-4 bg-white overflow-auto">
            <a-table class="base-table" :pagination="false" childrenColumnName="child" :ellipsis="true" :loading="{indicator, spinning: loading}" @change="changePageHandle"
                     :columns="columns" :scroll="{ x: '100%' }" rowKey="business_system_id" :data-source="listData">
                <template #emptyText>
                    <Empty />
                </template>
                <template #bodyCell="{ column,text, record }">
                    <template v-if="column.dataIndex === 'application_number'">
                        {{ record.application_number }}
                        <!-- <a-tooltip>
                            <template #title>关联应用</template>
                            <span @click="openRelationModal = true;sysId=record.business_system_id" class="icon-hover py-1 hover:bg-e6 cursor-pointer">
                                <Svg class="align-[-2px]" name="app-num"></Svg>
                            </span>
                        </a-tooltip> -->
                    </template>

                    <template v-if="column.dataIndex === 'business_system_owner_name'">
                        <User v-if="record.business_system_owner_nick_name || record.business_system_owner_name" :users="[record.business_system_owner_nick_name || record.business_system_owner_name]" />
                        <span v-else>-</span>
                    </template>

                    <template v-if="column.dataIndex === 'group_own'">
                        <span v-if="record.group_own">{{record.group_own}}</span>
                        <span v-else>-</span>
                    </template>

                    <template v-if="column.dataIndex === 'organize_name'">
                        <a-tooltip arrowPointAtCenter>
                            <template #title>{{ text }}</template>
                            {{ text || '-'}}
                        </a-tooltip>
                    </template>

                    <template v-if="column.dataIndex === 'business_system_name'">
                        <a-tooltip  >
                            <template #title>{{ text }}</template>
                            <span class='hover' @click="router.push(ROUTER_PATH.businessManageDetail.replace(':id', record.business_system_id));">{{ text }}</span>
                        </a-tooltip>
                    </template>

                    <template v-if="column.dataIndex === 'operate'">
                        <div class="flex gap-4 items-center">
                            <span @click="openSystemModal = true; editSysData=record" class="cursor-pointer text-primary">编辑</span>

                            <a-popover :overlayStyle="{ zIndex: 500 }"
                                       :overlayInnerStyle="{ padding: '6px 0px', width: '142px' }" placement="bottomLeft" :arrow="false">
                                <template #content>
                                    <div class="cursor-pointer">
                                        <div class="cursor-pointer">
                                            <div @click="turnOnLog(record.business_system_id)" class="table-operation-item px-6 py-2">
                                                <span>操作日志</span>
                                            </div>

                                            <div class="table-operation-item text-error px-6 py-2" @click="canDeleteBusinessSystem(record)">
                                                <span>删除</span>
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
        </div>

        <OperationLogModal v-model:open="opetateLog" v-if="opetateLog" :logfilter="logfilter" />
        <SystemModal v-model:open="openSystemModal" v-if="openSystemModal" :sysTree="listData" @updateList="getData" />

        <RelationModal v-model:open="openRelationModal" v-if="openRelationModal" :sysId="sysId" @updateList="getData" />
    </div>
</template>

<script setup>
import { ref, reactive, h } from 'vue';
import { indicator, formatDate } from 'utils';
import { getBusinessListApi, delBusSysApi } from 'api/bus';
import { useRouter } from 'vue-router';
import { Modal } from 'ant-design-vue';
import { judgeBusinessSystemApi } from 'api/delete';
import { editSysData } from './constants';
import { usePageList } from '@/hooks';
import SystemModal from './SystemModal.vue';
import RelationModal from './RelationModal.vue';
import { ROUTER_PATH } from '@/constants';
import { findSystemStatusLabel } from '@/constants/app';
import warningIcon from '/src/assets/svg/data/icon_warning_colorful-dm.svg';

import { emitter } from '@/utils';

const router = useRouter();

const opetateLog = ref(false);
const logfilter = ref({
    entity_type: 'BusinessSystem',
    entity_id: null, // 这里可以根据实际情况设置
});
// 开启操作日志
const turnOnLog = (business_system_id) => {
    opetateLog.value = true;
    logfilter.value.entity_id = String(business_system_id);
};

const openSystemModal = ref(false);
const openRelationModal = ref(false);
const sysId = ref();
const filters = reactive({
    limit: 1000,
    name: '',
    status: null,
});

const {
    listData,
    loading,
    changePageHandle,
    getData,
} = usePageList(getBusinessListApi, filters);

const columns = ref([
    {
        title: '业务系统名称',
        dataIndex: 'business_system_name',
        fixed: 'left',
        ellipsis: true,
        width: 280,
    },
    {
        title: '状态',
        dataIndex: 'business_system_status',
        width: 100,
        customRender({ text }) {
            return findSystemStatusLabel(text);
        },
    },
    {
        title: '负责人',
        dataIndex: 'business_system_owner_name',
        width: 120,
    },
    {
        title: '所属组织',
        dataIndex: 'organize_name',
        width: 180,
        ellipsis: true,
    },
    {
        title: '开发团队',
        dataIndex: 'group_own',
        width: 140,
    },
    {
        title: '应用数量',
        dataIndex: 'application_number',
        align: 'right',
        width: 110,
    },
    // {
    //     title: '安全能力及安全问题数量',
    //     dataIndex: 'issue',
    //     width: 220,
    // },
    {
        title: '最近更新时间',
        dataIndex: 'updated_at',
        width: 180,
        ellipsis: true,
        customRender({ text }) { return formatDate(text) || '-'; },
    },
    {
        title: '操作',
        dataIndex: 'operate',
        width: 120,
        fixed: 'right',
    },
]);

const delBusSysHandle = async (id) => {
    try {
        await delBusSysApi({
            business_system_id: id,
        });
        getData();
    } catch (error) {
        console.log(error);
    }
};

const addBusinessSystem = () => {
    openSystemModal.value = true;
    editSysData.value = null;
};

// 判断能否删除业务系统
const canDeleteBusinessSystem = async (record) => {
    console.log('canDeleteBusinessSystem', record);
    const { data } = await judgeBusinessSystemApi(record.business_system_id);
    console.log('判断结果:', data);

    if (data.data) {
        Modal.confirm({
            class: 'delete-confirm-modal',
            title: '确认删除此数据吗？',
            icon: h('span', { role: 'img', 'aria-label': 'exclamation-circle', class: 'anticon anticon-exclamation-circle' }, [
                h('img', { src: warningIcon, alt: '信息图标' }),
            ]),
            content: '数据删除后将不可恢复，请谨慎操作！',
            async onOk() {
                try {
                    console.log('删除', record);
                    await delBusSysHandle(record.business_system_id);
                } catch {
                    return console.log('Oops errors!');
                } finally {
                    getData();
                    emitter.emit('updateSysTree');
                }
            },
            onCancel() {

            },
        });
    } else {
        Modal.confirm({
            class: 'delete-confirm-modal',
            title: '无法删除',
            icon: h('span', { role: 'img', 'aria-label': 'exclamation-circle', class: 'anticon anticon-exclamation-circle' }, [
                h('img', { src: warningIcon, alt: '信息图标' }),
            ]),
            content: '该业务系统下关联了其他数据，请解除关联后再删除',
            okCancel: false, // ✅ 去掉取消按钮
            okText: '确定',
            async onOk() {
                console.log('确定删除');
            },
            onCancel() {},
        });
    }
};
</script>
