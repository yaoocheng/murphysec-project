<template>
    <div class="flex items-center flex-wrap gap-2">
        <a-popover title="筛选" trigger="click" placement="bottomLeft" :arrow=false>
            <template #content>
                <div class="p-3">
                    <div v-for="(filter,index) in selectedFilters" :key="index" class="flex items-center gap-2 mb-2" v-if="selectedFilters.length">
                        <Select class="w-[140px] base-select" :allowClear="false" v-model:value="filter.filterkey" :options="filterConfig" :popupClassName="['vuln-filter-popup','no-check-icon']" @change="filter.flitervalue = ''" />

                        <Select v-if="filterConfig.find(item=>item.value===filter.filterkey)?.type === 'select'" class="w-[240px] base-select" @change="changeFilterValue(filter)" :disabled="!filter.filterkey" v-model:value="filter.flitervalue" :options="filterConfig.find(item=>item.value===filter.filterkey)?.options" :popupClassName="'vuln-filter-popup'" />

                        <a-range-picker v-else-if="filterConfig.find(item=>item.value===filter.filterkey)?.type === 'time'" class="w-[240px] text-sm prop-range-picker" @change="changeFilterValue(filter)" :disabled="!filter.filterkey" v-model:value="filter.flitervalue" :option="filterConfig.find(item=>item.value===filter.filterkey)?.options" />

                        <Select :popupClassName="'base-select-dropdown'" v-else class="w-[240px] base-select" :disabled="true" />

                        <div class="icon-button-gray" @click="removeFilter(filter)">
                            <Svg height="16px" width="16px" name="close"></Svg>
                        </div>
                    </div>
                    <div v-if="selectedFilters.length < filterConfig.length" @click="addFilterHandle" class="cursor-pointer text-button-blue gap-1 mt-4">
                        <Svg name="add_outlined" height="14px" width="14px"></Svg>
                        添加筛选条件
                    </div>
                </div>
            </template>
            <div class="filter-button">
                <div class="flex items-center gap-1.5">
                    <Svg height="14px" width="14px" name="filter_outlined" class=" cursor-pointer"></Svg>
                    <div class="flex gap-1">
                        <span class="text-xs">筛选</span>
                        <span class="text-[#6C87FF] text-xs font-medium">{{ `${selectedFilters.length}个条件` }}</span>
                    </div>
                </div>
                <Svg height="10px" width="10px" name="down-outlined" class=" cursor-pointer" @click="removeFilter(filter)"></Svg>
            </div>
        </a-popover>

        <div v-for="(filter,index) in selectedFilters.filter(item=>item.filterkey)" :key="index" class="h-6 flex  px-2 items-center rounded bg-f2 vuln-filter">
            <span class="text-99 text-xs">{{ filterConfig.find(item => item.value === filter.filterkey)?.label }}：</span>

            <Select v-if="filterConfig.find(item=>item.value===filter.filterkey)?.type === 'select'" class="w-auto filter-select-content" @change="filters[filter.filterkey]=filter.flitervalue;" :allowClear="false" :bordered="false" size="small" v-model:value="filter.flitervalue" :options="filterConfig.find(item=>item.value===filter.filterkey)?.options" :popupClassName="'vuln-filter-popup'" :iconSize="'10px'" />

            <a-range-picker v-if="filterConfig.find(item=>item.value===filter.filterkey)?.type === 'time'" class="w-auto vuln-date-picker" @change="filters[filter.filterkey]=filter.flitervalue;" :allowClear="false" :bordered="false" size="small" v-model:value="filter.flitervalue" :options="filterConfig.find(item=>item.value===filter.filterkey)?.options" />
        </div>
    </div>
</template>

<script setup>
import {
    watch, onMounted,
} from 'vue';
import { filterConfig } from '../contants';
import { filters, selectedFilters } from './filter';

// 添加筛选条件
const addFilterHandle = () => {
    selectedFilters.push({ filterkey: '', oldfilterkey: '', flitervalue: '' });
};

// 删除筛选条件
const removeFilter = (filter) => {
    const index = selectedFilters.findIndex((f) => f.filterkey === filter.filterkey);

    if (index > -1) {
        selectedFilters.splice(index, 1);
        filters[filter.filterkey] = undefined;
    }
};

watch(selectedFilters, (newValue) => {
    // eslint-disable-next-line no-use-before-define
    filterConfig.forEach((item) => {
        if (newValue.some((ele) => ele.filterkey === item.value)) {
            item.disabled = true;
        } else {
            item.disabled = false;
        }
    });

    filterConfig.sort((a, b) => {
        if (a.disabled && !b.disabled) return 1;
        if (!a.disabled && b.disabled) return -1;
        return 0;
    });
});

// 选择筛选条件值
const changeFilterValue = (filter) => {
    filters[filter.oldfilterkey] = undefined;
    filter.oldfilterkey = filter.filterkey;
    filters[filter.filterkey] = filter.flitervalue;
};

onMounted(() => {
    filterConfig.sort((a, b) => {
        if (a.disabled && !b.disabled) return 1;
        if (!a.disabled && b.disabled) return -1;
        return 0;
    });
});

</script>

<style scoped>
.filter-button{

    height: 28px;
    width: 140px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    border: 1px solid #d1d5db;

    &:hover{
        border: 1px solid rgba(108, 135, 255, 1)
    }
}

</style>

<style>

.prop-range-picker{

    box-shadow: none;

    .ant-picker-input > input{
        font-size: 14px !important;
    }

    .ant-picker-active-bar{
        display: none;
    }

    .ant-picker-clear {
        color: #999999 !important;

        &:hover{
                color: #666666 !important;
        }

    }

    .ant-picker-suffix{
        color: #666666 !important;
    }

    .ant-picker-range-separator{
        color: #666666 !important;
    }
}

.filter-select-content{

    .ant-select-selection-item{
        color: #3C3C3C !important;

        font-size: 12px;
    }
    .ant-select-arrow{
        inset-inline-end: 0 !important;
        margin-left:  8px !important;
    }
}

.vuln-filter{
    height: 28px;
    .ant-select-selector{
        padding: 0 !important;
    }
}

.vuln-date-picker{
    .ant-picker-input > input{
        font-size: 12px !important;
        width: 75px !important;
    }

    .ant-picker-active-bar{
        display: none;
    }

    padding-left: 0;

    .ant-picker-suffix{
        color: #666666 !important;
    }

}

</style>
