<template>
    <div style="height: 70vh; overflow: auto;">

        <div class="g-p-16 g-bg-f7 g-bdr-6 g-mb-24">
            <div class="g-f-14 g-fw-500 g-mb-12">
                基本类型
            </div>
            <div class="part g-flex g-mb-8">
                <div>
                    文件类型：{{ fileDetail?.file_type || fileParams.file_type }}
                </div>
                <div>
                    文件大小：{{ ((fileDetail?.file_size || fileParams.file_size) / 1024).toFixed(0) }}KB
                </div>
                <el-tooltip placement="top-start" :content="fileDetail?.md5|| fileParams.md5">
                    <div>
                        MD5：{{ fileDetail?.md5 || fileParams.md5}}
                    </div>
                </el-tooltip>
            </div>
            <div class="part g-flex g-mb-8">
                <el-tooltip placement="top-start" :content="fileDetail?.sha256|| fileParams.sha256">
                    <div>
                        SHA256：{{ fileDetail?.sha256 || fileParams.sha256 }}
                    </div>
                </el-tooltip>
                <el-tooltip placement="top-start" :content="fileDetail?.sha512||  fileParams.sha512">
                    <div>
                        SHA512：{{ fileDetail?.sha512 ||  fileParams.sha512 }}
                    </div>
                </el-tooltip>
                <el-tooltip placement="top-start" :content="fileDetail?.crc32||  fileParams.crc32">
                    <div>
                        CRC32：{{ fileDetail?.crc32 || fileParams.crc32 }}
                    </div>
                </el-tooltip>
            </div>
            <div class="part g-flex g-mb-8">
                <el-tooltip placement="top-start" :content="fileDetail?.sha1|| fileParams.sha1">
                    <div>
                        SHA1：{{ fileDetail?.sha1 || fileParams.sha1  }}
                    </div>
                </el-tooltip>
            </div>
        </div>

        <span class="file-tab" @click="activeTab = index;activeExpand=[]" :class="{ 'active': activeTab === index }"
            v-for="(item, index) in tabs" :key="item">
            {{ item }}
        </span>

        <div v-if="activeTab === 0">
            <div class="g-pl-16 g-pr-16 g-pt-12 g-pb-12 g-bg-f7 g-bdr-6 g-mb-8">
                <!-- <div>
        <i v-if="!expand" @click="expand = !expand"
            class="murphy icon-youjiantou11 g-cursor-pointer"></i>
        <i v-if="expand" @click="expand = !expand"
            class="murphy icon-xiala1 g-cursor-pointer"></i>
        Optional header
    </div> -->
                <div v-for="(item, i) in fileDetail?.header?.table_content" :key="i"
                    class="g-p-12 g-bg-ff g-bdr-6 g-flex g-mt-8">
                    <div style="width: 40%;">
                        {{ item.key }}
                    </div>
                    <div>
                        {{ item.value }}
                    </div>
                </div>
                <NoData v-if="!fileDetail?.header?.table_content?.length" />
            </div>
        </div>

        <div class="g-bg-f7 g-bdr-6 g-p-16" v-if="activeTab === 1">
            <div v-for="(item, i) in fileDetail?.version?.table_content" :key="i"
                class="g-p-12 g-bg-ff g-bdr-6 g-flex g-mb-8">
                <div style="width: 40%;">
                    {{ item.key }}
                </div>
                <div>
                    {{ item.value }}
                </div>
            </div>
            <NoData v-if="!fileDetail?.version?.table_content?.length" />
        </div>

        <div v-if="activeTab === 2">
            <div class="g-mb-8 g-bdr-6" style="border:1px solid #f4f4f4"
                v-for="(item, i) in fileDetail?.sections?.list_table_content" :key="i">
                <div @click="expandhandle(i)" class="cursor-pointer g-bg-f7 g-p-16 g-bdr-6">
                    <ExpandIcon :type="'r'" :expand="activeExpand.includes(i)" />
                    {{ item.title }}
                </div>
                <div v-if="activeExpand.includes(i)" class="g-flex g-bg-ff g-p-16 g-bdr-6" v-for="(ele, index) in item?.entries" :key="index">
                    <div style="width: 40%;">
                        {{ ele.key }}
                    </div>
                    <div>
                        {{ ele.value }}
                    </div>
                </div>
            </div>
            <NoData v-if="!fileDetail?.sections?.list_table_content?.length" />
        </div>

        <div v-if="activeTab === 3">
            <div class="g-mb-8 g-bdr-6" style="border:1px solid #f4f4f4"
                v-for="(item, i) in fileDetail?.imports?.list_list_content" :key="i">
                <div @click="expandhandle(i)" class="cursor-pointer g-bg-f7 g-p-16 g-bdr-6">
                    <ExpandIcon :type="'r'" :expand="activeExpand.includes(i)" />
                    {{ item.title }}
                </div>
                <div v-if="activeExpand.includes(i)" class="g-flex g-bg-ff g-p-16 g-bdr-6" v-for="(ele, index) in item?.content" :key="index">
                    <div style="width: 40%;">
                        {{ ele }}
                    </div>
                </div>
            </div>
            <NoData v-if="!fileDetail?.imports?.list_list_content?.length" />
        </div>

        <!-- <div v-if="activeTab === 4">
    <div class="g-mb-8 " v-for="(item, i) in fileDetail?.exports?.list_list_content" :key="i">
        <div class="g-bg-f7 g-p-16 g-bdr-6">{{ item.title }}</div>
        <div class="g-flex g-bg-ff g-p-16 g-bdr-6" v-for="(ele, index) in item?.content"
            :key="index">
            <div style="width: 40%;">
                {{ ele }}
            </div>
        </div>
    </div>
    <NoData v-if="!fileDetail?.exports?.list_list_content" />
</div> -->
    </div>
</template>

<script setup lang='ts'>
import store from 'util/store';
import { ref, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import NoData from '@/components/NoData.vue';

const route = useRoute();
const props = defineProps<{ sid: string, reqFunc: Function, fileParams: any }>();
const fileDetail = ref<any>({});
const tabs = ['文件头', '文件版本', '文件块', '文件导入表'];
const activeTab = ref<number>(0);
const activeExpand = ref<number[]>([]);

const expandhandle = (i:number) => {
    if (activeExpand.value.includes(i)) {
        activeExpand.value = activeExpand.value.filter((a) => a !== i);
    } else {
        activeExpand.value.push(i);
    }
};

onBeforeMount(async () => {
    try {
        const { data } = await props.reqFunc({
            team_id: store.teamInfo.team_id,
            subtask_id: props.sid,
            project_id: route.params.tid || undefined,
            ...props.fileParams,
        });
        fileDetail.value = data;
    } catch (error) {
        console.log(error);
    }
});
</script>

<style lang='less' scoped>
.file-tab {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 6px;
    border: 1px solid var(--004, #C7C7C7);
    background: #FFF;
    font-size: 14px;
    .g-color-1();
    margin-right: 12px;
    margin-bottom: 24px;
    cursor: pointer;
}

.file-tab.active {
    .g-color-5();
    border-color: @primary;
    background-color: rgba(108, 135, 255, 0.10);
}

.part div {
    width: 420px;
    .ellipsis();
}
</style>
