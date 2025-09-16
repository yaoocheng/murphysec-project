<template>
    <a-modal title="操作日志" width="800px" :footer=false>
        <div class="py-6">
            <a-table :columns="columns" :data-source="data" :pagination="false" rowKey="id"
                     v-model:expandedRowKeys="expandedRowKeys">
                <template #expandedRowRender="{ record }">
                    <div>
                        {{ record.description }}
                    </div>
                </template>
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'name'">
                        <div class="flex items-center">
                            <a-avatar size="small" :src="record.avatar" class="mr-2">
                                {{ record.name === '系统' ? '系' : '' }}
                            </a-avatar>
                            {{ record.name }}
                        </div>
                    </template>

                    <template v-else-if="column.key === 'content'">
                        <a-tooltip :title="record.fullContent">
                            {{ record.content }}
                        </a-tooltip>
                    </template>

                    <template v-else-if="column.key === 'info'">
                        <a-tooltip placement="left" title="操作说明">
                            <InfoCircleOutlined style="cursor: pointer; color: #999;"
                                                @click="toggleExpand(record.id)" />
                        </a-tooltip>
                    </template>
                </template>
            </a-table>
        </div>

    </a-modal>
</template>

<script setup>
import { ref } from 'vue';
import { InfoCircleOutlined } from '@ant-design/icons-vue';

const expandedRowKeys = ref([]); // 展开行的 key 集合，用于 a-table 的 v-model
const toggleExpand = (id) => {
    const index = expandedRowKeys.value.indexOf(id);
    if (index > -1) {
        // 已展开 -> 折叠
        expandedRowKeys.value.splice(index, 1);
    } else {
        // 未展开 -> 展开
        expandedRowKeys.value.push(id);
    }
};
const columns = [
    {
        title: '操作时间',
        dataIndex: 'time',
        key: 'time',
    },
    {
        title: '操作人',
        key: 'name',
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
    },
    {
        title: '操作内容',
        key: 'content',
    },
    {
        title: '',
        key: 'info',
        width: 40,
    },
];

const data = [
    {
        id: 1,
        time: '2023–03–19 09:01:39',
        name: '王嘻嘻',
        avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
        action: '新增组织',
        content: '研发一部',
        fullContent: '研发一部',
        description: '操作说明：新增了一个研发一部的组织。',
    },
    {
        id: 2,
        time: '2023–03–19 09:01:39',
        name: '王嘻嘻',
        avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
        action: '变更组织名称',
        content: '国泰 → 国泰证券有限公司',
        fullContent: '国泰 → 国泰证券有限公司',
        description: '操作说明：组织名称从国泰修改为国泰证券有限公司。',
    },
    {
        id: 3,
        time: '2023–03–19 09:01:39',
        name: '系统',
        avatar: '', // 系统无头像
        action: '变更状态',
        content: '待完善 → 已发布',
        fullContent: '待完善 → 已发布',
        description: '操作说明：系统自动将状态从“待完善”修改为“已发布”。',
    },
];

// const pagination = {
//     pageSize: 5,
//     total: 24,
//     showSizeChanger: false,
// };
</script>

<style scoped>
/* AntD + Tailwind 搭配时字体和头像可以稍微微调 */
</style>
