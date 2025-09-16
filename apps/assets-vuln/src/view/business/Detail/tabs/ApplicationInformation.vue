<template>
    <!-- 详细信息 -->
    <div class="flex flex-col gap-[16px] bg-white ">

        <!-- 载体信息 -->
        <div class="carrier_information flex flex-col gap-[8px]">
            <div class="title_with_line">
                <div class="line"></div>
                <span class="content">载体信息</span>
            </div>

            <div class="info_list">

                <div class="info_item" v-for="item in carrier_information_title" :key="item.label">
                    <span class="label">{{ item.label }}</span>
                    <span class="value">
                        <a-tooltip arrowPointAtCenter>
                            <template #title>{{ basic_information?.carrier ? (basic_information.carrier[item.value] || '-') : '-' }}</template>
                            {{ basic_information?.carrier ? (basic_information.carrier[item.value] || '-') : '-'}}
                        </a-tooltip>
                    </span>
                </div>

            </div>
        </div>

        <!-- 成分信息 -->
        <div class="component_information flex flex-col gap-[8px]">
            <div class="title_with_line">
                <div class="line"></div>
                <span class="content">成分信息</span>
            </div>

            <div class="info_list">

                <div class="info_item" v-for="item in ingredient_information_title" :key="item.label">
                    <span class="label">{{ item.label }}</span>
                    <span class="value">
                        <a-tooltip arrowPointAtCenter>
                            <template #title>{{ ingredient_list[0] ? (ingredient_list[0][item.value] || '-') : '-' }}</template>
                            {{ ingredient_list[0] ? (ingredient_list[0][item.value] || '-') : '-' }}
                        </a-tooltip>
                    </span>
                </div>

            </div>
        </div>

        <!-- 应用信息 -->
        <div class="application_information flex flex-col gap-[8px]">
            <div class="title_with_line">
                <div class="line"></div>
                <span class="content">应用信息</span>
            </div>

            <a-table class="base-table" :pagination="false"  :columns="columns" :scroll="{ x: '100%' }" :data-source="application_information" >
                <template #emptyText>
                    <Empty />
                </template>
                <template #bodyCell="{ column, text }">
                    <template v-if="column.dataIndex === 'application_name'">
                        <span class="ellipsis hover" @click="openApplication(text)">{{ text || '-' }}</span>
                    </template>
                    <template v-else>
                        {{ text || '-' }}
                    </template>
                </template>
            </a-table>
        </div>

    </div>

</template>

<script setup>
import { ref } from 'vue';

const { basic_information, ingredient_list, application_information } = defineProps(['basic_information', 'ingredient_list', 'application_information']);

console.log(basic_information, ingredient_list, application_information);

const ingredient_information_title = [
    { label: '成分类型', value: 'component_type' },
    { label: '成分名称', value: 'component_name' },
    { label: '成分版本', value: 'component_version' },
    { label: '依赖类型', value: 'dependency_type' },
];

const carrier_information_title = [
    { label: '应用载体类型', value: 'carrier_type' },
    { label: '仓库名称', value: 'repo_name' },
    { label: '仓库地址', value: 'repo_url' },
    { label: '版本控制类型', value: 'repo_type' },
    { label: '最近代码提交人', value: 'last_committer' },
];

const columns = ref([
    {
        title: '应用名称',
        dataIndex: 'application_name',
        width: 272,
        fixed: 'left',
    },
    {
        title: '所属系统',
        dataIndex: 'business_system_name',
        width: 178,
    },
    {
        title: '所属组织',
        dataIndex: 'organize_name',
        width: 178,
    },
]);

</script>

<style scoped>
.info_list{
    display: flex;
    flex-wrap: wrap;
    gap: 16px;

    .info_item {
        width: calc((100% - 48px)/4);
        min-height: 48px;
        display: flex;
        flex-direction: column;
        gap: 4px;

        .edit-svg{
            height: 24px;
            width: 24px;
            display: flex;
            padding: 4px;
            border-radius: 4px;

            &:hover{
                background-color: #e6e6e6;
            }

        }

        .label {
            font-size: 12px;
            color: #999999;
            font-weight: 400;
            line-height: 20px;
            display: flex;
            gap: 4px;
        }

        .value {
            font-size: 14px;
            color: #3C3C3C;
            font-weight: 400;
            line-height: 22px;
            padding: 1px 0px;
            gap: 10px;
            /* white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis; */
        }
    }
}
</style>
