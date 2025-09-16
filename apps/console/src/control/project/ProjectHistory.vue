<template>
    <CommonHead>
        <div class="common_bread">
            <span class="front_nav" @click="router.push('/project/list')">项目管理</span>
            <i class="murphy icon-youjiantou"></i>
            <span>检测历史</span>
        </div>
    </CommonHead>

    <div class="history main_content">
        <div class="wrap">
            <div class="history_item" v-for="(ele, i) in listData  " :key="i"
                @click="checkDetail(ele.status, route.params.id as string, ele.id)">
                <div class="td flex items-center" style="width: 28%;">
                    <img style="margin-right: 4px;" :src="getAccessImg(ele.access_type)" alt="">
                    <span class="time g-mr-8">{{ formatDate(ele.created_at) }}</span>
                    <TagComp v-if="ele.evidence_accuracy === 'Inaccuracy'" content="模糊" c="#525252" bgc="#EBEBEB" />

                    <TagComp v-if="ele.evidence_accuracy === 'Accuracy'" content="精准" c="#6425D0"
                        bgc="#7F3BF533" />

                    <TagComp v-if="ele.evidence_accuracy === 'Adjusted'" content="校准" c="#B220B2"
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
                        <span class="status stra-icon g-bdr-4 ml-1" style="padding: 4px;">
                            <i class="murphy icon-a-hitthetarget" style="color: #F34D3D;font-size: 16px;"></i>
                        </span>
                    </el-tooltip>

                </div>

                <div class="td ellipsis" style="width: 12%;">
                    <i class="murphy icon-code-branch"></i>
                    {{ ele.branch || '-' }}
                </div>
                <div class="td" style="width: 10%;">
                    <span style="font-size: 12px; color: #8F959E">组件</span>
                    {{ ele.comp_num }}
                </div>
                <div class="td" style="width: 10%;color: #F34D3D;">
                    <span style="font-size: 12px;color: #8F959E">漏洞</span>
                    {{ ele.leak_num }}
                </div>
                <div class="td" style="width: 10%;color: #F34D3D;">
                    <span style="font-size: 12px;color: #8F959E">缺陷组件</span>
                    {{ ele.strong_num + ele.recommend_num + ele.optional_num }}
                </div>
                <div class="td" style="width: 26%;">
                    <span class="tag">{{ ele.high_num }}</span>
                    <span class="tag">{{ ele.medium_num }}</span>
                    <span class="tag">{{ ele.low_num }}</span>
                </div>
                <div class="td" style="width:15%">
                    <span class="status" style=" background: #7F3BF533;color: #6425D0;" v-if="ele.status === 1">
                        <i class="murphy icon-shijian"></i>
                        队列中...
                    </span>
                    <span class="status" style=" background: #14C0FF33;color: #049FD7;" v-else-if="ele.status === 2">
                        <i class="murphy icon-detecting"></i>
                        运行中
                    </span>
                    <span class="status" style=" background: #34c72433;color: #2EA121;" v-else-if="ele.status === 3">
                        <i class="murphy icon-wancheng2"></i>
                        检测成功
                    </span>
                    <span class="status" style="background: #1F23291A;color: #646A73;" v-else-if="ele.status === 8">
                        <i class="murphy icon-cuowu"></i>
                        检测取消
                    </span>
                    <div v-else>
                        <span class="status" style="background: #F54A4533;color: #D83931;">
                            <i class="murphy icon-cuowu"></i>
                            检测失败
                        </span>
                        <el-tooltip placement="top" :content="getDetectStatus(ele.status)">
                            <span class="tanhao">
                                <i class="murphy icon-tixing"></i>
                            </span>
                        </el-tooltip>
                    </div>
                </div>

                <div class="td" style="width: 8%;">
                    <el-button @click.stop=" restartDetectHandle(ele.project_id, ele.is_detect, ele.access_type ,ele.id)"
                        :disabled="ele.access_type !== 'github' && ele.access_type !== 'gitlab' && ele.access_type !== 'gitee'"
                        style="font-size: 12px;width: 64px;height: 28px;">
                        再次检测
                    </el-button>
                </div>

                <div class="td">
                    <el-tooltip popper-class="user_tooltip" effect="light" :show-arrow="false" trigger="click">
                        <span class="add" @click.stop>
                            <i class="murphy icon-dots"></i>
                        </span>
                        <template #content>
                            <div class="user_popup" style="width: 140px">
                                <div class="item"
                                    @click="router.push(`/detect-config?from=${ele.access_type}&id=${ele.id}&type=config`)">
                                    检测配置
                                </div>
                                <div class="item" id="history_id" @click="copyFunc('#history_id')"
                                    :data-clipboard-text="ele.id">
                                    复制历史ID
                                </div>
                                <div class="item" @click="downloadFile(exportLogUrl, ele.id, 'log.zip')">
                                    导出任务日志
                                </div>
                                <div class="item" @click="sid = ele.id; pid = ele.project_id; adjustModal = true">
                                    组件校准记录
                                </div>
                                <div class="item" @click="isShowDeleteModal = true;">
                                    删除
                                </div>
                            </div>
                        </template>
                    </el-tooltip>
                </div>
            </div>

            <!-- 分页 -->
            <div class="pagination" v-if="total > 0">
                <el-pagination v-model:currentPage="curPage" background small :page-size="20"
                    layout="total, prev, pager, next" :total="total">
                </el-pagination>
            </div>

            <NoData v-if="!isHaveData" />
        </div>

        <el-dialog width="420px" v-model="isShowDeleteModal" :close-on-click-modal="false">

            <template #header>
                <div class="modal_title">
                    <i class="murphy icon-jinggaotubiaosvg"
                        style="margin-right: 6px; font-size: 20px;color:#FF9940;font-weight: 500;"></i>
                    删除安全报告
                </div>
                <div class="modal_desc" style="color: #3c3c3c;padding-left: 32px;">
                    删除除后安全报告将无法恢复，请谨慎操作
                </div>
            </template>
            <div class="btns" style="display: flex;justify-content: flex-end;">
                <el-button class="cancle_btn" @click=" isShowDeleteModal = false">取消</el-button>
                <el-button style="background-color: #F34D3D;">删除</el-button>
            </div>
        </el-dialog>

        <AdjustModal v-model="adjustModal" v-if="adjustModal" :pid="pid" :sid="sid" />

    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { getHistoryListApi, exportLogUrl } from 'api/project';
