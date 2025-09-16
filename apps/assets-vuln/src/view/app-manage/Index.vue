<template>
    <div class="main-content flex flex-col">
        <InfoCard
            v-if="showInfoCard"
            :capability-name="getSecurityCapabilityShortName(filters.security_capability_type)"
            :total-count="totalApplications"
            :covered-count="coveredCount"
            :uncovered-count="uncoveredCount"
            :initial-collapsed="checkIsCardCollapsed()"
            @collapse="handleCollapseInfoCard"
            @expand="handleExpandInfoCard"
        />

        <div class="h-12 mb-2 bg-white py-[10px] px-6 flex items-center justify-between">
            <div>
                <Input class="mr-2 base-input" v-model:value="filters.name" placeholder="搜索应用名称" />
                <Select :popupClassName="'base-select-dropdown'" class="mr-2 base-select" v-model:value="filters.status" :options="APP_STATUS_OPTION" placeholder="应用状态" />
                <Select :popupClassName="'security-capability-type-select'" class="mr-4 base-select" v-model:value="filters.security_capability_type" :options="SECURITY_CAPABILITY_TYPE" placeholder="安全能力类型" />
                <!-- <Select :popupClassName="'base-select-dropdown'" class="mr-4" v-model:value="filters.issue" placeholder="业务系统" /> -->
                <a-button class="base-button" @click="customResetFilter(filters)">重置</a-button>
            </div>

            <a-button @click="openAppModal = true;editAppData=null;ModalEdit = false" class="text-center base-button" type="primary">新增应用</a-button>
        </div>

        <div class="flex-1 overflow-hidden px-6 py-4 bg-white">
            <div class="h-full overflow-auto">
                <a-table class="base-table" :pagination="false" :ellipsis="true" :loading="{ indicator, spinning: loading }"
                         @change="changePageHandle" :columns="columns" :scroll="{ x: '100%' }" :data-source="listData">

                    <template #emptyText>
                        <Empty />
                    </template>
                    <template #bodyCell="{ column,text, record }">

                        <template v-if="column.dataIndex === 'application_name'">
                            <a-tooltip arrowPointAtCenter>
                                <template #title>{{ text }}</template>
                                <span  @click="$router.push(`/app-manage/detail/${record.application_id}`)"
                                       class="ellipsis hover font-normal">
                                    {{ record.application_name }}
                                </span>
                            </a-tooltip>
                        </template>

                        <template v-if="column.dataIndex === 'business_system_name' || column.dataIndex === 'organize_name'">
                            <a-tooltip arrowPointAtCenter>
                                <template #title>{{ text }}</template>
                                <span class="ellipsis"> {{ text || '-' }} </span>
                            </a-tooltip>
                        </template>

                        <template v-if="column.dataIndex === 'owner_name'">
                            <User v-if="record.owner_nick_name || record.owner_name" :users="[record.owner_nick_name || record.owner_name]" />
                            <span v-else>-</span>
                        </template>

                        <template v-if="column.dataIndex === 'operate'">
                            <div class="flex gap-4 items-center">
                                <span @click="openAppModal = true;editAppData=record ; ModalEdit = true" class="cursor-pointer text-primary">编辑</span>

                                <a-popover :overlayStyle="{ zIndex: 500 }"
                                           :overlayInnerStyle="{ padding: '6px 0px', width: '142px' }" placement="bottomLeft" :arrow="false">
                                    <template #content>
                                        <div class="cursor-pointer">
                                            <div @click="turnOnLog(record.application_id)" class="table-operation-item px-6 py-2">
                                                <span>操作日志</span>
                                            </div>
                                            <!-- <a-popconfirm title="确认删除当前应用？" placement="left" @confirm="delAppHandle(record.application_id)"
                                                          ok-text="确认" cancel-text="取消">

                                            </a-popconfirm> -->
                                            <div @click="canDeleteApp(record)" class="table-operation-item text-error px-6 py-2" >
                                                <span>删除</span>
                                            </div>
                                        </div>

                                    </template>
                                    <span class="icon-hover hover:bg-f2 cursor-pointer">
                                        <EllipsisOutlined class="text-3c text-base" />
                                    </span>
                                </a-popover>
                            </div>

                        </template>

                        <template v-if="column.dataIndex === 'security_capability_type'">
                            <a-tag>{{ getSecurityCapabilityShortName(text?.[0]) }}</a-tag>

                            <a-popover v-if="text?.length >1">
                                <template #content>
                                    <a-tag v-for="item in text.slice(1)" :key="item">{{ getSecurityCapabilityShortName(item) }}</a-tag>
                                </template>
                                <a-tag>+{{ text.length-1}}</a-tag>
                            </a-popover>

                        </template>
                    </template>
                </a-table>

                <div class="flex justify-end mt-4">
                    <a-pagination class="pagination" :show-total="total => `共 ${total.toLocaleString()} 条`"
                                  show-quick-jumper :total=pageConfig.total  @change="changePageHandle"
                                  v-model:current="pageConfig.current" v-model:pageSize="filters.limit" />
                </div>
            </div>
        </div>
    </div>

    <OperationLogModal v-model:open="opetateLog" v-if="opetateLog" :logfilter="logfilter" />
    <AppModal v-model:open="openAppModal" v-if="openAppModal" :editAppData="editAppData" @updateList="getDataAndUpdateStats" :edit = ModalEdit />
