<template>
    <div class="error">
        <div style="width: 400px; text-align: center;">
            <img class="g-mb-16" style="width: 160px;" src="~ast/img/403.png" alt="">
            <div class="g-f-24 g-color-1 g-fw-500 g-f-24 g-mb-8">抱歉，您无权访问该页面</div>
            <div class="g-f-14 g-color-3 g-fw-400 g-mb-16">可能是您尝试访问的内容需要特定的权限，无法执行此操作</div>
            <el-button class="g-fw-400" style="width: 126px;" @click="$router.push('/platform/index')">前往控制台</el-button>
        </div>
    </div>
</template>

<style lang="less">
.error {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
