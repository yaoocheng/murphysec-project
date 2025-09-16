<template>
    <div class="error">
        <div style="width: 400px; text-align: center;">
            <img class="g-mb-16" style="width: 160px;" src="~ast/img/404.png" alt="">
            <div class="g-f-24 g-color-1 g-fw-500 g-f-24 g-mb-8">糟糕，页面迷路了</div>
            <div class="g-f-14 g-color-3 g-fw-400 g-mb-16">你访问的页面可能已失效或被删除，可前往控制台检测你关心的项目是否存在安全风险</div>
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
