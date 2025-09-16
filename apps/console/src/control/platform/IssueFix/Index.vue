<template>
    <div class="flex justify-between items-center text-[18px] text-[#3c3c3c] font-medium mb-4">
        <div>
            <span class="inline-block w-[2px] h-4 bg-[#6C87FF] rounded-[100px] align-[-2px] mr-2"></span>
            漏洞修复方案
        </div>
    </div>
    <FixTarget />
    <FixPlan />
    <FixStep />
</template>

<script setup lang="ts">
import FixTarget from './FixTarget.vue';
import FixPlan from './FixPlan.vue';
import FixStep from './FixStep.vue';

</script>
