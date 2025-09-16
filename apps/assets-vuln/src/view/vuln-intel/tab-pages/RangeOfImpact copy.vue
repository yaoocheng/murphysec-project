<template>
    <main class="flex flex-col gap-[24px]">
        <div class="flex gap-3">
            <a-button :class="['button', { active: upstream },'base-button']"  @click="upstream = !upstream">上游受影响组件</a-button>
            <a-button :class="['button', { active: !upstream },'base-button']" @click="upstream = !upstream">下游受影响组件</a-button>
        </div>

        <a-table class="base-table" :pagination="false" :columns="columns" :scroll="{ x: '100%' }" :data-source='upstream ? UpstreamComponents : DownstreamComponents'
                 :row-key="(record) => record.name + record.repository || new Date().getTime()">
            <template #emptyText>
                <Empty />
            </template>
            <template #expandedRowRender="{ record }">
                <div class="flex gap-[8px] px-[16px] py-[12px] rounded expand-line">
                    <div class="item">
                        <span class="title">仓库类型</span>
                        <span class="value">{{ record.repository }}</span>
                    </div>

                    <div class="item">
                        <span class="title">受影响版本</span>
                        <!-- <span class="value" v-html="`>= ${record.affected.expression.left_border}, < ${record.affected.expression.right_border}`"></span> -->
                        <span class="value">{{ record.affected.expression.version_range }}</span>
                    </div>

                    <div class="item">
                        <span class="title">最小修复版本</span>
                        <span class="value">{{ record.affected.expression.fix_version || '暂无' }}</span>
                    </div>
                </div>
            </template>
        </a-table>
    </main>
</template>

<script setup>
import { ref } from 'vue';

const columns = [
    {
        title: '组件名称',
        dataIndex: 'name',
    },
    {
        title: '生态类型',
        dataIndex: 'repository',
    },
];

const upstream = ref(true);

const InformationDetails = JSON.parse(sessionStorage.getItem('information_details'));

const UpstreamComponents = InformationDetails?.affected_version.filter((item) => item.upstream);
const DownstreamComponents = InformationDetails?.affected_version.filter((item) => !item.upstream);
</script>

<style scoped>

.button{
    background-color: #F2F2F2;
    border: none;
    color: #1F2329;
}

.active{
    background-color:#E5EAFF;
    color: #6C87FF;
}

.item{
    display: flex;
    gap: 4px;
    align-items: center;
    justify-content: center;

    .title{
        font-size: 12px;
        color: #8F959E;
        font-weight: 400;
    }

    .value{
        font-size: 16px;
        color: #2A2B32;
        font-weight: 500;
    }
}
</style>
