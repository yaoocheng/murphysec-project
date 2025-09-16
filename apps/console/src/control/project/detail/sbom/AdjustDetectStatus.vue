<template>
    <div style="height: calc(100vh - 350px)" class="text-3c flex justify-center items-center text-center">
        <div>
            <div class="loaders w-[8] mb-6"></div>
            <div class="font-medium text-2xl mb-4">
                {{ !adjustDetectType ? '正在检测中,请耐心等待…' : '正在更新数据，预计等待 5 秒…' }}
            </div>
            <div v-if="adjustDetectType" class="text-85 text-sm w-[400px]">
                <span>由于组件信息和同源性分析结果已变更，需要更新数据来获取组件的安全风险及许可证风险等信息</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { adjustDetectType } from '../../business';
</script>
