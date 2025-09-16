<template>
    <a-modal class="soft-modal" :confirmLoading="globalState.loading" :title="softwareComponentId ? '编辑软件成分' : '新增软件成分'" :afterClose="clearFormHandle"
             @cancel="emits('update:open', false)" @ok="okHandle" :width="840" :okButtonProps="{ disabled: okBtndisabled }"
             okText="确认" cancelText="取消">
        <div :style="{'height': 'calc(100vh - 240px)'}" class="soft-modal-content overflow-auto mt-6">

            <!-- 基本信息 -->
            <div id="baseInfo" class="flex flex-col gap-4 mb-6">
                <a-form autocomplete="off" class="base-form rounded-md gap-4 grid grid-cols-2" ref="formRef" :model="formState" layout="vertical">
                    <a-form-item label="分类" name="asset_type" class="col-span-2" :rules="[{ required: true, message: '必选项不能为空' }]">
                        <Select class="base-select" :popupClassName="'base-select-dropdown'" v-model:value="formState.asset_type" :options="SOFTWARE_COMPONENT_CATEGORY" placeholder="请选择分类" />
                    </a-form-item>

                    <a-form-item label="软件成分名称" name="component_name" :rules="[{ required: true, message: '必填项不能为空' }]">
                        <a-input class="base-input" v-model:value="formState.component_name" @blur="formState.component_name = formState.component_name.trim()" placeholder="请输入软件成分名称" show-count :maxlength="100" />
                        <!-- <a-input v-model:value.trim="formState.component_name" placeholder="请输入软件成分名称" show-count :maxlength="100" /> -->
                    </a-form-item>

                    <a-form-item label="版本" name="component_version">
                        <a-input class="base-input" v-model:value.trim="formState.component_version" placeholder="请输入应用版本" show-count :maxlength="30" />
                    </a-form-item>

                    <a-form-item label="供应商名称" name="supplier_name">
                        <a-input class="base-input" v-model:value.trim="formState.supplier_name" placeholder="请输入供应商名称" />
                    </a-form-item>

                    <a-form-item label="状态" name="status">
                        <Select class="base-select" :popupClassName="'base-select-dropdown'" v-model:value="formState.status" :options="SOFTWARE_COMPONENT_STATUS" placeholder="请选择状态" />
                    </a-form-item>
                    <a-form-item label="描述" class="col-span-2" name="component_desc">
                        <TextArea :maxlength="200" v-model="formState.component_desc" placeholder="请输入描述"  :rows="4"/>
                    </a-form-item>
                </a-form>
            </div>

            <!-- 锚点导航 -->
            <div class="sticky top-0 z-10 mb-6 bg-white" v-if="formState.asset_type === 'closed_source_application'">
                <a-anchor class="anchor" direction="horizontal" :target-offset="43" :get-container="getContainer" :getCurrentAnchor="getCurrentAnchor">
                    <a-anchor-link v-for="(item, $index) in tabs" :key="$index" :href="'#' + item.id" :title="item.title" />
                </a-anchor>
            </div>

            <div class="flex flex-col gap-10" v-if="formState.asset_type === 'closed_source_application'">

                <!-- 采购与供应商信息  -->
                <div class="flex flex-col gap-4" id="purchaseInfo">
                    <span class="text-[15px] font-semibold text-gary-700">采购与供应商信息</span>

                    <a-form autocomplete="off" class="base-form bg-[#F2F2F280] rounded-md p-6 gap-4 grid grid-cols-2" ref="formRef" :model="formState.component_closed_source_software" layout="vertical">
                        <a-form-item label="采购类型" name="procurement_type">
                            <Select class="base-select" :popupClassName="'base-select-dropdown'" v-model:value="formState.component_closed_source_software.procurement_type" :options="SOFTWARE_COMPONENT_PURCHASE_TYPE" placeholder="请选择采购类型" />
                        </a-form-item>

                        <a-form-item label="供应商所在国家 " name="supplier_country">
                            <Select class="base-select" :popupClassName="'base-select-dropdown'" v-model:value="formState.component_closed_source_software.supplier_country" :options="SOFTWARE_COMPONENT_COUNTRY" placeholder="请搜索并选择供应商所在国家" />
                        </a-form-item>

                        <a-form-item label="供应商唯一标识" name="supplier_identifier">
                            <a-input class="base-input" v-model:value="formState.component_closed_source_software.supplier_identifier" placeholder="请输入供应商唯一标识" />
                        </a-form-item>

                        <a-form-item label="合同编号" name="contract_reference_id">
                            <a-input class="base-input" v-model:value="formState.component_closed_source_software.contract_reference_id" placeholder="请输入合同编号" />
                        </a-form-item>

                        <a-form-item label="负责部门" name="owner_team">

                            <!-- <TreeSelect class="w-[264px] custom-tree-select base-tree-select"  v-model:value="formState.component_closed_source_software.owner_team"
                                        :field-names="{
                                            children: 'organize',
                                            label: 'organize_name',
                                            value: 'organize_id',
                                        }" placeholder="请选择组织" :tree-data="orgTree"
                                        :showSearch="true"
                                        tree-node-filter-prop="organize_name"
                            /> -->

                            <OrgTreeSelect class="base-tree-select" show-search  v-model:value="formState.component_closed_source_software.owner_team" placeholder="请选择组织"                    :organizeId="formState.component_closed_source_software.owner_team" allowClear
                            />

                        </a-form-item>
                        <a-form-item label="负责人" name="owner">
                            <!-- <Select :popupClassName="'base-select-dropdown'" v-model:value="formState.component_closed_source_software.owner" :options="ownerOptions" placeholder="请搜索并选择负责人" /> -->

                            <UserSelect show-search class="user-select" :popupClassName="'user-select-dropdown'" v-model:value="formState.component_closed_source_software.owner"
                                        placeholder="请搜索并选择负责人"
                                        :userid="formState.component_closed_source_software.owner"
                            />

                            <!-- <a-select
                                class="base-select"
                                :popupClassName="'base-select-dropdown'"
                                v-model:value="formState.component_closed_source_software.owner"
                                show-search
                                placeholder="请搜索并选择负责人"
                                :default-active-first-option="false"
                                :show-arrow="false"
                                :filter-option="false"
                                :not-found-content="purchaseOwnerOptions.length === 0 && purchaseSearchValue !== '' ? '暂无数据' : null"
                                :options="purchaseOwnerOptions"
                                @search="handlePurchaseSearch"
                                @change="handlePurchaseChange"
                            >
                            </a-select> -->
                        </a-form-item>
                    </a-form>
                </div>

                <!-- 运维信息  -->
                <div class="flex flex-col gap-4" id="operationInfo">
                    <span class="text-[15px] font-semibold text-gary-700">运维信息</span>

                    <a-form autocomplete="off" class="base-form bg-[#F2F2F280] rounded-md p-6 gap-4 grid grid-cols-2" ref="formRef" :model="formState.component_closed_source_software" layout="vertical">
                        <a-form-item label="运维负责部门" name="operations_owner_team">
                            <!-- <TreeSelect class="w-[264px] custom-tree-select base-tree-select"  v-model:value="formState.component_closed_source_software.operations_owner_team"
                                        :field-names="{
                                            children: 'organize',
                                            label: 'organize_name',
                                            value: 'organize_id',
                                        }" placeholder="请搜索并选择组织" :tree-data="orgTree"
                                        :showSearch="true"
                                        tree-node-filter-prop="organize_name"
                            /> -->

                            <OrgTreeSelect class="base-tree-select" show-search    v-model:value="formState.component_closed_source_software.operations_owner_team" placeholder="请选择组织"                    :organizeId="formState.component_closed_source_software.operations_owner_team" allowClear
                            />
                        </a-form-item>

                        <a-form-item label="运维主要联系人 " name="operations_owner">
                            <!-- <Select :popupClassName="'base-select-dropdown'" v-model:value="formState.component_closed_source_software.operations_owner" :options="SOFTWARE_COMPONENT_OPS_CONTACT" placeholder="请选择运维主要联系人" /> -->

                            <UserSelect show-search class="user-select" :popupClassName="'user-select-dropdown'" v-model:value="formState.component_closed_source_software.operations_owner" placeholder="请搜索并选择联系人"  :userid="formState.component_closed_source_software.operations_owner"
                            />

                            <!-- <a-select
                                class="base-select"
                                :popupClassName="'base-select-dropdown'"
                                v-model:value="formState.component_closed_source_software.operations_owner"
                                show-search
                                placeholder="请搜索并选择负责人"
                                :default-active-first-option="false"
                                :show-arrow="false"
                                :filter-option="false"
                                :not-found-content="opsOwnerOptions.length === 0 && opsSearchValue !== '' ? '暂无数据' : null"
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

                    <a-form autocomplete="off" class="base-form bg-[#F2F2F280] rounded-md p-6 gap-4 grid grid-cols-2" ref="formRef" :model="formState.component_closed_source_software" layout="vertical">
                        <a-form-item label="部署模式" name="deployment_model">
                            <Select class="base-select" :popupClassName="'base-select-dropdown'" v-model:value="formState.component_closed_source_software.deployment_model" :options="SOFTWARE_COMPONENT_DEPLOY_MODE" placeholder="请选择部署模式" />
                        </a-form-item>

                        <a-form-item label="安装路径 " name="installation_path">
                            <a-input class="base-input" v-model:value="formState.component_closed_source_software.installation_path" placeholder="请输入安装路径" />
                        </a-form-item>

                        <a-form-item class="col-span-2" label="服务部署主机IP列表" name="deployed_ip_addresses">
                            <div class="w-full grid grid-cols-2 gap-4">
                                <div v-for="(ip, index) in formState.component_closed_source_software.deployed_ip_addresses" :key="index" class="flex items-center gap-2">
                                    <a-input class="base-input" v-model:value="formState.component_closed_source_software.deployed_ip_addresses[index]" placeholder="请输入IP地址" />

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

                    <a-form autocomplete="off" class="base-form bg-[#F2F2F280] rounded-md p-6 gap-4 grid grid-cols-2" ref="formRef" :model="formState.component_closed_source_software" layout="vertical">
                        <a-form-item label="网络暴露面" name="network_exposure">
                            <Select class="base-select" :popupClassName="'base-select-dropdown'" v-model:value="formState.component_closed_source_software.network_exposure" :options="SOFTWARE_COMPONENT_NETWORK_EXPOSURE" placeholder="请选择网络暴露面" />
                        </a-form-item>

                        <a-form-item label="服务访问地址 " name="access_url">
                            <a-input class="base-input" v-model:value="formState.component_closed_source_software.access_url" placeholder="请输入服务访问地址" />
                        </a-form-item>

                        <a-form-item label="数据敏感级别" name="data_sensitivity_level">
                            <Select class="base-select" :popupClassName="'base-select-dropdown'" v-model:value="formState.component_closed_source_software.data_sensitivity_level" :options="SOFTWARE_COMPONENT_DATA_SENSITIVITY" placeholder="请选择数据敏感级别" />
                        </a-form-item>
                    </a-form>
                </div>

                <!-- 所属应用  -->
                <div class="flex flex-col gap-4" id="applicationCarriers">
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

                            <!-- <div class="text-button-gray-line" @click="openRelationAppCarryModal = true">关联应用载体</div>
                            <div class="text-button-blue-line" @click="openAddAppCarryModal = true">新增应用载体</div>
                            <div class="text-button-blue-line" @click="openAddAppModal = true">

                                <span>新增应用</span>
                            </div> -->
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

        <AddAppModal v-model:open="openAddAppModal" v-if="openAddAppModal" :softwareComponentId="softwareComponentId" @updateList="getSoftwareComponentBindCarrier" @changeAppList="changeAppList" :app_list="app_data" />

        <RelationAppCarryModal v-model:open="openRelationAppCarryModal" v-if="openRelationAppCarryModal" :softwareComponentId="softwareComponentId" :app_carry_list="formState.carrier_id" @updateList="getSoftwareComponentBindCarrier" @changeCarrierList="changeCarrierList" />

        <AddAppCarryModal v-model:open="openAddAppCarryModal" v-if="openAddAppCarryModal" :softwareComponentId="softwareComponentId" />
    </a-modal>
