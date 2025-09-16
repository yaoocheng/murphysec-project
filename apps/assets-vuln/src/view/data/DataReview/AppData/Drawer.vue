<template>
    <a-drawer class="security-issues-drawer" root-class-name="root-class-name" :root-style="{
        'z-index': '1001'
    }" title="Basic Drawer" placement="right" @after-open-change="afterOpenChange" size="large" :maskClosable="false">
        <div>
            <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-4">
                    <div class="flex items-center gap-2">
                        <span :class="currentIndex > 0 ? 'bg-white' : 'bg-f2'" @click="prevIssue"
                              class=" rotate-180 cursor-pointer w-8 h-8 flex items-center rounded justify-center hover:bg-f2 border border-solid border-[#E6E6E6]">
                            <Svg name="arrow" class="" :color="currentIndex > 0 ? '#3c3c3c' : '#B3B3B3'"
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
                        个应用</span>
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
            <!-- 表单 -->
            <div class="h-[calc(100vh-270px)] overflow-auto">
                <!-- 应用名称 -->
                <div class="mb-6">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-[#3C3C3C] text-xs font-medium">应用名称</span>
                        <span v-if="!formData.application.application_name"
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
                    <a-input :class="!formData.application.application_name ? 'true' : ''"
                             v-model:value="formData.application.application_name" class="w-full input-dom base-input"
                             placeholder="请输入" :maxlength="30" show-count />
                </div>

                <!-- 应用状态 -->
                <div class="mb-6">
                    <div class="text-[#3C3C3C] text-xs font-medium mb-2">应用状态</div>
                    <Select :popupClassName="'base-select-dropdown'" class="w-full base-select"
                            v-model:value="formData.application.application_status" :options="APP_STATUS_OPTION"
                            placeholder="应用状态" />
                </div>

                <!-- 应用负责人 -->
                <div class="mb-6">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-[#3C3C3C] text-xs font-medium">应用负责人</span>
                        <span v-if="!formData.application.application_owner_id"
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

                    <UserSelect class="user-select w-full select-dom"
                                :class="!formData.application.application_owner_id ? 'true' : 'false'"
                                @change="() => ImproveReset()"
                                :popupClassName="'user-select-dropdown'"
                                v-model:value="formData.application.application_owner_id"
                                placeholder="请搜索并选择组织负责人" :userid="formData.application.application_owner_id"/>
                </div>

                <!-- 所属业务系统 -->
                <div class="mb-6">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-[#3C3C3C] text-xs font-medium">所属业务系统</span>
                        <span v-if="!formData.application.business_system_id"
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

                    <TreeSelect :class="!formData.application.business_system_id ? 'true' : ''"
                                class="w-full base-tree-select select-dom"
                                v-model:value="formData.application.business_system_id" :field-names="{
                                    children: 'child',
                                    label: 'business_system_name',
                                    value: 'business_system_id',
                                }" :tree-data="sysTree" placeholder="搜索选择上级业务系统" />
                </div>

                <!-- 所属组织 -->
                <div class="mb-6">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-[#3C3C3C] text-xs font-medium">所属组织</span>
                    </div>
                    <!-- <TreeSelect :disabled="true" class="base-tree-select w-full"
                                v-model:value="formData.application.organize_id" placeholder="请选择业务系统所属组织" :field-names="{
                                    children: 'organize',
                                    label: 'organize_name',
                                    value: 'organize_id',
                                }" :tree-data="globalState.orgTree" /> -->

                    <OrgTreeSelect :disabled="true" class="base-tree-select w-full" v-model:value="formData.application.organize_id" placeholder="请选择业务系统所属组织"   :organizeId="formData.application.organize_id"
                    />

                </div>

                <!-- 应用描述 -->
                <div class="mb-6">
                    <div class="text-[#3C3C3C] text-xs font-medium mb-2">应用描述</div>
                    <!-- <a-textarea
                        v-model:value="formData.application.application_desc"
                        class="w-full"
                        placeholder="请输入"
                        :maxlength="200"
                        show-count
                        :auto-size="{ minRows: 4, maxRows: 6 }"
                    /> -->

                    <TextArea v-model="formData.application.application_desc" :maxlength="200" :rows="4"
                              placeholder="请输入" />
                </div>
            </div>
        </div>

        <OperationLogModal v-model:open="opetateLog" v-if="opetateLog" :logfilter="logfilter" />

        <template #footer>
            <div class="flex items-center justify-end gap-3">
                <a-button class="text-sm h-8 rounded-3" @click="$emit('update:open', false)">取消</a-button>
                <a-button class="not-ant-btn-default text-sm h-8 rounded-3  border-[#6682FF] text-[#6682FF]"
                          @click="handleSave">保存</a-button>
                <a-button class="text-sm h-8 rounded-3 bg-primary text-white" :disabled="hasUnfilledRequiredFields"
                          @click="handleRelease(formData)">发布</a-button>
            </div>
        </template>
    </a-drawer>
</template>
<script setup>
import {
    onMounted, ref, computed, watch,
    h,
} from 'vue';
import {
    APP_STATUS_OPTION,

} from 'constants/app';
import { emitter } from 'utils';
import { editPreparationAppApi, pushPreparationAppApi } from 'api/data';
import { getBusinessListApi, getBusinessSystemParentOrganizeApi } from 'api/bus';
import { Modal, message } from 'ant-design-vue';
import { userInfo } from '@/store';
import InfoIcon from '/src/assets/svg/data/icon_info_colorful.svg';

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
    application: {
        name: '',
        status: undefined,
        owner: undefined,
        system: undefined,
        organization: 'XXXX组织',
        description: '',
    },

});

