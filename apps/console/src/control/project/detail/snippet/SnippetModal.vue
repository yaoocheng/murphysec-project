<template>
    <el-dialog class="screen-dialog p-0" @close="emits('update')" width="100%">
        <div class="px-[120px] pt-8 text-3c  h-[154px] box-border">
            <div class="font-semibold text-2xl mb-4 flex items-center">
                <img class="w-8 mr-2" src="@/assets/logos/github.png" alt="">
                {{ projectItemInfo.target_project_name }}
                <TagComp class="ml-2 font-normal" c="#fff"
                         :bgc="licenseOption.find(ele => ele.value === projectItemInfo.level)?.c"
                         :content="`${licenseOption.find(ele => ele.value === projectItemInfo.level)?.label}风险许可证`" />
            </div>

            <div class="rounded-md bg-f7 px-4 py-3 flex justify-between items-center">
                <div class="flex-1 mr-4">
                    版本：{{ projectItemInfo.version }}
                    <el-popover placement="bottom" :width="420" trigger="hover">
                        <div class="w-[372px] p-4 box-border font-medium">
                            <div class="text-base mb-6">
                                项目版本计算规则
                            </div>
                            <div class="text-sm mb-2">
                                当前应用版本
                            </div>
                            <div class="font-normal mb-6">
                                {{ projectItemInfo.version }}

                                <Tooltip placement="right" width="200" content="应用该开源项目中匹配到的开源文件中占比最多的版本，占比一致时取最新版本">
                                    <i class="murphy icon-wenhaoxiao g-f-13 g-color-3 g-fw-400"></i>
                                </Tooltip>
                            </div>
                            <div class="text-sm mb-2">
                                版本 TOP5
                            </div>
                            <div class="bg-[#EBEBEB80] rounded-md px-4 py-3 font-normal">
                                <div class="mb-3">
                                    <div>{{ projectItemInfo.version_list?.[0]?.version || '-' }}</div>
                                    <div class="flex text-xs">
                                        <el-progress :show-text="false" class="flex-1 mr-1" :percentage="percentagehan(projectItemInfo.version_list, 0)" />
                                        {{ projectItemInfo.version_list?.[0]?.source_file_num || 0 }}个
                                    </div>
                                </div>

                                <div class="flex mb-3">
                                    <div class="flex-1 mr-6">
                                        <div>{{ projectItemInfo.version_list?.[1]?.version || '-' }}</div>
                                        <div class="flex text-xs">
                                            <el-progress :show-text="false" class="flex-1 mr-1" :percentage="percentagehan(projectItemInfo.version_list, 1)" />
                                            {{ projectItemInfo.version_list?.[1]?.source_file_num || 0 }}个
                                        </div>
                                    </div>
                                    <div class="flex-1">
                                        <div>{{ projectItemInfo.version_list?.[2]?.version || '-' }}</div>
                                        <div class="flex text-xs">
                                            <el-progress :show-text="false" class="flex-1 mr-1" :percentage="percentagehan(projectItemInfo.version_list, 2)" />
                                            {{ projectItemInfo.version_list?.[2]?.source_file_num || 0 }}个
                                        </div>
                                    </div>
                                </div>

                                <div class="flex">
                                    <div class="flex-1 mr-6">
                                        <div>{{ projectItemInfo.version_list?.[3]?.version || '-' }}</div>
                                        <div class="flex text-xs">
                                            <el-progress :show-text="false" class="flex-1 mr-1" :percentage="percentagehan(projectItemInfo.version_list, 3)" />
                                            {{ projectItemInfo.version_list?.[3]?.source_file_num || 0 }}个
                                        </div>
                                    </div>
                                    <div class="flex-1">
                                        <div>{{ projectItemInfo.version_list?.[4]?.version || '-' }}</div>
                                        <div class="flex text-xs">
                                            <el-progress :show-text="false" class="flex-1 mr-1" :percentage="percentagehan(projectItemInfo.version_list, 4)" />
                                            {{ projectItemInfo.version_list?.[4]?.source_file_num || 0 }}个
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <template #reference>
                            <i class="murphy icon-wenhaoxiao g-f-14 g-color-3 g-fw-400"></i>
                        </template>
                    </el-popover>
                </div>
                <div class="ellipsis flex-1 mr-4">
                    项目地址：<a target="_blank" :href="projectItemInfo.target_project_url"
                            class="text-primary hover:underline cursor-pointer">{{ projectItemInfo.target_project_url }}</a>
                </div>
                <div class="ellipsis flex-1 flex items-center">
                    项目许可证：
                    <Tooltip content="更多项目许可证信息">
                        <!-- <span @click="moreLicenseModal = true" class="text-primary cursor-pointer"> -->
                        <span @click="moreLicenseModal = true" class="button-text-blue">
                            <span v-for="(item, i) in projectItemInfo.target_project_license_list" :key="item.name">
                                {{ item.name }}<span
                                    v-if="i !== projectItemInfo.target_project_license_list.length - 1">、</span>
                            </span>
                        </span>
                    </Tooltip>
                </div>
            </div>
        </div>

        <div style="height: calc(100% - 154px);" class="bg-f7 px-[120px] py-4 box-border">
            <div class="h-full flex items-center">
                <!-- list -->
                <div class="bg-ff h-full rounded-md flex flex-col mr-1.5">
                    <div class="p-4 pb-2 flex justify-between text-85" style="border-bottom: 1px solid #0000000d;">
                        <div>
                            <span class="text-3c font-semibold mr-1">检测项目文件</span>
                            <TipsComp content="在被检测项目中匹配到了开源项目文件的全部文件" />
                        </div>

                        <el-popover placement="bottom" :width="372" trigger="click">
                            <div class="p-3 pb-0">
                                <div class="mb-4" v-for="item in filterList" :key="item.title">
                                    <div class="font-medium mb-1">{{ item.title }}</div>
                                    <div>
                                        <el-checkbox @change="changeFilter(ele)" v-model="ele.value"
                                                     v-for="(ele, i) in item.checks" :key="i" :label="ele.name" />
                                    </div>
                                </div>
                            </div>

                            <template #reference>
                                <span class="cursor-pointer flex items-center">
                                    <div class="button-text-blue gap-0">
                                        <i class="murphy icon-lujing2 mr-1.5" style="font-size: 14px;"></i>
                                        筛选
                                    </div>
                                    <div class="ml-1">
                                        <span v-if="filterNum > 0"
                                              class="rounded-[12px] bg-[#F34D3D] py-0 px-1 text-ff text-xs">{{ filterNum
                                              }}</span>
                                    </div>
                                </span>
                            </template>
                        </el-popover>
                    </div>

                    <div class="w-[280px] flex-1 pl-4 pr-4 overflow-auto" style="border-bottom: 1px solid #0000000d;">
                        <div class="text-85 mt-2 text-xs mb-2">
                            共 <span class="font-medium text-3c">{{ listData.length }}</span> 条数据
                        </div>

                        <div @click="clickItemhandle(item); activeItem = index" v-for="(item, index) in listData"
                             :key="item.name" :class="{ 'bg-[#6C87FF1A]': activeItem === index }"
                             class="rounded hover:bg-[#f2f2f2] cursor-pointer p-2 h-[48px] mb-[9px] box-border flex items-center">
                            <el-checkbox @change="checkItem" @click.stop v-model="item.check" />
                            <div :class="{ 'text-primary': item.check }" class="ml-3 flex-1 ellipsis leading-[24px]">
                                {{ item.file_path }}
                            </div>
                            <ConfirmStatus :status="item.confirm_status" :high_recommend="item.high_recommend" />
                        </div>

                        <NoData :image-size="100" v-if="!listData.length" />
                    </div>

                    <div v-if="!$route.fullPath.includes('share-report')" class="h-12 px-4 flex items-center justify-between">
                        <div>
                            <el-checkbox v-model="checkAll" @change="selectAllHandle" label="全选"
                                         :indeterminate="isIndeterminate" />
                            <span class="align-[2px] ml-2 font-medium">{{ listData.filter((item) => item.check)?.length
                            }}</span>
                        </div>
                        <el-button @click="statusModal = true" class="h-7 text-xs minor_btn w-auto">
                            批量修改状态
                        </el-button>
                    </div>
                </div>

                <!-- code -->
                <div class="flex-1 h-full rounded-md bg-ff p-4 box-border">
                    <!-- head -->
                    <div class="flex items-center justify-between mb-3">
                        <div>
                            <div class="flex items-center mb-1.5">
                                <Tooltip width="400" :content="`文件 ${midInfo.file_path} 的匹配详情`">
                                    <span class="font-medium max-w-[300px] ellipsis">文件 {{ midInfo.file_path }}
                                        的匹配详情</span>
                                </Tooltip>
                                <TagComp class="ml-2" :content="`${midInfo.data_type === 'file' ? '文件精准匹配' : '代码片段匹配'}`"
                                         c="#646A73" bgc="#1F23291A" />
                                <Tooltip width="400"
                                         content="根据该“检测项目文件”中“匹配开源文件”的最高许可证的风险等级进行展示">
                                    <TagComp class="ml-1"
                                             :content="`许可证风险等级：${licenseOptionLower.find(item => item.value === midInfo.license_level)?.label}`"
                                             :c="`${licenseOptionLower.find(item => item.value === midInfo.license_level)?.c}`"
                                             :bgc="`${licenseOptionLower.find(item => item.value === midInfo.license_level)?.bg}`" />
                                </Tooltip>

                                <ConfirmStatus :status="midInfo.confirm_status"
                                               :high_recommend="midInfo.high_recommend" />
                            </div>
                            <div class="text-xs font-normal text-85">
                                <span v-if="midInfo.data_type !== 'file'" class="mr-4">片段匹配数：{{
                                    midInfo.code_list?.length
                                }}</span>
                                <span>文件相似度：{{ (midInfo.similarity * 100).toFixed(2) }}%</span>
                            </div>
                        </div>

                        <div v-if="!$route.fullPath.includes('share-report')">
                            <el-button :class="{ 'disabled': midInfo.confirm_status !== 2 }"
                                       :disabled="midInfo.confirm_status !== 2" v-if="midInfo.data_type === 'file'"
                                       @click="[midInfo.old_match] = matchFileList; moreModal = true"
                                       class="minor_btn w-auto h-8">更多匹配结果</el-button>

                            <el-popover ref="popRef" placement="bottom-end" trigger="click" :hide-after="0">
                                <div @click.stop="changeFragStatus(item.value)"
                                     class="px-4 py-2 cursor-pointer hover:bg-eb rounded-md"
                                     v-for="item in changeStatusOption" :key="item.value">
                                    {{ item.label }}
                                </div>
                                <template #reference>
                                    <el-button  class="minor_btn font-normal h-8 w-auto">
                                        {{ changeStatusOption.find(item => item.value === midInfo.confirm_status)?.label
                                        }} <i class="murphy icon-arrow" style="font-size: 12px;"></i>
                                    </el-button>
                                </template>
                            </el-popover>
                        </div>
                    </div>

                    <!-- code -->
                    <div v-loading="loading" class="flex" style="height: calc(100% - 56px);">
                        <FileCode />
                        <MatchFile v-if="matchFileList.length > 0" />
                    </div>
                </div>
            </div>
        </div>

        <ChangeStatusModal v-model="statusModal" @updateHandle="updateHandle" />

        <MoreLicenseModal v-model="moreLicenseModal" v-if="moreLicenseModal" :projectItemInfo="projectItemInfo" />

        <MoreMatchFile v-if="moreModal" v-model="moreModal" />

    </el-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import {
    changeSnippetStatusApi, getProjectFileListApi, getMatchFileListApi, getProjectFileCodeApi,
} from 'api/detail';
import { showMessage } from 'util/tools';
import {
    projectFileFilter, midHighLightList, fragCodeMatchFileId, loading, licenseOptionLower,
    changeStatusOption, licenseOption, matchFileList, fileCode, midInfo, projectItemInfo,
} from './business';
import ChangeStatusModal from './ChangeStatusModal.vue';
import FileCode from './FileCode.vue';
import ConfirmStatus from './ConfirmStatus.vue';
import MatchFile from './MatchFile.vue';
import MoreLicenseModal from './MoreLicenseModal.vue';
import TipsComp from '@/components/TipsComp.vue';
import MoreMatchFile from './MoreMatchFile.vue';
import TagComp from '@/components/TagComp.vue';

