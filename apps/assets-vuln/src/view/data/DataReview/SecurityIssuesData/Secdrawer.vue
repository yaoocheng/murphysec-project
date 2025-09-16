<template>
    <a-drawer class="security-issues-drawer " root-class-name="root-class-name large" :root-style="{
        'z-index': '1001'
    }" title="Basic Drawer" placement="right" @after-open-change="afterOpenChange" size="large" :maskClosable="false">
        <div>
            <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-4">
                    <div class="flex items-center gap-2">
                        <span :class="currentIndex > 0 ? 'bg-white' : 'bg-f2'" @click="prevIssue"
                              class="cursor-pointer w-8 h-8 flex items-center rounded justify-center hover:bg-f2 border border-solid border-[#E6E6E6]">
                            <Svg name="arrow" class=" rotate-180" :color="currentIndex > 0 ? '#3c3c3c' : '#B3B3B3'"
                                 :class="{ 'opacity-50 cursor-not-allowed': currentIndex === 0 }"></Svg>
                        </span>
                        <span :class="currentIndex < listData.length - 1 ? 'bg-white' : 'bg-f2'" @click="nextIssue"
                              class="cursor-pointer w-8 h-8 flex items-center rounded justify-center hover:bg-f2 border border-solid border-[#E6E6E6]">
                            <Svg name="arrow" class="cursor-pointer"
                                 :color="currentIndex < listData.length - 1 ? '#3c3c3c' : '#B3B3B3'"
                                 :class="{ 'opacity-50 cursor-not-allowed': currentIndex === listData.length - 1 }"></Svg>
                        </span>
                    </div>
                    <span class="text-[14px] text-[#3c3c3c]">
                        <span class="text-99">{{ currentIndex + 1 }} / {{ listData.length }}</span>
                        个安全问题</span>
                </div>
                <div class="flex items-center gap-1">
                    <div @click="turnOnLog" class="text-button-gray">
                        <Svg height="14px" width="14px" name="log"></Svg>
                        <span>操作日志</span>
                    </div>
                    <span class="text-button-gray w-6 h-6">
                        <Svg @click="$emit('update:open', false)" name="drawer_close" class="cursor-pointer"
                             color="#999999"></Svg>
                    </span>
                </div>
            </div>

            <div v-if="hasUnfilledRequiredFields"
                 class="flex items-center justify-between bg-[#f4f8ff] rounded-[8px] px-4 py-[9px] mb-6">
                <div class="flex items-center">
                    <Svg name="data-icon_time" class="mr-2" style="width:16px;height:16px;"></Svg>
                    <span
                        class="text-[#6C9FFF] text-sm font-medium text-gradient">当前数据有必填信息未完善，需完善全部必填信息后才可发布该条数据</span>
                </div>

                <a-button type="primary"
                          class="bg-gradient-btn rounded-[3px] w-12 h-[22px] py-0 px-1 text-white text-xs font-medium"
                          @click="handleImprove">去完善</a-button>
            </div>
            <div v-else class="flex items-center justify-between bg-[#f4f8ff] rounded-[8px] px-4 py-[9px] mb-6"
                 style="background: linear-gradient(270deg, rgba(108, 135, 255, 0.1) -57.73%, rgba(178, 115, 255, 0.1) 92.33%);">
                <div class="flex items-center">
                    <Svg name="data-icon_time_filled" class="mr-2" style="width:16px;height:16px;"></Svg>
                    <span class="text-sm font-medium text-gradient-done">当前数据已完善必填信息，审查数据无误后可直接发布数据</span>
                </div>
            </div>

            <div
                class="relative h-8 mb-6 rounded bg-[#f2f2f2] border border-solid border-[#E6E6E6] flex items-center text-sm font-semibold text-[#3c3c3c]">
                <!-- 滑块背景 -->
                <div class="absolute top-0 left-0 h-full w-1/2 bg-white rounded transition-transform duration-300"
                     :style="`transform: translateX(${activeTab === 1 ? '0%' : '100%'})`"></div>

                <!-- Tab 1 -->
                <div @click="activeTab = 1"
                     class="flex-1 h-full flex items-center justify-center cursor-pointer relative z-10"
                     :class="activeTab === 1 ? 'font-medium' : 'font-normal'">
                    <Svg name="icon_fundament" class="cursor-pointer mr-2" style="width: 16px;height: 16px;"></Svg>
                    基本信息
                </div>

                <!-- Tab 2 -->
                <div @click="activeTab = 2"
                     class="flex-1 h-full flex items-center justify-center cursor-pointer relative z-10"
                     :class="activeTab === 2 ? 'font-medium' : 'font-normal'">
                    <Svg name="icon_vuln" class="cursor-pointer mr-2" style="width: 16px;height: 16px;"></Svg>
                    漏洞列表
                </div>
            </div>

            <!-- 表单 -->
            <div v-show="activeTab === 1" class="h-[calc(100vh-330px)] overflow-auto">
                <div class="mb-6">
                    <div class="text-[#3C3C3C] text-xs font-medium mb-2">安全问题名称</div>
                    <a-input disabled v-model:value="formData.issue_title" class="w-full"
                             placeholder="安全问题名称" />
                </div>

                <div class="mb-6">
                    <div class="text-[#3C3C3C] text-xs font-medium mb-2">安全问题等级</div>

                    <Select disabled :popupClassName="'base-select-dropdown'" class="w-full base-select"
                            v-model:value="formData.issue_level" :options="SEC_LEVEL_OPTION" placeholder="安全问题等级" />
                <!-- <a-input v-model:value="formData.issue_level" class="w-full " placeholder="安全问题等级" /> -->
                </div>

                <div class="mb-6">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-[#3C3C3C] text-xs font-medium">所属应用</span>

                        <span v-if="filteredApplications?.some(app => app.data_status !== 'published')"
                              class="text-[#FF4D4F] text-xs font-medium flex items-center">
                            <Svg name="icon_warning" class="mr-2" style="width:14px;height:14px;"></Svg>
                            所选数据未发布，需先发布
                        </span>
                        <span v-else-if="formData.application_id?.length === 0 || !formData.application_id"
                              class="text-xs font-medium flex items-center text-gradient-pending">
                            <Svg name="data-time" class="mr-1" color="#6C9FFF" style="width:14px;height:14px;"></Svg>
                            信息待完善
                        </span>
                    <!-- <span v-else class="text-[#2B5FFF] text-xs font-medium flex items-center">
                            <Svg name="data-icon_yes_outlined" class="mr-1" color="#6C9FFF"
                                 style="width:14px;height:14px;"></Svg>
                            <span class="done-text">已完成</span>
                        </span> -->
                    </div>

                    <AppSearchSelect
                        :class="filteredApplications?.some(app => app.data_status !== 'published') || formData.application_id?.length === 0 || !formData.application_id ? 'true' : ''"
                        class="select-dom" popupClassName="base-select-dropdown" v-model:value="formData.application_id"
                        :alreadyHaveOptions="filteredApplications?.map((app) => {
                            return {
                                label: app.application_name,
                                value: app.application_id,
                            }
                        })" />
                </div>

                <div class="mb-6">
                    <div class="text-[#3C3C3C] text-xs font-medium mb-2">所属应用载体</div>
                    <a-input disabled v-model:value="formData.carrier" class="w-full" placeholder="暂无" />
                </div>

                <div class="mb-6">
                    <div class="flex items-center justify-between">
                        <div class="text-[#3C3C3C] text-xs font-medium mb-2">安全问题状态</div>
                        <span v-if="!formData.issue_status"
                              class="text-xs font-medium flex items-center text-gradient-pending">
                            <Svg name="data-time" class="mr-1" color="#6C9FFF" style="width:14px;height:14px;"></Svg>
                            信息待完善
                        </span>
                    <!-- <span v-else class="text-[#2B5FFF] text-xs font-medium flex items-center">
                            <Svg name="data-icon_yes_outlined" class="mr-1" color="#6C9FFF"
                                 style="width:14px;height:14px;"></Svg>
                            <span class="done-text">已完成</span>
                        </span> -->
                    </div>
                    <Select :class="!formData.issue_status ? 'true' : ''" :popupClassName="'base-select-dropdown'"
                            class="w-full select-dom" v-model:value="formData.issue_status" :options="DISPOSAL_STATUS"
                            placeholder="安全问题状态" />
                </div>

                <div class="mb-6">
                    <!-- <div class="text-[#3C3C3C] text-xs font-medium mb-2">安全问题负责人</div> -->
                    <div class="flex items-center justify-between">
                        <div class="text-[#3C3C3C] text-xs font-medium mb-2">安全问题负责人</div>
                        <span v-if="!formData.issue_owner_id"
                              class="text-xs font-medium flex items-center text-gradient-pending">
                            <Svg name="data-time" class="mr-1" color="#6C9FFF" style="width:14px;height:14px;"></Svg>
                            信息待完善
                        </span>
                    <!-- <span v-else class="text-[#2B5FFF] text-xs font-medium flex items-center">
                            <Svg name="data-icon_yes_outlined" class="mr-1" color="#6C9FFF"
                                 style="width:14px;height:14px;"></Svg>
                            <span class="done-text">已完成</span>
                        </span> -->
                    </div>
                    <UserSelect class="user-select select-dom w-full" :class="!formData.issue_owner_id ? 'true' : ''"
                                :popupClassName="'user-select-dropdown'" v-model:value="formData.issue_owner_id"
                                placeholder="请搜索并选择组织负责人" :showSearch="true" :userid="formData.issue_owner_id" />
                <!-- <a-select v-model:value="formData.owner" class="w-full" placeholder="请搜索并选择" /> -->
                </div>
            </div>

            <!-- 表格 -->
            <div v-show="activeTab === 2">
                <a-table class="base-table-expand" :dataSource="vulnlistData" :pagination="false"
                         :scroll="{ y: 'calc(100vh - 330px)' }" rowKey="title" :expandIcon="customExpandIcon">
                    <template #expandedRowRender="{ record }">
                        <div class="expand-content">
                            <div class="item">
                                <span class="title">漏洞详情</span>
                                <div class="value">
                                    <div class="value_item">
                                        <div class="title_with_line">
                                            <div class="line"></div>
                                            <span class="content">基本信息</span>
                                        </div>

                                        <div class="info_list">
                                            <div class="info_item" :class="item.value"
                                                 v-for="item in basic_information_title" :key="item.label">
                                                <span class="label">{{ item.label }}</span>
                                                <span class="value">
                                                    <div class="flex" v-if="item.value === 'tags'">
                                                        <a-tag v-if="record[item.value]?.length"
                                                               class="whitespace-nowrap overflow-hidden text-ellipsis max-w-[144px]">
                                                            {{ record[item.value]?.[0] || '-' }}
                                                        </a-tag>

                                                        <span v-else>-</span>

                                                        <a-popover v-if="record[item.value]?.length > 1">
                                                            <template #content>
                                                                <div class="max-h-[156px] overflow-auto flex flex-col gap-2">
                                                                    <div v-for="item in record[item.value].slice(1)"
                                                                         :key="item"><a-tag>{{ item }}</a-tag></div>
                                                                </div>
                                                            </template>
                                                            <a-tag class="mr-0">+{{ record[item.value].length - 1
                                                            }}</a-tag>
                                                        </a-popover>
                                                    </div>

                                                    <div v-else-if="item.type === 'date'">
                                                        {{ record[item.value] ? formatDate(record[item.value]) : '-' }}

                                                    </div>

                                                    <div v-else-if="item.value === 'severity'">
                                                        <span>{{ findSeverityLabel(record[item.value]) }}</span>
                                                    </div>

                                                    <a-tooltip arrowPointAtCenter
                                                               v-else-if="item.value === 'vuln_identifiers' && record[item.value].length > 0">
                                                        <template #title>
                                                            <div v-for="(id, index) in record[item.value]" :key="index">
                                                                {{ id.type }}({{ id.id }})
                                                            </div>
                                                        </template>
                                                        <span class="ellipsis">
                                                            <span v-for="(id, index) in record[item.value]"
                                                                  :key="index">
                                                                {{ id.type }}({{ id.id }})；
                                                            </span>
                                                            <span v-if="!record[item.value]?.length">-</span>
                                                        </span>
                                                    </a-tooltip>

                                                    <span
                                                        v-else-if="item.value === 'vuln_identifiers'">
                                                        -
                                                    </span>

                                                    <a-tooltip arrowPointAtCenter v-else-if="record[item.value]">
                                                        <template #title>{{ record[item.value] }}</template>
                                                        <span class="ellipsis">{{ record[item.value] }}</span>
                                                    </a-tooltip>

                                                    <span v-else>-</span>
                                                </span>
                                            </div>

                                        </div>
                                    </div>
                                    <div class="value_item">
                                        <div class="title_with_line">
                                            <div class="line"></div>
                                            <span class="content">CVSS评估</span>
                                        </div>
                                        <a-table class="base-table" :pagination="false"
                                                 :loading="{ indicator, spinning: loading }" :columns="expand_columns"
                                                 :scroll="{ x: '100%' }" :data-source="record.cvss">
                                            <template #bodyCell="{text }">
                                                <a-tooltip arrowPointAtCenter>
                                                    <template #title>{{ text }}</template>
                                                    <span class="ellipsis">
                                                        {{ text || '-' }}
                                                    </span>
                                                </a-tooltip>
                                            <!-- <span class="cursor-default">{{ text || '-' }}</span> -->
                                            </template>
                                            <template #emptyText>
                                                <Empty />
                                            </template>
                                        </a-table>
                                    </div>
                                    <div class="value_item">
                                        <div class="title_with_line">
                                            <div class="line"></div>
                                            <span class="content">漏洞描述</span>
                                        </div>
                                        <span>{{ record.description || '-' }}</span>
                                    </div>
                                    <div class="value_item">
                                        <div class="title_with_line">
                                            <div class="line"></div>
                                            <span class="content">漏洞影响</span>
                                        </div>
                                        <span>{{ record.impact || '-' }}</span>
                                    </div>
                                    <div class="text-button-blue"
                                         @click="routerKey.push(`/vuln-intel/detail/${record.mps_id}`)">
                                        <span class="flex items-center">
                                            漏洞上下文信息
                                            <Svg name="arrow-right" color="#6C87FF" width="12px" height="12px"
                                                 class="ml-1"></Svg>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="item">
                                <span class="title">修复方案</span>
                                <div class="value">
                                    <div class="solution_item" :class="`${i !== record.solution?.length - 1 && 'mb-8'}`"
                                         v-for="(item, i) in record.solution" :key="item">
                                        <div class="flex flex-row">
                                            <a-tag class="bg-[#F2F2F2] border-none text-3c">{{ item.type }}</a-tag>

                                            <a-tooltip>
                                                <template #title>
                                                    <span class="flex-1 whitespace-nowrap text-ellipsis overflow-hidden">
                                                        {{ item.details || '-' }}
                                                    </span>
                                                </template>
                                                <span class="flex-1 whitespace-nowrap text-ellipsis overflow-hidden">
                                                    {{ item.details || '-' }}
                                                </span>
                                            </a-tooltip>
                                        </div>
                                        <div class="flex flex-row bg-[#F2F2F2] px-6 py-4 ">
                                            <span>{{ item.description || '-' }}</span>
                                        </div>
                                    </div>
                                    <div v-if="!record.solution?.length">暂无</div>
                                </div>
                            </div>
                            <div class="item">
                                <span class="title">参考链接</span>
                                <div class="value">
                                    <div class="flex flex-row" v-for="item in record.reference" :key="item">
                                        <span class="ellipsis hover" @click="openReportUrl(item.url)">{{ item.url || '-'
                                        }}</span>
                                    </div>
                                    <div v-if="!record.reference?.length">暂无</div>
                                </div>
                            </div>
                        </div>
                    </template>

                    <a-table-column title="漏洞名称" ellipsis min-width="280px" dataIndex="title" key="title">
                        <template #default="{ text }">
                            <a-tooltip arrowPointAtCenter>
                                <template #title>{{ text }}</template>
                                <span class="ellipsis">{{ text }}</span>
                            </a-tooltip>
                        </template>
                    </a-table-column>
                    <a-table-column title="漏洞类型" ellipsis width="140px" dataIndex="vulnerability_type" key="severity">
                        <template #default="{ text }">
                            <a-tooltip arrowPointAtCenter>
                                <template #title>{{ text }}</template>
                                <span class="ellipsis">{{ text }}</span>
                            </a-tooltip>
                        </template>
                    </a-table-column>
                    <a-table-column title="漏洞状态" width="90px" dataIndex="status" key="status">
                        <template #default="{ text }">
                            <span>{{ findVulnStatusLabel(text) }}</span>
                        </template>
                    </a-table-column>
                    <a-table-column title="漏洞编号" :ellipsis="true" dataIndex="report_url" key="id">
                        <!-- <template #default="{ text }">
                            <a v-if="text" :href="text" target="_blank">{{ text }}</a>
                            <span v-else>-</span>
                        </template> -->
                        <template #default="{ record }">
                            {{ record.cve_id || record.vuln_identifiers?.[0] || '-' }}
                        </template>
                    </a-table-column>
                </a-table>
            </div>
        </div>

        <OperationLogModal v-model:open="opetateLog" v-if="opetateLog" :logfilter="logfilter" />

        <template #footer>
            <div class="flex items-center justify-end gap-3">
                <a-button class="text-sm h-8 rounded-3" @click="$emit('update:open', false)">取消</a-button>
                <a-button class="not-ant-btn-default text-sm h-8 rounded-3  border-[#6682FF] text-[#6682FF]"
                          @click="handleSave">保存</a-button>
                <a-button class="text-sm h-8 rounded-3" type="primary" :disabled="hasUnfilledRequiredFields"
                          @click="handleRelease(formData)">发布</a-button>
            </div>
        </template>
    </a-drawer>
