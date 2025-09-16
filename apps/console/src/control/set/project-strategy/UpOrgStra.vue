<template>
    <div class="filter_wrap">
        <div>
            <SearchComp style="width: 240px;" v-model="filterOptions.keyword" clearable placeholder="请搜索策略名称" />
            <!-- <el-cascader style="width: 150px;" v-model="selectOrg" @change="selectOrgHandle" :props="props"
                placeholder="所属组织" class="g-mr-8" /> -->
            <el-select filterable style="margin-right: 8px; width: 150px;" v-model="filterOptions.filter_org_id"
                       placeholder="所属组织">
                <el-option v-for="item in upOrgList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
            <el-button @click="resetHandle" class="hover_btn1"
                       style="background-color: #fff;color: #6c87ff;border: 1px solid #6c87ff;">
                重置
            </el-button>
        </div>

        <!-- <div v-if="normalTeamAuth || isUserSpace">
            <el-popconfirm v-if="listData.length" title="确认删除？"
                @confirm="deleteStrategyList(selectData.map((item) => item.id))">
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
        <el-table :data="listData" height="100%" @selection-change="selectHandle" :cell-style="{ height: '48px' }"
                  :header-cell-style="{ padding: '15px 0', border: 'none', background: '#F7F8FB', color: '#8F959E', fontWeight: 500 }">
            <!-- <el-table-column type="selection" width="30" /> -->
            <el-table-column label="策略名称" prop="name" show-overflow-tooltip />
            <el-table-column label="策略开启" width="80">
                <template #default="scope">
                    {{ scope.row.is_open === 1 ? '已启用' : '已禁用' }}
                </template>
            </el-table-column>
            <el-table-column label="所属组织" width="140" prop="org_name" show-overflow-tooltip />

            <el-table-column label="最近操作人" width="130">
                <template #default="scope">
                    <UserComp :name="scope.row.updated_username" />
                </template>
            </el-table-column>
            <el-table-column label="最近操作时间" width="160">
                <template #default="scope">
                    {{ formatDate(scope.row.updated_at) }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="80">
                <template #default="scope">
                    <span @click="checkInfo = true; checkItemInfo = scope.row" class="g-cursor-pointer g-color-5 button-text-blue">
                        查看
                    </span>
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

    <StrategyInfoModal v-if="checkInfo" v-model="checkInfo" :info="checkItemInfo" />
</template>

<script setup lang='ts'>
import { ref, onBeforeMount } from 'vue';
import store from 'util/store';
import useList from 'util/hook';
import { formatDate } from 'util/tools';
import { UpOrgListApi } from 'api/org';
import { getProjectStrategyListApi } from 'api/team';
import UserComp from 'comp/UserComp.vue';
// import { getOrgTeamApi } from 'api/org';
import SearchComp from '@/components/SearchComp.vue';
// import StrategyEdit from './StrategyEdit.vue';
import StrategyInfoModal from './StrategyInfoModal.vue';

// const isShowEdit = ref<boolean>(false);
const selectData = ref<Array<any>>([]);
// const editData = ref<any>({});
// const {
//     normalTeamAuth, isUserSpace,
// } = getOrgAuthInfo();
const selectOrg = ref<number[]>([]);
const checkInfo = ref<boolean>(false);
const checkItemInfo = ref<any>({});

// const initData = () => ({
//     name: '',
//     desc: '',
//     id: null,
//     is_global: 1,
//     is_open: 1,
//     tags: [],
//     strategy_info: {
//         comps: [
//             {
//                 comp_name: undefined,
//                 ecosystem: '',
//                 repository: '',
//                 version: [],
//             },
//         ],
//         vuln: {
//             cve: [],
//             mps: [],
//             level: [],
//             is_poc: false,
//             is_rce: false,
//         },
//         defect_comp_suggest: {
//             suggest_levels: undefined,
//             num: undefined,
//         },
//         defect_vuln_level: {
//             levels: undefined,
//             num: undefined,
//         },
//     },
// });

// const initEditData = ref(initData());

// 筛选
const filterOptions = ref<{
    team_id: string,
    keyword: string,
    org_id: number | undefined,
    list_type: string,
    filter_org_id: undefined | number,
    page: 1,
    limit: 1000,
}>({
    team_id: store.teamInfo.team_id,
    keyword: '',
    org_id: Number(window.localStorage.getItem('stra-reset-org-id')) || store.teamInfo.org_id,
    filter_org_id: undefined,
    list_type: 'parent_org',
    page: 1,
    limit: 1000,
});
const {
    listData,
} = useList(getProjectStrategyListApi, filterOptions);

const upOrgList = ref<any[]>([]);
onBeforeMount(async () => {
    try {
        const { data } = await UpOrgListApi((Number(window.localStorage.getItem('stra-reset-org-id')) || store.teamInfo.org_id), store.teamInfo.team_id === '-1' ? 'hidden' : undefined);
        upOrgList.value = data || [];
    } catch (error) {
        console.log(error);
    }
});

// const selectOrgHandle = async (val: number[]) => {
//     filterOptions.value.org_id = val[val.length - 1];
// try {
//     const { data } = await getOrgTeamApi({
//         org_id: filterOptions.value.org_id,
//         org_path: `1,${val.join(',')},`,
//         include_child: 1,
//     });
//     const list = Object.values(data || []);

//     if (store.isAllTeam) {
//         store.teamList = [...[{
//             id: '-1',
//             team_name: '所有团队',
//         }], ...list];
//     } else {
//         store.teamList = [...list];
//     }
// } catch (error) {
//     console.log(error);
// }
// };

// bus.on('closeEdit', (data: any) => {
//     isShowEdit.value = data;
//     initEditData.value = initData();
//     getData();
// });

// 删除策略
// const deleteStrategyList = async (ids: Array<string>) => {
//     if (ids.length) {
//         await projectStrategyDelApi({
//             ids,
//         });
//         getData();
//         showMessage('删除成功', 'success');
//     }
// };

const resetHandle = () => {
    Object.assign(filterOptions.value, {
        keyword: '',
        org_id: store.teamInfo.org_id,
        team_id: store.teamInfo.team_id,
        filter_org_id: undefined,
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
//         await projectStrategySaveApi(row);
//         // eslint-disable-next-line no-unused-expressions
//         row.is_open === 1 ? showMessage('开启成功', 'success') : showMessage('禁用成功', 'success');
//     } catch (error) {
//         // eslint-disable-next-line no-unused-expressions
//         row.is_open === 1 ? row.is_open = 2 : row.is_open = 1;
//         console.log(error);
//     }
// };

// // 编辑
// const editHandle = (row: any) => {
//     isShowEdit.value = true;
//     editData.value = row;
//     if (!editData.value.strategy_info.vuln) {
//         editData.value.strategy_info.vuln = initEditData.value.strategy_info.vuln;
//     }
//     if (!editData.value.strategy_info.defect_comp_suggest) {
//         editData.value.strategy_info.defect_comp_suggest = initEditData.value.strategy_info.defect_comp_suggest;
//     }
//     if (!editData.value.strategy_info.defect_vuln_level) {
//         editData.value.strategy_info.defect_vuln_level = initEditData.value.strategy_info.defect_vuln_level;
//     }
// };
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