const changeformData = () => {
    Object.assign(formData.value.application, listData[currentIndex.value] || {});

    if (formData.value.application.application_owner_id === '0') {
        formData.value.application.application_owner_id = undefined;
    }
    if (formData.value.application.business_system_id === 0) {
        formData.value.application.business_system_id = undefined;
    }
    console.log('formData', formData.value);
};
changeformData();

watch(
    () => listData,
    () => changeformData(),
);

watch(
    () => formData.value.application.business_system_id,
    async () => {
        const res = await getBusinessSystemParentOrganizeApi(formData.value.application.business_system_id);
        console.log('res', res);
        formData.value.application.organize_id = res.data.data;
    },
);

// 日志
const opetateLog = ref(false);
const logfilter = ref({
    entity_type: 'Application',
    entity_id: null, // 这里可以根据实际情况设置
});
// 开启操作日志
const turnOnLog = () => {
    opetateLog.value = true;
    logfilter.value.entity_id = String(formData.value.application.application_id);
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

const sysTree = ref([]);

const getSysTree = async () => {
    try {
        const { data } = await getBusinessListApi({
            organize_id: userInfo.value.org_id,
        });
        sysTree.value = data.data.data_list;
    } catch (error) {
        console.log(error);
    }
};

// 是否显示必填信息未完善
const hasUnfilledRequiredFields = computed(
    () => !formData.value.application.application_name
        || !formData.value.application.application_owner_id
        || !formData.value.application.business_system_id,
);

// 对必填信息进行提示
const handleImprove = () => {
    activeTab.value = 1;
    const selects = document.querySelectorAll('.select-dom.true .ant-select-selector');
    const inputs = document.querySelectorAll('.input-dom.true');
    const doms = [...selects, ...inputs];
    console.log('doms', doms);
    doms.forEach((dom) => {
        dom.classList.add('flash-border');
    });
};

const handleSave = async (closeDrawer = true) => {
    await editPreparationAppApi(formData.value);
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
                // await handleSave(false);
                await editPreparationAppApi(formData.value);
                await pushPreparationAppApi({
                    application_ids: [record.application.application_id],
                });
            } catch {
                return console.log('Oops errors!');
            } finally {
                emit('update:open', false);
                emitter.emit('getdatareviewtotal');
                emit('getData');
                message.success('发布成功');
            }
        },
        onCancel() { },
    });
};

onMounted(() => {
    getSysTree();
});

</script>

<style>
.root-class-name .ant-drawer-content-wrapper {
    width: 610px !important;
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
