<template>
    <div class="filter">
        <div>
            <SearchComp v-model="filterOptions.keyword" clearable placeholder="请搜索项目组名称" />
            <el-select v-if="store.isAllTeam" style="margin-right: 8px; width: 160px;" v-model="filterOptions.team_id"
                       placeholder="请选择团队">
                <el-option v-for="item in store.teamList" :key="item.id" :label="item.team_name" :value="item.id" />
            </el-select>
        </div>
        <el-button v-if="!store.isAllTeam" @click="isShowCreateClassModal = true">
            <i class="murphy icon-xinjian"></i>
            新建项目组
        </el-button>
    </div>

    <div class="table_wrap project-class-wrap">
        <el-table :data="listData"
                  :header-cell-style="{ padding: '14px 0', border: 'none', background: '#F7F8FB', color: '#8F959E', fontWeight: 500 }"
                  style="width: 100%">
            <el-table-column width="200" label="项目组名称" show-overflow-tooltip>
                <template #default="scope">
                    <div class="project_name" @click="$router.push(`/project/list?class=${scope.row.id}`)">
                        {{ (scope as any).row.name }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column width="140" v-if="store.isAllTeam" label="所属团队" prop="team_name" show-overflow-tooltip />
            <el-table-column label="项目数" prop="project_count">
                <template #default="scope">
                    <span @click="$router.push(`/project/list?class=${scope.row.id}`)">{{
                        scope.row.project_count }}</span>
                </template>
            </el-table-column>
            <el-table-column label="创建人" width="120">
                <template #default="scope">
                    <div class="user">
                        <UserComp :name="(scope).row.created_user_name" />
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="time" width="180">
                <template #default="scope">
                    <span>
                        {{ formatDate((scope as any).row.created_at) }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="组件总数" width="120">
                <template #default="scope">
                    <span>
                        {{ scope.row.rely_num }}
                        <el-tooltip placement="top">
                            <span class="hover_icon" style="height: 14px;line-height: 14px;">
                                <i style="color: #6C87FF; font-size: 12px;" class="murphy icon-tishishuoming"></i>
                            </span>
                            <template #content>
                                <div style="font-size: 12px">
                                    缺陷组件：{{ scope.row.strong_num + scope.row.recommend_num + scope.row.optional_num
                                    }}<br />
                                    强烈建议：{{ scope.row.strong_num }} 建议：{{ scope.row.recommend_num }} 可选：{{
                                        scope.row.optional_num }}
                                </div>
                            </template>
                        </el-tooltip>
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="许可证数量" width="120">
                <template #default="scope">
                    <span>
                        {{ scope.row.license_num }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="漏洞总数" width="120">
                <template #default="scope">
                    <span>
                        {{ scope.row.vuln_critical_num + scope.row.vuln_high_num + scope.row.vuln_medium_num +
                            scope.row.vuln_low_num }}
                        <el-tooltip placement="top">
                            <span class="hover_icon" style="height: 14px;line-height: 14px;">
                                <i style="color: #6C87FF; font-size: 12px;" class="murphy icon-tishishuoming"></i>
                            </span>
                            <template #content>
                                <div style="font-size: 12px">
                                    严重：{{ scope.row.vuln_critical_num }} &nbsp; 高危：{{ scope.row.vuln_high_num }} &nbsp;
                                    中危：{{ scope.row.vuln_medium_num }} &nbsp; 低危：{{ scope.row.vuln_low_num }}
                                </div>
                            </template>
                        </el-tooltip>
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="210">
                <template #default="scope">
                    <div class="item cursor-pointer">
                        <span class="text-primary mr-2" v-if="!store.isAllTeam"
                              @click="isShowAddProjectModal = true; operateProjectsId = (scope as any).row.id">添加项目</span>
                        <span class="text-primary mr-2" @click="isShowExportModal = true;operateProjectsId=scope.row.id">导出</span>
                        <span class="text-primary mr-2"
                              @click="isShowResetNameModal = true; oldName = (scope as any).row.name; operateProjectsId = (scope as any).row.id"
                              v-if="!store.isAllTeam">重命名</span>
                        <span class="text-err" v-if="!store.isAllTeam"
                              @click="isShowDeleteModal = true; operateProjectsId = (scope as any).row.id">删除</span>
                    </div>
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

    <ExportProjectClassModal v-model="isShowExportModal" :id="operateProjectsId" v-if="isShowExportModal" />
    <AddProjectModal v-model="isShowAddProjectModal" @addProject="addProject" :id="operateProjectsId" v-if="isShowAddProjectModal" />
    <CreateProjectClassModal v-model="isShowCreateClassModal" v-if="isShowCreateClassModal" />
    <DeleteClassModal v-model="isShowDeleteModal" :id="operateProjectsId" v-if="isShowDeleteModal" />
    <ResetNameModal v-model="isShowResetNameModal" :id="operateProjectsId" v-if="isShowResetNameModal"
                    :oldName="oldName" />
    <!-- <ChangeImgModal v-model="isShowChangeImgModal" v-if="isShowChangeImgModal" /> -->
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { getProjectClassListApi } from 'api/project';
import { formatDate, showMessage } from 'util/tools';
import store from 'util/store';
import useList from 'util/hook';
import UserComp from 'comp/UserComp.vue';
// import { getOrgAuthInfo } from '@/control/org/hooks';
import SearchComp from '@/components/SearchComp.vue';
import AddProjectModal from './AddProjectModal.vue';
import CreateProjectClassModal from './CreateClassModal.vue';
import ExportProjectClassModal from './ExportProjectClassModal.vue';
import DeleteClassModal from './DeleteClassModal.vue';
import ResetNameModal from './ResetNameModal.vue';

const isShowAddProjectModal = ref<boolean>(false);
const isShowCreateClassModal = ref<boolean>(false);
// const isShowChangeImgModal = ref<boolean>(false);
const isShowDeleteModal = ref<boolean>(false);
const isShowResetNameModal = ref<boolean>(false);
const operateProjectsId = ref<string>('');
const oldName = ref<string>('');
const isShowExportModal = ref<boolean>(false);
// const {
//     userRole, ownerOrgIDList, isUserSpace,
// } = getOrgAuthInfo();

const filterOptions = ref<{
    keyword: string,
    team_id: string,
}>({
    keyword: '',
    team_id: store.teamInfo.team_id,
});

const {
    total, curPage, listData, getData,
} = useList(getProjectClassListApi, filterOptions);

const addProject = () => {
    getData();
    showMessage('添加成功', 'success');
};
// 导出
// const exportClassHandles = async (id: string) => {
//     await exportClassApi({
//         projects_id: id,
//     });
//     showMessage('正在导出中，请在导出管理查看', 'success');
// };
</script>

<style lang='less' scoped>
.filter {
    background: #FFFFFF;
    border-radius: 4px;
    padding: 16px;
    margin-bottom: 16px;
    .between();

    i {
        margin-right: 6px;
    }
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

    .project_name {
        &:hover {
            color: #6c87ff;
        }

        cursor: pointer;
        color: #3c3c3c;
        padding: 10px 0;
    }

    img {
        width: 20px;
        border-radius: 50%;
        vertical-align: -6px;
        margin: 2px 0 2px 2px;
    }

    .user {
        display: inline-block;
        background-color: #EFF0F1;
        // height: 24px;
        // line-height: 24px;
        border-radius: 16px;
        padding-right: 6px;
        max-width: 100px;
        .ellipsis();
    }

    .add {
        &:hover {
            background-color: #EBEBEB;
        }

        width: 28px;
        padding: 3px 6px;
        display: inline-block;
        box-sizing: border-box;
        border-radius: 6px;
        cursor: pointer;

        i {
            font-size: 14px;
        }
    }
}
</style>

<style lang="less">
.project-class-wrap .el-table .cell {
    padding: 0 16px;
}
</style>
