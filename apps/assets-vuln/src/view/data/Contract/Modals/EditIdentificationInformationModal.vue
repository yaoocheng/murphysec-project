<template>
    <a-modal class="edit-identification-information-modal" :confirmLoading="globalState.loading" title="编辑识别信息" :afterClose="clearFormHandle"
             @cancel="emits('update:open', false)" @ok="okHandle" :width="600" :okButtonProps="{ disabled: okBtndisabled }"
             okText="创建软件成分" cancelText="取消" :footer="progress !== 'step_1' ? null : undefined">

        <!-- 步骤部分 -->
        <div class="flex justify-center">
            <Svg :name="`software_component-${progress}`" width="810" height="90"></Svg>
        </div>

        <div v-if="progress === 'step_1'">
            <div class="sticky top-0 z-10 bg-white -mx-6 px-6">
                <a-anchor class="anchor" direction="horizontal" :target-offset="33"  :get-container="getContainer" @click="handleClickAnchor">
                    <a-anchor-link v-for="(item, $index) in tabs" :key="$index" :href="'#' + item.id" :title="item.title" />
                </a-anchor>
            </div>

            <div class="flex flex-col gap-10">
                <!-- 基本信息 -->
                <div class="flex flex-col gap-4" id="baseInfo">
                    <span class="text-[15px] font-semibold text-gary-700">基本信息</span>

                    <a-form class="base-form bg-[#F2F2F280] rounded-md p-6 gap-4 grid grid-cols-2" ref="formRef" :model="formState" layout="vertical">

                        <a-form-item label="合同文件名称" name="filename" :rules="[{ required: true, message: '必填项不能为空' }]">
                            <div class="flex gap-2 items-center">
                                <a-input class="flex-1" disabled v-model:value="formState.filename" placeholder="请输入软件成分名称"/>
                                <div v-if="formState.filename" @click="getContractIdentify('componentContractBasisFor')" class="text-button-blue">查看合同</div>
                            </div>
                        </a-form-item>

                        <a-form-item label="分类" name="asset_type" :rules="[{ required: true, message: '必选项不能为空' }]">
                            <Select :popupClassName="'base-select-dropdown'" disabled v-model:value="formState.asset_type" :options="SOFTWARE_COMPONENT_CATEGORY" placeholder="请选择分类" />
                        </a-form-item>

                        <a-form-item label="软件成分名称" name="component_name" :rules="[{ required: true, message: '必填项不能为空' }]">
                            <div class="flex items-center whitespace-nowrap">
                                <a-input class="flex-1" v-model:value="formState.component_name" placeholder="请输入" show-count :maxlength="100" />

                                <div v-if="formState?.llm_resp?.采购软件信息?.软件名称?.value" @click="getContractIdentify('softwareCostNameBasisFor')" class="text-button-blue ml-2">识别依据</div>
                            </div>
                        </a-form-item>

                        <a-form-item label="版本" name="component_version">
                            <div class="flex items-center whitespace-nowrap">
                                <a-input class="flex-1" v-model:value="formState.component_version" placeholder="请输入应用版本" show-count :maxlength="100" />

                                <div v-if="formState?.llm_resp?.采购软件信息?.软件版本?.value" @click="getContractIdentify('componentVersionBasisFor')" class="text-button-blue ml-2">识别依据</div>
                            </div>
                        </a-form-item>

                        <a-form-item label="供应商名称" name="supplier_name">
                            <div class="flex items-center whitespace-nowrap">
                                <a-input v-model:value="formState.supplier_name" placeholder="请输入供应商名称" show-count :maxlength="30" />

                                <div v-if="formState?.llm_resp?.乙方信息?.公司名称?.value" @click="getContractIdentify('attributeSupplierNameBasisFor')" class="text-button-blue ml-2">识别依据</div>
                            </div>

                        </a-form-item>

                        <a-form-item label="状态" name="status">
                            <Select :popupClassName="'base-select-dropdown'" v-model:value="formState.status" :options="SOFTWARE_COMPONENT_STATUS" placeholder="请选择状态" />
                            <!-- <div v-if="formState?.llm_resp?.采购软件信息?.状态?.value" @click="getContractIdentify('componentStatusBasisFor')" class="text-button-blue ml-2">识别依据</div> -->
                        </a-form-item>

                        <a-form-item label="描述" class="col-span-2" name="description">
                            <a-textarea autoSize v-model:value="formState.description" placeholder="请输入描述" show-count :maxlength="200" />
                        </a-form-item>
                    </a-form>
                </div>

                <!-- 采购与供应商信息  -->
                <div class="flex flex-col gap-4" id="purchaseInfo">
                    <span class="text-[15px] font-semibold text-gary-700">采购与供应商信息</span>

                    <a-form class="base-form bg-[#F2F2F280] rounded-md p-6 gap-4 grid grid-cols-2" ref="formRef" :model="formState.component_closed_source_software" layout="vertical">
                        <a-form-item label="采购类型" name="procurement_type">
                            <Select :popupClassName="'base-select-dropdown'" disabled v-model:value="formState.component_closed_source_software.procurement_type" :options="SOFTWARE_COMPONENT_PURCHASE_TYPE" placeholder="请选择采购类型" />
                        </a-form-item>

                        <a-form-item label="供应商所在国家 " name="supplier_country">
                            <Select :popupClassName="'base-select-dropdown'" v-model:value="formState.component_closed_source_software.supplier_country" :options="SOFTWARE_COMPONENT_COUNTRY" placeholder="请选择供应商所在国家" />
                        </a-form-item>

                        <a-form-item label="供应商唯一标识" name="supplier_identifier">
                            <a-input v-model:value="formState.component_closed_source_software.supplier_identifier" placeholder="请输入供应商唯一标识" />
                        </a-form-item>

                        <a-form-item label="合同编号" name="contract_reference_id">
                            <a-input v-model:value="formState.component_closed_source_software.contract_reference_id" placeholder="请输入合同编号" />
                        </a-form-item>

                        <a-form-item label="负责部门" name="owner_team">
                            <div class="flex items-center whitespace-nowrap">
                                <!-- <TreeSelect class="w-[264px] custom-tree-select" @change="changeOrgHandle" v-model:value="formState.component_closed_source_software.owner_team"
                                            :field-names="{
                                                children: 'organize',
                                                label: 'organize_name',
                                                value: 'organize_id',
                                            }" placeholder="请选择组织" :tree-data="orgTree"
                                            :showSearch="true"
                                            tree-node-filter-prop="organize_name"
                                /> -->

                                <OrgTreeSelect class="base-tree-select" show-search  allowClear  v-model:value="formState.component_closed_source_software.owner_team" placeholder="请选择组织"                    :organizeId="formState.component_closed_source_software.owner_team"
                                />
                                <!-- <div v-if="formState.component_closed_source_software.owner_team" @click="getContractIdentify('componentOwnerTeamBasisFor')" class="text-button-blue ml-2">识别依据</div> -->
                            </div>
                        </a-form-item>
                        <a-form-item label="负责人" name="owner">
                            <!-- <a-select
                                allowClear
                                :popupClassName="'base-select-dropdown'"
                                v-model:value="formState.component_closed_source_software.owner"
                                show-search
                                placeholder="请搜索并选择负责人"
                                :default-active-first-option="false"
                                :show-arrow="false"
                                :filter-option="false"
                                :not-found-content="null"
                                :options="purchaseOwnerOptions"
                                @search="handlePurchaseSearch"
                                @change="handlePurchaseChange"
                            ></a-select> -->
                            <UserSelect show-search class="user-select" :popupClassName="'user-select-dropdown'" v-model:value="formState.component_closed_source_software.owner"
                                        placeholder="请搜索并选择负责人"
                                        :userid="formState.component_closed_source_software.owner"
                            />
                        </a-form-item>
                    </a-form>
                </div>

                <!-- 运维信息  -->
                <div class="flex flex-col gap-4" id="operationInfo">
                    <span class="text-[15px] font-semibold text-gary-700">运维信息</span>

                    <a-form class="base-form bg-[#F2F2F280] rounded-md p-6 gap-4 grid grid-cols-2" ref="formRef" :model="formState.component_closed_source_software" layout="vertical">
                        <a-form-item label="运维负责部门" name="operations_owner_team">
                            <!-- <TreeSelect class="w-[264px] custom-tree-select" @change="changeOrgHandle" v-model:value="formState.component_closed_source_software.operations_owner_team"
                                        :field-names="{
                                            children: 'organize',
                                            label: 'organize_name',
                                            value: 'organize_id',
                                        }" placeholder="请选择组织" :tree-data="orgTree"
                                        :showSearch="true"
                                        tree-node-filter-prop="organize_name"
                            /> -->

                            <OrgTreeSelect class="base-tree-select" show-search  allowClear  v-model:value="formState.component_closed_source_software.operations_owner_team" placeholder="请选择组织"                    :organizeId="formState.component_closed_source_software.operations_owner_team"
                            />
                        </a-form-item>

                        <a-form-item label="运维主要联系人 " name="operations_owner">
                            <UserSelect show-search class="user-select" :popupClassName="'user-select-dropdown'" v-model:value="formState.component_closed_source_software.operations_owner" placeholder="请搜索并选择联系人"  :userid="formState.component_closed_source_software.operations_owner"
                            />
                            <!-- <a-select
                                allowClear
                                :popupClassName="'base-select-dropdown'"
                                v-model:value="formState.component_closed_source_software.operations_owner"
                                show-search
                                placeholder="请搜索并选择负责人"
                                :default-active-first-option="false"
                                :show-arrow="false"
                                :filter-option="false"
                                :not-found-content="null"
                                :options="opsOwnerOptions"
                                @search="handleOpsSearch"
                                @change="handleOpsChange"
                            ></a-select> -->
                        </a-form-item>
                    </a-form>
                </div>

                <!-- 部署环境信息  -->
                <div class="flex flex-col gap-4" id="deploymentInfo">
                    <span class="text-[15px] font-semibold text-gary-700">部署环境信息</span>

                    <a-form class="base-form bg-[#F2F2F280] rounded-md p-6 gap-4 grid grid-cols-2" ref="formRef" :model="formState.component_closed_source_software" layout="vertical">
                        <a-form-item label="部署模式" name="deployment_model">
                            <Select :popupClassName="'base-select-dropdown'" v-model:value="formState.component_closed_source_software.deployment_model" :options="SOFTWARE_COMPONENT_DEPLOY_MODE" placeholder="请选择部署模式" />
                        </a-form-item>

                        <a-form-item label="安装路径 " name="installation_path">
                            <a-input v-model:value="formState.component_closed_source_software.installation_path" placeholder="请输入安装路径" show-count :maxlength="15" />
                        </a-form-item>

                        <a-form-item class="col-span-2" label="服务部署主机IP列表" name="deployed_ip_addresses">
                            <div class="w-full grid grid-cols-2 gap-2">
                                <div v-for="(ip, index) in formState.component_closed_source_software.deployed_ip_addresses" :key="index" class="flex items-center gap-2">
                                    <a-input v-model:value="formState.component_closed_source_software.deployed_ip_addresses[index]" placeholder="请输入IP地址" show-count :maxlength="15" />

                                    <div v-if="index > 0" class="icon-button-gray" @click="removeIp(index)">
                                        <Svg name="software_component-delete_file" width="14" height="14"></Svg>
                                    </div>
                                </div>

                                <div class="text-button-blue col-span-2" @click="addIp">
                                    <PlusOutlined />
                                    <span>添加</span>
                                </div>
                            </div>

                        </a-form-item>
                    </a-form>
                </div>

                <!-- 网络访问与数据级别信息  -->
                <div class="flex flex-col gap-4" id="networkInfo">
                    <span class="text-[15px] font-semibold text-gary-700">网络访问与数据级别信息</span>

                    <a-form class="base-form bg-[#F2F2F280] rounded-md p-6 gap-4 grid grid-cols-2" ref="formRef" :model="formState.component_closed_source_software" layout="vertical">
                        <a-form-item label="网络暴露面" name="network_exposure">
                            <Select :popupClassName="'base-select-dropdown'" v-model:value="formState.component_closed_source_software.network_exposure" :options="SOFTWARE_COMPONENT_NETWORK_EXPOSURE" placeholder="请选择网络暴露面" />
                        </a-form-item>

                        <a-form-item label="服务访问地址 " name="access_url">
                            <a-input v-model:value="formState.component_closed_source_software.access_url" placeholder="请输入服务访问地址" show-count :maxlength="15" />
                        </a-form-item>

                        <a-form-item label="数据敏感级别" name="data_sensitivity_level">
                            <Select :popupClassName="'base-select-dropdown'" v-model:value="formState.component_closed_source_software.data_sensitivity_level" :options="SOFTWARE_COMPONENT_DATA_SENSITIVITY" placeholder="请选择数据敏感级别" />
                        </a-form-item>

                    </a-form>
                </div>

                <!-- 所属应用  -->
                <div class="flex flex-col gap-4" id="applications">
                    <!-- <div class="flex justify-between">
                        <span class="text-[15px] font-semibold text-gary-700">所属应用载体</span>

                        <div class="flex gap-4">
                            <div class="text-button-gray-line" @click="openRelationAppCarryModal = true">关联应用载体</div>
                            <div class="text-button-blue-line" @click="openAddAppCarryModal = true">新增应用载体</div>
                            <div class="text-button-blue-line" @click="openAddAppModal = true">

                                <span>新增应用</span>
                            </div>
                        </div>
                    </div> -->

                    <div class="flex justify-between">
                        <span class="text-[15px] font-semibold text-gary-700">所属应用
                            <span class="text-red-500">*</span>
                        </span>

                        <div class="flex gap-4">
                            <a-popover :overlayStyle="{ zIndex: 1050 }"
                                       :overlayInnerStyle="{ padding: '6px 0px', width: '142px' }" placement="bottomRight" :arrow="false">
                                <template #content>
                                    <div class="cursor-pointer">

                                        <div class="table-operation-item px-6 py-2" @click="openAddAppModal = true">
                                            <span>新增应用</span>
                                        </div>
                                        <a-popover :overlayStyle="{ zIndex: 1050 }"
                                                   :overlayInnerStyle="{ padding: '6px 0px', width: '142px' }" placement="leftTop" :arrow="false">
                                            <template #content>
                                                <div class="cursor-pointer">
                                                    <div class="table-operation-item px-6 py-2" @click="openAddAppCarryModal = true">新增应用载体</div>
                                                    <div class="table-operation-item px-6 py-2" @click="openRelationAppCarryModal = true">关联应用载体</div>
                                                </div>

                                            </template>
                                            <div class="table-operation-item px-6 py-2">应用载体添加</div>
                                        </a-popover>
                                    </div>

                                </template>
                                <div class="px-[9px] py-[2px] border-[1px] border-solid border-purple-500 rounded-3 flex items-center justify-center hover:cursor-pointer">
                                    <span class="mr-1 text-purple-500">
                                        新增
                                    </span>
                                    <Svg height="12px" width="12px" name="software_component-Group" color="#999999"></Svg>
                                </div>
                            </a-popover>

                        </div>
                    </div>

                    <a-table class="carry-table" :pagination="false" :columns="app_columns" :data-source="app_data"  :scroll="{ x: '100%' }" >
                        <template #emptyText>
                            <Empty />
                        </template>
                        <template #bodyCell="{ column, record }">
                            <template v-if="column.dataIndex === 'operation'">
                                <span class="text-red-500 cursor-pointer" @click="removeApp(record)">删除</span>
                            </template>
                        </template>
                    </a-table>
                </div>
            </div>
        </div>

        <div v-if="progress === 'step_2'" class="flex flex-col gap-6">

            <!-- 软件成分列表 -->
            <a-table v-if="contractDetail.associated_component" class="contract-component-table" :columns="componentColumns" :data-source="[contractDetail.associated_component]" :pagination="false">
                <template #emptyText>
                    <Empty />
                </template>
                <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex === 'operation'">
                        <div class="flex gap-2 w-fit whitespace-nowrap">
                            <div class="text-button-blue" @click="goSoftwareComponentDetail(record.component_id)">详情</div>
                            <div @click="openInviteCollaborationModal = true" class="text-button-blue">邀请协作</div>
                        </div>
                    </template>
                </template>
            </a-table>

            <!-- 基本信息 -->
            <div id="basic" class=" flex flex-col gap-3">
                <span class="text-[15px] font-semibold text-gary-700 leading-[1.5em]">
                    基本信息
                </span>
                <div class="bg-[#F2F2F280] grid grid-cols-2 gap-4 p-6">
                    <div class="">
                        <div class="info-label">合同文件名称</div>
                        <div class="flex gap-1 items-center">
                            <span>{{ contractDetail.contract?.filename }}</span>
                            <div v-if="contractDetail.contract?.filename" @click="getContractIdentify('componentContractBasisFor')" class="text-button-blue">查看合同</div>
                        </div>
                    </div>
                    <div class="">
                        <div class="info-label">软件成分名称</div>
                        <div class="flex gap-1 items-center">
                            <span>{{ contractDetail.contract?.component_name || '-' }}</span>
                            <div v-if="contractDetail.contract?.component_name" @click="getContractIdentify('softwareCostNameBasisFor')" class="text-button-blue">识别依据</div>
                        </div>
                    </div>
                    <div class="">
                        <div class="info-label">版本</div>
                        <div class="flex gap-1 items-center">
                            <span>{{ contractDetail?.contract?.component_version || '-' }}</span>
                            <div v-if="contractDetail.contract?.component_version" @click="getContractIdentify('componentVersionBasisFor')" class="text-button-blue">识别依据</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 采购与供应商信息 -->
            <div id="purchase" class="flex flex-col gap-3">
                <span class="text-[15px] font-semibold text-gary-700 leading-[1.5em]">
                    采购与供应商信息
                </span>
                <div class="bg-[#F2F2F280] grid grid-cols-2 gap-4 p-6">
                    <div class="">
                        <div class="info-label">合同编号</div>
                        <div class="flex gap-1 items-center">
                            <span>{{ contractDetail?.llm_resp?.采购合同信息?.合同编号?.value || '-' }}</span>
                            <div v-if="contractDetail.llm_resp?.采购合同信息?.合同编号?.value" @click="getContractIdentify('contractNumberBasisFor')" class="text-button-blue">识别依据</div>
                        </div>
                    </div>
                    <div class="">
                        <div class="info-label">负责人</div>
                        <div class="flex gap-1 items-center">
                            <div class="flex items-center gap-2">
                                <span>{{ contractDetail?.llm_resp?.甲方联系人?.联系人?.value || '-' }}</span>
                            </div>
                            <div v-if="contractDetail.llm_resp?.甲方联系人?.联系人?.value" @click="getContractIdentify('attributeOwnerBasisFor')" class="text-button-blue">识别依据</div>
                        </div>
                    </div>
                    <div class="">
                        <div class="info-label">供应商名称</div>
                        <div class="flex gap-1 items-center">
                            <div class="flex items-center gap-2">
                                <span>{{ contractDetail?.contract?.vendor_name || '-' }}</span>
                            </div>
                            <div v-if="contractDetail.contract?.vendor_name" @click="getContractIdentify('attributeSupplierNameBasisFor')" class="text-button-blue">识别依据</div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <AddAppModal v-model:open="openAddAppModal" v-if="openAddAppModal" :softwareComponentId="softwareComponentId" @updateList="getSoftwareComponentBindCarrier" @changeAppList="changeAppList" :app_list="app_data" />

        <RelationAppCarryModal v-model:open="openRelationAppCarryModal" v-if="openRelationAppCarryModal"  :softwareComponentId="softwareComponentId"  @updateList="getSoftwareComponentBindCarrier" @changeCarrierList="changeCarrierList"/>

        <AddAppCarryModal v-model:open="openAddAppCarryModal" v-if="openAddAppCarryModal" />

        <InviteCollaborationModal v-model:open="openInviteCollaborationModal" v-if="openInviteCollaborationModal" :component_id="contractDetail.contract.component_contract_id"/>

        <!-- PDF 预览弹窗 -->
        <a-modal v-model:open="pdfPreviewVisible" title="PDF预览" :width="800" :footer="null" @cancel="handlePdfPreviewClose" class="pdf-preview-modal">
            <div class="pdf-preview-container">
                <a-spin :spinning="pdfLoading" tip="PDF加载中...">
                    <vue-pdf-embed v-if="pdfSource" :source="pdfSource" @rendered="handlePdfRendered" @error="handlePdfError" />
                </a-spin>
            </div>
        </a-modal>

    </a-modal>
