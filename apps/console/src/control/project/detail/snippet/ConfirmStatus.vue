<template>
    <el-tag v-if="status === 2" color="#F34D3D33" class="px-1 ml-1" size="small" :disable-transitions="true">
        <template #default>
            <span class="text-[#D83931]">
                待确认
                <i v-if="high_recommend" class="murphy align-[-1px] icon-tan text-[#D83931]" style="font-size: 13px;"></i>
            </span>
        </template>
    </el-tag>
    <el-tag v-if="status === 3" color="#38C72833" class="px-1 ml-1" size="small" :disable-transitions="true">
        <template #default>
            <span class="text-[#38C728]">
                已确认
            </span>
        </template>
    </el-tag>
    <el-tag v-if="status === 1" color="#EBEBEB" class="px-1 ml-1" size="small" :disable-transitions="true">
        <template #default>
            <span class="text-85">
                已忽略
            </span>
        </template>
    </el-tag>
</template>

<script setup>
defineProps(['status', 'high_recommend']);
</script>
