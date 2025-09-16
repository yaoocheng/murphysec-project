<template>
    <el-dialog class="screen-dialog" width="100%">
        <div class="asset-result">
            <div class="g-flex g-justify-between g-mb-32">
                <div>
                    <div class="g-mb-8 g-f-24 g-color-1 g-fw-500">{{ taskInfo.name }}</div>
                    <div class="g-f-12 g-fw-400 g-color-3">创建时间：{{ formatDate(taskInfo.createTime) }}</div>
                </div>

                <div class="g-color-1 g-f-14 g-cursor-pointer">
                    <el-tooltip v-if="!isAllQueryData" placement="bottom-end" effect="light"
                                popper-class="user_tooltip">
                        <template #content>
                            <div class="g-p-24 g-f-14 g-color-1" style="width: 372px;">
                                <div class="g-flex g-justify-between g-mb-16">
                                    <div>
                                        <div class="inquire-title">组件名称</div>
                                        <div style="width: 170px;">{{ queryInput.asset_name || '全部' }}</div>
                                    </div>
                                    <div style="width: 174px;">
                                        <div class="inquire-title">接入方式</div>
                                        <div>{{ accessOptions.find(item => item.value === queryInput.access_type)?.label
                                            || '全部' }}</div>
                                    </div>
                                </div>
                                <div class="g-flex g-justify-between g-mb-16">
                                    <div>
                                        <div class="inquire-title">生态-仓库类型</div>
                                        <div>{{ queryInput.language || '全部' }}</div>
                                    </div>
                                    <div style="width: 174px;">
                                        <div class="inquire-title">处置等级</div>
                                        <div>{{ queryInput.suggest ? getRepaireLevelTool(queryInput.suggest).text : '全部'
                                        }}</div>
                                    </div>
                                </div>
                                <div class="g-flex g-justify-between g-mb-16">
                                    <div>
                                        <div class="inquire-title">投毒组件</div>
                                        <div v-if="queryInput.is_poison === true">是</div>
                                        <div v-else-if="queryInput.is_poison === false">否</div>
                                        <div v-else>全部</div>
                                    </div>
                                    <div style="width: 174px;">
                                        <div class="inquire-title">可触发漏洞</div>
                                        <div v-if="queryInput.is_triggers === 1">是</div>
                                        <div v-else-if="queryInput.is_triggers === 0">否</div>
                                        <div v-else>全部</div>
                                    </div>
                                </div>
                                <div class="g-mb-16">
                                    <div>
                                        <div class="inquire-title">线上依赖</div>
                                        <div v-if="queryInput.is_online === 1">是</div>
                                        <div v-else-if="queryInput.is_online === 0">否</div>
                                        <div v-else>全部</div>
                                    </div>
                                </div>
                                <div class="g-p-16 g-bdr-6 g-bg-f7">
                                    <div class="g-mb-16">
                                        <div class="inquire-title">项目名称</div>
                                        <div>{{ queryInput.project_name || '全部' }}</div>
                                    </div>
                                    <div class="g-mb-16">
                                        <div class="inquire-title">漏洞编号</div>
                                        <div>{{ queryInput.vul_id || '全部' }}</div>
                                    </div>
                                    <div>
                                        <div class="inquire-title">组件版本</div>
                                        <div v-if="queryInput.asset_list.some((item: any) => item.name)">
                                            <div class="g-mb-4" v-for="item in queryInput.asset_list" :key="item.name">
                                                {{ item.name }} / {{ item.min_version }} - {{ item.max_version }} </div>
                                        </div>
                                        <div v-else>
                                            全部
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <span class="hover_icon">
                            <i class="murphy icon-lujing2 g-f-14"></i>
                            查询条件
                        </span>
                    </el-tooltip>

                    <el-tooltip v-else placement="bottom" popper-class="user_tooltip" effect="light">
                        <template #content>
                            <div class="g-p-24 g-f-14 g-color-1">
                                全部数据
                            </div>
                        </template>
                        <span class="hover_icon">
                            <i class="murphy icon-lujing2 g-f-14"></i>
                            查询条件
                        </span>
                    </el-tooltip>
                </div>
            </div>

            <div class="g-mb-12 g-flex g-justify-between g-align-center">
                <div class="g-f-16 g-fw-500 g-color-1">查询结果</div>
                <el-button v-if="total" @click="exportHandle" style="width: 80px;">导出全部</el-button>
            </div>

            <div v-if="total" class="g-flex g-align-center g-justify-between g-color-3 g-fw-400 g-f-14 g-mb-16">
                <span>
                    共有 <span class="g-color-1">{{ totalProject }}</span> 条数据符合查询条件，涉及 <span class="g-color-1">{{
                        projectNum
                    }}</span> 个项目（列表最多展示1w数据，可导出查看全部数据）
                </span>
            </div>

            <div class="table_wrap">
                <el-table v-if="listData?.length" :data="listData"
                          :header-cell-style="{ padding: '14px 0', border: 'none', background: '#F7F8FB', color: '#8F959E', fontWeight: 500 }">

                    <el-table-column label="组件名称" min-width="528">
                        <template #default="scope">
                            <div>
                                <el-tooltip :content="scope.row.asset_name" placement="top">
                                    <div @click="compJump({name: scope.row?.asset_name,version: scope.row?.asset_version,
                                                           ecosystem: scope.row?.ecosystem, repository: scope.row?.repository})"
                                         style="max-width: 200px;vertical-align: middle;"
                                         class="g-display-inline-block ellipsis link_text g-mr-4">
                                        {{ scope.row.asset_name }}
                                    </div>
                                </el-tooltip>

                                <el-tooltip effect="light" placement="top">
                                    <TagComp class="g-mr-4" :content="getRepaireLevelTool(scope.row.suggest).text"
                                             :c="getRepaireLevelTool(scope.row.suggest).color"
                                             :bgc="getRepaireLevelTool(scope.row.suggest).bgc" />

                                    <template #content>
                                        <SuggestTips :text="getRepaireLevelTool(scope.row.suggest).text" />
                                    </template>
                                </el-tooltip>

                                <el-tooltip v-if="scope.row.is_triggers === 1" effect="light" placement="top">
                                    <TagComp class="g-mr-4" content="可触发漏洞" />

                                    <template #content>
                                        <div style="color: #2A2B32;">
                                            什么是可触发漏洞？<a href="/docs/glossary/vulnerability-reachability.html"
                                                        target="_blank">详情</a>
                                        </div>
                                    </template>
                                </el-tooltip>

                                <el-tooltip v-if="scope.row.is_online === 1" effect="light" placement="top">
                                    <TagComp class="g-mr-4" content="线上依赖" />

                                    <template #content>
                                        <div style="color: #2A2B32;">
                                            什么是线上依赖？<a href="/docs/glossary/production-dependencies.html"
                                                       target="_blank">详情</a>
                                        </div>
                                    </template>
                                </el-tooltip>

                                <TagComp class="g-mr-4" v-if="scope.row.is_poison" content="投毒组件" />

                                <el-tooltip
                                    v-if="scope.row.detection_strategy_name && scope.row.detection_strategy_name.length">
                                    <TagComp class="g-mr-4" :content="scope.row.detection_strategy_name[0]" />

                                    <template #content>
                                        <div v-for="ele in scope.row.detection_strategy_name" :key="ele">
                                            {{ ele }}
                                        </div>
                                    </template>
                                </el-tooltip>
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column label="版本" prop="asset_version" show-overflow-tooltip width="200">
                        <template #default="scope">
                            {{ scope.row.asset_version }}
                            <el-tooltip placement="top" v-if="scope.row.the_chosen_version && scope.row.asset_version">
                                <template #content>
                                    <div style="max-width: 344px;">
                                        此版本为推测值，由于检测时获取到的特征有限，识别可能存在偏差，暂时无法提供精确版本。
                                    </div>
                                </template>
                                <span class="hover_icon" style="display: inline-block; padding:1px 6px">
                                    <i class="murphy icon-wenhaoxiao g-f-14 g-color-1"></i>
                                </span>
                            </el-tooltip>

                        </template>
                    </el-table-column>

                    <el-table-column label="生态-仓库类型" prop="repo" width="140">
                        <template #default="scope">
                            {{ scope.row.ecosystem || '-' }}
                        </template>
                    </el-table-column>

                    <el-table-column label="许可证" prop="license_name" show-overflow-tooltip width="140" />

                    <el-table-column label="漏洞" width="260">
                        <template #default="scope">
                            <div class="comp">
                                <span class="num">
                                    <span :style="{'background-color': scope.row.critical_num === 0 ? '#EBEBEB' : '#F34D3D', 'color': '#fff'}">C</span>
                                    <span :style="{'background-color': scope.row.critical_num === 0 ? '#C7C7C733' : 'rgba(245, 74, 69, 0.2)', 'color': scope.row.critical_num === 0 ? '#C7C7C7' : '#F34D3D'}">{{ scope.row.critical_num }}</span>
                                </span>
                                <span class="num">
                                    <span :style="{'background-color': scope.row.high_num === 0 ? '#EBEBEB' : '#FF9940', 'color': '#fff'}">H</span>
                                    <span :style="{'background-color': scope.row.high_num === 0 ? '#C7C7C733' : 'rgba(255, 153, 64, 0.2)', 'color': scope.row.high_num === 0 ? '#C7C7C7' : '#FF9940'}">{{ scope.row.high_num }}</span>
                                </span>
                                <span class="num">
                                    <span :style="{'background-color': scope.row.medium_num === 0 ? '#EBEBEB' : '#FCBE03', 'color': '#fff'}">M</span>
                                    <span :style="{'background-color': scope.row.medium_num === 0 ? '#C7C7C733' : 'rgba(255, 204, 51, 0.2)', 'color': scope.row.medium_num === 0 ? '#C7C7C7' : '#FCBE03'}">{{ scope.row.medium_num }}</span>
                                </span>
                                <span class="num">
                                    <span :style="{'background-color': scope.row.low_num === 0 ? '#EBEBEB' : '#A7AECC', 'color': '#fff'}">L</span>
                                    <span :style="{'background-color': scope.row.low_num === 0 ? '#C7C7C733' : 'rgba(167, 174, 204, 0.2)', 'color': scope.row.low_num === 0 ? '#C7C7C7' : '#A7AECC'}">{{ scope.row.low_num }}</span>
                                </span>
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column v-if="store.isAllTeam" label="所属团队" width="140" prop="team_name"
                                     show-overflow-tooltip />

                    <el-table-column label="所属项目" show-overflow-tooltip width="192">
                        <template #default="scope">
                            <div class="project_name max-w-full ellipsis"
                                 @click="$router.push(`/detail/${scope.row.project_id}/${scope.row.subtask_id}`)">
                                <img v-if="scope.row.access_type" :src="getAccessImg(scope.row.access_type)" alt="">
                                {{ scope.row.project_name }}
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column label="分支" prop="branch" width="100" show-overflow-tooltip>
                        <template #default="scope">
                            {{ scope.row.branch || '默认分支' }}
                        </template>
                    </el-table-column>

                    <el-table-column label="操作" fixed="right" width="80">
                        <template #default="scope">
                            <span class="button-text-blue" @click="checkoutIssue(scope.row)">
                                <!-- <span class="g-color-5 g-cursor-pointer" @click="checkoutIssue(scope.row)"> -->
                                详情
                            </span>
                        </template>
                    </el-table-column>
                </el-table>

                <NoData style="margin-top: 56px;" v-else />
            </div>

            <!-- 分页 -->
            <PageComp v-if="total" v-model:currentPage="curPage" :total="total" :page-size="20" />
        </div>

        <IssueDetailModal v-model="showIssueDetail" v-if="showIssueDetail" :securityId="secID" />

        <IssueSafeDetailModal v-model="showSafeIssueDetail" v-if="showSafeIssueDetail" :info="safeInfo" />
    </el-dialog>
