<template>
    <div class="filter">
        <!-- <div> -->
        <SearchComp style="width: 240px;" v-model="filterOptions.keyword" clearable placeholder="请搜索项目名称" />

        <SearchComp style="width: 240px;" v-model="filterOptions.ext" clearable placeholder="搜索更多信息" />

        <el-select v-if="store.isAllTeam" filterable style="margin-right: 8px; width: 169px;"
                   v-model="filterOptions.team_id" placeholder="请选择团队">
            <el-option v-for="item in store.teamList" :key="item.id" :label="item.team_name" :value="item.id" />
        </el-select>

        <!-- <CheckboxComp style="width: 126px" v-model="filterOptions.projects_ids" :options="projectClassOptions" clearable
            placeholder="项目组" /> -->
        <el-select multiple placeholder="项目组" v-model="filterOptions.projects_ids"
                   style="width: 169px; margin-right: 8px;" clearable :collapse-tags="true">
            <el-option v-for="item in projectClassOptions" :key="item.value" :label="item.label" :value="item.value">
                {{ item.name }}{{ store.isAllTeam ? `（${item.team_name}）` : '' }}
            </el-option>
        </el-select>

        <CheckboxComp style="width: 169px" v-model="filterOptions.languages" :filterType="'lang'" clearable
                      placeholder="语言" />
        <CheckboxComp style="width: 169px" v-model="filterOptions.access_type" :filterType="'access'" clearable
                      placeholder="接入方式" />
        <CheckboxComp style="width: 169px" v-model="filterOptions.status" :filterType="'status'" clearable
                      placeholder="检测状态" />
        <CheckboxComp style="width: 169px" v-model="filterOptions.tags" :options="projectTags" clearable
                      placeholder="项目标签" />
        <el-date-picker v-model="activeTime" style="width: 355px;margin-right: 8px" @change="changeTime"
                        type="datetimerange" start-placeholder="开始时间" end-placeholder="结束时间" />
        <SelectComp v-if="store.isLic" v-model="filterOptions.distribution" placeholder="分发场景" style="width: 140px;"
                    :options="distributeOp" />

        <el-checkbox class="g-mr-24" style="position: relative;top: 3px;" :true-label="1" :false-value="0"
                     v-model="filterOptions.has_detection_strategy_project" label="命中项目策略" size="large" />
        <!-- <el-radio-group style="position: relative;top: 3px;" class="g-mr-8"
            v-model="filterOptions.has_detection_strategy_project">
            <el-radio :label="1" class="g-fw-400">命中项目策略</el-radio>
        </el-radio-group> -->
        <!-- </div> -->
        <!-- <div class="g-mt-12"> -->
        <el-button @click="resetHandle" class="hover_btn1"
                   style="margin:12px 0; background-color: #fff;color: #6c87ff;border: 1px solid #6c87ff;">重置</el-button>

        <!-- </div> -->
    </div>

    <div class="table_wrap">
        <div class="g-f-14 g-mb-16 g-color-3 g-fw-400 g-flex g-justify-between g-align-center">
            <span>共 <span class="g-color-1">{{ total }}</span> 条数据</span>
            <el-button v-if="!store.isAllTeam" @click="$router.push('/integrate')">
                <i class="murphy icon-xinjian g-mr-4"></i>
                新建检测
            </el-button>
        </div>

        <div class="thead">
            <div class="th" style="width:18px"></div>
            <div class="th" style="flex:1">项目名称</div>
            <div class="th" style="width:10%" v-if="store.isLic">分发场景</div>
            <div class="th" style="width:15%" v-if="store.isAllTeam">所属团队</div>
            <div class="th" style="width:18%">最新检测时间</div>
            <div class="th" style="width:12%">语言</div>
            <div class="th" style="width:16%">检测状态</div>
            <div class="th" style="width: 32px;">操作</div>
        </div>
        <div class="tbody" v-for="item in listData" :key="item.id" @click="expandHandle(item)">
            <div class="list_item">
                <div class="td" style="width:18px;">
                    <span class="expand_icon">
                        <i class="murphy icon-youjiantou" style="font-size: 12px;" v-if="!item.expand"></i>
                        <i class="murphy icon-xiala1" v-else></i>
                    </span>
                </div>
                <div class="td ellipsis" style="flex: 1;">
                    <div class="project_name g-flex g-align-center">
                        <el-tooltip :content="item.name" placement="top">
                            <span class="name">{{ item.name }}</span>
                        </el-tooltip>

                        <div v-if="item.tags?.length > 1" class="g-flex">
                            <TagComp class="g-mr-4 g-ml-4" bgc="rgba(31, 35, 41, 0.10)" c="#1F2329"
                                     :content="item.tags[0].tag_name" />
                            <el-tooltip placement="top" effect="light">
                                <template #content>
                                    <div style="max-width: 330px;padding: 8px 4px;">
                                        <div v-for="o in (item.tags)" :key="o" class="g-mb-8">
                                            <TagComp bgc="rgba(31, 35, 41, 0.10)" c="#1F2329" :content="o.tag_name" />
                                        </div>
                                    </div>
                                </template>
                                <TagComp bgc="rgba(31, 35, 41, 0.10)" c="#1F2329" :content="`+${item.tags?.length}`" />
                            </el-tooltip>
                        </div>

                        <span v-if="item.tags?.length === 1">
                            <TagComp class="g-mr-4 g-ml-4" bgc="rgba(31, 35, 41, 0.10)" c="#1F2329"
                                     :content="item.tags[0].tag_name" />
                        </span>

                        <el-tooltip v-if="item.detection_strategy_project_name?.length" placement="top">
                            <template #content>
                                <div>
                                    命中项目策略：
                                </div>
                                <div v-for="o in ((item.detection_strategy_project_name))" :key="o">
                                    {{ o }}
                                </div>
                            </template>
                            <span class="status stra-icon g-ml-8">
                                <i class="murphy icon-a-hitthetarget" style="color: #F34D3D;font-size: 16px;"></i>
                            </span>
                        </el-tooltip>
                    </div>
                </div>
                <div class="td" style="width:10%" v-if="store.isLic">
                    {{ distributeOp.find((ele: any) => ele.value === item.project_distribution)?.label || '外部' }}
                </div>
                <div class="td" style="width:15%" v-if="store.isAllTeam">
                    <div>
                        {{ item.team_name }}
                    </div>
                </div>
                <div class="td" style="width:18%">
                    <div>
                        {{ formatDate(item.updated_at) }}
                    </div>
                </div>
                <div class="td" style="width:12%">
                    <span v-if="!item.languages">未知</span>
                    <el-tooltip v-else placement="top">

                        <template #content>
                            <div v-for="ele in item.languages.split(',')" :key="ele">
                                {{ ele }}
                            </div>
                        </template>
                        <span>
                            {{ item.languages.split(',').length > 1 ? `${item.languages.split(',')[0]}...` :
                                item.languages.split(',')[0] }}
                        </span>
                    </el-tooltip>
                </div>
                <div class="td" style="width:16%">
                    <span class="status" style=" background: #7F3BF533;color: #6425D0;" v-if="item.status === 1">
                        <i class="murphy icon-shijian"></i>
                        队列中
                    </span>
                    <span class="status" style=" background: #14C0FF33;color: #049FD7;" v-else-if="item.status === 2">
                        <i class="murphy icon-shijian"></i>
                        运行中
                    </span>
                    <span class="status" style=" background: #34c72433;color: #2EA121;" v-else-if="item.status === 3">
                        <i class="murphy icon-wancheng2"></i>
                        检测成功
                    </span>
                    <span class="status" style="background: #1F23291A;color: #646A73;" v-else-if="item.status === 8">
                        <i class="murphy icon-cuowu"></i>
                        检测取消
                    </span>
                    <div v-else>
                        <span class="status" style="background: #F54A4533;color: #D83931;">
                            <i class="murphy icon-tixing" style="font-size: 16px;"></i>
                            检测失败
                        </span>
                        <el-tooltip placement="top" :content="getDetectStatus(item.status)">
                            <span class="tanhao">
                                <i class="murphy icon-tixing"></i>
                            </span>
                        </el-tooltip>
                    </div>
                </div>
                <div class="td" style="width: 32px;">
                    <el-tooltip popper-class="user_tooltip" placement="left-start" effect="light" :show-arrow="false"
                                trigger="click">
                        <!-- <span class="add" @click.stop> -->
                        <span class="button-icon-blue" @click.stop>
                            <i class="murphy icon-dots"></i>
                        </span>

                        <template #content>
                            <div class="user_popup" style="width: 140px">
                                <div class="item text-3c" @click="$router.push(`/history/${item.id}`)">
                                    检测历史
                                </div>
                                <div v-if="!store.isAllTeam" class="item text-3c"
                                     @click="isShowAddClassModal = true; taskId = item.id">
                                    添加至项目组
                                </div>
                                <div class="item text-3c" v-if="!store.isAllTeam"
                                     @click="modifyNameHadle(item.id, item.name)">
                                    项目重命名
                                </div>
                                <div v-if="!store.isAllTeam" class="item text-3c" @click="openAddTagModal(item)">
                                    添加项目标签
                                </div>
                                <div class="item text-3c" v-if="store.isLic && !store.isAllTeam"
                                     @click="distributeModal = true; pid = item.id">
                                    更改分发场景
                                </div>
                                <div class="item text-3c" @click="sid = undefined; pid = item.id; adjustModal = true">
                                    组件校准规则
                                </div>
                                <div class="item text-err"
                                     v-if="item.status !== 1 && item.status !== 2 && !store.isAllTeam"
                                     @click="isShowDeleteModal = true; deleteId = item.id; deleteType = 1">
                                    删除
                                </div>
                            </div>
                        </template>
                    </el-tooltip>
                </div>
            </div>

            <div class="expand_content" @click.stop v-if="item.expand">
                <div class="history_item" @click.stop=" checkDetail(ele.status, item.id, ele.id)"
                     v-for="(ele, i) in item.history" :key="i">
                    <div class="td flex items-center" style="flex: 1;">
                        <img style="margin-right: 4px;" :src="getAccessImg(ele.access_type)" alt="">

                        <span class="time">{{ formatDate(ele.created_at) }}</span>

                        <TagComp v-if="ele.evidence_accuracy === 'Inaccuracy'" content="模糊" c="#525252" bgc="#EBEBEB" />

                        <TagComp v-if="ele.evidence_accuracy === 'Accuracy'" class="ml-1" content="精准" c="#6425D0"
                                 bgc="#7F3BF533" />

                        <TagComp v-if="ele.evidence_accuracy === 'Adjusted'" class="ml-1" content="校准" c="#B220B2"
                                 bgc="#D136D133" />

                        <el-tooltip v-if="ele.detection_strategy_project_name?.length" placement="top">
                            <template #content>
                                <div>
                                    命中项目策略：
                                </div>
                                <div v-for="o in ((ele.detection_strategy_project_name))" :key="o">
                                    {{ o }}
                                </div>
                            </template>
                            <span class="status g-bdr-4 g-ml-8" style="display:
                            inline-block ;padding: 4px 5px;">
                                <i class="murphy icon-a-hitthetarget" style="color: #F34D3D;font-size: 16px;"></i>
                            </span>
                        </el-tooltip>
                    </div>

                    <div class="td mr-2" style="width: 8%;">
                        <i style="color: #858585;" class="murphy icon-code-branch"></i>
                        {{ ele.branch || '默认分支' }}
                    </div>
                    <div class="td" style="width: 14%;">
                        <span style="font-size: 12px; color: #8F959E">检测模式</span>
                        {{ ele.scan_mode }}
                    </div>
                    <!-- <div class="td" style="width: 8%;">
                        <span style="font-size: 12px; color: #8F959E;margin-right: 3px;">语言</span>
                        <span v-if="!ele.langues">未知</span>
                        <el-tooltip v-else placement="top">
                            <template #content>
                                <div v-for="item in ele.langues.split(',')" :key="item">
                                    {{ item }}
                                </div>
                            </template>
                            <span>
                                {{ ele.langues.split(',')[0] }}
                            </span>
                        </el-tooltip>
                    </div> -->
                    <div class="td" style="width: 8%;">
                        <span style="font-size: 12px; color: #8F959E">组件</span>
                        {{ ele.comp_num || (ele.status !== 3 ? '-' : ele.comp_num) }}
                    </div>
                    <div class="td" style="width: 7%;color: #F34D3D;">
                        <span style="font-size: 12px;color: #8F959E">漏洞</span>
                        {{ ele.leak_num || (ele.status !== 3 ? '-' : ele.leak_num) }}
                    </div>
                    <div class="td" style="width: 8%;color: #F34D3D;">
                        <span style="font-size: 12px;color: #8F959E">缺陷组件</span>
                        {{ (ele.strong_num + ele.recommend_num + ele.optional_num) || (ele.status !== 3 ? '-' :
                            ele.strong_num + ele.recommend_num + ele.optional_num) }}
                    </div>
                    <div class="td" style="width: 11%;">
                        <el-tooltip placement="top" content="强烈建议修复">
                            <span class="tag" :class="{ 'tag-disabled': !ele.strong_num }">{{ ele.strong_num }}</span>
                        </el-tooltip>
                        <el-tooltip placement="top" content="建议修复">
                            <span class="tag" :class="{ 'tag-disabled': !ele.recommend_num }">{{ ele.recommend_num
                            }}</span>
                        </el-tooltip>
                        <el-tooltip placement="top" content="可选修复">
                            <span class="tag" :class="{ 'tag-disabled': !ele.optional_num }">{{ ele.optional_num
                            }}</span>
                        </el-tooltip>
                    </div>
                    <div class="td g-flex g-align-center task-status" style="width: 11%">
                        <span style="color: #6425D0;" v-if="ele.status === 1">
                            队列中
                        </span>
                        <span style="color: #049FD7;" v-else-if="ele.status === 2">
                            运行中
                        </span>
                        <span style="color: #2EA121;" v-else-if="ele.status === 3">
                            检测成功
                        </span>
                        <span style="color: #646A73;" v-else-if="ele.status === 8">
                            检测取消
                        </span>
                        <span v-else style="color: #D83931;">
                            检测失败
                            <el-tooltip placement="top" :content="getDetectStatus(ele.status)">
                                <span class="tanhao g-vertical--1">
                                    <i class="murphy icon-tixing"></i>
                                </span>
                            </el-tooltip>
                        </span>

                        <!-- maven -->
                        <span v-if="ele.status === 3 && store.conf.ACCURACY_LIMITED_PROMPT === 'true'">
                            <span
                                v-if="ele.scan_warnings && (ele.scan_warnings?.includes('mvn_not_found') || ele.scan_warnings?.includes('auto_build_error') || ele.scan_warnings?.includes('mvn_failed') || ele.scan_warnings?.includes('mvn_timeout_killed'))"
                                @click.stop="openMaven(ele.id)" class="tanhao">
                                <i class="murphy icon-tixing g-vertical--1"></i>
                            </span>

                            <span v-else-if="ele.scan_warnings" @click.stop="openMaven(ele.id)"
                                  class="tanhao maven-icon-warn">
                                <i class="murphy icon-tixing"></i>
                            </span>
                        </span>
                    </div>

                    <div class="td" style="width: 7%;" v-if="!store.isAllTeam">
                        <Tooltip v-if="ele.status >= 3" width="264" content="由于不会储存被检测项目，所以仅支持托管过的项目通过「再次检测」快速检测"
                                 :disabled="showDetectBtnTypes.includes(ele.access_type)">
                            <el-button @click.stop=" restartDetect(item.id, ele.is_detect, ele.access_type, ele.id)"
                                       :disabled="!showDetectBtnTypes.includes(ele.access_type)"
                                       style="font-size: 12px;width: 64px;height: 28px;">
                                再次检测
                            </el-button>
                        </Tooltip>

                        <el-button class="minor_btn" @click.stop="cancleTaskHandle(ele.id)" v-if="ele.status < 3"
                                   style="font-size: 12px;width: 64px;height: 28px;">
                            取消检测
                        </el-button>
                    </div>
                    <div class="td">
                        <el-tooltip popper-class="user_tooltip" placement="left-start" effect="light"
                                    :show-arrow="false" trigger="click">
                            <!-- <span class="add" @click.stop>
                                <i class="murphy icon-dots"></i>
                            </span> -->
                            <span class="button-icon-blue" @click.stop>
                                <i class="murphy icon-dots"></i>
                            </span>

                            <template #content>
                                <div class="user_popup" style="width: 140px">
                                    <div class="item  text-3c" v-if="!store.isAllTeam"
                                         @click=" $router.push(`/detect-config?from=${ele.access_type}&id=${item.id}&type=config`)">
                                        检测配置
                                    </div>
                                    <div class="item  text-3c" id="history_id" @click="copyFunc('#history_id')"
                                         :data-clipboard-text="ele.id">
                                        复制历史ID
                                    </div>
                                    <div class="item  text-3c" @click="downloadFile(exportLogUrl, ele.id, 'log.zip')">
                                        导出任务日志
                                    </div>
                                    <div class="item  text-3c" @click="sid = ele.id; pid = item.id; adjustModal = true">
                                        组件校准记录
                                    </div>
                                    <div class="item text-err"
                                         v-if="ele.status !== 1 && ele.status !== 2 && !store.isAllTeam"
                                         @click=" deleteDetectList(i, ele.id)">
                                        删除
                                    </div>
                                </div>
                            </template>
                        </el-tooltip>
                    </div>
                </div>
            </div>
        </div>

        <NoData v-if="!isHaveData" />

        <!-- 分页 -->
        <div class="pagination" v-if="isHaveData">
            <el-pagination v-model:currentPage="curPage" background small :page-size="20"
                           layout="total, prev, pager, next" :total="total">
            </el-pagination>
        </div>

    </div>

    <!-- 添加至项目组 -->
    <AddProjectToClassModal v-model="isShowAddClassModal" :tid="taskId" v-if="isShowAddClassModal" />

    <!-- 删除modal框 -->
    <el-dialog width="420px" v-model="isShowDeleteModal" :close-on-click-modal="false">
        <template #header>
            <div class="modal_title">
                <i class="murphy icon-jinggaotubiaosvg"
                   style="margin-right: 6px; font-size: 20px;color:#FF9940;font-weight: 500;"></i>
                {{ deleteType === 1 ? '删除项目' : '删除安全报告' }}
            </div>
            <div class="modal_desc" style="color: #3c3c3c;padding-left: 32px;">
                {{ deleteType === 1 ? '删除后项目将无法恢复，请谨慎操作' : '删除除后安全报告将无法恢复，请谨慎操作' }}
            </div>
        </template>
        <div class="btns" style="display: flex;justify-content: flex-end;">
            <el-button class="cancle_btn" @click=" isShowDeleteModal = false">取消</el-button>
            <el-button style="background-color: #F34D3D;" @click="deleteHandle">删除</el-button>
        </div>
    </el-dialog>

    <AdjustModal v-model="adjustModal" v-if="adjustModal" :pid="pid" :sid="sid" />

    <!-- 自定义名称 -->
    <ModifyName v-model="renameDialog.show" v-if="renameDialog.show" :renameDialog="renameDialog" />

    <!-- 项目标签 -->
    <projectTagsModal v-model="showAddProjectTags.show" v-if="showAddProjectTags.show" :data="showAddProjectTags" />

    <MavenInfo v-model="showMavenTipsModal" v-if="showMavenTipsModal" :info="showMavenInfo" />

    <DistributeModal v-model="distributeModal" v-if="distributeModal" @update="getData" :pid="pid" />
