<template>
    <a-input class="w-[240px]" :allowClear="true">
        <template #prefix>
            <Svg height="16px" width="16px" name="search" color="#666666"></Svg>
        </template>

        <template #suffixIcon>
            <Svg height="12px" width="12px" name="select-suffix" color="#666666"></Svg>
        </template>
    </a-input>
</template>
