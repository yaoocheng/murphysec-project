<template>
    <div class="flex" style="height: calc(100% - 54px);flex-direction: column;">
        <div class="g-p-16 g-flex g-justify-between g-mb-16 g-bg-ff g-bdr-6">
            <SearchComp @input="searchHandle" style="width: 240px;" v-model="filterOptions.keyword" clearable
                placeholder="请搜索昵称"></SearchComp>
            <div v-if="!$systemConfig.isPV3">
                <el-button v-if="!isUserSpace && (orgManage || tableData.find(item => item.user_id === store.userInfo.id)?.is_root || userRole === 'SA')"
                    @click="showAddMemberModal = true">添加成员</el-button>
            </div>
            <div v-else>
                <el-button v-if="!isUserSpace && (orgManage || userRole === 'SA')"
                    @click="showAddMemberModal = true">添加成员</el-button>
            </div>
            <!-- <el-button disabled v-if="!isUserSpace&&teamManage">添加成员</el-button> -->
        </div>

        <div class="content" style="flex: 1;">
            <TableComp :data="tableData" height="100%">
                <el-table-column label="昵称">
                    <template #default="scope">
                        <div class="g-flex g-align-center">
                            <UserComp :name="scope.row.username" />
                            <TagComp content="团队负责人" class="ml-2" v-if="scope.row.is_root" />
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="created_at" label="加入时间">
                    <template #default="scope">
                        {{ formatDate(scope.row.created_at) }}
                    </template>
                </el-table-column>

                <el-table-column width="80" label="操作" v-if="(!isUserSpace) && normalTeamAuth">
                    <template #default="scope">
                        <div class="g-color-5 g-cursor-pointer" v-if="!scope.row.is_root">
                            <span @click="removeMemberHandle(scope.row)" class="g-color-err g-cursor-pointer">移除</span>
                        </div>
                    </template>
                </el-table-column>
            </TableComp>
        </div>
    </div>

    <AddMemberModal @addMember="addMember" :memberData="cacheData" v-model="showAddMemberModal"
        v-if="showAddMemberModal" />

    <ConfirmModal @confirm="confirm" v-model="showConfirmModal" v-if="showConfirmModal">
        <template #header>
            确定移除此成员？
        </template>
        <div class="g-fw-400 ml-[30px] mt-[-16px]">
            <div class="g-mb-8">
                已选择成员：{{ removeUser.username }}
            </div>
            <div>
                移除后，该成员将无法进入该团队！
            </div>
        </div>
    </ConfirmModal>
</template>

<script setup lang='ts'>
import store from 'util/store';
import { ref } from 'vue';
import {
    formatDate, showMessage,
} from 'util/tools';
import { getGruopListApi, getGruopUserListApi } from 'api/team';
import { addMemberTeamApi, removeMemberApi } from 'api/org';
import UserComp from 'comp/UserComp.vue';
import SearchComp from 'comp/SearchComp.vue';
import { getOrgAuthInfo } from '@/control/org/hooks';
import AddMemberModal from './AddMemberModal.vue';
import ConfirmModal from '../org/component/ConfirmModal.vue';
import TableComp from '@/components/TableComp.vue';

const {
    normalTeamAuth, isUserSpace, orgManage, userRole,
} = getOrgAuthInfo();

const filterOptions = ref<any>({
    keyword: '',
});

const showConfirmModal = ref<boolean>(false);
const showAddMemberModal = ref<boolean>(false);
const tableData = ref<Array<any>>([]);
const cacheData = ref<Array<any>>([]);
const removeUser = ref<any>({});

const getList = async () => {
    let groupId = '';
    try {
        const res = await getGruopListApi({ team_id: store.teamInfo.team_id });
        groupId = res.data[0].group_id;
    } catch (error) {
        console.log(error);
    }

    try {
        const res = await getGruopUserListApi({ team_id: store.teamInfo.team_id, group_id: groupId });
        tableData.value = res.data;
        cacheData.value = res.data;
    } catch (error) {
        console.log(error);
    }
};
getList();

const addMember = async (data: any) => {
    if (!data.length) {
        showMessage('请选择成员', 'warning');
        return;
    }
    await addMemberTeamApi({
        org_id: store.teamInfo.org_id,
        team_id: store.teamInfo.team_id,
        user_id: data.map((item: any) => item.user_id),
    });
    showMessage('操作成功', 'success');
    showAddMemberModal.value = false;
    getList();
};

const removeMemberHandle = (user: any) => {
    showConfirmModal.value = true;
    removeUser.value = {
        username: user.username,
        id: user.user_id,
    };
};

const confirm = async () => {
    await removeMemberApi({
        org_id: store.teamInfo.org_id,
        team_id: store.teamInfo.team_id,
        user_id: removeUser.value.id,
    });
    showMessage('操作成功', 'success');
    showConfirmModal.value = false;
    getList();
};

const searchHandle = (val: string) => {
    tableData.value = cacheData.value.filter((item) => item.username.includes(val));
};
</script>

<style lang='less' scoped>
.content {
    box-sizing: border-box;
    overflow: auto;
    font-size: 14px;
    color: #3D3D3D;
    position: relative;
    background-color: #fff;
    padding: 16px;
    overflow: auto;
    border-radius: 6px;

    :deep(.el-table__cell .cell) {
        padding: 0 16px;
    }

    i {
        vertical-align: -2px;
    }

    img {
        width: 42px;
        height: 42px;
        vertical-align: middle;
        border-radius: 50%;
        display: inline-block;
    }

    .item {
        &:hover {
            background-color: #F6F9FD;
        }

        height: 74px;
        transition: all .2s;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #F2F4F6;
        padding-left: 24px;
    }

    .info {
        display: flex;

        // .img_wrap {
        //     border: 1px solid #6C87FF;
        //     border-radius: 50%;
        //     width: 46px;
        //     height: 46px;
        //     line-height: 46px;
        //     text-align: center;
        //     margin-right: 30px;
        // }
        img {
            margin-right: 30px;
        }

        .name {
            font-size: 14px;
            font-weight: 600;
            color: #3D3D3D;
            margin-bottom: 5px;
        }

        .contact {
            font-size: 12px;
            color: #8C95A1;
        }
    }

    .num {
        display: inline-block;
        padding: 5px 10px;
        text-align: center;
        background: #6C87FF;
        border-radius: 13px;
        color: #fff;
    }

    .time {
        color: #A2A8B3;
    }

    .width:nth-of-type(1) {
        width: 50%;
    }

    .width:nth-of-type(2) {
        width: 30%;
    }
}
</style>
