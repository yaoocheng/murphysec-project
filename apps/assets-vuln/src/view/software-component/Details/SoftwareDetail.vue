<template>
    <div ref="mainContentRef" class="main-content flex flex-col gap-2">
        <!-- 基本信息 -->
        <div class="bg-white flex justify-between items-center px-6 py-4">
            <div class="flex flex-1 items-center gap-2">
                <div class="text-xl max-w-[500px] font-medium text-gary-700 leading-[1.6]">{{ data.component_name }}</div>
                <div class="flex w-fit items-center gap-1">
                    <a-tag class="mr-0" v-if="data.component_version" color="#6682FF" :bordered="false">{{ data.component_version }}</a-tag>
                    <!-- <div v-if="data.component_version"  class="text-[10px] font-medium px-1 py-0.5 rounded-sm leading-[1.4]">{{ data.component_version || '-' }}</div> -->
                    <a-tag class="mr-0">{{ '生态：' + (data.ecosystem || '-') }}</a-tag>
                    <a-tag class="mr-0">{{ '仓库：' + (data.repository || '-') }}</a-tag>

                    <!-- <div class="border border-gary-200 border-solid text-[10px] font-medium text-gary-400 px-1 py-0.5 rounded-sm h-[18px] leading-[1.4] flex items-center">{{ '生态：' + (data.ecosystem || '-') }}</div> -->

                    <!-- <div class="border border-gary-200 border-solid text-[10px] font-medium text-gary-400 px-1 py-0.5 rounded-sm h-[18px] leading-[1.4] flex items-center">{{ '仓库：' + (data.repository || '-') }}</div> -->
                </div>
            </div>
            <div class="flex items-center gap-2">
                <div @click="turnOnLog" class="text-button-gray">
                    <Svg height="14px" width="14px" name="log"></Svg>
                    <span>操作日志</span>
                </div>
                <!-- <div class="text-button-blue" @click="handleInviteCollaboration">
                    <Svg name="software_component-icon_share_outlined" width="14" height="14"></Svg>
                    <span class="text-sm leading-[22px]">邀请协作</span>
                </div> -->
            </div>

        </div>

        <!-- 锚点页面 -->
        <div  class="bg-white p-6 gap-6 flex flex-col h-[calc(100%-72px)] relative">
            <!-- 锚点 -->
            <!-- <div class="sticky top-0 z-10 bg-white border-b border-gray-200">
                <div>
                    <a-anchor ref="anchorCompRef" :targetOffset="100" direction="horizontal" :getContainer="() => scrollContainerRef.value">
                        <a-anchor-link v-for="item in SOFTWARE_COMPONENT_DETAIL_LIST" :key="item.value" :href="`#${item.value}`" :title="item.label" />
                    </a-anchor>
                </div>
            </div> -->

            <div ref="scrollContainerRef" class="flex-1 flex flex-col gap-10  overflow-auto softdetail_scroll">

                <div class="sticky top-0 z-10 bg-white border-b border-gray-200">
                    <div>
                        <a-anchor v-if="data.asset_type === 'closed_source_application' "  ref="anchorCompRef" :targetOffset="100" direction="horizontal" :getContainer="getContainer">
                            <a-anchor-link v-for="item in SOFTWARE_COMPONENT_DETAIL_LIST" :key="item.value" :href="`#${item.value}`" :title="item.label" />
                        </a-anchor>

                        <a-anchor v-else ref="anchorCompRef" :targetOffset="100" direction="horizontal" :getContainer="getContainer">
                            <a-anchor-link v-for="item in NON_CLOSED_SOURCE_APPLICATION_SOFTWARE_COMPONENTS_DETAIL_LIST" :key="item.value" :href="`#${item.value}`" :title="item.label" />
                        </a-anchor>
                    </div>
                </div>

                <div v-for="item in (data.asset_type === 'closed_source_application' ? SOFTWARE_COMPONENT_DETAIL_LIST : NON_CLOSED_SOURCE_APPLICATION_SOFTWARE_COMPONENTS_DETAIL_LIST) " :key="item.value" class="flex flex-col gap-4" :id="item.value">
                    <span v-if="item.label === '基本信息' || data.asset_type === 'closed_source_application'"  class="text-[15px] font-semibold text-gary-700 leading-[1.5em]">{{ item.label }}</span>

                    <div v-if="item.type === 'form'" class="grid grid-cols-2 gap-4 p-6 rounded-md bg-[#F2F2F280]">
                        <div v-for="child in item.children" :key="child.value" class="flex flex-col gap-1">
                            <span class="text-xs font-normal text-gray-400">{{ child.label }}</span>
                            <div v-if="child.key === 'asset_type'">
                                <span>{{ findSoftwareComponentCategoryLabel( data[child.key] || '-' ) }}</span>
                            </div>
                            <div v-else-if="child.key === 'status'">
                                <span>{{ findSoftwareComponentStatusLabel( data[child.key] || '-' ) }}</span>
                            </div>
                            <div v-else-if="child.key === 'procurement_type'">
                                <span>{{ findSoftwareComponentPurchaseTypeLabel( data[item.key]?.[child.key] || '-' ) }}</span>
                            </div>
                            <div v-else-if="['operations_owner', 'owner'].includes(child.key)">
                                <span>{{ findUserLabel( data[item.key]?.[child.key] || '-' ) }}</span>
                            </div>
                            <div v-else-if="['operations_owner_team', 'owner_team'].includes(child.key)">
                                <span>{{ findOrgTreeLabel( data[item.key]?.[child.key] || '-' ) }}</span>
                            </div>
                            <div v-else-if="child.key === 'supplier_country'">
                                <span>{{ findSoftwareComponentCountryLabel( data[item.key]?.[child.key] || '-' ) }}</span>
                            </div>
                            <div v-else-if="child.key === 'deployment_model'">
                                <span>{{ findSoftwareComponentDeployModeLabel( data[item.key]?.[child.key] || '-' ) }}</span>
                            </div>
                            <div v-else-if="child.key === 'network_exposure'">
                                <span>{{ findSoftwareComponentNetworkExposureLabel( data[item.key]?.[child.key] || '-' ) }}</span>
                            </div>
                            <div v-else-if="child.key === 'data_sensitivity_level'">
                                <span>{{ findSoftwareComponentDataSensitivityLabel( data[item.key]?.[child.key] || '-' ) }}</span>
                            </div>
                            <div v-else-if="child.type === 'time'">
                                <span>{{ formatDate(data[item.key]?.[child.key] || data[child.key] || '-' ) }}</span>
                            </div>
                            <div v-else-if="child.key === 'deployed_ip_addresses'">
                                <span>{{ data[item.key]?.[child.key]?.filter(Boolean).join('、') || '-' }}</span>
                            </div>
                            <span v-else class="text-sm font-normal text-gray-700">
                                {{ data[item.key]?.[child.key] || data[child.key] || '-' }}
                            </span>
                        </div>
                    </div>

                    <div v-if="item.type === 'table'" class="rounded-md bg-[#F2F2F280]">
                        <a-table class="software-detail-table" :pagination="false" :ellipsis="true"  :columns="item.columns"
                                 :scroll="{ x: '100%'}" :data-source="ListData[item.key].list">
                            <template #emptyText>
                                <Empty />
                            </template>
                            <template #bodyCell="{ column, text, record}">

                                <template v-if="column.dataIndex === 'carrier_type'">
                                    <span>{{ findCarrierTypeLabel(text) }}</span>
                                </template>

                                <template v-else-if="column.dataIndex === 'issue_status'">
                                    <span>{{ findDisposalStatusLabel(text) }}</span>
                                </template>

                                <template v-else-if="column.dataIndex === 'issue_level'">
                                    <span>{{ findSeverityLabel(text) }}</span>
                                </template>

                                <template v-else-if="column.type === 'time'">
                                    <span>{{ formatDate(text)}}</span>
                                </template>

                                <template v-else-if="column.type === 'avatar'">
                                    <User v-if="text" :users="[text]" />
                                    <span v-else>-</span>
                                </template>

                                <template v-else-if="column.dataIndex === 'application_status'">
                                    {{ findApplicationStatusLabel(text) }}
                                </template>

                                <template v-else-if="column.type === 'link'">
                                    <span class="hover ellipsis" @click="handleLinkClick(column,record)">{{ text || '-' }}</span>
                                </template>

                                <template v-else>
                                    <span>{{ text || '-' }}</span>
                                </template>

                            </template>

                        </a-table>

                        <div class="flex justify-end pt-4 bg-white" >
                            <a-pagination class="pagination" :show-total="total => `共 ${total.toLocaleString()} 条`"
                                          show-quick-jumper :total=ListData[item.key].pageConfig.total  @change="ListData[item.key].changePageHandle"
                                          v-model:current="ListData[item.key].pageConfig.current" v-model:pageSize="ListData[item.key].pageConfig.limit" />
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <OperationLogModal v-model:open="opetateLog" v-if="opetateLog"  :logfilter="logfilter"/>
        <InviteCollaborationModal v-if="openInviteCollaborationModal"    v-model:open="openInviteCollaborationModal" :component_id="component_id" />
    </div>

