<template>
    <div class="table-container overflow-auto" style="height: calc(100vh - 295px);">
        <div v-if="cacheData.length" class="w-full">
            <div class="flex items-center w-full mb-3 sticky top-0 z-50 bg-ff">
                <SearchComp v-model="filters.keyword" style="width: 240px;" clearable placeholder="请搜索完整的漏洞编号" />

                <SelectComp v-model="filters.level" class="w-[100px]" clearable :options="vulnLevelOption"
                            placeholder="漏洞等级" />

                <SelectComp v-model="filters.poc" class="w-[100px]"
                            :options="[{ label: '有', value: true }, { label: '无', value: false }]" clearable
                            placeholder="POC" />

                <el-button @click="resetHandle" class="minor_btn h-8 ml-4 w-auto">重置</el-button>
            </div>

            <div v-if="vulnList.length" class="w-full">
                <div class="text-sm text-85 mb-3">
                    <span>共 <span class="g-color-1">{{ total }}</span> 条数据</span>
                </div>

                <el-table :data="vulnList" @expand-change="handleRowClick" @row-click="handleRowClick"
                          :expand-row-keys="expandedRowKeys" :cell-style="{ padding: '12px 0', color: '#3c3c3c' }"
                          row-key="mps_id"
                          :header-cell-style="{ padding: '12px 0', border: 'none', background: '#F7F8FB', color: '#8F959E', fontWeight: 400 }">
                    <el-table-column fixed="left" type="expand" width="30">
                        <template #default="{ row }">
                            <div class="p-4 bg-f7 rounded-lg flex">
                                <div class="rounded-md left_vuln bg-ff p-4 flex-1 mr-4"
                                     style="border: 1px solid #1E1E1E1A">
                                    <div v-for="item in row.info?.vulnerabilityDetails" :key="item.mps_id"
                                         class="text-3c text-sm mb-4">
                                        <p>
                                            <span class="text-85 text-xs font-normal block mb-1">
                                                {{ item.name }}
                                            </span>
                                            {{ item.value }}
                                        </p>
                                    </div>
                                </div>
                                <div class="flex-1">
                                    <div style="border: 1px solid #1E1E1E1A" class="bg-white text-3c mb-4 rounded-lg">
                                        <div
                                            class="flex justify-between items-center bg-[#EBEBEB66] border-b py-3 px-6">
                                            <p class="text-sm font-medium">墨菲安全评级</p>
                                            <p class="text-sm font-normal"
                                               :style="{ color: getDangerLevel(row.info?.level).color }">{{
                                                   getDangerLevel(row.info?.level).text }}</p>
                                        </div>
                                        <div class="px-6 py-4">
                                            <div class="flex justify-between items-center mb-3">
                                                <p class="text-sm text-85">漏洞影响广度</p>
                                                <p class="text-sm font-medium text-3c">{{ row.info?.scope_influence ||
                                                    '未知'
                                                }}</p>
                                            </div>
                                            <div class="flex justify-between items-center mb-3">
                                                <p class="text-sm text-85">利用可能性</p>
                                                <p class="text-sm font-medium text-3c">{{ row.info?.exploitability ||
                                                    '暂无'
                                                }}</p>
                                            </div>
                                            <div class="flex justify-between items-center">
                                                <p class="text-sm text-85">利用成熟度</p>
                                                <p class="text-sm font-medium text-3c">{{ row.info?.poc ? '存在POC' :
                                                    '暂无POC'
                                                }}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div style="border: 1px solid #1E1E1E1A" class="bg-white text-3c rounded-lg">
                                        <div class="bg-[#EBEBEB66] border-b py-3 px-6">
                                            <div class="flex justify-between mb-2">
                                                <p class="text-sm font-medium">CVSS漏洞评分</p>
                                                <p class="text-sm font-normal"
                                                   :style="{ color: RiskLevel[scoreToLevel(row.info?.cvss_score)]?.color }">
                                                    {{ RiskLevel[scoreToLevel(row.info?.cvss_score)]?.text }}</p>
                                            </div>
                                            <div class="flex">
                                                <el-progress v-if="row.info?.cvss_score" class="flex-1 mr-2"
                                                             :color="showColor(row.info?.cvss_score)" :stroke-width="8"
                                                             :percentage="(row.info?.cvss_score / 10) * 100"
                                                             :show-text="false" />
                                                <span :style="{ color: showColor(row.info?.cvss_score) }">{{
                                                    row.info?.cvss_score }}</span>
                                            </div>
                                        </div>
                                        <div class="px-6 py-4">
                                            <div v-for="ele in row.info?.attackDetails" :key="ele.title"
                                                 class="flex justify-between items-center mb-3">
                                                <p class="text-sm text-85">{{ CVSS_DESC[ele.title]?.title }}</p>
                                                <p class="text-sm font-medium text-3c">{{
                                                    CVSS_DESC[ele.title]?.values[ele.val] }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="200" fixed="left" prop="title" label="漏洞名称" show-overflow-tooltip />
                    <el-table-column prop="number" label="漏洞编号" width="160" show-overflow-tooltip>
                        <template #default="{ row }">
                            {{ row.cve_id }}<br v-if="row.cve_id && row.mps_id">
                            {{ row.mps_id }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="level" label="漏洞等级" width="100">
                        <template #default="scope">
                            <TagComp :c="getDangerLevel(scope.row.level).color"
                                     :bgc="getDangerLevel(scope.row.level).bgc"
                                     :content="getDangerLevel(scope.row.level).text" />
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="cvss_score" label="CVSS评分" width="90">
                        <template #default="{ row }">
                            {{ row.cvss_score.toFixed(1) }}
                        </template>
                    </el-table-column> -->
                    <el-table-column prop="poc" label="POC" width="50">
                        <template #default="{ row }">
                            {{ row.poc ? '有' : '无' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="date" label="发现时间" width="160">
                        <template #default="{ row }">
                            {{ formatDate(row.published_date) }}
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

        <div v-if="!cacheData.length" class="self-center mt-36">
            <NoData description="该组件版本暂无漏洞信息" />
        </div>

        <div v-if="cacheData.length && !vulnList.length" class="self-center mt-36">
            <NoData description="未查询到结果" />
            <p class="font-normal mt-[-12px] text-sm text-85 text-center">您可以通过更改搜索词或筛选条件重新查询所需的内容</p>
        </div>
    </div>
</template>

<script setup>
import {
    ref, onBeforeMount, watch,
} from 'vue';
import store from 'util/store';
import { getVersionVulnListApi, getVulnInfoApi } from 'api/knowledge';
import { useRoute } from 'vue-router';
import {
    RiskLevel, scoreToLevel, CVSS_DESC, showColor, CvssSplit,
} from '@/constants';
import { formatDate, getDangerLevel, repaireChangeColor } from '@/utils/tools';
import { vulnLevelOption } from '@/control/project/constants/constants';

const route = useRoute();
const total = ref(0);
const vulnList = ref([]);
const cacheData = ref([]);
const filters = ref({
    keyword: '',
    level: undefined,
    poc: undefined,
});

onBeforeMount(async () => {
    try {
        const { data } = await getVersionVulnListApi({
            team_id: store.teamInfo.team_id,
            name: route.query.name,
            ecosystem: route.query.ecosystem,
            repository: route.query.repository,
            version: route.query.version,
        });

        const list = data?.content;
        const sortList = [
            ...list.filter((a) => a.level === 'Critical'),
            ...list.filter((a) => a.level === 'High'),
            ...list.filter((a) => a.level === 'Medium'),
            ...list.filter((a) => a.level === 'Low')];

        vulnList.value = sortList;
        cacheData.value = sortList;
        total.value = data?.content.length;
    } catch (error) {
        console.log(error);
    }
});

const filterHandle = (newVal) => {
    let filterdata = [...cacheData.value];

    // 搜索过滤
    if (newVal.keyword) {
        filterdata = cacheData.value.filter((item) => item.cve_id === (newVal.keyword) || item.mps_id === (newVal.keyword) || item.cnvd_id === (newVal.keyword) || item.cavd_id === (newVal.keyword));
    }

    if (newVal.level) {
        filterdata = filterdata.filter((item) => newVal.level === item.level);
    }

    // 触发漏洞
    if (newVal.poc === true || newVal.poc === false) {
        filterdata = filterdata.filter((item) => item.poc === newVal.poc);
    }

    total.value = filterdata.length;
    vulnList.value = filterdata;
};

// 重置
const resetHandle = () => {
    Object.assign(filters.value, {
        keyword: '',
        poc: undefined,
        level: undefined,
    });
    filterHandle(filters.value);
};

watch(filters.value, (newVal) => {
    filterHandle(newVal);
});
const expandedRowKeys = ref([]);

const expandChange = async (row) => {
    if (!row.info) {
        try {
            const { data } = await getVulnInfoApi({
                team_id: store.teamInfo.team_id,
                mps_id: row.mps_id,
            });
            row.info = data;
            row.info.vulnerabilityDetails = [
                {
                    name: 'CNVD 编号', // 字段解释
                    value: data.cnvd_id || '暂无', // 字段值
                },
                {
                    name: 'CAVD 编号', // 字段解释
                    value: data.cavd_id || '暂无', // 字段值
                },
                {
                    name: '处置建议', // 字段解释
                    value: repaireChangeColor(data.fix_suggestion).text, // 字段值
                },
                {
                    name: '漏洞类型', // 字段解释
                    value: data.kind || '未知', // 字段值
                },
                {
                    name: '发现时间', // 字段解释
                    value: data.published_time, // 字段值
                },
                {
                    name: '更新时间', // 字段解释
                    value: data.last_modified_time, // 字段值
                },
                {
                    name: '漏洞描述', // 字段解释
                    value: data.description, // 字段值
                },
            ];
            row.info.attackDetails = CvssSplit(data.cvss_vector);
        } catch (error) {
            console.log(error);
        }
    }
};

const handleRowClick = (row) => {
    const index = expandedRowKeys.value.indexOf(row.mps_id);
    if (index === -1) {
        expandedRowKeys.value.push(row.mps_id);
        expandChange(row);
    } else {
        expandedRowKeys.value.splice(index, 1);
    }
};

</script>
