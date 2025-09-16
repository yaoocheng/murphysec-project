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
        background-color: #6C87FFCC;
    }

    color: #fff;
    background-color: #6C87FF;
    border-radius: 6px;
}
</style>
