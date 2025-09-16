<template>
    <a-drawer class="security-issues-drawer" root-class-name="root-class-name cn" :root-style="{
        'z-index': '1001'
    }" title="Basic Drawer" placement="right" @after-open-change="afterOpenChange" size="large" :maskClosable="false">
        <div>
            <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-4">
                    <div class="flex items-center gap-2">
                        <span :class="currentIndex > 0 ? 'bg-white' : 'bg-f2'" @click="prevIssue"
                              class="cursor-pointer w-8 h-8 flex items-center rounded justify-center border  hover:bg-f2 border-solid border-[#E6E6E6]">
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
                        个应用载体</span>
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

            <div v-if="hasUnfilledRequiredFields" class="flex items-center justify-between bg-[#f4f8ff] rounded-[8px] px-4 py-[9px] mb-6">
                <div class="flex items-center">
                    <Svg name="data-icon_time" class="mr-2" style="width:16px;height:16px;"></Svg>
                    <span class="text-[#6C9FFF] text-sm font-medium text-gradient">当前数据有必填信息未完善，需完善全部必填信息后才可发布该条数据</span>
                </div>

                <a-button type="primary" class="bg-gradient-btn rounded-[3px] w-12 h-[22px] py-0 px-1 text-white text-xs font-medium"
                          @click="handleImprove">去完善</a-button>
            </div>
            <div v-else class="flex items-center justify-between bg-[#f4f8ff] rounded-[8px] px-4 py-[9px] mb-6" style="background: linear-gradient(270deg, rgba(108, 135, 255, 0.1) -57.73%, rgba(178, 115, 255, 0.1) 92.33%);">
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
                    <Svg name="icon_soft" class="cursor-pointer mr-2" style="width: 16px;height: 16px;"></Svg>
                    软件成分列表
                </div>
            </div>

            <!-- 表单 -->
            <div  v-show="activeTab === 1" class="h-[calc(100vh-330px)] form-wrap overflow-auto">
                <!-- 表单字段 -->
                <div class="mb-6">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-[#3C3C3C] text-xs font-medium">应用载体名称</span>
                        <span v-if="!formData.carrier.name" class="text-xs font-medium flex items-center text-gradient-pending">
                            <Svg name="data-time" class="mr-1" color="#6C9FFF" style="width:14px;height:14px;"></Svg>
                            信息待完善
                        </span>
                        <!-- <span v-else class="text-[#2B5FFF] text-xs font-medium flex items-center">
                            <Svg name="data-icon_yes_outlined" class="mr-1" color="#6C9FFF" style="width:14px;height:14px;"></Svg>
                            <span class="done-text">已完成</span>
                        </span> -->
                    </div>
                    <a-input :class="!formData.carrier.name ? 'true' : ''" v-model:value="formData.carrier.name" placeholder="请输入" :maxlength="30" show-count class="w-full input-dom" />
                </div>

                <div class="mb-6">
                    <div class="text-[#3C3C3C] text-xs font-medium mb-2">载体类型</div>
                    <Select :disabled="true" class="w-full base-select" v-model:value="formData.carrier.carrier_type" :options="CARRIER_OPTION" placeholder="载体类型" />
                </div>

                <div class="mb-6">
                    <div class="text-[#3C3C3C] text-xs font-medium mb-2">来源</div>
                    <a-input v-model:value="formData.carrier.source" placeholder="请输入" :maxlength="30" show-count class="base-input w-full" />
                </div>

                <div class="mb-6">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-[#3C3C3C] text-xs font-medium">所属应用</span>
                        <span v-if="filteredApplications?.some(app => app.data_status !== 'published')" class="text-[#FF4D4F] text-xs font-medium flex items-center">
                            <Svg name="icon_warning" class="mr-2" style="width:14px;height:14px;"></Svg>
                            所选数据未发布，需先发布
                        </span>
                        <span v-else-if="!formData.app_ids || formData.app_ids?.length === 0" class="text-xs font-medium flex items-center text-gradient-pending">
                            <Svg name="data-time" class="mr-1" color="#6C9FFF" style="width:14px;height:14px;"></Svg>
                            信息待完善
                        </span>
                        <!-- <span v-else class="text-[#2B5FFF] text-xs font-medium flex items-center">
                            <Svg name="data-icon_yes_outlined" class="mr-1" color="#6C9FFF" style="width:14px;height:14px;"></Svg>
                            <span class="done-text">已完成</span>
                        </span> -->
                    </div>
                    <AppSearchSelect :class="filteredApplications?.some(app => app.data_status !== 'published') || formData.app_ids?.length === 0 || !formData.app_ids ? 'true' : ''" class="select-dom" popupClassName="base-select-dropdown"
                                     v-model:value="formData.app_ids"
                                     :alreadyHaveOptions="filteredApplications?.map((app)=>{
                                         return {
                                             label: app.application_name,
                                             value: app.application_id,
                                         }
                                     })"/>
                </div>

                <div v-if="formData.carrier.carrier_type !== 'code_repo'">
                    <div class="mb-6">
                        <div class="text-[#3C3C3C] text-xs font-medium mb-2">协议类型</div>
                        <a-input :disabled="true" v-model:value="formData.carrier.protocol" placeholder="请输入" class="base-input w-full" />
                    </div>

                    <div class="mb-6">
                        <div class="text-[#3C3C3C] text-xs font-medium mb-2">IP</div>
                        <a-input :disabled="true" v-model:value="formData.carrier.ip" placeholder="请输入" class="base-input w-full" />
                    </div>

                    <div class="mb-6">
                        <div class="text-[#3C3C3C] text-xs font-medium mb-2">端口号</div>
                        <a-input :disabled="true" v-model:value.number="formData.carrier.port" placeholder="请输入" class="base-input w-full" />
                    </div>

                    <div class="mb-6">
                        <div class="text-[#3C3C3C] text-xs font-medium mb-2">URL路径</div>
                        <a-input v-model:value="formData.carrier.repo_url" placeholder="请输入" class="base-input w-full" />
                    </div>

                    <div class="mb-6">
                        <div class="text-[#3C3C3C] text-xs font-medium mb-2">域名</div>
                        <a-input v-model:value="formData.carrier.domain" placeholder="请输入" class="base-input w-full" />
                    </div>

                    <div class="mb-6">
                        <div class="text-[#3C3C3C] text-xs font-medium mb-2">互联网IP</div>
                        <a-input v-model:value="formData.carrier.internet_ip" placeholder="请输入" class="base-input w-full" />
                    </div>

                    <div class="mb-6">
                        <div class="text-[#3C3C3C] text-xs font-medium mb-2">NAT IP</div>
                        <a-input v-model:value="formData.carrier.nat_ip" placeholder="请输入" class="base-input w-full" />
                    </div>

                    <div class="mb-6">
                        <div class="text-[#3C3C3C] text-xs font-medium mb-2">内网IP</div>
                        <a-input v-model:value="formData.carrier.internal_ip" placeholder="请输入" class="base-input w-full" />
                    </div>
                </div>

                <div v-else>
                    <div class="mb-6">
                        <div class="text-[#3C3C3C] text-xs font-medium mb-2">仓库命名空间/组织</div>
                        <a-input v-model:value="formData.carrier.repo_namespace" placeholder="请输入" class="base-input w-full" />
                    </div>

                    <div class="mb-6">
                        <div class="text-[#3C3C3C] text-xs font-medium mb-2">仓库名称</div>
                        <a-input v-model:value="formData.carrier.repo_name" placeholder="请输入" class="base-input w-full" />
                    </div>

                    <div class="mb-6">
                        <div class="text-[#3C3C3C] text-xs font-medium mb-2">仓库URL</div>
                        <a-input  :disabled="true" v-model:value="formData.carrier.repo_url" placeholder="请输入" class="base-input w-full" />
                    </div>

                    <!-- <div class="mb-6">
                        <div class="text-[#3C3C3C] text-xs font-medium mb-2">分支名</div>
                        <a-input v-model:value="formData.carrier.branch" placeholder="请输入" class="base-input w-full" />
                    </div> -->

                </div>

                <div class="mb-6">
                    <div class="text-[#3C3C3C] text-xs font-medium mb-2">应用载体描述</div>
                    <!-- <a-textarea
                        v-model:value="formData.carrier.description"
                        placeholder="请输入"
                        :maxlength="200"
                        show-count
                        :auto-size="{ minRows: 4, maxRows: 6 }"
                        class="w-full"
                    /> -->

                    <TextArea v-model="formData.carrier.description" :maxlength="200" :rows="4" placeholder="请输入" />
                </div>
            </div>

            <!-- 表格 -->
            <div v-show="activeTab === 2">
                <a-table class="base-table-expand" :dataSource="componentlistData" :pagination="false"
                         :scroll="{ y: 'calc(100vh - 350px)',x: '1200px' }" rowKey="component_id" :columns="columns" :expandIcon="customExpandIcon">
                    <template #emptyText>
                        <Empty />
                    </template>
                    <template #expandedRowRender="{ record }">
                        <div class="bg-[#F2F2F280] py-3 px-5">
                            <div v-if="record.component_context?.length" class="text-[15px] text-3c font-medium mb-3">
                                关联上下文信息
                            </div>
                            <div class="flex gap-6 flex-col">
                                <div
                                    v-for="(item, index) in record.component_context"
                                    :key="index"
                                    class="border border-solid border-[#E6E6E6] rounded-md bg-white"
                                >
                                    <div class="text-[15px] text-3c font-medium bg-[#E6E6E6] py-4 px-6">
                                        <div class="text-sm font-medium text-3c mb-1.5">{{ item.name }}</div>
                                        <div class="text-xs text-[#666666]">{{ item.description }}</div>
                                    </div>
                                    <div class="py-3 px-5">
                                        <div class="text-sm text-3c">{{ item.content || '-' }}</div>
                                    </div>
                                </div>
                            </div>

                            <Empty v-if="!record.component_context?.length" />
                        </div>
                    </template>

                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.dataIndex === 'operate'">
                            <div @click="handleDelete(record)" class="text-[#FF4D4F] cursor-pointer">
                                移除
                            </div>
                        </template>

                        <template v-else-if="column.dataIndex === 'created_at'">
                            <div >
                                {{ formatDate(text) }}
                            </div>
                        </template>

                        <template  v-else>
                            <a-tooltip v-if="text.length > 14" arrowPointAtCenter>
                                <template #title> {{ text }}</template>
                                <span class="ellipsis">
                                    {{ text }}
                                </span>
                            </a-tooltip>
                            <span v-else class="ellipsis">
                                {{ text || '-' }}
                            </span>
                        </template>
                    </template>

                </a-table>
            </div>
        </div>

        <OperationLogModal v-model:open="opetateLog" v-if="opetateLog" :logfilter="logfilter" />

        <template #footer>
            <div class="flex items-center justify-end gap-3">
                <a-button class="text-sm h-8 rounded-3" @click="$emit('update:open', false)">取消</a-button>
                <a-button @click="handleSave" class="not-ant-btn-default text-sm h-8 rounded-3  border-[#6682FF] text-[#6682FF]">保存</a-button>
                <a-button class="text-sm h-8 rounded-3" type="primary" :disabled="hasUnfilledRequiredFields" @click="handleRelease(formData)" >发布</a-button>
            </div>
        </template>
    </a-drawer>
