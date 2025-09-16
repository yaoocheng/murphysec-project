<template>
    <div class="w-[64px] flex flex-col nav-index relative nav-container"
         :class="{ 'has-submenu': navStore.drawerVisible || navStore.noticeOpen }">
        <div class="py-4 flex items-center justify-center">
            <!-- <img class="w-8 h-8" src="~assets/img/logo.png" alt=""> -->
            <img class="w-9 h-9" src="~assets/svg/logo/mofei.svg" alt="">
        </div>

        <div class="py-6 pt-0 flex flex-col justify-between items-center flex-1">
            <NavItem :navs="topNavs" />

            <div class="flex flex-col items-center">
                <a-tooltip title="了解墨思 AI 智能体"  placement="right">
                    <a href="http://154.8.185.104/docs/" class="mb-4" target="_blank">
                        <img class="w-[34px] h-[34px] cursor-pointer" src="~assets/img/aiicon.png" alt="">
                    </a>
                </a-tooltip>

                <NavItem :navs="bottomNavs" />

                <a-tooltip
                    title="产品文档"
                    placement="right"
                    :overlayInnerStyle="{
                        backgroundColor: '#000000',
                        color: '#ffffff',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '12px'
                    }"
                    :arrow="{ pointAtCenter: true }"
                >
                    <a href="http://154.8.185.104/docs/" target="_blank" class="w-[34px] h-[34px] mb-3 mt flex items-center justify-center rounded-lg hover:bg-gary-50">
                        <Svg name="icon_doc" class="w-4 h-4"></Svg>
                    </a>
                </a-tooltip>

                <div @mouseenter="openNoticePanel"  @mouseleave="handleMouseLeave"
                     class="h-[34px] w-[34px] mb-3 cursor-pointer text-sm rounded-lg hover:bg-gary-50 flex items-center justify-center"
                     :class="{ 'bg-gary-50': navStore.noticeOpen }"
                >
                    <a-badge class="notice_badge" v-if="unreadNoticeCount > 0" :count="unreadNoticeCount" :numberStyle="{
                        backgroundColor: '#F34C3D',
                        padding: '0 2px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize:'10px',
                        lineheight:'18px'
                    }" :overflowCount="99">
                        <Svg name="bell" class="cursor-pointer" color="#999999"></Svg>
                    </a-badge>
                    <Svg v-else name="bell" class="cursor-pointer" color="#999999"></Svg>
                </div>

                <a-popover placement="rightBottom" :overlayInnerStyle="{padding:'8px 0'}" :arrow="false">
                    <template #content>
                        <div class="w-[256px] px-1">
                            <div class="flex items-center py-2 pl-6">
                                <a-avatar class="mr-3">
                                    {{ userInfo?.nick_name?.slice(0, 1) }}
                                </a-avatar>
                                <!-- <img class="w-8 mr-3" src="~assets/img/avatar.png" alt=""> -->
                                <div>
                                    <div class="font-medium mb-1">{{ userInfo?.nick_name }}</div>
                                    <div class="text-b3 text-xs">{{ curUserInfo?.role_names?.[curUserInfo?.role_names?.length - 1] }}</div>
                                </div>
                            </div>

                            <a-divider class="my-1" />

                            <div @click="gotoAccountSetting" :class="{'bg-f2': $route.path === '/account-setting'}"
                                 class="my-1 h-[38px] pl-6 rounded cursor-pointer flex items-center hover:bg-f2">
                                <Svg class="mr-2 align-[-2px]" width="16px" height="16px" name="user-Setting"></Svg>
                                账号设置
                            </div>

                            <div v-if="authModuleNavs.includes('/access-token')" @click="gotoToken" :class="{'bg-f2': $route.path === '/access-token'}"
                                 class="my-1 h-[38px] pl-6 rounded cursor-pointer flex items-center hover:bg-f2">
                                <Svg class="mr-2 align-[-2px]" width="16px" height="16px" name="user-Token"></Svg>
                                访问令牌
                            </div>

                            <div @click="logoutHandle"
                                 class=" my-1 h-[38px] pl-6 rounded cursor-pointer flex items-center hover:bg-f2">
                                <Svg class="mr-2 align-[-2px]" width="16px" height="16px" name="user-exit"></Svg>
                                退出登录
                            </div>
                        </div>
                    </template>

                    <!-- <Svg name="drivinghouse-avatar" width="24px" height="24px"></Svg> -->
                    <div class="text-center">
                        <a-avatar class="w-6 h-6 leading-5">
                            {{ userInfo?.nick_name?.slice(0, 1) }}
                            <!-- <Svg name="drivinghouse-avatar" width="24px" height="24px"></Svg> -->
                        </a-avatar>
                    </div>
                    <!-- <img class="w-8 cursor-pointer" src="~assets/img/avatar.png" alt=""> -->
                </a-popover>
            </div>
        </div>

        <!-- 使用绝对定位将二级菜单放置在导航栏右侧 -->
        <div class="submenu-container absolute top-0 left-full h-full">
            <Notice v-model:open="navStore.noticeOpen" />
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted, h } from 'vue';
import { getUnreadNoticeCountApi } from 'api/notice';
import { logoutApi } from 'api/user';
import { emitter } from 'utils';
import { Modal } from 'ant-design-vue';
import NavItem from './NavItem.vue';
import { userInfo, authModuleNavs } from '@/store';
import { ROUTER_PATH } from '@/constants';
import { navStore } from './store';
import Notice from '@/components/Notice.vue';
import { getUserInfoApi } from '@/api/user';
import warningIcon from '/src/assets/svg/data/icon_warning_colorful-dm.svg';

