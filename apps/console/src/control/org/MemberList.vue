<template>
    <div class="g-flex g-align-center g-justify-between g-mb-16">
        <div class="g-flex g-align-center">
            <SearchComp style="width: 240px;" v-model="filterOptions.keyword" placeholder="请搜索昵称/邮箱" />
            <SelectComp style="width: 140px;" v-model="filterOptions.include_child" :options="memberType"
                placeholder="成员类型" />
            <el-radio-group class="g-mr-16" v-model="filterOptions.is_deleted">
                <el-radio class="g-mr-8" :label="2" size="large">启用</el-radio>
                <el-radio :label="1" size="large">禁用</el-radio>
            </el-radio-group>
            <el-button @click="resetHandle" class="minor_btn" style="height: 32px;">重置</el-button>
        </div>
    </div>

    <div class="g-overflow-auto" style="height: 64vh;">
        <TableComp :data="listData">
            <el-table-column label="昵称" width="280">
                <template #default="scope">
                    <div class="g-flex g-align-center">
                        <UserComp :name="scope.row.nickname" />
                        <span class="tag" v-if="scope.row.is_deleted === 2"
                            style="background: #6C87FF;color: #fff;">已启用</span>
                        <span class="tag" v-else style="background: #F34D3D; color: #fff;">已禁用</span>
                        <span class="tag" v-if="scope.row.is_org_admin === 1">组织负责人</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="邮箱" width="160" show-overflow-tooltip>
                <template #default="{row}">
                    {{ row.email || '-' }}
                </template>
            </el-table-column>
            <el-table-column label="所属组织" show-overflow-tooltip>
                <template #default="scope">
                    <!-- <el-tooltip placement="top">
                        <template #content>
                            <div style="max-width: 400px;">
                                <div v-for="(item) in scope.row.org_names" :key="item">
                                    {{ item }}
                                </div>
                            </div>
                        </template> -->
                    <!-- <div style="max-width: 160px;" class="ellipsis"> -->
                    <span v-for="(item, index) in scope.row.org_names" :key="item">
                        {{ item }}
                        <span v-if="index !== scope.row.org_names.length - 1">、</span>
                    </span>
                    <!-- </div> -->
                    <!-- </el-tooltip> -->
                </template>
            </el-table-column>
            <el-table-column width="200" label="操作" v-if="userRole === 'SA' || ownerOrgIDList.includes(curOrgInfo.id)">
                <template #default="scope">
                    <div class="g-color-5 g-cursor-pointer">
                        <span v-if="scope.row.org_ids.includes((curOrgInfo.id))">
                            <el-popconfirm @confirm="confirmAdmin(cancleOrgAdminApi, scope.row)"
                                v-if="scope.row.is_org_admin === 1" popper-class="confirm-popper cancle-popper"
                                hide-icon width="250" title="确定取消为负责人吗？">
                                <template #reference>
                                    <span class="g-mr-16 g-color-err">取消为负责人</span>
                                </template>
                            </el-popconfirm>

                            <el-popconfirm v-else @confirm="confirmAdmin(setOrgAdminApi, scope.row)"
                                popper-class="confirm-popper" hide-icon width="250" title="确定设置为负责人吗？">
                                <template #reference>
                                    <span class="g-mr-16">设置为负责人</span>
                                </template>
                            </el-popconfirm>
                        </span>

                        <span @click="showChangeOrgModal = true; curMember = scope.row">变更组织</span>
                    </div>
                </template>
            </el-table-column>
        </TableComp>

        <PageComp v-model:currentPage="curPage" :total="total" />
    </div>

    <ChangeOrgModal @changeMemberOrg="changeMemberOrg" :changeOrgLoading="changeOrgLoading" :curMember="curMember" v-model="showChangeOrgModal"
        v-if="showChangeOrgModal" />
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import {
    getOrgMemberApi, setOrgAdminApi, cancleOrgAdminApi, changeMemberOrgApi,
} from 'api/org';
import SearchComp from 'comp/SearchComp.vue';
import SelectComp from 'comp/SelectComp.vue';
import UserComp from 'comp/UserComp.vue';
import bus, { showMessage } from 'util/tools';
import { getOrgAuthInfo, updateUserManage } from '@/control/org/hooks';
import TableComp from '@/components/TableComp.vue';
import PageComp from '@/components/PageComp.vue';
import ChangeOrgModal from './ChangeOrgModal.vue';
import { memberType } from './constants';
import { orgHooks, curOrgInfo } from './hooks';

// import { useRoute, useRouter } from 'vue-router';
// import { } from 'api/project';

// const route = useRoute();
// const router = useRouter();
defineProps(['ownerOrgIDList']);
const {
    userRole,
} = getOrgAuthInfo();
const showChangeOrgModal = ref<boolean>(false);
const curMember = ref<any>({});
const changeOrgLoading = ref(false);

const filterOptions = ref<any>({
    org_id: 2,
    org_path: '1,2,',
    keyword: '',
    include_child: 2,
    is_deleted: 2,
});

const {
    total,
    curPage,
    listData,
    getData,
} = orgHooks(getOrgMemberApi, filterOptions);

// 重置
const resetHandle = () => {
    Object.assign(filterOptions.value, {
        keyword: '',
        include_child: 2,
        is_deleted: 0,
    });
};

const confirmAdmin = async (reqApi: any, row: any) => {
    try {
        await reqApi({
            org_id: curOrgInfo.value.id,
            user_id: row.user_id,
        });
        showMessage('操作成功', 'success');
        getData();
        updateUserManage();
    } catch (error) {
        console.log(error);
    }
};

// 变更组织
const changeMemberOrg = async (data: any) => {
    changeOrgLoading.value = true;
    try {
        await changeMemberOrgApi({
            user_id: curMember.value.user_id,
            org_id: data,
        });
        showMessage('操作成功', 'success');
        getData();
        showChangeOrgModal.value = false;
        updateUserManage();
        changeOrgLoading.value = false;
    } catch (error) {
        console.log(error);
    }
};

bus.on('updateMember', () => {
    getData();
});
</script>

<style scoped lang='less'>
.tag {
    height: 18px;
    line-height: 18px;
}
</style>