</template>

<script setup lang='ts'>
import { onBeforeMount } from 'vue';
import useList from 'util/hook';
import {
    cancelSubtaskApi, exportLogUrl, getConsoleProjectListApi, deleteHistoryApi, deleteProjectApi,
} from 'api/project';
import {
    formatDate, getAccessImg, showMessage, getDetectStatus, copyFunc, downloadFile,
} from '@/utils/tools';
// import { getOrgAuthInfo } from '@/control/org/hooks';
import store from '@/utils/store';
import AddProjectToClassModal from './AddProjectToClassModal.vue';
import ModifyName from './ModifyName.vue';
import projectTagsModal from './ProjectTagsModal.vue';
import { distributeOp } from './constants/constants';
import MavenInfo from './detail/components/MavenInfo.vue';
import AdjustModal from './AdjustModal.vue';
import DistributeModal from './DistributeModal.vue';
// import TimeConsume from './detail/components/TimeConsume.vue';
import { useProjectList, getProjectClassList, getProjectTags } from './composables/use-project-list';

const {
    router,
    activeTime,
    showMavenTipsModal,
    showMavenInfo,
    adjustModal,
    pid,
    sid,
    distributeModal,
    isShowDeleteModal,
    deleteType,
    deleteId,
    isShowAddClassModal,
    taskId,
    showDetectBtnTypes,
    renameDialog,
    showAddProjectTags,
    projectTags,
    projectClassOptions,
    filterOptions,
    changeTime,
    openMaven,
    expandHandle,
    restartDetectHandle,
    deleteDetectList,
    resetHandle,
    modifyNameHadle,
    openAddTagModal,
} = useProjectList();

