<template>
    <div class="filter_wrap">
        <SearchComp style="width: 240px;" v-model="filterOptions.keyword" clearable placeholder="请搜索策略名称" />

        <div v-if="userRole !== 'SAU'">
            <el-popconfirm popper-class="cancle-popper confirm-popper" v-if="selectData.length" title="确认删除？"
                           @confirm="deleteStrategyList(selectData.map((item) => item.id))">
                <template #reference>
                    <el-button class="minor_btn">删除 {{ selectData.length || '' }}</el-button>
                </template>
            </el-popconfirm>
            <el-button class="main_btn" @click="isShowEdit = true; editData = initEditData">添加</el-button>
        </div>
    </div>

    <div class="g-f-14 g-color-3 g-mb-16 g-fw-400">
        共 <span class="g-color-1">{{ listData.length }}</span> 条数据
    </div>

    <div class="table_wrap">
        <el-table :data="listData" height="100%" @selection-change="selectHandle" :cell-style="{ height: '48px' }"
                  :header-cell-style="{ padding: '15px 0', border: 'none', background: '#F7F8FB', color: '#8F959E', fontWeight: 500 }">
            <el-table-column type="selection" width="30" />
            <el-table-column label="策略名称" prop="name" show-overflow-tooltip />
            <el-table-column label="策略开启" width="80">
                <template #default="scope">
                    {{ scope.row.is_open === 1 ? '已启用' : '已禁用' }}
                </template>
            </el-table-column>
            <!-- <el-table-column label="所属组织" width="140" prop="org_name" show-overflow-tooltip /> -->
            <!-- <el-table-column label="所属团队" width="140" prop="team_name" show-overflow-tooltip /> -->
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

                        <span class="button-text-blue" @click="editHandle(scope.row)">编辑</span>

                        <el-popconfirm popper-class="cancle-popper confirm-popper" @confirm="deleteStrategyList([scope.row.id])" :title="`确认删除?`">
                            <template #reference>
                                <span class="button-text-red">删除</span>
                            </template>
                        </el-popconfirm>
                    </div>
                </template>
            </el-table-column>

            <el-table-column v-else label="操作" width="80">
                <template #default="scope">
                    <span @click="checkInfo = true; checkItemInfo = scope.row" class="g-color-5 g-cursor-pointer">
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

    <!-- <StrategyInfoModal v-if="checkInfo" v-model="checkInfo" :info="checkItemInfo" /> -->

    <StraEdit v-if="isShowEdit" v-model="isShowEdit" :editData="editData" />
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import store from 'util/store';
import useList from 'util/hook';
import bus, { formatDate, showMessage } from 'util/tools';
import { getProjectStrategyListApi, projectStrategyDelApi, projectStrategySaveApi } from 'api/team';
import UserComp from 'comp/UserComp.vue';
import SearchComp from '@/components/SearchComp.vue';
// import StrategyEdit from './StrategyEdit.vue';
import StraEdit from './StraEdit.vue';
import { getOrgAuthInfo } from '@/control/org/hooks';

const isShowEdit = ref<boolean>(false);
const selectData = ref<Array<any>>([]);
const editData = ref<any>({});
const { userRole } = getOrgAuthInfo();

const checkInfo = ref<boolean>(false);
const checkItemInfo = ref<any>({});

const initData = () => ({
    id: '0', //  策略ID
    team_id: store.teamInfo.team_id, // 团队ID
    name: '', // 策略名称
    desc: '', // 策略描述
    is_open: 1, // 是否开启：1-是， 其他-否
    strategy_info: {
        comp_vuln_logic: 'or', // 逻辑关系：and / or ， 无字段表示默认or
        vuln_logic: 'or', // 逻辑关系：and / or ， 无字段表示默认or
        comp_logic: 'or', // 逻辑关系：and / or ， 无字段表示默认or
        defect_comp_suggest: { // 缺陷组件处置等级与数量
            suggest_levels: undefined, // 修复等级范围：强烈修复建议-4 / 建议修复及以上-3 /  可选修复及以上-2
            num: undefined, //  缺陷组件数量
        },
        defect_vuln_level: { // 漏洞等级与数量
            levels: undefined, // 漏洞等级范围：低危"Low"及以上: 2,   中危"Medium"及以上: 3, 高危"High"及以上: 4,  严重"Critical"及以上: 5
            num: undefined, //  漏洞数量
        },
        vuln: { // 指定漏洞
            cve: [],
            mps: [],
            level: [],
            is_poc: undefined,
            is_rce: undefined,
        },
        comp_ext: {
            is_online: undefined, //  是否线上依赖， 无字段表示未设置
            is_triggers: undefined, // 是否可触发依赖， 无字段表示未设置
            is_direct_dependency: undefined, // 是否直接依赖， 无字段表示未设置
        },
        comps: [],
    },
    is_global: 1, // 是否应用到全局：1-是， 其他-否
    tags: [], // 标签ID列表
});
const initEditData = ref(initData());

// 筛选
const filterOptions = ref<{
    team_id: string,
    keyword: string,
    page: 1,
    limit: 1000,
    list_type: string,
}>({
    team_id: store.teamInfo.team_id,
    keyword: '',
    page: 1,
    limit: 1000,
    list_type: 'current_team',
});
const {
    listData, getData,
} = useList(getProjectStrategyListApi, filterOptions);

bus.on('closeEdit', (data: any) => {
    isShowEdit.value = data;
    initEditData.value = initData();
    getData();
});

// 删除策略
const deleteStrategyList = async (ids: Array<string>) => {
    if (ids.length) {
        await projectStrategyDelApi({
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
        await projectStrategySaveApi({
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
const editHandle = (row: any) => {
    isShowEdit.value = true;
    editData.value = row;
    if (editData.value.strategy_info.vuln) {
        Object.assign(initEditData.value.strategy_info.vuln, editData.value.strategy_info.vuln);
    } else {
        editData.value.strategy_info.vuln = initEditData.value.strategy_info.vuln;
    }

    if (editData.value.strategy_info.comp_ext) {
        Object.assign(initEditData.value.strategy_info.comp_ext, editData.value.strategy_info.comp_ext);
    } else {
        editData.value.strategy_info.comp_ext = initEditData.value.strategy_info.comp_ext;
    }

    if (!editData.value.strategy_info.comps) {
        editData.value.strategy_info.comps = [];
    }
    if (!editData.value.strategy_info.defect_comp_suggest) {
        editData.value.strategy_info.defect_comp_suggest = initEditData.value.strategy_info.defect_comp_suggest;
    }
    if (!editData.value.strategy_info.defect_vuln_level) {
        editData.value.strategy_info.defect_vuln_level = initEditData.value.strategy_info.defect_vuln_level;
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
    height: calc(100% - 95px);
    // overflow: auto;

    .edit {
        color: #6c87ff;
        cursor: pointer;
    }
}
</style>