</template>

<script setup>
import {
    reactive, ref,
    watchEffect,
    computed,
    h, watch,
} from 'vue';
import { Modal } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import VuePdfEmbed from 'vue-pdf-embed';
import { getCarrierRelatedAppsApi } from 'api/app';
import {
    getSoftwareComponentBindCarrierApi,
} from 'api/software';
import { globalState, userInfo } from '@/store';
import {
    SOFTWARE_COMPONENT_CATEGORY,
    SOFTWARE_COMPONENT_STATUS,
    SOFTWARE_COMPONENT_PURCHASE_TYPE,
    SOFTWARE_COMPONENT_COUNTRY,
    SOFTWARE_COMPONENT_DEPLOY_MODE,
    SOFTWARE_COMPONENT_NETWORK_EXPOSURE,
    SOFTWARE_COMPONENT_DATA_SENSITIVITY,

} from '../../constants/contract';
import RelationAppCarryModal from './RelationAppCarryModal.vue';
import AddAppCarryModal from './AddAppCarryModal.vue';
import InviteCollaborationModal from './InviteCollaborationModal.vue';
import { editSoftwareComponentContractApi, getSoftwareComponentContractDetailApi, getSoftwareComponentContractIdentifyApi } from '@/api/software';
import { findSoftwareComponentCategoryLabel } from '@/constants/softwareComponent';
import AddAppModal from './AddAppModal.vue';