const {
    total, curPage, listData, isHaveData, getData,
} = useList(getConsoleProjectListApi, filterOptions);

// 项目组筛选
onBeforeMount(async () => {
    try {
        const [classOptions, tags] = await Promise.all([
            getProjectClassList(),
            getProjectTags(),
        ]);
        projectClassOptions.value = classOptions;
        projectTags.value = tags;
    } catch (error) {
        console.log(error);
    }
});

// 再次检测
// eslint-disable-next-line no-shadow
const restartDetect = async (id: string, status: boolean, type: string, sid: string) => {
    restartDetectHandle(id, status, type, sid);
};

// 删除
const deleteHandle = async () => {
    if (deleteType.value === 2) {
        await deleteHistoryApi({
            subtask_id: deleteId.value,
        });
        showMessage('删除成功', 'success');
        isShowDeleteModal.value = false;
        getData();
    } else {
        await deleteProjectApi({
            project_id: deleteId.value,
        });
        showMessage('删除成功', 'success');
        isShowDeleteModal.value = false;
        getData();
    }
};

// 查看详情
const checkDetail = (status: number, tid: string, ssid: string) => {
    // if (status > 3) {
    //     showMessage('正在检测中，无法查看安全报告', 'warning');
    // } else {
    // showMessage('检测失败，无法查看安全报告', 'warning');
    router.push(`/detail/${tid}/${ssid}`);
    // }
};

