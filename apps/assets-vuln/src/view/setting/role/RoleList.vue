<template>
    <div class="h-full text-3c">
        <div>
            <div class="font-medium text-[16px] mb-6">
                <div class="flex">
                    {{ curRoleData.role_name }}
                    <span class="ml-[11px] text-99 text-sm flex items-center"><Svg name="role" class="mr-1" style="width: 16px; height: 16px;"></Svg>{{ memberNum }}</span>
                </div>

                <div class="text-sm font-normal text-99 mt-1" v-if="curRoleData.description">
                    {{ curRoleData.description }}
                </div>
            </div>

            <div class="mb-5 flex justify-between">
                <div class="flex items-center gap-2">
                    <Input v-model:value="filters.name" placeholder="搜索姓名" class="w-[240px] base-input" />
                </div>

                <a-button v-if="curRoleData.role_type!=='built-in'" @click="openMemberDrawer=true;" type="primary">
                    <PlusCircleOutlined /> 新增成员
                </a-button>
            </div>
        </div>

        <a-table class="base-table-select"  :pagination="false" :ellipsis="true"
                 :loading="{ indicator, spinning: loading }" :columns="columns" :scroll="{ y: 'calc(100vh - 340px)' }"
                 :data-source="listData">
            <template #emptyText>
                <Empty />
            </template>
            <template #bodyCell="{ column, text, record }">
                <template v-if="column.dataIndex === 'nickname'">
                    <div class="flex items-center gap-1">
                        <User :users="[text]" />
                    </div>
                </template>

                <template v-else-if="column.dataIndex === 'organizes'">
                    <div v-if="record.organizes?.length" class="flex items-center gap-1">
                        <a-tooltip arrowPointAtCenter>
                            <template #title>
                                {{ record.organizes?.[0]?.organize_name }}
                            </template>
                            <Tag class="ellipsis" :text="record.organizes?.[0]?.organize_name"
                                 :cssClass="{ background: '#F2F2F2', fontSize: '12px', padding: '0 6px', height: '24px', color: '#3C3C3C' }" />

                        </a-tooltip>

                        <a-popover v-if="record.organizes?.length > 1" :overlayStyle="{ zIndex: 500 }" placement="top">
                            <template #content>
                                <div class="px-1 max-h-[150px] overflow-auto grid grid-flow-row-dense grid-cols-auto gap-2">
                                    <div v-for="item in record.organizes?.slice(1)" :key="item">
                                        <a-tag class="bg-f2 border-none text-3c py-[2px] font-medium ">
                                            {{ item.organize_name }}
                                        </a-tag>
                                    </div>
                                </div>
                            </template>

                            <Tag :text="`+${record.organizes?.length-1}`"
                                 :cssClass="{ background: '#F2F2F2', fontSize: '12px', height: '24px', padding: '0 6px', color: '#3C3C3C' }" />
                        </a-popover>
                    </div>
                    <div v-if="!record.organizes?.length">-</div>
                </template>

                <template v-else-if="column.dataIndex === 'operate'">
                    <div class="flex gap-4 items-center" v-if="curRoleData.role_type!=='built-in'">
                        <div @click="handleRemove(record)" class="text-error cursor-pointer">
                            移除
                        </div>
                    </div>
                    <a-tooltip v-else placement="topRight">
                        <template #title>
                            <span>内置角色不可移除成员</span>
                        </template>
                        <span class="text-99 cursor-not-allowed">
                            移除
                        </span>
                    </a-tooltip>
                </template>

                <template v-else>
                    <a-tooltip arrowPointAtCenter>
                        <template #title>{{ text }}</template>
                        <span class="ellipsis">{{ text || '-' }}</span>
                    </a-tooltip>
                </template>

            </template>
        </a-table>

        <a-pagination  class="pagination flex justify-end items-center mt-6" :show-size-changer="false"
                       :show-total="total => `共 ${total.toLocaleString()} 条`" :total="pageConfig.total" @change="changePageHandle"
                       v-model:current="pageConfig.current" v-model:pageSize="filters.limit" />

        <!-- <div v-if="!listData?.length" class="flex mt-6 h-full items-center justify-center">
            <a-empty :image="simpleImage">
                <template #description>
                    <div class="font-medium text-3c">
                        暂无成员
                    </div>
                </template>
                <a-button @click="openMemberDrawer=true" type="primary">
                    新增成员
                </a-button>
            </a-empty>
        </div> -->

        <MemberDrawer :roleId="props.curRoleData?.role_id" @save="getData" v-model:open="openMemberDrawer" v-if="openMemberDrawer" />
    </div>
</template>

<script setup>
import {
    ref, reactive, watch,
} from 'vue';
import { PlusCircleOutlined } from '@ant-design/icons-vue';
import { indicator } from 'utils';
import { getRoleUserListApi, deleteRoleUserApi, getRoleUserCountApi } from '@/api/user';
import { usePageList } from '@/hooks';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';
import MemberDrawer from './MemberDrawer.vue';

const props = defineProps({
    curRoleData: {
        type: Object,
        default: () => ({}),
    },
});
const { showDeleteConfirm } = useDeleteConfirm();
const openMemberDrawer = ref(false);
const memberNum = ref(0);

const filters = reactive({
    limit: 15,
    name: undefined,
    role_id: props.curRoleData.role_id,
});

const getRoleUserCount = async (id) => {
    try {
        const { data } = await getRoleUserCountApi({
            role_id: id,
        });
        memberNum.value = data.data;
    } catch (error) {
        console.error('获取角色成员数量失败:', error);
    }
};
getRoleUserCount(props.curRoleData.role_id);

watch(() => props.curRoleData, (newVal) => {
    filters.role_id = newVal.role_id;
    getRoleUserCount(newVal.role_id);
    filters.name = undefined;
});

const {
    changePageHandle,
    listData,
    pageConfig,
    loading,
    getData,
} = usePageList(getRoleUserListApi, filters);

const columns = ref([
    {
        title: '姓名',
        dataIndex: 'nickname',
        width: '236px',
        // fixed: 'left',
    },
    {
        title: '用户名',
        dataIndex: 'username',
        width: '140px',
    },
    {
        title: '邮箱',
        dataIndex: 'email',
        width: '180px',
    },
    {
        title: '所属组织',
        dataIndex: 'organizes',
        // width: '410px',
    },
    {
        title: '操作',
        dataIndex: 'operate',
        width: '50px',
        // fixed: 'right',
    },
]);

// 重置密码
const handleRemove = (record) => {
    showDeleteConfirm({
        record: {
            role_id: props.curRoleData.role_id,
            account_id: [record.account_id],
        },
        onDelete: deleteRoleUserApi,
        onSuccess: getData,
        title: '确定移除该成员吗？',
        content: '移除后，该成员将不再拥有该角色权限',
    });
};
</script>
