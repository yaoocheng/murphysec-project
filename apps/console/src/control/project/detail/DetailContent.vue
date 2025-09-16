<template>
    <div class="detect_detail main_content">
        <div v-if="showTip && strategyList.length && !$route.path.includes('report')"
             class="tip g-f-14 g-fw-500 g-color-1 g-flex g-justify-between">
            <div>
                <i class="murphy icon-gantanhao g-vertical--1 g-mr-4" style="color: #FF9940;"></i>
                当前项目命中 {{ strategyList.length }} 条检测策略，立即查看详情
            </div>
            <div class="g-cursor-pointer">
                <span @click="showStrategyModal = true" class="g-fw-400 g-color-5 g-mr-16">立即查看</span>
                <i @click="showTip = false" class="murphy icon-cuo g-vertical--1"></i>
            </div>
        </div>

        <div v-if="showMavenTips && showMavenInfo?.length && !$route.path.includes('report') && store.conf.ACCURACY_LIMITED_PROMPT === 'true'"
             class="tip g-f-14 g-fw-500 g-color-1 g-flex g-justify-between">
            <div>
                <i class="murphy icon-gantanhao g-vertical--1 g-mr-4" style="color: #FF9940;"></i>
                {{ mavenInfo[showMavenInfo[0].kind]?.shortDesc }}
            </div>
            <div class="g-cursor-pointer">
                <span @click="showMavenTipsModal = true" class="g-fw-400 g-color-5 g-mr-16">立即查看</span>
                <i @click="showMavenTips = false" class="murphy icon-cuo g-vertical--1"></i>
            </div>
        </div>

        <div class="top_info">
            <div class="left g-mr-24 g-flex-grow-1">
                <div class="name g-flex g-align-center">
                    <div class="max-w-[90%] ellipsis">{{ info.name }}</div>
                    <el-tooltip v-if="strategyList?.length" placement="top">
                        <template #content>
                            <div>命中项目策略：</div>
                            <div v-for="o in ((strategyList))" :key="o">
                                {{ o.name }}
                            </div>
                        </template>
                        <span class="status g-bdr-4 g-ml-8" style="padding: 4px;margin-left: 8px;">
                            <i class="murphy icon-a-hitthetarget" style="color: #F34D3D;font-size: 16px;"></i>
                        </span>
                    </el-tooltip>
                </div>

                <div class="g-color-3 g-fw-400 g-f-12 g-mb-8 g-flex g-align-center">
                    <div class="flex items-center flex-1">
                        <TagComp class="g-mr-4" v-for="item in projectTag.slice(0, 2)" :key="item.tag_name"
                                 :content="item.tag_name" />

                        <el-tooltip v-if="projectTag?.length > 2" placement="top" effect="light">
                            <template #content>
                                <div style="max-width: 330px;padding: 8px 6px">
                                    <div class="g-mb-8" v-for="o in projectTag" :key="o.tag_name">
                                        <TagComp :content="o.tag_name" />
                                    </div>
                                </div>
                            </template>
                            <TagComp :content="`+${projectTag?.length}`" />
                        </el-tooltip>

                        <el-divider v-if="projectTag?.length" direction="vertical" />
                        <span class="small">检测时间：{{ formatDate(info.created_at) }}</span>
                        <el-divider direction="vertical" />
                        <span class="small">检测耗时：{{ !isAdjustDetect ? `${detecttime}s` : '-' }}
                            <el-tooltip effect="light" v-if="!isAdjustDetect">
                                <template #content>
                                    <TimeConsume :status="info.status" :sid="$route.params.sid" />
                                </template>
                                <span class="hover_icon g-ml-6">
                                    <i class="murphy icon-consume g-cursor-pointer  g-vertical--2"></i>
                                </span>
                            </el-tooltip>
                        </span>

                        <el-divider direction="vertical" />
                        <span class="small">负责人：{{ info.created_user_nickname }}</span>

                        <el-divider v-if="info.principal" direction="vertical" />
                        <span v-if="info.principal" class="small">检测负责人：{{ info.principal || '-' }}</span>
                    </div>

                    <div @click="extraInfo=true" class="button-text-blue text-sm">更多信息</div>
                </div>

                <div class="infos">
                    <div class="g-flex g-align-center g-mb-16">
                        <div class="info-item">
                            <span class="small">语言</span>
                            <span>{{ info.langues || '未知' }}</span>
                        </div>
                        <div class="info-item">
                            <span class="small">检测模式</span>
                            <span>
                                {{ info.scan_mode ? configs.find((a: any) => a.num === info.scan_mode).name : '标准模式' }}

                                <el-tooltip placement="bottom" effect="light">
                                    <span class="hover_icon p-[4px]" style="display: inline-block;color: #858585;">
                                        <i class="murphy icon-open-detect g-vertical--1"></i>
                                    </span>
                                    <template #content>
                                        <div class="g-p-12 g-f-14" style="width: 380px;padding-bottom: 16px;">
                                            <div class="g-f-16 g-mb-16 g-fw-500 g-color-3">本次扫描配置项</div>

                                            <div v-if="info.scan_mode === 5">
                                                当前检测模式未设有相关配置项，故无扫描配置信息展示
                                            </div>

                                            <div v-if="info.scan_mode === 1 || info.scan_mode === 6" class="g-mb-16">
                                                <div class="g-mb-8 g-flex g-justify-between g-fw-500 g-color-1">
                                                    <div>编译/构建</div>
                                                    <div>{{ info.is_build === 1 ? '已启用' : '未启用' }}</div>
                                                </div>
                                                <div class="g-f-12 g-fw-400 g-color-3">扫描时会对 Maven
                                                    包管理器类型的项目进行模拟构建，检测结果更准确
                                                </div>
                                            </div>

                                            <div v-if="info.scan_mode === 1 || info.scan_mode === 6" class="g-mb-16">
                                                <div class="g-mb-8 g-flex g-justify-between g-fw-500 g-color-1">
                                                    <div>漏洞真实影响评估</div>
                                                    <div>{{ info.is_deep === 1 ? '已启用' : '未启用' }}</div>
                                                </div>
                                                <div class="g-f-12 g-fw-400 g-color-3">扫描时会深入分析漏洞是否会被真实触发</div>
                                            </div>

                                            <div v-if="store.conf?.add_code_similarity && (info.scan_mode === 1 || info.scan_mode === 6)"
                                                 class="g-mb-16">
                                                <div class="g-mb-8 g-flex g-justify-between g-fw-500 g-color-1">
                                                    <div>代码同源性分析</div>
                                                    <div>{{ info.is_autonomous === 1 ? '已启用' : '未启用' }}</div>
                                                </div>
                                                <div class="g-f-12 g-fw-400 g-color-3 g-mb-8">
                                                    扫描时会同步溯源代码片段，并识别项目中是否存在相似代码和抄袭代码的问题</div>
                                                <div v-if="info.is_autonomous === 1"
                                                     class="g-p-16 g-bg-f7 g-bdr-6 g-fw-400 g-color-1">
                                                    <div class="g-mb-16">开源项目最小相似文件数 {{ info.match_min_feature_file_num
                                                    }} 个
                                                    </div>
                                                    <div>检测项目代码最小相似比例 {{ info.match_min_ratio }} %</div>
                                                </div>
                                            </div>

                                            <div v-if="store.conf?.module_binary_analysis && (info.scan_mode === 1 || info.scan_mode === 3)"
                                                 class="g-mb-16">
                                                <div class="g-mb-8 g-flex g-justify-between g-fw-500 g-color-1">
                                                    <div>二进制同源性分析</div>
                                                    <div>{{ info.is_module_binary_analyze === 1 ? '已启用' : '未启用' }}</div>
                                                </div>
                                                <div class="g-f-12 g-fw-400 g-color-3">扫描时会同步对项目中的二进制文件进行同源性对比分析</div>
                                            </div>

                                            <div class="g-mb-16" v-if="info.scan_mode === 1 || info.scan_mode === 3">
                                                <div class="g-mb-8 g-flex g-justify-between g-fw-500 g-color-1">
                                                    <div>安卓制品深度扫描</div>
                                                    <div>{{ info.is_libloom === 1 ? '已启用' : '未启用' }}</div>
                                                </div>
                                                <div class="g-f-12 g-fw-400 g-color-3">针对安卓制品的扫描能力更强</div>
                                            </div>

                                            <div v-if="info.scan_mode === 4">
                                                <div class="g-mb-8 g-flex g-justify-between g-fw-500 g-color-1">
                                                    <div>固件深度扫描</div>
                                                    <div>{{ info.is_iot_deep === 1 ? '已启用' : '未启用' }}</div>
                                                </div>
                                                <div class="g-f-12 g-fw-400 g-color-3">扫描时会对固件内的文件进行识别和分析</div>
                                            </div>
                                        </div>
                                    </template>
                                </el-tooltip>
                            </span>
                        </div>

                        <div class="info-item" v-if="!store.isLic">
                            <span class="small">许可证策略</span>
                            <span>{{ info.detection_license_name || '未知' }}</span>
                        </div>

                        <div class="info-item" v-else>
                            <span class="small">分发场景</span>
                            <span>
                                {{ distributeOp.find((ele: any) => ele.value === info.project_distribution)?.label ||
                                    '外部' }}
                                <span v-if="!$route.fullPath.includes('share-report')" @click="distributeModal = true"
                                      class="hover_icon inline-block p-[3px]">
                                    <SvgIcon name="edit" color="#858585"
                                             style="width: 18px; height: 18px;vertical-align: -3px;" />
                                </span>
                            </span>
                        </div>

                        <el-tooltip :disabled="!info.detection_scope_name" :content="info.detection_scope_name"
                                    placement="top">
                            <div class="info-item" style="margin-right: 0;">
                                <span class="small">检测语言及目录范围</span>
                                <span>{{ info.detection_scope_name || '未知' }}</span>
                            </div>
                        </el-tooltip>
                    </div>

                    <div class="g-flex g-align-center">
                        <el-tooltip :disabled="!info.addr" placement="top">
                            <template #content>
                                <div class="max-w-[370px]">
                                    {{ info.addr }}
                                </div>
                            </template>
                            <div class="info-item" style="flex: 1;">
                                <span class="small">地址</span>
                                <span>{{ info.addr || '-' }}</span>
                            </div>
                        </el-tooltip>

                        <div class="flex flex-1 items-center w-0 mr-4">
                            <span class="text-xs text-[#8F959E] mr-1 min-w-[72px]">处置等级策略</span>
                            <span class="ellipsis">{{ info.detection_suggest_level_name || '默认策略' }}</span>
                            <span class="hover_icon ml-1" @click="showSuggestStrategy = true">
                                <SvgIcon class="align-[-3px]" name="suggest-stra" color="#858585"
                                         style="width: 16px; height: 16px" />
                            </span>
                        </div>

                        <div class="info-item">
                            <span class="small">分支</span>
                            <span>{{ info.branch || '-' }}</span>
                        </div>
                        <div class="info-item" style="margin-right: 0;">
                            <span class="small">Commit ID</span>
                            <span>
                                {{ info.commit?.slice(0, 6) || '-' }}
                                <span class="hover_icon inline-block py-1">
                                    <i v-if="info.commit" id="copy-commit" :data-clipboard-text="info.commit"
                                       @click="copyFunc('#copy-commit')"
                                       class="g-cursor-pointer murphy icon-fuzhi1"></i>
                                </span>
                            </span>
                        </div>
                    </div>

                    <div @click="isContainer = true" class="g-mt-12 g-color-5 g-cursor-pointer"
                         v-if="store.conf?.is_panji_open && !$route.path.includes('report') && (info.access_type === 'harbor' || info.access_type === 'jfrog')">
                        检测容器信息<i class="murphy icon-youjiantou11"></i>
                    </div>
                </div>
            </div>

            <div class="left" style="width: 264px;">
                <img v-if="!$systemConfig.isClose" style="width: 100%; margin-bottom: 16px;"
                     :src="`${origin}${info.badge_url}`" alt="">
                <!-- <img v-else style="width: 264px; margin-bottom: 16px;"
                    :src="`${origin}${info.badge_url}`" alt=""> -->

                <div style="margin-bottom: 16px; width: 100%">
                    <div style="margin-bottom: 10px;" class="g-color-3">项目安全分</div>
                    <el-progress color="#6C87FF" :percentage="info.source_score" style=" margin-bottom: 16px;">
                        <template #default>
                            <span style="color:#6C87FF">{{ info.source_score }}</span>
                        </template>
                    </el-progress>
                </div>

                <div class="g-flex" v-if="!$route.path.includes('report')">
                    <el-button @click="isShowCompiler = true" :disabled="isAdjustDetect"
                               :class="{ 'disabled': isAdjustDetect }" class="minor_btn" style="height: 32px;width: 80px;">
                        检测对比
                    </el-button>

                    <el-button class="minor_btn" v-if="!$systemConfig.isClose && !store.isAllTeam"
                               @click="store.isShowShareReportModal = true" style="height: 32px;width: 80px;">
                        分享
                    </el-button>

                    <el-popover width="auto" placement="bottom-end" :show-arrow="false" popper-class="tran">
                        <template #default>
                            <div>
                                <div @click="isShowexportConfig = true" class="export-btn g-f-16 g-color-1 g-mb-4">报告
                                </div>
                                <div @click="exportSbomModal = true" class="export-btn g-f-16 g-color-1 g-mb-4">SBOM清单
                                </div>
                                <div @click="exportHandle(12)" class="export-btn g-f-16 g-color-1 g-mb-4">Notice文件
                                </div>
                            </div>
                        </template>

                        <template #reference>
                            <el-button :disabled="isAdjustDetect" style="height: 32px;width: 80px;">
                                导出
                                <i class="murphy icon-arrow g-f-12 g-ml-4" style="transform: scale(.8);"></i>
                            </el-button>
                        </template>
                    </el-popover>
                </div>
            </div>
        </div>
        <div class="content">
            <div v-if="!isAdjustDetect">
                <div class="tab sticky top-[-24px]">
                    <span :class="{ 'active': tabActive === 7 }" @click="tabActive = 7">概览</span>
                    <span :class="{ 'active': tabActive === 1 }" @click="tabActive = 1">缺陷组件</span>
                    <span :class="{ 'active': tabActive === 2 }" @click="tabActive = 2">许可证风险</span>
                    <span :class="{ 'active': tabActive === 3 }" @click="tabActive = 3">SBOM清单</span>
                    <span :class="{ 'active': tabActive === 4 }" @click="tabActive = 4">漏洞列表</span>
                    <span :class="{ 'active': tabActive === 8 }" @click="tabActive = 8">风险文件</span>
                    <span v-if="store.conf?.add_code_similarity" :class="{ 'active': tabActive === 5 }"
                          @click="tabActive = 5">同源性分析</span>
                    <span v-if="store.conf?.is_sensitive" :class="{ 'active': tabActive === 6 }"
                          @click="tabActive = 6">敏感信息识别</span>
                </div>
                <OverviewInfo v-if="tabActive === 7" />
                <CompIndex v-if="tabActive === 1" />
                <LicenseIndex v-if="tabActive === 2" />
                <SbomFile v-if="tabActive === 3" />
                <VulnIndex v-if="tabActive === 4" />
                <CodeSnippet v-if="tabActive === 5 && store.conf?.add_code_similarity" />
                <SensitiveInfo v-if="tabActive === 6 && store.conf?.is_sensitive" />
                <FileRisk v-if="tabActive === 8" />
            </div>

            <AdjustDetectStatus v-else />
        </div>

        <ExtraInfo v-model="extraInfo" v-if="extraInfo" />

        <SbomExport v-model="exportSbomModal" v-if="exportSbomModal" />

        <ExportConfigModal v-model="isShowexportConfig" v-if="isShowexportConfig" :name="info.name" />

        <ComparsionIndex v-model="isShowCompiler" v-if="isShowCompiler" :info=info />

        <ContainerInfo v-model="isContainer" :info=info />

        <StrategyModal v-model="showStrategyModal" v-if="showStrategyModal" :list="strategyList" />

        <MavenInfo v-model="showMavenTipsModal" v-if="showMavenTipsModal" :info="showMavenInfo" />

        <DistributeModal v-model="distributeModal" v-if="distributeModal" @update="updateInfo"
                         :name="info.project_distribution" />

        <SuggestStrategy v-model="showSuggestStrategy" v-if="showSuggestStrategy"
                         :strategyName="info?.detection_suggest_level_rule_file_name" />
    </div>