// const orgTree = ref(null);
const { contractData, contractId } = defineProps(['contractData', 'contractId']);
const emits = defineEmits(['update:open', 'updateList']);
const formRef = ref();
const router = useRouter();
const softwareComponentId = ref(null);
const progress = ref('step_1');
const formState = reactive({
    // 基本信息
    asset_type: 'closed_source_application', // 分类
    filename: '', // 合同文件名称
    component_name: '', // 软件名称
    component_version: '', // 版本号
    component_desc: '', // 描述
    status: 'active', // 状态
    supplier_name: '', // 供应商名称
    organize_id: userInfo.value.org_id, // 组织ID
    carrier_id: [], // 应用载体ID数组
    apps: [], // 关联应用ID数组
    component_contract_id: null, // 合同ID

    // 闭源软件信息
    component_closed_source_software: {
        access_url: '', // 服务访问地址
        contract_reference_id: '', // 合同编号
        data_sensitivity_level: undefined, // 数据敏感级别
        deployed_ip_addresses: [''], // 服务部署主机IP列表
        deployment_model: undefined, // 部署模式
        installation_path: '', // 安装路径
        network_exposure: undefined, // 网络暴露面
        operations_owner: undefined, // 运维主要联系人
        operations_owner_team: undefined, // 运维负责团队
        owner: undefined, // 负责人
        owner_team: undefined, // 负责团队
        procurement_type: 'commercial', // 采购类型
        supplier_country: undefined, // 供应商所在国家
        supplier_identifier: '', // 供应商唯一标识
    },
});
watchEffect(() => {
    if (contractData) {
        Object.assign(formState, contractData);
        formState.filename = contractData.contract.filename;
        formState.component_name = contractData.contract.component_name;
        formState.supplier_name = contractData.contract.vendor_name;
        formState.component_contract_id = contractData.contract.component_contract_id;
        formState.component_version = contractData.contract.component_version;
        console.log(formState);
    }
});

