<template>
    <div class="main-content flex flex-col gap-[8px]">
        <InfoCard
            v-if="showInfoCard"
            :capability-name="getSecurityCapabilityLabel(filters.security_capability_id)"
            :total-count="totalIssues"
            :covered-count="0"
            :uncovered-count="unresolvedCount"
            :initial-collapsed="checkIsCardCollapsed()"
            @collapse="handleCollapseInfoCard"
            @expand="handleExpandInfoCard"
            :card-title="getCardTitle()"
            :total-title="getTotalTitle()"
            :uncovered-title="getUnresolvedTitle()"
            :guide-text="getGuideText()"
            :tag-label="getSecurityCapabilityLabel(filters.security_capability_id)"
            hide-covered
        />

        <div class="select-content h-fit bg-white py-[8px] px-[24px] flex flex-col gap-[8px]">
            <div class="flex items-center gap-2 w-full">

                <a-tabs class="security-capability-tabs" v-model:activeKey="activeKey" @change="handleTabChange" >

                    <template #moreIcon>
                        <div class="moreIcon">
                            <span>更多</span>
                            <Svg class="normal-icon" name="arrow" width="12px"></Svg>
                            <Svg class="active-icon" name="arrow" color="#6C87FF" width="12px"></Svg>
                        </div>
                    </template>
                    <a-tab-pane key="all" tab="全部"/>
                    <a-tab-pane v-for="item in SECURITY_CAPABILITY_OPTION" :key="item.value" :tab="item.label" />
                </a-tabs>

            </div>
            <div class="flex items-center gap-4">
                <div class="flex items-center gap-2">
                    <Input v-model:value="filters.issue_title" placeholder="搜索安全问题" class="w-[240px] base-input" />

                    <Select :popupClassName="'base-select-dropdown'" class=" base-select" v-model:value="filters.issue_level" :options="SEC_LEVEL_OPTION" placeholder="安全问题级别" />
                    <!-- <Select :popupClassName="'base-select-dropdown'" class=" base-select" v-model:value="filters.carrier_type" :options="CARRIER_OPTION" placeholder="载体类型" /> -->

                    <Select :maxTagCount="1" mode="multiple" :popupClassName="'base-select-dropdown'" class="min-w-[100px] base-select" v-model:value="filters.issue_status" :options="DISPOSAL_STATUS" placeholder="处置状态" />

                </div>
                <a-button class="base-button" @click="customResetFilter(filters)">重置</a-button>
            </div>

        </div>

        <div class="h-full px-[24px] py-[16px] gap-[24px] flex flex-col  bg-white overflow-auto">
            <a-table class="base-table" :pagination="false"  :loading="{ indicator, spinning: loading }" :columns="columns"
                     :scroll="{ x: '100%' }" :data-source="listData">
                <template #emptyText>
                    <Empty />
                </template>
                <template #bodyCell="{ column, index, text, record }">

                    <template v-if="column.dataIndex === 'issue_title' || column.dataIndex === 'business_system_name'
                        || column.dataIndex === 'application_name' || column.dataIndex === 'repo_name' ">
                        <a-tooltip arrowPointAtCenter>
                            <template #title>{{ text }}</template>
                            <span  v-if="column.dataIndex === 'issue_title'" @click="RouteJump(index,record.issue_id)" class="ellipsis hover w-full">
                                {{ text }}
                            </span>
                            <span class="w-full ellipsis" v-else>
                                {{ text || '-' }}
                            </span>
                        </a-tooltip>
                    </template>

                    <template v-else-if="column.dataIndex === 'issue_level'">
                        <SecIssueLevel :text />
                    </template>

                    <template v-else-if="column.dataIndex === 'created_at' || column.dataIndex === 'discovery_at'">
                        {{ formatDate(text) }}
                    </template>

                    <template v-else-if="column.dataIndex === 'carrier_name'">
                        <a-tooltip arrowPointAtCenter>
                            <template #title>{{ text }}</template>
                            <span class="ellipsis">
                                {{ text || '-' }}
                            </span>
                        </a-tooltip>
                    </template>

                    <template v-else-if="column.dataIndex === 'capability_names'">
                        <a-tag>{{ text?.[0] }}</a-tag>

                        <a-popover v-if="text?.length >1">
                            <template #content>
                                <a-tag v-for="item in text.slice(1)" :key="item">{{ item}}</a-tag>
                            </template>
                            <a-tag>+{{ text.length-1}}</a-tag>
                        </a-popover>

                    </template>

                    <template v-else-if="column.dataIndex === 'carrier_type' ">
                        {{ CARRIER_OPTION.find((item) => item.value === text)?.label }}
                    </template>

                    <template v-else-if="column.dataIndex === 'issue_status'">
                        <a-select
                            ref="select"
                            v-model:value="record.issue_status"
                            style="width: 100%"
                        >
                            <a-select-option v-for="item in DISPOSAL_STATUS"
                                             :key="item.value" :value="item.value" @click="handleSelect(item.value, record.issue_id)">
                                {{ item.label }}
                            </a-select-option>
                        </a-select>
                    </template>

                    <template v-else-if="column.dataIndex === 'issue_owner_nick_name'">
                        <User v-if="text !== ''" :users="[text]" />
                        <span v-else>-</span>
                    </template>

                    <template v-else-if="column.dataIndex === 'operation'">
                        <div class="flex gap-4 py-3">
                            <!-- <a-popover placement="bottomRight" trigger="click">
                                <template #content>
                                    <div class="w-[160px] cursor-pointer">
                                        <div class="mb-2 h-8 leading-8" @click="opetateLog=true">操作日志</div>
                                    </div>
                                </template>
                                <span class="cursor-pointer">···</span>
                            </a-popover> -->

                            <a-popover :overlayStyle="{ zIndex: 500 }"
                                       :overlayInnerStyle="{ padding: '6px 0px', width: '142px' }" placement="bottomLeft" :arrow="false">
                                <template #content>
                                    <div class="cursor-pointer">
                                        <div @click="turnOnLog(record.issue_id)" class="table-operation-item px-6 py-2">
                                            <span>操作日志</span>
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
import {
    ref, reactive, onBeforeMount, watch, onMounted, computed,
} from 'vue';
import { getSecListApi, getSecUpdateStatusApi } from 'api/app';
import { indicator, formatDate, resetFilter } from 'utils';
import { message } from 'ant-design-vue';
import { SEC_LEVEL_OPTION } from 'view/app-manage/constats';
import {
    CARRIER_OPTION, DISPOSAL_STATUS, SECURITY_CAPABILITY_OPTION, getSecurityCapabilityList,
} from 'constants/app';
import { useRoute, useRouter } from 'vue-router';
import { usePageList } from '@/hooks';
import { InfoCard } from '@/components';
import { userInfo } from '@/store';

