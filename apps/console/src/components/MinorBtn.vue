<template>
    <el-button :style="styles">
        <slot />
    </el-button>
</template>

<script setup lang='ts'>
const props = defineProps({
    styles: {
        type: Object,
        default: () => ({
            w: 'auto', // 宽
            h: '32px', // 高
            f: '14px', // 字号
        }),
        require: false,
    },
});

const styles = {
    width: `${props.styles.w}`,
    height: `${props.styles.h}`,
    fontSize: `${props.styles.f}`,
};
</script>

<style lang='less' scoped>
.el-button {
    &:hover {
        background-color: #6C87FF1A;
        color: #6C87FF;
    }

    background: #FFFFFF;
    border: 1px solid #6C87FF;
    border-radius: 6px;
    color: #6C87FF;
}
</style>