</template>

<script setup>
import {
    ref, reactive, onMounted, computed, watch,
    h,
} from 'vue';
import { getAppListApi, delAppApi } from 'api/app';
import { indicator, resetFilter, formatDate } from 'utils';
import { useRoute, useRouter } from 'vue-router';
import { judgeApplicationApi } from 'api/delete';
import { APP_STATUS_OPTION, findApplicationStatusLabel } from '@/constants/app';
import { usePageList } from '@/hooks';
import AppModal from './AppModal.vue';
import { SECURITY_CAPABILITY_TYPE, getSecurityCapabilityShortName } from '@/constants/safetyCapabilities';
import { InfoCard } from '@/components';
import { userInfo } from '@/store';
import { Modal } from 'ant-design-vue';
import warningIcon from '/src/assets/svg/data/icon_warning_colorful-dm.svg';

const route = useRoute();
const router = useRouter();
const { source } = route.query;

// 添加组织ID计算属性
const organize_id = computed(() => userInfo.value?.org_id);

const opetateLog = ref(false);
const logfilter = ref({
    entity_type: 'Application',
    entity_id: null, // 这里可以根据实际情况设置
});
// 开启操作日志
const turnOnLog = (application_id) => {
    opetateLog.value = true;
    logfilter.value.entity_id = String(application_id);
};

const openAppModal = ref(false);
const editAppData = ref();
const filters = reactive({
    name: route.query.name || '',
    status: route.query.status || undefined,
    security_capability_type: route.query.security_capability_type || null,
    limit: Number(route.query.limit) || 15,
});

// 初始化页码配置，从URL查询参数中获取当前页
const initialPage = Number(route.query.page) || 1;

const ModalEdit = ref();

// 信息卡片相关数据
const showInfoCard = ref(false);
const totalApplications = ref(0);
const coveredCount = ref(0);
const uncoveredCount = ref(0);

// 从本地存储获取已收起的信息卡片记录
const getCollapsedInfoCards = () => {
    const collapsedCards = sessionStorage.getItem('collapsedInfoCards');
    return collapsedCards ? JSON.parse(collapsedCards) : {};
};

// 检查当前信息卡片是否已被收起
const checkIsCardCollapsed = () => {
    const collapsedCards = getCollapsedInfoCards();
    // 使用组合键（能力+组织ID）作为唯一标识
    const currentKey = `${filters.security_capability_type}_${organize_id.value}`;
    return collapsedCards[currentKey];
};

// 处理信息卡片收起
const handleCloseInfoCard = () => {
    // 不隐藏卡片，只记录收起状态

    // 保存收起状态到会话存储
    const collapsedCards = getCollapsedInfoCards();
    const currentKey = `${filters.security_capability_type}_${organize_id.value}`;
    collapsedCards[currentKey] = true;
    sessionStorage.setItem('collapsedInfoCards', JSON.stringify(collapsedCards));
};

// 获取应用总数据
const fetchTotalApplications = async () => {
    try {
        // 构建查询参数
        const params = {
            limit: 1,
            offset: 0,
            security_capability_type: null, // 清除可能存在的能力过滤
            organize_id: organize_id.value, // 使用计算属性获取组织ID
        };

        const { data } = await getAppListApi(params);
        totalApplications.value = data.data?.total || 0;

        // 计算未覆盖数量
        uncoveredCount.value = totalApplications.value - coveredCount.value;
    } catch (error) {
        console.error('获取应用总数失败:', error);
    }
};

const {
    pageConfig,
    listData,
    loading,
    changePageHandle,
    getData,
} = usePageList(getAppListApi, filters, initialPage);

// 当列表数据更新时，更新已覆盖应用数量
const updateCoveredCount = () => {
    coveredCount.value = pageConfig.total || 0;
    uncoveredCount.value = totalApplications.value - coveredCount.value;
};

// 创建一个新的函数，先调用getData，然后更新统计信息
const getDataAndUpdateStats = async (...args) => {
    await getData(...args);
    updateCoveredCount();
};

// 检查是否要显示卡片，每当路由参数、安全能力类型或组织变化时调用
const checkShouldShowCard = () => {
    console.log('检查是否显示卡片:', {
        source,
        securityCapabilityType: filters.security_capability_type,
        isCollapsed: checkIsCardCollapsed(),
    });

    // 只有同时满足：1. 来源是dashboard 2. 有安全能力类型筛选，才显示卡片
    if (source === 'dashboard' && filters.security_capability_type) {
        showInfoCard.value = true;
    } else {
        showInfoCard.value = false;
    }
};

