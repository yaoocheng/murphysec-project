<template>
    <el-dialog width="calc(100% - 80px)" class="more_modal" @close="emits('update:modelValue', false)" align-center
               title="更多匹配结果">
        <div class="mt-5">
            <div class="mb-6">
                <SearchComp v-model="filters.keyword" style="width: 240px;" clearable placeholder="请搜索开源项目名称/文件名称" />
                <SelectComp style="width: 160px" v-model="filters.license_level" clearable placeholder="许可证风险等级"
                            :options="snipLcenseLevelOption" />
            </div>

            <div class="text-85 mb-3">
                <span>共匹配到 <span class="g-color-1">{{ moreMatchFileList.length }}</span> 个来源</span>
            </div>

            <div v-loading="loading" style="height: calc(100vh - 320px);" class="overflow-auto">
                <el-radio-group v-if="moreMatchFileList.length > 0" v-model="matchRaido" @change="changeRadio"
                                class="radio_label flex flex-col">
                    <el-radio v-for="(item, i) in moreMatchFileList" :key="i" class="mr-0 mb-0" :value="item.key"
                              size="large">
                        <div style="border-bottom: 1px solid #2A2B321A; padding-bottom: 16px;"
                             class="mb-3 cursor-pointer ml-2 rounded-md">
                            <div v-if="item.notice?.contain_higher_license"
                                 class="rounded-md text-xs text-[#DE7802] bg-[#FF994026] p-2">
                                <i class="murphy icon-icon_warning_outlined align-[-1px]" style="font-size: 14px;"></i>
                                此备选结果的许可证风险较高，可能涉及更严格的合规要求，请重点核实是否来自该项目
                            </div>
                            <div v-if="item.notice?.in_white"
                                 class="rounded-md text-xs text-[#DE7802] bg-[#FF994026] p-2">
                                <i class="murphy icon-icon_warning_outlined align-[-1px]" style="font-size: 14px;"></i>
                                <span>此备选结果可能来自常见的开源组件项目，通常是代码文件或片段的原始来源。请重点核实是否来自该项目</span>
                            </div>
                            <div v-if="item.notice?.in_white && item.notice?.contain_higher_license"
                                 class="rounded-md text-xs text-[#DE7802] bg-[#FF994026] p-2">
                                <i class="murphy icon-icon_warning_outlined align-[-1px]" style="font-size: 14px;"></i>
                                <span>此备选结果的许可证风险较高，可能涉及更严格的合规要求，并可能来自常见的开源组件项目，请重点核实是否来自该项目</span>
                            </div>

                            <div class="flex items-center mt-2">
                                <span @click.stop="expandCodeHandle(item)" class="w-4 mr-2">
                                    <ExpandIcon :expand="item.expand" type="r" />
                                </span>
                                <div class="flex-1 box-border text-3c">
                                    <div class="text-sm flex items-center mb-2 font-medium">
                                        <img class="w-5 mr-1" src="@/assets/logos/github.png" alt="">
                                        <!-- <i class="murphy icon-wenjianjia folder"></i> -->

                                        <a :href="`https://github.com/${item.target_project_name}/blob/${item.version}/${item.path}`"
                                           target="_blank">
                                            <span
                                                class="flex-1 w-0 ellipsis text-3c hover:text-primary hover:underline">{{
                                                item.target_project_name }}</span>
                                        </a>

                                        <!-- <a @click.stop href="" class="text-3c hover:text-primary hover:underline"
                                            target="_blank">{{
                                                item.target_project_name }}</a> -->
                                        <TagComp class="font-normal ml-2" :content="item.version" />
                                        <Tooltip width="400"
                                                 content="取开源项目许可证及开源文件许可证中最高的许可证风险等级进行展示">
                                            <!-- <TagComp class="ml-1 font-normal"
                                                :content="`${licenseOption.find(ele => ele.value === item.spdx_level)?.label}风险许可证`"
                                                :c="`${licenseOption.find(ele => ele.value === item.spdx_level)?.c}`"
                                                :bgc="`${licenseOption.find(ele => ele.value === item.spdx_level)?.bg}`" /> -->

                                            <TagComp v-if="item.spdx_level" class="ml-1 font-normal"
                                                     :content="`${licenseOptionLower.find(ele => ele.value === item.spdx_level)?.label}风险许可证`"
                                                     :c="`${licenseOptionLower.find(ele => ele.value === item.spdx_level)?.c}`"
                                                     :bgc="`${licenseOptionLower.find(ele => ele.value === item.spdx_level)?.bg}`" />
                                        </Tooltip>
                                    </div>

                                    <div class="text-[#8F959E] text-xs flex items-center font-normal">
                                        <span class="mr-4 w-[342px] ellipsis">
                                            文件路径：<span class="text-3c text-sm">{{
                                                item.path
                                            }}</span>
                                        </span>
                                        <span @click="itemLicense = item; moreLicenseModal = true"
                                              class="mr-4 w-[252px] ellipsis">
                                            文件许可证：
                                            <!-- <el-tooltip :disabled="!item.spdx_id?.length" placement="top">
                                                <template #content>
                                                    <div v-for="ele in item.spdx_id" :key="ele.name">
                                                        {{ ele.name }}
                                                    </div>
                                                </template>