</template>

<script setup>
import {
    reactive, ref, computed, onBeforeMount,
    watch,
} from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import {
    addSoftwareComponentApi, getSoftwareComponentBindCarrierApi, getSoftwareComponentAppListApi, bindSoftwareComponentAppApi, bindSoftwareComponentCarrierApi,
} from 'api/software';
import { getChainComponentDetailApi, getCarrierRelatedAppsApi } from 'api/app';
import { message } from 'ant-design-vue';
import { globalState, userInfo } from '@/store';
import {
    SOFTWARE_COMPONENT_CATEGORY,
    SOFTWARE_COMPONENT_STATUS,
    SOFTWARE_COMPONENT_PURCHASE_TYPE,
    SOFTWARE_COMPONENT_COUNTRY,
    SOFTWARE_COMPONENT_DEPLOY_MODE,
    SOFTWARE_COMPONENT_NETWORK_EXPOSURE,
    SOFTWARE_COMPONENT_DATA_SENSITIVITY,
} from '../constants';
import RelationAppCarryModal from './RelationAppCarryModal.vue';
import AddAppCarryModal from './AddAppCarryModal.vue';
import AddAppModal from './AddAppModal.vue';

const { softwareComponentId } = defineProps(['softwareComponentId']);
const emits = defineEmits(['update:open', 'updateList']);
const formRef = ref();
// const orgTree = ref(null);
const openAddAppModal = ref(false);

