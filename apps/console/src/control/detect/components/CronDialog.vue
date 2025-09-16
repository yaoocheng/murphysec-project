<template>
    <el-dialog width="500px" :close-on-click-modal="false">
        <div class="cron-dialog-content">
            <div class="g-mb-8">
                <div class="g-fw-500 g-mb-8">1. 每周定点执行</div>
                <div class="flex items-center g-mb-8">
                    <span>语法：</span>
                    <div class="cron-code mb-0">0 分 时 ? * 周几</div>
                </div>
                <div class="flex items-center g-mb-16">
                    <span>· 每周一上午8:30：</span>
                    <div class="cron-code mb-0">0 30 8 ? * MON</div>
                </div>
            </div>
            <div class="g-mb-8">
                <div class="g-fw-500 g-mb-8">2. 每月定点执行</div>
                <div class="flex items-center g-mb-8">
                    <span>语法：</span>
                    <div class="cron-code mb-0">0 分 时 日 月 ?</div>
                </div>
                <div class="flex items-center g-mb-16">
                    <span>· 每月1号中午12:00：</span>
                    <div class="cron-code mb-0">0 0 12 1 * ?</div>
                </div>
            </div>
            <div>
                <div class="g-fw-500 g-mb-8">3. 固定周期执行</div>
                <div class="flex items-center g-mb-8">
                    <span>语法：</span>
                    <div class="cron-code mb-0">0 分 时 日/间隔 * ?</div>
                </div>
                <div class="flex items-center">
                    <span>· 每3天凌晨执行：</span>
                    <div class="cron-code mb-0">0 0 0 1/3 * ?</div>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<style scoped>
.cron-dialog-content {
    font-size: 14px;
    color: #333;
}

.cron-code {
    color: #6C87FF;
    background: #6c87ff16;
    font-size: 12px;
    border-radius: 4px;
    padding: 4px 8px;
    font-family: monospace;
    display: inline-block;
}
</style>
