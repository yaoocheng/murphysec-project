<template>
    <CommonHead>
        <div class="common_bread">
            <img @click="$router.push('/knowledge')" class="shrink" src="~ast/img/back.png" alt="">
            <span>软件包详情</span>
        </div>
    </CommonHead>

    <div style="height: calc(100% - 56px);" class="bg-f7 p-6 box-border">
        <div class="flex items-center py-4 px-6 mb-2 bg-white border rounded-md">
            <img class="w-[62px] mr-2" :src="ecosystem[compData.ecosystem]?.img" alt="">
            <div class="flex flex-col">
                <span class="text-2xl mb-[6px] text-3c font-medium">{{ $route.query.name }}</span>
                <div class="flex items-center text-85 text-xs">
                    <span>版本数量：{{ compData.version_total }}</span>
                    <el-divider direction="vertical" class="mx-2" />
                    <span>生态系统类型：{{ ecosystem[$route.query.ecosystem]?.name }}</span>
                </div>
            </div>
        </div>

        <div style="height: calc(100% - 98px);" v-loading="loading"
            class="flex text-3c bg-ff p-6 box-border rounded-md">
            <div class="flex-1 pr-6 w-0 h-full overflow-auto" style="border-right: 1px solid #2A2B321A;">
                <div class="sticky top-0 bg-ff z-[99] pb-3">
                    <div class="mb-4">历史版本</div>
                    <div class="flex items-center w-full">
                        <!-- 搜索框 -->
                        <SearchComp style="width: 200px;" clearable v-model="filters.keyword"
                            placeholder="请输入搜索软件包版本" />

                        <!-- 许可证选择框 -->
                        <SelectComp class="w-[120px]" clearable v-model="filters.license" :options="licenseOption"
                            placeholder="许可证" />

                        <!-- 发布时间选择框 -->
                        <el-date-picker style="max-width: 200px;" class="mr-2" v-model="filters.time" type="daterange"
                            start-placeholder="开始时间" end-placeholder="结束时间" range-separator="" />

                        <!-- 复选框 -->
                        <el-checkbox class="mr-2 text-3c font-normal" v-model="filters.usedInProject"
                            label="有项目使用"></el-checkbox>
                        <el-checkbox class="text-3c font-normal" v-model="filters.noVulnerabilities"
                            label="无漏洞版本"></el-checkbox>

                        <el-button @click="resetHandle" class="minor_btn h-8 ml-6 w-auto">重置</el-button>
                    </div>
                </div>

                <!-- left -->
                <div v-if="total > 0">
                    <div class="h-[225px] w-full" id="version_chart"></div>

                    <div class="text-85 text-xs mt-2 mb-6 text-center">{{ listData[0]?.time }} 至 {{
                        listData[listData.length-1]?.time }}
                        的 {{ listData.length }} 个版本漏洞统计</div>

                    <el-table :data="listData" :cell-style="{ padding: '12px 0', color: '#3c3c3c' }"
                        :header-cell-style="{ padding: '12px 0', border: 'none', background: '#F7F8FB', color: '#8F959E', fontWeight: 400 }">
                        <el-table-column label="版本" show-overflow-tooltip>
                            <template #default="{ row }">
                                <span @click="openVersionDetail(row)"
                                    class="cursor-pointer hover:underline hover:text-primary">{{ row.version }}</span>
                            </template>
                        </el-table-column>

                        <el-table-column label="使用项目" width="80">
                            <template #default="{ row }">
                                <div @click="openVersionDetail(row)"
                                    class="cursor-pointer hover:underline hover:text-primary">{{ row.project_total }}
                                </div>
                            </template>
                        </el-table-column>

                        <el-table-column label="漏洞分布" width="280">
                            <template #default="{ row }">
                                <span class="info_item">
                                    <span class="num">
                                        <span :class="{ 'no_data_1': !row.vuln_total?.critical_vulns }"
                                            style="background-color: #F34D3D;color: #fff;">C</span>
                                        <span :class="{ 'no_data_2': !row.vuln_total?.critical_vulns }"
                                            style="background-color: rgba(245, 74, 69, 0.2);color: #F34D3D;">{{
                                                row.vuln_total?.critical_vulns
                                            }}</span>
                                    </span>
                                    <span class="num">
                                        <span :class="{ 'no_data_1': !row.vuln_total?.high_vulns }"
                                            style="background-color: #FF9940;color: #fff;">H</span>
                                        <span :class="{ 'no_data_2': !row.vuln_total?.high_vulns }"
                                            style="background-color: rgba(255, 153, 64, 0.2);color: #FF9940;">{{
                                                row.vuln_total?.high_vulns
                                            }}</span>
                                    </span>
                                    <span class="num">
                                        <span :class="{ 'no_data_1': !row.vuln_total?.medium_vulns }"
                                            style="background-color: #FCBE03;color: #fff;">M</span>
                                        <span :class="{ 'no_data_2': !row.vuln_total?.medium_vulns }"
                                            style="background-color: rgba(255, 204, 51, 0.2);color: #FCBE03;">{{
                                                row.vuln_total?.medium_vulns
                                            }}</span>
                                    </span>
                                    <span class="num">
                                        <span :class="{ 'no_data_1': !row.vuln_total?.low_vulns }"
                                            style="background-color: #A7AECC;color: #fff;">L</span>
                                        <span :class="{ 'no_data_2': !row.vuln_total?.low_vulns }"
                                            style="background-color: rgba(167, 174, 204, 0.2);color: #A7AECC;">{{
                                                row.vuln_total?.low_vulns
                                            }}</span>
                                    </span>
                                </span>
                            </template>
                        </el-table-column>

                        <el-table-column prop="projectUsageCount" label="许可证" width="140">
                            <template #default="{ row }">
                                <el-tooltip :disabled="row.licenses?.length < 2" placement="top">
                                    <template #content>
                                        <div v-for="item in row.licenses" :key="item">
                                            {{ item }}</div>
                                    </template>
                                    <div class="ellipsis leading-none inline-block max-w-full">
                                        <span v-for="(item, i) in row.licenses" :key="item">
                                            {{ item }}<span v-if="i !== row.licenses.length - 1">、</span>
                                        </span>
                                    </div>
                                </el-tooltip>
                                <span v-if="!row.licenses.length">暂无</span>
                            </template>
                        </el-table-column>

                        <el-table-column label="成熟度评估" width="90">
                            <template #default="{ row }">
                                <span class="g-cursor-pointer">
                                    <span v-if="row?.maturity?.maturity" class="g-fw-500"
                                        @click="radatData = row?.maturity; isShowRadar = true"
                                        :style="{ color: row?.maturity?.maturity > 60 ? '#38C728' : '#FF9940' }">
                                        <i class="murphy icon-leaf"></i> {{ row.maturity?.maturity }}
                                    </span>
                                    <span v-else>暂无</span>
                                </span>
                            </template>
                        </el-table-column>

                        <el-table-column label="发布时间" width="100">
                            <template #default="{ row }">
                                {{ row.time }}
                            </template>
                        </el-table-column>
                    </el-table>

                    <PageComp v-model:currentPage="curPage" @change="changepage" :total="total" :page-size="10" />
                </div>

                <div v-else class="self-center mt-[15%]">
                    <NoData description="未查询到结果" />
                    <p class="font-normal mt-[-12px] text-sm text-85 text-center">您可以通过更改搜索词或筛选条件重新查询所需的内容</p>
                </div>
            </div>

            <!-- right -->
            <div class="w-[204px] pl-6 text-3c font-normal overflow-auto">
                <div class="mb-4">
                    基本信息
                </div>
                <div class="text-sm mb-3">
                    <p class="font-normal text-[#8F959E] text-xs mb-1">最近更新时间</p>
                    <p>{{ compData.time || '-' }}</p>
                </div>
                <div class="text-sm mb-3">
                    <p class="font-normal text-[#8F959E] text-xs mb-1">官方网址</p>
                    <p v-if="compData.url" class="flex items-center link h-5">
                        <a target="_blank" class=" text-3c ellipsis" :href="compData.url">{{ compData.url }}</a>
                        <span id="copy_url" @click="copyFunc('#copy_url')" :data-clipboard-text="compData.url"
                            class="hover_icon px-[4px] py-[2px]">
                            <i class="murphy icon-fuzhi1 text-3c cursor-pointer text-xs"></i>
                        </span>
                    </p>
                    <p v-else>-</p>
                </div>
                <div class="text-sm">
                    <p class="font-normal text-[#8F959E] text-xs mb-1">说明</p>
                    <p class="leading-6 break-all">
                        {{ compData.description || '暂无说明' }}
                    </p>
                </div>
            </div>
        </div>
    </div>

    <RipeRadarModal v-model="isShowRadar" v-if="isShowRadar" :score="radatData" />

