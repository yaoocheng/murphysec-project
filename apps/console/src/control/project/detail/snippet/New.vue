<template>
    <div class="code-snippet" v-loading="loading">
        <div class="flex justify-between g-mb-24">
            <div>
                <SearchComp style="width: 240px;" v-model="filterData.project_name" clearable placeholder="请搜索开源项目名称" />
                <!-- <CheckboxComp style="width: 140px" v-model="filterData.license_names" :options="licenseOptions"
                    clearable placeholder="许可证名称" /> -->
                <SelectComp style="width: 160px" v-model="filterData.license_level" placeholder="许可证风险等级"
                            :options="snipLcenseLevelOption" />
                <SelectComp style="width: 140px" v-model="filterData.confirm_status" placeholder="确认状态"
                            :options="statusOption" />
                <CheckboxComp style="width: 140px" v-model="filterData.data_type" :options="matchWaysOptions" clearable
                              placeholder="匹配类型" />

                <MinorBtn @click="resetFilter">重置</MinorBtn>
            </div>
            <el-button class="minor_btn h-8 w-auto" v-if="selectData.length" @click="statusModal = true">批量修改状态 {{
                selectData.length || ''
            }}</el-button>
        </div>

        <div class="g-f-14 g-mb-8 g-color-3">
            共 <span class="g-color-1">{{ total }}</span> 条数据
        </div>
        <el-table v-if="isHaveData" ref="tableRef" :data="listData"
                  :cell-style="{ padding: '12px 0', color: '#3c3c3c' }" @selection-change="handleSelectionChange"
                  :header-cell-style="{ padding: '12px 0', border: 'none', background: '#F7F8FB', color: '#8F959E', fontWeight: 400 }">
            <el-table-column v-if="!$route.fullPath.includes('share-report')" type="selection" width="32" />
            <el-table-column min-width="240" label="开源项目">
                <template #default="{ row }">
                    <Tooltip :content="row.target_project_name" width="400">
                        <span @click="projectItemInfo = row; snippetModal = true;"
                              class="ellipsis inline-block max-w-full align-[-6px] cursor-pointer hover:text-primary hover:underline">
                            {{ row.target_project_name }}</span>
                    </Tooltip>
                </template>
            </el-table-column>
            <el-table-column min-width="120" label="版本">
                <template #header>
                    <div>
                        版本
                        <TipsComp width="400" content="应用该开源项目中匹配到的开源文件中占比最多的版本，占比一致时取最新版本" />
                    </div>
                </template>
                <template #default="{ row }">
                    <Tooltip :content="row.version" width="400">
                        <div class="ellipsis leading-none inline-block max-w-full">{{ row.version }}</div>
                    </Tooltip>
                </template>
            </el-table-column>
            <el-table-column min-width="140" label="许可证名称">
                <template #default="{ row }">
                    <el-tooltip :disabled="!row.target_project_license_list?.length" placement="top">
                        <template #content>
                            <div v-for="item in row.target_project_license_list" :key="item.name">{{ item.name }}</div>
                        </template>
                        <div class="ellipsis leading-none inline-block max-w-full">
                            {{ row.target_project_license_list?.[0]?.name || '-' }}
                        </div>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column min-width="126" label="许可证风险等级">
                <template #default="{ row }">
                    <span :style="{ color: licenseOption.find(ele => ele.value === row.level)?.c }">
                        <span v-if="licenseOption.find(ele => ele.value === row.level)?.label">
                            {{ licenseOption.find(ele => ele.value === row.level)?.label }}风险
                        </span>
                        <span v-else>-</span>
                    </span>
                </template>
            </el-table-column>
            <el-table-column min-width="110" label="涉及项目文件">
                <template #default="{ row }">
                    {{ row.total_source_file_total }}
                </template>
            </el-table-column>
            <el-table-column min-width="180" label="匹配类型">
                <template #default="{ row }">
                    <TagComp class="mr-1" v-for="item in row.data_type_list" :key="item" size="default" bgc="#EBEBEB" c="#3c3c3c"
                             :content="item === 'file' ? '文件精准匹配' : '代码片段匹配'" />
                </template>
            </el-table-column>
            <el-table-column min-width="90" label="确认状态">
                <template #header>
                    <div>
                        确认状态
                        <TipsComp width="400" content="可确认同源性分析结果的准确性，若匹配结果不准，可在详情中通过“更多匹配结果”更换文件/片段的来源" />
                    </div>
                </template>
                <template #default="{ row }">
                    <ConfirmStatus :status="row.confirm_status" :high_recommend="row.high_recommend" />
                </template>
            </el-table-column>
        </el-table>

        <PageComp v-if="isHaveData" v-model:currentPage="curPage" :total="total" :page-size="20" />

        <NoData v-if="!isHaveData" />
    </div>

    <ChangeStatusModal v-model="statusModal" @updateHandle="updateHandle" v-if="statusModal" />

    <SnippetModal v-model="snippetModal" v-if="snippetModal" @update="getData" />
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import { getSnippetList, changeSnippetStatusApi, getLicenseOptApi } from 'api/detail';
import useList from '@/utils/hook';
import store from '@/utils/store';
import {
    licenseOption, statusOption, matchWaysOptions, projectItemInfo, snippetModal,
} from './business';
import { licenseOptions, snipLcenseLevelOption } from '../../constants/constants';
import SnippetModal from './SnippetModal.vue';
import TipsComp from '@/components/TipsComp.vue';
import TagComp from '@/components/TagComp.vue';
import ChangeStatusModal from './ChangeStatusModal.vue';
import ConfirmStatus from './ConfirmStatus.vue';
import SelectComp from '@/components/SelectComp.vue';
import { showMessage } from '@/utils/tools';

// const emits = defineEmits(['update']);
const route = useRoute();
// const curPage = ref(1);
// const total = ref(1);
const statusModal = ref(false);
const selectData = ref([]);
const tableRef = ref();
const filterData = ref({
    project_id: route.params.tid,
    subtask_id: route.params.sid,
    project_name: '',
    license_level: undefined,
    confirm_status: undefined,
    hign_recommend: undefined,
    data_type: [],
});

const {
    listData, curPage, total, getData, isHaveData, loading,
} = useList(getSnippetList, filterData);

// watch(listData, (newVal) => {
//     if (!newVal.length) {
//         emits('update', false);
//     }
// });

const resetFilter = () => {
    Object.assign(filterData.value, {
        project_name: '',
        license_level: undefined,
        confirm_status: undefined,
        data_type: [],
        hign_recommend: undefined,
    });
};

const handleSelectionChange = (val) => {
    selectData.value = val;
};

const updateHandle = async (status) => {
    try {
        await changeSnippetStatusApi({
            project_id: route.params.tid,
            subtask_id: route.params.sid,
            target_project_id: selectData.value.map((item) => item.target_project_id),
            confirm_status: status,
        });
        showMessage('修改成功', 'success');
        getData();
        tableRef.value.clearSelection();
    } catch (error) {
        tableRef.value.clearSelection();
        console.log(error);
    }
};

onBeforeMount(async () => {
    try {
        const { data } = await getLicenseOptApi({
            team_id: store.teamInfo.team_id,
            subtask_id: route.params.sid,
        });
        licenseOptions.value = data.data.map((item) => ({ lable: item, value: item }));
    } catch (error) {
        console.log(error);
    }
});
</script>