</template>
<script setup>
import {
    ref, computed, h, watch, reactive,
} from 'vue';
import { CARRIER_OPTION } from 'constants/app';
import {
    editPreparationAppCarrierApi, pushPreparationAppCarrierApi,
} from 'api/data';
import { Modal, message } from 'ant-design-vue';
import InfoIcon from '/src/assets/svg/data/icon_info_colorful.svg';
import { emitter, formatDate } from 'utils';
import { usePageList } from '@/hooks';
import { getSoftwareComponentListByCarrierApi, deleteSoftwareComponentCarrierApi } from '@/api/software';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm.js';

const { showDeleteConfirm } = useDeleteConfirm();
const columns = ref([
    {
        title: '软件成分名称',
        dataIndex: 'component_name',
        width: '280px',
        fixed: 'left',
        ellipsis: true,
    },
    {
        title: '版本',
        dataIndex: 'component_version',
        width: '178px',
        ellipsis: true,

    },
    {
        title: '分类',
        dataIndex: 'asset_category',
        width: '178px',
        // customRender({ text }) { return text || '-'; },
    },
    {
        title: '状态',
        dataIndex: 'status',
        width: '120px',
        // customRender({ text }) { return text || '-'; },
    },
    {
        title: '供应商',
        dataIndex: 'supplier_name',
        width: '120px',
    },
    {
        title: '生态',
        dataIndex: 'ecosystem',
        width: '120px',
    },
    {
        title: '仓库',
        dataIndex: 'repository',
        width: '200px',
        ellipsis: true,
    },
    // {
    //     title: '标签',
    //     dataIndex: 'tags',
    //     width: 178,
    //     // customRender({ text }) { return text || '-'; },
    // },
    {
        title: '创建时间',
        dataIndex: 'created_at',
        width: '178px',
        type: 'date',
        customRender({ text }) { return formatDate(text) || '-'; },
    },
    // {
    //     title: '更新时间',
    //     dataIndex: 'updated_at',
    //     width: '178px',
    //     type: 'date',
    //     customRender({ text }) { return formatDate(text) || '-'; },
    // },
    {
        title: '操作',
        dataIndex: 'operate',
        width: '52px',
        // align: 'center',
        fixed: 'right',
        // customRender: () => h('div', {
        //     class: 'flex items-center justify-center gap-2',
        // }, [
        //     h('a', {
        //         class: 'text-primary cursor-pointer',
        //         onClick: () => {},
        //     }, '查看'),
        // ]),
    },
]);

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

