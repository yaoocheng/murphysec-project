<template>
    <div style="height: calc(100vh - 56px - 48px);" class="bg-white overflow-auto">
        <div v-if="!isEmptyState" class="px-6 py-2 h-12 flex">
            <Input class="mr-2 base-input" v-model:value="filters.plug_factory_name" placeholder="搜索任务名称" />
            <Select :popupClassName="'base-select-dropdown'" class="mr-2 base-select" v-model:value="filters.plug_data_type" :options="PLUGIN_TYPE_OPTION" placeholder="数据类型" :allowClear="true" />
            <Select :popupClassName="'base-select-dropdown'" class="mr-2 base-select" v-model:value="filters.last_job_status" :options="EXEC_STATUS_OPTION" placeholder="执行状态" :allowClear="true" />

            <a-button @click="resetFilter(filters)">重置</a-button>

            <a-button class="right-[24px] absolute base-button" type="primary" @click="openTaskModal=true">创建任务</a-button>
        </div>

        <div class="overflow-auto p-6 box-border" style="height: calc(100% - 56px); border-top: 8px solid #F2F2F2;">
            <!-- 空状态引导页面 - 无插件情况 -->
            <div v-if="isEmptyState" class="empty-state-container">
                <div class="empty-state-content">
                    <div class="empty-state-text">
                        <div class="title-section">
                            <h2 class="empty-state-title">数据接入</h2>
                            <div class="title-subtitle">通过插件连接各种数据源，实现数据统一管理</div>
                        </div>

                        <div class="empty-state-steps">
                            <div class="step-section">
                                <div class="step-header">
                                    <div class="step-number">
                                        <span class="number-text">1</span>
                                    </div>
                                    <div class="step-content">
                                        <div class="step-title">完成数据插件的创建</div>
                                        <div class="step-description">
                                            插件是连接数据源的"适配器"，您可以选择以下任一方式获取：
                                        </div>
                                    </div>
                                </div>
                                <div class="step-options">
                                    <div class="option-item">
                                        <div class="option-dot"></div>
                                        <span class="option-text">从模版快速完成插件创建（推荐）</span>
                                    </div>
                                    <div class="option-item">
                                        <div class="option-dot"></div>
                                        <span class="option-text">通过OpenAPI、SDK实现自定义插件创建</span>
                                    </div>
                                </div>
                            </div>

                            <div class="step-section">
                                <div class="step-header">
                                    <div class="step-number">
                                        <span class="number-text">2</span>
                                    </div>
                                    <div class="step-content">
                                        <div class="step-title">创建插件执行任务</div>
                                        <div class="step-description">
                                            完成插件创建后，前往「任务管理」创建执行计划
                                        </div>
                                    </div>
                                </div>
                                <div class="step-options">
                                    <div class="option-item">
                                        <div class="option-dot"></div>
                                        <span class="option-text">选择已创建的插件</span>
                                    </div>
                                    <div class="option-item">
                                        <div class="option-dot"></div>
                                        <span class="option-text">灵活配置执行方式，实现数据自动化同步</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="empty-state-buttons">
                            <a-button @click="goToPluginMarket" class="empty-state-button primary" type="primary">
                                <InboxOutlined />
                                <span>从模版创建</span>
                            </a-button>
                            <a-button @click="goToCreatePlugin" class="empty-state-button secondary">
                                创建
                            </a-button>
                        </div>
                    </div>
                    <div class="empty-state-image">
                        <img src="~assets/img/create-data.png" alt="数据接入引导" />
                    </div>
                </div>
            </div>

            <!-- 空状态引导页面 - 有插件但无任务情况 -->
            <div v-else-if="isEmpty" class="task-empty-state">
                <div class="task-empty-content">
                    <a-empty>
                        <template #description>
                            <div class="task-empty-title">暂无任务</div>
                            <div class="task-empty-description">可通过创建任务执行同步数据</div>
                        </template>
                        <a-button class="task-empty-button" type="primary" @click="openTaskModal=true">
                            创建任务
                        </a-button>
                    </a-empty>
                </div>
            </div>

            <!-- 原有的表格内容 -->
            <a-table v-else class="base-table" :pagination="false" :ellipsis="true" :loading="{ indicator, spinning: loading }"
                     @change="changePageHandle" :columns="columns" :scroll="{ x: '100%' }" :data-source="listData">
                <template #emptyText>
                    <Empty />
                </template>
                <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex === 'plug_exec_type'">
                        {{ record.plug_exec_type === 1 ? '手动执行' : '定时执行' }}
                    </template>

                    <template v-if="column.dataIndex === 'plug_data_type'">
                        {{ PLUGIN_TYPE_OPTION.find(({value}) => value === record.plug_data_type).label }}
                    </template>

                    <template v-if="column.dataIndex === 'last_job_create_at'">
                        {{ formatDate(record.last_job_create_at) }}
                    </template>

                    <template v-if="column.dataIndex === 'last_job_status'">
                        {{ EXEC_STATUS_OPTION.find(({ value }) => value === record.last_job_status)?.label || '-' }}
                    </template>

                    <template v-if="column.dataIndex === 'job_spec'">
                        {{ record.job_spec || '-' }}
                    </template>

                    <template v-if="column.dataIndex === 'operate'">
                        <a-popconfirm v-if="record.plug_exec_type===1" title="确认执行当前任务？" @confirm="perform_tasks(record.plug_factory_id)"
                                      placement="left" ok-text="确认" cancel-text="取消" >
                            <span class="cursor-pointer mr-4 text-primary">执行</span>
                        </a-popconfirm>
                        <span v-else class="mr-4 text-99">执行</span>

                        <a-popover :overlayStyle="{zIndex: 500}" :overlayInnerStyle="{ padding: '6px 0px', width: '142px' }" placement="bottomRight" :arrow="false">
                            <template #content>
                                <div class="cursor-pointer">
                                    <div @click="openRecordModal=true;taskId=record.plug_factory_id" class="table-operation-item px-6 py-2">
                                        <span>执行记录</span>
                                    </div>
                                    <div @click="openTaskModal=true; editTaskData=record" class="table-operation-item px-6 py-2">
                                        <span>编辑</span>
                                    </div>
                                    <a-popconfirm title="确认删除当前任务？" @confirm="delPluginTask(record.plug_factory_id)"
                                                  placement="left" ok-text="确认" cancel-text="取消">
                                        <div class="table-operation-item text-error px-6 py-2">
                                            <span>删除</span>
                                        </div>
                                    </a-popconfirm>
                                </div>
                            </template>

                            <span class="icon-hover hover:bg-e5 cursor-pointer">
                                <MoreOutlined class="text-primary text-base" />
                            </span>
                        </a-popover>
                    </template>
                </template>
            </a-table>
        </div>
    </div>

    <TaskModal v-model:open="openTaskModal" v-if="openTaskModal" @updateList="getData" />

    <RecordModal v-model:open="openRecordModal" v-if="openRecordModal" :taskId="taskId" />
