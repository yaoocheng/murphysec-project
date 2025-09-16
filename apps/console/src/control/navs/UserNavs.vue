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
        name: '返回',
        path: '/platform/index',
    },
    {
        icon: 'icon-geren',
        name: '个人账户设置',
        path: '/usr/account',
    },
    // {
    //     icon: 'icon-mn_dunpai_fill',
    //     name: '访问令牌',
    //     path: '/usr/token',
    // },
    // {
    //     icon: 'icon-icon_notice',
    //     name: '通知设置',
    //     path: '/usr/notice',
    // },
];
</script>