</template>
<script setup>
import {
    ref, reactive, computed, h, watch,
} from 'vue';
import {
    editPreparationSecurityQuestionApi, pushPreparationSecurityQuestionApi,
} from 'api/data';
import { getSecVulnListApi } from 'api/app';
import { Modal, message } from 'ant-design-vue';
import { emitter } from 'utils';
import { SEC_LEVEL_OPTION, DISPOSAL_STATUS } from '@/constants/app.js';
import { formatDate } from '@/utils';
import { findSeverityLabel, findVulnStatusLabel } from '@/constants/app';
import { usePageList } from '@/hooks';
import InfoIcon from '/src/assets/svg/data/icon_info_colorful.svg';

const emit = defineEmits(['getData', 'update:open']);
const { listData, clickindex } = defineProps({
    listData: {
        type: Array,
        default: () => [],
    },
    clickindex: {
        type: Number,
        default: 0,
    },
});

const currentIndex = ref(clickindex);
const activeTab = ref(1);

const filters = reactive({
    issue_id: null,
});

const {
    listData: vulnlistData,
    loading,
} = usePageList(getSecVulnListApi, filters);

const afterOpenChange = (bool) => {
    console.log('open', bool);
};

const formData = ref({
    name: undefined,
    level: undefined,
    application: undefined,
    carrier: undefined,
    status: undefined,
    owner: undefined,
    application_name: undefined,
    application_id: undefined,
});

