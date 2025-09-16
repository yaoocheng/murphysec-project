<template>
    <div>
        <div class="left_title">
            <div>
                <span></span>
                命中策略
            </div>
        </div>
        <div class="strategy_content" v-for="(item, index) in info.comp_info?.detection_strategy_info"
            :key="index">
            <div class="title">
                {{ item.name }}
            </div>
            <div class="part">
                <div>说明</div>
                {{ item.defect_info }}
            </div>
            <div class="part">
                <div>修复方案</div>
                {{ item.defect_fix }}
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
defineProps({
    info: {
        type: Object,
        required: true,
    },
});
</script>

<style lang='less' scoped>
.left_title {
    font-size: 18px;
    color: #3c3c3c;
    font-weight: 500;
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    span {
        width: 2px;
        height: 16px;
        display: inline-block;
        background: #6C87FF;
        border-radius: 100px;
        vertical-align: -2px;
        margin-right: 8px;
    }
}

.strategy_content {
    padding: 24px;
    background-color: #F7F8FB;
    border-radius: 4px;
    margin-bottom: 16px;

    .title {
        color: #3c3c3c;
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 8px;
    }

    .part {
        padding: 16px;
        background-color: #fff;
        border-radius: 4px;
        color: #858585;
        margin-bottom: 10px;

        div {
            margin-bottom: 6px;
        }
    }
}
</style>
