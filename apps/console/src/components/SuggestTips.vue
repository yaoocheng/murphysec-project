<template>
    <div class="g-f-14" style="width: 372px;padding: 16px 12px; ">
        <div class="g-color-1 g-f-16 g-fw-500 g-mb-16 flex items-center justify-between">
            处置等级
            <a class="g-fw-400 text-sm hover_btn1" style="padding: 3px 6px;" href="/docs/faqs/security-issues/security-issue-priorities.html" target="_blank">
                查看更多 <i class=" murphy icon-jiantou-you ml-[-2px]" style="font-size: 13px"></i></a>
        </div>
        <div class="g-color-3 g-fw-400 g-f-14 g-mb-8">用于反映组件风险的处置优先级，通过综合评估漏洞风险等级及利用成本等因素得出，支持通过自定义策略灵活调整评估规则</div>

        <!-- <div class="g-color-1 g-mb-8 g-fw-500">当前处置等级</div> -->

        <div class="g-flex">
            <div style="padding: 2px 0;" :class="{ 'active-suggest': text === item.name }"
                 class="g-color-fff g-flex-grow-1 g-ta-center  suggest" :style="{ background: item.color }"
                 v-for="item in data" :key="item.name">{{ item.name }}</div>
        </div>

        <!-- <div class="g-color-1 g-mb-8 g-fw-500">评估标准</div>

        <div class="g-fw-400 g-color-1 g-mb-24">在CVSS评分的基础上，结合了漏洞的可利用性信息，以此更准确地评估哪些漏洞应该优先处置</div>

        <div class="g-color-1 g-mb-8 g-fw-500">评估维度</div>

        <div class="g-fw-400 g-color-1 g-mb-24">CVSS评分、是否有公开POC、是否会导致数据泄漏、漏洞利用成本</div> -->

    </div>
</template>

<script setup lang='ts'>
defineProps(['text']);

const data = [
    {
        name: '强烈建议修复',
        color: '#D83931',
    },
    {
        name: '建议修复',
        color: '#DE7802',

    },
    {
        name: '可选修复',
        color: '#646A73',

    },
    {
        name: '安全',
        color: '#38C728',

    },
];
</script>

<style scoped lang='less'>
.suggest {
    opacity: .2;
}

.active-suggest {
    opacity: 1;
}
</style>
