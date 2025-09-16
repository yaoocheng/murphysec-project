<template>
    <div class="comp_index" v-loading="loading">
        <div class="filter_wrap">
            <SearchComp style="width: 240px;" v-model="searchData.keyword" clearable placeholder="请搜索组件名称" />
            <SelectComp style="width: 140px;" v-model="searchData.suggest" :options="suggestOptions" clearable
                        placeholder="处置等级" />
            <SelectComp style="width: 140px;" v-model="searchData.status" :options="getFixOptions($systemConfig.isGf)"
                        clearable placeholder="修复状态" />
            <SelectComp style="width: 140px;" v-model="searchData.rely" :options="relyOptions" clearable
                        placeholder="依赖类型" />
            <SelectComp style="width: 150px" class="mb-2" v-model="searchData.basis" :options="source_option" clearable
                        placeholder="组件识别准确性" />
            <el-checkbox style="margin-right: 10px;" v-model="searchData.triggers" label="可触发漏洞" />
            <el-checkbox style="margin-right: 10px;" v-model="searchData.online" label="线上依赖" />
            <el-checkbox style="margin-right: 10px;" v-model="searchData.projectStra" label="命中项目策略" />
            <el-checkbox style="margin-right: 10px;" v-model="searchData.poison" label="投毒组件" />
            <el-checkbox v-model="searchData.cavd" label="CAVD漏洞" />
            <el-button class="minor_btn" @click="resetHandle" style="height: 32px;width: 52px;margin-left: 16px;">
                重置
            </el-button>
            <el-button v-if="!$route.fullPath.includes('share-report')" class="minor_btn" @click="store.isShowFilterConfig = true"
                       style="height: 32px;width: auto;margin-left: 8px;">筛选配置</el-button>
        </div>

        <div class="g-color-3 g-fw-400 g-f-14 g-mb-12">
            共 <span class="g-color-1 g-fw-500">{{ curTotalData.length }}</span> 条数据
        </div>

        <div ref="infiniteWrapEl" style="max-height: 500px;overflow: auto">
            <div class="comp_item" v-for="(item, index) in listData" :key="index">
                <div class="left">
                    <div class="name">
                        <span class="text" @click="showIssueDetail = true; securityId = item.security_id">{{
                            item.comp_name }}</span>

                        <TagComp class="g-mr-4"
                                 v-if="item.repository !== 'unmanaged' && (item.ecosystem || item.repository)"
                                 :content="item.ecosystem" />

                        <span v-if="item.is_self">
                            <TagComp class="g-mr-4" content="自身依赖" />
                            <el-tooltip placement="top" effect="light">
                                <template #content>
                                    <TagComp :content="item.is_direct_dependency ? '直接依赖' : '间接依赖'" />
                                </template>
                                <TagComp class="g-mr-4" bgc="rgba(31, 35, 41, 0.10)" c="#1F2329" content="+1" />
                            </el-tooltip>
                        </span>
                        <TagComp class="g-mr-4" v-else :content="item.is_direct_dependency ? '直接依赖' : '间接依赖'" />

                        <TagComp class="g-mr-4" v-if="item.is_poc" :content="'POC'" />

                        <TagComp bgc="#14C0FF33" c="#049FD7" class="g-mr-4" v-if="item.has_cavd_id"
                                 :content="'CAVD漏洞'" />

                        <el-tooltip effect="light" placement="top">
                            <TagComp class="g-mr-4" :content="getRepaireLevelTool(item.suggest_level).text"
                                     :c="getRepaireLevelTool(item.suggest_level).color"
                                     :bgc="getRepaireLevelTool(item.suggest_level).bgc" />

                            <template #content>
                                <SuggestTips :text="getRepaireLevelTool(item.suggest_level).text" />
                            </template>
                        </el-tooltip>

                        <el-tooltip v-if="item.is_online" effect="light" placement="top">
                            <TagComp class="g-mr-4" content="线上依赖" />

                            <template #content>
                                <div style="color: #2A2B32;">
                                    什么是线上依赖？<a href="/docs/glossary/production-dependencies.html" target="_blank">详情</a>
                                </div>
                            </template>
                        </el-tooltip>

                        <el-tooltip v-if="item.detection_strategy_name && item.detection_strategy_name.length">
                            <TagComp class="g-mr-4" c="#049FD7" bgc="#14C0FF33"
                                     :content="item.detection_strategy_name[0]" />

                            <template #content>
                                <div v-for="ele in item.detection_strategy_name" :key="ele">
                                    {{ ele }}
                                </div>
                            </template>
                        </el-tooltip>

                        <el-tooltip v-if="item.evidence_accuracy === 'Inaccuracy'" placement="top" effect="light">
                            <template #content>
                                <div class="max-w-[344px] px-0 py-2">
                                    <span class="text-sm font-medium text-3c">
                                        该组件为模糊匹配，涉及内容为预测值，可前往「SBOM清单」“校准”组件以获取更准确结果
                                    </span>
                                </div>
                            </template>

                            <TagComp class="mr-1" content="模糊" c="#525252" bgc="#EBEBEB" />
                        </el-tooltip>

                        <TagComp v-if="item.evidence_accuracy === 'Accuracy'" class="mr-1" content="精准" c="#6425D0"
                                 bgc="#7F3BF533" />

                        <TagComp v-if="item.evidence_accuracy === 'Adjusted'" class="mr-1" content="校准" c="#B220B2"
                                 bgc="#D136D133" />

                        <el-tooltip v-if="item.project_detection_strategy_name?.length" placement="top">
                            <template #content>
                                <div>
                                    命中项目策略：
                                </div>
                                <div v-for="o in ((item.project_detection_strategy_name))" :key="o">
                                    {{ o }}
                                </div>
                            </template>
                            <span class="status stra-icon g-mr-4">
                                <i class="murphy icon-a-hitthetarget" style="color: #F34D3D;font-size: 16px;"></i>
                            </span>
                        </el-tooltip>

                        <TagComp class="g-mr-4" v-if="item.is_poison" content="投毒组件" />

                        <TagComp class="g-mr-4" bgc="#14C0FF33" c="#049FD7"
                                 v-if="item.set_suggest_level_type === 'defect'" content="标记为缺陷组件" />

                        <TagComp bgc="#14C0FF33" c="#049FD7" v-else-if="item.set_suggest_level_type === 'safe'"
                                 content="标记为安全组件" />

                    </div>
                    <div class="info">
                        <span class="info_item">
                            <span class="small">版本</span>
                            <span class="ellipsis" style="max-width: 200px;display: inline-block;vertical-align: -4px;">
                                {{ item.comp_version }}
                            </span>

                            <el-tooltip placement="right" v-if="item.the_chosen_version && item.comp_version">
                                <template #content>
                                    <div style="max-width: 344px;">
                                        此版本为推测值，由于检测时获取到的特征有限，识别可能存在偏差，暂时无法提供精确版本。
                                    </div>
                                </template>
                                <span class="hover_icon g-ml-4" style="display: inline-block;padding:4px 6px">
                                    <i class="murphy icon-wenhaoxiao g-f-14 g-color-1"></i>
                                </span>
                            </el-tooltip>

                        </span>
                        <span class="info_item">
                            <span class="small">最小修复版本</span>
                            {{ item.min_fixed_version ? item.min_fixed_version : '-' }}
                        </span>
                        <span class="info_item">
                            <span class="small">漏洞级别</span>
                            <span class="num">
                                <span :style="{'background-color': item.critical_num === 0 ? '#EBEBEB' : '#F34D3D', 'color': '#fff'}">C</span>
                                <span :style="{'background-color': item.critical_num === 0 ? '#C7C7C733' : 'rgba(245, 74, 69, 0.2)', 'color': item.critical_num === 0 ? '#C7C7C7' : '#F34D3D'}">{{
                                    item.critical_num
                                }}</span>
                            </span>
                            <span class="num">
                                <span :style="{'background-color': item.high_num === 0 ? '#EBEBEB' : '#FF9940', 'color': '#fff'}">H</span>
                                <span :style="{'background-color': item.high_num === 0 ? '#C7C7C733' : 'rgba(255, 153, 64, 0.2)', 'color': item.high_num === 0 ? '#C7C7C7' : '#FF9940'}">{{ item.high_num
                                }}</span>
                            </span>
                            <span class="num">
                                <span :style="{'background-color': item.medium_num === 0 ? '#EBEBEB' : '#FCBE03', 'color': '#fff'}">M</span>
                                <span :style="{'background-color': item.medium_num === 0 ? '#C7C7C733' : 'rgba(255, 204, 51, 0.2)', 'color': item.medium_num === 0 ? '#C7C7C7' : '#FCBE03'}">{{
                                    item.medium_num
                                }}</span>
                            </span>
                            <span class="num">
                                <span :style="{'background-color': item.low_num === 0 ? '#EBEBEB' : '#A7AECC', 'color': '#fff'}">L</span>
                                <span :style="{'background-color': item.low_num === 0 ? '#C7C7C733' : 'rgba(167, 174, 204, 0.2)', 'color': item.low_num === 0 ? '#C7C7C7' : '#A7AECC'}">{{ item.low_num
                                }}</span>
                            </span>
                        </span>
                        <span class="info_item">
                            <span class="small">负责人</span>
                            <!-- <span class="user"> -->
                            <UserComp :name="item.owner_user_name" />
                            <!-- </span> -->
                        </span>
                        <span class="info_item">
                            <span class="small">状态</span>
                            <span v-if="item.fix_status === 1">待修复</span>
                            <span v-if="item.fix_status === 2">已修复</span>
                            <span v-if="item.fix_status === 3">暂时忽略</span>
                            <span v-if="item.fix_status === 4">关闭</span>
                        </span>
                        <span class="info_item">
                            <span class="small">可触发漏洞</span>
                            {{ item.is_triggers ? '是' : '否' }}
                        </span>
                    </div>
                </div>
                <div>
                    <!-- <MinorBtn @click="realUseModal=true">触发路径</MinorBtn> -->
                    <el-button v-if="item.security_id && getUserInfo()"
                               @click="showIssueDetail = true; securityId = item.security_id">{{
                                   item.fix_status !== 1 ? '重新打开' : '快速修复'
                               }}</el-button>
                </div>
            </div>
        </div>

        <NoData v-if="!isHaveData" />

        <FilterConfig v-model="store.isShowFilterConfig" :filterConfig="filterConfig" />

    </div>

    <IssueDetailModal v-model="showIssueDetail" v-if="showIssueDetail" :securityId="securityId" />
