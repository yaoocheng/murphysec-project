<template>
    <el-dialog width="1200px" :close-on-click-modal="false">
        <div class="g-f-16 g-color-1 g-mb-8">
            {{ info.name }}
            <span v-if="info.version" class="tag">{{ info.version }}</span>
            <span v-for="item in info?.license?.licenses" :key="item" class="tag">{{ item }}</span>
        </div>
        <div class="g-color-3 g-mb-24">
            项目地址：<a target="_blank" :href="info.url">{{ info.url }}</a>
        </div>

        <div style="height: 400px;overflow: auto;">
            <div class="history_item" v-for="(ele, index) in list" :key="index" style="height: 56px;">
                <div class="td g-mr-12">
                    <span class="g-color-3 g-mr-6">溯源文件：</span>{{ ele.path }}
                </div>
                <span v-if="ele.type === 'file'" class="tag" style="background-color: #4966E633;color: #2946C7;">文件</span>
                <span v-if="ele.type === 'fragmented'" class="tag"
                      style="background-color: #14c0ff33;color: #004761;">片段</span>

                <!-- <div class="td g-mr-12" style="width: 24%;">
                    <span class="g-color-3 g-mr-6">相似代码片段：</span>{{ ele.similar_code_index?.length }}
                </div>

                <div class="td g-mr-12" style="width: 15%;">
                    <span class="g-color-3 g-mr-6">文件相似度：</span>{{ Math.round(ele.file_similarity * 100) }}%
                </div> -->
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang='ts'>
import { ref, onBeforeMount } from 'vue';
import { getSbomSourceApi } from 'api/asset';
import { getFileSourceSimilarCodeApi } from 'api/project';

const props = defineProps(['sbomSourceReqData']);
const info = ref<any>({});
const list = ref<any[]>([]);

onBeforeMount(async () => {
    const { data } = await getSbomSourceApi(props.sbomSourceReqData);
    info.value = data;

    const res = await getFileSourceSimilarCodeApi(props.sbomSourceReqData);
    list.value = res.data;
});
</script>

<style scoped lang='less'>
.history_item {
    display: flex;
    height: 50px;
    align-items: center;
    border-radius: 8px;
    background: var(--gray, #F7F8FB);
    padding: 0 16px;
    box-sizing: border-box;
    margin-bottom: 8px;

    .td {
        .ellipsis();
    }
}
</style>
