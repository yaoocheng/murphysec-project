<template>
    <div class="g-flex g-align-center g-justify-between g-mb-16">
        <div class="g-flex g-align-center">
            <SearchComp style="width: 240px;" v-model="filterOptions.keyword" placeholder="请搜索团队名称" />
        </div>
        <el-button v-if="userRole === 'SA' || ownerOrgIDList.includes(curOrgInfo.id)"
            @click="showCreateTeamModal = true; teamType = 'add'">创建团队</el-button>
    </div>

    <div class="g-overflow-auto" style="height: 67vh;">
        <TableComp :data="listData">
            <el-table-column width="220" prop="team_name" show-overflow-tooltip label="团队名称"></el-table-column>
            <el-table-column label="描述">
                <template #default="scope">
                    <el-tooltip placement="top" v-if="scope.row.team_description">
                        <template #content>
                            <span class="w-[400px] block">
                                {{ scope.row.team_description }}
                            </span>
                        </template>
                        <span class="max-w-full ellipsis inline-block">
                            {{ scope.row.team_description || '暂无描述' }}
                        </span>
                    </el-tooltip>
                    <div v-else>
                        {{ '暂无描述' }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column width="160" label="操作" v-if="userRole === 'SA' || ownerOrgIDList.includes(curOrgInfo.id)">
                <template #default="scope">
                    <div class="g-color-5 g-cursor-pointer">
                        <span class="mr-2" @click="addMemberHandle(scope.row.id)">添加成员</span>
                        <span @click="getEditTeamData(scope.row)">编辑</span>
                        <span class="g-ml-8 g-color-err" @click="quitHandle(scope.row)">解散</span>
                    </div>
                </template>
            </el-table-column>
        </TableComp>

        <!-- <PageComp v-model:currentPage="curPage" :total="total" /> -->
    </div>

    <AddMemberModal @addMember="addMember" :memberData="cacheData" :curTid="curClickTeamId" v-model="showAddMemberModal"
        v-if="showAddMemberModal" />

    <CreateTeamModal v-model="showCreateTeamModal" v-if="showCreateTeamModal" :teamType="teamType" :teamInfo="teamInfo"
        @editTeam="editTeam" @createTeam="createTeam" />

    <QuitModal v-model="quitModal" v-if="quitModal" :quitData="quitData" @closeTeam="closeTeam" />
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import {
    getOrgTeamApi, createTeamApi, getMoreTeamInfoApi, closeTeamApi, editTeamApi, getTeamInfoApi, addMemberTeamApi,
} from 'api/org';
import SearchComp from 'comp/SearchComp.vue';
import bus, { showMessage } from 'util/tools';
import { getGruopListApi, getGruopUserListApi } from 'api/team';
import AddMemberModal from '@/control/team/AddMemberModal.vue';
import { getOrgAuthInfo, updateUserManage } from '@/control/org/hooks';
import TableComp from '@/components/TableComp.vue';
// import PageComp from '@/components/PageComp.vue';
import CreateTeamModal from './CreateTeamModal.vue';
import QuitModal from '../navs/QuitModal.vue';
import { orgHooks, curOrgInfo } from './hooks';

// import { useRoute, useRouter } from 'vue-router';
// import { } from 'api/project';

// const route = useRoute();
// const router = useRouter();
defineProps(['ownerOrgIDList']);
const curClickTeamId = ref('');
const {
    userRole,
} = getOrgAuthInfo();
const teamType = ref('add');
const teamInfo = ref<any>({});
const quitModal = ref<boolean>(false);
const quitData = ref<any>({});
const showCreateTeamModal = ref<boolean>(false);
const filterOptions = ref<any>({
    org_id: 2,
    org_path: '1,2,',
    keyword: '',
    limit: 0,
});
const showAddMemberModal = ref<boolean>(false);
const cacheData = ref<Array<any>>([]);

const {
    // total,
    // curPage,
    listData,
    getData,
} = orgHooks(getOrgTeamApi, filterOptions);

const addMemberHandle = async (tid: string) => {
    let groupId = '';
    try {
        const res = await getGruopListApi({ team_id: tid });
        groupId = res.data[0].group_id;
    } catch (error) {
        console.log(error);
    }

    try {
        const res = await getGruopUserListApi({ team_id: tid, group_id: groupId });
        cacheData.value = res.data;
    } catch (error) {
        console.log(error);
    }
    showAddMemberModal.value = true;
    curClickTeamId.value = tid;
};

const quitHandle = (row: any) => {
    quitData.value.type = 1;
    quitData.value.name = row.team_name;
    quitData.value.id = row.id;
    quitModal.value = true;
};

const successHandle = () => {
    showCreateTeamModal.value = false;
    quitModal.value = false;
    bus.emit('updateMember');
    showMessage('操作成功', 'success');
    getData();
    updateUserManage();
};

const getEditTeamData = async (row: any) => {
    try {
        const { data } = await getTeamInfoApi({
            team_id: row.id,
            org_id: curOrgInfo.value.id,
        });
        Object.assign(teamInfo.value, data.team);

        const { data: data1 } = await getMoreTeamInfoApi({
            team_id: row.id,
        });
        teamInfo.value.team_ext = data1;

        // teamInfo.value.team_name = data.team?.team_name;
        // teamInfo.value.team_description = data.team?.team_description;
        teamInfo.value.org_id = data?.select_org_ids || [];
        teamInfo.value.id = row.id;
        teamInfo.value.owner_user_id = data.owner_list?.map((item: any) => item.id) || [];
        teamType.value = 'edit';
        showCreateTeamModal.value = true;
        updateUserManage();
    } catch (error) {
        console.log(error);
    }
};

const createTeam = async (data: any) => {
    try {
        await createTeamApi({
            ...data,
            team_id: teamInfo.value.id,
            org_id: data.org_id[data.org_id.length - 1],
        });
        successHandle();
    } catch (error) {
        console.log(error);
    }
};

const editTeam = async (data: any) => {
    try {
        await editTeamApi({
            ...data,
            team_id: teamInfo.value.id,
            org_id: data.org_id[data.org_id.length - 1],
        });
        successHandle();
        teamInfo.value = {};
    } catch (error) {
        console.log(error);
    }
};

const closeTeam = async () => {
    try {
        await closeTeamApi({
            team_id: quitData.value.id,
            org_id: curOrgInfo.value.id,
        });
        successHandle();
    } catch (error) {
        console.log(error);
    }
};

const addMember = async (data: any) => {
    if (!data.length) {
        showMessage('请选择成员', 'warning');
        return;
    }
    await addMemberTeamApi({
        org_id: curOrgInfo.value.id,
        team_id: curClickTeamId.value,
        user_id: data.map((item: any) => item.user_id),
    });
    showMessage('操作成功', 'success');
    showAddMemberModal.value = false;
};
</script>

<style scoped lang='less'>
.tag {
    height: 18px;
    line-height: 18px;
}
</style>
