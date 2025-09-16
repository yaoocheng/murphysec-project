<template>
    <div class="filter_wrap g-mb-16">
        <SearchComp @input="searchHandle" v-model="keyword" clearable placeholder="请搜索许可证名称" />
    </div>

    <div class="g-f-14 g-color-3 g-mb-16 g-fw-400">
        共 <span class="g-color-1">{{ listData.length }}</span> 条数据
    </div>

    <div class="table_wrap" style="height: calc(100% - 80px);">
        <vxe-table :cell-style="{ lineHeight: '52px' }"
                   :header-cell-style="{ height: '52px', background: '#F7F8FB', fontWeight: 400, color: '#8F959E' }"
                   :row-style="{ background: '#fff' }" :row-config="{ height: 52 }" min-height="50" max-height="500"
                   :scroll-y="{ enabled: true }" border="inner" :round="true" :data="showData">
            <vxe-column title="许可证名称">
                <template #default="{ row }">
                    <Tooltip width="344" :content="row.license_name">
                        <span class="inline-block max-w-full leading-none">{{ row.license_name }}</span>
                    </Tooltip>
                </template>
            </vxe-column>

            <vxe-column title="许可证风险等级" width="200">
                <template #default="scope">
                    <div :style="{ color: getLicenseLevelTool(scope.row.risk).color }">
                        {{ getLicenseLevelTool(scope.row.risk).text }}
                    </div>
                </template>
            </vxe-column>

            <vxe-column width="60" title="操作">
                <template #default="scope">
                    <span
                        @click.stop="isShowLicenseInfo = true; licenseName = scope.row.license_name; licenseRiskInfo = scope.row.risk"
                        class="g-color-5 g-cursor-pointer">查看</span>
                </template>
            </vxe-column>
        </vxe-table>
        <!-- <TableComp :data="showData" height="100%">
            <el-table-column prop="license_name" label="许可证名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="risk" label="许可证风险等级" width="200">
                <template #default="scope">
                    <div :style="{ color: getLicenseLevelTool(scope.row.risk).color }">
                        {{ getLicenseLevelTool(scope.row.risk).text }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="60">
                <template #default="scope">
                    <span
                        @click.stop="isShowLicenseInfo = true; licenseName = scope.row.license_name; licenseRiskInfo = scope.row.risk"
                        class="g-color-5 g-cursor-pointer">查看</span>
                </template>
            </el-table-column>
        </TableComp> -->
    </div>

    <!-- <PageComp v-model:currentPage="curPage" :total="total" :page-size="20" /> -->

    <LicenseInfoModal v-model="isShowLicenseInfo" :licenseName="licenseName" :licenseRisk="licenseRiskInfo"
                      v-if="isShowLicenseInfo" />
</template>

<script setup lang='ts'>
import { ref, watch } from 'vue';
import { getSysLicenseApi } from 'api/team';
import store from 'util/store';
import { getLicenseLevelTool } from 'util/tools';
// import TableComp from 'comp/TableComp.vue';
// import PageComp from 'comp/PageComp.vue';
import useList from 'util/hook';
import SearchComp from '@/components/SearchComp.vue';
import LicenseInfoModal from '@/control/project/detail/license/LicenseInfoModal.vue';

const filterOptions = ref<{
    team_id: string,
    is_only_builtin: boolean,
    page: undefined,
    limit: undefined,
}>({
    team_id: store.teamInfo.team_id,
    is_only_builtin: true,
    page: undefined,
    limit: undefined,
});

const keyword = ref('');
const isShowLicenseInfo = ref<boolean>(false);
const licenseName = ref<string>('');
const licenseRiskInfo = ref<string>('');
const showData = ref<any[]>([]);

const {
    listData, initData,
} = useList(getSysLicenseApi, filterOptions);

watch(listData, (newVal: any[]) => {
    showData.value = [...newVal.filter((item) => item.risk === 'High'), ...newVal.filter((item) => item.risk === 'Medium'), ...newVal.filter((item) => item.risk === 'Low'), ...newVal.filter((item) => item.risk === 'Safe')];
});

const searchHandle = (val: string) => {
    listData.value = initData.value.filter((item) => item.license_name.includes(val));
};
</script>

<style scoped lang='less'></style>
