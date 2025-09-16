<template>
    <CommonHead>
        <span>资产管理</span>
    </CommonHead>

    <div class="project_index main_content">
        <div class="tab">
            <span :class="{ 'active': $route.path === '/asset' }" @click="tabActive = $route.path;$router.push('/asset')">组件管理</span>
            <span v-if="!store.isAllTeam" :class="{ 'active': $route.path === '/license' }" @click="tabActive = $route.path;$router.push('/license')">许可证管理</span>
        </div>

        <router-view></router-view>
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import store from 'util/store';
import { useRoute } from 'vue-router';
import CommonHead from '@/components/CommonHead.vue';

const route = useRoute();
const tabActive = ref<string>((route.path as string));
</script>

<style lang='less' scoped>
.project_index {
    padding: 24px;
    box-sizing: border-box;
    .tab {
        border-bottom: 1px solid #DEE0E3;
        margin-bottom: 16px;
    }

    .tab span {
        display: inline-block;
        margin-right: 30px;
        color: #606C80;
        padding-bottom: 8px;
        // height: 56px;
        // line-height: 56px;
        cursor: pointer;
        border-bottom: 2px solid transparent;
    }

    .tab span.active {
        font-weight: 500;
        border-bottom-color: #5572F4;
        color: #5572F4;
        font-weight: 500;
    }
}
</style>