const formState = reactive({
    // 基本信息
    asset_type: null, // 分类
    component_name: '', // 软件成分名称
    component_version: '', // 版本号
    component_desc: '', // 描述
    status: 'active', // 状态
    supplier_name: '', // 供应商名称
    organize_id: userInfo.value.org_id, // 组织ID
    carrier_id: [], // 应用载体ID数组
    application_id: [], // 所属应用

    // 闭源软件信息
    component_closed_source_software: {
        access_url: '', // 服务访问地址
        contract_reference_id: '', // 合同编号
        data_sensitivity_level: null, // 数据敏感级别
        deployed_ip_addresses: [''], // 服务部署主机IP列表
        deployment_model: null, // 部署模式
        installation_path: '', // 安装路径
        network_exposure: null, // 网络暴露面
        operations_owner: null, // 运维主要联系人
        operations_owner_team: null, // 运维负责团队
        owner: null, // 负责人
        owner_team: null, // 负责团队
        procurement_type: null, // 采购类型
        supplier_country: null, // 供应商所在国家
        supplier_identifier: '', // 供应商唯一标识
    },
});

// getter 函数
watch(
    () => formState.application_id,
    (application_id) => {
        console.log(application_id);
    },
);

// 获取供应链成分详情
const getChainComponentDetail = async () => {
    if (softwareComponentId) {
        const response = await getChainComponentDetailApi(softwareComponentId);

        Object.assign(formState, response.data.data);
        if (!formState.component_closed_source_software.deployed_ip_addresses) {
            formState.component_closed_source_software.deployed_ip_addresses = [''];
        }

        // 检查并处理值为0的字段
        if (formState.component_closed_source_software) {
            const fields = ['operations_owner', 'operations_owner_team', 'owner', 'owner_team', 'procurement_type', 'deployment_model', 'supplier_country', 'network_exposure', 'data_sensitivity_level'];
            fields.forEach((field) => {
                if (!formState.component_closed_source_software[field] || formState.component_closed_source_software[field] === '0') {
                    formState.component_closed_source_software[field] = null;
                }
            });
        }
    }
};

