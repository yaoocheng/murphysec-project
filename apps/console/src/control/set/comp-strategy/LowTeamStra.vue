<template>
    <div class="filter_wrap">
        <div>
            <SearchComp style="width: 240px;" v-model="filterOptions.keyword" clearable placeholder="请搜索策略名称" />
            <SelectComp style="width: 140px;" v-model="filterOptions.action" placeholder="处置动作"
                        :options="disposeOptions" />
            <!-- <el-cascader style="width: 140px;" v-model="selectOrg" @change="selectOrgHandle" :props="props"
                class="g-mr-8" /> -->
            <el-select filterable style="margin-right: 8px; width: 140px;" v-model="filterOptions.team_id"
                       placeholder="请选择团队">
                <el-option v-for="item in store.teamList" :key="item.id" :label="item.team_name" :value="item.id" />
            </el-select>

            <el-button @click="resetHandle" class="hover_btn1"
                       style="background-color: #fff;color: #6c87ff;border: 1px solid #6c87ff;">
                重置
            </el-button>
        </div>

        <!-- <div v-if="normalTeamAuth || isUserSpace">
            <el-popconfirm v-if="listData.length" title="确认删除？" @confirm="deleteStrategyList(selectData.map((item) => item.id))">
                <template #reference>
                    <el-button class="minor_btn">删除 {{ selectData.length || '' }}</el-button>
                </template>
</el-popconfirm>
<el-button @click="isShowEdit = true; editData = initEditData">添加</el-button>
</div> -->
    </div>
    <div class="g-f-14 g-color-3 g-mb-16 g-fw-400">
        共 <span class="g-color-1">{{ listData.length }}</span> 条数据
    </div>
    <div class="table_wrap">
        <el-table height="100%" :cell-style="{ height: '48px' }" :data="listData" @selection-change="selectHandle"
                  :header-cell-style="{ padding: '15px 0', border: 'none', background: '#F7F8FB', color: '#8F959E', fontWeight: 500 }">
            <!-- <el-table-column v-if="normalTeamAuth || isUserSpace" type="selection" width="30" /> -->
            <el-table-column label="策略名称" prop="name" show-overflow-tooltip />
            <el-table-column label="应用全局" width="80">
                <template #default="scope">
                    {{ scope.row.is_global === 1 ? '是' : '否' }}
                </template>
            </el-table-column>
            <el-table-column label="处置动作" width="140">
                <template #default="scope">
                    <span v-if="scope.row.action === 'mark'">打标签</span>
                    <span v-if="scope.row.action === 'defect'">标记为缺陷组件</span>
                    <span v-if="scope.row.action === 'safe'">标记为安全组件</span> </template>
            </el-table-column>
            <!-- <el-table-column label="所属组织" width="140" prop="org_name" show-overflow-tooltip /> -->
            <el-table-column label="所属团队" width="140" prop="team_name" show-overflow-tooltip />
            <el-table-column label="策略开启" width="120">
                <template #default="scope">
                    {{ scope.row.is_open === 1 ? '已启用' : '已禁用' }}
                    <!-- <el-switch v-model="scope.row.is_open" @change="changeStrategyOpen(scope.row)" :active-value="1"
                        :inactive-value="2" /> -->
                </template>
            </el-table-column>
            <el-table-column label="最近操作人" width="140">
                <template #default="scope">
                    <UserComp :name="scope.row.updated_username" />
                </template>
            </el-table-column>
            <el-table-column label="最近操作时间" width="180">
                <template #default="scope">
                    {{ formatDate(scope.row.updated_at) }}
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="60">
                <template #default="scope">
                    <span @click="editHandle(scope.row)" class="g-color-5 g-cursor-pointer button-text-blue">查看</span>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <!-- <div class="pagination" v-if="total > 0">
            <el-pagination v-model:currentPage="curPage" background small :page-size="20"
                           layout="total, prev, pager, next" :total="total">
            </el-pagination>
        </div> -->
    </div>

    <!-- <StrategyEdit v-if="isShowEdit" v-model="isShowEdit" :editData="editData" /> -->
    <StraInfoModal v-if="isShowInfo" v-model="isShowInfo" :editData="editData" />
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import store from 'util/store';
import useList from 'util/hook';
import {
    formatDate,
} from 'util/tools';
// import type { CascaderProps } from 'element-plus';
import { getStrategyListApi } from 'api/team';
import UserComp from 'comp/UserComp.vue';
// import { getOrgTeamApi } from 'api/org';
// import { loadTreeNode } from '@/control/org/hooks';
import SelectComp from '@/components/SelectComp.vue';
import SearchComp from '@/components/SearchComp.vue';
// import StrategyEdit from './StrategyEdit.vue';
import StraInfoModal from './StraInfoModal.vue';

