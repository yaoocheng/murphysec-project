<template>
    <el-dialog width="860px" title="定时执行记录" :close-on-click-modal="false">
        <div class="change-org-content">
            <el-table :data="paginatedData" height="460px" :cell-style="{ padding: '14px 0' }"
                      :header-cell-style="{ padding: '14px 0', border: 'none', background: '#F7F8FB', color: '#8F959E', fontWeight: 400 }">
                <el-table-column width="160" prop="created_at" label="执行开始时间">
                    <template #default="scope">
                        <div>
                            {{ formatDate(scope.row.created_at) }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column width="160" prop="finish_at" label="执行结束时间">
                    <template #default="scope">
                        {{ scope.row.finish_at ? formatDate(scope.row.finish_at) : '-' }}
                    </template>
                </el-table-column>
                <el-table-column prop="project_num" label="任务数量" />
                <el-table-column width="320" label="检测状态">
                    <template #default="scope">
                        <div>
                            <el-tooltip :content="`队列/运行中`" placement="top">
                                <!-- <div v-if="scope.row.project_num - scope.row.succ_num - scope.row.cancel_num - scope.row.fail_num > 0"
                                    style="background-color: #7F3BF566;" class="g-flex-grow-1"></div> -->
                                <StatusComp class="g-mr-8" :type="1" :bg="'#7F3BF566'" :c="'#6425D0'">
                                    {{ scope.row.project_num - scope.row.succ_num - scope.row.cancel_num -
                                        scope.row.fail_num > 0 ? scope.row.project_num - scope.row.succ_num -
                                            scope.row.cancel_num - scope.row.fail_num : 0 }}
                                </StatusComp>
                            </el-tooltip>
                            <!-- <el-tooltip content="运行中：2334（14%）" placement="top">
                                <div style="background-color: #14C0FF66;" class="g-flex-grow-1"></div>
                            </el-tooltip> -->
                            <el-tooltip :content="`检测成功`" placement="top">
                                <StatusComp class="g-mr-8" :type="3" :bg="'#34C72466'" :c="'#2EA121'">
                                    {{ scope.row.succ_num || 0 }}
                                </StatusComp>
                                <!-- <div v-if="scope.row.succ_num" style="background-color: #34C72466;"
                                    class="g-flex-grow-1"></div> -->
                            </el-tooltip>
                            <el-tooltip :content="`检测取消`" placement="top">
                                <StatusComp class="g-mr-8" :type="8" :bg="'#1F23291A'" :c="'#646A73'">
                                    {{ scope.row.cancel_num || 0 }}
                                </StatusComp>
                                <!-- <div v-if="scope.row.cancel_num" style="background-color: #2A2C3233;"
                                    class="g-flex-grow-1"></div> -->
                            </el-tooltip>
                            <el-tooltip :content="`检测失败`" placement="top">
                                <StatusComp class="g-mr-8" :type="10" :bg="'#FF525266'" :c="'#D83931'">
                                    {{ scope.row.fail_num || 0 }}
                                </StatusComp>
                                <!-- <div v-if="scope.row.fail_num" style="background-color: #FF525266;"
                                    class="g-flex-grow-1"></div> -->
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="执行状态">
                    <template #default="scope">
                        <div v-if="scope.row.project_num !== -1">
                            <div style="color: #38C728;" v-if="scope.row.status === 'finish'">已完成</div>
                            <div style="color: #049FD7;" v-if="scope.row.status === 'running'">运行中</div>
                            <div style="color: #F34D3D;" v-if="scope.row.status === 'fail'">已失败</div>
                        </div>
                        <div v-else>-</div>
                    </template>
                </el-table-column>
            </el-table>
            <PageComp v-if="listData.length > 10"
                      v-model:current-page="currentPage"
                      :total="listData.length"
                      @current-change="handleCurrentChange"
            />
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
import { formatDate } from 'util/tools';
import { timeExcRecordApi } from 'api/detect';
import { ref, computed } from 'vue';
import { detectInfo } from 'util/store';
import PageComp from '@/components/PageComp.vue';

const listData = ref<Array<any>>([]);
const currentPage = ref(1);
const pageSize = ref(10);

// 计算分页后的数据
const paginatedData = computed(() => {
    const startIndex = (currentPage.value - 1) * pageSize.value;
    const endIndex = startIndex + pageSize.value;
    return listData.value.slice(startIndex, endIndex);
});

// 处理页码变化
const handleCurrentChange = (val: number) => {
    currentPage.value = val;
};

const getExcRecord = async () => {
    try {
        const { data } = await timeExcRecordApi({
            team_config_id: detectInfo.team_config_id,
        });
        listData.value = data.data;
    } catch (error) {
        console.log(error);
    }
};
getExcRecord();
</script>
