<template>
    <div style="border-bottom: 8px solid #f2f2f2;" class=" bg-white py-2 px-6">
        <Input class="mr-2 base-input" v-model:value="filters.name" placeholder="搜索姓名" />
    </div>

    <div class="py-4 px-6">
        <a-table class="base-table-select" :pagination="false" :ellipsis="true"
                 :loading="{ indicator, spinning: loading }" :columns="columns" :scroll="{ y: 'calc(100vh - 295px)' }"
                 :data-source="listData">
            <template #emptyText>
                <Empty />
            </template>
            <template #bodyCell="{ column, text, record }">
                <template v-if="column.dataIndex === 'name'">
                    <div class="flex items-center gap-1">
                        <User :users="[text]" />
                    </div>
                </template>

                <template v-else-if="column.dataIndex === 'organize'">
                    <div class="flex items-center gap-1">
                        <a-tooltip arrowPointAtCenter>
                            <template #title> {{ record.organize[0] }} </template>
                            <Tag class="ellipsis" :text="record.organize[0]"
                                 :cssClass="{ background: '#F2F2F2', fontSize: '12px', padding: '0 6px', height: '24px', color: '#3C3C3C' }" />

                        </a-tooltip>

                        <a-popover v-if="record.organize.length > 1" :overlayStyle="{ zIndex: 500 }" placement="top">
                            <template #content>
                                <div class="max-h-[150px] overflow-auto">
                                    <div class="mb-2" v-for="item in record.organize?.slice(1)" :key="item">
                                        <a-tag class="bg-f2 border-none text-3c py-[2px] font-medium">
                                            {{ item }}
                                        </a-tag>
                                    </div>
                                </div>
                            </template>

                            <Tag :text="`+${record.organize.length - 1}`"
                                 :cssClass="{ background: '#F2F2F2', fontSize: '12px', height: '24px', padding: '0 6px', color: '#3C3C3C' }" />
                        </a-popover>
                    </div>
                </template>

                <template v-else-if="column.dataIndex === 'operate'">
                    <div class="flex gap-4 items-center">
                        <div @click="handleRestore(record)" class="text-primary cursor-pointer">
                            恢复成员
                        </div>
                        <div @click="handleDelete(record)" class="text-red-500 cursor-pointer">
                            删除
                        </div>
                    </div>
                </template>

                <template v-else-if="column.dataIndex === 'leaved_at'">
                    {{ formatDate(record.leaved_at) }}
                </template>

                <template v-else>
                    <a-tooltip arrowPointAtCenter>
                        <template #title>{{ text }}</template>
                        <span class="ellipsis">{{ text || '-' }}</span>
                    </a-tooltip>
                </template>

            </template>
        </a-table>

        <a-pagination v-if="listData?.length" class="pagination flex justify-end items-center mt-6" :show-size-changer="false"
                      :show-total="total => `共 ${total.toLocaleString()} 条`" :total="pageConfig.total" @change="changePageHandle"
                      v-model:current="pageConfig.current" v-model:pageSize="filters.limit" />
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { indicator, formatDate } from 'utils';
import { getLeavedUserListApi, restoreUserApi, delUserApi } from '@/api/org';
import { usePageList } from '@/hooks/index';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';

const filters = reactive({
    limit: 15,
    name: undefined,
});

const {
    changePageHandle,
    listData,
    pageConfig,
    loading,
    getData,
} = usePageList(getLeavedUserListApi, filters);

const { showDeleteConfirm } = useDeleteConfirm();

const columns = ref([
    {
        title: '姓名',
        dataIndex: 'name',
        width: '140px',
    },
    {
        title: '用户名',
        dataIndex: 'username',
        width: '140px',
    },
    {
        title: '邮箱',
        dataIndex: 'email',
        width: '140px',
    },
    {
        title: '离职前所属组织',
        dataIndex: 'organize',
        width: '580px',
    },
    {
        title: '离职日期',
        dataIndex: 'leaved_at',
        width: '200px',
    },
    {
        title: '操作',
        dataIndex: 'operate',
        width: '120px',
        fixed: 'right',
    },
]);

// 恢复成员
const handleRestore = (record) => {
    showDeleteConfirm({
        record: { id: record.id },
        onDelete: restoreUserApi,
        onSuccess: getData,
        title: '确定恢复该成员吗？',
        content: '恢复后，该成员账号将重新可登录',
    });
};

// 删除离职成员
const handleDelete = (record) => {
    showDeleteConfirm({
        record: { id: record.id },
        onDelete: delUserApi,
        onSuccess: getData,
        title: '确定删除该账号吗？',
        content: '账号删除后将不可恢复，请谨慎操作！',
    });
};
</script>
