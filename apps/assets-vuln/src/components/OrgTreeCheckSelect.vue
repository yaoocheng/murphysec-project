<template>
    <a-tree-select v-model:search-value="searchValue" popupClassName="org-tree-select-popup org-tree-check-select-popup"
                   @search="onSearch" @change="selectNode" :treeCheckStrictly="true" tree-checkable
                   :show-checked-strategy="SHOW_ALL" style="width: 100%" :virtual='false'
                   :tree-data="treeData"
                   :load-data="onLoadData" multiple tree-node-filter-prop="label" >
        <template #title="{ label }">
            <div class="flex items-center justify-between">
                <span class="ellipsis font-normal max-w-[510px]"> {{ label }}</span>
            </div>
        </template>
    </a-tree-select>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { TreeSelect } from 'ant-design-vue';
import { getOrgByLevelApi } from '@/api/org.js';

const { SHOW_ALL } = TreeSelect;
const emits = defineEmits(['updateField']);
const { organization } = defineProps({
    organization: {
        type: Array,
        default: () => [],
    },
});

// const { organize } = defineProps({
//     organize: {
//         type: Array,
//         default: () => [],
//     },
// });
// const selectValue = ref(organize);

// const expandedKeys = ref(['root 1', 'parent 1', 'parent 1-0']);

// const onExpand = (value) => {
//     console.log(value);
// };
const cacheSelect = ref(organization || []); // 处理搜索后选择后 label消失显示问题
const selectNode = (data, node, extra) => {
    if (data.length > cacheSelect.value.length) {
        cacheSelect.value.push(data[data.length - 1]);
    } else {
        cacheSelect.value = cacheSelect.value.filter((item) => item.value !== extra.triggerValue);
    }

    emits('updateField', cacheSelect.value);
};

// const SelectNode = (value, node, extra) => {
//     console.log('选择节点：', value, node, extra);
//     selectValue.value.push({
//         label: node[0],
//         value,
//         key: value,
//     });
// };

const cacheData = ref([]);
// 懒加载树数据 - 初始只显示根节点
const treeData = ref([]);

const onLoadData = async (treeNode) => {
    const nodeValue = treeNode.value;

    const { data } = await getOrgByLevelApi({
        parent_org_id: nodeValue,
    });
    const children = data.data.map((item) => ({
        label: item.organize_name,
        value: item.organize_id,
        key: item.organize_id,
        isLeaf: !item.has_soon,
    }));

    // if (children.some((item1) => treeData.value.some((item2) => item1.value === item2.value))) {
    //     treeData.value.pop();
    // }

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

const searchValue = ref('');

const onSearch = async (value) => {
    searchValue.value = value;

    if (!value || value.trim() === '') {
        // 搜索为空时恢复原始树结构
        treeData.value = [...cacheData.value];
        return;
    }

    const { data } = await getOrgByLevelApi({ org_name: value });

    treeData.value = data.data.map((item) => ({
        label: item.organize_name,
        value: item.organize_id,
        key: item.organize_id,
        isLeaf: true,
    }));
};

// watch(selectValue, (newValue) => {
//     console.log('选择：:', newValue);
// });

// watch(expandedKeys, (newValue) => {
//     console.log('展开：:', newValue);
// });

// watch(treeData, (newValue) => {
//     console.log(newValue);
// });

// 初始化
const initTreeData = async () => {
    const { data } = await getOrgByLevelApi({});
    treeData.value = data.data.map((item) => ({
        label: item.organize_name,
        value: item.organize_id,
        key: item.organize_id,
        isLeaf: !item.has_soon,
    }));

    cacheData.value = [...treeData.value];
};

onMounted(() => {
    initTreeData();
});
</script>

<style lang="less">
.org-tree-check-select-popup {
    .ant-select-tree-checkbox {
        margin-block-start: 0 !important;
        margin-left: 4px;
    }
}
</style>
