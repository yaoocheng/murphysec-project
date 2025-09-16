<template>
    <a-modal class="add-app-carry-modal" :confirmLoading="globalState.loading" title="新增应用载体" :afterClose="clearFormHandle"
             @cancel="emits('update:open', false)" @ok="okHandle" :width="600" :okButtonProps="{ disabled: okBtndisabled }"
             okText="确认" cancelText="取消">
        <div style="height: calc(100vh - 200px);overflow: auto;" ref="modalContentRef">
            <div class="sticky top-0 z-10 bg-white mb-4">
                <a-anchor class="anchor" direction="horizontal" :target-offset="40" :get-container="() => modalContentRef">
                    <a-anchor-link v-for="(item, $index) in tabs" :key="$index" :href="'#' + item.id" :title="item.title" />
                </a-anchor>
            </div>

            <div class="flex flex-col gap-10">
                <!-- 基本信息 -->
                <div class="flex flex-col gap-4" id="baseInfo">
                    <span class="text-[15px] font-semibold text-gary-700">基本信息</span>

                    <a-form autocomplete="off" class="base-form bg-[#F2F2F280] rounded-md p-6 gap-4 grid grid-cols-2" ref="formRef" :model="formState.baseInfo" layout="vertical">
                        <a-form-item label="应用载体名称" name="name" :rules="[{ required: true, message: '必选项不能为空' }]">
                            <a-input class="leading-5 base-input" v-model:value="formState.baseInfo.name" placeholder="请输入 (例:<protocol>://<ip_or_domain>:<port><path>)" show-count :maxlength="100" />

                        </a-form-item>

                        <a-form-item label="载体类型" name="carrier_type" :rules="[{ required: true, message: '必填项不能为空' }]">
                            <Select class="base-select" :popupClassName="'base-select-dropdown'" v-model:value="formState.baseInfo.carrier_type" :options="CARRIER_OPTION" placeholder="请选择载体类型" />
                        </a-form-item>

                        <a-form-item label="来源" name="source">
                            <a-input class="base-input" v-model:value="formState.baseInfo.source" placeholder="请输入来源" show-count :maxlength="30" />
                        </a-form-item>

                        <a-form-item label="描述" class="col-span-2" name="description">
                            <TextArea :maxlength="200" v-model="formState.baseInfo.description" placeholder="请输入描述"  rows="4"/>
                        </a-form-item>
                    </a-form>
                </div>

                <!-- 详细信息  -->
                <div class="flex flex-col gap-4" id="detailInfo">
                    <span class="text-[15px] font-semibold text-gary-700">详细信息</span>

                    <a-form autocomplete="off" v-if="formState.baseInfo.carrier_type === 'code_repo'"  class="base-form bg-[#F2F2F280] rounded-md p-6 gap-4 grid grid-cols-2" ref="formRef" :model="formState.code_repo_detailInfo" layout="vertical">
                        <a-form-item label="仓库命名空间/组织" name="repo_namespace">
                            <a-input class="base-input" v-model:value="formState.code_repo_detailInfo.repo_namespace" placeholder="请输入仓库命名空间/组织" />
                        </a-form-item>

                        <a-form-item label="仓库名称 " name="repo_name">
                            <a-input class="base-input" v-model:value="formState.code_repo_detailInfo.repo_name" placeholder="请输入仓库名称" />
                        </a-form-item>

                        <a-form-item label="仓库URL" name="repo_url">
                            <a-input class="base-input" v-model:value="formState.code_repo_detailInfo.repo_url" placeholder="请输入仓库URL" />
                        </a-form-item>

                        <a-form-item label="分支名" name="branch">
                            <a-input class="base-input" v-model:value="formState.code_repo_detailInfo.branch" placeholder="请输入分支名" />
                        </a-form-item>
                    </a-form>

                    <a-form  autocomplete="off" v-else class="base-form bg-[#F2F2F280] rounded-md p-6 gap-4 grid grid-cols-2" ref="formRef" :model="formState.service_address_detailInfo" layout="vertical">
                        <a-form-item label="协议类型" name="protocol">
                            <a-input class="base-input" v-model:value="formState.service_address_detailInfo.protocol" placeholder="请输入" />
                        </a-form-item>

                        <a-form-item label="IP" name="ip">
                            <a-input class="base-input" v-model:value="formState.service_address_detailInfo.ip" placeholder="请输入" />
                        </a-form-item>

                        <a-form-item label="端口号" name="port">
                            <a-input class="base-input" v-model:value="formState.service_address_detailInfo.port" placeholder="请输入" />
                        </a-form-item>

                        <a-form-item label="URL路径" name="path">
                            <a-input class="base-input" v-model:value="formState.service_address_detailInfo.path" placeholder="请输入" />
                        </a-form-item>

                        <a-form-item label="域名" name="domain">
                            <a-input class="base-input" v-model:value="formState.service_address_detailInfo.domain" placeholder="请输入" />
                        </a-form-item>

                        <a-form-item label="互联网IP" name="internet_ip">
                            <a-input class="base-input" v-model:value="formState.service_address_detailInfo.internet_ip" placeholder="请输入" />
                        </a-form-item>

                        <a-form-item label="NAT IP" name="nat_ip">
                            <a-input class="base-input" v-model:value="formState.service_address_detailInfo.nat_ip" placeholder="请输入" />
                        </a-form-item>

                        <a-form-item label="内网IP" name="internal_ip">
                            <a-input class="base-input" v-model:value="formState.service_address_detailInfo.internal_ip" placeholder="请输入" />
                        </a-form-item>
                    </a-form>
                </div>

                <!-- 所属应用  -->
                <div class="flex flex-col gap-4" id="applicationCarriers">
                    <div class="flex justify-between">
                        <span class="text-[15px] font-semibold text-gary-700">关联应用<span class="text-red-500"> *</span></span>

                        <div class="flex gap-4">
                            <div class="text-button-blue-line" @click="openRelationAppModal = true">关联应用</div>
                        </div>
                    </div>

                    <a-table :scroll="{ x: '1500px' }" class="app-table" :pagination="false" :columns="app_columns" :data-source="app_data">
                        <template #emptyText>
                            <Empty />
                        </template>
                        <template #bodyCell="{ column, text ,record}">
                            <template v-if="column.dataIndex === 'application_name'">
                                <a-tooltip arrowPointAtCenter>
                                    <template #title>{{ text }}</template>
                                    <span  @click="jumpToAppDetail(record)"
                                           class="ellipsis hover font-normal">
                                        {{ text }}
                                    </span>
                                </a-tooltip>
                            </template>
                        </template>
                    </a-table>
                </div>

            </div>
        </div>

        <RelationAppModal @updateApplicationId="updateApplicationId" v-model:open="openRelationAppModal" v-if="openRelationAppModal"
                          :app_id_list="formState.application_id"/>

    </a-modal>
