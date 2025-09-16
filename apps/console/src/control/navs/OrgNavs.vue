<template>
    <div class="main_navs user_navs" :class="{'shrink_main_navs': store.navShrink}">
        <div class="item" @click="router.push(item.path)" v-for="(item, index) in navs" :key="index"
            :class="{ 'active': route.path === item.path }">
            <el-tooltip placement="right" :content="item.name" v-if="store.navShrink">
                <i class="murphy" :class="item.icon"></i>
            </el-tooltip>
            <i v-else class="murphy" :class="item.icon"></i>
            <span v-if="!store.navShrink">{{ item.name }}</span>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { useRouter, useRoute } from 'vue-router';
import store from 'util/store';

const router = useRouter();
const route = useRoute();
const navs = [
    {
        icon: 'icon-icon_reply_filled',
        name: '返回控制台',
        path: '/platform/index',
    },
    {
        icon: 'icon-icon_organization_filled',
        name: '组织管理',
        path: '/org',
    },
];
</script>

<style lang='less' scoped>

</style>
