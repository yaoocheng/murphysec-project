<template>
    <div class="px-6 py-4 h-[calc(100%-56px)] box-border" style="border-top: 8px solid #f2f2f2;">
        <div class="py-2 h-full bg-white flex gap-6">
            <div class="w-[314px] flex flex-col items-center h-full">
                <Input v-model:value="searchKeyword" @input="onSearch" placeholder="搜索角色名称"
                       class="w-full mb-4 base-input" />

                <div class="overflow-auto w-full max-h-[calc(100%-96px)]">
                    <div @click="activeKey = item.role_id;curRoleData=item" v-for="item in listData" :key="item.role_id" :class="activeKey === item.role_id ? 'bg-[#E5EAFF80] hover:bg-[#E5EAFF80] text-primary' : 'hover:bg-[#f2f2f2]'"
                         class="cursor-pointer rounded-3 py-[9px] px-2 flex justify-between items-center">
                        <div class="flex items-center flex-1 w-0">
                            <TextPopover :text="item.role_name">
                                <div class="truncate" >
                                    {{ item.role_name }}
                                </div>
                            </TextPopover>
                            <a-tag class="bg-[#E6E6E6] border-none h-[18px] leading-[18px] text-3c text-[10px] ml-1"
                                   v-if="item.role_type === 'built-in'">系统内置
                            </a-tag>
                        </div>

                        <a-popover :overlayInnerStyle="{ padding: '6px 0px', width: '120px' }" placement="bottomRight"
                                   :arrow="false">
                            <template #content>
                                <div class="cursor-pointer">
                                    <div @click="handleView(item)" class="table-operation-item px-6 py-2">
                                        <span>查看</span>
                                    </div>
                                    <div v-if="item.role_type !== 'built-in'" @click="handleEdit(item)" class="table-operation-item px-6 py-2">
                                        <span>编辑</span>
                                    </div>
                                    <div v-if="item.role_type !== 'built-in'" @click="handledelete(item.role_id)" class="table-operation-item text-error px-6 py-2">
                                        <span>删除</span>
                                    </div>
                                </div>

                            </template>
                            <span @click.stop :class="activeKey === item.role_id ? 'hover:bg-[#E5EAFF]' : 'hover:bg-[#E6E6E6]'"
                                  class="icon-hover w-6 h-6 leading-6 cursor-pointer">
                                <MoreOutlined :class="activeKey === item.role_id ? 'text-[#0025CC]' : ''"
                                              class="text-3c text-base" />
                            </span>
                        </a-popover>
                    </div>

                    <Empty v-if="!listData.length" />
                </div>

                <a-button v-if="!searchKeyword" @click="roleDataId=undefined;isCheck = false; openRoleDrawer = true" class="w-full mt-4">
                    <PlusCircleFilled /> 新增角色
                </a-button>
            </div>

            <a-divider type="vertical" class="h-full" />

            <div class="flex-1 w-0">
                <RoleList v-if="curRoleData.role_id" :curRoleData="curRoleData" />
            </div>
        </div>

        <RoleDrawer v-model:open="openRoleDrawer" @refresh="refreshCurrentRole" v-if="openRoleDrawer" :isCheck="isCheck" :roleDataId="roleDataId" />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { PlusCircleFilled } from '@ant-design/icons-vue';
import { getRoleListApi, deleteRoleApi } from 'api/user';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';
import RoleDrawer from './RoleDrawer.vue';
import RoleList from './RoleList.vue';
import { debounce } from '@/utils';

const { showDeleteConfirm } = useDeleteConfirm();
const searchKeyword = ref(''); // 搜索
const activeKey = ref('');
const openRoleDrawer = ref(false);
const curRoleData = ref({}); // 当前角色数据
const roleDataId = ref();
const isCheck = ref(false); // 查看
const listData = ref([]); // 列表数据

// 获取列表
const getList = async (val) => {
    try {
        const { data } = await getRoleListApi({ role_name: val });
        listData.value = data.data?.data_list;
        if (!searchKeyword.value) {
            [curRoleData.value] = listData.value;
            activeKey.value = curRoleData.value.role_id;
        }
    } catch (error) {
        console.log(error);
    }
};

const onSearch = debounce(() => {
    getList(searchKeyword.value);
}, 500);

getList();

const handleEdit = (item) => {
    roleDataId.value = item.role_id;
    openRoleDrawer.value = true;
    isCheck.value = false;
};

const handleView = (item) => {
    roleDataId.value = item.role_id;
    isCheck.value = true;
    openRoleDrawer.value = true;
};

// 删除
const handledelete = (id) => {
    showDeleteConfirm({
        record: id,
        onDelete: deleteRoleApi,
        onSuccess: getList,
        title: '确认删除此角色吗？',
        content: '数据删除后将不可恢复，请谨慎操作！',
    });
};

// 刷新当前角色数据，保持在当前角色
const refreshCurrentRole = async () => {
    if (roleDataId.value) {
        try {
            const { data } = await getRoleListApi();
            listData.value = data.data?.data_list;
            // 找到当前编辑的角色并保持选中
            const currentRole = listData.value.find((item) => item.role_id === roleDataId.value);
            if (currentRole) {
                curRoleData.value = currentRole;
                activeKey.value = currentRole.role_id;
            }
        } catch (error) {
            console.log(error);
        }
    } else {
        getList();
    }
};
</script>