</template>

<script setup>
import {
    ref, onMounted, watch, nextTick,
} from 'vue';
import { getCompDetailApi } from 'api/knowledge';
import { renderChart } from 'util/chart';
import { useRoute } from 'vue-router';
import store from 'util/store';
import { ecosystem } from '@/constants';
import { copyFunc, formatDate1 } from '@/utils/tools';
import { createChartOptions } from './business';
import RipeRadarModal from '../project/detail/RipeRadarModal.vue';

const route = useRoute();
const loading = ref(false);
const curPage = ref(1);
const total = ref(10);
const compData = ref({});
const listData = ref([]);
const cacheData = ref([]);
const curTotalData = ref([]);
const isShowRadar = ref(false);
const radatData = ref({});
const filters = ref({
    keyword: '',
    license: '',
    time: null,
    usedInProject: Boolean(route.query.use),
    noVulnerabilities: false,
});
const licenseOption = ref();

onMounted(async () => {
    loading.value = true;
    try {
        const { data } = await getCompDetailApi({
            team_id: store.teamInfo.team_id,
            name: route.query.name,
            ecosystem: route.query.ecosystem,
            repository: route.query.repository,
        });
        compData.value = data.asset_base_info;
        listData.value = data.asset_detail_item ? data.asset_detail_item?.slice(0, 10) : [];
        cacheData.value = data.asset_detail_item || [];
        curTotalData.value = data.asset_detail_item || [];
        total.value = data.asset_detail_item?.length || 0;
        loading.value = false;

        const license = [];
        cacheData.value.forEach((item) => {
            license.push(...item.licenses);
        });
        licenseOption.value = [...new Set(license)].map((item) => ({ label: item, value: item }));

        // eslint-disable-next-line no-use-before-define
        filterHandle(filters.value);
    } catch (error) {
        loading.value = false;
        console.log(error);
    }
    renderChart(createChartOptions(listData.value), document.getElementById('version_chart'));
});