</template>

<script setup lang='ts'>
import { onBeforeRouteLeave } from 'vue-router';
import { onBeforeMount, onUnmounted } from 'vue';
import {
    copyFunc,
} from 'util/tools';
import store from 'util/store';
import { ElMessageBox } from 'element-plus';
import { mavenInfo, distributeOp } from '../constants/constants';
import {
    isAdjustDetect, getAdjustDetect, timer, temporaryStorageComp,
} from '../business';
import { temporaryStorageUseComp } from './comp_use/business';
import { temporaryStorageSnip } from './snippet/business';
import { formatDate } from '@/utils/tools';
import { configs } from '../../detect/constants/constant';
import { useDetail, asyncComponents } from './composables/use-detail';
// import OverviewInfo from './OverviewInfo.vue';
import SbomExport from './components/SbomExport.vue';
import ExtraInfo from './components/ExtraInfo.vue';

const {
    route,
    info,
    tabActive,
    origin,
    isShowexportConfig,
    isShowCompiler,
    isContainer,
    showTip,
    showMavenTips,
    showMavenTipsModal,
    showMavenInfo,
    showStrategyModal,
    strategyList,
    detecttime,
    projectTag,
    distributeModal,
    exportSbomModal,
    extraInfo,
    showSuggestStrategy,
    exportHandle,
    updateInfo,
    fetchProjectTags,
    fetchStrategyInfo,
    fetchMavenInfo,
    fetchDetectTime,
} = useDetail();

