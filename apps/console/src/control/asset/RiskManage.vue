<template>
    <CommonHead>
        <span>风险管理</span>
    </CommonHead>

    <div class="risk_index main_content">
        <div class="g-color-1 g-f-16 g-fw-500 g-mb-8">查询条件</div>
        <div class="g-color-3 g-f-12 g-fw-400 g-mb-16">未设置任何条件直接查询，将默认查询全部组件</div>

        <div class="g-p-24 g-bdr-6 g-bg-ff g-f-14 g-fw-400 g-mb-24">
            <div class="filter_wrap">
                <SearchComp style="width: 200px;" clearable v-model="filterOptions.vul_id"
                            placeholder="请输入完整的项目名称/漏洞编号" />
                <SearchComp style="width: 200px;" v-model="filterOptions.ext" clearable placeholder="搜索更多信息" />

                <el-select v-if="store.isAllTeam" filterable style="margin-right: 8px; width: 130px;"
                           v-model="filterOptions.filter_team_id" placeholder="请选择团队">
                    <el-option v-for="item in store.teamList" :key="item.id" :label="item.team_name" :value="item.id" />
                </el-select>
                <SelectComp style="width: 140px;" clearable v-model="filterOptions.language" :options="langOptions"
                            placeholder="生态-仓库类型" />
                <SelectComp style="width: 140px;" v-model="filterOptions.suggest" :options="repairOptions"
                            placeholder="处置等级" />
                <SelectComp style="width: 140px;" v-model="filterOptions.level" :options="levelOption"
                            placeholder="漏洞级别" />
                <CheckboxComp style="width: 140px;" v-model="filterOptions.query_vuln_tag" :options="vulnTags"
                              placeholder="漏洞标签" />
                <SelectComp style="width: 140px;" v-model="filterOptions.is_triggers" :options="triggerOptions"
                            placeholder="可触发漏洞" />
                <SelectComp style="width: 140px;" v-model="filterOptions.is_online" :options="onlineOptions"
                            placeholder="线上依赖" />
            </div>

            <div>
                <el-button @click="resetHandle" class="minor_btn g-mr-8"
                           style="height: 32px; width: 80px">重置</el-button>
                <el-button @click="createTaskHandle" :disabled="disabled" class="main_btn"
                           style="margin-left: 0;">查询</el-button>
            </div>
        </div>

        <div class="g-color-1 g-f-16 g-fw-500 g-mb-16">
            我的查询任务
            <TipsComp content="仅保留最近7天的查询任务" placement="right" />
        </div>

        <div class="g-bdr-6 g-p-16 g-bg-ff g-color-1 risk-content">
            <div class="g-mt-40 g-ta-c g-mb-40" v-if="newQueryData?.id === '0'">
                <NoData description="暂无我的查询任务" :image-size="120" />
                <p class="no-data-desc" style="margin-bottom: 0;">可通过设置<span
                    class="g-fw-500">「查询条件」</span>进行查询，查看风险最新的数据</p>
                <el-button class="minor_white_btn g-mt-24" @click="queryModal = true">历史查询</el-button>
            </div>

            <div class="g-ta-c g-mt-40 g-mb-40" v-else-if="newQueryData?.status === 1">
                <div class="loaders g-mb-24"></div>
                <div class="g-f-24 g-fw-500 g-mb-18">正在查询中，请耐心等待…</div>
                <div class="g-color-3 g-fw-400 g-f-14 g-mb-8 g-flex g-align-center g-justify-center">
                    任务名称（最新）：{{ newQueryData.project_name }}
                    <span class="hover_icon g-ml-8" @click="changeNameDialog = true">
                        <i class="murphy icon-bianji g-cursor-pointer g-color-1 g-fw-500"></i>
                    </span>
                </div>
                <div class="g-color-3 g-fw-400 g-f-14 g-mb-24">
                    查询时间：{{ formatDate(newQueryData?.created_at) }}
                </div>
                <div>
                    <el-button class="minor_white_btn" @click="cancleQuery(newQueryData?.id)">取消</el-button>
                    <!-- <el-button class="minor_white_btn" @click="getNewItemHandle();">刷新</el-button> -->
                    <el-button class="minor_white_btn" @click="queryModal = true">历史查询</el-button>
                </div>
            </div>

            <div class="g-ta-c g-mt-40 g-mb-40" v-else-if="newQueryData?.status === 2">
                <div class="g-f-16 g-color-1 g-fw-500 g-mb-8 g-flex g-align-center g-justify-center">
                    任务名称（最新）：{{ newQueryData?.project_name }}
                    <span class="hover_icon g-ml-4" style="padding: 3px 5px" @click="changeNameDialog = true">
                        <i class="murphy icon-bianji g-cursor-pointer g-color-1 g-fw-500"></i>
                    </span>
                    <el-tooltip v-if="!isAllQueryData" placement="right" effect="light" popper-class="user_tooltip">
                        <template #content>
                            <div class="g-p-24 g-f-14 g-color-1" style="width: 372px;">
                                <div class="g-mb-16">
                                    <div class="inquire-title">项目名称/漏洞编号</div>
                                    <div>{{ queryInput.vul_id || '全部' }}</div>
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
                                        <div class="inquire-title">漏洞级别</div>
                                        <div>{{ queryInput.level ? getDangerLevel(queryInput.level).text : '全部' }}</div>
                                    </div>
                                    <div style="width: 174px;">
                                        <div class="inquire-title">漏洞标签</div>
                                        <div v-if="queryInput.query_vuln_tag?.length">
                                            <span v-for="item in queryInput.query_vuln_tag" :key="item">
                                                {{ vulnTags.find(ele => ele.value === item)?.label }}
                                            </span>
                                        </div>
                                        <div v-else>
                                            全部
                                        </div>
                                    </div>
                                </div>
                                <div class="g-flex g-justify-between">
                                    <div>
                                        <div class="inquire-title">可触发漏洞</div>
                                        <div v-if="queryInput.is_triggers === 1">是</div>
                                        <div v-else-if="queryInput.is_triggers === 0">否</div>
                                        <div v-else>全部</div>
                                    </div>
                                    <div style="width: 174px;">
                                        <div class="inquire-title">线上依赖</div>
                                        <div v-if="queryInput.is_online === 1">是</div>
                                        <div v-else-if="queryInput.is_online === 0">否</div>
                                        <div v-else>全部</div>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <span class="hover_btn1 g-ml-12" style="padding: 4px 6px;">
                            <span class="g-f-14 g-fw-400 g-color-5 g-cursor-pointer">查询条件</span>
                        </span>
                    </el-tooltip>

                    <el-tooltip v-else placement="right" popper-class="user_tooltip" effect="light">
                        <template #content>
                            <div class="g-p-24 g-f-14 g-color-1">
                                全部数据
                            </div>
                        </template>
                        <span class="hover_btn1 g-ml-12" style="padding: 4px 6px;">
                            <span class="g-f-14 g-fw-400 g-color-5 g-cursor-pointer">查询条件</span>
                        </span>
                    </el-tooltip>
                </div>
                <div class="g-f-14 g-color-3 g-fw-400 g-mb-8">
                    共有 {{ totalProject }} 条数据符合查询条件，涉及 {{ projectNum }} 个项目
                </div>
                <div class="g-color-3 g-fw-400 g-f-14 g-mb-24">
                    查询时间：{{ formatDate(newQueryData?.created_at) }}
                </div>
                <div>
                    <el-button @click="queryModal = true" class="minor_white_btn">历史查询</el-button>
                    <el-button
                        @click="showRelustModal = true; taskInfoId = newQueryData.id; taskInfo.name = newQueryData.project_name; taskInfo.createTime = newQueryData.created_at">查看结果</el-button>
                </div>
            </div>

            <div class="g-ta-c g-mt-40 g-mb-40" v-else-if="newQueryData?.status === 3">
                <i class="murphy icon-cuowu1 g-color-err g-f-32"></i>
                <div class="g-color-1 g-f-24 g-fw-500 g-mb-16 g-mt-24">查询失败，请重新查询</div>
                <div class="g-f-14 g-color-3 g-fw-400 g-mb-8">任务名称（最新）：{{ newQueryData?.project_name }}</div>
                <div class="g-color-3 g-fw-400 g-f-14 g-mb-24">
                    查询时间：{{ formatDate(newQueryData?.created_at) }}
                </div>
                <el-button @click="queryModal = true" class="minor_white_btn">历史查询</el-button>
            </div>
        </div>
    </div>

    <!-- 改名 -->
    <el-dialog v-model="changeNameDialog" @open="changeName = newQueryData?.project_name;" title="编辑任务名称" width="420">
        <el-input v-model="changeName" maxlength="30" show-word-limit placeholder="请输入任务名称"></el-input>
        <template #footer>
            <div>
                <el-button class="minor_white_btn" @click="changeNameDialog = false">取消</el-button>
                <el-button style="width: 80px;" @click="editnameHandle(changeName, newQueryData?.id)">
                    确认
                </el-button>
            </div>
        </template>
    </el-dialog>

    <!-- 查询结果 -->
    <el-dialog v-model="queryModal" @open="getData()" width="840px">
        <template #header>
            <div class="g-f-16 g-fw-500 g-mb-8">
                历史查询
            </div>
            <div class="g-color-3 g-f-14 g-fw-400 g-fw-400">
                仅保留最近7天的查询任务
            </div>
        </template>

        <div style="margin-top: -12px;">
            <div class="g-flex g-justify-between g-align-center">
                <div class="g-color-3 g-f-14">共 <span class="g-color-1">{{ total }}</span> 条数据</div>
                <div class="g-flex g-align-center">
                    <el-checkbox v-model="taskFilterInfo.is_only_mine" label="仅展示我的查询" size="large" />
                    <!-- <span @click="getData()" class="hover_icon g-ml-16" style="padding: 2px 4px;"> -->
                    <span @click="getData()" class="button-text-blue">
                        <i class="murphy icon-shuaxin1 g-vertical--1"></i>
                        刷新
                    </span>
                </div>
            </div>

            <TableComp :data="listData" height="400">
                <el-table-column prop="project_name" label="任务名称" width="260" show-overflow-tooltip>
                    <template #default="scope">
                        <div class="g-cursor-pointer project_name">
                            <div v-if="changenameId !== scope.row.id" @click="editName(scope.row.id)"
                                 class="chang-name">
                                {{ scope.row.project_name }}
                            </div>
                            <el-input ref="inpRef" v-else maxlength="30" show-word-limit
                                      @change="saveName(scope.row.id, scope.row.project_name)" @blur="changenameId = ''"
                                      style="width: 240px;" v-model="scope.row.project_name"></el-input>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column width="200" label="查询时间">
                    <template #default="scope">
                        <div>
                            {{ formatDate(scope.row.created_at) }}
                        </div>
                    </template>
                </el-table-column>

                <el-table-column prop="user_name" label="查询人">
                    <template #default="scope">
                        <UserComp :name="scope.row.user_name" />
                    </template>
                </el-table-column>

                <el-table-column prop="status" label="任务状态">
                    <template #default="scope">
                        <span v-if="scope.row.status === 1" class="status" style="color: #FF9940;">
                            查询中...
                        </span>
                        <span v-if="scope.row.status === 2" class="status" style="color: #38C728;">
                            已完成
                        </span>
                        <span v-if="scope.row.status === 3" class="status" style="color: #F34D3D;">
                            已失败
                        </span>
                        <span v-if="scope.row.status === -1" class="status" style="color: #646A73;">
                            已取消
                        </span>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="140">
                    <template #default="scope">
                        <el-popconfirm v-if="scope.row.status === 1" popper-class="cancle-popper confirm-popper"
                                       :width="180" @confirm="cancleQuery(scope.row.id)" title="确定取消当前任务?">
                            <template #reference>
                                <span class="g-color-5 g-mr-8 g-cursor-pointer">
                                    取消查询
                                </span>
                            </template>
                        </el-popconfirm>

                        <span v-if="scope.row.status === 2"
                              @click="showRelustModal = true; taskInfoId = scope.row.id; taskInfo.name = scope.row.project_name; taskInfo.createTime = scope.row.created_at"
                              class="g-color-5 g-mr-8 g-cursor-pointer">
                            查询结果
                        </span>

                        <el-popconfirm popper-class="cancle-popper confirm-popper" :width="180"
                                       @confirm="deleteExportHandle(scope.row.id)" title="确定删除当前任务?">
                            <template #reference>
                                <span class="g-color-err g-cursor-pointer">删除</span>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </TableComp>

            <PageComp v-model:currentPage="curPage" :total="total" :page-size="20" />
        </div>
    </el-dialog>

    <RiskResultModal v-model="showRelustModal" v-if="showRelustModal" :id="taskInfoId" :taskInfo="taskInfo" />
