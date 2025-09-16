<template>
    <div class="license-compatibility" v-loading="loading">
        <div v-if="licenseList.length">
            <SearchComp v-model="keyword" style="width: 240px;" class="mb-4" clearable placeholder="请搜索风险项" />

            <div class="license-list">
                <div class="g-color-3 g-fw-400 g-f-14 g-mb-12">
                    共 <span class="g-color-1 g-fw-500">{{ filteredLicenseList.length }}</span> 条数据
                </div>

                <div v-for="(item, index) in filteredLicenseList"  @click="item.expand=!item.expand" :key="index" class="py-3 px-4 bg-f7 rounded-md mb-2">
                    <div class="g-flex g-items-center">
                        <ExpandIcon class="cursor-pointer mr-2 ExpandIcon" type="r" :expand="item.expand" @click="item.expand=!item.expand" />
                        <div class="g-f-14 g-fw-400 g-color-1">{{ item.title }}</div>
                    </div>

                    <div @click.stop class="mt-3 rounded-md bg-ff p-6" v-if="item.expand">
                        <div class="text-3c text-sm flex justify-between items-center bg-f7 rounded-md p-4 mb-6">
                            <div class="flex-1 bg-ff w-0 rounded-md py-5 px-6 border border-solid border-[#EBEBEB]">
                                <div class="flex items-center justify-between mb-1">
                                    <span v-if="item.conflict_type !== 'pc'">{{ item.conflict_type === 'pp' ? '项目许可证' : '组件许可证' }}</span>
                                    <span v-else>项目许可证</span>

                                    <span v-if="item.conflict_type !== 'pp'&&item.conflict_type !== 'pc'" class="button-text-blue" @click="getLicCompList(item.conflict_type === 'pp' ? item.project_license_a :
                                        item.conflict_type === 'cc' ? item.comp_license_a : item.project_license_a)">
                                        查看影响组件
                                        <i class="murphy icon-jiantou-you ml-[-2px]" style="font-size: 13px"></i>
                                    </span>

                                </div>
                                <div class="text-base font-medium ellipsis">
                                    {{ item.conflict_type === 'pp' ? item.project_license_a :
                                        item.conflict_type === 'cc' ? item.comp_license_a : item.project_license_a }}
                                </div>
                            </div>

                            <div class="mx-4 px-2 flex flex-col items-center">
                                <SvgIcon :name="item.compatible_type === 'conflict' ? 'lic-clash' : 'lic-incompatible'" class="w-4 h-4 mb-2" />
                                {{ item.compatible_type === 'conflict' ? '冲突' : '不兼容' }}
                            </div>

                            <div class="flex-1 bg-ff w-0 rounded-md py-5 px-6 border border-solid border-[#EBEBEB]">
                                <div class="flex items-center justify-between mb-1">
                                    <span v-if="item.conflict_type !== 'pc'">{{ item.conflict_type === 'pp' ? '项目许可证' : '组件许可证' }}</span>
                                    <span v-else>组件许可证</span>

                                    <span v-if="item.conflict_type !== 'pp'" class="button-text-blue" @click="getLicCompList(item.conflict_type === 'pp' ? item.project_license_a :
                                        item.conflict_type === 'cc' ? item.comp_license_b : (item.comp_license_a||item.comp_license_b))">
                                        查看影响组件
                                        <i class="murphy icon-jiantou-you ml-[-2px]" style="font-size: 13px"></i>
                                    </span>

                                </div>
                                <div class="text-base font-medium ellipsis">
                                    {{ item.conflict_type === 'pp' ? item.project_license_b :
                                        item.conflict_type === 'cc' ? item.comp_license_b : (item.comp_license_a||item.comp_license_b) }}
                                </div>
                            </div>
                        </div>

                        <div class="mb-6 text-sm text-3c">
                            <div class="mb-2 font-medium">风险说明</div>
                            <div>{{ item.conflict_desc || '-' }}</div>
                        </div>
                        <div class="text-sm text-3c">
                            <div class="mb-2 font-medium">处置方案</div>
                            <div>{{ item.suggestion || '-' }}</div>
                        </div>
                    </div>

                </div>

                <NoData v-if="!filteredLicenseList.length" description="暂无数据" />
            </div>
        </div>

        <div v-else class="flex flex-col items-center my-20">
            <NoData description="暂无风险信息" />
            <p class="text-sm text-85 font-normal mt-[-12px]">本次检测结果未识别到许可证冲突与兼容性风险信息</p>
        </div>
    </div>

    <LicenseInfoModal v-model="isShowLicenseInfo" :licenseCompList="licenseCompList" :licenseName="licenseName" :licenseRisk="licenseRisk"
                      :licenseDesc="licenseDesc" v-if="isShowLicenseInfo" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { getLicenseConflictListApi, getDetailLicenseCompListApi, getDetailLicenseListApi } from '@/api/project';