</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import {
    ref, onMounted, reactive, nextTick,
} from 'vue';
import { getChainComponentDetailApi } from 'api/app';
import { getSoftwareComponentAppListApi, getSoftwareComponentCarrierListApi, getSoftwareComponentIssueListApi } from 'api/software';
import { formatDate } from 'utils';
import { NON_CLOSED_SOURCE_APPLICATION_SOFTWARE_COMPONENTS_DETAIL_LIST, SOFTWARE_COMPONENT_DETAIL_LIST, findSoftwareComponentCountryLabel } from '../constants';
import {
    findSoftwareComponentCategoryLabel, findSoftwareComponentStatusLabel, findSoftwareComponentPurchaseTypeLabel, findUserLabel, findOrgTreeLabel,
    findSoftwareComponentDeployModeLabel, findSoftwareComponentNetworkExposureLabel, findSoftwareComponentDataSensitivityLabel,
} from '@/constants/softwareComponent';
import { usePageList } from '@/hooks';
import InviteCollaborationModal from '../Modals/InviteCollaborationModal.vue';
import {
    findCarrierTypeLabel, findDisposalStatusLabel, findSeverityLabel, findApplicationStatusLabel,
} from '@/constants/app';

const mainContentRef = ref(null);
const scrollContainerRef = ref(null);
const anchorCompRef = ref(null);