</template>

<script setup>
import {
    reactive, ref, computed, onMounted,
} from 'vue';
import { createCarrierApi } from 'api/app';
import { useRouter } from 'vue-router';
import { globalState } from '@/store';
import { CARRIER_OPTION } from '@/constants/app';
import RelationAppModal from './RelationAppModal.vue';
import { findSoftwareComponentStatusLabel } from '@/constants/softwareComponent';
import { formatDate } from '@/utils';

const router = useRouter();

const emits = defineEmits(['update:open', 'updateList']);
const formRef = ref();
const formState = reactive({
    // 基本信息
    baseInfo: {
        carrier_type: 'code_repo', // 应用载体类型(如: service_address, code_repo 等)
        name: '', // 应用载体名称(用于展示和快速识别)
        source: null, // 来源
        description: '', // 应用载体的描述(可选)
    },

    // 代码仓库详细信息
    code_repo_detailInfo: {
        repo_namespace: null, // 仓库命名空间/组织（例如: org-name, user-name）
        repo_name: null, // 仓库名称（例如: project-x, api-service）
        repo_url: null, // 仓库URL，用于访问仓库
        branch: null, // 分支名（例如: master, develop, release-1.0）
    },

    // 服务地址详细信息
    service_address_detailInfo: {
        protocol: null, // 协议类型（例如: http, https, ftp, ssh）
        ip: null, // IP地址
        port: null, // 端口号
        path: null, // URL路径
        domain: null, // 域名
        internet_ip: null, // 互联网IP
        nat_ip: null, // NAT IP
        internal_ip: null, // 内网IP
    },

    // 关联应用
    application_id: [], // 关联应用id数组
});

