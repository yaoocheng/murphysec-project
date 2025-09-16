<template>
    <a-modal :title="currentView === 'list' ? '执行记录' : '日志详情'" centered :footer="null" :width="900" :body-style="{ height: '600px', overflow: 'hidden' }">
        <!-- 列表视图 -->
        <div v-if="currentView === 'list'" class="h-full flex flex-col">
            <div class="flex items-center justify-between mb-4">
                <div class="text-85">
                    共 <span class="text-3c font-medium">{{ pageConfig.total }}</span> 条数据
                </div>

                <Select :popupClassName="'base-select-dropdown'" placement="bottomRight" :bordered="false" class="w-[100px]" :options="EXEC_STATUS_OPTION"
                        v-model:value="filters.plug_status" placeholder="执行状态" />
            </div>

            <div class="flex-1 overflow-hidden">
                <a-table class="base-table" :pagination="false" size="small" :loading="{ indicator, spinning: loading }"
                         :columns="columns" :scroll="{ x: '100%', y: '400px' }" @change="changePageHandle"
                         :data-source="listData">
                    <template #emptyText>
                        <Empty />
                    </template>
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.dataIndex === 'created_at'">
                            {{ formatDate(record.created_at) }}
                        </template>
                        <template v-if="column.dataIndex === 'job_status'">
                            <a-tag :color="getStatusColor(record.job_status)">
                                {{ EXEC_STATUS_OPTION.find(({ value }) => value === record.job_status)?.label }}
                            </a-tag>
                        </template>
                        <template v-if="column.dataIndex === 'operate'">
                            <a-tooltip v-if="!isLogActionEnabled(record.job_status)" title="任务正在执行中，不可查看或下载日志">
                                <a-button type="link" size="small" @click="viewLog(record)" :disabled="!isLogActionEnabled(record.job_status)" class="p-0 h-auto mr-3 inline-flex items-center">
                                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                    </svg>
                                    查看日志
                                </a-button>
                            </a-tooltip>
                            <a-button v-else type="link" size="small" @click="viewLog(record)" :disabled="!isLogActionEnabled(record.job_status)" class="p-0 h-auto mr-3 inline-flex items-center">
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                </svg>
                                查看日志
                            </a-button>
                            <a-tooltip v-if="!isLogActionEnabled(record.job_status)" title="任务正在执行中，不可查看或下载日志">
                                <a-button type="link" size="small" @click="downloadFile(getExecLogApi, {plug_log_id: record.plug_job_log_id})" :disabled="!isLogActionEnabled(record.job_status)" class="p-0 h-auto inline-flex items-center">
                                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                    </svg>
                                    下载日志
                                </a-button>
                            </a-tooltip>
                            <a-button v-else type="link" size="small" @click="downloadFile(getExecLogApi, {plug_log_id: record.plug_job_log_id})" :disabled="!isLogActionEnabled(record.job_status)" class="p-0 h-auto inline-flex items-center">
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                                下载日志
                            </a-button>
                        </template>
                    </template>
                </a-table>
            </div>

            <div class="flex justify-end mt-4">
                <a-pagination class="pagination" :show-total="total => `共 ${total.toLocaleString()} 条`"
                              :total=pageConfig.total  @change="changePageHandle"
                              v-model:current="pageConfig.current" v-model:pageSize="filters.limit" />
            </div>
        </div>

        <!-- 日志详情视图 -->
        <div v-else-if="currentView === 'log'" class="h-full flex flex-col">
            <!-- 顶部操作栏 -->
            <div class="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded">
                <div class="flex items-center space-x-4">
                    <a-button type="link" size="small" @click="backToList" class="p-0 h-auto text-primary inline-flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                        返回列表
                    </a-button>
                    <span class="text-gray-400">|</span>
                    <span class="text-sm text-gray-600">执行时间：{{ formatDate(currentLogRecord.created_at) }}</span>
                    <span class="text-sm">
                        执行状态：
                        <a-tag :color="getStatusColor(currentLogRecord.job_status)" class="ml-1">
                            {{ EXEC_STATUS_OPTION.find(({ value }) => value === currentLogRecord.job_status)?.label }}
                        </a-tag>
                    </span>
                </div>
                <div class="flex items-center space-x-3">
                    <a-button size="small" @click="copyLog" :disabled="!logContent" class="inline-flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8h2a2 2 0 012 2v8a2 2 0 01-2 2H10a2 2 0 01-2-2V10a2 2 0 012-2h2"></path>
                        </svg>
                        复制
                    </a-button>
                    <a-button size="small" @click="downloadCurrentLog" :disabled="!currentLogRecord" class="inline-flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        下载
                    </a-button>
                </div>
            </div>

            <!-- 日志内容显示区域 -->
            <div class="flex-1 border rounded font-mono text-sm overflow-hidden log-container">
                <div v-if="logLoading" class="flex items-center justify-center h-full">
                    <a-spin />
                </div>
                <div v-else-if="logError" class="p-4 text-red-400">
                    加载日志失败：{{ logError }}
                </div>
                <pre v-else class="p-4 whitespace-pre-wrap h-full overflow-y-auto">{{ logContent || '暂无日志内容' }}</pre>
            </div>
        </div>
    </a-modal>
