import { reactive } from 'vue';

export const navStore = reactive({
    curEnterItem: undefined,
    noticeOpen: false,
    drawerVisible: false,
    currentItem: [],
    currentNavName: '',
    isHoveringDrawer: false,
    isHoveringNavItem: false,
    closeTimer: null,
    showTimer: null,
    pendingNoticeOpen: false,
    pendingDrawerItem: null,
    showDelay: 200,
    hideDelay: 300,
    clickNavHadnle: (item, router) => {
        if (!item.children) {
            router.push(item.act);
            navStore.drawerVisible = false;
            navStore.noticeOpen = false;
        }
    },
    clearTimers: () => {
        if (navStore.closeTimer) {
            clearTimeout(navStore.closeTimer);
            navStore.closeTimer = null;
        }
        if (navStore.showTimer) {
            clearTimeout(navStore.showTimer);
            navStore.showTimer = null;
        }
    },
    mouseensterhandle: (item) => {
        navStore.clearTimers();

        if (item.children) {
            navStore.pendingDrawerItem = item;
            navStore.showTimer = setTimeout(() => {
                if (navStore.pendingDrawerItem === item) {
                    navStore.currentItem = item;
                    navStore.currentNavName = item.name;
                    navStore.drawerVisible = true;
                    navStore.noticeOpen = false;
                }
                navStore.pendingDrawerItem = null;
            }, navStore.showDelay);
        }
        // 移除了立即关闭抽屉的逻辑，让没有子导航的项保持当前抽屉状态
        // 抽屉只会在鼠标完全离开导航区域时通过 handleNavMouseLeave 关闭
    },
});