const router = useRouter();
const unreadNoticeCount = ref();
const curUserInfo = ref({});

// 获取未读消息数量
const getUnreadNoticeCount = async () => {
    const res = await getUnreadNoticeCountApi();
    unreadNoticeCount.value = res.data.data.total;
};
emitter.on('updateUnreadNoticeCount', getUnreadNoticeCount);

// 获取用户信息
const fetchUserInfo = async () => {
    try {
        const { data } = await getUserInfoApi();
        curUserInfo.value = data.data || {};
    } catch (error) {
        console.error('获取用户信息失败:', error);
    }
};

onMounted(() => {
    fetchUserInfo();
    getUnreadNoticeCount();
});

// 打开通知面板
const openNoticePanel = () => {
    // 清除任何可能存在的计时器
    navStore.clearTimers();

    // 设置鼠标状态
    navStore.isHoveringNavItem = true;

    // 设置延迟显示
    navStore.pendingNoticeOpen = true;
    navStore.showTimer = setTimeout(() => {
        if (navStore.pendingNoticeOpen) {
            navStore.noticeOpen = true;
            navStore.drawerVisible = false; // 确保关闭导航二级菜单
            navStore.isHoveringDrawer = false;
        }
        navStore.pendingNoticeOpen = false;
    }, navStore.showDelay);
};

// 关闭消息
const closeNotice = () => {
    navStore.noticeOpen = false;
};

// 鼠标离开处理函数
const handleMouseLeave = () => {
    navStore.isHoveringNavItem = false;
    // 添加延迟关闭
    navStore.closeTimer = setTimeout(() => {
        if (!navStore.isHoveringDrawer && !navStore.isHoveringNavItem) {
            navStore.noticeOpen = false;
        }
    }, 300);
};
// 监听事件
emitter.on('closeNotice', closeNotice);

// 登出
// const logoutHandle = async () => {
//     try {
//         await logoutApi();
//         router.push('/login');
//         userInfo.value = null;
//     } catch (error) {
//         console.log(error);
//     }
// };

// 带确认框的登出
const logoutHandle = () => {
    Modal.confirm({
        class: 'delete-confirm-modal',
        title: '确认退出登录吗？',
        icon: h('span', { role: 'img', 'aria-label': 'exclamation-circle', class: 'anticon anticon-exclamation-circle' }, [
            h('img', { src: warningIcon, alt: '信息图标' }),
        ]),
        content: '退出后，将不可查看资产或接收通知',
        async onOk() {
            try {
                await logoutApi();
                router.push('/login');
                userInfo.value = null;
                authModuleNavs.value = [];
            } catch (error) {
                console.log(error);
            }
        },
        onCancel() {

        },
    });
};

