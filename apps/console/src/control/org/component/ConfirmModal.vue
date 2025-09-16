<template>
    <el-dialog width="420px" :close-on-click-modal="false" :show-close="false">
        <template #header>
            <div class="title">
                <i class="murphy icon-gantanhao g-mr-8 g-f-18" style="color: #FF9940;"></i>
                <slot name="header"></slot>
            </div>
        </template>
        <slot />

        <div class="btns">
            <el-button class="cancle_btn" @click="emits('update:modelValue', false)">取消</el-button>
            <el-button class="confirm_err" @click="emits('confirm')">确认</el-button>
        </div>
    </el-dialog>
</template>

<script setup lang='ts'>
// import { ref, reactive, onBeforeMount, onMounted, watch } from 'vue';
// import { useRoute, useRouter } from 'vue-router';
// import { } from 'api/project';

const emits = defineEmits(['update:modelValue', 'confirm']);

// const route = useRoute();
// const router = useRouter();

// onBeforeMount(() => {
// })

// onMounted(() => {
// })
</script>

<style scoped lang='less'>
.confirm_err {
    background-color: #F34D3D;
    color: #fff;
}
.btns {
    margin-top: 20px;
    margin-left: 50%;

    .el-button {
        width: 80px;
    }
}
</style>