const changeformData = () => {
    Object.assign(formData.value, listData[currentIndex.value] || {});
    filters.issue_id = formData.value.issue_id || null;
    formData.value.application_id = formData.value?.application?.map((item) => item.application_id) || [];
    if (formData.value.issue_owner_id === '0') {
        formData.value.issue_owner_id = undefined;
    }
    console.log('formData', formData.value);
};
changeformData();

// 自定义展开图标
const customExpandIcon = ({ expanded, onExpand, record }) => h('span', {
    onClick: (e) => onExpand(record, e),
    class: 'cursor-pointer flex items-center justify-center w-4 h-4 ml-4',
}, [
    h('svg', {
        width: '16',
        height: '16',
        viewBox: '0 0 16 16',
        fill: 'none',
        xmlns: 'http://www.w3.org/2000/svg',
        style: {
            transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
        },
    }, [
        h('path', {
            d: 'M6 4L10 8L6 12',
            stroke: '#999999',
            'stroke-width': '1.5',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
        }),
    ]),
]);

watch(
    () => listData,
    () => changeformData(),
);

// 日志
const opetateLog = ref(false);
const logfilter = ref({
    entity_type: 'Issue',
    entity_id: null, // 这里可以根据实际情况设置
});
// 开启操作日志
const turnOnLog = () => {
    opetateLog.value = true;
    logfilter.value.entity_id = String(formData.value.issue_id);
};

