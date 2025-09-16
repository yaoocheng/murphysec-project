<template>
    <div class="pie-chart-content g-bdr-6 g-bg-ff g-flex-grow-1">
        <slot name="title">
        </slot>
        <slot name="chart"></slot>
        <slot name="nums"></slot>

        <div class="g-flex g-bg-f7 g-bdr-6 g-p-16 g-justify-between">
            <div class="item-info" v-for="item in info" :key="item.name">
                <div class="g-f-12 g-color-3 g-mb-4 g-mr-16">{{ item.name }}</div>
                <div class="g-f-22 g-color-1 g-fw-600 g-mb-4">{{ item.num }}<span class="g-f-12 g-color-3 g-vertical-2">个</span>
                </div>
                <!-- <div style="width: 60px;">
                    <el-progress :show-text="false" :percentage="item.num>100?100:item.num" :stroke-width="8" :color="item.c ? item.c : '#6C87FF'" />
                </div> -->
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
defineProps<{
    info: Array<any>
}>();

</script>

<style lang='less' scoped>
.pie-chart-content {
    // height: 370px;
    box-sizing: border-box;
    padding: 24px 36px;
    position: relative;
    .item-info {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}
</style>
