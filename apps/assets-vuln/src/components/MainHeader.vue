<template>
    <div class="h-14 bg-white border-solid border-0 border-b border-gary-50 px-6 flex justify-between items-center">
        <div class="text-sm font-medium">
            <a-breadcrumb :routes="routes" separator=">">
                <template #itemRender="{ route }">
                    <span v-if="routes.indexOf(route) === routes.length - 1">
                        {{ route.name }}
                    </span>
                    <router-link v-else :to="route.path">
                        {{ route.name }}
                    </router-link>
                </template>
            </a-breadcrumb>
        </div>

        <div class="flex gap-3 items-center">
            <div class="org-select-wrapper">
                <Svg class="ml-3" height="16px" width="16px" name="head-icon_group_outlined"></Svg>
                <GlobalOrgTreeSelect @updateData="updateData" class="org-select custom-tree-select" show-search v-model:value="sectionValue" placeholder="请搜索并选择组织"  />
            </div>
            <!-- :dropdownMatchSelectWidth="false" 关闭虚拟滚动实现横向滚动 -->

            <div class="sys-select-wrapper">
                <Svg class="ml-3" height="16px" width="16px" name="head-icon_sys_outline"></Svg>
                <a-tree-select
                    class="sys-select custom-tree-select group"
                    :listHeight="580"
                    popupClassName="base-tree-select-popup"
                    @change="changeSysHandle"
                    v-model:value="businessValue"
                    placeholder="所有业务系统"
                    :field-names="{
                        children: 'child',
                        label: 'business_system_name',
                        value: 'business_system_id',
                    }"
                    :tree-data="sysTree"
                    :showSearch="true"
                    tree-node-filter-prop="business_system_name"
                    placement="bottomRight"
                    allowClear
                >
                    <template #suffixIcon>
                        <Svg height="6px" :class="businessValue ? 'group-hover:hidden' : '' " width="10px" name="nav_arrow" color="#999999"></Svg>
                    </template>

                    <template #title="{ business_system_name }">
                        <div class="flex items-center justify-between">
                            <span class="ellipsis">{{ business_system_name}}</span>
                            <Svg class="check-icon mr-2" height="12px" width="12px" name="list-checked" color="#6C87FF"></Svg>
                        </div>
                    </template>
                </a-tree-select>

                <!-- <TreeSelectNew
                    class="sys-select custom-tree-select"
                    popupClassName="base-tree-select-popup"
                    @change="changeSysHandle"
                    v-model:value="businessValue"
                    :field-names="{
                        children: 'child',
                        label: 'business_system_name',
                        value: 'business_system_id',
                    }"
                    placeholder="所有业务系统"
                    :tree-data="sysTree"
                    :showSearch="true"
                    :isBus="true"
                    tree-node-filter-prop="business_system_name"
                    suffixIconName="nav_arrow"
                    suffixIconColor="#6C87FF"
                    placement="bottomRight"
                    allowClear
                >
                </TreeSelectNew> -->
            </div>
        </div>
    </div>

</template>

