<template>
    <div>
        <div class="top_btn g-mb-24">
            <span class="top_btn_item" @click="activeTab = 1" :class="{ 'active': activeTab === 1 }">二进制文件对比</span>
            <span class="top_btn_item" @click="activeTab = 2" :class="{ 'active': activeTab === 2 }">对比记录</span>
        </div>

        <div v-if="activeTab === 1" class="g-p-24 g-bdr-6 g-bg-f7">
            <div class="g-flex g-mb-24">
                <div class="g-flex-grow-1 g-mr-24">
                    <div class="g-color-1 g-fw-500 g-f-16  g-mb-16">主文件</div>
                    <UploadComp :type="1" :action="uploadApi()" @getFilePath="getFilePath">
                        支持ELF、PE类型的二进制文件，文件大小不超过1G
                    </UploadComp>
                </div>
                <div class="g-flex-grow-1">
                    <div class="g-color-1 g-fw-500 g-f-16 g-mb-16">对比文件</div>
                    <UploadComp :type="2" :action="uploadApi()" @getFilePath="getFilePath">
                        支持ELF、PE类型的二进制文件，文件大小不超过1G
                    </UploadComp>
                </div>
            </div>

            <div v-if="mainPath&&diffPath" class="g-flex g-justify-center">
                <MainBtn @click="startComparison" :styles="{
                    w: '128px',
                    h: '40px',
                    f: '16px'
                }">
                    开始对比分析
                </MainBtn>
            </div>
        </div>

        <div v-if="activeTab === 2">
            <div class="filter_wrap g-flex g-mb-16">
                <SearchComp v-model="listReqData.keyword" style="width: 240px;" clearable placeholder="请搜索文件名称" />
                <SelectComp v-model="listReqData.status" :options="statusOptions" style="width: 140px;"
                    placeholder="全部状态" />
                <MinorBtn @click="resetFilter">重置</MinorBtn>
            </div>

            <div class="table-wrap">
                <TableComp :data="listData">
                    <el-table-column width="250" show-overflow-tooltip label="主文件" prop="main_file"></el-table-column>
                    <el-table-column width="250" show-overflow-tooltip label="对比文件" prop="diff_file"></el-table-column>
                    <el-table-column label="相似度" prop="suggest">
                        <template #default="scope">
                            <div>
                                {{ scope.row.status === 3 ? Math.round(scope.row.similarity * 100) + '%' : '-' }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" prop="file" width="180">
                        <template #default="scope">
                            <StatusComp :bg="getDetectStatusInfo(scope.row.status).bg"
                                :c="getDetectStatusInfo(scope.row.status).c" :type="scope.row.status">
                                {{ getDetectStatusInfo(scope.row.status).text }}
                            </StatusComp>
                            <el-tooltip v-if="scope.row.status > 4" placement="top"
                                :content="getDetectStatus(scope.row.status)">
                                <span class="tanhao">
                                    <i class="murphy icon-tixing"></i>
                                </span>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column label="对比人 " prop="user">
                        <template #default="scope">
                            <UserComp :name="scope.row.user_name" />
                        </template>
                    </el-table-column>
                    <el-table-column width="180" label="对比时间" prop="created_at">
                        <template #default="scope">
                            {{ formatDate(scope.row.created_at) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template #default="scope">
                            <div v-if="scope.row.status === 3"
                                @click="isShowDetailModal = true; detailInfo = { main: scope.row.main_file, diff: scope.row.diff_file, sid: scope.row.subtask_id }"
                                class="g-color-5 g-cursor-pointer">
                                详情
                            </div>
                        </template>
                    </el-table-column>
                </TableComp>
            </div>

            <PageComp v-model:currentPage="curPage" :total="total" />

            <ComparisonModal :detailInfo="detailInfo" v-model="isShowDetailModal" v-if="isShowDetailModal" />
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import store from 'util/store';
import {
    showMessage, getDetectStatusInfo, formatDate, getDetectStatus,
} from 'util/tools';
import { uploadApi, startComparisonApi, getComparisonListApi } from 'api/detect';
import useList from 'util/hook';
import { statusOptions } from '../constants/constant';
import UploadComp from '../components/UploadComp.vue';
import ComparisonModal from '../components/ComparisonModal.vue';

const activeTab = ref<number>(1);
const isShowDetailModal = ref<boolean>(false);
const mainPath = ref<string>('');
const diffPath = ref<string>('');
const detailInfo = ref();
const listReqData = ref<{
    team_id: string,
    keyword: string,
    status: number,
    triggerReq: number,
}>({
    team_id: store.teamInfo.team_id,
    keyword: '',
    status: 0,
    triggerReq: 0,
});

const {
    total, curPage, listData,
} = useList(getComparisonListApi, listReqData);

const resetFilter = () => {
    Object.assign(listReqData.value, {
        keyword: '',
        status: 0,
    });
};

// 上传获取文件路径
const getFilePath = (data: any) => {
    if (data.type === 1) {
        mainPath.value = data.path;
    } else {
        diffPath.value = data.path;
    }
};

const startComparison = async () => {
    try {
        await startComparisonApi({
            team_id: store.teamInfo.team_id,
            main_file: mainPath.value,
            diff_file: diffPath.value,
        });
        showMessage('开始对比', 'success');
        activeTab.value = 2;
        listReqData.value.triggerReq++;
    } catch (error) {
        console.log(error);
    }
};
</script>

<style lang='less' scoped>
:deep(.el-upload-dragger) {
    height: 360px;
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
</style>