const openRelationAppCarryModal = ref(false);
const openAddAppCarryModal = ref(false);

const app_columns = ref([
    {
        title: '应用名称',
        dataIndex: 'application_name',
    },
    {
        title: '操作',
        dataIndex: 'operation',
        width: '76px',
    },
]);

const carry_data = ref([]);
const app_data = ref([]);
const tabs = ref([
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
        id: 'applicationCarriers',
        title: '所属应用',
    },
]);

// 修改应用载体ID
const changeCarrierList = (carrierList) => {
    formState.carrier_id = carrierList.map((item) => item.carrier_id);
    console.log(formState.carrier_id);
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
        const mergedAppIds = [...formState.application_id, ...appList.map((item) => item.application_id)];
        formState.application_id = Array.from(new Set(mergedAppIds));
    });
};

// 修改应用ID
const changeAppList = (appList) => {
    // 合并并去重
    const mergedAppData = [...app_data.value, ...appList];
    const uniqueAppData = Array.from(new Map(mergedAppData.map((item) => [item.application_id, item])).values());
    app_data.value = uniqueAppData;

    // application_id 去重
    const mergedAppIds = [...formState.application_id, ...appList.map((item) => item.application_id)];
    formState.application_id = Array.from(new Set(mergedAppIds));
};
// 获取应用载体列表
const getSoftwareComponentBindCarrier = async () => {
    if (softwareComponentId) {
        const res = await getSoftwareComponentBindCarrierApi(softwareComponentId);
        carry_data.value = res.data.data;
    }
};

// 获取应用列表
const getSoftwareComponentBindApp = async () => {
    if (softwareComponentId) {
        const res = await getSoftwareComponentAppListApi({
            component_id: softwareComponentId,
        });
        app_data.value = res.data.data.data_list || [];
        formState.application_id = res.data.data.data_list?.map((item) => item.application_id) || [];
    }
};

