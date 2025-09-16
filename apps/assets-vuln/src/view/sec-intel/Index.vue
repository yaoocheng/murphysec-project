<template>
    <div class="main-content overflow-auto">
        <div class="h-25 mb-2 py-[10px] px-[20px] flex items-center justify-between gap-[20px]">
            <!-- <Input v-model:value="filters.keyword" placeholder="搜索安全能力名称" /> -->
            <div class="information-continuer">
                <span class="title">情报概况</span>

                <div class="content">
                    <span>全量情报</span>
                    <span>1779</span>
                </div>

                <div class="content">
                    <span>无资产关联情报</span>
                    <span>1779</span>
                </div>

                <div class="content">
                    <span>与资产关联情报</span>
                    <span>0</span>
                </div>
            </div>

            <div class="information-continuer" >
                <span class="title">情报类型</span>

                <div class="content">
                    <span>公开漏洞</span>
                    <span>973</span>
                </div>

                <div class="content">
                    <span>墨菲安全独家</span>
                    <span>28</span>
                </div>

                <div class="content">
                    <span>投毒情报</span>
                    <span>778</span>
                </div>
            </div>

        </div>

        <div class="h-calc56 px-6">
            <div class="bg-white h-full px-[20px]">
                <div class="w-full">
                    <a-select ref="select" placeholder="情报级别" v-model:value="filters.security_capability_type" style="width: 82px" @change="handleChange" class="mr-4" >
                        <a-select-option v-for="item in options" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
                    </a-select>

                    <a-select ref="select" placeholder="情报类型" v-model:value="filters.security_capability_type" style="width: 82px" @change="handleChange" class="mr-4" >
                        <a-select-option v-for="item in options" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
                    </a-select>

                    <a-select ref="select" placeholder="情报状态" v-model:value="filters.security_capability_type" style="width: 82px" @change="handleChange" class="mr-4" >
                        <a-select-option v-for="item in options" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
                    </a-select>

                    <a-button class="base-button" type="primary">重置</a-button>
                </div>

                <a-table class="base-table" :pagination="false" :ellipsis="true" :loading="{ indicator, spinning: loading }" :columns="columns"
                         :scroll="{ x: '100%' }" :data-source="listData">
                    <template #emptyText>
                        <Empty />
                    </template>
                </a-table>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { getSecAbleListApi } from 'api/app';
import { indicator } from 'utils';
import { usePageList } from '@/hooks';

const filters = reactive({
    limit: 1000,
});

const {
    listData,
    loading,
} = usePageList(getSecAbleListApi, filters);

const columns = ref([
    {
        title: 'ID',
        dataIndex: 'security_capability_id',
        width: 178,
        flex: 'left',
    },
    {
        title: '安全能力名称',
        dataIndex: 'capability_name',
        width: 280,
    },
    {
        title: '安全能力类型',
        dataIndex: 'capability_type',
        width: 178,
    },
    {
        title: '安全能力的描述',
        dataIndex: 'capability_desc',
    },
]);
</script>

<style>
 .information-continuer{
    width: 50%;
    height: 80px;
    background-color: white;
    display: flex;
    gap: 50px;
    padding: 0px 20px;
    align-items: center;

    .title{
        width: 60px;
        height: 60px;
        padding:10px 14px;
        border: 1px blue solid;
        border-radius: 5px;
        color: blue;
    }

    .content{
        display: flex;
        flex-direction: column;
    }
 }
</style>
