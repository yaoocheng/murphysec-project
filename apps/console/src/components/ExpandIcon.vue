<template>
    <span class="expand_icons">
        <i class="murphy icon-xiala1" v-if="!expand&&type==='t'"></i>
        <i class="murphy icon-shouqi" v-else-if="expand&&type==='t'"></i>
        <i class="murphy icon-you-shouqi" v-else-if="!expand&&type==='r'"></i>
        <i class="murphy icon-xiala1" v-else-if="expand&&type==='r'"></i>
    </span>
</template>

<script setup lang='ts'>
defineProps(['expand', 'type']); // type: r  t
</script>

<style lang="less">
.expand_icons i {
    font-size: 18px;
    font-weight: bold;
    color: #3c3c3c;
    // color: #858585;
}
</style>
