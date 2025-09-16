<template>
    <div class="wrap h-full">
        <div v-if="activeTab === 0">
            <div class="task-wrap">
                当前任务
                <div class="th g-mt-8">
                    <div v-for="item in thName" :key="item">{{ item }}</div>
                </div>
                <div class="td">
                    <div style="width: 14%">{{ compareData?.f_task?.branch || '-' }}</div>
                    <div style="width: 17%">{{ compareData?.f_task?.scan_mode }}</div>
                    <div style="width: 16%">{{ compareData?.f_task?.comp_num }}</div>
                    <div style="width: 16.5%">{{ compareData?.f_task?.vuln_num }}</div>
                    <div style="width: 15%">{{ compareData?.f_task?.leak_comp_num }}</div>
                    <div style="width: 18%">
                        <el-tooltip placement="top" content="强烈建议修复">
                            <span class="tag">{{ compareData?.f_task?.strong_recommend_num }}</span>
                        </el-tooltip>
                        <el-tooltip placement="top" content="建议修复">
                            <span class="tag">{{ compareData?.f_task?.recommend_num }}</span>
                        </el-tooltip>
                        <el-tooltip placement="top" content="可选修复">
                            <span class="tag">{{ compareData?.f_task?.optional_num }}</span>
                        </el-tooltip>
                    </div>
                    <div>{{ Math.round(compareData?.f_task?.autonomous_rate * 100) }}</div>
                </div>
            </div>

            <div class="task-wrap">
                对比任务
                <div class="th g-mt-8">
                    <div v-for="item in thName" :key="item">{{ item }}</div>
                </div>
                <div class="td">
                    <div style="width: 14%">{{ compareData?.s_task?.branch || '-' }}</div>
                    <div style="width: 17%">{{ compareData?.s_task?.scan_mode }}</div>
                    <div style="width: 16%">{{ compareData?.s_task?.comp_num }}</div>
                    <div style="width: 16.5%">{{ compareData?.s_task?.vuln_num }}</div>
                    <div style="width: 15%">{{ compareData?.s_task?.leak_comp_num }}</div>
                    <div style="width: 18%">
                        <el-tooltip placement="top" content="强烈建议修复">
                            <span class="tag">{{ compareData?.s_task?.strong_recommend_num }}</span>
                        </el-tooltip>
                        <el-tooltip placement="top" content="建议修复">
                            <span class="tag">{{ compareData?.s_task?.recommend_num }}</span>
                        </el-tooltip>
                        <el-tooltip placement="top" content="可选修复">
                            <span class="tag">{{ compareData?.s_task?.optional_num }}</span>
                        </el-tooltip>
                    </div>
                    <div>{{ Math.round(compareData?.s_task?.autonomous_rate * 100) }}</div>
                </div>
            </div>
        </div>

        <div class="comparison-content" v-else-if="activeTab === 1">
            <div class="new-add">
                <div class="head">新增 {{ compareData?.add_risk_comp?.length }}</div>
                <div class="content">
                    <div class="item" v-for="item in compareData?.add_risk_comp" :key="item.comp_name">
                        <div class="flex items-center">
                            <el-tooltip :content="item.comp_name" placement="top">
                                <span class="max-w-[150px] inline-block ellipsis" style="">{{ item.comp_name }}</span>
                            </el-tooltip>
                            <span class="tag"
                                :style="{ background: getRepaireLevelTool(item.suggest).bgc, color: getRepaireLevelTool(item.suggest).color }">{{
                                    getRepaireLevelTool(item.suggest).text }}</span>
                        </div>
                        <div>
                            {{ item.comp_version }}
                        </div>
                    </div>
                    <NoData class="mt-32" description="暂无新增缺陷组件" v-if="!compareData?.add_risk_comp?.length" />
                </div>
            </div>
            <div class="new-descrese">
                <div class="head">减少 {{ compareData?.remove_risk_comp?.length }}</div>
                <div class="content">
                    <div class="item" v-for="item in compareData?.remove_risk_comp" :key="item.comp_name">
                        <div class="flex items-center">
                            <el-tooltip :content="item.comp_name" placement="top">
                                <span class="max-w-[150px] inline-block ellipsis" style="">{{ item.comp_name }}</span>
                            </el-tooltip>
                            <span class="tag"
                                :style="{ background: getRepaireLevelTool(item.suggest).bgc, color: getRepaireLevelTool(item.suggest).color }">{{
                                    getRepaireLevelTool(item.suggest).text }}</span>
                        </div>
                        <div>
                            {{ item.comp_version }}
                        </div>
                    </div>
                    <NoData class="mt-32" description="暂无减少缺陷组件" v-if="!compareData?.remove_risk_comp?.length" />
                </div>
            </div>
        </div>

        <div class="comparison-content" v-else-if="activeTab === 2">
            <div class="new-add">
                <div class="head">新增 {{ compareData?.add_license?.length }}</div>
                <div class="content">
                    <div class="item" v-for="item in compareData?.add_license" :key="item.spdx">
                        <div>
                            {{ item.spdx }} <span class="tag"
                                :style="{ background: getDangerLevel(item.level).bgc, color: getDangerLevel(item.level).color }">{{
                                    getDangerLevel(item.level).text }}</span>
                        </div>
                    </div>
                    <NoData class="mt-32" description="暂无新增许可证" v-if="!compareData?.add_license?.length" />
                </div>
            </div>
            <div class="new-descrese">
                <div class="head">减少 {{ compareData?.remove_license?.length }}</div>
                <div class="content">
                    <div class="item" v-for="item in compareData?.remove_license" :key="item.spdx">
                        <div>
                            {{ item.spdx }} <span class="tag"
                                :style="{ background: getDangerLevel(item.level).bgc, color: getDangerLevel(item.level).color }">{{
                                    getDangerLevel(item.level).text }}</span>
                        </div>
                    </div>
                    <NoData class="mt-32" description="暂无减少许可证" v-if="!compareData?.remove_license?.length" />

                </div>
            </div>
        </div>

        <div class="comparison-content" v-else-if="activeTab === 3">
            <div class="new-add">
                <div class="head">新增 {{ compareData?.add_sbom?.length }}</div>
                <div class="content">
                    <div class="item" v-for="item in compareData?.add_sbom" :key="item.comp_name">
                        <div class="flex items-center">
                            <el-tooltip :content="item.comp_name" placement="top">
                                <span class="max-w-[150px] inline-block ellipsis" style="">{{ item.comp_name }}</span>
                            </el-tooltip>
                            <span class="tag"
                                :style="{ background: getRepaireLevelTool(item.suggest).bgc, color: getRepaireLevelTool(item.suggest).color }">{{
                                    getRepaireLevelTool(item.suggest).text }}</span>
                            <span class="fund-tag" v-if="item.ecosystem">{{ item.ecosystem }}</span>
                            <span class="fund-tag" v-for="ele in item.licenses?.slice(0,4)" :key="ele">{{ ele }}</span>
                        </div>
                        <div>
                            {{ item.comp_version }}
                        </div>
                    </div>
                    <NoData class="mt-32" description="暂无新增组件" v-if="!compareData?.add_sbom?.length" />
                </div>
            </div>
            <div class="new-descrese">
                <div class="head">减少 {{ compareData?.remove_sbom?.length }}</div>
                <div class="content">
                    <div class="item" v-for="item in compareData?.remove_sbom" :key="item.comp_name">
                        <div class="flex items-center">
                            <el-tooltip :content="item.comp_name" placement="top">
                                <span class="max-w-[150px] inline-block ellipsis" style="">{{ item.comp_name }}</span>
                            </el-tooltip>
                            <span class="tag"
                                :style="{ background: getRepaireLevelTool(item.suggest).bgc, color: getRepaireLevelTool(item.suggest).color }">{{
                                    getRepaireLevelTool(item.suggest).text }}</span>
                            <span class="fund-tag">{{ item.ecosystem }}</span>
                            <span class="fund-tag" v-for="ele in item.licenses?.slice(0, 4)" :key="ele">{{ ele }}</span>
                        </div>
                        <div>
                            {{ item.comp_version }}
                        </div>
                    </div>
                    <NoData class="mt-32" description="暂无减少组件" v-if="!compareData?.remove_sbom?.length" />
                </div>
            </div>
        </div>

        <div class="comparison-content" v-else-if="activeTab === 4">
            <div class="new-add">
                <div class="head">新增 {{ compareData?.add_vuln?.length }}</div>
                <div class="content">
                    <div class="item" :style="{ borderLeft: `4px solid ${getDangerLevel(item.level).color}` }"
                        v-for="item in compareData?.add_vuln" :key="item.title">
                        <div>
                            {{ item.title }}
                        </div>
                        <div>{{ item.cve_id || item.mps_id }}</div>
                    </div>
                    <NoData class="mt-32" description="暂无新增漏洞" v-if="!compareData?.add_vuln?.length" />
                </div>
            </div>
            <div class="new-descrese">
                <div class="head">减少 {{ compareData?.remove_vuln?.length }}</div>
                <div class="content">
                    <div class="item" :style="{ borderLeft: `4px solid ${getDangerLevel(item.level).color}` }"
                        v-for="item in compareData?.remove_vuln" :key="item.title">
                        <div>
                            {{ item.title }}
                        </div>
                        <div>{{ item.cve_id || item.mps_id }}</div>
                    </div>
                    <NoData class="mt-32" description="暂无减少漏洞" v-if="!compareData?.remove_vuln?.length" />
                </div>
            </div>
        </div>

        <div class="comparison-content" v-else-if="activeTab === 5">
            <TreeDiff />
        </div>
    </div>
