<template>
    <a-modal :title="formState.plug_factory_id ? '编辑任务' : '创建任务'" centered :afterClose="clearFormHandle" @cancel="emits('update:open', false)"
             :confirmLoading="globalState.loading" @ok="okHandle" :okButtonProps="{ disabled: okBtndisabled }" :width="600"
             okText="确认" cancelText="取消">
        <div class="mt-6 overflow-auto pr-3">
            <a-form class="base-form" ref="formRef" :model="formState" layout="vertical">
                <a-form-item label="任务名称" name="plug_factory_name" :rules="[{ required: true, message: '必填项不能为空' }]">
                    <a-input class="base-input" v-model:value="formState.plug_factory_name" placeholder="请输入任务名称" show-count
                             :maxlength="30" autocomplete="off"/>
                </a-form-item>

                <a-form-item label="已配置插件" name="plug_market_id" :rules="[{ required: true, message: '必填项不能为空' }]">
                    <Select class="base-select" :popupClassName="'base-select-dropdown'" v-model:value="formState.plug_market_id"
                            :fieldNames="{ label: 'plug_name', value: 'plug_market_id' }" :options="pluginMarket"
                            placeholder="请选择已配置插件" />
                </a-form-item>

                <div class="font-medium mb-2">执行配置</div>

                <a-form-item label="触发条件" name="plug_exec_type" :rules="[{ required: true, message: '必填项不能为空' }]">
                    <a-radio-group @change="formState.job_spec = ''" v-model:value="formState.plug_exec_type">
                        <a-radio :value="1">手动执行</a-radio>
                        <a-radio :value="2">定时执行</a-radio>
                    </a-radio-group>
                </a-form-item>

                <a-form-item class="mt-[-12px]" v-if="formState.plug_exec_type === 2" name="job_spec"
                             :rules="[{ required: formState.plug_exec_type === 2, message: '必填项不能为空' }]">
                    <template #label>
                        Cron表达式
                        <a-button type="link" size="small" class="cron-help-btn" @click="showCronHelp = true">
                            说明
                        </a-button>

                        <!-- Cron表达式说明模态框 -->
                        <a-modal
                            v-model:open="showCronHelp"
                            title="Cron 表达式核心指南"
                            :footer="null"
                            width="760"
                            centered
                            :bodyStyle="{ height: '520px', width: '800px', overflow: 'hidden' }"
                        >
                            <div class="cron-help-content cron-help-scroll">
                                <!-- 1. 核心结构 -->
                                <div class="cron-structure">
                                    <h3>1. 核心结构</h3>
                                    <p>Cron 表达式用5个位置定义任务周期，从左到右依次是：</p>
                                    <div class="structure-diagram">
                                        <div class="structure-row">
                                            <span class="structure-item">分</span>
                                            <span class="structure-item">时</span>
                                            <span class="structure-item">日</span>
                                            <span class="structure-item">月</span>
                                            <span class="structure-item">星期</span>
                                        </div>
                                        <div class="structure-example">* * * * *</div>
                                    </div>
                                </div>

                                <!-- 2. 关键字符 -->
                                <div class="cron-characters">
                                    <h3>2. 关键字符</h3>
                                    <div class="character-table">
                                        <div class="table-header">
                                            <div class="table-cell">字符</div>
                                            <div class="table-cell">含义</div>
                                            <div class="table-cell">示例（用于"分钟"字段）</div>
                                        </div>
                                        <div class="table-row">
                                            <div class="table-cell char">*</div>
                                            <div class="table-cell">每一个</div>
                                            <div class="table-cell">* （每分钟）</div>
                                        </div>
                                        <div class="table-row">
                                            <div class="table-cell char">/</div>
                                            <div class="table-cell">每隔</div>
                                            <div class="table-cell">*/10 （每隔10分钟）</div>
                                        </div>
                                        <div class="table-row">
                                            <div class="table-cell char">-</div>
                                            <div class="table-cell">从...到...</div>
                                            <div class="table-cell">10-50 （10分到50分）</div>
                                        </div>
                                        <div class="table-row">
                                            <div class="table-cell char">,</div>
                                            <div class="table-cell">和</div>
                                            <div class="table-cell">0,15,30,45 （整点,15分,30分,45分）</div>
                                        </div>
                                        <div class="table-row">
                                            <div class="table-cell char">?</div>
                                            <div class="table-cell">忽略</div>
                                            <div class="table-cell">用于"日"或"星期"</div>
                                        </div>
                                    </div>
                                    <div class="note">
                                        注意："日"和"星期"字段不应同时使用 *，请用 ? 代替其中一个。
                                    </div>
                                </div>

                                <!-- 3. 常用示例 -->
                                <div class="cron-examples">
                                    <h3>3. 常用示例</h3>
                                    <div class="example-item">
                                        <span class="example-cron">0 2 * * ?</span>
                                        <span class="example-desc">→ 每天凌晨 2:00 执行</span>
                                    </div>
                                    <div class="example-item">
                                        <span class="example-cron">0 17 * * 1-5</span>
                                        <span class="example-desc">→ 每个工作日下午 5:00 执行</span>
                                    </div>
                                    <div class="example-item">
                                        <span class="example-cron">*/30 9-17 * * ?</span>
                                        <span class="example-desc">→ 每天9点到17点期间，每30分钟执行一次</span>
                                    </div>
                                </div>
                            </div>
                        </a-modal>
                    </template>
                    <a-input v-model:value="formState.job_spec" placeholder="请输入Cron表达式" @blur="getTaskExecTime" />
                    <span v-if="taskExecTimeorError.next_time">{{ `预计运行时间：${formatDate(taskExecTimeorError.next_time)}` }}</span>
                    <br v-if="taskExecTimeorError.next_time && taskExecTimeorError.now_time">
                    <span v-if="taskExecTimeorError.now_time">{{ `当前时间：${formatDate(taskExecTimeorError.now_time)}` }}</span>
                </a-form-item>
            </a-form>
        </div>
    </a-modal>

