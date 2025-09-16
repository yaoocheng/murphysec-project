<template>
    <CommonHead>
        <span>设置</span>
    </CommonHead>

    <div class="set_index main_content">
        <div class="nav">
            <div v-for="section in menuSections" :key="section.title">
                <div v-if="checkSectionPermission(section)">
                    <div class="nav_title nav_item">{{ section.title }}</div>
                    <div v-for="item in section.items" :key="item.path"
                         v-show="checkItemPermission(item)"
                         class="sub_nav_title nav_item"
                         @click="$router.push(item.path)"
                         :class="{ 'active_tab': $route.path === item.path }">
                        {{ item.name }}
                    </div>
                </div>
            </div>

            <div v-if="!store.isAllTeam">
                <div class="nav_title nav_item">集成设置</div>
                <div v-for="item in detectTabs" :key="item.name"
                     class="sub_nav_title nav_item"
                     @click="$router.push(`/set/${item.type}`)"
                     :class="{ 'active_tab': $route.path === `/set/${item.type}` }">
                    {{ item.name }}
                </div>
            </div>
        </div>

        <div class="set_content">
            <RouterView />
        </div>
    </div>
</template>

<script setup lang='ts'>
import store from 'util/store';
import CommonHead from '@/components/CommonHead.vue';

// 基础设置配置
const baseSettings = {
    title: '基础设置',
    permission: () => !store.isAllTeam || (store.isAllTeam && store.teamInfo.org_id === 2),
    items: [
        {
            name: '团队设置',
            path: '/set/team',
            permission: () => !store.isAllTeam,
        },
        {
            name: '访问令牌',
            path: '/set/token',
            permission: () => !store.isAllTeam,
        },
        {
            name: '全局配置',
            path: '/set/global',
            permission: () => store.isAllTeam && store.teamInfo.org_id === 2,
        },
    ],
};

// 策略设置配置
const strategySettings = {
    title: '策略设置',
    permission: () => true,
    items: [
        {
            name: '组件策略',
            path: '/set/comp-strategy',
            permission: () => true,
        },
        {
            name: '项目策略',
            path: '/set/project-strategy',
            permission: () => true,
        },
        {
            name: '处置等级策略',
            path: '/set/suggest-strategy',
            permission: () => store.isAllTeam && store.teamInfo.org_id === 2,
        },
        {
            name: '检测范围模版',
            path: '/set/detect-temp',
            permission: () => true,
        },
        {
            name: '漏洞白名单',
            path: '/set/vuln-white-list',
            permission: () => true,
        },
        {
            name: '仓库白名单',
            path: '/set/white-list',
            permission: () => !store.isAllTeam,
        },
        {
            name: '私有源配置',
            path: '/set/private',
            permission: () => !store.isAllTeam,
        },
        {
            name: '敏感信息',
            path: '/set/sensitive',
            permission: () => store.conf.is_sensitive && !store.isAllTeam,
        },
    ],
};

// 许可证设置配置
const licenseSettings = {
    title: '许可证设置',
    permission: () => !store.isAllTeam,
    items: [
        {
            name: '许可证知识库',
            path: '/set/license-manage',
            permission: () => !store.isAllTeam,
        },
        {
            name: '许可证类型',
            path: '/set/license-type',
            permission: () => !store.isAllTeam && store.isLic,
        },
        {
            name: '许可证策略',
            path: '/set/license-strategy',
            permission: () => !store.isAllTeam && !store.isLic,
        },
    ],
};

const menuSections = [baseSettings, strategySettings, licenseSettings];

const detectTabs = [
    { name: 'GitLab', type: 'gitlab' },
    { name: 'GitHub', type: 'github' },
    { name: 'CODING', type: 'coding' },
    { name: '简单云（代码仓库）', type: 'ezone_code' },
    { name: 'Bitbucket', type: 'bitbucket' },
    { name: 'Harbor', type: 'harbor' },
    { name: 'JFrog', type: 'jfrog' },
    { name: 'Nexus', type: 'nexus' },
    { name: 'Gerrit', type: 'gerrit' },
    { name: 'Folib', type: 'folib' },
    { name: 'Amazon ECR', type: 'ecr' },
    { name: '简单云（制品库）', type: 'ezone_package' },
];

const checkSectionPermission = (section: any) => section.permission();

const checkItemPermission = (item: any) => item.permission();
</script>

<style lang='less' scoped>
.set_index {
    padding: 24px;
    display: flex;

    .nav {
        width: 154px;
        background-color: #fff;
        padding: 16px;
        box-sizing: border-box;
        border-radius: 6px;
        margin-right: 16px;
        overflow: auto;
    }

    .set_content {
        flex: 1;
        background-color: #fff;
        height: 100%;
        overflow: auto;
        box-sizing: border-box;
        padding: 24px;
        padding-bottom: 0;
        border-radius: 6px;
        position: relative;
    }

    .nav_title {
        color: #3c3c3c;
        font-size: 14px;
        font-weight: 600;
    }

    .sub_nav_title {
        color: #858585;
        font-size: 14px;
        font-weight: 400;
        cursor: pointer;
        .ellipsis()
    }

    .nav_item {
        width: 116px;
        height: 38px;
        line-height: 38px;
        padding-left: 12px;
        box-sizing: border-box;
    }

    .nav_item.active_tab {
        background: rgba(108, 135, 255, 0.1);
        border-radius: 6px;
        color: #6C87FF;
    }
}
</style>
