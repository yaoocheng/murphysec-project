<template>
    <div>
        <div @click="clickNav(item)" @mouseenter="handleNavMouseEnter(item)" @mouseleave="handleNavMouseLeave"
             v-for="item in filteredNavs" :key="item.name" class="flex flex-col items-center cursor-pointer justify-center mb-3">
            <div class="flex-col flex items-center">
                <div :class="{
                    'bg-[#E5EAFF]': activeNav(item),
                    'hover:bg-[#E6E6E699]': !activeNav(item),
                    'mb-1': item.name !== '设置',
                }" class="h-[34px] w-[34px] cursor-pointer text-sm flex items-center justify-center rounded-[8px]">
                    <Svg width="18px" height="18px" :color="activeNav(item) ? '#0025CC' : '#999999'"
                         :name="item.icon"></Svg>
                </div>
                <div v-if="item.name !== '设置'" class="text-xs" :class="{ 'font-medium': activeNav(item) }"
                     :style="{ color: activeNav(item) ? '#0025CC' : '#3c3c3c' }">
                    {{ item.name }}
                </div>
            </div>
        </div>
    </div>

    <NavDrawer />
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { computed } from 'vue';
import { emitter } from 'utils';
import { navStore } from './store';
import { authModuleNavs } from '../../store';
import NavDrawer from './NavDrawer.vue';

const props = defineProps(['navs']);
const router = useRouter();
const route = useRoute();

// 根据authModuleNavs配置过滤导航项
const filteredNavs = computed(() => {
    if (!props.navs) return [];

    return props.navs.filter((nav) => {
        // 如果导航项有子项，检查是否有任何子项在authModuleNavs中
        if (nav.children && nav.children.length > 0) {
            return nav.children.some((child) => authModuleNavs.value.includes(child.act));
        }
        // 如果没有子项，直接检查当前项是否在authModuleNavs中
        return authModuleNavs.value.includes(nav.act);
    });
});

const activeNav = (item) => route.path.includes(item.act) || (item.name === '资产' && route.meta.routeType === 'business') || (item.name === '设置' && route.meta.routeType === 'set') || (item.name === '数据接入' && route.meta.routeType === 'data') || (item.name === '问题处置' && route.meta.routeType === 'issue');

// 点击导航
const clickNav = (item) => {
    emitter.emit('closeNotice');
    navStore.clickNavHadnle(item, router);
};

// 鼠标进入导航
const handleNavMouseEnter = (item) => {
    navStore.curEnterItem = item.name;
    navStore.isHoveringNavItem = true;

    // 清除之前可能存在的计时器
    navStore.clearTimers();

    // 使用store中的鼠标进入处理方法，已经添加了延迟
    navStore.mouseensterhandle(item, router);
};

// 鼠标离开导航
const handleNavMouseLeave = () => {
    navStore.isHoveringNavItem = false;

    // 清除显示计时器，如果存在
    if (navStore.showTimer) {
        clearTimeout(navStore.showTimer);
        navStore.showTimer = null;
        navStore.pendingDrawerItem = null;
        navStore.pendingNoticeOpen = false;
    }

    // 添加延迟关闭
    navStore.closeTimer = setTimeout(() => {
        if (!navStore.isHoveringDrawer && !navStore.isHoveringNavItem) {
            navStore.drawerVisible = false;
            navStore.noticeOpen = false;
        }
    }, navStore.hideDelay);
};
</script>

<style lang="less">
/* 移除不需要的样式 */
</style>
