<template>
    <!-- 使用自定义弹出菜单替代Drawer组件 -->
    <div v-if="navStore.drawerVisible"
         class="custom-submenu"
         @mouseenter="handleMouseEnter"
         @mouseleave="handleMouseLeave">
        <!-- 添加左侧连接区域，捕获鼠标从导航栏移动到子菜单的过程 -->
        <div class="submenu-connector"></div>
        <div class="submenu-content">
            <div class="mb-4 font-medium text-sm">{{ navStore.currentNavName }}</div>
            <div v-for="child in navStore.currentItem.children" :key="child.name">
                <div v-if="authModuleNavs.includes(child.act)"
                     @click="clickNav(child)"
                     :class="{
                         'active_sub_nav': $route.path.includes(child.act),
                         'text-[#0025CC] font-medium': $route.path.includes(child.act),
                         'text-[#3C3C3C]': !$route.path.includes(child.act)
                     }"
                     class="h-9 leading-9 px-3 text-xs cursor-pointer rounded-[3px] mb-1 hover:bg-[#E6E6E699]">
                    {{ child.name }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { emitter } from 'utils';
import { authModuleNavs } from '../../store';
import { navStore } from './store/index';

const router = useRouter();

// 点击导航
const clickNav = (item) => {
    emitter.emit('closeNotice');
    navStore.clickNavHadnle(item, router);
};

// 鼠标进入抽屉
const handleMouseEnter = () => {
    navStore.isHoveringDrawer = true;

    // 清除计时器
    navStore.clearTimers();
};

// 鼠标离开抽屉
const handleMouseLeave = () => {
    navStore.isHoveringDrawer = false;
    // 增加延迟关闭时间，避免意外关闭
    navStore.closeTimer = setTimeout(() => {
        if (!navStore.isHoveringDrawer && !navStore.isHoveringNavItem) {
            navStore.drawerVisible = false;
            navStore.curEnterItem = undefined;
        }
    }, navStore.hideDelay);
};
</script>

<style>
.custom-submenu {
    position: fixed;
    top: 0;
    left: 64px;
    width: 140px;
    height: 100%;
    background-color: white;
    /* 减轻阴影效果，使其看起来更加一体化 */
    box-shadow: 2px 0px 12px rgba(31, 35, 41, 0.02),
                4px 0px 16px rgba(31, 35, 41, 0.02);
    z-index: 1000; /* 确保在导航栏之下 */
    /* 添加过渡动画 */
    animation: slideIn 0.2s ease-in-out;
    border-left: none; /* 确保左侧没有边框 */
}

/* 创建一个连接区域，扩大鼠标有效悬停范围 */
.submenu-connector {
    position: absolute;
    left: -15px; /* 向左延伸，覆盖可能存在的空隙 */
    top: 0;
    width: 15px; /* 宽度足够捕获鼠标移动 */
    height: 100%;
    background-color: transparent; /* 不可见 */
}

.submenu-content {
    padding: 24px 12px;
    font-family: PingFang SC, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif;
}

.active_sub_nav {
    background-color: rgba(108, 135, 255, 0.1) !important;
    border-radius: 3px;
}

@keyframes slideIn {
    from {
        transform: translateX(-10px);
        opacity: 0.5;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}
</style>
