<template>
    <div class="filter_wrap">
        <SearchComp v-model="filterOptions.access_name" clearable placeholder="请搜索组件名称" />
        <el-button v-if="normalTeamAuth || isUserSpace" @click="addCompModal = true; type = '添加'">添加私有组件</el-button>
    </div>

    <div class="table_wrap">
        <el-table :data="listData" :cell-style="{ padding: '12px 0' }"
                  :header-cell-style="{ padding: '15px 0', border: 'none', background: '#F7F8FB', color: '#8F959E', fontWeight: 500 }">
            <el-table-column label="正则" prop="regular" width="260" show-overflow-tooltip />
            <el-table-column label="组件" prop="access_name"   show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="所属组织" width="140" prop="org_name" show-overflow-tooltip />
            <el-table-column label="所属团队" width="140" prop="team_name" show-overflow-tooltip />
            <el-table-column label="最近操作人" width="140">
                <template #default="scope">
                    <span class="member">
                        <UserComp :name="scope.row.updated_user_name" />
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="最近操作时间" width="160">
                <template #default="scope">
                    {{ formatDate(scope.row.updated_at) }}
                </template>
            </el-table-column>
            <el-table-column fixed="right" width="140" label="操作" v-if="normalTeamAuth || isUserSpace">
                <template #default="scope">
                    <div class="edit">
                        <span @click="editHandle(scope.row)" style="margin-right: 10px;">编辑</span>
                        <el-popconfirm popper-class="cancle-popper confirm-popper" title="确认删除？" @confirm="deleteStrategyList([scope.row.id])">
                            <template #reference>
                                <span>删除</span>
                            </template>
                        </el-popconfirm>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination" v-if="total>0">
            <el-pagination v-model:currentPage="curPage" background small :page-size="20" layout="total, prev, pager, next"
                           :total="total">
            </el-pagination>
        </div>
    </div>

    <el-dialog :title="`${type}私有组件`" v-model="addCompModal" @closed="addForm.regular = addForm.access_name = ''">
        <div class="g-mb-16">
            正则表达式
            <el-input class="g-mt-8" v-model="addForm.regular"
                      placeholder="请输入正则表达式如：open-vm-tools-stable-([0-9]+\.[0-9]+\.[0-9]+)"></el-input>
        </div>
        <div>
            组件名
            <el-input class="g-mt-8" v-model="addForm.access_name" placeholder="请输入组件名"></el-input>
        </div>
        <div class="group-btn g-mt-24">
            <el-button @click="addCompModal = false; addForm.regular = addForm.access_name = ''">取消</el-button>
            <el-button @click="confirm">确定</el-button>
        </div>
    </el-dialog>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import store from 'util/store';
import useList from 'util/hook';
import {
    formatDate, delayReload, showMessage,
} from 'util/tools';

import { getPrivateCompApi, deletePrivateCompApi, editPrivateCompApi } from 'api/team';
import UserComp from 'comp/UserComp.vue';
import { getOrgAuthInfo } from '@/control/org/hooks';
import SearchComp from '@/components/SearchComp.vue';

const {
    normalTeamAuth, isUserSpace,
} = getOrgAuthInfo();
const addCompModal = ref<boolean>(false);
const type = ref<string>('添加');
// 筛选
const filterOptions = ref<{
    team_id: string,
    access_name: string,
}>({
    team_id: store.teamInfo.team_id,
    access_name: '',
});

const addForm = ref<{
    team_id: string,
    regular: string,
    access_name: string,
}>({
    regular: '',
    access_name: '',
    team_id: store.teamInfo.team_id,
});

const {
    total, curPage, listData,
} = useList(getPrivateCompApi, filterOptions);

// 删除
const deleteStrategyList = async (ids: Array<string>) => {
    await deletePrivateCompApi({
        ids,
    });
    delayReload('删除成功', 'success');
};

// 编辑
const editHandle = (row: any) => {
    type.value = '编辑';
    addCompModal.value = true;
    Object.assign(addForm.value, row);
};

// 保存
const confirm = async () => {
    if (!addForm.value.access_name || !addForm.value.regular) {
        showMessage('请将信息填完整', 'warning');
        return;
    }
    await editPrivateCompApi(addForm.value);
    addCompModal.value = false;
    showMessage('保存成功', 'success');
    window.location.reload();
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
    height: calc(100% - 68px);
    overflow: auto;

    .edit {
        color: #6c87ff;
        cursor: pointer;
    }
}
</style>
