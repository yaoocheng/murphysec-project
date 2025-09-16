<template>
    <div class="main-content flex flex-col gap-[8px]">
        <div class="select-content h-fit bg-white py-[8px] px-[24px] flex flex-col gap-[8px]">
            <div class="flex items-center gap-4">
                <div class="flex items-center gap-2">
                    <Input v-model:value="filters.title" placeholder="搜索任务" class="w-[240px] base-input" />
                    <Select
                        :popupClassName="'base-select-dropdown'"
                        class="base-select w-[140px]"
                        v-model:value="filters.priority"
                        :options="PRIORITY_OPTIONS"
                        placeholder="处置优先级"
                        allowClear
                    />
                    <Select
                        :popupClassName="'base-select-dropdown'"
                        class="base-select w-[120px]"
                        v-model:value="filters.status"
                        :options="STATUS_OPTIONS"
                        placeholder="处置状态"
                        allowClear
                    />
                </div>
                <a-button class="base-button" @click="customResetFilter(filters)">重置</a-button>
            </div>
        </div>

        <div class="h-full px-[24px] py-[16px] gap-[24px] flex flex-col bg-white overflow-auto">
            <a-table
                class="base-table"
                :pagination="false"
                :loading="loading"
                :columns="columns"
                :scroll="{ x: '100%' }"
                :data-source="listData"
                :row-key="(record) => record.risk_disposal_task_id"
            >
                <template #emptyText>
                    <Empty />
                </template>
                <template #bodyCell="{ column, record, index }">
                    <template v-if="column.dataIndex === 'title'">
                        <a-tooltip arrowPointAtCenter>
                            <template #title>{{ record.title }}</template>
                            <span @click="RouteJump(index, record.risk_disposal_task_id)" class="ellipsis hover w-full">
                                {{ record.title }}
                            </span>
                        </a-tooltip>
                    </template>
                    <template v-else-if="column.dataIndex === 'priority'">
                        <div class="priority-tag-container" :class="getPriorityContainerClass(record.priority)">
                            <span class="priority-tag-text" :style="getPriorityTextStyle(record.priority)">
                                {{ getPriorityText(record.priority) }}
                            </span>
                        </div>
                    </template>
                    <template v-else-if="column.dataIndex === 'cri_reduction'">
                        <span>CRI
                            <Svg
                                width="12px" height="12px" name="down-arrow" class="align-[-1px] text-[#16a34a]"></Svg>
                            <span class="text-green-600">{{ record.cri_reduction }}</span>
                        </span>
                    </template>
                    <template v-else-if="column.dataIndex === 'status'">
                        {{ STATUS_OPTIONS.find(item => item.value === record.status)?.label }}
                        <!-- <a-select
                            ref="select"
                            v-model:value="record.status"
                            style="width: 100%"
                        >
                            <a-select-option v-for="item in STATUS_OPTIONS"
                                             :key="item.value" :value="item.value" @click="handleSelect(item.value, record.risk_disposal_task_id)">
                                {{ item.label }}
                            </a-select-option>
                        </a-select> -->
                    </template>
                    <template v-else-if="column.dataIndex === 'issue_count'">
                        <span>{{ record.issue_count || 0 }}</span>
                    </template>
                    <template v-else-if="column.type === 'date'">
                        <span>{{ formatDate(record[column.dataIndex]) }}</span>
                    </template>
                    <template v-else>
                        <span>{{ record[column.dataIndex] }}</span>
                    </template>
                </template>
            </a-table>

            <div class="flex justify-end mt-4">
                <a-pagination class="pagination" :show-total="total => `共 ${total.toLocaleString()} 条`"
                              show-quick-jumper :total="pageConfig.total"  @change="changePageHandle"
                              v-model:current="pageConfig.current" v-model:pageSize="pageConfig.pageSize" />
            </div>
        </div>

        <OperationLogModal v-model:open="opetateLog" v-if="opetateLog" :logfilter="logfilter" />
    </div>
</template>

<script setup>
import {
    ref, reactive, watch, onMounted, onBeforeUnmount,
} from 'vue';
import { getRiskTaskListApi } from 'api/app';
import { formatDate, resetFilter } from 'utils';
// import { message } from 'ant-design-vue';
import { useRoute, useRouter } from 'vue-router';
import {
    Input, Select, OperationLogModal, Empty,
} from '@/components';
import { userInfo } from '@/store';