const selectedapp = ref();
watch(
    selectedapp,
    (newValue) => {
        console.log(newValue);
    },
);

const app_columns = ref([
    {
        title: '应用名称',
        dataIndex: 'application_name',
        width: '280px',
    },
    {
        title: '操作',
        dataIndex: 'operation',
        width: '80px',
    },
]);
// 打开添加应用弹窗
const openAddAppModal = ref(false);
const app_data = ref([]);

// 修改应用ID
const changeAppList = (appList) => {
    // 合并并去重
    const mergedAppData = [...app_data.value, ...appList];
    const uniqueAppData = Array.from(new Map(mergedAppData.map((item) => [item.application_id, item])).values());
    app_data.value = uniqueAppData;

    // application_id 去重
    const mergedAppIds = [...formState.apps, ...appList.map((item) => item.application_id)];
    formState.apps = Array.from(new Set(mergedAppIds));
};

// 去除所处应用
const removeApp = (record) => {
    formState.apps = formState.apps.filter((item) => item !== record.application_id);
    app_data.value = app_data.value.filter((item) => item.application_id !== record.application_id);
};

const openRelationAppCarryModal = ref(false);
const openAddAppCarryModal = ref(false);
const openInviteCollaborationModal = ref(false);
// 软件成分列表表格列定义
const componentColumns = [
    {
        title: '软件成分名称',
        dataIndex: 'component_name',
        customRender({ text }) { return text || '-'; },
    },
    {
        title: '软件成分版本',
        dataIndex: 'component_version',
        width: 178,
        customRender({ text }) { return text || '-'; },
    },
    {
        title: '软件成分类型',
        dataIndex: 'asset_type',
        width: 178,
        customRender({ text }) { return findSoftwareComponentCategoryLabel(text) || '-'; },
    },
    {
        title: '操作',
        dataIndex: 'operation',
        width: 170,
    },
];