<script setup>
import { ref, watch, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import { getBusinessListApi, getBusinessSystemParentOrganizeApi } from 'api/bus';
import { userInfo } from '@/store';
import { emitter } from '@/utils';

const route = useRoute();
const sectionValue = ref(userInfo.value.org_id);
const businessValue = ref(userInfo.value.business_system_id);
const routes = ref(route.meta.bread);
const sysTree = ref([]);

watch(route, (newVal) => {
    routes.value = newVal.meta.bread;
});

// watch(() => userInfo.value.org_id, (newVal) => {
//     sectionValue.value = newVal;
// }, { deep: true });

// watch(() => userInfo.value.business_system_id, async (val) => {
//     if (val) {
//         const { data } = await getBusinessSystemParentOrganizeApi(val);
//         userInfo.value.org_id = String(data.data);
//     }
// });

const updateData = (val) => {
    userInfo.value.org_id = val;
    businessValue.value = undefined;
    userInfo.value.business_system_id = undefined;
};

const changeSysHandle = async (val) => {
    userInfo.value.business_system_id = val;

    if (val) {
        const { data } = await getBusinessSystemParentOrganizeApi(val);
        userInfo.value.org_id = String(data.data);
        sectionValue.value = String(data.data);
        emitter.emit('sysChangeOrgTree');
    }
};

const getSysTree = async () => {
    try {
        const { data } = await getBusinessListApi({
            organize_id: userInfo.value.org_id,
        });
        sysTree.value = data.data.data_list;
    } catch (error) {
        console.log(error);
    }
};

emitter.on('updateSysTree', getSysTree);

watch(sectionValue, async () => {
    if (sectionValue.value) {
        await getSysTree();
    }
});

onBeforeMount(async () => {
    await getSysTree();
});
</script>

<style>
.org-select, .sys-select {
    background-color: transparent !important;
    border-radius: 2px !important;
    border: none !important;

    .ant-select-selector {
        box-shadow: none !important;
        background-color: transparent !important;
        display: flex;
        align-items: center;
        justify-items: center;

        .ant-select-selection-search{
            display: flex;
            align-items: center;
            justify-items: center;
            margin-right: 10px;
        }

        .ant-select-selection-item {
            div {
                span{
                    color: #0025CC !important;
                }
            }
        }
    }
}

.org-select.ant-select-open, .sys-select.ant-select-open {
    .ant-select-selection-search > input{
        color: #0025CC !important;
        display: flex;
        align-items: center;
        /* justify-items: center; */
    }
    .ant-select-selector {
        .ant-select-selection-item {
            div {
                span{
                    color: #99ACFF !important;
                }
            }
        }
    }
}
</style>

<style scoped>

.org-select-wrapper, .sys-select-wrapper {
    position: relative;
    display: inline-flex;
    align-items: center;

    background-color: #E5EAFF;
    border-radius: 2px;

    &:hover{
        background-color: #d6dfff;
    }
}

.org-select{
    min-width: 212px;
    max-width: 800px;
}

.sys-select{
    min-width: 212px;
}

.org-select, .sys-select {
    width: auto !important;
    background-color: transparent !important;
    border-radius: 2px !important;
    border: none !important;
}

.suffix-icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
}

.org-select :deep(.ant-select-selector),
.sys-select :deep(.ant-select-selector) {
    background-color: transparent;
    border: none !important;
    padding: 6px !important;
    height: 32px !important;
    line-height: 22px !important;
    display: flex !important;
    align-items: center !important;
}

.org-select :deep(.ant-select-selection-placeholder),
.sys-select :deep(.ant-select-selection-placeholder),
.org-select :deep(.ant-select-selection-item),
.sys-select :deep(.ant-select-selection-item) {
    color: #0025CC !important;
    font-size: 14px !important;
    line-height: 22px !important;
    padding-left: 4px !important;
    display: flex !important;
    align-items: center !important;
    justify-items: center;
    margin-right: 6px;

    div>span{
        font-size: 13px;
    }
}

/* 修改清除图标的样式 */
.org-select :deep(.ant-select-clear),
.sys-select :deep(.ant-select-clear) {
    background-color: transparent !important;
    color: #6C87FF !important;
    font-size: 14px !important;
    right: 8px !important;
    top: 13px !important;
    z-index: 3 !important;
    width: 16px !important;
    height: 16px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
}

.org-select :deep(.ant-select-clear:hover),
.sys-select :deep(.ant-select-clear:hover) {
    color: #0025CC !important;
    background-color: transparent !important;
}

:deep(.ant-select-arrow .anticon) {
    display: none !important;
}

:deep(.ant-select-arrow) {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    /* right: 4px !important; */
    z-index: 2 !important;
}

:deep(.ant-select-suffix) {
    color: #6C87FF !important;
    display: flex !important;
}

:deep(.ant-select-tree-node-content-wrapper) {
    color: #0025CC !important;
    font-size: 14px !important;
    font-weight: 500 !important;
}

:deep(.ant-select-dropdown) {
    border-radius: 2px !important;
}

:deep(.ant-select-tree-treenode) {
    padding: 2px 0 !important;
}

/* .org-select:hover, .sys-select:hover,
.org-select :deep(.ant-select-focused), .sys-select :deep(.ant-select-focused) {
    background-color: #d6dfff !important;
} */

/* .org-select :deep(.ant-select-selector):hover,
.sys-select :deep(.ant-select-selector):hover {
    background-color: transparent !important;
} */
</style>