// 处理初始加载和刷新时的显示
onMounted(() => {
    // 首先检查是否应该显示卡片
    checkShouldShowCard();

    // 然后获取数据
    fetchTotalApplications();
    getData().then(() => {
        updateCoveredCount();
    });
});

// 监听路由参数变化
watch(() => route.query, () => {
    // 如果路由参数改变，重新检查是否显示卡片
    checkShouldShowCard();
}, { deep: true });

// 监听安全能力类型变化
watch(() => filters.security_capability_type, (newVal, oldVal) => {
    if (newVal !== oldVal) {
        // 当安全能力类型变化时，重新获取数据并检查是否显示信息卡片
        fetchTotalApplications().then(() => {
            checkShouldShowCard();
            getDataAndUpdateStats();
        });
    }
}, { immediate: false });

// 监听筛选条件和页码变化，更新URL查询参数
watch([filters, () => pageConfig.current], () => {
    const query = {
        limit: filters.limit,
        page: pageConfig.current,
    };

    // 只添加有值的筛选条件到查询参数
    if (filters.name) query.name = filters.name;
    if (filters.status !== undefined) query.status = filters.status;
    if (filters.security_capability_type) query.security_capability_type = filters.security_capability_type;

    // 保留来源参数，用于InfoCard显示
    if (source) query.source = source;

    // 更新URL，使用replace避免在历史记录中创建新条目
    router.replace({ query });
}, { deep: true });

// 新增一个单独的筛选条件监听，确保任何筛选条件变化时都重新计算统计数据
watch(() => [filters.name, filters.status], () => {
    if (showInfoCard.value && filters.security_capability_type) {
        getDataAndUpdateStats();
    }
}, { deep: true });

// 监听用户信息变化，确保在切换部门或业务系统时卡片数据也能刷新
watch(() => userInfo.value, () => {
    // 重新获取应用总数并更新统计信息
    if (showInfoCard.value && filters.security_capability_type) {
        fetchTotalApplications().then(() => {
            // 由于用户信息变化可能导致筛选条件下的数据也变化，所以也需要重新获取列表数据
            getDataAndUpdateStats();
        });
    }
    // 重新检查是否应该显示卡片
    checkShouldShowCard();
}, { deep: true });

// 自定义重置筛选函数，需要同时更新URL
const customResetFilter = (filtersObj) => {
    resetFilter(filtersObj);
    pageConfig.current = 1;

    // 保留source参数
    const query = {};
    if (source) query.source = source;
    query.limit = filters.limit;
    query.page = 1;

    router.replace({ query });
};

const columns = ref([
    {
        title: '应用名称',
        dataIndex: 'application_name',
        width: 280,
        fixed: 'left',
    },
    // {
    //     title: '应用版本',
    //     dataIndex: 'application_version',
    //     width: 178,
    //     customRender({ text }) { return text || '-'; },
    // },
    {
        title: '应用状态',
        dataIndex: 'application_status',
        width: 178,
        customRender({ text }) { return findApplicationStatusLabel(text) || '-'; },
    },
    {
        title: '应用负责人',
        dataIndex: 'owner_name',
        width: 178,
    },
    {
        title: '所属组织',
        dataIndex: 'organize_name',
        width: 178,
        ellipsis: true,
    },
    {
        title: '安全能力类型',
        dataIndex: 'security_capability_type',
        width: 200,
    },
    {
        title: '最近更新时间',
        dataIndex: 'updated_at',
        width: 178,
        customRender({ text }) { return formatDate(text) || '-'; },
    },
    {
        title: '操作',
        dataIndex: 'operate',
        width: 120,
        fixed: 'right',
    },
]);

const delAppHandle = async (id) => {
    try {
        await delAppApi({
            id,
        });
        getDataAndUpdateStats();
    } catch (error) {
        console.log(error);
    }
};

const handleCollapseInfoCard = () => {
    handleCloseInfoCard();
};

const handleExpandInfoCard = () => {
    // 恢复展开状态
    const collapsedCards = getCollapsedInfoCards();
    const currentKey = `${filters.security_capability_type}_${organize_id.value}`;

    // 从收起状态列表中移除
    if (collapsedCards[currentKey]) {
        delete collapsedCards[currentKey];
        sessionStorage.setItem('collapsedInfoCards', JSON.stringify(collapsedCards));
    }
};

// 判断能否删除应用
const canDeleteApp = async (record) => {
    console.log('判断是否可以删除应用:', record);
    const { data } = await judgeApplicationApi(record.application_id);
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
                    await delAppHandle(record.application_id);
                } catch {
                    return console.log('Oops errors!');
                } finally {
                    getData();
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
            content: '该应用下关联了其他数据，请解除关联后再删除',
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
