<template>
    <div class="h-full text-3c">
        <div>
            <div class="font-medium text-[16px] mb-6">
                {{ orgCurData?.organize_name }} <span class="ml-[11px] text-99 text-sm">总人数 {{orgUserCount}}</span>
            </div>

            <div class="mb-5 flex justify-between">
                <div class="flex items-center gap-2">
                    <Input v-model:value="filters.keyword" placeholder="搜索姓名/用户名/邮箱" class="w-[240px] base-input" />

                    <Select :popupClassName="'base-select-dropdown'" class="base-select min-w-32"
                            v-model:value="filters.member_scope" :options="DISPLAY_TYPE_OPTIONS" placeholder="展示成员" />

                    <div class="relative">
                        <span class="padtitle">来源</span>
                        <Select :popupClassName="'base-select-dropdown'" class="base-select add-padding-2 w-26"
                                v-model:value="filters.source" :options="USER_SOURCE_OPTIONS" placeholder="来源"
                        />
                    </div>

                    <div class="relative">
                        <span class="padtitle">账号状态</span>
                        <Select :popupClassName="'base-select-dropdown'" class="base-select add-padding-4 w-34"
                                v-model:value="filters.status" :options="USER_STATUS_OPTIONS" placeholder="状态" />
                    </div>

                    <a-button class="base-button ml-2" @click="resetFilter">重置</a-button>
                </div>

                <a-button @click="openMemberDrawer=true" type="primary">
                    <PlusCircleOutlined /> 新增成员
                </a-button>
            </div>
        </div>

        <a-table class="base-table-select" :pagination="false" :ellipsis="true"
                 :loading="{ indicator, spinning: loading }" :columns="columns" :scroll="{ y: 'calc(100vh - 356px)' }"
                 :data-source="listData">
            <template #emptyText>
                <Empty />
            </template>
            <template #bodyCell="{ column, text, record }">
                <template v-if="column.dataIndex === 'name'">
                    <div class="flex items-center gap-1">
                        <User :users="[text]" />
                        <Tag v-if="record.status === 'close'" text="已禁用"
                             :cssClass="{ background: '#BF1C0D', color: '#fff' }" />
                        <Tag text="当前组织负责人" v-if="record.is_manage" :cssClass="{ background: '#E6E6E6', color: '#3C3C3C' }" />
                    </div>
                </template>

                <template v-else-if="column.dataIndex === 'organize'">
                    <div class="flex items-center gap-1">
                        <a-tooltip arrowPointAtCenter>
                            <template #title> {{ record.organize[0]?.organize_name }} </template>
                            <Tag class="ellipsis" :text="record.organize[0]?.organize_name"
                                 :cssClass="{ background: '#F2F2F2', fontSize: '12px', padding: '0 6px', height: '24px', color: '#3C3C3C' }" />
                        </a-tooltip>

                        <a-popover v-if="record.organize.length > 1" :overlayStyle="{ zIndex: 500 }" placement="top">
                            <template #content>
                                <div class="px-1 max-h-[150px] overflow-auto grid grid-flow-row-dense grid-cols-auto gap-2">
                                    <div v-for="item in record.organize?.slice(1)" :key="item">
                                        <a-tag class="bg-f2 border-none text-3c py-[2px] font-medium">
                                            {{ item.organize_name }}
                                        </a-tag>
                                    </div>
                                </div>
                            </template>

                            <Tag :text="`+${record.organize.length - 1}`"
                                 :cssClass="{ background: '#F2F2F2', fontSize: '12px', height: '24px', padding: '0 6px', color: '#3C3C3C' }" />
                        </a-popover>
                    </div>
                </template>

                <template v-else-if="column.dataIndex === 'source'">
                    {{ record.source === 'ldap-ad' ? 'LDAP' : '手动添加' }}
                </template>

                <template v-else-if="column.dataIndex === 'roles'">
                    <div class="flex items-center gap-1">
                        <div v-if="record.roles.length" class="flex">

                            <a-tooltip arrowPointAtCenter>
                                <template #title> {{ record.roles[0] }} </template>
                                <Tag class="ellipsis" :text="record.roles[0]"
                                     :cssClass="{ background: '#F2F2F2', fontSize: '12px', padding: '0 6px', height: '24px', color: '#3C3C3C' }" />
                            </a-tooltip>

                            <a-popover v-if="record.roles.length > 1" :overlayStyle="{ zIndex: 500 }" placement="top">
                                <template #content>
                                    <div class="px-1 max-h-[150px] overflow-auto grid grid-flow-row-dense grid-cols-auto gap-2">
                                        <div v-for="item in record.roles?.slice(1)" :key="item">
                                            <a-tag :text="item" class="bg-f2 border-none text-3c py-[2px] font-medium">
                                                {{ item }}
                                            </a-tag>
                                        </div>
                                    </div>
                                </template>

                                <Tag :text="`+${record.roles.length-1}`" class="ml-1"
                                     :cssClass="{ background: '#F2F2F2', fontSize: '12px', height: '24px', padding: '0 6px', color: '#3C3C3C' }" />
                            </a-popover>
                        </div>
                        <div v-else>-</div>
                    </div>
                </template>

                <template v-else-if="column.dataIndex === 'operate'">
                    <div class="flex gap-4 items-center">
                        <div @click="record.source !== 'ldap-ad' && handleEdit(record)" :class="record.source === 'ldap-ad' ? 'cursor-not-allowed text-99' : 'text-primary cursor-pointer'">
                            编辑
                        </div>

                        <a-popover :overlayStyle="{ zIndex: 500 }"
                                   :overlayInnerStyle="{ padding: '6px 0px', width: '142px' }" placement="bottomLeft"
                                   :arrow="false">
                            <template #content>
                                <div class="cursor-pointer">
                                    <div @click="record.source !== 'ldap-ad' && handleReset(record)" :class="['table-operation-item px-6 py-2', { 'text-99 cursor-not-allowed': record.source === 'ldap-ad' }]">
                                        <span>重置密码</span>
                                    </div>
                                    <div @click="handleToggleStatus(record)" class="table-operation-item px-6 py-2 ">
                                        <span>{{ record.status === 'close' ? '启用账号' : '禁用账号' }}</span>
                                    </div>
                                    <div @click="handleResignation(record)" class="table-operation-item px-6 py-2 ">
                                        <span>操作离职</span>
                                    </div>
                                </div>
                            </template>
                            <span class="icon-hover hover:bg-[#E5EAFF] cursor-pointer">
                                <EllipsisOutlined class="text-primary text-base" />
                            </span>
                        </a-popover>
                    </div>
                </template>

                <template v-else>
                    <a-tooltip arrowPointAtCenter>
                        <template #title>{{ text }}</template>
                        <span class="ellipsis">{{ text || '-' }}</span>
                    </a-tooltip>
                </template>

            </template>
        </a-table>

        <a-pagination class="pagination flex justify-end items-center mt-6" :show-size-changer="false"
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

        <MemberDrawer v-model:open="openMemberDrawer" @updateData="getData" v-if="openMemberDrawer" :memberDrawerData="memberDrawerData" />
    </div>
