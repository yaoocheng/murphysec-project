<template>
    <div class="filter_wrap">
        <SearchComp v-model="filterOptions.keyword" clearable placeholder="请搜索策略名称" />

        <div v-if="!store.isAllTeam">
            <el-popconfirm popper-class="cancle-popper confirm-popper" v-if="selectData.length" @confirm="deleteStrategyList(selectData.map((item) => item.id))"
                           title="确认删除？">
                <template #reference>
                    <el-button class="minor_btn">删除 {{ selectData.length || '' }}</el-button>
                </template>
            </el-popconfirm>
            <el-button class="main_btn" @click="editModal = true; editData=initData()">添加</el-button>
        </div>
    </div>

    <div class="table_wrap">
        <el-table height="100%" @selection-change="selectHandle" :cell-style="{ height: '48px' }" :data="listData"
                  :header-cell-style="{ padding: '15px 0', border: 'none', background: '#F7F8FB', color: '#8F959E', fontWeight: 500 }">
            <el-table-column type="selection" width="30" />
            <el-table-column label="策略名称" width="300" prop="name" show-overflow-tooltip />
            <el-table-column label="仓库域名" width="200"  prop="domain" show-overflow-tooltip />
            <el-table-column label="命名空间" width="200" prop="namespace" show-overflow-tooltip>
                <template #default="scope">
                    <div>
                        {{ scope.row.namespace || '-' }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="仓库数量" prop="name">
                <template #default="scope">
                    <div>
                        {{ scope.row.addr_list?.length || '全部' }}
                    </div>
                </template>
            </el-table-column>
            <!-- <el-table-column label="应用全局">
                <template #default="scope">
                    {{ scope.row.is_global === 1 ? '是' : '否' }}
                </template>
            </el-table-column>
            <el-table-column label="处置动作" width="130">
                <template #default="scope">
                    {{ scope.row.action === 'mark' ? '打标签' : '标记为缺陷组件' }}
                </template>
            </el-table-column>
            <el-table-column label="所属组织" width="140" prop="org_name" show-overflow-tooltip />
            <el-table-column label="所属团队" width="140" prop="team_name" show-overflow-tooltip /> -->
            <el-table-column label="策略开启" >
                <template #default="scope">
                    {{ scope.row.status === 1 ? '已启用' : '已禁用' }}
                </template>
            </el-table-column>
            <el-table-column label="最近操作人" width="140">
                <template #default="scope">
                    <UserComp :name="scope.row.updated_username" />
                </template>
            </el-table-column>
            <el-table-column label="最近操作时间" width="160">
                <template #default="scope">
                    {{ formatDate(scope.row.updated_at) }}
                </template>
            </el-table-column>
            <el-table-column v-if="!store.isAllTeam" fixed="right" label="操作" width="140">
                <template #default="scope">
                    <div class="edit flex items-center">
                        <el-popconfirm @confirm="changeStrategyOpen(scope.row)"
                                       :title="`确认${scope.row.status === 1 ? '禁用' : '启用'}?`">
                            <template #reference>
                                <span :class=" scope.row.status === 1 ? 'button-text-red' : 'button-text-blue'">
                                    {{  scope.row.status === 1 ? '禁用' : '启用' }}
                                </span>
                            </template>
                        </el-popconfirm>

                        <span class="button-text-blue" @click="editHandle(scope.row)">编辑</span>

                        <el-popconfirm popper-class="cancle-popper confirm-popper" @confirm="deleteStrategyList([scope.row.id])" :title="`确认删除?`">
                            <template #reference>
                                <span class="button-text-red">删除</span>
                            </template>
                        </el-popconfirm>

                        <!-- <span class="g-mr-8">查看</span> -->
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <!-- <PageComp v-model:currentPage="curPage" :total="total" /> -->
    </div>

    <WhiteListEdit v-model="editModal" v-if="editModal" :editData="editData" />
</template>

<script setup lang='ts'>
import store from 'util/store';
import { ref } from 'vue';
import bus, { formatDate, showMessage } from 'util/tools';
import useList from 'util/hook';
import { saveWhiteListApi, getWhiteListApi, delWhiteListApi } from 'api/team';
import UserComp from 'comp/UserComp.vue';
import SearchComp from '@/components/SearchComp.vue';
// import { getOrgAuthInfo } from '@/control/org/hooks';
import WhiteListEdit from './WhiteListEdit.vue';

// const {
//     normalTeamAuth, isUserSpace,
// } = getOrgAuthInfo();
const editData = ref<any>({});

const initData = () => ({
    id: '0', //  策略ID
    team_id: store.teamInfo.team_id, // 团队ID
    name: '', // 策略名称
    domain: '', // 不带协议部分的域名
    scope: 1, // 1-将命名空间下全部仓库加入白名单，2-指定仓库地址加入白名单
    namespace: '', // 命名空间
    addr_list: [],
    textarea: '',
});

const selectData = ref<Array<any>>([]);
const filterOptions = ref<{
    team_id: string,
    keyword: string,
}>({
    team_id: store.teamInfo.team_id,
    keyword: '',
});
const editModal = ref<boolean>(false);
const {
    listData, getData,
} = useList(getWhiteListApi, filterOptions);

bus.on('closeEdit', (data: any) => {
    editModal.value = data;
    editData.value = initData();
    getData();
});

// 多选
const selectHandle = (selection: any) => {
    selectData.value = selection;
};

// 策略开启
const changeStrategyOpen = async (row: any) => {
    // eslint-disable-next-line no-unused-expressions
    row.status === 1 ? row.status = 2 : row.status = 1;
    try {
        await saveWhiteListApi({
            ...row,
            op_action: 'change_status',
        });
        // eslint-disable-next-line no-unused-expressions
        row.status === 1 ? showMessage('开启成功', 'success') : showMessage('禁用成功', 'success');
    } catch (error) {
        // eslint-disable-next-line no-unused-expressions
        row.status === 1 ? row.status = 2 : row.status = 1;
    }
};

// 编辑
const editHandle = (row: any) => {
    editData.value = row;
    editData.value.textarea = row.addr_list?.length ? row.addr_list?.reduce((cur:string, pre:string) => `${cur}\n${pre}`) : '';
    editModal.value = true;
};

// 删除策略
const deleteStrategyList = async (ids: Array<string>) => {
    if (ids.length) {
        await delWhiteListApi({
            ids,
        });
        getData();
    }
};
</script>

<style scoped lang='less'>
.filter_wrap {
    margin-bottom: 16px;
    .between();

    .minor_btn {
        height: 32px;
        width: auto;
    }
}

.table_wrap {
    height: calc(100% - 130px);
    overflow: auto;

    .edit {
        color: #6c87ff;
        cursor: pointer;
    }
}
</style>
