<template>
    <div v-loading="loading">
        <div v-if="listData.length">
            <div class="g-mb-16">
                <SearchComp v-model="searchKeyword" style="width: 240px;" clearable placeholder="请搜索风险项" />
                <CheckboxComp v-model="selectedRiskLevel" style="width: 150px" :options="riskLevelOptions" clearable placeholder="风险等级" />
            </div>

            <div class="g-color-3 g-fw-400 g-f-14 g-mb-12">
                共 <span class="g-color-1 g-fw-500">{{ filteredData.length }}</span> 条数据
            </div>

            <TableComp v-if="filteredData.length" :data="filteredData">
                <el-table-column label="风险项" show-overflow-tooltip>
                    <template #default="scope">
                        <div class="flex items-center cursor-pointer hover:text-primary"
                             @click="modalInfo=scope.row;isShowCopyrightModal = true">
                            {{ licenseCopyrightLevel[scope.row.key].riskTitle  || '-' }}
                            <TagComp class="ml-1" :content="licenseCopyrightLevel[scope.row.key].riskLevel"
                                     :bgc="licenseCopyrightLevel[scope.row.key].riskColor" c="#FFFFFF" />
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="风险文件数量" width="120">
                    <template #default="scope">
                        <div>
                            {{ scope.row.source_file_ids?.length || 0 }}
                        </div>
                    </template>
                </el-table-column>
            </TableComp>
            <NoData v-else description="暂无数据" />
        </div>
        <div v-else class="flex flex-col items-center my-20">
            <NoData description="暂无风险信息" />
            <p class="text-sm text-85 font-normal mt-[-12px]">本次检测结果未识别到版权与许可声明合规风险</p>
        </div>
    </div>

    <LicenseCopyrightModal :modalInfo="modalInfo" v-model="isShowCopyrightModal" v-if="isShowCopyrightModal" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { licenseCopyrightLevel } from '../../constants/constants';
import { getLicenseComplianceListApi } from '@/api/project';
import LicenseCopyrightModal from './LicenseCopyrightModal.vue';

const route = useRoute();
const isShowCopyrightModal = ref(false);
const loading = ref(false);
const listData = ref<any>([]);
const searchKeyword = ref('');
const selectedRiskLevel = ref<any[]>([]);
const modalInfo = ref<any>({});

// 构建风险等级选项
const riskLevelOptions = [
    {
        label: '高',
        value: '高',
    },
    {
        label: '中',
        value: '中',
    },
    {
        label: '低',
        value: '低',
    },
];

// 过滤数据
const filteredData = computed(() => listData.value.filter((item:any) => {
    const matchKeyword = searchKeyword.value
        ? licenseCopyrightLevel[item.key].riskTitle.toLowerCase().includes(searchKeyword.value.toLowerCase())
        : true;

    const matchRiskLevel = selectedRiskLevel.value.length
        ? selectedRiskLevel.value.includes(licenseCopyrightLevel[item.key].riskLevel)
        : true;

    return matchKeyword && matchRiskLevel;
}));

const getLicenseComplianceList = async () => {
    try {
        loading.value = true;
        const { data } = await getLicenseComplianceListApi({
            subtask_id: route.params.sid,
            project_id: route.params.tid,
        });
        const keys = Object.keys(data || {}) || [];
        const filteredKeys = keys.filter((key) => key !== 'targets_sources_copyright_mismatched'
            && key !== 'sources_copyright_nonstandard');
        filteredKeys.forEach((key) => {
            listData.value.push({
                key,
                ...data[key],
            });
        });
    } catch (error: any) {
        console.log(error);
    } finally {
        loading.value = false;
    }
};
getLicenseComplianceList();
</script>
