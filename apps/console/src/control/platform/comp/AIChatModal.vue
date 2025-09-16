<template>
    <el-drawer :size="'60%'" :show-close="false">
        <MfGptChat componentName="" chatID="0bee89b07a248e27c83fc3d5951213c1"
            :sugQuestion="['这个组件有哪些历史安全漏洞？', '解读下这个组件的开源许可证要求']" :disabledInput="false" />
    </el-drawer>
</template>

<script setup lang='ts'>
import MfGptChat from 'comp/MfGptChat/AIIndex.vue';
</script>

<style lang='less'>
.el-drawer__header {
    margin-bottom: 0;
    padding: 0;
}
</style>