// 第二步详情
const contractDetail = ref({});
const pdfPreviewVisible = ref(false);
const pdfSource = ref(null);
const pdfLoading = ref(false);

const getContractDetail = async () => {
    const res = await getSoftwareComponentContractDetailApi(contractData.contract.component_contract_id);
    contractDetail.value = res.data.data;
};

const carry_data = ref([]);
const tabs = ref([
    {
        id: 'baseInfo',
        title: '基本信息',
    },
    {
        id: 'purchaseInfo',
        title: '采购与供应商信息',
    },
    {
        id: 'operationInfo',
        title: '运维信息',
    },
    {
        id: 'deploymentInfo',
        title: '部署环境信息',
    },
    {
        id: 'networkInfo',
        title: '网络访问与数据级别信息',
    },
    {
        id: 'applications',
        title: '所属应用',
    },
]);

/** Anchor 锚点指定滚动的容器 */
function getContainer() {
    // 给组件指定渲染的容器，解决锚点不会随页面滚动而移动的问题
    return document.querySelector('.main-content');
}

// 获取应用载体列表
const getSoftwareComponentBindCarrier = async () => {
    if (softwareComponentId.value) {
        const res = await getSoftwareComponentBindCarrierApi(softwareComponentId);
        carry_data.value = res.data.data;
    }
};