// 跳转到访问令牌页面
const gotoToken = () => {
    router.push(ROUTER_PATH.AccessToken);
};

// 跳转到账号设置页面
const gotoAccountSetting = () => {
    router.push(ROUTER_PATH.AccountSetting);
};

const topNavs = ref([
    {
        name: '驾驶舱',
        icon: 'nav-panel',
        act: ROUTER_PATH.dashboard,
    },
    {
        name: '资产',
        icon: 'nav-app',
        children: [
            {
                name: '业务系统',
                act: ROUTER_PATH.businessManage,
            },
            {
                name: '应用管理',
                act: ROUTER_PATH.appManage,
            },
            {
                name: '应用载体',
                act: ROUTER_PATH.appVector,
            },
            {
                name: '软件成分',
                act: ROUTER_PATH.softwareComponent,
            },
        ],
    },
    {
        name: '问题处置',
        icon: 'safe-issue',
        children: [
            {
                name: '安全问题',
                act: ROUTER_PATH.secIssue,
            },
            {
                name: '处置任务',
                act: ROUTER_PATH.riskTask,
            },
        ],
    },
    {
        name: '漏洞情报',
        icon: 'nav-bug',
        act: ROUTER_PATH.vulnIntel,
    },
    {
        name: '数据接入',
        icon: 'nav-data',
        children: [
            {
                name: '任务管理',
                act: ROUTER_PATH.taskManage,
            },
            {
                name: '插件管理',
                act: ROUTER_PATH.pluginMarket,
            },
            {
                name: '合同录入',
                act: ROUTER_PATH.contractInput,
            },
            {
                name: '数据预审',
                act: ROUTER_PATH.dataReview,
            },
        ],
    },
    {
        name: '能力',
        icon: 'nav-safe',
        act: ROUTER_PATH.secAbility,
    },

    // {
    //     name: '业务系统管理',
    //     icon: 'nav-bus',
    //     act: ROUTER_PATH.businessManage,
    // },
    // {
    //     name: '应用管理',
    //     icon: 'nav-app',
    //     act: ROUTER_PATH.appManage,
    // },
    // {
    //     name: '应用载体',
    //     icon: 'nav-vector',
    //     act: ROUTER_PATH.appVector,
    // },

    // {
    //     name: '安全情报',
    //     icon: 'nav-safe',
    //     act: ROUTER_PATH.secIntel,
    // },
    // {
    //     name: '供应链成分',
    //     icon: 'nav-supply-chain',
    //     act: ROUTER_PATH.supplyComponent,
    // },

]);

const bottomNavs = ref([
    {
        name: '设置',
        icon: 'setting',
        children: [
            {
                name: '组织与成员',
                act: ROUTER_PATH.org,
            },
            {
                name: '角色管理',
                act: ROUTER_PATH.roleSetting,
            },
            {
                name: '通知设置',
                act: ROUTER_PATH.notifySetting,
            },
            {
                name: 'AI模型配置',
                act: ROUTER_PATH.aiSetting,
            },
        ],
    },
]);

</script>

<style>
.nav-container {
    position: relative;
    z-index: 1001;
    /* 确保导航栏位于二级菜单上层 */
    /* 修改阴影样式，使其与二级菜单更协调 */
    /* box-shadow: 0px 0px 16px rgba(31, 35, 41, 0.04), 0px 0px 8px rgba(31, 35, 41, 0.04); */
    border-right: 1px solid #E6E6E699;
    /* 使用E6E6E6 60%透明度作为边框颜色 */
    /* background: linear-gradient(0deg, rgba(229, 234, 255, 0.30) 0%, rgba(229, 234, 255, 0.30) 100%), #FFF; */
    /* 添加渐变背景 */

        /* 使用背景图片和纯色组合 */
    background:
    url('@/assets/svg/nav/bg.svg') top center no-repeat,
    #E5EAFF33;
    background-size: 100% auto;  /* 图片宽度自适应，高度100% */

}

/* 二级菜单打开时应用的样式 */
.nav-container.has-submenu {
    box-shadow: 0 0 0 transparent;
}

.notice_badge{
    .ant-badge-multiple-words{
        height: 18px;
    }
}
</style>