// 重置提示样式
const ImproveReset = () => {
    const selects = document.querySelectorAll('.select-dom .ant-select-selector');
    const inputs = document.querySelectorAll('.input-dom');
    const doms = [...selects, ...inputs];
    doms.forEach((dom) => {
        dom.classList.remove('flash-border');
    });
};

const prevIssue = () => {
    if (currentIndex.value > 0) {
        currentIndex.value--;
        changeformData();
        ImproveReset();
    }
};

const nextIssue = () => {
    if (currentIndex.value < listData.length - 1) {
        currentIndex.value++;
        changeformData();
        ImproveReset();
    }
};

const filteredApplications = computed(() => (formData.value.application || []).filter((app) => formData.value.application_id.includes(app.application_id)));

// 是否显示必填信息未完善
const hasUnfilledRequiredFields = computed(
    () => !formData.value.issue_status
        || filteredApplications.value?.some((app) => app.data_status !== 'published')
        || formData.value.application_id?.length === 0
        || !formData.value.application_id
        || !formData.value.issue_owner_id,
);

// 对必填信息进行提示
const handleImprove = () => {
    activeTab.value = 1;
    const selects = document.querySelectorAll('.select-dom.true .ant-select-selector');
    const inputs = document.querySelectorAll('.input-dom.true');
    const doms = [...selects, ...inputs];
    doms.forEach((dom) => {
        dom.classList.add('flash-border');
    });
};

