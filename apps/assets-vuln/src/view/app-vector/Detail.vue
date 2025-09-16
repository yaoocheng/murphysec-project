<template>
    <div class="main-content flex flex-col gap-[8px] overflow-auto">
        <!-- 基本信息 -->
        <div class="basic_information flex flex-col gap-[24px] p-[24px] bg-white">
            <div class="flex items-center gap-[12px] justify-between">
                <span class="detail-title">{{ basic_information.name}}</span>
                <div @click="turnOnLog" class="text-button-gray">
                    <Svg height="14px" width="14px" name="log"></Svg>
                    <span>操作日志</span>
                </div>
            </div>

            <div class="flex flex-col gap-[8px]">
                <div class="flex items-center">
                    <span style="font-size: 14px; color: #3C3C3C; font-weight: 500; line-height: 22px;">基本信息</span>
                </div>

                <div class="info_list">

                    <div :style="{ width: item.value === 'description' ? '100%' : '' }"
                         class="info_item" v-for="item in basic_information_title" :key="item.label">
                        <span class="label">{{ item.label }}</span>
                        <span class="value">

                            <a-tooltip v-if="item.value === 'description'" arrowPointAtCenter>
                                <template #title>{{ basic_information[item.value] }}</template>
                                <span class="ellipsis">{{ basic_information[item.value] || '-' }}</span>
                            </a-tooltip>

                            <span v-else-if="item.value === 'carrier_type'" class="value">
                                {{ CARRIER_OPTION.find(option => option.value === basic_information[item.value])?.label || '-' }}
                            </span>

                            <span v-else-if="item.value === 'tags'" class="value">
                                {{ Array.isArray(basic_information[item.value]) ? basic_information[item.value].join('，') || '-' : basic_information[item.value] || '-' }}
                            </span>

                            <span v-else-if="item.value === 'created_at' || item.value === 'updated_at'" class="value">{{ formatDate(basic_information[item.value]) || '-'}}</span>

                            <span v-else class="value">{{ basic_information[item.value] || '-'}}</span>
                        </span>
                    </div>
                </div>

            </div>
        </div>
        <!-- 详细信息 -->
        <div class="detailed_information flex flex-col gap-[16px] p-[24px] bg-white">
            <div class="flex flex-col gap-[8px]">
                <div class="flex items-center">
                    <span style="font-size: 14px; color: #3C3C3C; font-weight: 500; line-height: 22px;">详细信息</span>
                </div>
                <div class="info_list">
                    <div class="info_item" v-for="item in basic_information.carrier_type === 'code_repo' ?
                             detailed_information_title_code_repo : detailed_information_title_service_address"
                         :key="item.label">
                        <span class="label">{{ item.label }}</span>
                        <span class="value">
                            <a-tooltip arrowPointAtCenter>
                                <template #title>{{ basic_information[item.value] }}</template>
                                {{ basic_information[item.value] || '-' }}
                            </a-tooltip>
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 列表 -->
        <div class="list_container flex flex-col gap-[24px] p-[24px] bg-white">
            <a-tabs v-model:activeKey="activeKey">
                <template #rightExtra>
                    <a-button v-if="activeKey === '1'" type="primary" @click="relationModalOpen = true" class="base-button">关联应用</a-button>
                </template>
                <a-tab-pane key="1" tab="所属应用">
                    <Apps :carrier_id/>
                </a-tab-pane>
                <a-tab-pane key="2" tab="安全问题">
                    <SecIssues :carrier_id/>
                </a-tab-pane>
                <a-tab-pane key="3" tab="软件成分">
                    <SoftwareComponents :carrier_id/>
                </a-tab-pane>
                <a-tab-pane key="4" tab="已覆盖安全能力">
                    <CoverSecCapabilities :carrier_id/>
                </a-tab-pane>
            </a-tabs>
        </div>
    </div>

    <OperationLogModal v-model:open="opetateLog" v-if="opetateLog" :logfilter="logfilter" />
    <RelationModal :open="relationModalOpen" v-if="relationModalOpen" :carrierId="carrier_id" @update:open="relationModalOpen = false" />

</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import {
    getCarrierDetailApi,
} from 'api/app';
import { formatDate } from 'utils';
import { CARRIER_OPTION } from 'constants/app';
import Apps from './Lists/Apps.vue';
import SecIssues from './Lists/SecIssues.vue';
import SoftwareComponents from './Lists/SoftwareComponents.vue';
import CoverSecCapabilities from './Lists/CoverSecCapabilities.vue';
import RelationModal from './RelationModal.vue';

const route = useRoute(); // 获取当前路由信息
const carrier_id = route.params.id; // 获取路由中的carrierId

const activeKey = ref('1');

const relationModalOpen = ref(false);

const basic_information = ref({});

const basic_information_title = [
    { label: '载体类型', value: 'carrier_type' },
    { label: '载体来源', value: 'source' },
    { label: '标签', value: 'tags' },
    { label: '创建时间', value: 'created_at' },
    { label: '更新时间', value: 'updated_at' },
    { label: '描述', value: 'description' },
];

const detailed_information_title_code_repo = [
    { label: '仓库命名空间/组织', value: 'repo_namespace' },
    { label: '仓库名称', value: 'repo_name' },
    { label: '仓库 URL', value: 'repo_url' },
    { label: '分支名', value: 'branch' },
];

const detailed_information_title_service_address = [
    { label: '协议类型', value: 'protocol' },
    { label: 'IP', value: 'ip' },
    { label: '端口号', value: 'port' },
    { label: 'URL路径', value: 'path' },
    { label: '域名', value: 'domain' },
    { label: '互联网IP', value: 'internet_ip' },
    { label: 'NAT IP', value: 'nat_ip' },
    { label: '内网 IP', value: 'intranet_ip' },
];

// 获取应用载体基本信息
async function getSecDetail() {
    const response = await getCarrierDetailApi(carrier_id);
    return response.data.data;
}

const opetateLog = ref(false);
const logfilter = ref({
    entity_type: 'Carrier',
    entity_id: null, // 这里可以根据实际情况设置
});
// 开启操作日志
const turnOnLog = () => {
    opetateLog.value = true;
    logfilter.value.entity_id = String(carrier_id); // 设置当前载体ID
};

onMounted(async () => {
    basic_information.value = await getSecDetail();
});

</script>

<style scoped>

.base_info {
    margin-top: 12px;
    height: 48px;
    overflow: hidden;
}

.base_info.expanded {
    height: auto;
}

.info_list{
    display: flex;
    flex-wrap: wrap;
    gap: 16px;

    .info_item {
        width: calc((100% - 48px)/4);
        height: 48px;
        display: flex;
        flex-direction: column;
        gap: 4px;

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