</template>

<script setup>
import {
    ref, reactive, h, watch,
} from 'vue';
import { PlusCircleOutlined, EllipsisOutlined } from '@ant-design/icons-vue';
import { indicator, emitter } from 'utils';
import {
    getOrgUserCountApi, getOrgMemberListApi, resetPasswordApi, userStatusApi,
} from 'api/org';
import { message } from 'ant-design-vue';
import { usePageList } from '@/hooks';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';
import MemberDrawer from './MemberDrawer.vue';
import { USER_SOURCE_OPTIONS, USER_STATUS_OPTIONS, DISPLAY_TYPE_OPTIONS } from '../constants';

const props = defineProps({
    orgCurData: {
        type: Object,
        default: () => ({}),
    },
});

// const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
const { showDeleteConfirm } = useDeleteConfirm();
const openMemberDrawer = ref(false);
const memberDrawerData = ref({});
const orgUserCount = ref(0);

const handleEdit = (record) => {
    record.organize_ids = record.organize?.map((item) => ({
        label: item.organize_name,
        value: item.organize_id,
    }));
    memberDrawerData.value = record;
    openMemberDrawer.value = true;
};

// 获取组织人数
const getOrgUserCount = async (id) => {
    try {
        const { data } = await getOrgUserCountApi({
            organize_id: id,
        });
        orgUserCount.value = data.data;
    } catch (error) {
        console.log(error);
    }
};
getOrgUserCount(props.orgCurData?.organize_id);