const opetateLog = ref(false);
const logfilter = ref({
    entity_type: 'Issue',
    entity_id: null, // 这里可以根据实际情况设置
});
// 开启操作日志
const turnOnLog = (issue_id) => {
    opetateLog.value = true;
    logfilter.value.entity_id = String(issue_id);
};

// 从路由中获取参数
const route = useRoute();
const routerInstance = useRouter();
console.log(route);

// 初始化筛选条件，优先从URL查询参数中获取
const filters = reactive({
    limit: Number(route.query.limit) || 15,
    issue_title: route.query.issue_title || null,
    issue_level: route.query.issue_level || null,
    carrier_type: route.query.carrier_type || null,
    source: route.query.source || null,
    issue_status: route.query.issue_status ? [route.query.issue_status] : [],
    security_capability_id: route.query.security_capability_id ? Number(route.query.security_capability_id) : null,
});

const activeKey = ref(route.query.security_capability_id ? Number(route.query.security_capability_id) : 'all');

// 初始化页码配置，从URL查询参数中获取当前页
const initialPage = Number(route.query.page) || 1;

const {
    getData, changePageHandle, pageConfig, loading, listData,
} = usePageList(getSecListApi, filters, initialPage);

// const listData = ref([
//     {
//         issue_id: 1,
//         issue_title: '测试标题1',
//         business_system_name: '测试业务系统1',
//         application_name: '测试应用1',
//         issue_level: 'high',
//         issue_owner_nick_name: '测试负责人1',
//         carrier_name: '测试载体1',
//         carrier_type: 'web',
//         issue_status: 'open',
//         operation: '查看',
//     },
// ]);