const emits = defineEmits(['update']);
const moreModal = ref(false);
const route = useRoute();
const filterList = ref(projectFileFilter());
const popRef = ref();
const statusModal = ref(false);
const moreLicenseModal = ref(false);
const isIndeterminate = ref(false);
const checkAll = ref(false);
const listData = ref([]);
const cacheData = ref([]);
const activeItem = ref(0);
const filterNum = ref(0);

const percentagehan = (list, index) => {
    let total = 0;
    list.forEach((ele) => {
        total += ele.source_file_num;
    });
    // eslint-disable-next-line no-unsafe-optional-chaining
    return ((list[index]?.source_file_num / total) * 100).toFixed(2);
};

const getLeftData = async () => {
    try {
        const { data } = await getProjectFileListApi({
            project_id: route.params.tid,
            subtask_id: route.params.sid,
            target_project_id: projectItemInfo.value.target_project_id,
        });
        listData.value = data;
        cacheData.value = [...data];
        // eslint-disable-next-line no-use-before-define
        clickItemhandle(listData.value[0]);
    } catch (error) {
        console.log(error);
    }
};
getLeftData();

const checkItem = () => {
    const checkNum = listData.value.filter((item) => item.check).length;
    isIndeterminate.value = checkNum > 0 && checkNum < listData.value.length;
    checkAll.value = checkNum === listData.value.length;
};