const emit = defineEmits(['getData', 'update:open']);

const formData = ref({
    carrier: {
        name: '',
        status: undefined,
        owner: undefined,
        system: undefined,
        description: '',
    },

});

const filters = reactive({
    carrier_id: null,
});

const changeformData = () => {
    Object.assign(formData.value.carrier, listData[currentIndex.value] || {});
    formData.value.app_ids = listData[currentIndex.value]?.applications?.map((item) => item.application_id) || [];
    filters.carrier_id = formData.value.carrier.carrier_id;
};

changeformData();

const {
    listData: componentlistData,
    getData,
} = usePageList(getSoftwareComponentListByCarrierApi, filters);

// const mocklist = [
//     {
//         asset_category: 'UI组件',
//         asset_type: '前端库',
//         attributes: {
//             language: 'TypeScript',
//             size: '150KB',
//             license: 'MIT',
//         },
//         component_context: [
//             {
//                 content: "<Button type='primary'>确定</Button>",
//                 description: '基础按钮示例',
//                 name: 'PrimaryButton',
//                 type: 'example',
//             },
//         ],
//         component_desc: '提供常用 UI 按钮组件',
//         component_id: 1001,
//         component_name: 'Button',
//         component_union_id: 'button@1.2.0',
//         component_version: '1.2.0',
//         created_at: '2024-04-10T12:00:00Z',
//         ecosystem: 'React',
//         repository: 'github.com/myorg/ui-library',
//         status: 'active',
//         supplier_name: 'MyOrg',
//         tags: ['button', 'ui', 'react'],
//         updated_at: '2025-06-01T08:00:00Z',
//         vendor: 'MyOrg Inc.',
//     },
//     {
//         asset_category: '数据处理',
//         asset_type: '工具库',
//         attributes: {
//             language: 'JavaScript',
//             size: '80KB',
//             license: 'Apache-2.0',
//         },
//         component_context: [
//             {
//                 content: 'formatDate(new Date())',
//                 description: '格式化当前时间',
//                 name: 'formatDate',
//                 type: 'function',
//             },
//         ],
//         component_desc: '提供各种数据格式化功能',
//         component_id: 1002,
//         component_name: 'DataUtils',
//         component_union_id: 'data-utils@0.9.1',
//         component_version: '0.9.1',
//         created_at: '2023-11-20T09:30:00Z',
//         ecosystem: 'Node.js',
//         repository: 'github.com/myorg/data-utils',
//         status: 'active',
//         supplier_name: 'MyOrg',
//         tags: ['date', 'format', 'utils'],
//         updated_at: '2025-05-15T14:20:00Z',
//         vendor: 'MyOrg Inc.',
//     },
// ];