// 信息卡片相关数据
const showInfoCard = ref(false);
const totalIssues = ref(0);
const unresolvedCount = ref(0);

// 将userInfo转为计算属性
const organize_id = computed(() => userInfo.value?.org_id);

// 从本地存储获取已收起的信息卡片记录
const getCollapsedInfoCards = () => {
    const collapsedCards = sessionStorage.getItem('collapsedSecIssueCards');
    return collapsedCards ? JSON.parse(collapsedCards) : {};
};

// 检查当前信息卡片是否已被收起
const checkIsCardCollapsed = () => {
    const collapsedCards = getCollapsedInfoCards();
    // 使用组合键（能力ID+组织ID）作为唯一标识
    const currentKey = `${filters.security_capability_id}_${organize_id.value}`;
    return collapsedCards[currentKey];
};

// 获取问题等级文本
const getIssueLevelText = (level) => {
    if (!level) return '';

    const levelMapping = {
        critical: '严重',
        high: '高危',
        medium: '中危',
        low: '低危',
        info: '提示',
    };

    return levelMapping[level] || level;
};

// 获取安全能力标签
const getSecurityCapabilityLabel = (id) => {
    if (!id) return '';

    // SECURITY_CAPABILITY_OPTION是一个ref，需要使用.value访问其值
    const options = SECURITY_CAPABILITY_OPTION.value || SECURITY_CAPABILITY_OPTION;

    // 如果是数组，使用find查找
    if (Array.isArray(options)) {
        const capability = options.find((item) => Number(item.value) === Number(id));
        return capability ? capability.label : '';
    }

    return '';
};

// 动态生成卡片标题
const getCardTitle = () => {
    // 基础标题
    let title = 'SII 指数改进：解决安全问题';

    // 获取问题等级文本
    const levelText = filters.issue_level ? getIssueLevelText(filters.issue_level) : '';
    if (levelText) {
        title = `SII 指数改进：提升${levelText}等级安全问题解决程度`;
    }

    return title;
};

// 动态生成总数标题
const getTotalTitle = () => {
    let baseTitle = '安全问题总数';
    const levelText = filters.issue_level ? getIssueLevelText(filters.issue_level) : '';

    if (levelText) {
        baseTitle = `${levelText}等级安全问题`;
    }

    return baseTitle;
};

// 动态生成待处理标题
const getUnresolvedTitle = () => {
    let baseTitle = '待处理安全问题';
    const levelText = filters.issue_level ? getIssueLevelText(filters.issue_level) : '';

    if (levelText) {
        baseTitle = `待处理${levelText}等级安全问题`;
    }

    return baseTitle;
};

// 动态生成指导文本
const getGuideText = () => {
    const levelText = filters.issue_level ? getIssueLevelText(filters.issue_level) : '';
    let problemDesc = '安全问题';

    // 只添加等级信息，不添加能力信息
    if (levelText) {
        problemDesc = `${levelText}等级安全问题`;
    }

    // 使用<strong>标签包裹数字，确保样式正确
    return `下一步工作：对 <strong>${unresolvedCount.value}</strong> 个待处理的${problemDesc}进行跟进处理，降低安全风险。`;
};

