<template>
    <div class="title">
        仓库白名单
    </div>
    <div class="desc">
        符合白名单规则的仓库在检测时会自动忽略，不会被检测
    </div>

    <TeamStra />

    <!-- <el-tabs v-model="activeName">
        <el-tab-pane label="团队策略" name="1">
            <TeamStra />
        </el-tab-pane>
        <el-tab-pane label="上级组织策略" name="2">上级组织策略</el-tab-pane>

    </el-tabs> -->
</template>

<script setup lang='ts'>
// import { ref } from 'vue';
import TeamStra from './TeamStra.vue';
// import { useRoute, useRouter } from 'vue-router';
// import {  } from 'util/tools';
// import store from 'util/store';
// import { } from 'api/project';

// const route = useRoute();
// const router = useRouter();
// const activeName = ref<string>('1');

// onBeforeMount(() => {
// })

// onMounted(() => {
// })
</script>

<style scoped lang='less'>
.title {
    font-weight: 600;
    color: @text-color;
    margin-bottom: 8px;
}

.desc {
    font-size: 14px;
    color: #858585;
    margin-bottom: 12px;
}
</style>

<style lang="less">
.el-tabs {
    height: calc(100% - 84px);
    .el-tabs__content {
        height: calc(100% - 54px);
        .el-tab-pane {
            height: 100%;
        }
    }
}
</style>
