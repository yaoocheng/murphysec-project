<template>
    <CommonHead>
        <span>知识库</span>
    </CommonHead>

    <div style="height: calc(100% - 56px);" class="p-6 pt-3 box-border bg-f7">
        <el-tabs v-model="activeTab">
            <el-tab-pane label="开源软件知识库" name="1">
                <Software />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import Software from './Software.vue';

const activeTab = ref<string>('1');
</script>