// 修改应用载体ID
const changeCarrierList = (carrierList) => {
    formState.carrier_id = carrierList.map((item) => item.carrier_id);
    carry_data.value = carrierList;

    // 遍历应用载体列表，获取应用列表
    const getAppList = async (carrierId) => {
        const res = await getCarrierRelatedAppsApi(carrierId);
        return res.data.data;
    };

    const getAppListPromise = formState.carrier_id.map(async (carrierId) => {
        const appList = await getAppList(carrierId);
        return appList;
    });

    Promise.all(getAppListPromise).then((res) => {
        const appList = res.flat();
        // 合并并去重
        const mergedAppData = [...app_data.value, ...appList];
        // 根据 application_id 去重
        const uniqueAppData = Array.from(new Map(mergedAppData.map((item) => [item.application_id, item])).values());
        app_data.value = uniqueAppData;

        // application_id 去重
        const mergedAppIds = [...formState.apps, ...appList.map((item) => item.application_id)];
        formState.apps = Array.from(new Set(mergedAppIds));
    });
};

const okBtndisabled = computed(() => !formState.component_name || formState.apps.length === 0);

// 跳转软件成分详情
const goSoftwareComponentDetail = (id) => {
    emits('update:open', false);
    router.push(`/software-component/detail/${id}`);
};