// 多选
const selectAllHandle = (val) => {
    listData.value.forEach((item) => {
        item.check = val;
    });
};

// 获取代码
const getMidCode = async (item) => {
    try {
        const { data } = await getProjectFileCodeApi({
            project_id: route.params.tid,
            subtask_id: route.params.sid,
            source_file_id: item.source_file_id,
        });
        fileCode.value = data.source_text;
        if (!fileCode.value) {
            // eslint-disable-next-line array-callback-return
            midHighLightList.value.sort((a, b) => {
                if (a.first_line_range < b.first_line_range) return -1;
            });
        }
    } catch (error) {
        console.log(error);
    }
};

// 获取匹配文件列表
const getMatchFile = async (item) => {
    try {
        const { data } = await getMatchFileListApi({
            project_id: route.params.tid,
            subtask_id: route.params.sid,
            source_file_id: item.source_file_id,
            target_project_id: projectItemInfo.value.target_project_id,
        });
        matchFileList.value = data.data || [];
    } catch (error) {
        console.log(error);
    }
};

// 点击
const clickItemhandle = (item) => {
    midInfo.value = item;
    midHighLightList.value = item.code_list?.filter((_) => _.source_id);
    fragCodeMatchFileId.value = '';
    getMidCode(item);
    getMatchFile(item);
};