const {
    CompIndex,
    TimeConsume,
    LicenseIndex,
    SbomFile,
    VulnIndex,
    CodeSnippet,
    ExportConfigModal,
    SensitiveInfo,
    ComparsionIndex,
    ContainerInfo,
    FileRisk,
    StrategyModal,
    MavenInfo,
    AdjustDetectStatus,
    DistributeModal,
    OverviewInfo,
    SuggestStrategy,
} = asyncComponents;

onBeforeMount(async () => {
    try {
        await Promise.all([
            getAdjustDetect(route.params.sid as string),
            updateInfo(),
            fetchProjectTags(),
            fetchStrategyInfo(),
            fetchMavenInfo(),
            fetchDetectTime(),
        ]);
    } catch (error) {
        console.error('初始化数据失败:', error);
    }
});

onBeforeRouteLeave((to, from, next) => {
    if (temporaryStorageComp.length > 0 || temporaryStorageSnip.length > 0 || temporaryStorageUseComp.length > 0) {
        ElMessageBox.confirm(
            '您还有待应用的校准，离开将不会保存',
            {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                cancelButtonClass: 'minor_white_btn h-7 w-auto',
                confirmButtonClass: 'main_btn h-7 w-auto',
                type: 'warning',
            },
        )
            .then(() => {
                next();
                temporaryStorageComp.length = 0;
                temporaryStorageSnip.length = 0;
                temporaryStorageUseComp.length = 0;
            });
    } else {
        next();
    }
});