const clearFormHandle = () => formRef.value.resetFields();

const okHandle = async () => {
    await editSoftwareComponentContractApi(contractData.contract.component_contract_id, formState);
    await getContractDetail();
    progress.value = 'step_2';
};

// 添加IP
const addIp = () => {
    formState.component_closed_source_software.deployed_ip_addresses.push('');
};

// 删除IP
const removeIp = (index) => {
    formState.component_closed_source_software.deployed_ip_addresses.splice(index, 1);
};

// const changeOrgHandle = (value) => {
//     formState.component_closed_source_software.owner_team = value;
// };

// 采购负责人选项列表
// const purchaseOwnerOptions = ref([]);
// const handlePurchaseSearch = (val) => {
//     if (!USER_LIST.value?.userList || val === '') {
//         purchaseOwnerOptions.value = [];
//         return;
//     }

//     purchaseOwnerOptions.value = USER_LIST.value.userList
//         .filter((item) => item?.organize_nick_name?.includes(val || ''))
//         .map((item) => ({
//             label: item.organize_nick_name || '',
//             value: Number(item.organize_user_id) || '',
//         }));
// };

// const handlePurchaseChange = (value) => {
//     formState.component_closed_source_software.owner = value;
// };

// 运维负责人选项列表
// const opsOwnerOptions = ref([]);
// const handleOpsSearch = (val) => {
//     if (!USER_LIST.value?.userList || val === '') {
//         opsOwnerOptions.value = [];
//         return;
//     }