</template>

<script setup lang='ts'>
import {
    watch,
} from 'vue';
import store from 'util/store';
import useList from 'util/hook';
import NoData from 'comp/NoData.vue';
import { useInfiniteScroll } from '@vueuse/core';
import { getRepaireLevelTool, getUserInfo } from 'util/tools';
import { getDetailCompListApi, getFilterConfigApi } from 'api/project';
import {
    getFixOptions, suggestOptions, relyOptions, source_option,
} from '../constants/constants';
import UserComp from '@/components/UserComp.vue';
import SearchComp from '@/components/SearchComp.vue';
import SelectComp from '@/components/SelectComp.vue';
import FilterConfig from '../../platform/FilterConfig.vue';
import IssueDetailModal from '@/control/platform/IssueDetailModal.vue';
import TagComp from '@/components/TagComp.vue';
import { useCompIndex } from './composables/use-comp';

const {
    showIssueDetail,
    securityId,
    filterOptions,
    filterConfig,
    searchData,
    infiniteWrapEl,
    curTotalData,
} = useCompIndex();

const {
    listData, initData, isHaveData, loading,
} = useList(getDetailCompListApi, filterOptions);

let count = 1;
// 懒加载
const infiniteHandle = (renderData: any, curTotal: any) => {
    renderData.value = curTotal.value.slice(0, 10);
    count = 1;
    useInfiniteScroll(
        infiniteWrapEl,
        () => {
            renderData.value.push(...curTotal.value.slice((count * 10), ((count + 1) * 10)));
            count++;
        },
    );
};