// 去除所处应用
const removeApp = (record) => {
    formState.application_id = formState.application_id.filter((item) => item !== record.application_id);
    app_data.value = app_data.value.filter((item) => item.application_id !== record.application_id);
};

/** Anchor 锚点指定滚动的容器 */
function getContainer() {
    // 给组件指定渲染的容器，解决锚点不会随页面滚动而移动的问题
    return document.querySelector('.soft-modal-content');
}

const okBtndisabled = computed(
    () => !formState.component_name
        || !formState.asset_type
        || (formState.application_id?.length === 0 && formState.asset_type === 'closed_source_application'),
);

const clearFormHandle = () => formRef.value.resetFields();

const okHandle = async () => {
    try {
        // 检查IP地址格式
        if (formState.asset_type === 'closed_source_application') {
            const ipRegex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
            const invalidIPs = formState.component_closed_source_software.deployed_ip_addresses
                ?.filter(Boolean)
                ?.filter((ip) => !ipRegex.test(ip));

            if (invalidIPs?.length > 0) {
                message.error('请输入正确的IP地址格式');
                return;
            }
        }

        formState.component_closed_source_software.deployed_ip_addresses = formState.component_closed_source_software.deployed_ip_addresses?.filter(Boolean);

        const application_id_back = formState.application_id;
        // formState.application_id = null;
        // formState.carrier_id = null;

        const result = await addSoftwareComponentApi(formState);

        await bindSoftwareComponentAppApi({
            component_id: result.data.data.component_id,
            application: application_id_back,
        });

        await bindSoftwareComponentCarrierApi({
            component_id: result.data.data.component_id,
            carrier_id: formState.carrier_id,
        });

        emits('update:open', false);
        emits('updateList');
    } catch (error) {
        console.log(error);
    }
};

// 添加IP地址
const addIp = () => {
    console.log(formState.component_closed_source_software.deployed_ip_addresses);

    formState.component_closed_source_software.deployed_ip_addresses.push('');
};

// 删除IP地址
const removeIp = (index) => {
    formState.component_closed_source_software.deployed_ip_addresses.splice(index, 1);
};

// 将组织树的 ID 转换为数字
// const convertIdsToNumber = (tree) => {
//     if (!tree) return null;

//     return tree.map((item) => {
//         const newItem = {
//             ...item,
//             organize_id: (item.organize_id),
//             organize_pid: (item.organize_pid),
//         };

//         if (item.organize && item.organize.length > 0) {
//             newItem.organize = convertIdsToNumber(item.organize);
//         }

//         return newItem;
//     });
// };

const getCurrentAnchor = (activeLink) => {
    if (!activeLink) {
        return '#purchaseInfo';
    }
    return activeLink;
};

// 在组件挂载时转换组织树
onBeforeMount(async () => {
    // if (globalState.orgTree) {
    //     orgTree.value = convertIdsToNumber(globalState.orgTree);
    // }

    await getSoftwareComponentBindCarrier();
    await getChainComponentDetail();
    await getSoftwareComponentBindApp();
});
</script>

<style>
.soft-modal {
    margin: 40px 0;
    left: 50%;
    top: 0;
    margin-left: -420px;
    padding-bottom: 0;

    .ant-modal-content{
        padding: 24px;
    }
    .ant-btn-primary {
        margin-inline-start: 12px !important;
    }
    .ant-form-item{
        margin-bottom: 0;
    }
}

.carry-table{
    .ant-table-thead>tr>th, .ant-table-tbody>tr>td{
        padding: 6px 24px;
        height: 36px;
        font-size: 14px;
    }
    .ant-table-thead>tr>th{
        background-color: #F2F2F2;
        border-bottom: 1px solid #F2F2F2;
        font-weight: 500;
    }

    .ant-table-tbody>tr>td{
        padding: 8px 24px;
        height: 40px;
        font-weight: 400;
    }

    .ant-table-container{
        border: 1px solid #F2F2F2;
        border-bottom: none;
    }

    .ant-table-placeholder .ant-table-cell{
        border-bottom: none !important;
    }
}

.anchor{
    .ant-anchor{
        display: flex;
        /* gap: 16px; */
    }

    .ant-anchor-link{
        padding-inline: 0;
        margin-bottom: 9px;
        font-weight: 500;
    }
}
</style>