//     opsOwnerOptions.value = USER_LIST.value.userList
//         .filter((item) => item?.organize_nick_name?.includes(val || ''))
//         .map((item) => ({
//             label: item.organize_nick_name || '',
//             value: Number(item.organize_user_id) || '',
//         }));
// };

// const handleOpsChange = (value) => {
//     formState.component_closed_source_software.operations_owner = value;
// };

// 获取合同识别依据
const getContractIdentify = async (type) => {
    if (type === 'componentContractBasisFor') {
        // 立即显示弹窗和加载状态
        pdfPreviewVisible.value = true;
        pdfLoading.value = true;

        try {
            const res = await getSoftwareComponentContractIdentifyApi({
                contract_id: contractId,
                type,
            });

            // PDF 预览
            const blob = new Blob([res.data], { type: 'application/pdf' });
            pdfSource.value = URL.createObjectURL(blob);
        } catch (error) {
            console.error('加载PDF失败:', error);
            Modal.error({
                title: '提示',
                content: '加载PDF文件失败，请稍后重试',
            });
            pdfPreviewVisible.value = false;
        }
    } else {
        try {
            // PNG 图片展示
            const res = await getSoftwareComponentContractIdentifyApi({
                contract_id: contractId,
                type,
            });

            const blob = new Blob([res.data], { type: 'image/png' });
            const imageUrl = URL.createObjectURL(blob);

            // 创建图片预览弹窗
            Modal.info({
                title: '识别依据',
                width: 800,
                okText: '关闭',
                class: 'image-preview-modal',
                content: h('div', {
                    style: {
                        textAlign: 'center',
                        maxHeight: 'calc(90vh - 120px)',
                        overflow: 'auto',
                        padding: '12px',
                    },
                }, [
                    h('img', {
                        src: imageUrl,
                        style: {
                            maxWidth: '100%',
                            height: 'auto',
                            display: 'block',
                            margin: '0 auto',
                        },
                    }),
                ]),
                onOk() {
                    URL.revokeObjectURL(imageUrl);
                },
                onCancel() {
                    URL.revokeObjectURL(imageUrl);
                },
            });
        } catch (error) {
            console.error('加载图片失败:', error);
            Modal.error({
                title: '提示',
                content: '加载图片失败，请稍后重试',
            });
        }
    }
};

// 将组织树的 ID 转换为数字
// const convertIdsToNumber = (tree) => {
//     if (!tree) return null;

//     return tree.map((item) => {
//         const newItem = {
//             ...item,
//             organize_id: Number(item.organize_id),
//             organize_pid: Number(item.organize_pid),
//         };

//         if (item.organize && item.organize.length > 0) {
//             newItem.organize = convertIdsToNumber(item.organize);
//         }

//         return newItem;
//     });
// };

// 在组件挂载时转换组织树
// onBeforeMount(async () => {
//     if (globalState.orgTree) {
//         orgTree.value = convertIdsToNumber(globalState.orgTree);
//     }
// });

// PDF 相关处理函数
const handlePdfRendered = () => {
    pdfLoading.value = false;
};

const handlePdfError = (error) => {
    console.error('PDF渲染失败:', error);
    pdfLoading.value = false;
    Modal.error({
        title: '提示',
        content: 'PDF渲染失败，请稍后重试',
    });
};

const handlePdfPreviewClose = () => {
    if (pdfSource.value) {
        URL.revokeObjectURL(pdfSource.value);
        pdfSource.value = null;
    }
    pdfPreviewVisible.value = false;
    pdfLoading.value = false;
};

</script>

<style>
.edit-identification-information-modal {
    margin: 40px 0;
    left: 50%;
    top: 0;
    margin-left: -420px;
    padding-bottom: 0;

    .ant-modal-content{
        padding: 24px;
        width: 840px !important;
    }

    .ant-form-item{
        margin-bottom: 0;
    }
}

.pdf-preview-modal {
    .ant-modal-content {
        height: 90vh;
        display: flex;
        flex-direction: column;
    }

    .ant-modal-body {
        flex: 1;
        overflow: auto;
        padding: 24px;
    }

    .pdf-preview-container {
        height: 100%;
        width: 100%;
    }
}
</style>
