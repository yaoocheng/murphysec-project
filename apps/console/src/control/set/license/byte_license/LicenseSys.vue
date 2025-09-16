<template>
    <div class="filter_wrap flex g-mb-16">
        <SearchComp v-model="filters.keyword" clearable placeholder="请搜索许可证名称" />
        <el-select v-model="filters.license_family_id" clearable class="w-[140px]" placeholder="许可证类型">
            <el-option v-for="item in listType" :key="item.id" :label="item.license_family_name" :value="item.id" />
        </el-select>
    </div>

    <div class="g-f-14 g-color-3 g-mb-16 g-fw-400">
        共 <span class="g-color-1">{{ listData.length }}</span> 条数据
    </div>

    <div class="table_wrap" style="height: calc(100% - 80px);">
        <vxe-table :cell-style="{ lineHeight: '52px' }"
                   :header-cell-style="{ height: '52px', background: '#F7F8FB', fontWeight: 400, color: '#8F959E' }"
                   :row-style="{ background: '#fff' }" :row-config="{ height: 52 }" min-height="50" max-height="450"
                   :scroll-y="{ enabled: true }" border="inner" :round="true" :data="listData">
            <vxe-column title="许可证名称">
                <template #default="{ row }">
                    <Tooltip width="344" :content="row.license_spdx_id">
                        <span class="inline-block max-w-full leading-none">{{ row.license_spdx_id }}</span>
                    </Tooltip>
                </template>
            </vxe-column>

            <vxe-column title="许可证类型">
                <template #default="{ row }">
                    {{ row.license_family_name || '-' }}
                </template>
            </vxe-column>
            <vxe-column width="120" title="操作">
                <template #default="scope">
                    <span
                        @click.stop="isShowLicenseInfo = true; licType=scope.row.license_family_name; licSource=scope.row.source; licenseName = scope.row.license_spdx_id; licenseRiskInfo = scope.row.risk"
                        class="g-color-5 g-cursor-pointer">查看</span>
                    <span class="text-primary cursor-pointer" @click="Object.assign(form, scope.row); typeModal = true">
                        更改类型
                    </span>
                </template>
            </vxe-column>
        </vxe-table>
    </div>

    <LicenseInfoModal v-model="isShowLicenseInfo" :licSource="licSource" :licType="licType" :licenseName="licenseName" :licenseRisk="licenseRiskInfo"
                      v-if="isShowLicenseInfo" />

    <el-dialog width="600px" v-model="typeModal" title="更改许可证类型">
        <div class="text-3c">
            <div class="font-medium mb-2">许可证名称</div>
            <div class="mb-6">{{ form.license_spdx_id }}</div>

            <div class="font-medium mb-2">
                <span class="text-err">*</span>
                许可证类型
            </div>
            <el-select v-model="form.license_family_id" @change="changeFamily" clearable class="w-full" placeholder="请选择许可证类型">
                <el-option v-for="item in listType" :key="item.id" :label="item.license_family_name" :value="item.id" />
            </el-select>
        </div>

        <template #footer>
            <el-button @click="typeModal = false" class="w-20 h-8 minor_white_btn">取消</el-button>
            <el-button @click="confirmHandle" :disabled="!form.license_family_id" class="w-20">确认</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang='ts'>
import { ref, watch } from 'vue';
import store from 'util/store';
import { showMessage } from 'util/tools';
import { getSysLicApi, updateSysLicApi, getLicenseListApi } from 'api/set';
import useList from 'util/hook';
import SearchComp from '@/components/SearchComp.vue';
import LicenseInfoModal from '@/control/project/detail/license/LicenseInfoModal.vue';

const filterOptions = ref<{
    team_id: string,
    source: string,
    page: undefined,
    limit: undefined,
}>({
    team_id: store.teamInfo.team_id,
    source: 'built_in',
    page: undefined,
    limit: undefined,
});

const filters = ref({
    keyword: '',
    license_family_id: undefined,
});
const isShowLicenseInfo = ref<boolean>(false);
const licenseName = ref<string>('');
const licenseRiskInfo = ref<string>('');
const typeModal = ref(false);
const licType = ref();
const licSource = ref();

const changeFamily = (val:string) => {
    // eslint-disable-next-line no-use-before-define
    form.value.license_family_name = listType.value.find((item) => item.id === val).license_family_name;
};

const form = ref({
    license_spdx_id: '',
    license_family_name: '',
    license_family_id: undefined,
});
const typefilters = ref({
    team_id: store.teamInfo.team_id,
});

const {
    listData, initData, getData,
} = useList(getSysLicApi, filterOptions);

const {
    listData: listType,
} = useList(getLicenseListApi, typefilters);

watch(filters.value, (newVal) => {
    listData.value = initData.value.filter((item) => item.license_spdx_id?.toLowerCase().includes(newVal.keyword?.toLowerCase()));

    if (newVal.license_family_id) {
        listData.value = listData.value.filter((item) => item.license_family_id === newVal.license_family_id);
    }
});

const confirmHandle = async () => {
    try {
        await updateSysLicApi(form.value);
        getData();
        showMessage('更新成功', 'success');
        typeModal.value = false;
    } catch (error) {
        console.log(error);
    }
};
</script>