</template>

<script setup>
import {
    reactive, ref, computed, onMounted, watch,
} from 'vue';
import {
    addPluginTaskApi, updatePluginTaskApi, getTaskExecTimeApi, getPluginApi,
} from 'api/data';
import { formatDate } from 'utils';
import { editTaskData, pluginMarket } from '../constants';
import { globalState } from '@/store';
import Select from '@/components/Select.vue';

const emits = defineEmits(['update:open', 'updateList']);
const formRef = ref();
const showCronHelp = ref(false);
const formState = reactive({
    plug_factory_name: '',
    plug_market_id: undefined,
    plug_exec_type: 1,
    job_spec: '',
});

const taskExecTimeorError = ref({
    next_time: '',
    now_time: '',
});

const getTaskExecTime = async () => {
    // 清空之前的数据
    taskExecTimeorError.value = {
        next_time: '',
        now_time: '',
    };

    // 只有在定时执行且有Cron表达式时才调用API
    if (formState.plug_exec_type !== 2 || !formState.job_spec.trim()) {
        return;
    }

    try {
        const res = await getTaskExecTimeApi(formState);
        taskExecTimeorError.value.next_time = res.data.data.next_time;
        taskExecTimeorError.value.now_time = res.data.data.now_time;
    } catch (error) {
        console.error('获取任务执行时间失败:', error);
        // 发生错误时清空显示内容
        taskExecTimeorError.value = {
            next_time: '',
            now_time: '',
        };
    }
};

// 在组件挂载时检查插件管理数据，如果为空则获取
onMounted(async () => {
    console.log('插件管理数据:', pluginMarket.value);
    if (!pluginMarket.value || pluginMarket.value.length === 0) {
        try {
            const { data } = await getPluginApi();
            pluginMarket.value = data.data;
            console.log('获取到的插件管理数据:', pluginMarket.value);
        } catch (error) {
            console.log(error);
        }
    }
});

// 监视插件管理数据变化
watch(() => pluginMarket.value, (newVal) => {
    console.log('插件管理数据已更新:', newVal);
}, { deep: true });

if (editTaskData.value) {
    Object.assign(formState, editTaskData.value);
    editTaskData.value = null;
}

const okBtndisabled = computed(() => !formState.plug_factory_name || !formState.plug_market_id || (!formState.job_spec && formState.plug_exec_type === 2));

const clearFormHandle = () => formRef.value.resetFields();

const okHandle = async () => {
    try {
        if (formState.plug_factory_id) {
            await updatePluginTaskApi(formState);
        } else {
            await addPluginTaskApi(formState);
        }
        emits('update:open', false);
        emits('updateList');
    } catch (error) {
        console.log(error);
    }
};
</script>

