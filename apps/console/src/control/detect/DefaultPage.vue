<template>
    <div class="default_page">
        <NoData description=" " />
        <div class="text_wrap">
            <div class="title">暂无{{ typeNames[type]}}项目</div>
            <div class="desc">
                您可以点击新增集成接入代码项目哦～
            </div>
            <el-button @click="accessHandle">
                新增集成
            </el-button>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { useRouter } from 'vue-router';
import NoData from 'comp/NoData.vue';
// import store from 'util/store';
import { showMessage } from 'util/tools';
import { getOrgAuthInfo, getCurRole } from '@/control/org/hooks';

const router = useRouter();
const {
    isUserSpace, orgManage, teamManage,
} = getOrgAuthInfo();

const props = defineProps(['type']);

const accessHandle = () => {
    // if (!isUserSpace && getCurRole() !== 'SA' && !ownerTeamIDList.value.includes(store.teamInfo.team_id) && !ownerOrgIDList.value.includes(store.teamInfo.org_id)) {
    //     showMessage('普通用户不可接入', 'warning');
    //     return;
    // }

    if (!isUserSpace.value && getCurRole() === 'Normal' && !orgManage.value && !teamManage.value) {
        showMessage('普通用户不可接入', 'warning');
        return;
    }
    router.push(`/detect-access?from=${props.type}`);
};

const typeNames:{
    [propName: string]: string;
} = {
    github: 'GitHub',
    gitee: 'Gitee',
    gitlab: 'GitLab',
    harbor: 'Harbor',
    nexus: 'Nexus',
    jfrog: 'JFrog',
    gerrit: 'Gerrit',
    coding: 'CODING',
    ezone_code: '简单云（代码仓库）',
    ezone_package: '简单云（制品库）',
};

// const textUpper = (type:string) => {
//     if (type === 'github') {
//         return 'GitHub';
//     }
//     if (type === 'gitee') {
//         return 'Gitee';
//     }
//     if (type === 'gitlab') {
//         return 'GitLab';
//     }
// };
</script>

<style lang='less' scoped>
.default_page {
    text-align: center;
    // .text_wrap {
    //     position: relative;
    //     top: -40px;
    // }
    .title {
        font-weight: 500;
        font-size: 16px;
        color: #3c3c3c;
        margin-bottom: 4px;
    }

    .desc {
        font-weight: 400;
        font-size: 14px;
        color: #858585;
        margin-bottom: 16px;
    }
}
</style>
