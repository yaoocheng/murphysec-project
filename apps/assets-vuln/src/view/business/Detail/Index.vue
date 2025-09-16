<template>
    <div class="main-content flex flex-col gap-[8px] overflow-auto">
        <!-- 基本信息 -->
        <div class="basic_information flex flex-col gap-[24px] p-[24px] bg-white">
            <div class="flex items-center gap-[12px] justify-between">
                <span class="detail-title">{{ basic_information.business_system_name}}</span>
                <div @click="turnOnLog" class="text-button-gray">
                    <Svg height="14px" width="14px" name="log"></Svg>
                    <span>操作日志</span>
                </div>
            </div>

            <div>
                <div class="flex items-center justify-between">
                    <span style="font-size: 14px; color: #3C3C3C; font-weight: 500; line-height: 22px;">基本信息</span>

                    <a-tooltip placement="right">
                        <template #title>
                            更改系统状态
                        </template>
                        <div @click = "openSystemModal = !openSystemModal; editSysData = basic_information"
                             class="edit-svg">
                            <Svg height="16px" width="16px" name="edit"></Svg>
                        </div>
                    </a-tooltip>
                </div>

                <div class="base_info ">
                    <div class="info_list">
                        <div v-for="item in basicInformationList" :key="item.label" class="info_item">
                            <span class="label">{{ item.label }}</span>
                            <span v-if="item.value === 'business_system_status'">
                                {{ findSystemStatusLabel(basic_information[item.value]) || '-'}}
                            </span>
                            <span v-else class="value">
                                {{ basic_information[item.value] || '-'}}
                            </span>
                        </div>

                        <div class="info_item" style="width: 100%;">
                            <span class="label">系统描述</span>

                            <a-tooltip arrowPointAtCenter>
                                <template v-if="basic_information?.business_system_desc" #title>{{ basic_information?.business_system_desc }}</template>
                                <span class="value">{{ basic_information?.business_system_desc || '-'}}</span>
                            </a-tooltip>
                        </div>

                    </div>

                </div>

            </div>
        </div>
        <!-- 详细信息 -->
        <div class="detailed_information flex flex-col gap-[16px] p-[24px] bg-white">

            <!-- 仪表盘-数据部分 -->
            <div class="flex flex-row gap-2">
                <div v-for="item in countList" :key="item.label" class="count-item">
                    <span class="label">{{ item.label }}</span>
                    <span v-if="item.label === '子业务系统数量'" class="count">{{ item.count>0 ? item.count-1 :item.count }}</span>
                    <span v-else class="count">{{ item.count }}</span>
                </div>
            </div>
        </div>

        <!-- 关联应用信息 -->
        <div class="vulnerability_information flex flex-col gap-[24px] pt-[16px] px-[24px] pb-[24px] bg-white">
            <div class="w-full h-[30px] flex flex-row justify-between">
                <span>关联应用</span>
                <!-- <a-button class="base-button" type="primary" @click="openRelationModal = true">关联应用</a-button> -->
            </div>
            <div class="table_container w-full" >
                <a-table class="base-table" :pagination="false" :ellipsis="true"  :columns="columns"
                         :scroll="{ x: '100%' }" :data-source="component_list" :row-key="(record) => record.vuln_id || new Date().getTime()">
                    <template #emptyText>
                        <Empty />
                    </template>
                    <template #bodyCell="{ column, text, record }">

                        <template v-if="column.dataIndex === 'application_name'">
                            <a-tooltip arrowPointAtCenter>
                                <template #title>{{ text }}</template>
                                <span  @click="$router.push(`/app-manage/detail/${record.application_id}`)"
                                       class="ellipsis hover font-normal">
                                    {{ record.application_name }}
                                </span>
                            </a-tooltip>
                        </template>

                        <template v-else-if="column.dataIndex === 'application_status'">
                            {{ findApplicationStatusLabel(text) }}
                        </template>

                        <template v-else-if="column.dataIndex === 'application_owner_nickname'">
                            <User v-if="text" :users="[text]" />
                            <span v-else>-</span>
                        </template>

                        <template v-else-if="column.dataIndex === 'operation'">
                            <a-popconfirm
                                title="确定取消关联吗？"
                                ok-text="确认"
                                cancel-text="取消"
                                @confirm="cancelRelation(record.application_id)"
                                @cancel="cancel"
                            >
                                <span class="text-primary cursor-pointer">
                                    取消关联
                                </span>
                            </a-popconfirm>

                        </template>

                        <template v-else>
                            <span>
                                {{ text || '-' }}
                            </span>
                        </template>
                    </template>

                </a-table>
            </div>

        </div>

        <OperationLogModal v-model:open="opetateLog" v-if="opetateLog"  :logfilter="logfilter"/>
        <SystemModal v-model:open="openSystemModal" v-if="openSystemModal" :sysTree="listData" @updateList="updateData" />
        <RelationModal v-model:open="openRelationModal" v-if="openRelationModal" @updateData="updateData" />
    </div>

</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, reactive, onMounted } from 'vue';
import {
    getBusSysDetailApi, getBusSysComponentListApi, cancelRelationApi, getBusinessListApi,
} from 'api/bus';
import { getDashboardCountApi } from 'api/panel';
import { editSysData } from '../constants';
import { usePageList } from '@/hooks';
import RelationModal from './RelationModal.vue';
import SystemModal from '../SystemModal.vue';
import { findApplicationStatusLabel, findSystemStatusLabel } from '@/constants/app';

const filters = reactive({
    limit: 1000,
    name: '',
    status: null,
});

