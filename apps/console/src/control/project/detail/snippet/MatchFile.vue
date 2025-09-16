<template>
    <div v-loading="loading" class="flex-1 w-0 h-full overflow-auto">
        <div @click.stop="expandCodeHandle(item)" :id="`match_file_${i}`" v-for="(item, i) in matchFileList" :key="i"
            class="mb-3 cursor-pointer  bg-f7 p-4 rounded-md">
            <div class="flex items-center">
                <span class="w-4 mr-2">
                    <ExpandIcon :expand="item.expand" type="r" />
                </span>
                <div class="flex-1 ellipsis">
                    <div @click.stop class="text-sm text-3c mb-2 flex font-medium hover:text-primary hover:underline">
                        <!-- <i class="murphy icon-wenjianjia folder"></i> -->
                        <img class="w-5 mr-1" src="@/assets/fileImg/default_file.svg" alt="">
                        <a class="flex-1 ellipsis" :href="`https://github.com/${projectItemInfo.target_project_name}/blob/${item.version}/${item.path}#L${item.code_list?.find((ele) => ele.source_id === fragCodeMatchFileId)?.first_line_range}`"
                            target="_blank">
                            <span class="flex-1 w-0 ellipsis">{{ item.path }}</span>
                        </a>
                    </div>

                    <div class="text-[#8F959E] text-xs flex">
                        <span class="mr-4 flex-1 ellipsis">
                            版本 <span class="text-3c text-sm">{{ item.version }}</span>
                        </span>
                        <span @click.stop="itemLicense = item; moreLicenseModal = true" class="mr-4 w-0 flex-[2] ellipsis">
                            许可证
                            <Tooltip :disabled="!item.spdx_id?.length" content="更多开源文件许可证信息">
                                <span class="text-sm">
                                    <span class="text-primary " v-for="(ele, i) in item.spdx_id" :key="ele.name">{{
                                        ele.name }}<span v-if="i !== item.spdx_id?.length - 1">、</span>
                                    </span>
                                    <span class="text-3c" v-if="!item.spdx_id?.length">-</span>
                                </span>
                            </Tooltip>
                        </span>
                        <span v-if="midInfo.data_type !== 'file'" class="flex-1">
                            片段数 <span class="text-3c text-sm">{{ item.code_list?.length }}</span>
                        </span>
                    </div>
                </div>
            </div>

            <div @click.stop v-if="item.expand" class="h-[320px] mt-2 bg-ff">
                <MatchCode :codeArr="item.code" :itemHighLightCodeList="item.code_list?.filter((_) => _.source_id)"
                    v-if="item.code" />
                <div v-if="item.errorCode" class="p-4 h-full overflow-auto box-border text-3c">
                    <div class="mb-3">暂未获取到详细的文件内容</div>
                    <div v-for="(ele, i) in item.code_list?.filter((_) => _.source_id)" :key="i"
                        class="mb-2 rounded-md px-4 py-2 bg-f7">
                        片段行号：{{ ele.first_line_range }} - {{ ele.last_line_range }}
                    </div>
                </div>
            </div>
        </div>

        <MoreFileLicModal v-model="moreLicenseModal" v-if="moreLicenseModal" :tfid="itemLicense.target_project_id"
            :itemLicense="itemLicense.spdx_id" />
    </div>
</template>

<script setup>
import { watch, ref } from 'vue';
import { getOpenProCodeApi } from 'api/detail';
import store from '@/utils/store';
import {
    fragCodeMatchFileId, matchFileList, midInfo, projectItemInfo, loading,
} from './business';
import MatchCode from './MatchCode.vue';
import MoreFileLicModal from './MoreFileLicModal.vue';

const moreLicenseModal = ref(false);
const itemLicense = ref({});

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
// if (midInfo.value.data_type === 'file') {
//     expandCodeHandle(matchFileList.value[0]);
// }

// position file list
// if (midInfo.value.data_type === 'fragmented') {
watch(fragCodeMatchFileId, (newVal) => {
    matchFileList.value.forEach(async (item) => {
        const findI = item.code_list.findIndex((ele) => ele.source_id === newVal);
        if (findI !== -1) {
            if (item.errorCode) {
                item.expand = !item.expand;
            } else if (!item.code) {
                loading.value = true;
                try {
                    const { data } = await getOpenProCodeApi(item.file_sha256, store.conf.storage_domain);
                    item.code = data.split(/\n/);
                    item.expand = true;
                    loading.value = false;
                } catch (error) {
                    item.expand = true;
                    item.errorCode = true;
                    loading.value = false;

                    console.log(error);
                }
            } else {
                item.expand = true;
            }
            midInfo.value.old_match = item;
            midInfo.value.old_match.target_fragmented = item.code_list[findI] || {};
        }
    });
});
// }

</script>

<style>
.folder {
    font-size: 12px;
    margin-right: 6px;
    color: #FFCB1F;
}
</style>