</template>

<script setup lang='ts'>
import { ref, nextTick, onUnmounted } from 'vue';
import store from 'util/store';
import {
    showMessage, formatDate, getRepaireLevelTool, getDangerLevel,
} from 'util/tools';
import SearchComp from 'comp/SearchComp.vue';
import SelectComp from 'comp/SelectComp.vue';
import PageComp from 'comp/PageComp.vue';
import {
    getNewItemApi, getAssetsTaskApi, deleteExportApi, createRiskTaskApi, getRiskTaskInfoApi, reNameApi, cancelQueryApi,
} from 'api/asset';
import useList from 'util/hook';
import UserComp from '@/components/UserComp.vue';
import NoData from '@/components/NoData.vue';
import TableComp from '@/components/TableComp.vue';
import TipsComp from '@/components/TipsComp.vue';
import CheckboxComp from '@/components/CheckboxComp.vue';
import {
    repairOptions, levelOption, triggerOptions, onlineOptions, vulnTags, langOptions,
} from './constants';
import RiskResultModal from './RiskResultModal.vue';
import CommonHead from '@/components/CommonHead.vue';

const queryModal = ref(false);
const showRelustModal = ref(false);
const changeNameDialog = ref(false); // 更名
const changeName = ref('');
const newQueryData = ref<any>(); // 最新的查询任务
const changenameId = ref(''); // 列表当前改名
const inpRef = ref();
const taskInfoId = ref('');
const taskInfo = ref({ name: '', createTime: '' });