<style scoped>
.cron-help-btn {
    padding: 0;
    margin-left: 4px;
    color: #6c87ff;
    vertical-align: middle;
}

</style>

<style>
/* Cron 帮助内容样式 */
.cron-help-content {
    font-size: 14px;
    line-height: 1.5;
    color: #262626;
}

.cron-help-scroll {
    height: 100%;
    overflow-y: auto;
    padding-right: 8px;
}

/* 自定义滚动条样式 */
.cron-help-scroll::-webkit-scrollbar {
    width: 6px;
}

.cron-help-scroll::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
}

.cron-help-scroll::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
}

.cron-help-scroll::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}

.cron-help-content h3 {
    font-size: 16px;
    font-weight: 600;
    color: #1f2328;
    margin: 0 0 12px 0;
}

.cron-help-content p {
    margin: 0 0 10px 0;
    color: #656d76;
    font-size: 14px;
}

/* 核心结构样式 */
.cron-structure {
    margin-bottom: 24px;
}

.structure-diagram {
    background: linear-gradient(135deg, #f6f8fa 0%, #f1f3f4 100%);
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    margin-top: 10px;
    border: 1px solid #d1d9e0;
}

.structure-row {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-bottom: 16px;
}

.structure-item {
    padding: 12px 18px;
    background-color: white;
    border: 1px solid #d1d9e0;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    color: #1f2328;
    min-width: 54px;
    text-align: center;
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

.structure-example {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 16px;
    font-weight: 600;
    color: #0969da;
    letter-spacing: 2px;
}

/* 关键字符表格样式 */
.cron-characters {
    margin-bottom: 24px;
}

.character-table {
    border: 1px solid #d1d9e0;
    border-radius: 8px;
    overflow: hidden;
    margin-top: 10px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

.table-header {
    display: flex;
    background: linear-gradient(135deg, #f6f8fa 0%, #f1f3f4 100%);
    font-weight: 600;
    color: #1f2328;
    border-bottom: 1px solid #d1d9e0;
}

.table-row {
    display: flex;
    border-top: 1px solid #d1d9e0;
    transition: background-color 0.1s ease;
}

.table-row:hover {
    background-color: #f6f8fa;
}

.table-row:nth-child(even) {
    background-color: #fafbfc;
}

.table-cell {
    flex: 1;
    padding: 12px 16px;
    font-size: 14px;
    color: #1f2328;
    display: flex;
    align-items: center;
}

.table-cell:not(:last-child) {
    border-right: 1px solid #d1d9e0;
}

.table-cell:first-child {
    flex: 0 0 80px;
    justify-content: center;
}

.table-cell:nth-child(2) {
    flex: 0 0 120px;
}

.table-cell.char {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-weight: 700;
    font-size: 18px;
    color: #cf222e;
}

.note {
    margin-top: 12px;
    padding: 12px 16px;
    background: linear-gradient(135deg, #fff8c5 0%, #fef3cd 100%);
    border: 1px solid #d1b642;
    border-radius: 6px;
    font-size: 13px;
    color: #7d4e00;
    display: flex;
    align-items: flex-start;
    gap: 8px;
}

.note::before {
    content: "⚠️";
    flex-shrink: 0;
}

/* 常用示例样式 */
.cron-examples {
    margin-bottom: 8px;
}

.example-item {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    margin-bottom: 10px;
    background: linear-gradient(135deg, #f6f8fa 0%, #f1f3f4 100%);
    border: 1px solid #d1d9e0;
    border-radius: 8px;
    gap: 16px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    transition: all 0.2s ease;
}

.example-item:hover {
    box-shadow: 0 2px 8px rgba(0,0,0,0.12);
    transform: translateY(-1px);
}

.example-item:last-child {
    margin-bottom: 0;
}

.example-cron {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 14px;
    font-weight: 600;
    color: #0969da;
    background-color: white;
    padding: 8px 16px;
    border-radius: 6px;
    border: 1px solid #d1d9e0;
    min-width: 160px;
    text-align: center;
    box-shadow: inset 0 1px 2px rgba(0,0,0,0.04);
}

.example-desc {
    color: #1f2328;
    font-size: 14px;
    font-weight: 500;
}
</style>
