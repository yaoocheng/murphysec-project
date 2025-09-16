<template>
    <a-tree-select :virtual='false' popupClassName="org-tree-select-popup" v-model:search-value="searchValue"
                   :tree-data="treeData" :load-data="onLoadData" @change="selectNode" @search="onSearch"
                   tree-node-filter-prop="label" >
        <!-- show-search 定义是否可以搜索 -->

        <template #suffixIcon>
            <Svg height="12px" width="12px" name="select-suffix" color="#999999"></Svg>
        </template>

        <template #title="{ label, disabled }">
            <div class="flex items-center justify-between collaboration-org">
                <span class="ellipsis font-normal max-w-[510px]" :class="{'cursor-not-allowed text-99': disabled}"> {{ label }}</span>
                <Svg class="check-icon mr-2" height="12px" width="12px" name="list-checked" color="#6C87FF"></Svg>
            </div>
        </template>
    </a-tree-select>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { getOrgByLevelApi, getOrgByIdApi, getContractOrgByLevelApi } from '@/api/org.js';

const route = useRoute();
const isInviteCollaboration = computed(() => route.path.includes('/invite-collaboration'));

const searchValue = ref('');
const { organizeId, isDisabledLowerOrg, otherOrgId } = defineProps({
    // 组织ID
    organizeId: {
        type: String,
        required: false,
    },
    isDisabledLowerOrg: {
        type: Boolean,
        default: false,
    },
    otherOrgId: {
        type: String,
        default: '',
    },
});

// const isDisabledLowerOrg = ref(false);
// const organizeObjects = {
//     key: '1933484721715548160',
//     value: '1933484721715548160',
//     label: '在线视频业务部',
// };
// 懒加载树数据 - 初始只显示根节点
const treeData = ref([]);
const cacheData = ref([]);

const selectNode = (value, node) => {
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
    const nodeValue = treeNode.value;

    const params = {
        parent_org_id: nodeValue,
    };

    // 根据路由判断使用不同的API
    if (isInviteCollaboration.value && route.params.id) {
        params.id = route.params.id;
    }

    const apiFunction = isInviteCollaboration.value ? getContractOrgByLevelApi : getOrgByLevelApi;
    const { data } = await apiFunction(params);
    const children = data.data.map((item) => ({
        label: item.organize_name,
        value: item.organize_id,
        key: item.organize_id,
        isLeaf: !item.has_soon,
        disabled: treeNode.disabled || (isDisabledLowerOrg && (item.organize_id === otherOrgId)),
    }));

    if (children.some((item1) => treeData.value.some((item2) => item1.value === item2.value))) {
        treeData.value.pop();
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
        console.log(cacheData.value, '恢复原始树结构');

        treeData.value = [...cacheData.value];
        return;
    }

    const params = { org_name: value };

    // 根据路由判断使用不同的API
    if (isInviteCollaboration.value && route.params.id) {
        params.id = route.params.id;
    }

    const apiFunction = isInviteCollaboration.value ? getContractOrgByLevelApi : getOrgByLevelApi;
    const { data } = await apiFunction(params);
    treeData.value = data.data.map((item) => ({
        label: item.organize_name,
        value: item.organize_id,
        key: item.organize_id,
        isLeaf: true,
    }));
};

// 初始化
const initTreeData = async () => {
    const params = {};

    // 根据路由判断使用不同的API
    if (isInviteCollaboration.value && route.params.id) {
        params.id = route.params.id;
    }

    const apiFunction = isInviteCollaboration.value ? getContractOrgByLevelApi : getOrgByLevelApi;
    const { data } = await apiFunction(params);
    treeData.value = data.data.map((item) => ({
        label: item.organize_name,
        value: item.organize_id,
        key: item.organize_id,
        isLeaf: !item.has_soon,
        disabled: isDisabledLowerOrg && (item.organize_id === otherOrgId),
    }));

    if (organizeId && organizeId !== '0' && treeData.value.some((item1) => organizeId !== item1.organize_id)) {
        const { data: orgData } = await getOrgByIdApi({ org_id: organizeId });

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

    cacheData.value = [...treeData.value];
};

onMounted(() => {
    initTreeData();
});

</script>
