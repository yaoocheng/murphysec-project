<template>
    <div class="loading-component">
        <div class="loading-spinner"></div>
    </div>
</template>

<script setup lang="ts">
// 加载组件的逻辑
</script>

<style lang="less" scoped>
.loading-component {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;

    .loading-spinner {
        width: 40px;
        height: 40px;
        border: 3px solid #f3f3f3;
        border-top: 2px solid @primary;
        border-right: 2px solid @primary;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    .loading-text {
        color: #3c3c3c;
        font-size: 14px;
    }
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>
