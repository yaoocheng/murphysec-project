<template>
    <div class="overflow-auto main-content">
        <div class="px-6 py-4 bg-white border-bottom-f2">
            <div class="flex mb-2 justify-between">
                <span class="font-medium text-xl leading-8" >
                    {{ editAppData?.application_name }}
                </span>

                <div @click="turnOnLog" class="text-button-gray">
                    <Svg height="14px" width="14px" name="log"></Svg>
                    <span>操作日志</span>
                </div>
            </div>
            <div class="font-medium text-sm flex justify-between items-center">
                <div>
                    基本信息
                    <a-tooltip>
                        <template #title>{{ isExpand ? '收起' : '展开' }}</template>
                        <span class="cursor-pointer" @click="isExpand = !isExpand">
                            <Svg :class="{ 'rotate-180': isExpand }" height="12px" width="12px" name="select-suffix"
                                 color="#3c3c3c"></Svg>
                        </span>
                    </a-tooltip>
                </div>
                <div>
                    <a-tooltip placement="left">
                        <template #title>编辑应用</template>
                        <span @click="openAppModal = true;"
                              class="icon-hover hover:bg-e6 cursor-pointer">
                            <Svg height="16px" width="16px" class="align-[-2px]" name="edit"></Svg>
                        </span>
                    </a-tooltip>
                </div>
            </div>

            <div class="flex justify-start flex-wrap overflow-hidden relative gap-[16px]"
                 :class="{ 'h-12': !isExpand, 'h-auto': isExpand }">
                <div v-if="!isExpand" class="hide w-full absolute bottom-0 left-0 h-6"></div>
                <div class="calculate-width info-item mt-2" v-for="item in info_list" :key="item.value">
                    <div class="text-xs text-99 mb-2">{{ item.name }}</div>
                    <div v-if="item.name === '应用负责人'">
                        <div v-if="appInfo[item.value] == ''">{{ appInfo[item.value] || '-' }}</div>
                        <User v-else :users="[appInfo[item.value]]" />
                    </div>
                    <div v-else-if="item.name === '所属业务系统'" style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;display: block;">
                        <a-tooltip arrowPointAtCenter>
                            <template #title>{{ appInfo[item.value] }}</template>
                            {{ appInfo[item.value] || '-' }}
                        </a-tooltip>
                    </div>
                    <div v-else-if="item.name === '最近更新时间'">
                        {{ formatDate(appInfo[item.value]) || '-' }}
                    </div>
                    <div v-else-if="item.name === '应用状态'">
                        {{ findApplicationStatusLabel(appInfo[item.value]) || '-' }}
                    </div>
                    <div v-else>
                        {{ appInfo[item.value] || '-' }}
                    </div>
                </div>
                <!-- <div class="calculate-width info-item mt-2" v-for="item in infos" :key="item.value">
                    <div class="text-xs text-99 mb-2">{{ item.name }}</div>
                    <div v-if="item.name === '应用负责人'">
                        <div v-if="item.value == ''">{{ item.value || '-' }}</div>
                        <User v-else :users="[item.value]" />
                    </div>
                    <div v-else-if="item.name === '所属业务系统'" style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;display: block;">
                        <a-tooltip arrowPointAtCenter>
                            <template #title>{{ item.value  }}</template>
                            {{ item.value || '-' }}
                        </a-tooltip>
                    </div>
                    <div v-else>
                        {{ item.value || '-'}}
                    </div>
                </div> -->
            </div>
        </div>

        <a-tabs v-model:activeKey="activeKey" :tabBarGutter="16" :tabBarStyle="TAB_BAR_STYLE">
            <a-tab-pane key="1" tab="安全问题">
                <SecIssue ref="secIssueRef" />
            </a-tab-pane>
            <a-tab-pane key="2" tab="软件成分">
                <ChainComp />
            </a-tab-pane>
            <a-tab-pane key="3" tab="安全能力">
                <SecAble />
            </a-tab-pane>
            <a-tab-pane key="4" tab="应用载体">
                <Index />
            </a-tab-pane>
            <template #renderTabBar="{ DefaultTabBar, ...props }">
                <component :is="DefaultTabBar" v-bind="props" :style="{ color: '#999' }" />
            </template>
        </a-tabs>
    </div>

    <OperationLogModal v-model:open="opetateLog" v-if="opetateLog" :logfilter="logfilter" />
    <AppModal v-model:open="openAppModal" v-if="openAppModal" :edit = true :editAppData="editAppData" @updateList="getAppInfo" />
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import { getAppInfoApi } from 'api/app';
import { useRoute } from 'vue-router';
import { formatDate } from 'utils';
import { TAB_BAR_STYLE } from '@/constants';
import AppModal from '../AppModal.vue';
import SecIssue from './SecIssue.vue';
import ChainComp from './ChainComp.vue';
import SecAble from './SecAble.vue';
import Index from './carrier/Index.vue';
import { findApplicationStatusLabel } from '@/constants/app';

const route = useRoute();
const isExpand = ref(false);
const openAppModal = ref(false);
const activeKey = ref('1');
const editAppData = ref();
const secIssueRef = ref(null);

const opetateLog = ref(false);
const logfilter = ref({
    entity_type: 'Application',
    entity_id: null, // 这里可以根据实际情况设置
});
// 开启操作日志
const turnOnLog = () => {
    opetateLog.value = true;
    logfilter.value.entity_id = String(route.params.id); // 设置当前载体ID
};

const info_list = reactive([
    {
        name: '所属业务系统',
        value: 'business_system_name',
    }, {
        name: '应用版本',
        value: 'application_version',
    }, {
        name: '应用状态',
        value: 'application_status',
    }, {
        name: '应用负责人',
        value: 'application_owner_nick_name',
    }, {
        name: '所属组织',
        value: 'organize_name',
    }, {
        name: '最近更新时间',
        value: 'update_at',
    }, {
        name: '应用重要性',
        value: 'application_level_desc',
    }, {
        name: '开发模式',
        value: 'develop_mode',
    }, {
        name: '合作开发公司名称',
        value: 'cooperate_comp',
    },
]);
const appInfo = ref({});

const getAppInfo = async () => {
    try {
        const { data } = await getAppInfoApi({
            application_id: route.params.id,
        });
        appInfo.value = data.data;
        editAppData.value = data.data;
        // const info = data.data;
        // const arr = [info.business_system_name, info.application_version, info.application_status, info.application_owner_nick_name, info.organize_name, formatDate(info.update_at)];
        // infos.forEach((item, i) => {
        //     item.value = arr[i];
        // });
    } catch (error) {
        console.log(error);
    }
};
getAppInfo();

watch(activeKey, (newVal) => {
    if (newVal === '1') {
        secIssueRef.value.getData();
    }
});
</script>

<style scoped>
.hide {
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, #FFFFFF 100%);
}
</style>
