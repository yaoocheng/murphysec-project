<template>
    <el-dialog width="600px" title="添加至项目组" @closed="emits('update:modelValue', false)" :close-on-click-modal="false">
        <div class="add_project_modal">
            <div class="search">
                <SearchComp style="width: 100%;" v-model="filterOptions.keyword" clearable placeholder="搜索项目组名称" />
            </div>
            <div class="table_wrap">
                <el-table ref="tableRef" highlight-current-row :data="listData" height="100%"
                          @selection-change="selectHandle"
                          :header-cell-style="{ padding: '15px 0', border: 'none', background: '#F7F8FB', color: '#8F959E', fontWeight: 500 }">
                    <el-table-column type="selection" width="30" />
                    <el-table-column label="项目组名称" width="320" show-overflow-tooltip>
                        <template #default="scope">
                            <div class="project_name">
                                {{ (scope as any).row.name }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="项目数">
                        <template #default="scope">
                            <div>
                                <span>{{ scope.row.project_count }}</span>
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
                <el-button class="cancle_btn" @click="emits('update:modelValue', false)">取消</el-button>
                <el-button @click="confirmHandle">确认</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang='ts'>
import { ref, watch } from 'vue';
import useList from 'util/hook';
import { getProjectClassListApi, projectAddClassApi } from 'api/project';
import SearchComp from 'comp/SearchComp.vue';
import store from '@/utils/store';
import { showMessage } from '@/utils/tools';

const props = defineProps(['tid']);
const emits = defineEmits(['update:modelValue']);
const tableRef = ref<any>();
const selectData = ref<Array<any>>([]);

// 筛选
const filterOptions = ref<{
    team_id: string,
    keyword: string,
    project_id: string,
}>({
    team_id: store.teamInfo.team_id,
    keyword: '',
    project_id: props.tid,
});
const {
    total, curPage, listData,
} = useList(getProjectClassListApi, filterOptions);

// 默认选中
watch(listData, (newVal) => {
    const timer = setTimeout(() => {
        newVal.forEach((item, index) => {
            if (item.checked) {
                tableRef.value.toggleRowSelection(tableRef.value.data[index], true);
            }
        });
        clearTimeout(timer);
    }, 500);
});

const selectHandle = (selection: any) => {
    selectData.value = selection;
};

const confirmHandle = async () => {
    if (!selectData.value.length) {
        showMessage('至少选择一个项目组', 'warning');
        return;
    }
    const data = selectData.value.map((item) => item.id);
    try {
        await projectAddClassApi({
            projects_ids: data,
            project_id: props.tid,
        });
        showMessage('添加成功', 'success');
        window.location.reload();
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
