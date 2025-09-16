<template>
    <div class="filter_wrap">
        <div>
            <SearchComp style="width: 240px;" v-model="filterOptions.keyword" clearable placeholder="请搜索ID/模板名称" />
        </div>

        <div v-if="userRole !== 'SAU'">
            <el-popconfirm popper-class="cancle-popper confirm-popper" v-if="selectData.length" title="确认删除？"
                           @confirm="deleteStrategyList(selectData.map((item) => item.id))">
                <template #reference>
                    <el-button style="width: 80px;" class="minor_btn">删除 {{ selectData.length || '' }}</el-button>
                </template>
            </el-popconfirm>
            <el-button class="main_btn" @click="isAddModal = true;editData=null">添加</el-button>
        </div>
    </div>

    <div class="g-f-14 g-color-3 g-mb-16 g-fw-400">
        共 <span class="g-color-1">{{ listData.length }}</span> 条数据
    </div>

    <div class="table_wrap">
        <el-table :data="listData" height="100%" @selection-change="selectHandle" :cell-style="{ height: '48px' }"
                  :header-cell-style="{ padding: '15px 0', border: 'none', background: '#F7F8FB', color: '#8F959E', fontWeight: 500 }">
            <el-table-column type="selection" width="30" />
            <el-table-column label="ID" prop="id" width="200">
            </el-table-column>
            <el-table-column label="模板名称" prop="name" width="300" show-overflow-tooltip />

            <el-table-column label="模板开关">
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

            <el-table-column v-if="userRole !== 'SAU'" fixed="right" label="操作" width="140">
                <template #default="scope">
                    <div class="edit flex items-center">
                        <el-popconfirm @confirm="changeStrategyOpen(scope.row)"
                                       :title="`确认${scope.row.is_open === 1 ? '禁用' : '启用'}?`">
                            <template #reference>
                                <span :class="scope.row.is_open === 1 ? 'button-text-red' : 'button-text-blue'">
                                    {{ scope.row.is_open === 1 ? '禁用' : '启用' }}
                                </span>
                            </template>
                        </el-popconfirm>

                        <span class="button-text-blue" @click="editData=scope.row;isAddModal=true">编辑</span>

                        <el-popconfirm popper-class="cancle-popper confirm-popper"
                                       @confirm="deleteStrategyList([scope.row.id])" :title="`确认删除?`">
                            <template #reference>
                                <span class="button-text-red">删除</span>
                            </template>
                        </el-popconfirm>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <!-- <PageComp v-model:currentPage="curPage" :total="total" :page-size="20" /> -->
    </div>

    <EditTemp v-model="isAddModal" v-if="isAddModal" :editData="editData" @triggerEdit="triggerEdit" />
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import store from 'util/store';
import useList from 'util/hook';
import { formatDate, showMessage } from 'util/tools';
import {
    getDetectTempListApi, delDetectTempApi, openDetectTempApi, addDetectTempApi,
} from 'api/set';
import UserComp from 'comp/UserComp.vue';
import SearchComp from '@/components/SearchComp.vue';
// import PageComp from '@/components/PageComp.vue';
import { getOrgAuthInfo } from '@/control/org/hooks';
import EditTemp from './EditTemp.vue';

const { userRole } = getOrgAuthInfo();
const selectData = ref<Array<any>>([]);
const isAddModal = ref(false);
const editData = ref();

// 筛选
const filterOptions = ref<{
    team_id: string,
    keyword: string,
    limit: number,
    page: number,
    list_type: string,
}>({
    team_id: store.teamInfo.team_id,
    keyword: '',
    limit: 1000,
    page: 1,
    list_type: 'current_team',
});
const {
    listData, getData,
} = useList(getDetectTempListApi, filterOptions);

// 删除策略
const deleteStrategyList = async (ids: Array<string>) => {
    if (ids.length) {
        await delDetectTempApi({
            ids,
        });
        getData();
        showMessage('删除成功', 'success');
    }
};

// 策略开启
const changeStrategyOpen = async (row: any) => {
    const open = row.is_open !== 1;
    try {
        await openDetectTempApi({
            id: row.id,
            is_open: open,
        });
        // eslint-disable-next-line no-unused-expressions
        open ? showMessage('开启成功', 'success') : showMessage('禁用成功', 'success');
        getData();
    } catch (error) {
        console.log(error);
    }
};

// 多选
const selectHandle = (selection: any) => {
    selectData.value = selection;
};

const triggerEdit = async (data: any) => {
    if (data) {
        try {
            await addDetectTempApi(data);
            getData();
            showMessage(`${data.id === '0' ? '添加' : '编辑'}成功`, 'success');
        } catch (error) {
            console.log(error);
        }
    }
    isAddModal.value = false;
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
    height: calc(100% - 95px);
    // overflow: auto;

    .edit {
        color: #6c87ff;
        cursor: pointer;
    }
}
</style>