onUnmounted(() => {
    isAdjustDetect.value = true;
    clearInterval(timer.value);
    timer.value = null;
});

</script>

<style lang='less' scoped>
.detect_detail {
    padding: 24px;
    box-sizing: border-box
}

.tip {
    padding: 8px 16px;
    border-radius: 6px;
    background-color: #FF994033;
    margin-bottom: 16px;
}

.top_info {
    background-color: #fff;
    padding: 24px;
    .between();
    margin-bottom: 16px;
    border-radius: 6px;

    .avatar {
        width: 20px;
        border-radius: 50%;
        vertical-align: -5px;
    }

    .name {
        font-weight: 500;
        font-size: 24px;
        color: #3c3c3c;
        margin-bottom: 8px;
        width: 100%;
        // max-width: 500px;
        .ellipsis();

        .status {
            &:hover {
                background: #f34d3d38
            }

            display: inline-block;
            padding: 5px 6px;
            font-size: 12px;
            border-radius: 4px;
            margin-left: 0;

            i {
                font-size: 18px;
                // vertical-align: -1px;
            }
        }
    }

    .infos {
        padding: 10px 16px;
        background: #F7F8FB;
        border-radius: 6px;
        font-size: 14px;
        color: #3c3c3c;
        // display: flex;
        // flex-wrap: wrap;
        // justify-content: flex-start;

        .info-item {
            // width: 23%;
            flex: 1;
            margin-right: 16px;
            .ellipsis();

            // display: flex;
            // align-items: center;
            // span:nth-of-type(2) {
            //     width: 50%;
            // }
        }

        .small {
            font-size: 12px;
            color: #8F959E;
            margin-right: 4px;
        }

        .user {
            display: inline-block;
            background-color: #EFF0F1;
            height: 20px;
            line-height: 20px;
            border-radius: 16px;
            padding-right: 6px;
            margin-right: 16px;
        }
    }

    // .bottom_info {
    //     font-size: 14px;
    //     color: #3c3c3c;

    //     span {
    //         margin-right: 16px;
    //     }
    // }

    .left {
        font-size: 12px;
        color: #F7F8FB;
    }

    .left:nth-of-type(1) {
        width: 800px
    }

    .disabled.minor_btn {
        border: 1px solid #C7C7C7 !important;
        background-color: #fff !important;
        color: #C7C7C7 !important;
    }
}