// 保存修改
const handleSave = async (closeDrawer = true) => {
    await editPreparationSecurityQuestionApi(formData.value);
    emit('getData');
    if (closeDrawer) {
        emit('update:open', false);
    }
};

// 发布
const handleRelease = (Data) => {
    Modal.confirm({
        title: '确认发布此条数据吗？',
        icon: h('span', { role: 'img', 'aria-label': 'exclamation-circle', class: 'anticon anticon-exclamation-circle' }, [
            h('img', { src: InfoIcon, alt: '信息图标' }),
        ]),
        content: '发布后数据将被视为正式数据进行统计',
        async onOk() {
            try {
                await handleSave(false);
                await pushPreparationSecurityQuestionApi({
                    issue_id: [Data.issue_id],
                });
            } catch {
                return console.log('Oops errors!');
            } finally {
                emit('getData');
                emit('update:open', false);
                emitter.emit('getdatareviewtotal');
                message.success('发布成功');
            }
        },
        onCancel() { },
    });
};

const basic_information_title = [
    { label: 'CVE编号', value: 'cve_id' },
    { label: '其他编号', value: 'vuln_identifiers' },
    { label: '等级', value: 'severity' },
    { label: 'CWE ID', value: 'cwe_id' },
    { label: '安全能力', value: 'security_capability_name' },
    { label: '标签', value: 'tags' },
    { label: '创建时间', value: 'created_at', type: 'date' },
    { label: '更新时间', value: 'updated_at', type: 'date' },
];