const filterOptions = ref<{
    filter_team_id: string,
    team_id: string,
    vul_id: string,
    language: string,
    suggest: number | undefined,
    level: number | undefined,
    is_triggers: number | undefined,
    is_online: number | undefined,
    query_vuln_tag: string[],
    name: string,
    ext: string,
}>({
    team_id: store.teamInfo.team_id,
    filter_team_id: store.teamInfo.team_id,
    vul_id: '',
    language: '',
    suggest: undefined,
    level: undefined,
    is_triggers: undefined,
    is_online: undefined,
    query_vuln_tag: [],
    name: '',
    ext: '',
});

const taskFilterInfo = ref({
    team_id: store.teamInfo.team_id,
    export_type: 8,
    addr: window.location.host,
    is_only_mine: true,
});

// const openTaskHandle = (row: any) => {
//     if (row.status !== 2) {
//         showMessage('当前无查询结果', 'warning');
//         return;
//     }
//     showRelustModal.value = true;
//     taskInfoId.value = row.id;
//     taskInfo.value.name = row.project_name;
//     taskInfo.value.createTime = row.created_at;
// };

const {
    listData, curPage, total, getData,
} = useList(getAssetsTaskApi, taskFilterInfo);

const totalProject = ref(0);
const projectNum = ref(0);
const queryInput = ref();
const isAllQueryData = ref(false);
const disabled = ref(false);

