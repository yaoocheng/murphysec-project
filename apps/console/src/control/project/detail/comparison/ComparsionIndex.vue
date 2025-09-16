<template>
    <el-dialog class="screen-dialog diff-dialog" @close="emits('update:modelValue', false);isShowDiff=false" :close-on-press-escape="false">
        <template #header>
            <div style="width: 1200px; margin: 0 auto;" class="relative pt-8 pb-2">
                <div class="mb-6">
                    <span v-if="isShowDiff"
                        class="g-mr-48 hover_btn1 other_btn p-1 text-sm font-normal text-primary g-cursor-pointer back absolute left-[-92px]"
                        @click="isShowDiff = false; activeTab=0">
                        <i class="murphy icon-fanhui g-f-12 g-vertical-1"></i>
                        其他任务
                    </span>

                    <div class="g-flex g-align-center g-f-24 g-fw-600 g-color-1">
                        <img class="g-mr-16" :src="getAccessImg(taskList[0]?.access_type)" style="width: 36px;" alt="">
                        {{ info.name }}（{{formatDate(info.created_at)}}）
                        <span class="now">当前任务</span>
                    </div>

                    <div v-if="isShowDiff" style="background: #EBEBEB80;" class="text-85 mt-6 rounded-md p-4 text-sm font-normal">
                        对比任务：{{ otherCompareData.project }}（{{otherCompareData.task}}）
                        <span @click="isShowDiff=false; activeTab=0" class="hover_btn1 p-1 cursor-pointer">
                            <i class="murphy icon-qiehuan"></i>
                            切换其他任务
                        </span>
                    </div>
                </div>

                <div v-if="!isShowDiff" class="tabs text-sm font-normal">
                    <span @click="activeTypeTab = index" :class="{ 'active': activeTypeTab === index }"
                        v-for="(item, index) in typeTabs" :key="item">{{ item }}</span>
                </div>

                <div v-if="isShowDiff" class="tabs text-sm font-normal">
                    <span @click="activeTab = index" :class="{ 'active': activeTab === index }"
                        v-for="(item, index) in infoTabs" :key="item">{{ item }}</span>
                </div>
            </div>
        </template>
        <!-- :style="{height: isShowDiff&&activeTypeTab===1 ? 'calc(100% - 70px)' : '100%'}" -->
        <div class="h-full w-[1200px] mx-auto my-0">
            <!-- 当前项目对比任务 -->
            <CurCompTask v-if="!isShowDiff&&activeTypeTab===0" :taskList="taskList" :info="info" />

            <!-- 其他项目对比 -->
             <OtherCompTask v-if="!isShowDiff&&activeTypeTab===1" />

            <!-- 对比内容 -->
            <DiffInfo v-if="isShowDiff" :compareData="compareData" />
        </div>
    </el-dialog>
</template>

<script setup lang='ts'>
import { ref, onBeforeMount, watch } from 'vue';
import { useRoute } from 'vue-router';
import { getHistoryListApi } from 'api/project';
import store from 'util/store';
import DiffInfo from './DiffInfo.vue';
import { activeTab, isShowDiff, otherCompareData } from './data';
import {
    formatDate, getAccessImg,
} from '@/utils/tools';
import CurCompTask from './CurCompTask.vue';
import OtherCompTask from './OtherCompTask.vue';

defineProps(['info']);
const route = useRoute();
const emits = defineEmits(['update:modelValue']);
const taskList = ref<Array<any>>([]);
const compareData = ref<any>({});
const infoTabs = ['基本信息及概览', '缺陷组件', '许可证类型', 'SBOM清单', '漏洞列表', '文件差异'];
const typeTabs = ['当前项目对比任务', '其他项目对比任务'];
const activeTypeTab = ref<number>(0);
const bodyHeight = ref<string>('calc(100% - 120px)');

onBeforeMount(async () => {
    try {
        const res = await getHistoryListApi({
            project_id: route.params.tid,
            team_id: store.teamInfo.team_id,
            limit: 1000,
            page: 1,
        });
        taskList.value = res.data?.list?.filter((item: any) => item.status === 3);
    } catch (error) {
        console.log(error);
    }
});

watch(isShowDiff, (newVal) => {
    if (newVal) {
        bodyHeight.value = 'calc(100% - 196px)';
    } else {
        bodyHeight.value = 'calc(100% - 120px)';
    }
});

</script>

<style lang='less'>
.screen-dialog.diff-dialog {
    padding: 0;
    display: flex;
    flex-direction: column;

    .hover_btn1:hover {
        background-color: #EBEBEB !important;
    }

    .other_btn.hover_btn1:hover {
        background-color: #6C87FF1A !important;

    }
    // .top-info {
    //     box-shadow: 0px 4px 10px 0px rgba(166, 180, 214, 0.25);
    // }

    // .tabs {
    //     margin-left: 100px;
    //     margin-top: 30px;
    // }

    .tabs span {
        margin-right: 28px;
        color: #858585;
        font-size: 16px;
        padding-bottom: 8px;
        border-bottom: 2px solid transparent;
        cursor: pointer;
    }

    .tabs span.active {
        border-color: @primary;
        color: @primary;
    }

    .now {
        padding: 3px 5px;
        font-size: 14px;
        font-weight: 500;
        border-radius: 4px;
        background: rgba(73, 102, 230, 0.20);
        color: #2946C7;
        margin-left: 8px;
    }

    // .back {
    //     padding: 3px 5px;
    // }

    // .back:hover {
    //     border-radius: 4px;
    //     background-color: #EBEBEB;
    // }

    // .task-content {
    // max-width: 1200px;
    // margin: 0 auto;
    // padding-top: 24px;
    // height: calc(100% - 134px);
    // background-color: #F7F8FB;
    // overflow: auto;
    // }

    .item {
        position: relative;

        .el-button {
            position: absolute;
            right: 16px;
            top: 16px;
            width: 64px;
            height: 28px;
        }

        .time:hover {
            text-decoration: underline;
            color: #6c87ff;
        }

        .td {
            .ellipsis();
        }

        .user {
            display: inline-block;
            background-color: #EFF0F1;
            height: 20px;
            line-height: 20px;
            border-radius: 16px;
            padding-right: 5px;
        }

        img {
            width: 20px;
            height: 20px;
            border-radius: 0;
            vertical-align: -4px;
        }

        .tag {
            background: rgba(245, 74, 69, 0.2);
            border-radius: 4px;
            padding: 3px 6px;
            margin-right: 4px;
            font-size: 13px;
            color: #D83931;
            display: inline-block;
            font-weight: 500;
        }

        .tag:nth-of-type(2) {
            background-color: rgba(255, 136, 0, 0.2);
            color: #DE7802;
        }

        .tag:nth-of-type(3) {
            background-color: rgba(31, 35, 41, 0.1);
            color: #646A73;
        }
    }

    .el-dialog__header {
        padding: 0 !important;
    }

    .el-dialog__body {
        padding: 0;
        height: v-bind(bodyHeight) !important;
        // height: calc(100% - 120px) !important;
        // padding-bottom: 140px;
        // flex: 1;
        box-sizing: border-box;
        background-color: #F7F8FB;
    }
}
</style>