watch(initData, async (newVal: any[]) => {
    if (newVal.length) {
        curTotalData.value = [...initData.value];
        infiniteHandle(listData, curTotalData);

        // 获取筛选配置
        const { data } = await getFilterConfigApi();
        Object.assign(filterConfig, data);
        searchData.value.online = Boolean(data.is_online);
        searchData.value.triggers = Boolean(data.is_triggers);
        searchData.value.poison = Boolean(data.is_poison);
        searchData.value.projectStra = initData.value.some((item) => item.project_detection_strategy_name?.length);

        // eslint-disable-next-line no-use-before-define
        // filterHandle(searchData.value);
    }
});

// 筛选
const filterHandle = (newVal: any) => {
    let filterdata: Array<any> = [];

    // 搜索过滤
    filterdata = initData.value.filter((item: any) => item.comp_name.includes(newVal.keyword));

    // 处置等级
    if (newVal.suggest !== undefined && newVal.suggest !== '') {
        filterdata = filterdata.filter((item: any) => item.suggest_level === newVal.suggest);
    }

    // 修复状态
    if (newVal.status !== undefined && newVal.status !== '') {
        filterdata = filterdata.filter((item: any) => item.fix_status === newVal.status);
    }

    if (newVal.basis) {
        filterdata = filterdata.filter((item: any) => item.evidence_accuracy === newVal.basis);
    }

    // 触发漏洞
    if (newVal.triggers) {
        filterdata = filterdata.filter((item: any) => item.is_triggers);
    }

    // 线上依赖
    if (newVal.online) {
        filterdata = filterdata.filter((item: any) => item.is_online);
    }

    // 投毒
    if (newVal.poison) {
        filterdata = filterdata.filter((item: any) => item.is_poison);
    }

    if (newVal.cavd) {
        filterdata = filterdata.filter((item: any) => item.has_cavd_id);
    }

    // 依赖
    if (newVal.rely !== undefined && newVal.rely !== '') {
        if (newVal.rely === 1) {
            filterdata = filterdata.filter((item: any) => item.is_self === Boolean(newVal.rely));
        } else {
            filterdata = filterdata.filter((item: any) => item.is_direct_dependency === newVal.rely);
        }
    }

    // 项目策略
    if (newVal.projectStra) {
        filterdata = filterdata.filter((item: any) => item.project_detection_strategy_name?.length);
    }

    curTotalData.value = [...filterdata];
    infiniteHandle(listData, curTotalData);

    // listData.value = filterdata;
    isHaveData.value = listData.value.length > 0;
};

