<template>
    <a-tabs class="fingerprint-info" v-model:activeKey="activeKey">

        <a-tab-pane v-if="fingerprint.package_name?.length > 0" key="1" tab="官方软件包">
            <div class="max-h-80 overflow-auto">
                <a-table class="gray-table" :pagination="false" :columns="package_name_columns" :data-source="fingerprint.package_name">
                    <template #emptyText>
                        <Empty />
                    </template>
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.dataIndex === 'name'">
                            <span>
                                {{ record }}
                            </span>
                        </template>
                    </template>
                </a-table>
            </div>
        </a-tab-pane>
        <a-tab-pane v-if="fingerprint.network_service_fingerprint?.length > 0" key="2" tab="网络服务指纹" force-render>Content of Tab Pane 2</a-tab-pane>
        <a-tab-pane v-if="fingerprint.process?.length > 0" key="3" tab="进程特征">
            <div class="max-h-80 overflow-auto">
                <a-table class="gray-table" :pagination="false" :columns="process_columns" :data-source="fingerprint.process">
                    <template #emptyText>
                        <Empty />
                    </template>
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.dataIndex === 'name'">
                            <span>
                                {{ record }}
                            </span>
                        </template>
                    </template>
                </a-table>
            </div>
        </a-tab-pane>
        <a-tab-pane v-if="fingerprint.installer?.length > 0" key="4" tab="软件安装包特征">
            <div class="flex gap-6 flex-col">
                <div v-for="(items, platform) in fingerprint.installer" :key="platform" class="flex gap-3 flex-col">
                    <span>{{ platform }}: </span>
                    <a-table class="gray-table" :pagination="false" :columns="installer_columns" :data-source="items">
                        <template #emptyText>
                            <Empty />
                        </template>
                        <template #bodyCell="{ column, record }">
                            <template v-if="column.dataIndex === 'name'">
                                <span>
                                    {{ record }}
                                </span>
                            </template>
                        </template>
                    </a-table>
                </div>
            </div>

        </a-tab-pane>
        <a-tab-pane v-if="fingerprint.filehash.length > 0" key="5" tab="文件哈希">
            <div class="max-h-80 overflow-auto">
                <a-table class="gray-table" :pagination="false" :columns="filehash_columns" :data-source="filehash_list">
                    <template #emptyText>
                        <Empty />
                    </template>
                </a-table>
            </div>
        </a-tab-pane>
        <a-tab-pane v-if="fingerprint.file_content.length > 0" key="6" tab="文件内容特征">
            <div class="flex gap-6 flex-col">
                <div v-for="(items, platform) in fingerprint.file_content" :key="platform" class="flex gap-3 flex-col">
                    <span>{{ platform === 'contain_re_list' ? '内容识别正则' : '版本号识别正则' }}: </span>
                    <a-table class="gray-table" :pagination="false" :columns="file_content_columns" :data-source="items">
                        <template #emptyText>
                            <Empty />
                        </template>
                        <template #bodyCell="{ column, record }">
                            <template v-if="column.dataIndex === 'name'">
                                <span>
                                    {{ record }}
                                </span>
                            </template>
                        </template>
                    </a-table>
                </div>
            </div>
        </a-tab-pane>
    </a-tabs>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const activeKey = ref('1');

const { fingerprint } = defineProps(['fingerprint']);

// 添加监听函数来自动设置activeKey
const setInitialActiveKey = () => {
    const tabsOrder = [
        { key: '1', condition: fingerprint.package_name?.length > 0 },
        { key: '2', condition: fingerprint.network_service_fingerprint?.length > 0 },
        { key: '3', condition: fingerprint.process?.length > 0 },
        { key: '4', condition: fingerprint.installer?.length > 0 },
        { key: '5', condition: fingerprint.filehash?.length > 0 },
        { key: '6', condition: fingerprint.file_content?.length > 0 },
    ];

    const firstAvailableTab = tabsOrder.find((tab) => tab.condition);
    if (firstAvailableTab) {
        activeKey.value = firstAvailableTab.key;
    }
};

const filehash_list = Object.entries(fingerprint.filehash).map(([hash_type, hash]) => Object.entries(hash).map(([file, hash_value]) => ({
    name: file,
    hash_type,
    hash: hash_value,
}))).flat();

const package_name_columns = [
    {
        title: '名称',
        dataIndex: 'name',
    },
];

const process_columns = [
    {
        title: '名称',
        dataIndex: 'name',
    },

];

const installer_columns = [
    {
        title: '名称',
        dataIndex: 'name',
    },

];

const filehash_columns = [
    {
        title: '名称',
        dataIndex: 'name',
        width: 'flex-1',
    },
    {
        title: '哈希类型',
        dataIndex: 'hash_type',
    },
    {
        title: '哈希值',
        dataIndex: 'hash',
        width: 600,
    },
];

const file_content_columns = [
    {
        title: '名称',
        dataIndex: 'name',
    },
];

// 在组件挂载时设置初始activeKey
onMounted(() => {
    setInitialActiveKey();
});
</script>

<style>
/* 指纹信息 */
.fingerprint-info {
    .ant-tabs-nav {
        margin-bottom: 12px !important;
    }
    .ant-tabs-tab {
        padding: 0;
        margin-bottom: 8px !important;
        span {
            font-size: 12px;
        }

        .ant-tabs-tab-btn {
            font-size: 12px;
        }
    }
}

/* 灰头表格 */
.gray-table {
    .ant-table-thead {
        .ant-table-cell {
            background-color: #E6E6E6;
            color: #666666;
            font-size: 12px;
            font-weight: 500;
            line-height: 18px;
            letter-spacing: 0px;
            height: 32px;

            padding:  0 16px;
        }
    }

    .ant-table-tbody{
        .ant-table-cell {
            height: 36px !important;

            padding: 0 16px;
        }
    }
}
</style>