</template>

<script setup>
import { indicator, formatDate, downloadFile } from 'utils';
import { getExecRecordApi, getExecLogApi, getExecLogTextApi } from 'api/data';
import { reactive, ref } from 'vue';
import { message } from 'ant-design-vue';
import { EXEC_STATUS_OPTION } from '../constants';
import { usePageList } from '@/hooks';

const { taskId } = defineProps(['taskId']);

// 当前视图状态：'list' | 'log'
const currentView = ref('list');
const currentLogRecord = ref(null);
const logContent = ref('');
const logLoading = ref(false);
const logError = ref('');

const filters = reactive({
    plug_factory_id: taskId,
    plug_status: undefined,
});

const {
    listData,
    loading,
    pageConfig,
    changePageHandle,
} = usePageList(getExecRecordApi, filters);

const columns = ([
    {
        title: '执行时间',
        dataIndex: 'created_at',
        width: 160,
    },
    {
        title: '执行状态',
        dataIndex: 'job_status',
        width: 120,
    },
    {
        title: '操作',
        dataIndex: 'operate',
        width: 240,
    },
]);

// 获取状态颜色
const getStatusColor = (status) => {
    const colorMap = {
        start: 'processing',
        success: 'success',
        fail: 'error',
    };
    return colorMap[status] || 'default';
};

// 查看日志
const viewLog = async (record) => {
    currentLogRecord.value = record;
    currentView.value = 'log';
    logLoading.value = true;
    logError.value = '';
    logContent.value = '';

    try {
        // 首先尝试获取文本内容
        let response;
        try {
            response = await getExecLogTextApi({ plug_log_id: record.plug_job_log_id });
            if (typeof response.data === 'string') {
                logContent.value = response.data || '暂无日志内容';
            } else {
                throw new Error('Response is not text');
            }
        } catch (textError) {
            // 如果获取文本失败，尝试获取blob并转换为文本
            console.log('文本API失败，尝试blob转换:', textError);
            const blobResponse = await getExecLogApi({ plug_log_id: record.plug_job_log_id });

            if (blobResponse.data instanceof Blob) {
                const text = await blobResponse.data.text();
                logContent.value = text || '暂无日志内容';
            } else {
                throw new Error('无法获取日志内容');
            }
        }
    } catch (error) {
        console.error('获取日志失败：', error);
        logError.value = error.message || '获取日志失败';
    } finally {
        logLoading.value = false;
    }
};

// 返回列表
const backToList = () => {
    currentView.value = 'list';
    currentLogRecord.value = null;
    logContent.value = '';
    logError.value = '';
};

// 复制日志
const copyLog = async () => {
    if (!logContent.value) {
        message.warning('暂无日志内容可复制');
        return;
    }

    try {
        // 首先尝试使用现代剪贴板API
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(logContent.value);
            message.success('日志已复制到剪贴板');
            return;
        }

        // 降级到传统方法
        const textArea = document.createElement('textarea');
        textArea.value = logContent.value;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);

        if (successful) {
            message.success('日志已复制到剪贴板');
        } else {
            throw new Error('execCommand copy failed');
        }
    } catch (error) {
        console.error('复制失败：', error);
        message.error('复制失败，请手动选择文本复制');
    }
};

// 判断日志操作是否可用
const isLogActionEnabled = (status) => status === 'success' || status === 'fail';

// 下载当前日志
const downloadCurrentLog = () => {
    if (!currentLogRecord.value) return;
    downloadFile(getExecLogApi, { plug_log_id: currentLogRecord.value.plug_job_log_id });
};

</script>

<style scoped>
.text-85 {
    color: #858585;
}

.text-3c {
    color: #3c3c3c;
}

.text-primary {
    color: #1890ff;
}

.text-primary:hover {
    color: #40a9ff;
}

.log-container {
    background-color: #1F2637;
    color: white;
}

.log-container .ant-spin {
    color: white;
}

.log-container pre {
    background-color: #1F2637;
    color: white;
    margin: 0;
    border: none;
}

/* 日志容器滚动条样式 - 覆盖全局隐藏设置 */
.log-container pre::-webkit-scrollbar {
    width: 8px !important;
    height: 8px !important;
}

.log-container pre::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1) !important;
    border-radius: 4px !important;
}

.log-container pre::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3) !important;
    border-radius: 4px !important;
}

.log-container pre::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5) !important;
}

/* Firefox 滚动条 */
.log-container pre {
    scrollbar-width: thin !important;
    scrollbar-color: rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.1) !important;
}
</style>
