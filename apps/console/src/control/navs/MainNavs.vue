<template>
    <div class="main_navs" :class="{ 'shrink_main_navs': store.navShrink }">
        <div class="item" @click="$router.push(item.path)" v-for="(item, index) in navs" :key="index"
             :class="{ 'active': item.path.includes($route.meta.pathName) }" v-show="showNavs(item.path, userRole)">
            <el-tooltip placement="right" :content="item.name" v-if="store.navShrink">
                <i class="murphy" :class="item.icon"></i>
            </el-tooltip>
            <span class="icon_wrap" v-else>
                <i class="murphy" :class="item.icon"></i>
            </span>
            <span v-if="!store.navShrink">{{ item.name }}</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import store from 'util/store';
import { getOrgAuthInfo } from '@/control/org/hooks';

const {
    userRole,
} = getOrgAuthInfo();

// 主页导航
const navs: Array<any> = [
    // {
    //     icon: 'icon-team',
    //     name: '团队概览',
    //     path: '/overview',
    // },
    {
        icon: 'icon-platform',
        name: '我的工作台',
        path: '/platform/index',
    },
    {
        icon: 'icon-project',
        name: '项目管理',
        path: '/project/list',
    },
    {
        icon: 'icon-jicheng',
        name: '集成方式',
        path: '/integrate',
    },
    {
        icon: 'icon-Frame7',
        name: '知识库',
        path: '/knowledge',
    },
    {
        icon: 'icon-code',
        name: '代码托管',
        path: '/code',
    },

    {
        icon: 'icon-zujian2',
        name: '资产管理',
        path: '/asset',
    },
    {
        icon: 'icon-anquan',
        name: '风险管理',
        path: '/risk',
    },
    {
        icon: 'icon-Vector',
        name: '导出管理',
        path: '/export',
    },
    {
        icon: 'icon-icon_boards_filled',
        name: '操作日志',
        path: '/operate',
    },
    {
        icon: 'icon-member',
        name: '团队成员',
        path: '/member',
    },
    {
        icon: 'icon-set',
        name: '设置',
        path: '/set',
    },
];

const showNavs = (nav:string, role: string) => {
    if (store.isAllTeam && role === 'Custom') {
        return (nav === '/platform/index' && store.userInfo?.sca_menu.includes('/platform/issue')) || store.userInfo?.sca_menu.includes(nav);
    }
    if (store.isAllTeam) {
        return nav !== '/integrate' && nav !== '/code' && nav !== '/member' && nav !== '/operate';
    }
    // if (window.localStorage.getItem('inset-company') === 'shuanweisheng') {
    //     return nav !== '/operate' && nav !== '/member';
    // }
    // if (role === 'SAU') {
    //     return nav !== '/integrate';
    // }
    // if (getCurRole() === 'Normal') {
    //     return nav !== '/operate' && nav !== '/integrate';
    // }
    return nav !== '/operate';
};
</script>

<style lang="less">
.set {
    .between();

    i.active {
        transform: rotate(180deg);
    }
}

.sub_item {
    padding-left: 36px;
    color: #868C99 !important;
}

.sub_item.active {
    color: #6C87FF !important;
}
</style>
