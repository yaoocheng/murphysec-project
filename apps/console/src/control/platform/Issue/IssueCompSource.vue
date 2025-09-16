<template>
    <div class="left_title">
        <div>
            <span></span>
            组件来源
        </div>
    </div>

    <div v-if="info?.comp_info?.module_path?.length"
         class="g-bdr-6 g-p-16 g-bg-f7 g-mb-40 g-align-center g-flex g-justify-between border border-solid border-[#E7E8EB]">
        <div class="g-f-14 g-fw-500 g-color-1 g-mr-16">
            <div class="g-mb-8">由{{ path?.split('/')[path?.split('/').length-1] }}{{ info.comp_info?.is_direct_dependency ?
                '直接引入' : '间接引入' }}</div>
            <div class="g-color-3" style="word-break: break-all;">路径：{{ path }}</div>
        </div>
        <el-button @click="sourceOpenHandle" class="minor_btn" style="height: 32px;">溯源</el-button>
    </div>

    <div v-else class="g-bdr-6 g-p-16 g-bg-f7 g-mb-40 border border-solid border-[#E7E8EB]">
        -
    </div>

    <SbomSourceModal v-model="isShowSourceModal" v-if="isShowSourceModal" :sbomSourceReqData="sbomSourceReqData" />

    <TraceMap v-model="isShowTraceMap" v-if="isShowTraceMap" :graphLoading="graphLoading"  :graph="graph" :curCompInfo="info.comp_info"
              :codeFragment="info?.comp_info?.code_fragment_result" :basisData="basisData" />
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { getSafeQuestionGraphApi, getTraceBasisDataApi } from 'api/project';
import store from 'util/store';
import TraceMap from '../comp/TraceMap.vue';
import SbomSourceModal from '../../project/detail/components/SbomSourceModal.vue';
// import { useRoute, useRouter } from 'vue-router';
// import {  } from 'util/tools';
// import { } from 'api/project';
const { info, securityId } = defineProps(['info', 'securityId']);

const sbomSourceReqData = ref<any>({});
const isShowSourceModal = ref(false);
const isShowTraceMap = ref<boolean>(false);
const graph = ref<any>();
const basisData = ref<any>();
const path = info?.comp_info?.module_path?.[0]?.associated_file_path;
const graphLoading = ref<boolean>(false);

const sourceOpenHandle = async () => {
    isShowTraceMap.value = true;
    graphLoading.value = true;
    if (info?.comp_info?.is_ac) {
        isShowSourceModal.value = true;
        sbomSourceReqData.value = {
            subtask_id: info?.subtask?.id,
            project_id: info?.subtask?.project_id,
            project_name: info?.comp_info?.comp_name,
            name: info?.comp_info?.comp_name,
            version: info?.comp_info?.comp_version,
        };
    } else {
        try {
            const res = await getSafeQuestionGraphApi({
                team_id: store.teamInfo?.team_id || undefined,
                security_id: securityId,
            });
            graph.value = res.data.graph;

            graph.value.nodes = graph.value?.nodes?.map((item: any, index: number) => ({
                id: index,
                name: String(index),
                show_name: item.comp_name || item.module?.name,
                comp_version: item.comp_version || item.module?.version,
                license: item.Licenses && item.Licenses[0]?.spdx,
                is_direct_dependency: item.is_direct_dependency,
                suggest_level: item.suggest_level,
                is_self: item.is_self,
            }));
            graph.value.edge = graph.value?.edge?.map((item: any) => ({
                source: String(item.source),
                target: String(item.target),
                value: 1,
            }));

            // 溯源依据
            const { data } = await getTraceBasisDataApi({
                subtask_id: info?.subtask?.id,
                project_id: info?.subtask?.project_id,
                comp_name: info.comp_info.comp_name,
                comp_version: info.comp_info.comp_version,
                ecosystem: info.comp_info.ecosystem,
                repository: info.comp_info.repository,
            });
            basisData.value = data;
            graphLoading.value = false;
        } catch (error) {
            console.log(error);
        }
    }
};
</script>

<style scoped lang='less'>
.left_title {
    font-size: 18px;
    color: #3c3c3c;
    font-weight: 500;
    margin-bottom: 16px;
    .between();

    span {
        width: 2px;
        height: 16px;
        display: inline-block;
        background: #6C87FF;
        border-radius: 100px;
        vertical-align: -2px;
        margin-right: 8px;
    }
}
</style>