const timer = ref<any>(null);
const startRoll = () => {
    timer.value = setInterval(() => {
        // eslint-disable-next-line no-use-before-define
        getNewItemHandle();
    }, 2000);
};
// 最新一条查询
const getNewItemHandle = async () => {
    try {
        const { data } = await getNewItemApi(taskFilterInfo.value);
        newQueryData.value = data;
        if (newQueryData.value?.status === 2) {
            try {
                // eslint-disable-next-line no-shadow
                const { data } = await getRiskTaskInfoApi({ id: newQueryData.value.id });
                totalProject.value = data.total;
                projectNum.value = data.project_num;
                disabled.value = false;
                clearInterval(timer.value);
                timer.value = null;

                queryInput.value = JSON.parse(data.query_input?.input_string);

                const query = queryInput.value;
                isAllQueryData.value = !query.vul_id && !query.language && query.suggest === undefined && query.level === undefined && query.is_triggers === undefined
                    && query.is_online === undefined && !query.query_vuln_tag?.length;
            } catch (error) {
                console.log(error);
            }
        } else if (!timer.value) {
            startRoll();
        }
    } catch (error) {
        console.log(error);
    }
};
getNewItemHandle();

onUnmounted(() => {
    clearInterval(timer.value);
});

// 创建任务
const createTaskHandle = async () => {
    disabled.value = true;

    try {
        await createRiskTaskApi({
            input_string: JSON.stringify(filterOptions.value),
            ...filterOptions.value,
        });
        getNewItemHandle();
        // eslint-disable-next-line no-use-before-define
        resetHandle();
    } catch (error) {
        console.log(error);
    }
};