const expand_columns = ref([
    {
        title: 'CVSS版本',
        dataIndex: 'version',
        ellipsis: true,
        width: '140px',
        fixed: 'left',
    },
    {
        title: 'CVSS评分',
        dataIndex: 'score',
        ellipsis: true,
        width: '120px',
    },
    {
        title: 'CVSS向量',
        ellipsis: true,
        dataIndex: 'vector',
        width: 'auto',
    },
]);

</script>

<style>
.root-class-name.large .ant-drawer-content-wrapper {
    width: 736px !important;
}

.security-issues-drawer {
    .ant-drawer-header {
        display: none;
    }
}

.bg-gradient-btn {
    background: linear-gradient(90deg, #6C9FFF 0%, #6C87FF 100%) !important;
    border: none !important;
}

.text-gradient-done {
    background: linear-gradient(270deg, #6C87FF -57.73%, #B273FF 92.33%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.text-gradient-pending {
    background: linear-gradient(90deg, #6C9FFF 0%, #6C87FF 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

/* @keyframes borderFlash {

    0%,
    100% {
        border-color: #d9d9d9;
    }

    50% {
        border-color: #6682FF;
    }
} */

.flash-border {
   border-color: #6682FF !important;
}
</style>

<style scoped>
.expand-content {

    background-color: #F2F2F280;
    display: flex;
    flex-direction: column;
    gap: 32px;
    padding: 12px 20px;

    .item {
        display: flex;
        flex-direction: column;
        gap: 16px;

        .title {
            color: #3C3C3C;
            font-size: 15px;
            font-weight: 500;
        }

        .value {
            background-color: #fff;
            border-radius: 4px;
            padding: 20px 24px;
            display: flex;
            flex-direction: column;
            /* gap: 8px; */

            .value_item {
                display: flex;
                flex-direction: column;
                gap: 8px;
                margin-bottom: 32px;
            }

            .solution_item {
                display: flex;
                flex-direction: column;
                gap: 12px;
                font-size: 12px;
            }
        }
    }
}

.info_list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;

    .info_item {
        min-height: 48px;
        display: flex;
        flex-direction: column;
        gap: 4px;

        &.vuln_identifiers {
            grid-column: span 2;
            /* 跨越两列 */
        }

        .edit-svg {
            height: 24px;
            width: 24px;
            display: flex;
            padding: 4px;
            border-radius: 4px;

            &:hover {
                background-color: #e6e6e6;
            }

        }

        .label {
            font-size: 12px;
            color: #999999;
            font-weight: 400;
            line-height: 20px;
            display: flex;
            gap: 4px;
        }

        .value {
            font-size: 14px;
            color: #3C3C3C;
            font-weight: 400;
            line-height: 22px;
            padding: 1px 0px;
            gap: 10px;
            /* white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis; */
        }
    }
}

:deep(.data_review_table) {
    .ant-table-expanded-row>.ant-table-cell {
        padding: 0 !important;
    }
}

.done-text {
    background: linear-gradient(270deg, #6C87FF -57.73%, #B273FF 92.33%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}
</style>
