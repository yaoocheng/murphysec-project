<template>
    <div class="filter_wrap">
        <div>
            <SearchComp style="width: 240px;" v-model="filterOptions.keyword" clearable placeholder="请搜索ID/模板名称" />
            <el-select filterable style="margin-right: 8px; width: 150px;" v-model="filterOptions.filter_org_id"
                       placeholder="所属组织">
                <el-option v-for="item in lowOrgList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
            <el-button @click="resetHandle" class="minor_btn">重置</el-button>
        </div>

        <!-- <div v-if="userRole !== 'SAU'">
            <el-popconfirm popper-class="cancle-popper confirm-popper" v-if="selectData.length" title="确认删除？"
                @confirm="deleteStrategyList(selectData.map((item) => item.id))">
                <template #reference>
                    <el-button class="minor_btn">删除 {{ selectData.length || '' }}</el-button>
                </template>
            </el-popconfirm>
            <el-button @click="isAddModal = true;">添加</el-button>
        </div> -->
    </div>

    <div class="g-f-14 g-color-3 g-mb-16 g-fw-400">
        共 <span class="g-color-1">{{ listData.length }}</span> 条数据
    </div>

    <div class="table_wrap">
        <el-table :data="listData" height="100%" :cell-style="{ height: '48px' }"
                  :header-cell-style="{ padding: '15px 0', border: 'none', background: '#F7F8FB', color: '#8F959E', fontWeight: 500 }">
            <el-table-column label="ID" prop="id" width="200">
            </el-table-column>
            <el-table-column label="模板名称" width="300" prop="name" show-overflow-tooltip />

            <el-table-column label="模板开关">
                <template #default="scope">
                    {{ scope.row.is_open === 1 ? '已启用' : '已禁用' }}
                </template>
            </el-table-column>
            <el-table-column label="所属组织" width="140" prop="org_name" show-overflow-tooltip />
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

            <el-table-column v-if="userRole !== 'SAU'" fixed="right" label="操作" width="60">
                <template #default="scope">
                    <span class="g-mr-8 g-color-5 g-cursor-pointer button-text-blue" @click="editData=scope.row;isAddModal=true">查看</span>

                    <!-- <div class="edit">
                        <el-popconfirm @confirm="changeStrategyOpen(scope.row)"
                            :title="`确认${scope.row.is_open === 1 ? '禁用' : '启用'}?`">
                            <template #reference>
                                <span :style="{ color: scope.row.is_open === 1 ? '#F34D3D' : '#6c87ff' }"
                                    class="g-mr-8">{{
                scope.row.is_open === 1 ?
                    '禁用' : '启用'
            }}</span>
                            </template>
                        </el-popconfirm>

                        <span class="g-mr-8" @click="editData=scope.row;isAddModal=true">编辑</span>

                        <el-popconfirm popper-class="cancle-popper confirm-popper"
                            @confirm="deleteStrategyList([scope.row.id])" :title="`确认删除?`">
                            <template #reference>
                                <span style="color: #F34D3D;">删除</span>
                            </template>
                        </el-popconfirm>
                    </div> -->
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <!-- <PageComp v-model:currentPage="curPage" :total="total" :page-size="20" /> -->
    </div>
    <TempInfo v-model="isAddModal" :showInfo="editData" />
</template>

<script setup lang='ts'>
import { ref, onBeforeMount } from 'vue';
import store from 'util/store';
import useList from 'util/hook';
import { formatDate } from 'util/tools';
import { getDetectTempListApi } from 'api/set';
import UserComp from 'comp/UserComp.vue';
import { lowOrgListApi } from 'api/org';
import TempInfo from './TempInfo.vue';

import SearchComp from '@/components/SearchComp.vue';
// import PageComp from '@/components/PageComp.vue';
import { getOrgAuthInfo } from '@/control/org/hooks';

const { userRole } = getOrgAuthInfo();
const isAddModal = ref(false);
const editData = ref();

// 筛选
const filterOptions = ref<{
    team_id: string,
    keyword: string,
    limit: number,
    page: number,
    filter_org_id: number|undefined,
    list_type: string,
}>({
    team_id: store.teamInfo.team_id,
    keyword: '',
    limit: 1000,
    page: 1,
    filter_org_id: undefined,
    list_type: 'child_org',

});
const {
    listData,
} = useList(getDetectTempListApi, filterOptions);

const lowOrgList = ref<any[]>([]);
onBeforeMount(async () => {
    try {
        const { data } = await lowOrgListApi(Number(window.localStorage.getItem('stra-reset-org-id')) || store.teamInfo.org_id);
        lowOrgList.value = data;
    } catch (error) {
        console.log(error);
    }
});

const resetHandle = () => {
    Object.assign(filterOptions.value, {
        keyword: '',
        org_id: Number(window.localStorage.getItem('stra-reset-org-id')) || store.teamInfo.org_id,
        filter_org_id: undefined,
    });
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
    height: calc(100% - 85px);
    // overflow: auto;

    .edit {
        color: #6c87ff;
        cursor: pointer;
    }
}
</style>
