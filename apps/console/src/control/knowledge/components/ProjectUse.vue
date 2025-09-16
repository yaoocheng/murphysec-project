<template>
    <div class="table-container overflow-auto flex justify-center" style="height: calc(100vh - 295px);">
        <div v-if="total" class="w-full">
            <div class="text-sm text-85 mb-3">
                <span>共 <span class="g-color-1">{{ total }}</span> 条数据</span>
            </div>

            <div style="height: calc(100% - 80px);">
                <el-table height="100%" :data="listData" :cell-style="{ padding: '12px 0', color: '#3c3c3c' }"
                    :header-cell-style="{ padding: '12px 0', border: 'none', background: '#F7F8FB', color: '#8F959E', fontWeight: 400 }">
                    <!-- 项目名称 -->
                    <el-table-column prop="projectName" label="项目名称" show-overflow-tooltip>
                        <template #default="scope">
                            <div class="flex items-center">
                                <img class="mr-2 w-5" :src="getAccessImg(scope.row.access_type)" alt="">

                                <span class="ellipsis  cursor-pointer">
                                    <a class="hover:underline hover:text-primary text-3c"
                                        :href="`/console/detail/${scope.row.project_id}/${scope.row.subtask_id}`"
                                        target="_blank">
                                        {{ scope.row.project_name }}
                                    </a>
                                </span>
                            </div>
                        </template>
                    </el-table-column>

                    <!-- 所属团队 -->
                    <el-table-column v-if="store.isAllTeam" prop="team" label="所属团队" width="140">
                        <template #default="scope">
                            <span>{{ scope.row.team_name[0] }}</span>
                        </template>
                    </el-table-column>

                    <!-- 最新检测时间 -->
                    <el-table-column prop="latestCheckTime" label="最新检测时间" width="156">
                        <template #default="scope">
                            <span>{{ formatDate(scope.row.update_time) }}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <PageComp v-model:currentPage="curPage" :total="total" :page-size="10" />
        </div>

        <div v-else class="self-center">
            <NoData description="暂未被项目使用" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { getUseProjectListApi } from 'api/knowledge';
import { useRoute } from 'vue-router';
import store from 'util/store';
import { formatDate, getAccessImg } from '@/utils/tools';
import useList from '@/utils/hook';

const route = useRoute();

const filters = ref({
    limit: 10,
    team_id: store.teamInfo.team_id,
    name: route.query.name,
    ecosystem: route.query.ecosystem,
    repository: route.query.repository,
    version: route.query.version,
});

const {
    listData, curPage, total,
} = useList(getUseProjectListApi, filters);
</script>
