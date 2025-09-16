<template>
    <div class="px-6 py-4 h-full" style="border-top: 8px solid #f2f2f2;">
        <div class="py-2 h-full bg-white flex gap-6">
            <!-- tree -->
            <div class="w-[314px] flex flex-col items-center">
                <Input v-model:value="orgSearchKeyword" @input="onSearch" placeholder="搜索组织名称"
                       class="w-full mb-4 base-input" />

                <div class="w-full max-h-[calc(100%-96px)] overflow-auto">
                    <a-tree :loadedKeys="loadedKeys" :expanded-keys="expandedKeys" @expand="onExpand" :tree-data="treeData"
                            v-model:selected-keys="selectedKeys" :load-data="onLoadData"
                            class="w-full org-tree base-table-select" :class="{'search-tree': isSearching}" :default-expand-all="true">
                        <template #title="{ label, organize_leader, organize_pid, key }">
                            <div @click="handleClickNode({ label, organize_leader, organize_pid, key })" class="w-full flex items-center">
                                <TextPopover v-if="label.length > 15" :text="label">
                                    <div :class="selectedKeys.includes(key) ? 'text-primary' : ''"
                                         class="flex-1 w-0 truncate">
                                        {{ label }}
                                    </div>
                                </TextPopover>
                                <div v-else :class="selectedKeys.includes(key) ? 'text-primary' : ''"
                                     class="flex-1 w-0 truncate">
                                    {{ label }}
                                </div>

                                <a-popover :overlayInnerStyle="{ padding: '6px 0px', width: '120px' }"
                                           placement="bottomRight" :arrow="false">
                                    <template #content>
                                        <div class="cursor-pointer">
                                            <div @click.stop="handleEdit(label, organize_leader, organize_pid, key)"
                                                 class="table-operation-item px-6 py-2">
                                                <span>编辑组织</span>
                                            </div>
                                            <div @click.stop="openOrgDrawer = true; orgData = { organize_pid: key }"
                                                 class="table-operation-item px-6 py-2">
                                                <span>新增子组织</span>
                                            </div>
                                            <div @click.stop="turnOnLog(key)" class="table-operation-item px-6 py-2">
                                                <span>操作日志</span>
                                            </div>
                                            <div @click.stop="handledelete(key)"
                                                 class="table-operation-item text-error px-6 py-2">
                                                <span>删除</span>
                                            </div>
                                        </div>

                                    </template>
                                    <span @click.stop
                                          :class="selectedKeys.includes(key) ? 'hover:bg-[#E5EAFF]' : 'hover:bg-[#E6E6E6]'"
                                          class="icon-hover w-6 h-6 leading-6 cursor-pointer ml-3">
                                        <MoreOutlined :class="selectedKeys.includes(key) ? 'text-[#0025CC]' : ''"
                                                      class="text-3c text-base" />
                                    </span>
                                </a-popover>

                            </div>
                        </template>
                    </a-tree>

                    <div v-if="!treeData.length" class="text-center mt-4 text-gary-400">
                        <span>没有找到和{{ orgSearchKeyword }}相关的内容</span>
                    </div>
                </div>

                <a-button v-if="!isSearching" @click="openOrgDrawer = true" class="w-full mt-4">
                    <PlusCircleFilled /> 新增组织
                </a-button>
            </div>

            <a-divider type="vertical" class="h-full" />

            <!-- member -->
            <div class="flex-1 w-0">
                <Member v-if="orgCurData?.organize_id" :orgCurData="orgCurData" />
            </div>
        </div>
    </div>
    <!-- 操作日志 -->
    <OperationLogModal v-model:open="opetateLog" v-if="opetateLog" :logfilter="logfilter" />

    <!-- 添加编辑组织 -->
    <OrgDrawer v-model:open="openOrgDrawer" v-if="openOrgDrawer" @updateTree="updateRenderTree" :orgData="orgData" />
</template>

<script setup>
import {
    PlusCircleFilled, MoreOutlined,
} from '@ant-design/icons-vue';
import { getOrgByLevelApi, delCurOrgApi } from 'api/org';
import { ref, watch } from 'vue';
import { emitter } from 'utils';
import OperationLogModal from 'comp/OperationLogModal.vue';
import { debounce } from '@/utils';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';
import OrgDrawer from './OrgDrawer.vue';
import Member from './Member.vue';