</template>

<script setup lang='ts'>
import {
    ref, onBeforeMount, watch,
} from 'vue';
import {
    getRepaireLevelTool, getAccessImg, showMessage,
    formatDate,
} from 'util/tools';
import store from 'util/store';
import { getSafeQuestionInfoApi } from 'api/project';
import {
    exportAssetsTaskApi, getTaskInfoApi, getAssetListApi,
} from 'api/asset';
import { compJump } from '@/utils/hook';
import PageComp from '@/components/PageComp.vue';
import NoData from '@/components/NoData.vue';
import { accessOptions } from './constants';
import IssueDetailModal from '../platform/IssueDetailModal.vue';
import IssueSafeDetailModal from '../platform/IssueSafeDetailModal.vue';

const { id } = defineProps(['id', 'taskInfo']);
const showIssueDetail = ref<boolean>(false);
const showSafeIssueDetail = ref<boolean>(false);
const secID = ref();
const safeInfo = ref({});

const projectNum = ref(0);
const totalProject = ref(0);
const queryInput = ref();
const isAllQueryData = ref(true);
const curPage = ref(1);

const initData = ref([]);
const listData = ref([]);
const total = ref(0);

onBeforeMount(async () => {
    try {
        const { data } = await getTaskInfoApi({ id });
        totalProject.value = data.total;
        projectNum.value = data.project_num;

        queryInput.value = JSON.parse(data.query_input?.input_string);
        const query = JSON.parse(data.query_input?.input_string);
        isAllQueryData.value = !query.asset_name && !query.language && query.suggest === undefined && !query.access_type && query.is_triggers === undefined
            && query.is_online === undefined && query.is_poison === undefined && !query.project_name && !query.vul_id && !query.asset_list?.some((item: any) => item.name);
    } catch (error) {
        console.log(error);
    }

    try {
        const { data } = await getAssetListApi({
            id,
        });
        total.value = data.total;
        initData.value = data.list || [];
        listData.value = data.list?.slice(0, 20) || [];
    } catch (error) {
        console.log(error);
    }
});