// 筛选
const filterHandle = (newVal) => {
    let filterdata = [];

    // 搜索过滤
    filterdata = cacheData.value.filter((item) => item.version.includes(newVal.keyword));

    if (newVal.license) {
        filterdata = filterdata.filter((item) => item.licenses.includes(newVal.license));
    }

    if (newVal.time) {
        filterdata = filterdata.filter((item) => item.time >= formatDate1(newVal.time[0]) && item.time <= formatDate1(newVal.time[1]));
    }

    if (newVal.usedInProject) {
        filterdata = filterdata.filter((item) => item.project_total > 0);
    }

    if (newVal.noVulnerabilities) {
        filterdata = filterdata.filter((item) => item.vuln_total?.total_vulns === 0);
    }

    curTotalData.value = filterdata;
    listData.value = curTotalData.value.slice(0, 10);
    total.value = curTotalData.value.length;
    if (listData.value.length) {
        nextTick(() => {
            renderChart(createChartOptions(listData.value), document.getElementById('version_chart'));
        });
    }
};

const resetHandle = () => {
    Object.assign(filters.value, {
        keyword: '',
        license: undefined,
        time: null,
        usedInProject: false,
        noVulnerabilities: false,
    });

    filterHandle(filters.value);
};

watch(filters.value, (newVal) => {
    filterHandle(newVal);
});

const changepage = (page) => {
    listData.value = curTotalData.value.slice(page * 10 - 10, page * 10);
    renderChart(createChartOptions(listData.value), document.getElementById('version_chart'));
};

const openVersionDetail = (row) => {
    window.open(`/console/version-detail?name=${route.query.name}&version=${row.version}&ecosystem=${route.query.ecosystem}&repository=${route.query.repository}`, '_blank');

    // router.push({
    //     path: '/version-detail',
    //     query: {
    //         name: route.query.name, version: row.version, ecosystem: route.query.ecosystem, repository: route.query.repository,
    //     },
    // });
};
</script>

<style scoped lang='less'>
.shrink {
    width: 32px;
    vertical-align: -10px;
    cursor: pointer;
}

.hover_icon {
    display: none;
    // margin-left: 4px;
}

.link:hover .hover_icon {
    display: block;
}

.link:hover a {
    text-decoration: underline;
    color: @primary;
}

.num {
    display: inline-block;
    border-radius: 4px;
    margin-right: 6px;

    span {
        &:nth-of-type(1) {
            border-top-left-radius: 2px;
            border-bottom-left-radius: 2px;
        }

        &:nth-of-type(2) {
            border-top-right-radius: 2px;
            border-bottom-right-radius: 2px;
            padding: 0 6px;
        }

        display: inline-block;
        padding: 0 6px;
    }

    .no_data_1 {
        background-color: #EBEBEB !important;
        color: #fff !important;
    }

    .no_data_2 {
        background-color: #C7C7C733 !important;
        color: #C7C7C7 !important;
    }
}
</style>
