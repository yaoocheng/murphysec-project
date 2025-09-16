<template>
    <CommonHead>
        <span>导出管理</span>
    </CommonHead>

    <div class="export_index main_content">
        <div class="filter_wrap">
            <div style="display: flex;align-items: center;">
                <SearchComp style="width: 200px;" clearable v-model="filterOptions.project_name"
                            placeholder="请搜索报告名称" />
                <el-select v-if="store.isAllTeam" filterable style="margin-right: 8px; width: 140px;"
                           v-model="filterOptions.team_id" placeholder="请选择团队">
                    <el-option v-for="item in store.teamList" :key="item.id" :label="item.team_name" :value="item.id" />
                </el-select>
                <SelectComp style="width: 140px;" v-model="filterOptions.ext_type" :options="formatOptions"
                            placeholder="导出格式" />
                <SelectComp style="width: 140px;" v-model="filterOptions.export_type" :options="typeOptions"
                            placeholder="导出类型" />
                <SelectComp style="width: 140px;" v-model="filterOptions.status" :options="statusOptions"
                            placeholder="导出状态" />
                <el-date-picker style="width: 200px;" v-model="filterOptions.export_time" type="daterange" clearable
                                range-separator="—" start-placeholder="开始时间" end-placeholder="结束时间" />
                <el-button class="minor_btn" @click="resetHandle"
                           style="width: auto; height: 32px;margin-left: 16px;">重置</el-button>
            </div>
        </div>

        <div class="table_wrap">
            <div class="g-f-14 g-color-3 g-fw-400 g-mb-16">
                共 <span class="text-3c">{{ total }} </span> 条数据
            </div>
            <el-table :data="listData" :cell-style="{ padding: '2px 8px', color: '#3c3c3c' }"
                      :header-cell-style="{ padding: '12px 8px', border: 'none', background: '#F7F8FB', color: '#8F959E', fontWeight: 500 }">

                <el-table-column label="报告名称" show-overflow-tooltip>
                    <template #default="scope">
                        {{ scope.row.project_name || '-' }}
                    </template>
                </el-table-column>

                <el-table-column v-if="store.isAllTeam" label="所属团队" prop="team_name" show-overflow-tooltip />

                <el-table-column label="导出类型" width="130">
                    <template #default="scope">
                        <div>
                            {{ typeOptions.filter(item => item.value === scope.row.export_type)[0]?.label }}
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="导出格式" width="">
                    <template #default="scope">
                        <div>
                            {{ formatOptions.filter(item => item.value === scope.row.ext_type)[0]?.label }}
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="导出状态" prop="status" width="140">
                    <template #default="scope">
                        <span v-if="scope.row.status === 1" class="status"
                              style=" background: #7F3BF533;color: #6425D0;">
                            <i class="murphy icon-shijian"></i>
                            导出中...
                        </span>
                        <span v-if="scope.row.status === 2" class="status"
                              style=" background: #34C72433;color: #2EA121;">
                            <i class="murphy icon-wancheng2"></i>
                            导出成功
                        </span>
                        <span v-if="scope.row.status === 3" class="status"
                              style=" background: #1F23291A;color: #646A73;">
                            <i class="murphy icon-cuowu"></i>
                            导出失败
                        </span>
                    </template>
                </el-table-column>

                <el-table-column label="导出人" width="140">
                    <template #default="scope">
                        <span class="member">
                            <UserComp :name="scope.row.user_name" />
                        </span>
                    </template>
                </el-table-column>

                <el-table-column label="导出时间" width="180">
                    <template #default="scope">
                        <div style="padding: 10px 0;">
                            {{ formatDate(scope.row.created_at) }}
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="120">
                    <template #default="scope">
                        <div class="flex items-center">
                            <span @click="downloadFile(downloadExportUrl, scope.row.id, scope.row.file_path)"
                                  class="button-text-blue" v-if="scope.row.status === 2">
                                <!-- class="operate text-primary" v-if="scope.row.status === 2"> -->
                                下载
                            <!-- <a :href="downloadExportUrl(scope.row.id)" target="_blank">下载</a> -->
                            </span>
                            <el-popconfirm title="确认删除？" popper-class="cancle-popper confirm-popper"
                                           @confirm="deleteExportHandle(scope.row.id)">
                                <template #reference>
                                    <!-- <span class="operate text-err">删除</span> -->
                                    <span class="button-text-red">删除</span>
                                </template>
                            </el-popconfirm>
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
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import store from 'util/store';
import { getExportListApi, downloadExportUrl, deleteExportApi } from 'api/asset';
import SearchComp from 'comp/SearchComp.vue';
import SelectComp from 'comp/SelectComp.vue';
import useList from 'util/hook';
import UserComp from 'comp/UserComp.vue';
import { formatDate, downloadFile } from '@/utils/tools';
import CommonHead from '@/components/CommonHead.vue';
import { formatOptions, typeOptions, statusOptions } from './constants';

const filterOptions = ref<{
    team_id: string,
    project_name: string,
    ext_type: number | undefined,
    export_type: number | undefined,
    status: number | undefined,
    export_time: Array<string>,
    org_id: number
}>({
    team_id: store.teamInfo.team_id,
    project_name: '',
    ext_type: undefined,
    export_type: undefined,
    status: undefined,
    export_time: [],
    org_id: store.teamInfo.team_id === '-1' ? store.teamInfo.org_id : 0,
});

const {
    total, curPage, listData, getData,
} = useList(getExportListApi, filterOptions);

const resetHandle = () => {
    Object.assign(filterOptions.value, {
        org_id: store.teamInfo.team_id === '-1' ? store.teamInfo.org_id : 0,
        project_name: '',
        ext_type: undefined,
        export_type: undefined,
        status: undefined,
        export_time: [],
        team_id: store.teamInfo.team_id,
    });
};

const deleteExportHandle = async (id: string) => {
    try {
        await deleteExportApi({ id });
        getData();
    } catch (error) {
        console.log(error);
    }
};

</script>

<style lang='less' scoped>
.export_index {
    padding: 24px;

    .filter_wrap {
        .between();
        background: #FFFFFF;
        border-radius: 4px;
        padding: 16px;
        margin-bottom: 16px;
        height: 64px;
        box-sizing: border-box;

        .export {
            width: 80px;
        }
    }

    .table_wrap {
        padding: 16px;
        background-color: #fff;
        border-radius: 6px;
        height: calc(100% - 80px);
        overflow: auto;
        box-sizing: border-box;

        .status {
            padding: 5px 8px;
            font-size: 12px;
            border-radius: 4px;

            i {
                font-size: 14px;
                vertical-align: -1px;
            }
        }

        .operate {
            margin-right: 12px;
            cursor: pointer;
        }
    }
}
</style>
