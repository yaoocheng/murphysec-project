<template>
    <a-tree-select :virtual='false' popupClassName="base-tree-select-popup" :treeLoadedKeys="loadedKeys" v-model:treeExpandedKeys="expandedKeys" @treeExpand="onExpand" v-model:search-value="searchValue"
                   :tree-data="treeData" suffixIconName="nav_arrow"
                   suffixIconColor="#6C87FF"
                   placement="bottomRight" :load-data="onLoadData" @change="selectNode" @search="onSearch"
                   tree-node-filter-prop="label">
        <!-- show-search 定义是否可以搜索 -->

        <template #suffixIcon>
            <Svg height="10px" width="10px" name="nav_arrow" color="#999999"></Svg>
        </template>

        <template #title="{ label }">
            <div class="flex items-center justify-between">
                <span class="ellipsis font-normal max-w-[450px]"> {{ label }}</span>
                <Svg class="check-icon mr-2" height="12px" width="12px" name="list-checked" color="#6C87FF"></Svg>
            </div>
        </template>
    </a-tree-select>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { emitter } from '@/utils';
import { getGlobalOrgTreeApi, getOrgByIdApi } from '@/api/org.js';
import { userInfo } from '@/store';

const searchValue = ref('');
const emits = defineEmits(['updateData']);

// 懒加载树数据 - 初始只显示根节点
const treeData = ref([]);
const cacheData = ref([]);

const loadedKeys = ref([]);
const expandedKeys = ref([]);
const onExpand = (keys) => {
    expandedKeys.value = keys;
};

// 更新树
const updateRenderTree = async () => {
    searchValue.value = '';
    loadedKeys.value = [];
    // eslint-disable-next-line no-use-before-define
    onLoadData();
};

const selectNode = (value, node) => {
    emits('updateData', value);

    if (searchValue.value) {
        if (cacheData.value[cacheData.value.length - 1].style) {
            cacheData.value.pop();
        }
        cacheData.value.push({
            label: node[0],
            value,
            key: value,
            style: {
                display: 'none',
            },
        });
    }
};

const onLoadData = async (treeNode) => {
    const nodeValue = treeNode?.value || undefined;

    const { data } = await getGlobalOrgTreeApi({
        parent_org_id: nodeValue,
    });
    const children = data.data.map((item) => ({
        label: item.organize_name,
        value: item.organize_id,
        key: item.organize_id,
        isLeaf: !item.has_soon,
    }));

    if (children.some((item1) => treeData.value.some((item2) => item1.value === item2.value))) {
        treeData.value.pop();
    }
    if (!loadedKeys.value.includes(nodeValue)) {
        loadedKeys.value.push(nodeValue);
    }

    // 找到当前节点并添加子节点
    const updateNodeChildren = (nodes) => {
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].value === nodeValue) {
                nodes[i].children = [...children];
                return true;
            }
            if (nodes[i].children && updateNodeChildren(nodes[i].children)) {
                return true;
            }
        }
        return false;
    };

    updateNodeChildren(treeData.value);
};

const onSearch = async (value) => {
    searchValue.value = value;

    if (!value || value.trim() === '') {
        treeData.value = [...cacheData.value];
        return;
    }

    const { data } = await getGlobalOrgTreeApi({ org_name: value });
    treeData.value = data.data.map((item) => ({
        label: item.organize_name,
        value: item.organize_id,
        key: item.organize_id,
        isLeaf: true,
    }));
};

// 初始化
const initTreeData = async () => {
    const { data } = await getGlobalOrgTreeApi({});
    treeData.value = data.data.map((item) => ({
        label: item.organize_name,
        value: item.organize_id,
        key: item.organize_id,
        isLeaf: !item.has_soon,
    }));

    cacheData.value = [...treeData.value];

    if (userInfo.value.org_id && userInfo.value.org_id !== '0' && treeData.value.some((item1) => userInfo.value.org_id !== item1.organize_id)) {
        const { data: orgData } = await getOrgByIdApi({ org_id: userInfo.value.org_id });

        treeData.value.push({
            label: orgData.data.organize_name,
            value: orgData.data.organize_id,
            key: orgData.data.organize_id,
            isLeaf: true,
            style: {
                display: 'none',
            },
        });
    }
    // if (treeData.value.length > 0) {
    //     userInfo.value.org_id = treeData.value[0].value;
    // }
};
emitter.on('updateGlobalOrgTree', initTreeData);

emitter.on('sysChangeOrgTree', () => {
    updateRenderTree();
    initTreeData();
});

onMounted(() => {
    initTreeData();
});

</script>
