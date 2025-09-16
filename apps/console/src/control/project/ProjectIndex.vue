<template>
    <CommonHead>
        <span>项目管理</span>
    </CommonHead>

    <div class="project_index main_content">
        <div class="tab">
            <span :class="{ 'active': $route.path === '/project/list' }" @click="tabActive = 1;$router.push('/project/list')">项目</span>
            <span :class="{ 'active': $route.path === '/project/group' }" @click="tabActive = 2;$router.push('/project/group')">项目组</span>
            <span :class="{ 'active': $route.path === '/project/task' }" @click="tabActive = 3;$router.push('/project/task')">任务</span>
        </div>

        <router-view></router-view>
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import CommonHead from '@/components/CommonHead.vue';

const route = useRoute();
const tabActive = ref<number>(+(route.query.tab as string));
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