</template>

<script setup>
import {
    reactive, ref, computed, onMounted,
} from 'vue';
import {
    getTaskListApi, execTaskApi, delPluginTaskApi, getPluginApi,
} from 'api/data';
import { indicator, formatDate, resetFilter } from 'utils';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { InboxOutlined, MoreOutlined } from '@ant-design/icons-vue';
import { PLUGIN_TYPE_OPTION, editTaskData, EXEC_STATUS_OPTION } from '../constants';
import { usePageList } from '@/hooks';
import { ROUTER_PATH } from '@/constants';
import TaskModal from './TaskModal.vue';
import RecordModal from './RecordModal.vue';

const router = useRouter();
const openTaskModal = ref(false);
const openRecordModal = ref(false);
const taskId = ref();
const filters = reactive({
    plug_factory_name: '',
    plug_data_type: undefined,
    last_job_status: undefined,
});

const {
    listData,
    loading,
    changePageHandle,
    getData,
} = usePageList(getTaskListApi, filters);

// 计算是否为空状态（有插件但无任务）
const isEmpty = computed(() => !loading.value && listData.value.length === 0);

// 检查插件列表是否为空
const hasPlugins = ref(false);

// 检查是否为完全空状态（无插件且无任务）
const isEmptyState = computed(() => isEmpty.value && !hasPlugins.value);

// 跳转到插件市场页面
const goToPluginMarket = () => {
    router.push({ path: ROUTER_PATH.pluginMarket });
};

// 获取插件数据
const checkPluginsExist = async () => {
    try {
        const { data } = await getPluginApi();
        hasPlugins.value = data.data && data.data.length > 0;
    } catch (error) {
        console.log(error);
        hasPlugins.value = false;
    }
};

onMounted(() => {
    checkPluginsExist();
});

const columns = ref([
    {
        title: '任务名称',
        dataIndex: 'plug_factory_name',
        width: 280,
        ellipsis: true,
        flex: 'left',
    },
    {
        title: '数据接入类型',
        dataIndex: 'plug_data_type',
        width: 110,
    },
    {
        title: '插件名称',
        dataIndex: 'plug_name',
        width: 180,
        ellipsis: true,
    },
    {
        title: '执行次数',
        dataIndex: 'count',
        width: 100,
    },
    {
        title: '执行方式',
        dataIndex: 'plug_exec_type',
        width: 100,
    },
    {
        title: 'Cron表达式',
        dataIndex: 'job_spec',
        width: 220,
    },
    {
        title: '执行状态',
        dataIndex: 'last_job_status',
        width: 100,
    },
    {
        title: '最近执行时间',
        dataIndex: 'last_job_create_at',
        width: 178,
    },
    {
        title: '操作',
        dataIndex: 'operate',
        width: 120,
        fixed: 'right',
    },
]);

const delPluginTask = async (id) => {
    try {
        await delPluginTaskApi({
            plug_factory_id: id,
        });
        message.success('删除成功');
        getData();
    } catch (error) {
        console.log(error);
    }
};

// 执行任务
const perform_tasks = async (id) => {
    await execTaskApi({ plug_factory_id: id });
    getData();
};