import useList from 'util/hook';
import { useRoute, useRouter } from 'vue-router';
import {
    getAccessImg, formatDate, showMessage, copyFunc, getDetectStatus, downloadFile,
} from 'util/tools';
import store from 'util/store';
import NoData from '@/components/NoData.vue';
import CommonHead from '@/components/CommonHead.vue';
import AdjustModal from './AdjustModal.vue';

const router = useRouter();
const route = useRoute();
const filterOptions = ref<any>({
    project_id: route.params.id,
    team_id: store.teamInfo.team_id,
});
const isShowDeleteModal = ref<boolean>(false);
const adjustModal = ref(false);
const pid = ref();
const sid = ref();
const {
    total, curPage, listData, isHaveData,
} = useList(getHistoryListApi, filterOptions);

// 再次检测
// eslint-disable-next-line no-shadow
const restartDetectHandle = async (id: string, status: boolean, type:string, sid:string) => {
    if (!status) {
        showMessage('项目正在检测中', 'warning');
        return;
    }
    router.push(`/detect-config?from=${type}&id=${id}&type=restart&sid=${sid}`);
};

// 查看详情
const checkDetail = (status: number, tid: string, ssid: string) => {
    if (status === 1 || status === 2) {
        showMessage('正在检测中，无法查看安全报告', 'warning');
    } else if (status === 3) {
        router.push(`/detail/${tid}/${ssid}`);
    } else {
        showMessage('检测失败，无法查看安全报告', 'warning');
    }
};
</script>

<style lang='less' scoped>
.history {
    padding: 24px;

    .wrap {
        padding: 16px;
        background-color: #fff;
        color: @text-color;
    }

    img {
        width: 20px;
        border-radius: 50%;
        vertical-align: -5px;
    }

    .history_item {
        display: flex;
        align-items: center;
        height: 56px;
        padding: 0 16px;
        background-color: #F7F8FB;
        border-radius: 8px;
        margin: 8px 0;
        font-size: 14px;
        cursor: pointer;

        img {
            border-radius: 0;
        }

        .time:hover {
            text-decoration: underline;
            color: #6c87ff;
        }

        .user {
            display: inline-block;
            background-color: #EFF0F1;
            height: 20px;
            line-height: 20px;
            border-radius: 16px;
            padding-right: 5px;
        }

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
            vertical-align: middle;
            margin-left: 4px;

            i {
                color: #D83931;
            }
        }

        .tag {
            background: rgba(245, 74, 69, 0.2);
            border-radius: 4px;
            padding: 4px 6px;
            margin-right: 4px;
            font-size: 13px;
            color: #D83931;
        }

        .tag:nth-of-type(2) {
            background-color: rgba(255, 136, 0, 0.2);
            color: #DE7802;
        }

        .tag:nth-of-type(3) {
            background-color: rgba(31, 35, 41, 0.1);
            color: #646A73;
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

            i {
                font-size: 14px;
            }
        }
    }
}
</style>
