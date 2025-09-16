<template>
    <div class="common_change" v-if="!store.navShrink">
        <el-tooltip popper-class="user_tooltip" effect="light" placement="bottom" :hide-after="0" :show-arrow="false"
            trigger="click">
            <div class="content_show">
                <span class="name" v-if="store.teamInfo.team_id !== '-1'">
                    {{ isUserSpace ? '个人空间' : store.teamInfo?.team_name }}
                </span>

                <el-tooltip v-else>
                    <template #content>
                        <div style="max-width: 344px;">
                            {{ `${orgName} - 组织团队管理` }}
                        </div>
                    </template>
                    <span class="name">{{ orgName }}</span>
                </el-tooltip>

                <i class="murphy icon-down1"></i>
            </div>

            <template #content>
                <div class="change_content_tooltip g-flex">
                    <div class="org g-broder-box g-p-16" style="width: 280px;">
                        <div class="g-flex g-justify-between g-align-center g-mb-12 g-color-1 g-f-16 g-fw-600">
                            <div>组织</div>
                            <el-tooltip v-if="store.userInfo?.private_team_id" content="个人空间">
                                <span style="padding: 6px 8px"
                                    @click="switchTeam(store.userInfo?.private_team_id, 1, true)"
                                    class="hover_icon g-cursor-pointer">
                                    <i class="murphy icon-Union"></i>
                                </span>
                            </el-tooltip>

                            <el-tooltip v-else placement="right" content="个人空间功能已被管理员关闭，可联系管理员开启该功能">
                                <span class="hover_icon cursor-pointer" style="padding: 6px 8px">
                                    <i class="murphy icon-Union text-c7"></i>
                                </span>
                            </el-tooltip>
                        </div>

                        <div style="height: 614px;" class="g-overflow-auto">
                            <el-tree class="flow-tree" node-key="id" :default-expanded-keys="defaultExpand"
                                @node-click="treeNodeClick" :load="loadTreeNode" lazy>
                                <template #default="{ data }">
                                    <div :class="{ 'active-org': curOrgInfo.id === data.id }"
                                        class="tree_content g-flex g-align-center g-justify-between">
                                        <div class="g-mr-8">
                                            {{ data.name }}
                                            <TagComp class="g-mr-4" v-if="ownerOrgIDList.includes(data.id)"
                                                :content="'我管理的'" />
                                        </div>
                                    </div>
                                </template>
                            </el-tree>
                        </div>
                    </div>

                    <div class="g-flex-grow-1 g-broder-box g-p-16 g-w-0">
                        <div class="g-flex g-justify-between g-align-center g-mb-12 g-color-1 g-pt-4 g-f-16 g-fw-600">
                            <div>团队</div>
                        </div>

                        <div @click="switchTeam('-1', curOrgInfo.id, true)"
                            v-if="userRole === 'SA' || userRole === 'SM' || userRole === 'SAU' || ownerOrgIDList.includes(curOrgInfo.id) || userRole === 'Custom'"
                            class="g-flex g-justify-between g-align-center g-p-12 g-cursor-pointer all-team">
                            <div>
                                <div :style="{ color: store.teamInfo?.team_id === '-1' && store.teamInfo.org_id === curOrgInfo.id ? '#6C87FF' : '#333' }"
                                    class="g-mb-4 g-f-14 g-fw-600">组织团队管理</div>
                                <div class="g-color-3 g-f-12 g-fw-400">查看管理该组织及下级组织的全部团队的数据</div>
                            </div>
                            <i v-if="store.teamInfo?.team_id === '-1' && store.teamInfo.org_id === curOrgInfo.id"
                                class="murphy icon-duihao2 g-f-12 g-color-5"></i>
                        </div>

                        <el-tabs v-model="filterOptions.include_child" @tab-change="filterOptions.keyword = ''">
                            <el-tab-pane :name="2">

                                <template #label>
                                    <div class="g-f-12 g-fw-400">
                                        组织直属团队
                                    </div>
                                </template>
                                <SearchComp class="g-mb-8" v-model="filterOptions.keyword" placeholder="请搜索团队名称" />

                                <div style="height: 476px;" class="g-overflow-auto">
                                    <div :class="{ 'active-team': item.id === store.teamInfo?.team_id }"
                                        v-for="item in listData" :key="item.id"
                                        @click="switchTeam(item.id, curOrgInfo.id, false)"
                                        class="g-f-14 g-color-1 g-fw-400 g-p-8 g-flex g-justify-between g-align-center team">
                                        <div>
                                            {{ item.team_name }}
                                            <TagComp class="g-mr-4" v-if="ownerTeamIDList.includes(item.id)"
                                                :content="'负责人'" />

                                        </div>
                                        <i v-if="item.id === store.teamInfo?.team_id"
                                            class="murphy icon-duihao2 g-f-12 g-color-5"></i>
                                    </div>
                                    <NoData description="暂无团队" v-if="!listData?.length" />
                                </div>
                            </el-tab-pane>
                            <el-tab-pane :name="1">

                                <template #label>
                                    <div class="g-f-12 g-fw-400">
                                        组织直属及以下团队
                                    </div>
                                </template>
                                <SearchComp class="g-mb-8" v-model="filterOptions.keyword" placeholder="请搜索团队名称" />

                                <div style="height: 470px;" class="g-overflow-auto">
                                    <div :class="{ 'active-team': item.id === store.teamInfo?.team_id }"
                                        v-for="item in listData" :key="item.id"
                                        @click="switchTeam(item.id, curOrgInfo.id, false)"
                                        class="g-f-14 g-color-1 g-fw-400 g-p-8 g-flex g-justify-between g-align-center team">
                                        <div>
                                            {{ item.team_name }}
                                            <TagComp class="g-mr-4" v-if="ownerTeamIDList.includes(item.id)"
                                                :content="'负责人'" />
                                        </div>
                                        <i v-if="item.id === store.teamInfo?.team_id"
                                            class="murphy icon-duihao2 g-f-12 g-color-5"></i>
                                    </div>
                                    <NoData description="暂无团队" v-if="!listData?.length" />
                                </div>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </div>
            </template>
        </el-tooltip>
    </div>