// 在script中添加goToCreatePlugin方法
const goToCreatePlugin = () => {
    router.push({ path: ROUTER_PATH.pluginCreate });
};
</script>

<style scoped>
.table-operation-item {
    cursor: pointer;
    transition: all 0.3s;
    height: 32px;

    &:hover{
        background-color: #F2F2F2;
    }
}

/* 任务空状态样式 */
.task-empty-state {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 500px;
}

.task-empty-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.task-empty-title {
    font-size: 18px;
    font-weight: 600;
    color: #262626;
    margin-bottom: 8px;
}

.task-empty-description {
    font-size: 14px;
    color: #8C8C8C;
    margin-bottom: 24px;
}

.task-empty-button {
    height: 40px;
    padding: 0 24px;
    font-size: 16px;
    font-weight: 500;
    border-radius: 6px;
    background: linear-gradient(135deg, #6C87FF 0%, #5A7AFF 100%);
    box-shadow: 0 2px 8px rgba(108, 135, 255, 0.2);
    transition: all 0.2s ease;
    margin-top: 8px;
}

.task-empty-button:hover {
    background: linear-gradient(135deg, #5A7AFF 0%, #4A6DFF 100%);
    box-shadow: 0 4px 12px rgba(108, 135, 255, 0.3);
    transform: translateY(-1px);
}

/* 完全空状态样式 - 从插件管理页面复制 */
.empty-state-container {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
    min-height: 580px;
}

.empty-state-content {
    display: flex;
    align-items: center;
    gap: 80px;
    max-width: 1100px;
    width: 100%;
}

.empty-state-text {
    flex: 1;
    max-width: 500px;
}

.title-section {
    margin-bottom: 32px;
}

.empty-state-title {
    font-size: 28px;
    font-weight: 600;
    color: #262626;
    margin-bottom: 8px;
    margin-top: 0;
}

.title-subtitle {
    font-size: 16px;
    color: #8C8C8C;
    line-height: 1.5;
}

.empty-state-steps {
    margin-bottom: 32px;
}

.step-section {
    margin-bottom: 24px;
    position: relative;
}

.step-section:not(:last-child)::after {
    content: '';
    position: absolute;
    left: 20px;
    top: 50px;
    bottom: -14px;
    width: 1px;
    background: linear-gradient(to bottom, #E8E8E8, transparent);
}

.step-header {
    display: flex;
    align-items: flex-start;
    margin-bottom: 16px;
}

.step-number {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #6C87FF 0%, #5A7AFF 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16px;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(108, 135, 255, 0.2);
}

.number-text {
    color: white;
    font-size: 16px;
    font-weight: 600;
}

.step-content {
    flex: 1;
    padding-top: 2px;
}

.step-title {
    color: #262626;
    font-size: 18px;
    font-weight: 600;
    line-height: 1.4;
    margin-bottom: 8px;
}

.step-description {
    color: #8C8C8C;
    font-size: 15px;
    line-height: 1.6;
}

.step-options {
    margin-left: 56px;
}

.option-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 12px;
    padding: 8px 0;
}

.option-dot {
    width: 6px;
    height: 6px;
    background-color: #6C87FF;
    border-radius: 50%;
    margin-right: 12px;
    margin-top: 8px;
    flex-shrink: 0;
}

.option-text {
    color: #595959;
    font-size: 15px;
    line-height: 1.6;
    flex: 1;
}

.empty-state-buttons {
    margin-top: 36px;
    display: flex;
    gap: 16px;
}

.empty-state-button {
    height: 44px;
    padding: 0 24px;
    font-size: 16px;
    font-weight: 500;
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 8px;
    border: 1px solid transparent;
    transition: all 0.2s ease;
}

.empty-state-button.primary {
    background: linear-gradient(135deg, #6C87FF 0%, #5A7AFF 100%);
    color: white;
    box-shadow: 0 2px 8px rgba(108, 135, 255, 0.2);
    display: flex;
    align-items: center;
    gap: 6px;
}

.empty-state-button.primary:hover {
    background: linear-gradient(135deg, #5A7AFF 0%, #4A6DFF 100%);
    box-shadow: 0 4px 12px rgba(108, 135, 255, 0.3);
    transform: translateY(-1px);
}

.empty-state-button.primary :deep(.anticon) {
    font-size: 22px !important;
    width: 22px !important;
    height: 22px !important;
    display: flex;
    align-items: center;
    justify-content: center;
}

.empty-state-button.primary span {
    margin: 0 !important;
    padding: 0 !important;
}

.empty-state-button.secondary {
    background-color: #F8F9FA;
    color: #595959;
    border-color: #E8E8E8;
}

.empty-state-button.secondary:hover {
    background-color: #F0F0F0;
    color: #262626;
    border-color: #D9D9D9;
}

.empty-state-button :deep(.anticon) {
    font-size: 18px;
}

.empty-state-image {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-left: 40px;
}

.empty-state-image img {
    max-width: 100%;
    max-height: 420px;
    object-fit: contain;
    border-radius: 12px;
}
</style>