watch(
    () => listData,
    () => changeformData(),
);

// 日志
const opetateLog = ref(false);
const logfilter = ref({
    entity_type: 'Carrier',
    entity_id: null, // 这里可以根据实际情况设置
});
// 开启操作日志
const turnOnLog = () => {
    opetateLog.value = true;
    logfilter.value.entity_id = String(formData.value.carrier.carrier_id);
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

const afterOpenChange = (bool) => {
    console.log('open', bool);
};

// 检查 formData.carrier.applications 是否为 null 或 undefined
const filteredApplications = computed(() => (formData.value.carrier.applications || []).filter((app) => formData.value.app_ids.includes(app.application_id)));

const handleImprove = () => {
    activeTab.value = 1;
    const selects = document.querySelectorAll('.select-dom.true .ant-select-selector');
    const inputs = document.querySelectorAll('.input-dom.true');
    const doms = [...selects, ...inputs];
    doms.forEach((dom) => {
        dom.classList.add('flash-border');
    });
};

// 是否显示必填信息未完善
const hasUnfilledRequiredFields = computed(
    () => !formData.value.carrier.name
        || filteredApplications.value?.some((app) => app.data_status !== 'published')
        || formData.value.app_ids?.length === 0
        || !formData.value.app_ids,
);

const handleSave = async (closeDrawer = true) => {
    // formData.value.application_owner_id = String(formData.value.application_owner_id);
    await editPreparationAppCarrierApi(formData.value);
    emit('getData');
    if (closeDrawer) {
        emit('update:open', false);
    }
};

// 发布
const handleRelease = (record) => {
    Modal.confirm({
        title: '确认发布此条数据吗？',
        icon: h('span', { role: 'img', 'aria-label': 'exclamation-circle', class: 'anticon anticon-exclamation-circle' }, [
            h('img', { src: InfoIcon, alt: '信息图标' }),
        ]),
        content: '发布后数据将被视为正式数据进行统计',
        async onOk() {
            try {
                await handleSave(false);
                await pushPreparationAppCarrierApi({
                    carrier_ids: [record.carrier.carrier_id],
                });
                emit('getData');
            } catch {
                console.log('Oops errors!');
            } finally {
                emit('getData');
                emit('update:open', false);
                emitter.emit('getdatareviewtotal');
                message.success('发布成功');
            }
        },
        onCancel() {},
    });
};

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

// 移除
const handleDelete = (record) => {
    showDeleteConfirm({
        record: { carrier_id: filters.carrier_id, component_id: [record.component_id] },
        onDelete: deleteSoftwareComponentCarrierApi,
        onSuccess: getData,
        title: '确认移除此数据吗？',
        content: '移除后，将解除应用载体和软件成分的关联关系',
    });
};

</script>

<style>
.root-class-name.cn .ant-drawer-content-wrapper {
    width: 1000px !important;
}
.security-issues-drawer {
    .ant-drawer-header {
        display: none;
    }
    .ant-drawer-body {
        /* 隐藏滚动条 */
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE 和 Edge */
        &::-webkit-scrollbar {
            visibility: hidden;
            /* display: none; */
        }
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

.flash-border {
    border-color: #6682FF !important;
}

.done-text {
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
</style>
