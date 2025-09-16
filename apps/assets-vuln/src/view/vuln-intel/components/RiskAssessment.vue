<template>
    <div class="flex flex-col gap-4" id="riskAssessment">
        <span class="tab-title">风险评估</span>
        <div class="flex flex-col gap-8">
            <div class="flex flex-col gap-3">
                <div class="flex flex-col gap-1">
                    <div class="title_with_line">
                        <div class="line"></div>
                        <div class="content">漏洞处置优先级评估</div>
                    </div>
                    <span class="text-gary-400 text-xs">平台基于「利用成熟度、利用成本、是否导致数据泄漏、攻击向量、墨菲评级」五个维度，对漏洞的威胁性和处置优先级进行评估</span>
                </div>
                <div class="flex flex-col gap-4">
                    <div class="flex gap-6 rounded-md p-6 border-solid border border-[#E6E6E6] ">
                        <div class="flex-1">
                            <div class="mb-3 font-medium">当前漏洞处置优先级</div>
                            <a-collapse v-model:activeKey="activeKey" accordion class="disposalPriority">
                                <a-collapse-panel :showArrow="false" v-for="(item, index) in repairList" :key="index"
                                                  :class="[item.title.bgColor]" collapsible="disabled">
                                    <template #header>
                                        <div :class="[item.title.textColor]" class="flex items-center justify-center">
                                            {{ item.title.text }}
                                        </div>
                                    </template>
                                    <div :class="[item.content.bgColor, item.content.textColor, 'px-6 py-5', item.content.textSize , 'h-[118px]']">
                                        {{ item.content.text }}
                                    </div>
                                </a-collapse-panel>
                            </a-collapse>
                        </div>
                        <div class="flex-1">
                            <div class="mb-3 font-medium">当前漏洞处置优先级维度说明</div>
                            <div class="flex-1 bg-[#F2F2F2] rounded-md h-[248px]">
                                <div id="radar"></div>
                            </div>
                        </div>
                    </div>
                    <div class="rounded-md p-6 border-solid border border-[#E6E6E6] " v-if="InformationDetails.exploit_prerequisite?.length > 0">

                        <div class="mb-3 flex items-center gap-[6px]">
                            <span class="text-gray-700 text-[13px] font-medium">利用前置条件</span>
                            <Tag :text="'利用成本' + InformationDetails.exploit_cost" type="vulnerability_type" :cssClass="url_tag_css" />
                        </div>

                        <div class="px-6 py-5 bg-[#F2F2F299] rounded-[3px]" >
                            <span v-for="item in InformationDetails.exploit_prerequisite" :key="item">{{ item }}</span>
                        </div>

                    </div>
                </div>

            </div>

            <div class="flex flex-col gap-3">
                <div class="title_with_line">
                    <div class="line"></div>
                    <div class="content">漏洞等级评估</div>
                </div>
                <div class="flex flex-col overflow-hidden rounded-md border border-solid border-[#E6E6E6] ">
                    <!-- 标题栏 -->
                    <div class="flex items-center bg-gary-50 justify-between py-3 px-6 ">
                        <div class="flex items-center gap-2">
                            <span class="text-gray-700 ">CVSS评级：</span>
                            <span class="text-red-600 font-semibold">{{ InformationDetails.hazard_level }} ({{ InformationDetails.cvss_score }})</span>
                        </div>
                        <div v-if="InformationDetails.cve_id" @click="window.open(`https://nvd.nist.gov/vuln/detail/${InformationDetails.cve_id}`, '_blank')" class="text-button-blue rounded">
                            <span>NVD详情页</span>
                        </div>
                    </div>

                    <!-- CVSS 3.x -->
                    <div class="flex flex-col gap-4 p-6">
                        <div class="flex items-center gap-2">
                            <span class="text-gray-700 text-[13px]">CVSS 3.x</span>
                        </div>

                        <div class="flex flex-col gap-6">
                            <div class="flex items-center gap-2">
                                <span class="text-gray-700 text-xs font-normal">漏洞等级</span>
                                <span class="text-red-600 text-xs font-semibold">{{ InformationDetails.hazard_level }} ({{ InformationDetails.cvss_score }})</span>
                                <span class="text-gray-700 text-xs ml-6 font-normal">评估公式: </span>
                                <span class="text-gray-700 text-xs font-semibold">{{ InformationDetails.cvss_vector }}</span>
                            </div>

                            <div class="bg-[#F2F2F280] rounded-md p-6">
                                <div class="flex gap-10">
                                    <div v-for="(metricGroup, groupIndex) in Metrics" :key="groupIndex" class="flex flex-row gap-4">
                                        <div class="flex flex-col gap-4">
                                            <div v-for="(metric) in metricGroup" :key="metric.code" class="flex flex-col gap-2">
                                                <div class="flex items-center gap-1">
                                                    <span class="text-gray-700 font-black text-xs">{{ metric.code }}</span>
                                                    <span class="text-gray-700 font-normal text-xs">{{ metric.title }}</span>
                                                </div>
                                                <div class="flex gap-[2px] rounded-[3px] overflow-hidden">
                                                    <div v-for="option in metric.options" :key="option.value" class="px-2 py-[8px] text-xs" :class="[option.active ? 'bg-purple-50 text-gary-700' : 'bg-[#E6E6E699] text-gary-300']">
                                                        <span>{{ option.value }} {{ option.label }}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {
    dataLeakageCWEs, attackVectorMap, hazardLevelMap, exploitCostMap, repairList, Metrics,
} from '../contants';
import { createRadarOptions, renderChart } from '@/utils/chart';