// 监听清空
watch(openMemberDrawer, (newVal) => {
    if (!newVal) {
        memberDrawerData.value = {};
    }
});

const filters = reactive({
    limit: 15,
    keyword: undefined,
    member_scope: '',
    source: '',
    status: '',
    organize_id: props.orgCurData?.organize_id,
});

const {
    changePageHandle,
    listData,
    pageConfig,
    loading,
    getData,
} = usePageList(getOrgMemberListApi, filters);

emitter.on('updateMember', () => {
    getData();
});

const columns = ref([
    {
        title: '姓名',
        dataIndex: 'name',
        width: '280px',
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
        dataIndex: 'organize',
        width: '240px',
    },
    {
        title: '角色',
        dataIndex: 'roles',
        width: '200px',
    },
    {
        title: '来源',
        dataIndex: 'source',
        width: '100px',
    },

    {
        title: '操作',
        dataIndex: 'operate',
        width: '110px',
        fixed: 'right',
    },
]);

// 数节点监听
watch(() => props.orgCurData, (newVal) => {
    getOrgUserCount(newVal.organize_id);
    Object.assign(filters, {
        member_scope: '',
        source: '',
        status: '',
        keyword: undefined,
    });
    filters.organize_id = newVal.organize_id;
});

// 重置密码
const handleReset = (record) => {
    showDeleteConfirm({
        record: { id: record.organize_user_id },
        onDelete: resetPasswordApi,
        onSuccess: () => {
            message.success('重置密码成功');
            getData();
        },
        title: '确认重置密码吗？',
        content: h('div', null, [
            '重置后，密码将恢复为默认密码',
            h('div', {
                class: 'mt-2',
            }, [
                '默认密码：',
                record.email,
            ]),
        ]),
    });
};

// 启用/禁用账号
const handleToggleStatus = (record) => {
    const isDisabled = record.status === 'close';
    const action = isDisabled ? '启用' : '禁用';
    const title = `确认${action}账号吗？`;
    const content = isDisabled ? '启用后，该账号可重新登录' : '禁用后，该账号将不可登录';

    showDeleteConfirm({
        record: { id: record.organize_user_id, status: isDisabled ? 'open' : 'close' },
        onDelete: userStatusApi,
        onSuccess: getData,
        title,
        content,
    });
};

// 操作离职
const handleResignation = (record) => {
    showDeleteConfirm({
        record: { id: record.organize_user_id, status: 'exit' },
        onDelete: userStatusApi,
        onSuccess: getData,
        title: '确定要将此账号离职吗？',
        content: h('div', null, [
            '离职后，账号将无法登录平台',
            h('div', {
                class: 'mt-2',
            }, [
                '姓名：',
                record.name,
            ]),
        ]),
    });
};

// 重置筛选条件
const resetFilter = () => {
    Object.assign(filters, {
        keyword: undefined,
        member_scope: '',
        source: '',
        status: '',
    });
    // getData();
};

</script>

<style lang="less">
.add-padding-2 {
    .ant-select-selection-item {
        padding-left: 34px !important;
    }
}

.add-padding-4 {
    .ant-select-selection-item {
        padding-left: 62px !important;
    }
}

.padtitle{
    position: absolute;
    top: 5px;
    left: 12px;
    margin-right: 4px;
    z-index: 10;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    letter-spacing: 0px;
    color: #999999;
}
</style>
