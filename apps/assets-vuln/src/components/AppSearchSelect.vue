<template>
    <a-select
        mode="multiple"
        placeholder="请搜索选择应用"
        style="width: 100%"
        :filter-option="false"
        :not-found-content="state.fetching ? undefined : null"
        :options="state.data"
        @search="fetchApps"
        :max-tag-count='1'
        showArrow
    >
        <template v-if="state.fetching" #notFoundContent>
            <a-spin size="small" />
        </template>

        <template #maxTagPlaceholder="omittedValues">
            <span >+ {{ omittedValues.length }}</span>
        </template>

        <template #suffixIcon>
            <Svg height="12px" width="12px" name="select-suffix" color="#999999"></Svg>
        </template>
    </a-select>
</template>
<script setup>
import { onMounted, reactive, watch } from 'vue';
import { debounce } from 'lodash-es';
import { getPreparationAppListApi } from 'api/data.js';

const { alreadyHaveOptions } = defineProps({
    alreadyHaveOptions: {
        type: Array,
        default: () => [],
    },
});

console.log('alreadyHaveOptions', alreadyHaveOptions);

// 默认展示的100条
const defaultData = [];

// 去重函数
const filterUniqueApps = (arr) => {
    // 使用 Map 去重
    const uniquelist = [];
    const seen = new Map();
    arr.forEach((app) => {
        if (!seen.has(app.value)) {
            seen.set(app.value, true);
            uniquelist.push(app);
        }
    });
    return uniquelist;
};

let lastFetchId = 0;
const state = reactive({
    data: [...alreadyHaveOptions],
    value: [],
    fetching: false,
});

console.log('state', state);
const fetchApps = debounce(async (value) => {
    console.log('fetching user', value);
    if (!value) {
        state.data = filterUniqueApps([...defaultData, ...alreadyHaveOptions]);
        return 0;
    }
    lastFetchId += 1;
    const fetchId = lastFetchId;
    state.data = [];
    state.fetching = true;
    const AppData = await getPreparationAppListApi(
        {
            application_name: value,
            limit: 100,
            data_status: 'published',
        },
    );
    console.log(AppData.data.data);
    if (fetchId !== lastFetchId) {
        return 0;
    }
    const data = AppData.data.data.list.map((app) => ({
        label: app.application_name,
        value: app.application_id,
    }));
    // 合并并去重
    const uniqueData = data.filter((newItem) => !alreadyHaveOptions.some((existingItem) => existingItem.value === newItem.value));
    state.data = [...uniqueData, ...alreadyHaveOptions];

    console.log('state.data', state.data);
    state.fetching = false;
}, 300);
watch(() => state.value, (newValue) => {
    console.log('选中值变化:', newValue);
});

onMounted(async () => {
    console.log('mounted');
    const AppData = await getPreparationAppListApi(
        {
            limit: 100,
            data_status: 'published',
        },
    );
    defaultData.push(...AppData.data.data.list.map((app) => ({
        label: app.application_name,
        value: app.application_id,
    })));
    // 合并两个数组
    const combinedData = [...defaultData, ...alreadyHaveOptions];

    // 将去重后的数据赋值给 state.data
    state.data = filterUniqueApps(combinedData);
});
</script>