// const {
//     normalTeamAuth, isUserSpace,
// } = getOrgAuthInfo();
// const isShowEdit = ref<boolean>(false);
const isShowInfo = ref<boolean>(false);
const selectData = ref<Array<any>>([]);
const editData = ref<any>({});
const disposeOptions = [
    {
        label: '打标签',
        value: 'mark',
    },
    {
        label: '标记为缺陷组件',
        value: 'defect',
    },
    {
        label: '标记为安全组件',
        value: 'safe',
    },
];

const initData = () => ({
    name: '',
    desc: '',
    id: null,
    is_global: 1,
    is_open: 1,
    action: 'mark',
    mark: '',
    defect_title: '',
    defect_suggest: 4,
    defect_info: '',
    defect_fix: '',
    strategy_info: {
        comps: [
            {
                comp_name: undefined,
                ecosystem: '',
                repository: '',
                version: [],
            },
        ],
        vuln: {
            cve: [],
            mps: [],
            level: [],
            is_poc: false,
            is_rce: false,
        },
    },
});
const initEditData = ref(initData());

// const props: CascaderProps = {
//     lazy: true,
//     label: 'name',
//     value: 'id',
//     checkStrictly: true,
//     lazyLoad: loadTreeNode,
// };

const selectOrg = ref<number[]>([]);

// 筛选
const filterOptions = ref<{
    team_id: string,
    keyword: string,
    action: string,
    list_type: string,
    org_id: number | undefined,
    page: 1,
    limit: 1000,
}>({
    list_type: 'child_team',
    team_id: store.teamInfo.team_id,
    keyword: '',
    action: '',
    org_id: undefined,
    page: 1,
    limit: 1000,
});
const {
    listData,
} = useList(getStrategyListApi, filterOptions);

// const selectOrgHandle = async (val: number[]) => {
//     filterOptions.value.org_id = val[val.length - 1];
//     try {
//         const { data } = await getOrgTeamApi({
//             org_id: filterOptions.value.org_id,
//             org_path: `1,${val.join(',')},`,
//             include_child: 1,
//         });
//         const list = Object.values(data || []);

//         if (store.isAllTeam) {
//             store.teamList = [...[{
//                 id: '-1',
//                 team_name: '所有团队',
//             }], ...list];
//         } else {
//             store.teamList = [...list];
//         }
//     } catch (error) {
//         console.log(error);
//     }
// };

// bus.on('closeEdit', (data: any) => {
//     isShowInfo.value = data;
//     initEditData.value = initData();
//     getData();
// });

// 删除策略
// const deleteStrategyList = async (ids: Array<string>) => {
//     if (ids.length) {
//         await deleteStrategyListApi({
//             ids,
//         });
//         getData();
//     }
// };

const resetHandle = () => {
    Object.assign(filterOptions.value, {
        keyword: '',
        action: '',
        org_id: undefined,
        team_id: store.teamInfo.team_id,
    });
    selectOrg.value = [];
};

// 多选
const selectHandle = (selection: any) => {
    selectData.value = selection;
};

// 策略开启
// const changeStrategyOpen = async (row: any) => {
//     // eslint-disable-next-line no-unused-expressions
//     row.is_open === 1 ? row.is_open = 2 : row.is_open = 1;
//     try {
//         await strategyConfigApi(row);
//         // eslint-disable-next-line no-unused-expressions
//         row.is_open === 1 ? showMessage('开启成功', 'success') : showMessage('禁用成功', 'success');
//     } catch (error) {
//         // eslint-disable-next-line no-unused-expressions
//         row.is_open === 1 ? row.is_open = 2 : row.is_open = 1;
//         console.log(error);
//     }
// };

// 编辑
const editHandle = (row: any) => {
    isShowInfo.value = true;
    editData.value = row;
    if (!editData.value.strategy_info.vuln) {
        editData.value.strategy_info.vuln = initEditData.value.strategy_info.vuln;
        // Object.assign({}, editData.value.strategy_info.vuln, initEditData.strategy_info.vuln);
    }
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