const { showDeleteConfirm } = useDeleteConfirm();
const orgSearchKeyword = ref(''); // 搜索树
const isSearching = ref(false);
const selectedKeys = ref([]); // 选中的节点
const treeData = ref([]);
const cacheData = ref([]);
const openOrgDrawer = ref(false);
const orgData = ref({});

// 操作日志相关
const opetateLog = ref(false);
const logfilter = ref({
    entity_type: 'Organize',
    entity_id: null,
});

const loadedKeys = ref([]);
const expandedKeys = ref([]);
const onExpand = (keys) => {
    expandedKeys.value = keys;
};

// 编辑
const handleEdit = (label, leader, pid, id) => {
    orgData.value = {
        organize_name: label,
        organize_leader: leader,
        organize_pid: pid,
        organize_id: id,
    };
    openOrgDrawer.value = true;
};

watch(openOrgDrawer, (newVal) => {
    if (!newVal) {
        orgData.value = {};
    }
});

// 更新树
const updateRenderTree = async () => {
    orgSearchKeyword.value = '';
    loadedKeys.value = [];
    // eslint-disable-next-line no-use-before-define
    onLoadData();
};

// 懒加载
const onLoadData = async (treeNode) => {
    const nodeValue = treeNode?.value || undefined;

    const { data } = await getOrgByLevelApi(nodeValue ? {
        parent_org_id: nodeValue,
    } : {});

    // children
    const children = data.data.map((item) => ({
        label: item.organize_name,
        value: item.organize_id,
        key: item.organize_id,
        isLeaf: !item.has_soon,
        ...item,
    }));

    if (!loadedKeys.value.includes(nodeValue)) {
        loadedKeys.value.push(nodeValue);
    }

    if (!nodeValue) {
        if (!selectedKeys.value.length) {
            selectedKeys.value = [children[0].organize_id];
            // eslint-disable-next-line no-use-before-define
            orgCurData.value = {
                organize_id: children[0].organize_id,
                organize_name: children[0].organize_name,
                organize_leader: children[0].organize_leader,
                organize_pid: children[0].organize_pid,
            };
        }
        treeData.value = children;
        cacheData.value = children;
    } else {
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
    }
};
onLoadData();

// 搜索
const onSearchImpl = async () => {
    if (!orgSearchKeyword.value || orgSearchKeyword.value.trim() === '') {
        isSearching.value = false;
        treeData.value = cacheData.value;
        return;
    }
    isSearching.value = true;

    const { data } = await getOrgByLevelApi({ org_name: orgSearchKeyword.value });
    treeData.value = data.data.map((item) => ({
        label: item.organize_name,
        value: item.organize_id,
        key: item.organize_id,
        isLeaf: true,
        ...item,
    }));
};

// 使用防抖包装搜索函数，避免频繁触发搜索请求
const onSearch = debounce(onSearchImpl, 300);

// 点击节点
const orgCurData = ref({});
const handleClickNode = (data) => {
    orgCurData.value = {
        organize_id: data.key,
        organize_name: data.label,
        organize_leader: data.organize_leader,
        organize_pid: data.organize_pid,
    };
};

// 开启操作日志
const turnOnLog = (organizationId) => {
    opetateLog.value = true;
    logfilter.value.entity_id = String(organizationId);
};

// 删除
const handledelete = (key) => {
    showDeleteConfirm({
        record: { id: key },
        onDelete: delCurOrgApi,
        onSuccess: () => {
            updateRenderTree();
            emitter.emit('updateGlobalOrgTree');
        },
    });
};
</script>

<style lang="less">
.org-tree .ant-tree-treenode {
    width: 100%;
    height: 40px;
    align-items: center;
    padding-bottom: 0;

    .ant-tree-switcher {
        height: 100%;
        line-height: 40px;
    }

    // &:hover {
    //     background-color: #f2f2f2;
    // }

    .ant-tree-node-content-wrapper {
        &:hover {
            background-color: #f2f2f2;
        }

        height: 100%;
        line-height: 40px;
        flex: 1;
        padding: 0 8px;
    }

    .ant-tree-switcher-icon {
        font-size: 12px;
        color: #999;
    }

    .ant-tree-node-content-wrapper.ant-tree-node-selected {
        &:hover {
            background-color: #f0f5ff;
        }
    }
}

.search-tree.org-tree {
    .ant-tree-switcher {
        display: none;
    }
}
</style>
