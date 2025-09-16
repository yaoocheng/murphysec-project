<template>
    <el-dialog v-model="store.isShowFilterConfig" width="420px" title="筛选配置" :close-on-click-modal="false">
        <div>
            <div class="select_wrap">
                <div class="name">
                    线上依赖
                </div>
                <el-radio-group v-model="filterConfig.is_online">
                    <el-radio :label="1" size="large">线上依赖</el-radio>
                    <el-radio :label="0" size="large">全部依赖</el-radio>
                </el-radio-group>
            </div>
            <div class="select_wrap">
                <div class="name">
                    可触发漏洞
                </div>
                <el-radio-group v-model="filterConfig.is_triggers">
                    <el-radio :label="1" size="large">只看可触发漏洞</el-radio>
                    <el-radio :label="0" size="large">全部漏洞</el-radio>
                </el-radio-group>
            </div>
            <div class="select_wrap">
                <div class="name">
                    投毒组件
                </div>
                <el-radio-group v-model="filterConfig.is_poison">
                    <el-radio :label="1" size="large">只看投毒组件</el-radio>
                    <el-radio :label="0" size="large">全部组件</el-radio>
                </el-radio-group>
            </div>
            <div class="btns group-btn g-mt-16">
                <el-button class="cancle_btn" @click="store.isShowFilterConfig = false">取消</el-button>
                <el-button @click="setFilterConfitHandle">确认</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang='ts'>
import { reactive, watch } from 'vue';
import { setFilterConfigApi } from 'api/project';
import store from 'util/store';
import { showMessage } from 'util/tools';

const props = defineProps(['filterConfig']);
const filterConfig = reactive<{
    is_online: number,
    is_triggers: number,
    is_poison: number,
}>({
    is_online: 1,
    is_triggers: 1,
    is_poison: 1,
});

watch(props.filterConfig, (newVal:any) => {
    Object.assign(filterConfig, newVal);
});

// 设置筛选配置
const setFilterConfitHandle = async () => {
    await setFilterConfigApi(filterConfig);
    showMessage('设置成功', 'success');
    store.isShowFilterConfig = false;
};
</script>

<style lang='less' scoped>

</style>
