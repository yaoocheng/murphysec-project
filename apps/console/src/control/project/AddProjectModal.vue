<template>
    <el-dialog width="600px" title="添加项目" @closed="emits('update:modelValue', false)" :close-on-click-modal="false">
        <div class="add_project_modal">
            <div class="search">
                <SearchComp style="width: 100%;" v-model="filterOptions.keyword" clearable placeholder="搜索项目名称" />
            </div>
            <div class="table_wrap">
                <el-table :data="listData" height="100%" @selection-change="selectHandle"
                    :header-cell-style="{ padding: '15px 0', border: 'none', background: '#F7F8FB', color: '#8F959E', fontWeight: 500 }">
                    <el-table-column type="selection" width="30" />
                    <el-table-column label="项目名称" width="320" show-overflow-tooltip>
                        <template #default="scope">
                            <div class="project_name">
                                <!-- <img src="~ast/logos/github.png" alt=""> -->
                                {{ (scope as any).row.name }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="最新检测时间">
                        <template #default="scope">
                            <div>
                                {{ formatDate((scope as any).row.created_at) }}
                            </div>
                        </template>
                    </el-table-column>

                    <template #append>
                        <!-- 分页 -->
                        <div class="pagination" v-if="total>0">
                            <el-pagination v-model:currentPage="curPage" background small :page-size="20"
                                layout="total, prev, pager, next" :total="total">
                            </el-pagination>
                        </div>
                    </template>
                </el-table>
            </div>

            <div class="btns">
                <el-button class="cancle_btn w-20" @click="emits('update:modelValue', false)">取消</el-button>
                <el-button class="w-20" @click="confirmHandle">确认</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import useList from 'util/hook';
import { getConsoleProjectListApi, classAddProjectApi } from 'api/project';
import SearchComp from 'comp/SearchComp.vue';
import store from '@/utils/store';
import { formatDate } from '@/utils/tools';

const props = defineProps(['id']);
const emits = defineEmits(['update:modelValue', 'addProject']);
// 筛选
const filterOptions = ref<{
    team_id: string,
    keyword: string,
    current_projects_id: string,
}>({
    team_id: store.teamInfo.team_id,
    keyword: '',
    current_projects_id: props.id,
});
const {
    total, curPage, listData,
} = useList(getConsoleProjectListApi, filterOptions);

const selectData = ref<Array<any>>([]);
const selectHandle = (selection: any) => {
    selectData.value = selection;
};

const confirmHandle = async () => {
    const data = selectData.value.map((item) => item.id);
    try {
        await classAddProjectApi({
            projects_id: props.id,
            task_ids: data,
        });
        emits('update:modelValue', false);
        emits('addProject');
        // delayReload('添加成功', 'success');
    } catch (error) {
        console.log(error);
    }
};
</script>

<style lang='less' scoped>
.add_project_modal {
    height: 460px;

    .search {
        margin-bottom: 16px;
    }

    .project_name {
        color: #3c3c3c;
        padding: 10px 0;
    }

    img {
        width: 20px;
        border-radius: 50%;
        vertical-align: -5px;
    }

    .table_wrap {
        height: calc(100% - 100px);
    }

    .btns {
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
    }
}
</style>