const openRelationAppModal = ref(false);

const app_columns = ref([
    {
        title: '应用名称',
        dataIndex: 'application_name',
        width: 280,
        fixed: 'left',
    },
    {
        title: '应用版本',
        dataIndex: 'application_version',
        width: 178,
        customRender({ text }) { return text || '-'; },
    },
    {
        title: '应用状态',
        dataIndex: 'application_status',
        width: 178,
        customRender({ text }) { return findSoftwareComponentStatusLabel(text) || '-'; },
    },
    {
        title: '应用负责人',
        dataIndex: 'owner_nick_name',
        width: 200,
        customRender({ text }) { return text || '-'; },
    },
    {
        title: '所属业务系统',
        dataIndex: 'business_system_name',
        width: 240,
        customRender({ text }) { return text || '-'; },
    },
    {
        title: '所属组织',
        dataIndex: 'organize_name',
        width: 240,
        customRender({ text }) { return text || '-'; },
    },
    {
        title: '最近更新时间',
        dataIndex: 'updated_at',
        width: 240,
        customRender({ text }) { return text ? formatDate(text) : '-'; },
    },
]);

const app_data = ref([]);
const tabs = ref([
    {
        id: 'baseInfo',
        title: '基本信息',
    },
    {
        id: 'detailInfo',
        title: '详细信息',
    },
    {
        id: 'relatedApplications',
        title: '关联应用',
    },

]);

const modalContentRef = ref(null);

const okBtndisabled = computed(() => !formState.baseInfo.name || !formState.baseInfo.carrier_type || formState.application_id.length === 0);

const clearFormHandle = () => formRef.value.resetFields();

const updateApplicationId = (applicationList) => {
    app_data.value = applicationList;
    formState.application_id = applicationList.map((item) => item.application_id);
};

// 在组件挂载后自动滚动到第一个锚点位置
onMounted(() => {
    setTimeout(() => {
        const firstAnchor = document.querySelector('#baseInfo');
        if (firstAnchor && modalContentRef.value) {
            modalContentRef.value.scrollTo({
                top: firstAnchor.offsetTop - 90,
                behavior: 'smooth',
            });
        }
    }, 300);
});

const okHandle = async () => {
    const data = {
        ...formState.baseInfo,
        ...formState.code_repo_detailInfo,
        ...formState.service_address_detailInfo,
        application_id: formState.application_id,
        port: Number(formState.service_address_detailInfo.port),
    };

    try {
        await createCarrierApi(data);
        emits('update:open', false);
        emits('updateList');
    } catch (error) {
        console.log(error);
    }
};

const jumpToAppDetail = (record) => {
    console.log(record);
    router.push(`/app-manage/detail/${record.application_id}`);
};
</script>

<style>
.add-app-carry-modal {

    margin: 60px 0 0px;
    left: 50%;
    top: 0;
    margin-left: -500px;
    padding-bottom: 0;

    .ant-modal-content{
        padding: 24px;
        /* width: 840px !important; */
        width: 1000px !important;
    }

    .ant-form-item{
        margin-bottom: 0;
    }
}

.app-table{
    .ant-table-thead>tr>th, .ant-table-tbody>tr>td{
        padding: 7px 24px;
        height: 36px;
        font-size: 14px;
    }
    .ant-table-thead>tr>th{
        background-color: #F2F2F2;
        border-bottom: 1px solid #F2F2F2;
        font-weight: 500;
    }

    .ant-table-tbody>tr>td{
        padding: 9px 24px;
        height: 40px;
        font-weight: 400;
    }
}
</style>