</template>

<script setup lang="ts">
import {
    ref,
} from 'vue';
import { getOrgTeamApi, getTeamInfoApi } from 'api/org';
import {
    localStorageUtil, showMessage,
} from 'util/tools';
import store from 'util/store';
import SearchComp from 'comp/SearchComp.vue';
import {
    getOrgAuthInfo, orgHooks, loadTreeNode, treeNodeClick, curOrgInfo,
} from './hooks';
// import { useRouter } from 'vue-router';
import NoData from '@/components/NoData.vue';
// import {
//     orgHooks, loadTreeNode, treeNodeClick, curOrgInfo,
// } from '../org/hooks';

const orgName = localStorageUtil('get', 'cur-click-org-name');
const curClickPath = localStorageUtil('get', 'cur-click-path') || '1,2,';
const defaultExpand = ref<number[]>(curClickPath.split(',')?.map((item: any) => +item)?.filter((item: any) => item && item !== 1));
curOrgInfo.value.id = defaultExpand.value[defaultExpand.value.length - 1];

const filterOptions = ref<any>({
    org_id: curOrgInfo.value.id,
    org_path: curClickPath,
    include_child: 1,
    keyword: '',
});
const {
    ownerOrgIDList, ownerTeamIDList, isUserSpace, userRole,
} = getOrgAuthInfo();

const {
    listData,
} = orgHooks(getOrgTeamApi, filterOptions);

const updateTeamInfo = async (tid: string, oid: number) => {
    const teamInfo = await getTeamInfoApi({ team_id: tid });
    const obj = {
        team_name: tid === '-1' ? '组织团队管理' : teamInfo.data?.team?.team_name,
        team_id: tid,
        org_id: oid,
    };
    localStorageUtil('set', 'g-t', (obj));
    store.teamInfo = obj;
};

const switchTeam = async (tid: string, oid: number, isClick: boolean) => {
    if (!isClick && userRole.value === 'SM') {
        showMessage('安全管理员不可进入团队进行操作', 'warning');
        return;
    }
    if (!isClick && userRole.value === 'SAU') {
        showMessage('安全审计员不可进入团队进行操作', 'warning');
        return;
    }
    if (!isClick && userRole.value === 'Custom') { // isClick 是否是点击团队切换
        showMessage('自定义角色不可进入团队进行操作', 'warning');
        return;
    }

    if (oid === 1) {
        window.localStorage.setItem('cur-click-path', '1,2,');
    }

    await updateTeamInfo(tid, oid);
    // 如果是所有团队 默认进第一个menu
    if (tid === '-1') {
        if (userRole.value === 'Custom') {
            window.location.href = `/console${store.userInfo?.sca_menu[0]}`;
        } else {
            window.location.href = '/console/platform/issue';
        }
    } else {
        window.location.href = '/console/platform/index';
    }
};
updateTeamInfo(localStorageUtil('get', 'g-t').team_id, localStorageUtil('get', 'g-t').org_id);

// const showTooltip = () => {
//     const path = curOrgInfo.value.path.split(',')?.map((item: any) => +item)?.filter((item: any) => item);
//     defaultExpand.value = path;
// };
</script>

<style lang="less" scoped>
.common_change {
    margin-left: 10px;

    .content_show {
        // background: #FFFFFF;
        border-radius: 8px;
        // border: 1px solid #F0F1F2;
        margin: 0 auto;
        // padding: 5px 12px;
        transition: all .2s;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;

        i {
            font-size: 20px;
            color: #C7C7C7;
        }

        // .avatar {
        //     width: 21px;
        //     height: 21px;
        //     vertical-align: -5px;
        //     margin-right: 8px;
        //     border-radius: 3px;
        // }

        .name {
            display: inline-block;
            max-width: 120px;
            .ellipsis();
            font-size: 16px;
            color: #3c3c3c;
        }
    }
}
</style>

<style lang="less">
.change_content_tooltip {
    width: 684px;
    height: 696px;

    .team,
    .all-team {
        &:hover {
            background: rgba(235, 235, 235, 0.50);
        }

        cursor: pointer;
        border-radius: 4px;
    }

    .active-team {
        color: #6c87ff;
    }

    .org {
        border-right: 1px solid #EBEBEB;
    }

    .el-tree-node__content {
        height: 38px;

        .el-icon {
            font-size: 14px;
        }

        .tree_content {
            width: 100%;
            padding: 8px 0;
            padding-left: 0px;
            font-size: 14px;
            color: @text-color;
            border-radius: 4px;
            padding-left: 8px;

            // &:hover {
            //     background-color: #ebebeba0;

            // }
        }

        .active-org.tree_content {
            color: #6c87ff;
        }
    }

}
</style>