</template>

<script setup lang='ts'>
import { getRepaireLevelTool, getDangerLevel } from 'util/tools';
import NoData from 'comp/NoData.vue';
import TreeDiff from './TreeDiff.vue';
import { activeTab, compareData } from './data';

const thName = ['分支', '检测模式', '组件总数 ', '漏洞总数', '缺陷组件', '处置等级', '自主代码率'];
</script>

<style lang='less' scoped>
.wrap {
    // max-width: 1330px;
    // margin: 0 auto;
    // padding-top: 24px;
    padding-top: 24px;
    padding-bottom: 24px;
    // height: calc(100% - 134px);
    box-sizing: border-box;
}

.task-wrap {
    padding: 16px;
    background-color: #fff;
    border-radius: 6px;
    margin-bottom: 16px;

    .th {
        background: rgba(235, 235, 235, 0.50);
        display: flex;
        justify-content: space-between;
        color: #858585;
        padding: 8px 24px;
        border-radius: 4px;
    }

    .td {
        display: flex;
        padding: 0 24px;
        padding-top: 16px;

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
}

.comparison-content {
    display: flex;
    height: 100%;
    box-sizing: border-box;

    .new-add,
    .new-descrese {
        width: 50%;
        height: 100%;
        box-sizing: border-box;
        // overflow: auto;

        .content {
            padding: 16px;
            height: calc(100% - 38px);
            overflow: auto;
            box-sizing: border-box;
        }

        .fund-tag {
            padding: 3px 5px;
            border-radius: 4px;
            background-color: #4966E633;
            color: #2946C7;
            font-size: 12px;
            display: inline-block;
            transform: scale(.8);
        }

        .item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 50px;
            padding: 12px;
            box-sizing: border-box;
            border-radius: 6px;
            border: 1px solid var(--005, #EBEBEB);
            background: #FFF;
            box-shadow: 0px 8px 24px 0px rgba(31, 35, 41, 0.04), 0px 6px 12px -10px rgba(31, 35, 41, 0.06);
            margin-bottom: 12px;

            span.tag {
                padding: 3px 5px;
                border-radius: 4px;
                background-color: #F54A4533;
                color: #D83931;
                font-size: 12px;
                display: inline-block;
                transform: scale(.8);
            }
        }
    }

    .new-add {
        margin-right: 24px;
        border-radius: 6px;
        border: 1px solid rgba(56, 199, 40, 0.50);
        background: #FFF;
        box-shadow: 0px 8px 24px 0px rgba(42, 148, 30, 0.10);

        .head {
            background-color: #38C72880;
            color: #227A18;
            text-align: center;
            padding: 8px 0;
            font-size: 16px;
        }
    }

    .new-descrese {
        border-radius: 6px;
        border: 1px solid rgba(243, 77, 61, 0.50);
        background: #FFF;
        box-shadow: 0px 8px 24px 0px rgba(191, 61, 48, 0.10);

        .head {
            background-color: #F34D3D80;
            color: #A6352A;
            text-align: center;
            padding: 8px 0;
            font-size: 16px;
        }
    }
}
</style>