// 获取安全问题总数据 - 更新为根据当前筛选条件获取
const fetchTotalIssues = async () => {
    try {
        // 构建查询参数，保留当前筛选条件中的安全能力和问题等级
        const params = {
            limit: 15,
            page: 1,
            organize_id: organize_id.value,
        };

        // 保留问题等级筛选
        if (filters.issue_level) {
            params.issue_level = filters.issue_level;
        }

        // 保留安全能力筛选
        if (filters.security_capability_id) {
            params.security_capability_id = filters.security_capability_id;
        }

        // 获取符合当前筛选条件的安全问题总数（不包含状态筛选）
        const { data } = await getSecListApi(params);
        totalIssues.value = data.data?.total || 0;

        // 如果当前筛选条件已经包含未处置状态，直接使用页面数据
        if (Array.isArray(filters.issue_status) && filters.issue_status.includes('open')) {
            unresolvedCount.value = pageConfig.total || 0;
        } else {
            // 添加未处置状态筛选，获取未处置问题数
            const unresolvedParams = { ...params, issue_status: ['open'] };
            const unresolvedResponse = await getSecListApi(unresolvedParams);
            unresolvedCount.value = unresolvedResponse.data.data?.total || 0;
        }
    } catch (error) {
        console.error('获取安全问题数据失败:', error);
    }
};

// 检查是否要显示卡片
const checkShouldShowCard = () => {
    // 只需要判断来源是dashboard，无需检查安全能力ID
    if (filters.source === 'dashboard') {
        showInfoCard.value = true;
    } else {
        showInfoCard.value = false;
    }
};

// 处理卡片收起事件
const handleCollapseInfoCard = () => {
    const collapsedCards = getCollapsedInfoCards();
    const currentKey = `${filters.security_capability_id}_${organize_id.value}`;
    collapsedCards[currentKey] = true;
    sessionStorage.setItem('collapsedSecIssueCards', JSON.stringify(collapsedCards));
};

// 处理卡片展开事件
const handleExpandInfoCard = () => {
    const collapsedCards = getCollapsedInfoCards();
    const currentKey = `${filters.security_capability_id}_${organize_id.value}`;

    // 从收起状态列表中移除
    if (collapsedCards[currentKey]) {
        delete collapsedCards[currentKey];
        sessionStorage.setItem('collapsedSecIssueCards', JSON.stringify(collapsedCards));
    }
};

// 自定义重置筛选函数，需要同时更新URL
const customResetFilter = (filtersObj) => {
    resetFilter(filtersObj);
    pageConfig.current = 1;

    // 保留source参数
    const query = {};
    if (filters.source) query.source = filters.source;
    query.limit = filters.limit;
    query.page = 1;

    routerInstance.replace({ query });
};

const handleTabChange = (key) => {
    console.log(key);
    customResetFilter(filters);
    if (key === 'all') {
        filters.security_capability_id = null;
    } else {
        filters.security_capability_id = Number(key);
    }
};

// 监听路由参数变化
watch(() => route.query, () => {
    // 如果路由参数改变，重新检查是否显示卡片
    checkShouldShowCard();
}, { deep: true });

// 监听安全能力ID和问题等级变化
watch(() => [filters.security_capability_id, filters.issue_level, filters.issue_status], () => {
    if (showInfoCard.value) {
        // 当筛选条件变化且卡片显示时，重新获取数据
        fetchTotalIssues();
    }
}, { deep: true });

// 监听页面数据变化，同步更新卡片数据
watch(() => pageConfig.total, (newTotal) => {
    // 如果当前筛选条件包含未处置，则直接更新未处理数量
    if (Array.isArray(filters.issue_status) && filters.issue_status.includes('open')) {
        unresolvedCount.value = newTotal;
    }
});

// 监听筛选条件和页码变化，更新URL查询参数
watch([filters, () => pageConfig.current], () => {
    const query = {
        limit: filters.limit,
        page: pageConfig.current,
    };

    // 只添加有值的筛选条件到查询参数
    if (filters.issue_title) query.issue_title = filters.issue_title;
    if (filters.issue_level) query.issue_level = filters.issue_level;
    if (filters.carrier_type) query.carrier_type = filters.carrier_type;
    if (filters.issue_status) query.issue_status = filters.issue_status;
    if (filters.security_capability_id) query.security_capability_id = filters.security_capability_id;

    // 保留来源参数，用于InfoCard显示
    if (filters.source) query.source = filters.source;

    // 更新URL，使用replace避免在历史记录中创建新条目
    routerInstance.replace({ query });
}, { deep: true });

