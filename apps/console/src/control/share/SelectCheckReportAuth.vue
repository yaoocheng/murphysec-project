<template>
    <el-select @change="emits('selectAuthHandle', value)" :style="{ width: value === 11 ? '60%' : '40%' }"
        class="select_check_report_auth" v-model="value">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import store from '@/utils/store';

const emits = defineEmits(['selectAuthHandle']);
const value = ref<number>(12);
const options = [
    // {
    //     value: 11,
    //     label: `加入团队后可编辑${store.securityId ? '安全问题' : '报告'}（登录后）`,
    // },
    {
        value: 12,
        label: `可查看${store.securityId ? '安全问题' : '报告'}（匿名）`,
    },
];
</script>

<style lang='less'></style>