const opetateLog = ref(false);
const logfilter = ref({
    entity_type: 'RiskTask',
    entity_id: null,
});

// 从路由中获取参数
const route = useRoute();
const routerInstance = useRouter();

// 组件卸载标志
const isUnmounted = ref(false);

// 处置优先级选项
const PRIORITY_OPTIONS = [
    { value: 'strongRecommend', label: '强烈建议修复' },
    { value: 'recommend', label: '建议修复' },
    { value: 'optional', label: '可选修复' },
];

// 处置状态选项
const STATUS_OPTIONS = [
    { value: 'pending', label: '待处置' },
    { value: 'in_progress', label: '处置中' },
    { value: 'completed', label: '已完成' },
];

// 初始化筛选条件
const filters = reactive({
    title: route.query.title || '',
    priority: route.query.priority || null,
    status: route.query.status || null,
});

// 页面配置
const pageConfig = reactive({
    current: Number(route.query.page) || 1,
    pageSize: Number(route.query.page_size) || 15,
    total: 0,
});

const loading = ref(false);
const listData = ref([]);

// 获取数据
const getData = async () => {
    // 防止在组件卸载时发送请求
    if (isUnmounted.value) return;

    loading.value = true;
    try {
        const params = {
            page: pageConfig.current,
            page_size: pageConfig.pageSize,
            organize_id: userInfo.value?.org_id,
        };

        // 只添加有值的筛选条件
        if (filters.title) params.title = filters.title;
        if (filters.priority) params.priority = filters.priority;
        if (filters.status) params.status = filters.status;

        const response = await getRiskTaskListApi(params);
        if (response.status === 200) {
            listData.value = response.data.data?.list || [];
            pageConfig.total = response.data.data?.total || 0;
        }
    } catch (error) {
        console.error('获取任务列表失败:', error);
    } finally {
        loading.value = false;
    }
};

// 处理页码变化
const changePageHandle = (page, size) => {
    pageConfig.current = page;
    pageConfig.pageSize = size;
    getData();
};

// 获取处置优先级文本
const getPriorityText = (priority) => {
    switch (priority) {
        case 'strongRecommend':
            return '强烈建议修复';
        case 'recommend':
            return '建议修复';
        case 'optional':
            return '可选修复';
        default:
            return '未知';
    }
};

// 获取处置优先级容器样式
const getPriorityContainerClass = (priority) => {
    switch (priority) {
        case 'strongRecommend':
            return 'priority-container-critical';
        case 'recommend':
            return 'priority-container-high';
        case 'optional':
            return 'priority-container-medium';
        default:
            return 'priority-container-unknown';
    }
};

// 获取处置优先级文字样式
const getPriorityTextStyle = (priority) => {
    switch (priority) {
        case 'strongRecommend':
            return {
                background: 'linear-gradient(274.85deg, #FF4C50 0%, #D50004 100%)',
                '-webkit-background-clip': 'text',
                '-webkit-text-fill-color': 'transparent',
                'background-clip': 'text',
                'font-family': "'PingFang SC', sans-serif",
            };
        case 'recommend':
            return {
                background: 'linear-gradient(135deg, #D56300 0%, #FFA04C 100%)',
                '-webkit-background-clip': 'text',
                '-webkit-text-fill-color': 'transparent',
                'background-clip': 'text',
                'font-family': "'PingFang SC', sans-serif",
            };
        case 'optional':
            return {
                background: 'linear-gradient(274.85deg, #FFCC33 0%, #D5A000 100%)',
                '-webkit-background-clip': 'text',
                '-webkit-text-fill-color': 'transparent',
                'background-clip': 'text',
                'font-family': "'PingFang SC', sans-serif",
            };
        default:
            return {
                color: '#666666',
            };
    }
};

// 处理选择事件
// const handleSelect = async (key, taskId) => {
//     try {
//         const response = await updateRiskTaskStatusApi({
//             id: taskId.toString(),
//             status: key,
//         });
//         if (response.status === 200) {
//             message.success('状态更新成功');
//             await getData();
//         }
//     } catch (error) {
//         console.error('更新状态失败:', error);
//         message.error('状态更新失败');
//     }
// };