// 更改状态
const updateHandle = async (status, singleList) => {
    try {
        await changeSnippetStatusApi({
            project_id: route.params.tid,
            subtask_id: route.params.sid,
            source_file_id: singleList || listData.value.filter((item) => item.check).map((item) => item.source_file_id),
            confirm_status: status,
        });
        isIndeterminate.value = false;
        checkAll.value = false;
        showMessage('修改成功', 'success');
        if (!singleList) {
            getLeftData();
        }
    } catch (error) {
        console.log(error);
    }
};

// 单个文件状态
const changeFragStatus = (value) => {
    popRef.value.hide();
    midInfo.value.confirm_status = value;
    // eslint-disable-next-line no-return-assign
    midHighLightList.value.forEach((item) => item.confirm_status = value);

    updateHandle(value, [midInfo.value.source_file_id]);
};

// 筛选
// const changeFilter = (ele) => {
//     // eslint-disable-next-line no-unused-expressions
//     ele.value ? filterNum.value++ : filterNum.value--;

// if (ele.flag === 1 && ele.value) {
//     if (! fil fileTypes.includes('file')) {
//         fileTypes.push('file');
//     }
// }

// filterList.value.forEach((item) => {
//     item.checks.forEach((a) => {
//         if (a.flag === 1 && a.value) {
//             if (!fileTypes.includes('file')) {
//                 fileTypes.push('file');
//             }
//         }
//         if (a.flag === 2 && a.value) {
//             if (!fileTypes.includes('fragmented')) {
//                 fileTypes.push('fragmented');
//             }
//         }
//         console.log(fileTypes);

