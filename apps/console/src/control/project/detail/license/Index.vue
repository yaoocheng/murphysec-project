<template>
    <div class="mb-6 flex gap-1">
        <el-button class="w-auto minor_white_btn custom-btn h-7 px-2" v-for="item in tabButtons" :key="item.value"
                   :class="{ 'active': tabValue === item.value }" @click="tabValue = item.value">{{ item.text }}</el-button>
    </div>

    <div v-if="tabValue === '1'" class="license-info-container px-6 mb-6 flex items-center rounded-md h-[60px]">
        <div class="text-sm font-normal flex items-center justify-between w-full">
            <div class="text-3c flex items-center">
                <span class="mr-2">
                    项目许可证
                </span>
                <Tooltip width="370" v-for="item in projectLicenseList?.slice(0, 3)" :key="item.license_name" :content="item.license_name">
                    <TagComp class="mr-1 max-w-tag"
                             :content="item.license_name" c="#3c3c3c" bgc="#C7C7C780" />
                </Tooltip>

                <el-tooltip v-if="projectLicenseList.length > 3" placement="top" effect="light">
                    <template #content>
                        <div class="max-h-[240px] overflow-auto">
                            <div class="mb-2" v-for="o in projectLicenseList" :key="o">
                                <TagComp class="g-mr-4" c="#3c3c3c" bgc="#C7C7C780" :content="o.license_name" />
                            </div>
                        </div>
                    </template>
                    <TagComp :content="`+${projectLicenseList.length}`" c="#3c3c3c"
                             bgc="#C7C7C780" />
                </el-tooltip>

                <span v-if="!projectLicTotal">暂未识别到项目许可证</span>
            </div>
            <div v-if="!$route.fullPath.includes('/share-report')" @click="isShowEditLic = true" class="button-text-blue text-primary h-[26px]">
                <i class="murphy icon-Union2" style="font-size: 14px"></i>
                编辑
            </div>
        </div>
    </div>

    <EditProjectLic v-model="isShowEditLic" v-if="isShowEditLic" />

    <LicenseCompatibility v-if="tabValue === '2'" />

    <LicenseCopyright v-if="tabValue === '3'" />

    <LicenseIndex v-if="tabValue === '1'" />

</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { getProjectLicenseListApi } from 'api/detail';
import bus from '@/utils/tools';
import LicenseIndex from './LicenseIndex.vue';
import EditProjectLic from './EditProjectLic.vue';
import LicenseCompatibility from './LicenseCompatibility.vue';
import LicenseCopyright from './LicenseCopyright.vue';

const tabValue = ref('1');
const isShowEditLic = ref<boolean>(false);
const route = useRoute();
const tabButtons = [
    { text: '许可证列表', value: '1' },
    { text: '许可证兼容性分析', value: '2' },
    { text: '版权与许可声明合规分析', value: '3' },
];

const projectLicenseList = ref<Array<any>>([]);
const projectLicTotal = ref<number>(0);
const getProjectLicenseList = async () => {
    try {
        const { data } = await getProjectLicenseListApi({
            subtask_id: route.params.sid,
            page: 1,
            limit: 3,
        });
        projectLicenseList.value = data.list || [];
        projectLicTotal.value = data.total;
    } catch (error) {
        console.log(error);
    }
};
getProjectLicenseList();

bus.on('refreshLicense', () => {
    getProjectLicenseList();
});
</script>

<style scoped>
/* .minor_white_btn.custom-btn:hover {
    border-color: #6C87FF80 !important;
    background-color: #6C87FF1A !important;
    color: var(--el-color-primary) !important;
} */

.minor_white_btn.custom-btn.active {
    border-color: #6C87FF !important;
    background-color: #6C87FF1A !important;
    color: #6C87FF !important;
}

.license-info-container {
    background-color: #F7F8FB;
    border: 1px solid #E7E8EB;
}

</style>

<style>

.max-w-tag .el-tag__content {
    display: inline-block;
    max-width: 260px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
</style>
