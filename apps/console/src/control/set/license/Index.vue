<template>
    <div class="title">
        许可证知识库
    </div>
    <div class="desc">
        灵活高效的许可证管理，支持内置系统许可证与自定义许可证配置
    </div>

    <el-tabs v-model="activeName" class="license-tab">
        <el-tab-pane label="自定义许可证" name="1">
            <LicenseManage v-if="store.isLic" />
            <OldLicenseManage v-else />
        </el-tab-pane>
        <el-tab-pane label="系统许可证" name="2">
            <LicenseSys v-if="store.isLic" />
            <OldLicenseSys v-else />
        </el-tab-pane>
    </el-tabs>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import store from 'util/store';
import LicenseManage from './byte_license/LicenseManage.vue';
import LicenseSys from './byte_license/LicenseSys.vue';
import OldLicenseManage from './LicenseManage.vue';
import OldLicenseSys from './LicenseSys.vue';

const activeName = ref<string>('1');

</script>

<style lang='less' scoped>
.title {
    font-weight: 600;
    color: @text-color;
    margin-bottom: 8px;
}

.desc {
    font-size: 14px;
    color: #858585;
    margin-bottom: 8px;
}

</style>

<style lang="less">
.license-tab {
    height: calc(100% - 80px);
    .el-tabs__content {
        height: calc(100% - 55px);
    }
    .el-tab-pane {
        height: 100%;
    }
}
</style>