// 自定义重置筛选函数，需要同时更新URL
const customResetFilter = (filtersObj) => {
    resetFilter(filtersObj);
    pageConfig.current = 1;

    // 重置URL查询参数
    const query = {
        page: 1,
        page_size: pageConfig.pageSize,
    };

    routerInstance.replace({ query });
};

// 监听筛选条件变化，自动获取数据
watch([filters], () => {
    getData();
}, { deep: true });

// 监听筛选条件和页码变化，更新URL查询参数
watch([filters, () => pageConfig.current, () => pageConfig.pageSize], () => {
    const query = {
        page: pageConfig.current,
        page_size: pageConfig.pageSize,
    };

    // 只添加有值的筛选条件到查询参数
    if (filters.title) query.title = filters.title;
    if (filters.priority) query.priority = filters.priority;
    if (filters.status) query.status = filters.status;

    // 更新URL
    routerInstance.replace({ query });
}, { deep: true });

// 监听用户信息变化，确保在切换组织或业务系统时重新获取数据
watch(() => userInfo.value, () => {
    // 防止在组件卸载时发送请求
    if (isUnmounted.value) return;

    // 确保用户信息存在且有效
    if (!userInfo.value || !userInfo.value.org_id) return;
    // 当用户信息变化时（如切换组织或业务系统），重置页码并重新获取列表数据
    pageConfig.current = 1;
    getData();
}, { deep: true });

onMounted(() => {
    getData();
});

// 组件卸载前清理
onBeforeUnmount(() => {
    isUnmounted.value = true;
});

// 表格列定义
const columns = ref([
    {
        title: '任务标题',
        dataIndex: 'title',
        width: 250,
        fixed: 'left',
        ellipsis: true,
    },
    {
        title: '处置优先级',
        dataIndex: 'priority',
        width: 120,
    },
    {
        title: '处置状态',
        dataIndex: 'status',
        width: 120,
    },
    {
        title: '安全问题数量',
        dataIndex: 'issue_count',
        width: 120,
    },
    {
        title: '预期效果',
        dataIndex: 'cri_reduction',
        width: 120,
    },
    {
        title: '负责人',
        dataIndex: 'assignee_nick_name',
        width: 120,
    },
    {
        title: '创建时间',
        dataIndex: 'created_at',
        width: 180,
        type: 'date',
    },
    {
        title: '更新时间',
        dataIndex: 'updated_at',
        width: 180,
        type: 'date',
    },
]);

// 跳转到详情页
const RouteJump = (Index, id) => {
    const record = listData.value[Index];
    sessionStorage.setItem('risk_task', JSON.stringify(record));
    routerInstance.push(`/risk-task/detail/${id}`);
};

</script>

<style scoped>
.table-style {
    @apply border border-gray-200 rounded-[4px];
}

.table-style .ant-table-thead > tr > th {
    @apply bg-gray-50 text-gray-700 font-medium;
}

.table-style .ant-table-tbody > tr:hover > td {
    @apply bg-blue-50;
}

.pagination {
    @apply mt-4;
}

.priority-tag-container {
    @apply inline-flex items-center justify-center py-[3px] px-[8px] rounded-[3px] border border-solid;
}

.priority-container-critical {
    border-color: #ff4c5059;
    background: linear-gradient(274.85deg, rgba(255, 76, 80, 0.1) 0%, rgba(213, 0, 4, 0.1) 100%);
}

.priority-container-high {
    border-color: #ffa04c54;
    background: linear-gradient(274.85deg, rgba(255, 160, 76, 0.1) 0%, rgba(213, 99, 0, 0.1) 100%);
}

.priority-container-medium {
    border-color: #ffcc3354;
    background: linear-gradient(274.85deg, rgba(255, 204, 51, 0.1) 0%, rgba(213, 160, 0, 0.1) 100%);
}

.priority-container-unknown {
    @apply bg-gray-100 border-gray-200;
}

.priority-tag-text {
    @apply text-[12px] font-medium leading-[1.5em] whitespace-nowrap;
}
</style>