// 重置
const resetHandle = () => {
    Object.assign(searchData.value, {
        keyword: '',
        suggest: '',
        status: '',
        triggers: false,
        online: false,
        poison: false,
        rely: undefined,
        projectStra: false,
        basis: undefined,
        cavd: false,
    });

    filterHandle(searchData.value);
};

watch(searchData.value, (newVal: any) => {
    filterHandle(newVal);
});
</script>

<style lang='less' scoped>
.comp_index {
    .filter_wrap {
        margin-bottom: 16px;
        display: flex;
        flex-wrap: wrap;
    }

    .comp_item {
        height: 90px;
        border-radius: 4px;
        background: #F7F8FB;
        padding: 0 16px;
        font-size: 14px;
        color: #3c3c3c;
        margin-bottom: 10px;
        .between();

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

        .small {
            font-size: 12px;
            color: #8F959E;
            margin-right: 5px;
        }

        .avatar {
            width: 20px;
            border-radius: 50%;
            vertical-align: -5px;
        }

        .name {
            margin-bottom: 16px;

            .text {
                display: inline-block;
                margin-right: 8px;
            }

            .text:hover {
                color: #6c87ff;
                text-decoration: underline;
                cursor: pointer;
            }

            span.tag {
                padding: 3px 5px;
                background: rgba(73, 102, 230, 0.2);
                border-radius: 4px;
                color: #2946C7;
                font-size: 12px;
                // margin-right: 4px;
                display: inline-block;
                transform: scale(0.8);
            }
        }

        .info_item {
            margin-right: 16px;
        }

        .user {
            display: inline-block;
            background-color: #EFF0F1;
            height: 20px;
            line-height: 20px;
            border-radius: 16px;
            padding-right: 6px;
        }

        .num {
            display: inline-block;
            border-radius: 4px;
            margin-right: 15px;

            span {
                &:nth-of-type(1) {
                    border-top-left-radius: 2px;
                    border-bottom-left-radius: 2px;
                }

                &:nth-of-type(2) {
                    border-top-right-radius: 2px;
                    border-bottom-right-radius: 2px;
                    padding: 3px 6px;
                }

                display: inline-block;
                padding: 3px 5px;
            }
        }
    }

}
</style>