import LicenseInfoModal from './LicenseInfoModal.vue';

const licenseList = ref<any[]>([]);
const keyword = ref('');
const route = useRoute();

const isShowLicenseInfo = ref<boolean>(false);
const licenseName = ref<string>('');
const licenseRisk = ref<string>('');
const licenseDesc = ref<string>('');
const licenseCompList = ref<Array<any>>([]);
const loading = ref(false);

// 获取许可证涉及组件
const getLicCompList = async (item: any) => {
    loading.value = true;
    try {
        const { data: data1 } = await getDetailLicenseListApi({
            subtask_id: route.params.sid,
            project_id: route.params.tid,
            page: undefined,
            limit: undefined,
        });
        const licenseInfo = data1.list?.find((ele:any) => ele.spdx === item) || {};

        const { data } = await getDetailLicenseCompListApi({
            subtask_id: route.params.sid,
            project_id: route.params.tid,
            comp_string_list: licenseInfo.comp_string_list,
        });

        licenseDesc.value = licenseInfo.license_desc;
        licenseName.value = licenseInfo.spdx;
        licenseRisk.value = licenseInfo.level;

        // eslint-disable-next-line no-return-assign
        licenseCompList.value = Array.isArray(data) ? data?.map((ele:any) => ({
            ...ele,
            level: licenseInfo.level,
        })) : [];
        isShowLicenseInfo.value = true;
        loading.value = false;
    } catch (error) {
        loading.value = false;
        console.log(error);
    }
};

const filteredLicenseList = computed(() => {
    let result = licenseList.value;
    if (keyword.value) {
        result = result.filter((item) => item.title.toLowerCase().includes(keyword.value.toLowerCase()));
    }
    // 按照许可证名称首字母排序
    return result.sort((a, b) => {
        // 提取许可证名称（通常是第二个空格后的第一个单词）
        const getFirstLicenseName = (title:string) => {
            const parts = title.split(' ');
            // 找到第一个可能是许可证名称的部分
            for (let i = 1; i < parts.length; i++) {
                if (parts[i] && parts[i] !== '与' && parts[i] !== '冲突' && parts[i] !== '不兼容') {
                    return parts[i];
                }
            }
            return title;
        };

        const licenseA = getFirstLicenseName(a.title);
        const licenseB = getFirstLicenseName(b.title);

        return licenseA.localeCompare(licenseB, 'zh-CN');
    });
});

const formatLicenseTitle = (item:any) => {
    const conflictTypeMap:any = {
        pp: '项目许可证',
        cc: '组件许可证',
        pc: '项目许可证',
    };

    if (item.conflict_type === 'pp') {
        return `${conflictTypeMap[item.conflict_type]} ${item.project_license_a} 与 ${item.project_license_b} ${item.compatible_type === 'conflict' ? '冲突' : '不兼容'}`;
    } if (item.conflict_type === 'cc') {
        return `${conflictTypeMap[item.conflict_type]} ${item.comp_license_a} 与 ${item.comp_license_b} ${item.compatible_type === 'conflict' ? '冲突' : '不兼容'}`;
    }
    return `${conflictTypeMap[item.conflict_type]} ${item.project_license_a} 与组件许可证 ${item.comp_license_a || item.comp_license_b} ${item.compatible_type === 'conflict' ? '冲突' : '不兼容'}`;
};

const initLicenseList = async () => {
    loading.value = true;
    try {
        const { data } = await getLicenseConflictListApi({
            subtask_id: route.params.sid as string,
            project_id: route.params.tid as string,
        });
        if (data?.list?.length) {
            licenseList.value = data.list.map((item:any) => ({
                title: formatLicenseTitle(item),
                expand: false,
                ...item,
            }));
        }
        loading.value = false;
    } catch (error) {
        loading.value = false;
        console.error('获取许可证冲突列表失败:', error);
    }
};

initLicenseList();

</script>

<style lang="less">
.license-list .ExpandIcon i {
    color: #858585 !important;
    font-weight: 400 !important;
}
</style>