// 监听用户信息变化，确保在切换部门或业务系统时卡片数据也能刷新
watch(() => userInfo.value, () => {
    // 重新获取问题总数并更新统计信息
    if (showInfoCard.value) {
        fetchTotalIssues().then(() => {
            // 由于用户信息变化可能导致筛选条件下的数据也变化，所以也需要重新获取列表数据
            getData();
        });
    }
    // 重新检查是否应该显示卡片
    checkShouldShowCard();
}, { deep: true });

onMounted(() => {
    // 首先检查是否应该显示卡片
    checkShouldShowCard();

    // 然后获取数据
    fetchTotalIssues();
    getData();
});

const columns = ref([
    {
        title: '安全问题',
        dataIndex: 'issue_title',
        width: 200,
        fixed: 'left',
        ellipsis: true,
    },
    {
        title: '问题等级',
        dataIndex: 'issue_level',
        width: 100,
    },
    // {
    //     title: '所属应用载体',
    //     dataIndex: 'carrier_name',
    //     width: 200,
    // },
    // {
    //     title: '应用载体类型',
    //     dataIndex: 'carrier_type',
    //     width: 120,
    // },
    // {
    //     title: '安全能力',
    //     dataIndex: 'capability_names',
    //     width: 178,
    // },
    {
        title: '漏洞',
        dataIndex: 'vuln_count',
        width: 80,
    },
    {
        title: '负责人',
        dataIndex: 'issue_owner_nick_name',
        width: 120,
    },
    {
        title: '处置状态',
        dataIndex: 'issue_status',
        width: 120,
    },
    {
        title: '漏洞发现时间',
        dataIndex: 'discovery_at',
        width: 180,
        type: 'date',
    },
    {
        title: '创建时间',
        dataIndex: 'created_at',
        width: 180,
        type: 'date',
    },
    // {
    //     title: '操作',
    //     dataIndex: 'operation',
    //     width: '62px',
    //     fixed: 'right',
    // },

]);

// 处理选择事件
async function handleSelect(key, issue_id) {
    const response = await getSecUpdateStatusApi({ issue_id, status: key });
    await getData();
    if (response.status === 200) message.success('更新成功');
}

// 跳转路由
const RouteJump = (Index, id) => {
    const record = listData.value[Index];
    sessionStorage.setItem('security_question', JSON.stringify(record));
    routerInstance.push(`/sec-issue/detail/${id}`);
};

onBeforeMount(async () => {
    await getSecurityCapabilityList();
});
</script>

<style>

.ant-tabs-dropdown{
    .ant-tabs-dropdown-menu-title-content{
        font-size: 14px;
    }
}

</style>

<style scoped>

:deep(.security-capability-tabs) {

    width: 100%;

    .ant-tabs-nav {
        margin-bottom: 0 !important;
        padding: 0 !important;
    }

    .ant-tabs-nav-list{
        gap: 40px !important;
    }

    .ant-tabs-tab {
        padding: 6px 0px !important;
        margin: 0 !important;
        font-size: 16px !important;

        &:hover {
            color: #6C87FF !important;
        }

        &.ant-tabs-tab-active {
            .ant-tabs-tab-btn {
                color: #6C87FF !important;
                font-weight: 500 !important;
            }
        }
    }

    .ant-tabs-ink-bar {
        background: #6C87FF !important;
    }
/*
    .ant-tabs-nav-wrap{
        &::after{
            box-shadow: none;
        }
    } */
}

.moreIcon{
    transition: transform 0.3s;
    display: inline-flex;
    align-items: center;
    white-space: nowrap;

    .normal-icon{
        display: block;
    }

    .active-icon{
        display: none;
    }

    span{
        margin-right: 4px;
    }

    &:hover {
        cursor: pointer;
        span{
            color: #6C87FF;
        }

        .normal-icon{
            display: none;
        }

        .active-icon{
            display: block;
        }
    }
}

</style>
