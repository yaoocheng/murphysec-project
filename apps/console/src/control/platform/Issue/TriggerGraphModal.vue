<template>
    <div class="charts_wrap">
        <RelationGraph v-if="isGetData" ref="relationGraph$" :options="options">
            <template #node="{ node }">
                <div class="grapht_content">
                    <div class="content" v-if="(node).type === 'comp'">
                        <div>缺陷组件名：{{ (node).data.comp_name }} <span class="tag g-fw-400" style="display: inline;">{{ (node).data.comp_version }}</span> </div>
                        <!-- <div>缺陷组件版本：</div> -->
                    </div>
                    <div class="content" v-if="(node).type === 'vuln'">
                        <div>漏洞名：{{ (node).data?.title }}
                            <span class="tag" style="padding: 0 6px; color: #fff" :style="{background: getDangerLevel((node).data?.level).color}">{{ getDangerLevel((node).data?.level).text }}</span>
                        </div>
                        <div>漏洞编号：{{ (node).data?.cve_id || (node).data?.mps_id || '-' }}</div>
                        <!-- <div>漏洞级别：{{ getDangerLevel((node).data?.level).text }}</div> -->
                    </div>
                    <div class="content" v-if="(node).type === 'trigger'">
                        <div class="g-flex g-justify-between g-mb-16">
                            <span class="g-f-16 g-fw-500">缺陷点</span>
                            <span class="g-f-14 g-fw-400">
                                {{ (node).data.trigger_type }}
                            </span>
                        </div>
                        <div class="g-mb-6" v-if="(node).data.trigger_type !== '缺陷配置触发'">缺陷函数：{{ (node).data.vuln_function }}
                        </div>
                        <div v-if="(node).data.trigger_type !== '缺陷配置触发'">{{ (node).data.ecosystem === 'npm' ?
                            '缺陷模块' : '缺陷类' }}：{{ (node).data.vuln_class }}</div>
                    </div>
                    <div class="content" style="width: 800px" v-if="(node).type === 'source'">
                        <div v-if="node.data.type === 'java_call_site'">
                            <div>
                                类名：{{ node.data.class_qualified_name }}
                            </div>
                            <div>
                                方法名称：{{ node.data.method_name }}
                            </div>
                            <div>
                                方法签名：{{ node.data.method_descriptor }}
                            </div>
                            <div>
                                行数：{{ node.data.line_number }}
                            </div>
                        </div>

                        <div v-else>
                            <div style="margin-bottom: 8px;">{{ (node).data.file_path }}</div>
                            <div class="code_item">
                                <span class="line">
                                    {{ (node).data.line_num }}
                                </span>
                                <span class="code_wrap">
                                    <highlightjs autodetect :code="(node).data.code" />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </RelationGraph>
        <NoData class="mt-[15%]" v-else />
    </div>
</template>

<script setup lang='ts'>
import { ref, onMounted, nextTick } from 'vue';
import { getVulnTriggerApi } from 'api/project';
import { getDangerLevel } from 'util/tools';
import RelationGraph from 'relation-graph/vue3';

const props = defineProps(['info', 'tid', 'sid']);
const relationGraph$ = ref<any>();
const options = {
    moveToCenterWhenRefresh: true,
    zoomToFitWhenRefresh: true,
    useAnimationWhenRefresh: false,
    defaultFocusRootNode: false,
    allowShowMiniToolBar: true,
    allowShowDownloadButton: false,
    defaultNodeColor: '#fff',
    defaultNodeFontColor: 'rgba(75, 75, 75, 1)',
    defaultNodeBorderColor: '#C3C6D4',
    defaultNodeBorderWidth: 0,
    defaultLineShape: 4,
    defaultNodeShape: 1,
    showDebugPanel: false,
    debug: false,
    disableNodeClickEffect: true,
    disableLineClickEffect: true,
    defaultLineMarker: {
        markerWidth: 20,
        markerHeight: 20,
        refX: 3,
        refY: 3,
        data: 'M 0 0, V 6, L 4 3, Z',
    },
    layouts: [
        {
            label: '中心',
            layoutName: 'tree',
            layoutClassName: 'seeks-layout-center',
            from: 'left',
            min_per_width: 700,
            max_per_width: 700,
            min_per_height: 200,
            centerOffset_x: -800,
        },
    ],
};
const isGetData = ref<any>(null);
onMounted(async () => {
    try {
        const res = await getVulnTriggerApi({
            comp_name: props.info.comp_name,
            comp_version: props.info.comp_version,
            ecosystem: props.info.ecosystem,
            repository: props.info.repository,
            project_id: props.tid,
            subtask_id: props.sid,
        });
        const jsonData = res.data;
        isGetData.value = jsonData?.lines?.length && jsonData.nodes?.length;
        nextTick(() => {
            if (jsonData.lines?.length && jsonData.nodes?.length) {
                relationGraph$.value.setJsonData(jsonData);
                relationGraph$.value.refresh();
            }
        });
    } catch (error) {
        console.log(error);
    }
});
</script>

<style lang='less' scoped>
.charts_wrap {
    height: 64vh;
    width: 100%;
    background: #F7F8FB;

    .grapht_content {
        text-align: left;
        padding: 12px;
        border: 1px solid rgba(54, 68, 128, 0.205);
        border-radius: 6px;
        line-height: 24px;
        cursor: pointer;
        word-break: break-all;

        .content {
            width: 360px;
        }
    }

    .code_item {
        display: flex;
        align-items: center;
        background-color: #eaf7ff;

        .line {
            width: 60px;
            height: 100%;
            text-align: center;
            color: #8F959E;
            box-sizing: border-box;
        }

        .code_wrap {
            flex: 1;
            width: 0;
            white-space: pre-wrap;
        }
    }
}
</style>
