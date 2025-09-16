<template>
    <div class="filter">
        <SearchComp style="width: 240px;" v-model="filterOptions.keyword" clearable placeholder="请搜索任务名称" />
        <SearchComp style="width: 240px;" v-model="filterOptions.ext" clearable placeholder="搜索更多信息" />

        <el-select v-if="store.isAllTeam" style="margin-right: 8px; width: 203px;" v-model="filterOptions.team_id"
                   placeholder="请选择团队">
            <el-option v-for="item in store.teamList" :key="item.id" :label="item.team_name" :value="item.id" />
        </el-select>
        <CheckboxComp style="width: 203px;" v-model="filterOptions.scan_mode" :filterType="'mode'" clearable
                      placeholder="检测模式" />
        <CheckboxComp style="width: 203px;" v-model="filterOptions.language" :filterType="'lang'" clearable
                      placeholder="语言" />
        <CheckboxComp style="width: 203px;" v-model="filterOptions.access_type" :filterType="'access'" clearable
                      placeholder="接入方式" />
        <CheckboxComp style="width: 203px;" v-model="filterOptions.status" :filterType="'status'" clearable
                      placeholder="检测状态" />
        <el-date-picker v-model="activeTime" style="width: 355px;margin-right: 8px;" @change="changeTime"
                        type="datetimerange" start-placeholder="开始时间" end-placeholder="结束时间" />

        <el-button @click="resetHandle" class="hover_btn1"
                   style="background-color: #fff;color: #6c87ff;border: 1px solid #6c87ff;margin-left: 10px;margin: 12px 0;">重置</el-button>
    </div>

    <div class="table_wrap">
        <el-table :data="listData"
                  :header-cell-style="{ padding: '15px 0', border: 'none', background: '#F7F8FB', color: '#8F959E', fontWeight: 500 }"
                  style="width: 100%">
            <el-table-column label="任务名称" min-width="460" show-overflow-tooltip>
                <template #default="scope">
                    <div class="g-pt-8 g-pb-8 g-cursor-pointer hover_text g-display-inline-block"
                         @click="checkDetail(scope.row.status, scope.row.project_id, scope.row.id)">
                        <img style="margin-right: 4px;width: 20px;" class="g-vertical--6"
                             :src="getAccessImg(scope.row.access_type)" alt="">
                        <span class="time">{{ scope.row.name }}</span>
                    </div>

                    <TagComp v-if="scope.row.evidence_accuracy === 'Inaccuracy'" content="模糊" c="#525252"
                             bgc="#EBEBEB" />

                    <TagComp v-if="scope.row.evidence_accuracy === 'Accuracy'" class="ml-1" content="精准" c="#6425D0"
                             bgc="#7F3BF533" />

                    <TagComp v-if="scope.row.evidence_accuracy === 'Adjusted'" class="ml-1" content="校准" c="#B220B2"
                             bgc="#D136D133" />

                    <el-tooltip v-if="scope.row.detection_strategy_project_name?.length" placement="top">
                        <template #content>
                            <div>
                                命中项目策略：
                            </div>
                            <div v-for="o in ((scope.row.detection_strategy_project_name))" :key="o">
                                {{ o }}
                            </div>
                        </template>
                        <span class="status stra-icon g-ml-8">
                            <i class="murphy icon-a-hitthetarget" style="color: #F34D3D;font-size: 16px;"></i>
                        </span>
                    </el-tooltip>
                </template>
            </el-table-column>

            <el-table-column label="分支" show-overflow-tooltip width="100">

                <template #default="scope">
                    <span class="time">{{ scope.row.branch || '-' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="语言" width="120" show-overflow-tooltip>

                <template #default="scope">
                    <span class="time">{{ scope.row.langues || '未知' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="检测模式" width="120">

                <template #default="scope">
                    <span class="time">{{ scope.row.scan_mode }}</span>
                </template>
            </el-table-column>

            <el-table-column v-if="store.isAllTeam" label="所属团队" prop="team_name" show-overflow-tooltip />

            <el-table-column label="组件">

                <template #default="scope">
                    <span class="time">
                        {{ scope.row.comp_num || (scope.row.status !== 3 ? '-' : scope.row.comp_num) }}
                    </span>
                </template>
            </el-table-column>

            <el-table-column label="缺陷组件" width="160">

                <template #default="scope">
                    <div class="td">
                        <el-tooltip placement="top" content="强烈建议修复">
                            <span class="tag" :class="{ 'tag-disabled': scope.row.strong_num === 0 }">{{
                                scope.row.strong_num }}</span>
                        </el-tooltip>
                        <el-tooltip placement="top" content="建议修复">
                            <span class="tag" :class="{ 'tag-disabled': scope.row.recommend_num === 0 }">{{
                                scope.row.recommend_num }}</span>
                        </el-tooltip>
                        <el-tooltip placement="top" content="可选修复">
                            <span class="tag" :class="{ 'tag-disabled': scope.row.optional_num === 0 }">{{
                                scope.row.optional_num }}</span>
                        </el-tooltip>
                    </div>
                </template>
            </el-table-column>

            <el-table-column label="漏洞">

                <template #default="scope">
                    <span class="time" style="color: #F34D3D">
                        {{ scope.row.leak_num || (scope.row.status !== 3 ? '-' : scope.row.leak_num) }}
                    </span>
                </template>
            </el-table-column>

            <el-table-column label="检测状态" width="140">

                <template #default="scope">
                    <span style="color: #6425D0;" v-if="scope.row.status === 1">
                        队列中
                    </span>
                    <span style="color: #049FD7;" v-else-if="scope.row.status === 2">
                        运行中
                    </span>
                    <span style="color: #2EA121;" v-else-if="scope.row.status === 3">
                        检测成功
                    </span>
                    <span style="color: #646A73;" v-else-if="scope.row.status === 8">
                        检测取消
                    </span>
                    <span v-else style="color: #D83931;">
                        检测失败
                        <el-tooltip placement="top" :content="getDetectStatus(scope.row.status)">
                            <span class="tanhao">
                                <i class="murphy icon-tixing"></i>
                            </span>
                        </el-tooltip>
                    </span>

                    <!-- maven -->
                    <span v-if="scope.row.status === 3 && store.conf.ACCURACY_LIMITED_PROMPT === 'true'">
                        <span
                            v-if="scope.row.scan_warnings && (scope.row.scan_warnings?.includes('mvn_not_found') || scope.row.scan_warnings?.includes('auto_build_error') || scope.row.scan_warnings?.includes('mvn_failed') || scope.row.scan_warnings?.includes('mvn_timeout_killed'))"
                            @click.stop="openMaven(scope.row.id)" class="tanhao">
                            <i class="murphy icon-tixing g-vertical--1"></i>
                        </span>

                        <span v-else-if="scope.row.scan_warnings" @click.stop="openMaven(scope.row.id)"
                              class="tanhao maven-icon-warn">
                            <i class="murphy icon-tixing"></i>
                        </span>
                    </span>
                </template>
            </el-table-column>

            <el-table-column label="检测时间" width="180">

                <template #default="scope">
                    <span class="time">{{ formatDate(scope.row.created_at) }}</span>
                </template>
            </el-table-column>

            <el-table-column v-if="!store.isAllTeam" label="操作" width="140" fixed="right">
                <template #default="scope">
                    <span class="g-mr-16">
                        <Tooltip v-if="scope.row.status >= 3" width="264" content="由于不会储存被检测项目，所以仅支持托管过的项目通过「再次检测」快速检测"
                                 :disabled="showDetectBtnTypes.includes(scope.row.access_type)">
                            <el-button
                                @click.stop="restartDetectHandle(scope.row.project_id, scope.row.status, scope.row.access_type, scope.row.id)"
                                :disabled="!showDetectBtnTypes.includes(scope.row.access_type)"
                                style="font-size: 12px;width: 64px;height: 28px;">
                                再次检测
                            </el-button>
                        </Tooltip>

                        <el-button class="minor_btn" @click="cancleTaskHandle(scope.row.id)" v-if="scope.row.status < 3"
                                   style="font-size: 12px;width: 64px;height: 28px;">
                            取消检测
                        </el-button>
                    </span>

                    <el-tooltip popper-class="user_tooltip" placement="left-start" effect="light" :show-arrow="false"
                                trigger="click">
                        <span class="button-icon-blue inline-block text-center" @click.stop>
                            <i class="murphy icon-dots"></i>
                        </span>
                        <template #content>
                            <div class="user_popup" style="width: 140px">
                                <!-- <div class="item"
                                    @click=" $router.push(`/detect-config?from=${ele.access_type}&id=${item.id}&type=config`)">
                                    检测配置
                                </div> -->
                                <div class="item" id="history_id" @click="copyFunc('#history_id')"
                                     :data-clipboard-text="scope.row.id">
                                    复制历史ID
                                </div>
                                <div class="item" @click="downloadFile(exportLogUrl, scope.row.id, 'log.zip')">
                                    导出任务日志
                                </div>
                                <div class="item"
                                     @click="sid = scope.row.id; pid = scope.row.project_id; adjustModal = true">
                                    组件校准记录
                                </div>
                                <div class="item"
                                     v-if="scope.row.status !== 1 && scope.row.status !== 2 && !store.isAllTeam"
                                     @click="deleteDetectList(scope.row.id)">
                                    删除
                                </div>
                            </div>
                        </template>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination" v-if="total > 0">
            <el-pagination v-model:currentPage="curPage" background small :page-size="20"
                           layout="total, prev, pager, next" :total="total">
            </el-pagination>
        </div>

    </div>

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

    <MavenInfo v-model="showMavenTipsModal" v-if="showMavenTipsModal" :info="showMavenInfo" />

    <AdjustModal v-model="adjustModal" v-if="adjustModal" :pid="pid" :sid="sid" />

</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {
    getHistoryListApi, getMavenInfoApi, cancelSubtaskApi, exportLogUrl, deleteHistoryApi,
} from 'api/project';
import useList from 'util/hook';
import {
    formatDate, getAccessImg, showMessage, copyFunc, getDetectStatus, downloadFile,
} from 'util/tools';
import store from '@/utils/store';
import MavenInfo from './detail/components/MavenInfo.vue';
import SearchComp from '@/components/SearchComp.vue';
import CheckboxComp from '@/components/CheckboxComp.vue';
import AdjustModal from './AdjustModal.vue';

const router = useRouter();
const activeTime = ref([]);
const adjustModal = ref(false);
const pid = ref();
const sid = ref();

const filterOptions = ref<{
    team_id: string,
    keyword: string,
    scan_mode: Array<number>,
    language: Array<string>,
    access_type: Array<string>,
    status: Array<number>,
    start_time: any,
    end_time: any,
    ext: string,
}>({
    team_id: store.teamInfo.team_id,
    keyword: '',
    language: [],
    access_type: [],
    status: [],
    scan_mode: [],
    start_time: null,
    end_time: null,
    ext: '',
});
const {
    total, curPage, listData,
} = useList(getHistoryListApi, filterOptions);
const showDetectBtnTypes = ['gitlabwebhook', 'github', 'gitlab', 'gerrit', 'bitbucket', 'coding', 'folib'];
const isShowDeleteModal = ref<boolean>(false);
const deleteType = ref<number>(1);
const deleteId = ref<string>('');

const changeTime = (val: any) => {
    if (val) {
        [filterOptions.value.start_time, filterOptions.value.end_time] = val;
    } else {
        filterOptions.value.start_time = null;
        filterOptions.value.end_time = null;
    }
};

const showMavenTipsModal = ref<boolean>(false);
const showMavenInfo = ref<any>({});
const openMaven = async (id: string) => {
    try {
        const { data } = await getMavenInfoApi(id || '0');
        showMavenInfo.value = data;
        // if (showMavenInfo.value?.length) {
        showMavenTipsModal.value = true;
        // }
    } catch (error) {
        console.log(error);
    }
};

// 重置筛选
const resetHandle = () => {
    activeTime.value = [];
    Object.assign(filterOptions.value, {
        keyword: '',
        access_type: [],
        status: [],
        language: [],
        scan_mode: [],
        start_time: null,
        end_time: null,
    });
};

// 再次检测
// eslint-disable-next-line no-shadow
const restartDetectHandle = async (id: string, status: number, type: string, sid: string) => {
    if (!showDetectBtnTypes.includes(type)) return;
    if (status === 1 || status === 2) {
        showMessage('项目正在检测中', 'warning');
        return;
    }
    router.push(`/detect-config?from=${type}&id=${id}&type=restart&sid=${sid}`);
};

// 取消检测
const cancleTaskHandle = async (id: string) => {
    await cancelSubtaskApi({
        subtask_id_list: [id],
    });
    window.location.reload();
};

// 删除传值
const deleteDetectList = (id: string) => {
    isShowDeleteModal.value = true;
    deleteId.value = id;
    deleteType.value = 2;
};

// 删除
const deleteHandle = async () => {
    if (deleteType.value === 2) {
        await deleteHistoryApi({
            subtask_id: deleteId.value,
        });
        showMessage('删除成功', 'success');
        window.location.reload();
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
</script>

<style lang='less' scoped>
.filter {
    background: #FFFFFF;
    border-radius: 4px;
    padding: 16px;
    margin-bottom: 16px;
    padding-bottom: 4px;
    // .between();

    i {
        margin-right: 6px;
    }
}

.tag {
    background: rgba(245, 74, 69, 0.2);
    border-radius: 4px;
    padding: 1px 6px;
    margin-right: 4px;
    font-size: 13px;
    color: #D83931;
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

.table_wrap {
    padding: 16px;
    background-color: #fff;
    box-sizing: border-box;
    color: #3c3c3c;
    font-size: 14px;
    height: calc(100% - 128px);
    overflow: auto;
    border-radius: 6px;

    .status {
        padding: 2px 6px;
        font-size: 12px;
        border-radius: 4px;
        display: inline-block;

        i {
            font-size: 14px;
            vertical-align: -1px;
        }
    }

    .stra-icon:hover {
        background: #f34d3d38;
    }

    .tanhao {
        &:hover {
            background-color: #F54A4533;
        }

        width: 26px;
        height: 24px;
        text-align: center;
        line-height: 24px;
        border-radius: 4px;
        display: inline-block;
        // vertical-align: ;
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
}

.tag.tag-disabled {
    background: #EBEBEB !important;
    color: #c7c7c7 !important;
}
</style>
