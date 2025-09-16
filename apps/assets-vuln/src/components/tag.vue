<template>
    <div class="tag" :style="{ ...cssClass }" :class="type">
        <div class="truncate">
            {{ text }}
        </div>
    </div>
</template>

<script setup>
const {
    text = '默认',
    cssClass = {},
    type = 'normal',
} = defineProps(['text', 'cssClass', 'type']);
</script>

<style scoped>
.tag {
    height: 18px;
    width: fit-content;
    padding: 2px 4px;
    border-radius: 4px;
    font-size: 10px;
    letter-spacing: 0px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
}

.normal {
    background-color: #BF1C0D;
    color: #FFFFFF;
}

.disable {
    background-color: none;
    color: #BF1C0D;
    border: 1px solid #BF1C0D;
    opacity: 0.1;
}

.vulnerability_type{
    color: #999999;
    border: 1px solid #CCCCCC;
    background-color: none;
    padding: 2px 4px !important;
    font-weight: 400;
    border-radius: 2px;
}

.software_type{
    background-color: #E6E6E6 ;
    color: #3C3C3C;
    border: none;
    background-color: none;
    padding: 3px 4px !important;
}
</style>
