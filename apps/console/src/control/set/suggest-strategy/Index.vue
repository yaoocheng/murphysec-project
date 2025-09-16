<template>
    <div class="title">
        处置等级策略
    </div>
    <div class="desc">
        可自定义规则灵活设置缺陷组件的处置等级，并提供“兜底策略”来确保缺陷组件都能获得明确的处置等级划分，保障处置决策的优先级
    </div>
    <div class="filter_wrap">
        <SearchComp style="width: 240px;" v-model="filterOptions.keyword" clearable placeholder="请搜索策略名称" />

        <div v-if="userRole !== 'SAU'">
            <el-popconfirm popper-class="cancle-popper confirm-popper" v-if="selectData.length" title="确认删除？"
                           @confirm="deleteStrategyList(selectData.map((item) => item.id))">
                <template #reference>
                    <el-button class="minor_btn">删除 {{ selectData.length || '' }}</el-button>
                </template>
            </el-popconfirm>
            <el-button class="main_btn" @click="isShowEdit = true;editRowData=null">添加</el-button>
        </div>
    </div>

    <div class="g-f-14 g-color-3 g-mb-16 g-fw-400">
        共 <span class="g-color-1">{{ listData.length }}</span> 条数据
    </div>

    <div class="table_wrap">
        <el-table :data="listData" height="100%" @selection-change="selectHandle" :cell-style="{ height: '48px' }"
                  :header-cell-style="{ padding: '15px 0', border: 'none', background: '#F7F8FB', color: '#8F959E', fontWeight: 500 }">
            <el-table-column v-if="userRole !== 'SAU'" type="selection" width="30" />
            <el-table-column label="策略名称" prop="name" show-overflow-tooltip />
            <el-table-column label="策略开启" width="80">
                <template #default="scope">
                    {{ scope.row.is_open === 1 ? '已启用' : '已禁用' }}
                </template>
            </el-table-column>
            <el-table-column label="最近操作人" width="130">
                <template #default="scope">
                    <UserComp :name="scope.row.updated_user_name" />
                </template>
            </el-table-column>
            <el-table-column label="最近操作时间" width="160">
                <template #default="scope">
                    {{ formatDate(scope.row.updated_at) }}
                </template>
            </el-table-column>
            <el-table-column v-if="userRole !== 'SAU'" fixed="right" label="操作" width="160">
                <template #default="scope">
                    <div class="edit flex items-center">
                        <el-popconfirm @confirm="changeStrategyOpen(scope.row)"
                                       :title="`确认${scope.row.is_open === 1 ? '禁用' : '启用'}?`">
                            <template #reference>
                                <span
                                    :class="{ 'button-text-blue': scope.row.is_open === 2, 'button-text-red': scope.row.is_open === 1 }"
                                    class="g-mr-8">{{
                                        scope.row.is_open === 1 ?
                                            '禁用' : '启用'
                                    }}</span>
                            </template>
                        </el-popconfirm>

                        <span class="g-mr-8 button-text-blue" @click="editHandle(scope.row)">编辑</span>

                        <el-popconfirm popper-class="cancle-popper confirm-popper"
                                       @confirm="deleteStrategyList([scope.row.id])" :title="`确认删除?`">
                            <template #reference>
                                <span class="button-text-red" style="color: #F34D3D;">删除</span>
                            </template>
                        </el-popconfirm>
                    </div>
                </template>
            </el-table-column>

            <!-- <el-table-column v-else label="操作" width="80">
                <template #default="scope">
                    <span @click="checkInfo = true; checkItemInfo = scope.row" class="g-color-5 g-cursor-pointer">
                        查看
                    </span>
                </template>
            </el-table-column> -->
        </el-table>
    </div>
    <!-- 分页 -->
    <!-- <PageComp v-if="total>2" v-model:currentPage="curPage" :total="total" /> -->

    <StrategyEdit v-model="isShowEdit" v-if="isShowEdit" @updateList="getData();editRowData=null" :editRowData="editRowData" />
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import store from 'util/store';
import useList from 'util/hook';
import { formatDate, showMessage } from 'util/tools';
import { getDetectSuggestLevelListApi, delDetectSuggestLevelApi, saveDetectSuggestLevelApi } from 'api/set';
import UserComp from 'comp/UserComp.vue';
import StrategyEdit from './StrategyEdit.vue';
import SearchComp from '@/components/SearchComp.vue';
import { getOrgAuthInfo } from '@/control/org/hooks';

const isShowEdit = ref<boolean>(false);
const selectData = ref<Array<any>>([]);
const { userRole } = getOrgAuthInfo();
const editRowData = ref(null);

// 筛选
const filterOptions = ref<{
    team_id: string,
    keyword: string,
    page:1,
    limit: 3000,
}>({
    team_id: store.teamInfo.team_id,
    keyword: '',
    page: 1,
    limit: 3000,
});
const {
    listData, getData,
} = useList(getDetectSuggestLevelListApi, filterOptions);

// 删除策略
const deleteStrategyList = async (ids: Array<string>) => {
    if (ids.length) {
        await delDetectSuggestLevelApi({
            ids,
        });
        getData();
        showMessage('删除成功', 'success');
    }
};

// 多选
const selectHandle = (selection: any) => {
    selectData.value = selection;
};

// 策略开启
const changeStrategyOpen = async (row: any) => {
    // eslint-disable-next-line no-unused-expressions
    row.is_open === 1 ? row.is_open = 2 : row.is_open = 1;
    try {
        await saveDetectSuggestLevelApi({
            ...row,
            op_action: 'change_status',
        });
        // eslint-disable-next-line no-unused-expressions
        row.is_open === 1 ? showMessage('开启成功', 'success') : showMessage('禁用成功', 'success');
    } catch (error) {
        // eslint-disable-next-line no-unused-expressions
        row.is_open === 1 ? row.is_open = 2 : row.is_open = 1;
        console.log(error);
    }
};

// 编辑
const editHandle = (row:any) => {
    editRowData.value = row;
    isShowEdit.value = true;
};
</script>

<style lang='less' scoped>
.title {
    font-weight: 600;
    color: @text-color;
    margin-bottom: 8px;
}

.desc {
    font-size: 14px;
    color: #858585;
    margin-bottom: 24px;
}

.filter_wrap {
    margin-bottom: 16px;
    .between();

    .minor_btn {
        height: 32px;
        width: auto;
    }
}

.table_wrap {
    height: calc(100% - 180px);
    overflow: auto;

    .edit {
        color: #6c87ff;
        cursor: pointer;
    }
}
</style>
