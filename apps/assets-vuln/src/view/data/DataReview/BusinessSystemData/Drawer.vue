<template>
    <a-drawer class="security-issues-drawer" root-class-name="root-class-name" :root-style="{
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
                        个业务系统</span>
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
                    <span class=" text-sm font-medium text-gradient-done">当前数据已完善必填信息，审查数据无误后可直接发布数据</span>
                </div>
            </div>

            <!-- 表单 -->
            <div class="h-[calc(100vh-270px)] overflow-auto">
                <div class="mb-6">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-[#3C3C3C] text-xs font-medium">业务系统名称</span>
                        <span v-if="!formData.business_system.business_system_name" class="text-xs font-medium flex items-center text-gradient-pending">
                            <Svg name="data-time" class="mr-1" color="#6C9FFF" style="width:14px;height:14px;"></Svg>
                            信息待完善
                        </span>
                        <!-- <span v-else class="text-[#2B5FFF] text-xs font-medium flex items-center">
                            <Svg name="data-icon_yes_outlined" class="mr-1" color="#6C9FFF" style="width:14px;height:14px;"></Svg>
                            <span class="done-text">已完成</span>
                        </span> -->
                    </div>
                    <a-input v-model:value="formData.business_system.business_system_name" class="w-full input-dom"  :maxlength="30" show-count :class="!formData.business_system.business_system_name ? 'true' : ''" placeholder="请输入" />
                </div>

                <div class="mb-6">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-[#3C3C3C] text-xs font-medium">上级业务系统</span>
                        <span v-if="formData.business_system.parent_business_data_status !== 'published' && !parent_business_system_selected" class="text-[#FF4D4F] text-xs font-medium flex items-center">
                            <Svg name="icon_warning" class="mr-2" style="width:14px;height:14px;"></Svg>
                            所选数据未发布，需先发布
                        </span>
                        <!-- <span v-else-if="!formData.business_system.business_system_pid" class="text-[#2B5FFF] text-xs font-medium flex items-center text-gradient">
                            <Svg name="data-time" class="mr-1" color="#6C9FFF" style="width:14px;height:14px;"></Svg>
                            信息待完善
                        </span> -->
                        <!-- <span v-else class="text-[#2B5FFF] text-xs font-medium flex items-center">
                            <Svg name="data-icon_yes_outlined" class="mr-1" color="#6C9FFF" style="width:14px;height:14px;"></Svg>
                            <span class="done-text">已完成</span>
                        </span>
                        </span> -->
                    </div>
                    <TreeSelect @select="parent_business_system_selected=true" :class="!formData.parent_business_data_status === 'published' ? 'true' : ''" class="w-full base-tree-select select-dom" v-model:value="formData.business_system.business_system_pid" :field-names="{
                        children: 'child',
                        label: 'business_system_name',
                        value: 'business_system_id',
                    }" :tree-data="sysTree" placeholder="请搜索并选择上级业务系统" />
                </div>

                <div class="mb-6">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-[#3C3C3C] text-xs font-medium">业务系统状态</span>
                        <span v-if="!formData.business_system.business_system_status" class="text-xs font-medium flex items-center text-gradient-pending">
                            <Svg name="data-time" class="mr-1" color="#6C9FFF" style="width:14px;height:14px;"></Svg>
                            信息待完善
                        </span>
                        <!-- <span v-else class="text-[#2B5FFF] text-xs font-medium flex items-center">
                            <Svg name="data-icon_yes_outlined" class="mr-1" color="#6C9FFF" style="width:14px;height:14px;"></Svg>
                            <span class="done-text">已完成</span>
                        </span> -->
                    </div>

                    <Select :popupClassName="'base-select-dropdown'" class="w-full select-dom" :class="!formData.business_system.business_system_status ? 'true' : ''" v-model:value="formData.business_system.business_system_status" :options="SYSTEM_STATUS_OPTION" placeholder="业务系统状态" />
                </div>

                <div class="mb-6">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-[#3C3C3C] text-xs font-medium">业务系统负责人</span>
                        <span v-if="!formData.business_system.business_system_owner_id " class="text-xs font-medium flex items-center text-gradient-pending">
                            <Svg name="data-time" class="mr-1" color="#6C9FFF" style="width:14px;height:14px;"></Svg>
                            信息待完善
                        </span>
                        <!-- <span v-else class="text-[#2B5FFF] text-xs font-medium flex items-center">
                            <Svg name="data-icon_yes_outlined" class="mr-1" color="#6C9FFF" style="width:14px;height:14px;"></Svg>
                            <span class="done-text">已完成</span>
                        </span> -->
                    </div>

                    <UserSelect class="user-select w-full select-dom" :class="!formData.business_system.business_system_owner_id ? 'true' : ''" :popupClassName="'user-select-dropdown'" v-model:value="formData.business_system.business_system_owner_id" placeholder="请搜索并选择组织负责人"
                                :showSearch="true"  :userid="formData.business_system.business_system_owner_id"
                    />
                </div>

                <div class="mb-6">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-[#3C3C3C] text-xs font-medium">所属组织</span>
                        <span v-if="!formData.business_system.organize_id || formData.business_system.organize_id === '0'" class="text-xs font-medium flex items-center text-gradient-pending">
                            <Svg name="data-time" class="mr-1" color="#6C9FFF" style="width:14px;height:14px;"></Svg>
                            信息待完善
                        </span>
                        <!-- <span v-else class="text-[#2B5FFF] text-xs font-medium flex items-center">
                            <Svg name="data-icon_yes_outlined" class="mr-1" color="#6C9FFF" style="width:14px;height:14px;"></Svg>
                            <span class="done-text">已完成</span>
                        </span> -->
                    </div>

                    <OrgTreeSelect class="base-tree-select w-full select-dom" :class="(!formData.business_system.organize_id || formData.business_system.organize_id === '0') ? 'true' : ''" v-model:value="formData.business_system.organize_id"  placeholder="搜索选择所属组织"   :organizeId="formData.business_system.organize_id" show-search
                    />
                </div>

                <div class="mb-6">
                    <div class="text-[#3C3C3C] text-xs font-medium mb-2">业务系统描述</div>
                    <TextArea :maxlength="200" v-model="formData.business_system.business_system_desc" placeholder="请输入描述"  rows="4"/>
                </div>
            </div>
        </div>

        <OperationLogModal v-model:open="opetateLog" v-if="opetateLog" :logfilter="logfilter" />

        <template #footer>
            <div class="flex items-center justify-end gap-3">
                <a-button class="text-sm h-8 rounded-3" @click="$emit('update:open', false)">取消</a-button>
                <a-button class="not-ant-btn-default text-sm h-8 rounded-3  border-[#6682FF] text-[#6682FF]" @click="handleSave">保存</a-button>
                <a-button class="text-sm h-8 rounded-3 bg-primary text-white" :disabled="hasUnfilledRequiredFields" @click="handleRelease(formData)">发布</a-button>
            </div>
        </template>
    </a-drawer>
</template>
<script setup>
import {
    computed, onMounted, ref, watch,

    h,
} from 'vue';
import {
    SYSTEM_STATUS_OPTION,
} from 'constants/app';
import {
    editDataPreparationBusinessSystemApi, pushDataPreparationBusinessSystemApi,
} from 'api/data';
import { getBusinessListApi } from 'api/bus';
import { Modal, message } from 'ant-design-vue';
import { emitter } from 'utils';
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

const emit = defineEmits(['getData', 'handleRelease', 'update:open']);

const parent_business_system_selected = ref(false);
const parent_business_system_id_backup = ref(0);

const currentIndex = ref(clickindex);
const activeTab = ref(1);

const afterOpenChange = (bool) => {
    console.log('open', bool);
};

const formData = ref({
    business_system: {
        name: undefined,
        parentSystem: undefined,
        status: undefined,
        owner: undefined,
        business_system_owner_id: undefined,
        organization: undefined,
        description: undefined,
        business_system_pid: undefined,
        business_system_name: undefined,
        parent_business_system: undefined,
        business_system_status: undefined,
    },

});

// 是否显示必填信息未完善
const hasUnfilledRequiredFields = computed(
    () => !formData.value.business_system.business_system_name
        || !formData.value.business_system.business_system_status
        || !formData.value.business_system.business_system_owner_id
        || !formData.value.business_system.organize_id
        || formData.value.business_system.organize_id === '0'
        || formData.value.business_system.parent_business_data_status !== 'published',
    // || !formData.value.parent_business_data_status === 'published',
);

const changeformData = () => {
    Object.assign(formData.value.business_system, listData[currentIndex.value] || {});
    if (formData.value.business_system.organize_id === '0') {
        formData.value.business_system.organize_id = undefined;
    }
    if (formData.value.business_system.business_system_owner_id === '0') {
        formData.value.business_system.business_system_owner_id = undefined;
    }
    if (formData.value.business_system.business_system_pid === 0) {
        formData.value.business_system.business_system_pid = undefined;
    }
    if (formData.value.business_system.parent_business_data_status !== 'published') {
        parent_business_system_id_backup.value = formData.value.business_system.business_system_pid;
        formData.value.business_system.business_system_pid = formData.value.business_system.parent_business_system;
    }
    console.log('formData', formData.value);
};
changeformData();

watch(
    () => listData,
    () => changeformData(),
);

watch(() => listData, (newVal) => {
    if (newVal.length > 0) {
        changeformData();
    }
}, { immediate: true });

// 日志
const opetateLog = ref(false);
const logfilter = ref({
    entity_type: 'BusinessSystem',
    entity_id: null, // 这里可以根据实际情况设置
});
// 开启操作日志
const turnOnLog = () => {
    opetateLog.value = true;
    logfilter.value.entity_id = String(formData.value.business_system.business_system_id);
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
        parent_business_system_selected.value = false;
    }
};

const nextIssue = () => {
    if (currentIndex.value < listData.length - 1) {
        currentIndex.value++;
        changeformData();
        ImproveReset();
        parent_business_system_selected.value = false;
    }
};

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

// 保存数据
const handleSave = async (closeDrawer = true) => {
    if (formData.value.business_system.business_system_pid === formData.value.business_system.parent_business_system) {
        formData.value.business_system.business_system_pid = parent_business_system_id_backup.value;
    }
    await editDataPreparationBusinessSystemApi(formData.value);
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
                console.log('发布', record);
                await pushDataPreparationBusinessSystemApi({
                    business_system_ids: [record.business_system.business_system_id],
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
        onCancel() {},
    });
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

onMounted(() => {
    getSysTree();
});

</script>

<style lang="scss">
.root-class-name .ant-drawer-content-wrapper {
    width: 610px !important;
}
.root-class-name .ant-drawer-footer {
    padding: 24px;
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

.flash-border {
    border-color: #6682FF !important;
}
</style>