const route = useRoute(); // 获取当前路由信息
const component_id = route.params.id; // 获取路由中的component_id
const router = useRouter();

const opetateLog = ref(false);
const logfilter = ref({
    entity_type: 'Component',
    entity_id: null, // 这里可以根据实际情况设置
});
// 开启操作日志
const turnOnLog = () => {
    opetateLog.value = true;
    logfilter.value.entity_id = String(component_id);
};

const openInviteCollaborationModal = ref(false);

const data = ref({});

const Appfilters = reactive({
    page: 1,
    limit: 10,
    component_id: null,
});

const Carrierfilters = reactive({
    page: 1,
    limit: 10,
    component_id: null,
});

const Issuefilters = reactive({
    page: 1,
    limit: 10,
    component_id: null,
});

const {
    changePageHandle: changePageHandleApp,
    listData: appList,
    pageConfig: appPageConfig,
} = usePageList(getSoftwareComponentAppListApi, Appfilters);

const {
    changePageHandle: changePageHandleCarrier,
    listData: carrierList,
    pageConfig: carrierPageConfig,
} = usePageList(getSoftwareComponentCarrierListApi, Carrierfilters);

const {
    changePageHandle: changePageHandleIssue,
    listData: issueList,
    pageConfig: issuePageConfig,
} = usePageList(getSoftwareComponentIssueListApi, Issuefilters);

const ListData = ref({

    carrier: {
        list: carrierList,
        pageConfig: carrierPageConfig,
        filters: Carrierfilters,
        changePageHandle: changePageHandleCarrier,
    },

    issue: {
        list: issueList,
        pageConfig: issuePageConfig,
        filters: Issuefilters,
        changePageHandle: changePageHandleIssue,
    },

    application: {
        list: appList,
        pageConfig: appPageConfig,
        filters: Appfilters,
        changePageHandle: changePageHandleApp,
    },

});

// 获取供应链成分详情
const getChainComponentDetail = async () => {
    const response = await getChainComponentDetailApi(component_id);
    data.value = response.data.data;
    // 确保在获取到数据后再调用 getData
    if (data.value.component_id) {
        Appfilters.component_id = data.value.component_id;
        Carrierfilters.component_id = data.value.component_id;
        Issuefilters.component_id = data.value.component_id;
    }
};

onMounted(async () => {
    getChainComponentDetail();
    await nextTick();
    if (anchorCompRef.value && SOFTWARE_COMPONENT_DETAIL_LIST.length > 0) {
        anchorCompRef.value.scrollTo(`#${SOFTWARE_COMPONENT_DETAIL_LIST[0].value}`);
    }
});

// const handleInviteCollaboration = () => {
//     openInviteCollaborationModal.value = true;
// };

const handleLinkClick = (column, record) => {
    console.log(column, record);
    if (column.dataIndex === 'issue_title') {
        router.push(`/sec-issue/detail/${record.issue_id}`);
    } else if (column.dataIndex === 'application_name') {
        router.push(`/app-manage/detail/${record.application_id}`);
    } else if (column.dataIndex === 'name') {
        router.push(`/app-vector/detail/${record.carrier_id}`);
    }
};

/** Anchor 锚点指定滚动的容器 */
function getContainer() {
    // 给组件指定渲染的容器，解决锚点不会随页面滚动而移动的问题
    return document.querySelector('.softdetail_scroll');
}

</script>

<style>
.software-detail-table {
    .ant-table-thead {
        .ant-table-cell {
            background-color: #E6E6E6;
            color: #3C3C3C;
            font-size: 12px;
            font-weight: 500;
            line-height: 18px;
            letter-spacing: 0px;
            height: 32px;
        }
    }

    .ant-table-tbody{
        .ant-table-cell {
            height: 36px !important;
        }
    }
}
</style>