const { window } = globalThis;

const { InformationDetails } = defineProps(['InformationDetails']);

const radarOption = ref(createRadarOptions());

radarOption.value.radar.indicator = [
    { name: `攻击向量\n${InformationDetails.attack_vector || '-'}`, max: 100 },
    { name: `漏洞评级\n${InformationDetails.hazard_level || '-'}`, max: 100 },
    { name: `导致数据泄露\n${dataLeakageCWEs.includes(InformationDetails.problem_type.cwe) ? '是' : '否'}`, max: 100 },
    { name: `利用成熟度\n${InformationDetails.poc ? '存在POC' : '不存在POC'}`, max: 100 },
    { name: `利用成本\n${InformationDetails.exploit_cost || '-'}`, max: 100 },
];

radarOption.value.series[0].data[0].value = [
    attackVectorMap[InformationDetails.attack_vector],
    hazardLevelMap[InformationDetails.hazard_level],
    dataLeakageCWEs.includes(InformationDetails.problem_type.cwe) ? 100 : 50,
    InformationDetails.poc ? 100 : 50,
    exploitCostMap[InformationDetails.exploit_cost],
];

// 增加computed使得修复优先级计算结果可以实时更新
const activeKey = ref(repairList.findIndex((item) => item.title.text === (InformationDetails?.suggest || InformationDetails?.suggest_level)));

const url_tag_css = {
    color: '#3C3C3C',
    backgroundColor: '#E6E6E6',
    border: 'none !important',
};

// 解析CVSS向量
const parseCVSSVector = (vector) => {
    if (!vector) return {};
    const components = vector.replace('CVSS:3.1/', '').split('/');

    // 更新Metrics中的active状态
    components.forEach((comp) => {
        const [key, value] = comp.split(':');

        // 遍历Metrics数组的两个子数组
        Metrics.value.forEach((metricGroup) => {
            // 查找匹配的度量项
            const metric = metricGroup.find((m) => m.code === key);
            if (metric) {
                // 更新选项的active状态
                metric.options.forEach((option) => {
                    if (option.value === value) { option.active = true; } else { option.active = false; }
                });
            }
        });
    });
};

onMounted(() => {
    // 在组件挂载时解析CVSS向量
    if (InformationDetails?.cvss_vector) {
        parseCVSSVector(InformationDetails.cvss_vector);
    }

    const radarDom = document.getElementById('radar');

    if (radarDom) {
        renderChart(radarOption.value, radarDom);
    }
});

</script>

<style>

#radar{
    width: 100%;
    height: 100%;
}

</style>