<span class="text-3c text-sm">
    <span v-for="(ele, i) in item.spdx_id" :key="ele.name">{{ ele.name
        }}<span v-if="i !== item.spdx_id?.length - 1">、</span>
    </span>
    <span v-if="!item.spdx_id?.length">-</span>
</span>
</el-tooltip> -->
                                            <Tooltip :disabled="!item.spdx_id?.length" content="更多开源文件许可证信息">
                                                <span class="text-3c text-sm">
                                                    <span v-for="(ele, i) in item.spdx_id" :key="ele.name">{{ ele.name
                                                    }}<span v-if="i !== item.spdx_id?.length - 1">、</span>
                                                    </span>
                                                    <span v-if="!item.spdx_id?.length">-</span>
                                                </span>
                                            </Tooltip>
                                        </span>
                                        <span @click="itemLicense = item; moreLicenseModal1 = true"
                                              class="mr-4 w-[252px] ellipsis flex items-center">
                                            项目许可证：
                                            <!-- <el-tooltip placement="top">
                                                <template #content>
                                                    <div v-for="ele in item.target_project_spdx" :key="ele.name">
                                                        {{ ele.name }}
                                                    </div>
                                                </template>
                                                <span class="text-3c text-sm">
                                                    <span v-for="(ele, i) in item.target_project_spdx"
                                                        :key="ele.name">{{ ele.name
                                                        }}<span
                                                            v-if="i !== item.target_project_spdx.length - 1">、</span></span>
                                                </span>
                                            </el-tooltip> -->
                                            <Tooltip :disabled="!item.target_project_spdx?.length"
                                                     content="更多开源文件许可证信息">
                                                <!-- <span class="text-3c text-sm"> -->
                                                <span class="button-text-blue">
                                                    <span v-for="(ele, i) in item.target_project_spdx"
                                                          :key="ele.name">{{ ele.name
                                                          }}<span
                                                              v-if="i !== item.target_project_spdx?.length - 1">、</span>
                                                    </span>
                                                    <span v-if="!item.target_project_spdx?.length">-</span>
                                                </span>
                                            </Tooltip>
                                        </span>
                                        <span class="ellipsis">
                                            片段匹配相似度：<span class="text-3c text-sm">{{ item.similarity * 100 }}%</span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div v-if="item.expand" @click.stop class="h-[400px] overflow-auto mt-2 bg-ff">
                                <MoreMatchCode :codeArr="item.code"
                                               :itemHighLightCodeList="item.code_list?.filter(_ => _.source_id)"
                                               v-if="item.code" />

                                <div v-if="item.errorCode" class="p-4 box-border h-full overflow-auto text-3c">
                                    <div class="mb-3">暂未获取到详细的文件内容</div>
                                    <div v-for="(ele, i) in item.code_list?.filter((_) => _.source_id)" :key="i"
                                         class="mb-2 rounded-md px-4 py-2 bg-f7">
                                        片段行号：{{ ele.first_line_range }} - {{ ele.last_line_range }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-radio>
                </el-radio-group>

                <NoData v-else />
            </div>

            <MoreFileLicModal v-model="moreLicenseModal" v-if="moreLicenseModal" :tfid="itemLicense.target_project_id"
                              :itemLicense="itemLicense.spdx_id" />

            <MoreLicenseModal v-model="moreLicenseModal1" v-if="moreLicenseModal1" :projectItemInfo="itemLicense" />
        </div>

        <template #footer>
            <el-button @click="emits('update:modelValue', false)" class="minor_white_btn h-8 w-20">取消</el-button>

            <Tooltip :disabled="!temporaryStorageComp.length && !temporaryStorageUseComp.length > 0"
                     content="当前正在进行「组件校准」或「组件用法校准」,请先提交组件校准或组件用法校准的数据后再进行「同源性分析来源校准」" width="328">
                <el-button :disabled="temporaryStorageComp.length > 0 || temporaryStorageUseComp.length > 0"
                           @click="localStorageUtil" class="w-20">暂存</el-button>
            </Tooltip>
        </template>
    </el-dialog>
</template>

<script setup>
import {
    ref, onMounted, watch, onUnmounted,
} from 'vue';
import { useRoute } from 'vue-router';
import { getMoreMatchFileApi, getOpenProCodeApi } from 'api/detail';
import store from '@/utils/store';
import {
    moreMatchFileList, midInfo, temporaryStorageSnip, projectItemInfo, licenseOptionLower,
} from './business';
import { temporaryStorageComp } from '../../business';
import { snipLcenseLevelOption } from '../../constants/constants';
import { temporaryStorageUseComp } from '../comp_use/business';
import MoreMatchCode from './MoreMatchCode.vue';
import MoreFileLicModal from './MoreFileLicModal.vue';
import MoreLicenseModal from './MoreLicenseModal.vue';

const route = useRoute();
const emits = defineEmits(['update:modelValue']);
const matchRaido = ref();
const moreLicenseModal = ref(false);
const moreLicenseModal1 = ref(false);
const itemLicense = ref({});
const cacheData = ref([]);
const filters = ref({
    keyword: '',
    license_level: undefined,
});
const loading = ref(false);

// expand get code
const expandCodeHandle = async (item) => {
    if (item.errorCode) {
        item.expand = !item.expand;
    } else if (!item.code) {
        loading.value = true;
        try {
            const { data } = await getOpenProCodeApi(item.file_sha256, store.conf.storage_domain);
            item.code = data?.split(/\n/);
            item.expand = true;
            loading.value = false;
        } catch (error) {
            item.expand = true;
            item.errorCode = true;
            loading.value = false;

            console.log(error);
        }
    } else {
        item.expand = !item.expand;
    }
};

const changeRadio = (val) => {
    midInfo.value.new_match = moreMatchFileList.value.find((item) => item.key === val);

    if (midInfo.value.data_type === 'fragmented') {
        [midInfo.value.new_match.target_fragmented] = midInfo.value.new_match.code_list;
    }
};

const sort = (list) => {
    // eslint-disable-next-line array-callback-return
    list.value.sort((a, b) => {
        if (a.target_project_name > b.target_project_name) return -1;
    });

    // eslint-disable-next-line array-callback-return
    list.value.sort((a, b) => {
        if (a.similarity < b.similarity) return -1;
    });

    const filterTip1 = list.value.filter((item) => item.notice?.contain_higher_license || item.notice?.in_white);

    const filterTip2 = list.value.filter((item) => !item.notice?.contain_higher_license && !item.notice?.in_white);

    list.value = [...filterTip1, ...filterTip2];
};

onMounted(async () => {
    try {
        const { data } = await getMoreMatchFileApi({
            subtask_id: route.params.sid,
            source_file_id: midInfo.value.source_file_id,
            source_id: midInfo.value.source_fragmented?.source_id,
            target_project_id: projectItemInfo.value.target_project_id,
        });
        moreMatchFileList.value = data.data.map((item) => ({
            key: item.target_project_id + item.version + item.path,
            ...item,
        }));

        sort(moreMatchFileList);

        cacheData.value = [...moreMatchFileList.value];

        // 购物车回来
        if (midInfo.value.new_match) {
            matchRaido.value = midInfo.value.new_match.key;
            changeRadio(midInfo.value.new_match.key);
        } else {
            // 首次进来
            try {
                // const res = await getOpenProCodeApi(moreMatchFileList.value[0]?.file_sha256);
                // moreMatchFileList.value[0].code = res.data.split(/\n/);
                // moreMatchFileList.value[0].expand = true;

                matchRaido.value = moreMatchFileList.value[0].key;
                changeRadio(moreMatchFileList.value[0].key);
            } catch (error) {
                // moreMatchFileList.value[0].errorCode = true;
                console.log(error);
            }
        }
    } catch (error) {
        console.log(error);
    }
    // 过滤出匹配的片段
    // if (midInfo.value.data_type === 'fragmented') {
    //     moreMatchFileList.value.forEach((item) => {
    //         const findI = item.code_list.findIndex((ele) => ele.source_id === fragCodeMatchFileId.value);
    //         if (findI !== -1) {
    //             item.code_list = [item.code_list[findI]];
    //         }
    //     });
    // }
});

const localStorageUtil = () => {
    const resultObj = JSON.parse(JSON.stringify(midInfo.value));
    const findExitIndex = temporaryStorageSnip.findIndex((item) => resultObj.source_file_id === item.source_file_id);

    resultObj.old_match.code = resultObj.old_match?.code && undefined;
    resultObj.new_match.code = resultObj.new_match?.code && undefined;

    if (findExitIndex !== -1) {
        temporaryStorageSnip.splice(findExitIndex, 1, resultObj);
    } else {
        temporaryStorageSnip.push(resultObj);
    }
    emits('update:modelValue', false);
};

watch(filters.value, (newVal) => {
    moreMatchFileList.value = cacheData.value.filter((item) => item.target_project_name.includes(newVal.keyword) || item.path.includes(newVal.keyword));

    if (newVal.license_level) {
        moreMatchFileList.value = moreMatchFileList.value.filter((item) => item.spdx_level === newVal.license_level);
    }
});

onUnmounted(() => {
    midInfo.value.new_match = undefined;
});
</script>

<style lang="less">
.more_modal {
    .el-dialog__header {
        padding-bottom: 0 !important;
    }
}

.radio_label .el-radio {
    height: auto !important;
    width: 100%;
}

// .radio_label {

//     .el-radio__input {
//         margin-top: 50px
//     }
//     align-items: flex-start !important;
// }
.radio_label .el-radio__label {
    flex: 1;
}
</style>