const deleteExportHandle = async (id: string) => {
    try {
        await deleteExportApi({ id });
        showMessage('删除成功', 'success');
        getData();
        getNewItemHandle();
    } catch (error) {
        console.log(error);
    }
};

const cancleQuery = async (id: string) => {
    try {
        await cancelQueryApi({ id });
        getData();
        getNewItemHandle();
        showMessage('取消成功', 'success');
    } catch (error) {
        console.log(error);
    }
};

// 更bb名
const editnameHandle = async (name: string, id: string) => {
    if (!name) {
        showMessage('名称不能为空', 'warning');
        return;
    }
    await reNameApi({
        name,
        id,
    });
    changeNameDialog.value = false;
    getNewItemHandle();
    getData();
    showMessage('更新成功', 'success');
};

const editName = (id: string) => {
    changenameId.value = id;
    nextTick(() => {
        inpRef.value.focus();
    });
};
const saveName = (id: string, name: string) => {
    changenameId.value = '';
    editnameHandle(name, id);
};

// 重置
const resetHandle = () => {
    Object.assign(filterOptions.value, {
        vul_id: '',
        language: '',
        suggest: undefined,
        level: undefined,
        is_triggers: undefined,
        is_online: undefined,
        query_vuln_tag: [],
        team_id: store.teamInfo.team_id,
        filter_team_id: store.teamInfo.team_id,
    });
};
</script>

<style scoped lang='less'>
.risk_index {
    padding: 24px;
}

.advanced-filter:hover {

    span,
    i {
        color: #6C87FF;
    }
}

.inquire-title {
    font-weight: 500;
    font-size: 14px;
    color: #8F959E;
    margin-bottom: 4px
}

.chang-name {
    &:hover {
        border-color: #dcdfe6;
    }

    border: 1px solid transparent;
    border-radius: 6px;
    height: 32px;
    width: 240px;
    line-height: 30px;
    padding-left: 10px;
    overflow: hidden;
    .ellipsis();
}

.filter_wrap {
    // .between();
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    // height: 64px;
    box-sizing: border-box;

    .export {
        width: 80px;
        color: #fff;
    }
}
</style>
