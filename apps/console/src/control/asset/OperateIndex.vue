<template>
    <CommonHead>
        <span>操作日志</span>
    </CommonHead>

    <div class="main_content g-p-24">
        <div class="filter_wrap g-flex">
            <SearchComp style="width: 240px;" clearable v-model="filterOptions.keyword" placeholder="请搜索操作内容" />
            <el-select v-if="store.isAllTeam" filterable style="margin-right: 8px; width: 150px;"
                v-model="filterOptions.team_id" placeholder="请选择团队">
                <el-option v-for="item in store.teamList" :key="item.id" :label="item.team_name" :value="item.id" />
            </el-select>
            <SelectComp placeholder="请选择操作模块" v-model="filterOptions.type_name" :options="typesOptions" style="width: 150px;" />
            <el-button @click="resetHandle" class="minor_btn" style="width: auto; height: 32px;margin-left: 12px;">重置</el-button>
        </div>

        <div class="table_wrap">
            <el-table :data="listData" :cell-style="{padding: '8px 8px'}"
                :header-cell-style="{ padding: '15px 8px', border: 'none', background: '#F7F8FB', color: '#8F959E', fontWeight: 500 }">
                <el-table-column label="操作时间" width="160" show-overflow-tooltip>
                    <template #default="scope">
                        <div class="g-pt-8 g-pb-8">
                            {{ formatDate(scope.row.created_at) }}
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="操作人" width="120">
                    <template #default="scope">
                        <span class="member">
                            <UserComp :name="scope.row.user_name" />
                        </span>
                    </template>
                </el-table-column>

                <el-table-column label="所属团队" prop="team_name" show-overflow-tooltip />

                <el-table-column label="所属组织" prop="org_name">
                    <template #default="scope">
                        <div>
                            {{ scope.row.org_name || '-' }}
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="操作模块" prop="type_name" show-overflow-tooltip />

                <el-table-column label="操作内容" prop="desc" width="400" />

                <el-table-column label="操作IP" prop="ip_addr" />

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
import { ref, onBeforeMount } from 'vue';
import store from 'util/store';
import useList from 'util/hook';
import {
    getOperateListApi, getModuleDataApi,
} from 'api/user';
import { formatDate } from 'util/tools';
import UserComp from '@/components/UserComp.vue';
import SearchComp from '@/components/SearchComp.vue';
import SelectComp from '@/components/SelectComp.vue';
import CommonHead from '@/components/CommonHead.vue';

const filterOptions = ref<{
    team_id: string,
    keyword: string,
    type_name: string,
}>({
    team_id: store.teamInfo.team_id,
    keyword: '',
    type_name: '',
});

const typesOptions = ref<Array<any>>([]);

const {
    total, curPage, listData,
} = useList(getOperateListApi, filterOptions);

onBeforeMount(async () => {
    const { data } = await getModuleDataApi();
    typesOptions.value = data.map((item) => ({
        label: item,
        value: item,
    }));
    // typesOptions.value.unshift({
    //     label: '全部模块',
    //     value: '',
    // });
});

// 重置
const resetHandle = () => {
    Object.assign(filterOptions.value, {
        keyword: '',
        type_name: '',
        team_id: store.teamInfo.team_id,
    });
};
</script>

<style lang='less' scoped>
.main_content {
    height: 100%;
}

.filter_wrap {
    background: #FFFFFF;
    border-radius: 4px;
    padding: 16px;
    margin-bottom: 16px;
    height: 64px;
    box-sizing: border-box;
}

.table_wrap {
    height: calc(100% - 165px);
    overflow: auto;
    padding: 16px;
    background-color: #fff;
    border-radius: 6px;
}
</style>
