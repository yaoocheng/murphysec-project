<template>
    <div class="problem_head_Content">
        <div class="g-flex">
            <el-tooltip effect="light" placement="top">
                <div v-if="info.highest_suggest" class="repair_level"
                     :style="{ background: getRepaireLevelTool(info.highest_suggest).color }">
                    {{ getRepaireLevelTool(info.highest_suggest).text }}
                </div>
                <div v-else class="safe-level">
                    安全
                </div>
                <template #content>
                    <SuggestTips :text="getRepaireLevelTool(info.highest_suggest).text" />
                </template>
            </el-tooltip>

            <div class="g-flex-grow-1">
                <div class="name">
                    <span class="g-display-inline-block" style="word-wrap: break-word;">
                        {{ info.title || '-' }}
                        <span v-if="!$route.path.includes('report') && !store.isAllTeam && securityId"
                              class="g-cursor-pointer button-icon-grey inline-block">
                            <!-- <span v-if="!$route.path.includes('report') && !store.isAllTeam && securityId"
                              class="g-cursor-pointer share"> -->
                            <i class="murphy g-color-1 icon-fenxiang1" style="font-size: 24px;"
                               @click="store.isShowShareReportModal = true; store.securityId = securityId;"></i>
                        </span>
                    </span>
                </div>
                <div class="import_info">

                    <TagComp class="g-mr-4"
                             v-if="info.comp_info?.repository !== 'unmanaged' && (info.comp_info?.ecosystem || info.comp_info?.repository)"
                             :content="info.comp_info?.ecosystem" />

                    <TagComp class="g-mr-4" v-if="info.comp_info?.is_self" content="自身依赖" />
                    <TagComp class="g-mr-4" v-else :content="info.comp_info?.is_direct_dependency ? '直接依赖' : '间接依赖'" />

                    <TagComp class="g-mr-4" bgc="rgba(20, 192, 255, 0.2)" c="#049FD7" v-if="info.comp_info?.is_poc"
                             :content="'POC'" />
                    <TagComp class="g-mr-4" v-if="info.comp_info?.is_poison" :content="'投毒组件'" />
                    <TagComp bgc="#14C0FF33" c="#049FD7" class="g-mr-4" v-if="info.comp_info?.has_cavd_id"
                             :content="'CAVD漏洞'" />
                    <el-tooltip v-if="info.comp_info?.is_online" effect="light" placement="top">
                        <TagComp class="g-mr-4" :content="'线上依赖'" />
                        <template #content>
                            <div style="color: #2A2B32;">
                                什么是线上依赖？<a href="/docs/glossary/production-dependencies.html" target="_blank">详情</a>
                            </div>
                        </template>
                    </el-tooltip>

                    <el-tooltip v-if="info.comp_info?.detection_strategy_name?.length">
                        <TagComp class="g-mr-4" c="#049FD7" bgc="#14C0FF33"
                                 :content="info.comp_info?.detection_strategy_name[0]" />

                        <template #content>
                            <div v-for="ele in info.comp_info?.detection_strategy_name" :key="ele">
                                {{ ele }}
                            </div>
                        </template>
                    </el-tooltip>

                    <TagComp class="g-mr-4" bgc="#14C0FF33" c="#049FD7"
                             v-if="info.comp_info?.set_suggest_level_type === 'defect'" content="标记为缺陷组件" />

                    <TagComp class="g-mr-4" bgc="#14C0FF33" c="#049FD7"
                             v-else-if="info.comp_info?.set_suggest_level_type === 'safe'" content="标记为安全组件" />

                    <el-tooltip v-if="info.comp_info?.project_detection_strategy_name?.length" placement="top">
                        <template #content>
                            <div>
                                命中项目策略：
                            </div>
                            <div v-for="o in ((info.comp_info?.project_detection_strategy_name))" :key="o">
                                {{ o }}
                            </div>
                        </template>
                        <span class="status stra-icon g-ml-8">
                            <i class="murphy icon-a-hitthetarget" style="color: #F34D3D;font-size: 16px;"></i>
                        </span>
                    </el-tooltip>

                    <span
                        @click="compJump({ name: info.comp_info?.comp_name, version: info.comp_info?.comp_version, ecosystem: info.comp_info?.ecosystem, repository: info.comp_info?.repository })"
                        class="second-info">当前组件版本：
                        <span class="link_text">{{ info.comp_info?.comp_version || '-' }}</span>
                    </span>

                    <span class="second-info">最新组件版本：{{ info.comp_info?.additional_data?.latest_version || '-' }}</span>

                    <span class="second-info" v-if="info.highest_suggest">创建时间：{{ formatDate(info?.created_at) || '-'
                    }}</span>

                    <!-- <span v-if="info.comp_info?.module_path && info.comp_info?.module_path?.length">
                        由<i class="murphy icon-xiangmu1"></i> <span>{{
                    info.comp_info?.module_path[0]?.associated_file_path
                }}</span> {{ info.comp_info.module_path[0]?.is_direct ? '直接引入' : '间接引入' }}</span>
                    <span class="hover_btn1" @click="sourceOpenHandle">
                        <i class="murphy icon-source"></i>
                        溯源
                    </span> -->
                </div>
            </div>
        </div>
    </div>

</template>

<script setup lang='ts'>
import {
    getRepaireLevelTool, formatDate,
} from 'util/tools';
import store from 'util/store';
import { compJump } from 'util/hook';
// import { getOrgAuthInfo } from '@/control/org/hooks';

const { info } = defineProps(['info', 'securityId']);

// const {
//     isUserSpace,
// } = getOrgAuthInfo();

// const route = useRoute();
// const router = useRouter();

// onBeforeMount(() => {
// })

// onMounted(() => {
// })
</script>

<style scoped lang='less'>
.problem_head_Content {
    background: #FFFFFF;
    border-radius: 6px;
    padding: 24px 120px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    position: relative;

    .hover_icon {
        padding: 4px;
    }

    .tag {
        line-height: 16px;
        margin-right: -4px;
    }

    .share:hover i {
        color: #6C87FF;
    }

    .status {
        &:hover {
            background-color: #f34d3d38;
        }

        padding: 5px 4px;
        font-size: 12px;
        border-radius: 4px;

        i {
            font-size: 14px;
            vertical-align: -1px;
        }
    }

    .repair_level {
        width: 64px;
        height: 64px;
        background: #F34D3D;
        border-radius: 6px;
        padding: 4px;
        box-sizing: border-box;
        // line-height: 64px;
        text-align: center;
        font-size: 20px;
        color: #fff;
        margin-right: 12px;
        overflow: hidden // word-wrap:break-word;
            // overflow: hidden;
    }

    .safe-level {
        width: 64px;
        height: 64px;
        margin-right: 12px;
        background-color: rgb(56, 199, 40);
        border-radius: 6px;
        box-sizing: border-box;
        font-size: 20px;
        color: #fff;
        text-align: center;
        line-height: 64px;
    }

    .name {
        font-size: 24px;
        font-weight: 500;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        color: #3c3c3c;
        width: 100%;
    }

    .import_info {
        font-size: 12px;
        color: #8F959E;

        .second-info {
            padding-left: 8px;
            margin-left: 8px;
            border-left: 1px solid #6C87FF33;
        }

        // span.hover_btn1 {
        //     display: inline-block;
        //     border: 1px solid #6C87FF;
        //     background-color: #fff;
        //     color: #6C87FF;
        //     font-size: 14px;
        //     padding: 1px 6px;
        //     border-radius: 6px;
        //     margin-left: 4px;
        //     cursor: pointer;
        // }
    }
}
</style>