.mid_info {
    // .between();
    display: flex;
    width: 100%;
    margin-bottom: 16px;

    .left,
    .right {
        background: #FFFFFF;
        border-radius: 6px;
        color: @text-color;
        font-weight: 500;
        font-size: 14px;
        padding: 24px;
        box-sizing: border-box;
    }

    .left {
        // flex: 2;
        margin-right: 16px;
    }

    // .right {
    //     flex: 4;
    // }

    .top {
        // margin-bottom: 16px;

        span {
            margin-right: 16px;
        }

        span.dian {
            margin-right: 4px;
        }
    }

    .bottom {
        display: flex;
    }

    .dian {
        display: inline-block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        vertical-align: 2px;
        margin-right: 6px;
    }

    .progress_comp {
        margin-right: 32px;
        color: #858585;
        font-weight: 500;
        line-height: 30px;

        .small_text {
            font-size: 12px;
        }

        .name {
            font-size: 12px;
        }

        .num {
            font-size: 22px;
            font-weight: 600;
            color: @text-color;
        }
    }
}

.export-btn {
    &:hover {
        background-color: #EBEBEB;
    }

    &:focus {
        background-color: #EBEBEB;
    }

    width: 140px;
    font-size: 16px;
    border-radius: 6px;
    font-weight: 400;
    color: #3c3c3c;
    padding: 8px 16px;
    cursor: pointer;
}

.content {
    background-color: #fff;
    border-radius: 6px;
    padding: 16px;

    .tab {
        border-bottom: 1px solid #DEE0E3;
        margin-bottom: 16px;
        background-color: #fff;
        z-index: 999;
    }

    .tab span {
        display: inline-block;
        margin-right: 30px;
        color: #606C80;
        padding-bottom: 8px;
        // height: 56px;
        // line-height: 56px;
        cursor: pointer;
        border-bottom: 2px solid transparent;
    }

    .tab span.active {
        border-bottom-color: #5572F4;
        color: #5572F4;
    }
}
</style>