const {
    listData,
} = usePageList(getBusinessListApi, filters);

const route = useRoute(); // 获取当前路由信息
const business_system_id = Number(route.params.id); // 获取路由中的issueId

const openRelationModal = ref(false);
const openSystemModal = ref(false);

const basic_information = ref({});
const component_list = ref([]);
const columns = ref([
    {
        title: '应用名称',
        dataIndex: 'application_name',
        width: 178,
    },
    {
        title: '应用版本',
        dataIndex: 'application_version',
        width: 178,
    },
    {
        title: '应用状态',
        dataIndex: 'application_status',
        width: 178,
    },
    {
        title: '应用负责人',
        dataIndex: 'application_owner_nickname',
        width: 178,
    },
    {
        title: '操作',
        dataIndex: 'operation',
        width: 178,
    },
]);

const countList = reactive(
    [
        {
            label: '子业务系统数量',
            count: 0,
            value: 'business_systems',
        },
        {
            label: '应用数量',
            count: 0,
            value: 'application',
        },
        {
            label: '应用载体数量',
            count: 0,
            value: 'carrier',
        },
        {
            label: '成分数量',
            count: 0,
            value: 'component',
        },
        {
            label: '安全问题数量',
            count: 0,
            value: 'issue',
        },
    ],
);

// 基本信息列表
const basicInformationList = ref([
    {
        label: '业务系统ID',
        value: 'business_system_id',
    },
    {
        label: '上级系统',
        value: 'business_system_pid_name',
    },
    {
        label: '系统状态',
        value: 'business_system_status',
    },
    {
        label: '系统负责人',
        value: 'business_system_owner_nickname',
    },
    {
        label: '系统所属组织',
        value: 'organize_name',
    },

]);

// 获取仪表盘数据部分
const getDashboardCount = async () => {
    await Promise.all(countList.map(async (item) => {
        const response = await getDashboardCountApi({
            query_type: item.value,
            business_system_id,
        });
        item.count = response.data.data;
    }));
};

// 获取详细信息
async function getBusSysDetail() {
    const response = await getBusSysDetailApi(business_system_id);
    return response.data.data;
}

// 获取关联应用列表
const getBusSysComponentList = async () => {
    const response = await getBusSysComponentListApi(business_system_id);
    component_list.value = response.data.data;
};

// 更新数据
const updateData = async () => {
    basic_information.value = await getBusSysDetail();
    getDashboardCount();
    await getBusSysComponentList();
};

// 取消关联应用
const cancelRelation = async (application_id) => {
    await cancelRelationApi({
        application_id,
        business_system_id,
    });
    await getBusSysComponentList();
    await updateData();
};

const opetateLog = ref(false);
const logfilter = ref({
    entity_type: 'BusinessSystem',
    entity_id: null, // 这里可以根据实际情况设置
});
// 开启操作日志
const turnOnLog = () => {
    opetateLog.value = true;
    logfilter.value.entity_id = String(business_system_id);
};

onMounted(async () => {
    basic_information.value = await getBusSysDetail();
    getDashboardCount();
    await getBusSysComponentList();
});

</script>

<style scoped>

.edit-svg{
    height: 24px;
    width: 24px;
    display: flex;
    padding: 4px;
    border-radius: 4px;

    &:hover{
        background-color: #e6e6e6;
    }

}

.count-item{
    width: calc((100% - 24px * 4)/5);
    display: flex;
    flex-direction: column;
    gap: 4px;
    border-right: 1px solid #E5E7EB;

    .label{
        font-size: 16px;
        color: #1D2129;
        font-weight: 500;
        line-height: 28px;
    }

    .count{
        font-size: 24px;
        color: #999999;
        font-weight: 700;
        line-height: 150%;
    }

    &:last-child{
        border-right: none;
    }
}

.base_info {
    margin-top: 12px;
    overflow: hidden;
}

.info_list{
    display: flex;
    flex-wrap: wrap;
    gap: 16px;

    .info_item {
        width: calc((100% - 64px)/5);
        height: 48px;
        display: flex;
        flex-direction: column;
        gap: 4px;

        .label {
            font-size: 12px;
            color: #999999;
            font-weight: 400;
            line-height: 20px;
            display: flex;
            gap: 4px;
        }

        .value {
            font-size: 14px;
            color: #3C3C3C;
            font-weight: 400;
            line-height: 22px;
            padding: 1px 0px;
            gap: 10px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: flex;
            align-items: center;

        }
    }
}

.expand-item{
    display: flex;
    flex-direction: column;
    gap: 8px;

    .expand-item-title{
        color: #3C3C3C;
        font-size: 14px;
        font-weight: 500;
    }

    .expand-item-content{
        color: #3C3C3C;
        font-size: 14px;
        font-weight: 400;
    }
}

</style>

<style>
.base-info-popover {
    .ant-popover-content{
        /* width:52px !important; */
        width: auto !important;
        height: 38px !important;
        padding: 0px !important;

        border-radius: 4px !important;
        .ant-popover-inner{

            .ant-popover-inner-content{
                color:#ffffff !important;
                font-size: 14px !important;
                line-height: 22px !important;
            }
        }
    }
}

.main-content{
    .ant-pagination-item-active {
    border: none;
    background-color: #F4F8FF;

    a {
        color: #5777FF;
    }
}

}

.ant-modal-header{
    margin-bottom: 24px !important;
}

.ant-modal-body{
    .ant-select{
        width: 100% !important;
    }
}

.ant-modal-footer{
    margin-top: 24px !important;
}
</style>