// 取消检测
const cancleTaskHandle = async (id: string) => {
    await cancelSubtaskApi({
        subtask_id_list: [id],
    });
    getData();
};

</script>

<style lang='less' scoped>
.filter {
    background: #FFFFFF;
    border-radius: 4px;
    padding: 12px 16px;
    margin-bottom: 16px;
    padding-bottom: 4px;
    // .between();
    // align-items: flex-start;

    i {
        margin-right: 6px;
    }
}

.table_wrap {
    padding: 16px;
    background-color: #fff;
    color: #3c3c3c;
    font-size: 14px;
    height: calc(100% - 138px);
    overflow: auto;
    border-radius: 6px;
    box-sizing: border-box;

    .tbody {
        border-bottom: 1px solid #EFF0F1;
    }

    img {
        width: 20px;
        border-radius: 50%;
        vertical-align: -5px;
    }

    .project_name {
        .name {
            max-width: 70%;
            display: inline-block;
            .ellipsis();
        }

        .tag {
            background-color: rgba(31, 35, 41, 0.10);
            color: #1F2329;
        }

        width: 100%;
        cursor: pointer;
        color: #3c3c3c;
        padding: 10px 0;
    }

    .add {
        &:hover {
            background-color: #EBEBEB;
        }

        width: 28px;
        height: 28px;
        padding: 6px;
        border-radius: 6px;
        cursor: pointer;
        box-sizing: border-box;
        display: inline-block;

        i {
            font-size: 14px;
        }
    }

    .thead {
        display: flex;
        align-items: center;
        height: 56px;
        background: #F7F8FB;
        padding: 0 16px;
        font-size: 14px;
        color: #8F959E;
        border-radius: 4px;
        margin-bottom: 1px;
    }

    th {
        .ellipsis();
    }

    .list_item {
        &:hover {
            .expand_icon {
                display: inline-block;
            }

            background-color: #6c87ff0e;
        }

        .expand_icon {
            display: none;
        }

        cursor: pointer;
        display: flex;
        align-items: center;
        height: 56px;
        padding: 0 16px;
        margin-bottom: 1px;
        transition: background-color .2s;

        .status {
            padding: 5px 6px;
            font-size: 12px;
            border-radius: 4px;

            i {
                font-size: 14px;
                vertical-align: -1px;
            }
        }

        .stra-icon:hover {
            background: #f34d3d38;
        }

    }

    .history_item {
        display: flex;
        align-items: center;
        height: 56px;
        padding: 0 16px;
        background-color: #F7F8FB;
        border-radius: 8px;
        margin: 8px 0;
        margin-left: 20px;
        cursor: pointer;

        .status {
            &:hover {
                background: #f34d3d38;
            }
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
            border-radius: 0;
        }

        .tag {
            background: #f54a4533;
            border-radius: 4px;
            padding: 4px 6px;
            margin-right: 4px;
            font-size: 13px;
            color: #D83931;
            font-weight: 500;
        }

        .tag:nth-of-type(2) {
            background-color: #ff880033;
            color: #DE7802;
        }

        .tag:nth-of-type(3) {
            background-color: #1f23291a;
            color: #646A73;
        }

        .tag-disabled {
            background-color: #EBEBEB !important;
            color: #c7c7c7 !important;
        }
    }
}

.tanhao {
    &:hover {
        background-color: #F54A4533;
    }

    width: 24px;
    height: 24px;
    text-align: center;
    line-height: 24px;
    border-radius: 4px;
    display: inline-block;
    vertical-align: middle;
    margin-left: 4px;

    i {
        color: #D83931;
    }
}

.tanhao.maven-icon-warn {
    &:hover {
        background-color: #FE994033;
    }

    i {
        color: #FF9940;
    }
}
</style>
