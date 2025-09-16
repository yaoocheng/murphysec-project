<template>
    <div class="h-[calc(100%-56px)] overflow-auto p-6 bg-[#E5EAFF80] dashboard-container">
        <div class="text-xs text-99 mb-2">{{ formatDate(new Date(), 'YYYY-MM-DD HH:mm') }} 已更新</div>

        <div class="flex w-full gap-6 mb-6">
            <Risk :data="dashboardData" />
        </div>
        <div class="h-[440px] flex w-full gap-6 mb-6">
            <Chart v-model:timeValue="timeValue" />
        </div>

        <div class="h-[323px] flex w-full gap-6">
            <div class="p-6 box-border bg-[#fff] flex gap-6 w-[50%]">
                <Top :title="'风险控制标杆团队'" icon="smile" :tableData="teamBenchmarkData" />
                <Top :title="'需重点提升团队'" icon="fight" :tableData="teamFocusData" />
            </div>
            <div class="p-6 box-border bg-[#fff] flex gap-6 flex-1">
                <Top :title="'风险控制标杆业务系统'" icon="smile" :tableData="systemBenchmarkData" />
                <Top :title="'需重点提升业务系统'" icon="fight" :tableData="systemFocusData" />
            </div>
        </div>
    </div>
</template>

<script setup>
import {
    ref, onMounted, reactive, watch,
} from 'vue';
import Risk from './Risk.vue';
import Top from './Top.vue';
import Chart from './Chart.vue';
import { getDashboardListApi } from '@/api/panel';
import { userInfo } from '@/store';
import { formatDate } from '@/utils';

const timeValue = ref('30 days');

const filter = reactive({
    organize_id: userInfo.value.org_id,
    business_system_id: userInfo.value.business_system_id,
});

const dashboardData = ref([]);

const teamBenchmarkData = ref([
    {
        key: '1', name: '智能驾驶研发部', score: '119.7', action: '详情',
    },
    {
        key: '2', name: '智能网联研发部', score: '118.5', action: '详情',
    },
    {
        key: '3', name: '自动驾驶部门', score: '117.2', action: '详情',
    },
    {
        key: '4', name: '车载系统部', score: '116.8', action: '详情',
    },
    {
        key: '5', name: '智能座舱部', score: '115.9', action: '详情',
    },
]);

const teamFocusData = ref([
    {
        key: '1', name: '数据安全部', score: '89.5', action: '详情',
    },
    {
        key: '2', name: '网络安全部', score: '88.7', action: '详情',
    },
    {
        key: '3', name: '系统集成部', score: '87.9', action: '详情',
    },
    {
        key: '4', name: '云平台部', score: '86.4', action: '详情',
    },
    {
        key: '5', name: '基础设施部', score: '85.2', action: '详情',
    },
]);

const systemBenchmarkData = ref([
    {
        key: '1', name: '智能驾驶系统', score: '95.8', action: '详情',
    },
    {
        key: '2', name: '车联网平台', score: '94.6', action: '详情',
    },
    {
        key: '3', name: '安全管理系统', score: '93.7', action: '详情',
    },
    {
        key: '4', name: '数据分析平台', score: '92.5', action: '详情',
    },
    {
        key: '5', name: '监控预警系统', score: '91.8', action: '详情',
    },
]);

const systemFocusData = ref([
    {
        key: '1', name: '资产管理系统', score: '78.9', action: '详情',
    },
    {
        key: '2', name: '漏洞扫描系统', score: '77.5', action: '详情',
    },
    {
        key: '3', name: '日志分析系统', score: '76.8', action: '详情',
    },
    {
        key: '4', name: '备份恢复系统', score: '75.4', action: '详情',
    },
    {
        key: '5', name: '访问控制系统', score: '74.2', action: '详情',
    },
]);

const getDashboardData_list = async () => {
    const res = await getDashboardListApi(filter);
    dashboardData.value = res.data.data;
    teamBenchmarkData.value = dashboardData.value.a;
    teamFocusData.value = dashboardData.value.b;
    systemBenchmarkData.value = dashboardData.value.d;
    systemFocusData.value = dashboardData.value.c;
};

watch(userInfo.value, () => {
    filter.organize_id = userInfo.value.org_id;
    filter.business_system_id = userInfo.value.business_system_id;
    getDashboardData_list();
});

onMounted(() => {
    getDashboardData_list();
});
</script>