//         if (fileTypes.length && (a.flag === 1 || a.flag === 2)) {
//             filList.value = filList.value.filter((_a) => fileTypes.includes(_a.data_type));
//             console.log(filList.value);
//         }
//         console.log(filList.value);

//         if (a.flag === 3 && a.value) {
//             confirms.push(2);
//             if (!confirms.includes(2)) {
//                 confirms.push(2);
//             }
//         }
//         if (a.flag === 4 && a.value) {
//             if (!confirms.includes(3)) {
//                 confirms.push(3);
//             }
//         }
//         if (a.flag === 5 && a.value) {
//             if (!confirms.includes(1)) {
//                 confirms.push(1);
//             }
//         }
//         if (confirms.length && (a.flag === 3 || a.flag === 4 || a.flag === 5)) {
//             filList.value = filList.value.filter((_a) => confirms.includes(_a.confirm_status));
//         }

//         if (a.flag === 6 && a.value) {
//             if (!levels.includes(3)) {
//                 levels.push(3);
//             }
//         }
//         if (a.flag === 7 && a.value) {
//             if (!levels.includes(2)) {
//                 levels.push(2);
//             }
//         }
//         if (a.flag === 8 && a.value) {
//             if (!levels.includes(1)) {
//                 levels.push(1);
//             }
//         }
//         if (levels.length && (a.flag === 6 || a.flag === 7 || a.flag === 8)) {
//             filList.value = filList.value.filter((_a) => levels.includes(_a.level));
//         }
//     });
// });
// };
const changeFilter = (ele) => {
    // 更新筛选条件
    if (ele.value) {
        filterNum.value++;
    } else {
        filterNum.value--;
    }

    // 根据选中的筛选项更新数据
    const fileTypes = [];
    const confirms = [];
    const levels = [];

    // 遍历筛选项
    filterList.value.forEach((item) => {
        item.checks.forEach((a) => {
            // 文件类型筛选
            if (a.flag === 1 && a.value) {
                if (!fileTypes.includes('file')) {
                    fileTypes.push('file');
                }
            }
            if (a.flag === 2 && a.value) {
                if (!fileTypes.includes('fragmented')) {
                    fileTypes.push('fragmented');
                }
            }

            // 状态筛选
            if (a.flag === 3 && a.value) {
                if (!confirms.includes(2)) {
                    confirms.push(2); // 未确认状态
                }
            }
            if (a.flag === 4 && a.value) {
                if (!confirms.includes(3)) {
                    confirms.push(3); // 已确认状态
                }
            }
            if (a.flag === 5 && a.value) {
                if (!confirms.includes(1)) {
                    confirms.push(1); // 待确认状态
                }
            }

            // 风险等级筛选
            if (a.flag === 6 && a.value) {
                if (!levels.includes(4)) {
                    levels.push(4); // 高风险等级
                }
            }
            if (a.flag === 7 && a.value) {
                if (!levels.includes(3)) {
                    levels.push(3); // 中风险等级
                }
            }
            if (a.flag === 8 && a.value) {
                if (!levels.includes(2)) {
                    levels.push(2); // 低风险等级
                }
            }
        });
    });

    // 根据筛选条件过滤数据
    listData.value = cacheData.value.filter((item) => {
        // 文件类型筛选
        if (fileTypes.length && !fileTypes.includes(item.data_type)) {
            return false;
        }

        // 状态筛选
        if (confirms.length && !confirms.includes(item.confirm_status)) {
            return false;
        }

        // 风险等级筛选
        if (levels.length && !levels.includes(item.license_level)) {
            return false;
        }

        return true;
    });
};

</script>

<style lang="less">
.screen-dialog .status-modal {
    .el-dialog__header {
        padding-bottom: 16px !important;
    }
}

.disabled.minor_btn {
    background-color: #fff !important;
    border-color: #C7C7C7 !important;
    color: #C7C7C7 !important;
}
</style>