watch(curPage, (val: number) => {
    listData.value = initData.value.slice((val - 1) * 20, val * 20);
});

// 导出
const exportHandle = async () => {
    await exportAssetsTaskApi({ id });
    showMessage('正在导出中，请在导出管理查看', 'success');
};

const checkoutIssue = async (row: any) => {
    try {
        const { data } = await getSafeQuestionInfoApi({
            team_id: store.teamInfo?.team_id || undefined,
            ...row,
        });

        if (data.id === '0') {
            showSafeIssueDetail.value = true;
            safeInfo.value = data;
        } else {
            showIssueDetail.value = true;
            secID.value = data.id;
        }
    } catch (error) {
        console.log(error);
    }
};

</script>

<style scoped lang='less'>
.asset-result {
    // padding: 12px 56px;
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 16px;
    padding-top: 0;
    padding-bottom: 0;
    box-sizing: border-box;

    .table_wrap {
        background-color: #fff;
        border-radius: 6px;
        flex: 1;
        overflow: auto;

        :deep(.el-table .cell) {
            padding: 0 16px;
        }

        .project_name {
            &:hover {
                color: #6C87FF;
                text-decoration: underline;
            }

            color: #3c3c3c;
            padding: 10px 0;
            cursor: pointer;
        }
    }

    img {
        width: 20px;
        border-radius: 50%;
        vertical-align: -5px;
    }

    .tag {
        padding: 0 6px;
        background: #34C72433;
        border-radius: 4px;
        display: inline-block;
        font-size: 12px;
        color: #2EA121;
        font-weight: 500;
        transform: scale(0.8);
        height: 24px;
        line-height: 24px;
        margin-left: -3px;

        i {
            font-size: 12px;
            margin-right: 5px;
        }
    }

    .export {
        width: 80px;
        color: #fff;
    }

    .comp {
        display: flex;
        align-items: center;
        height: 24px;
    }

    .num {
        display: inline-block;
        border-radius: 4px;
        margin-right: 8px;
        height: 24px;

        span {
            &:nth-of-type(1) {
                border-top-left-radius: 2px;
                border-bottom-left-radius: 2px;
            }

            &:nth-of-type(2) {
                border-top-right-radius: 2px;
                border-bottom-right-radius: 2px;
                padding: 1px 6px;
            }

            display: inline-block;
            padding: 1px 5px;
        }
    }

    .member {
        border-radius: 20px;
        background-color: #EFF0F1;
        display: inline-block;
        padding-right: 4px;
        height: 24px;
        font-weight: 500;
        color: @text-color;

        img {
            width: 20px;
            border-radius: 50%;
            margin: 2px 0;
            margin-left: 2px;
            vertical-align: middle;
        }
    }
}

.inquire-title {
    font-weight: 500;
    font-size: 14px;
    color: #8F959E;
    margin-bottom: 4px
}
</style>
