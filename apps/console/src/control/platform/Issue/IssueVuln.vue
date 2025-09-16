<template>
    <div class="left_title">
        <div>
            <span></span>
            处置优先级分析
        </div>
    </div>
    <div class="issue-vuln">
        <div class="g-bg-f7 head g-flex g-align-center g-justify-between rounded-md">
            <div class="g-f-16 g-fw-500 g-color-1">
                <i :style="{ color: getRepaireLevelTool(info.highest_suggest).color }"
                   class="murphy icon-jinggao1 g-f-20 g-vertical--1 g-mr-4"></i>
                {{ getRepaireLevelTool(info.highest_suggest).text }}
            </div>
            <!-- <div @click="rateModal = true" style="line-height: 22px;"
                 class="hover_btn1 g-pv-2 g-ph-4 g-color-5 g-cursor-pointer">
                评级标准 <i class="murphy icon-jiantou-you"></i>
            </div> -->
            <a href="/docs/faqs/security-issues/security-issue-priorities.html" target="_blank">
                <div class="button-text-blue">
                    评级标准 <i class="murphy icon-jiantou-you"></i>
                </div>
            </a>

        </div>

        <div class="content g-p-24">
            <div class="g-flex g-mb-16">
                <Tooltip width="400"
                         content="漏洞级别是系统自有评级和CVSS评分的综合结果。其中 NVD 中的 CVSS 基础评分是用于评价一个漏洞本身危害程度的评估指标，此外会结合漏洞实际利用条件和成本对漏洞评级进行调整。高危和严重意味着漏洞有更大的影响。">
                    <div class="g-mr-32">
                        <span class="g-color-3 g-fw-500">漏洞分布：</span>
                        <span class="num">
                            <span :style="{
                                backgroundColor: getCriticalCount > 0 ? '#F34D3D' : '#EBEBEB',
                                color: '#fff'
                            }">C</span>
                            <span :style="{
                                backgroundColor: getCriticalCount > 0 ? 'rgba(245, 74, 69, 0.2)' : '#C7C7C733',
                                color: getCriticalCount > 0 ? '#F34D3D' : '#C7C7C7'
                            }">
                                {{ getCriticalCount }}</span>
                        </span>
                        <span class="num">
                            <span :style="{
                                backgroundColor: getHighCount > 0 ? '#FF9940' : '#EBEBEB',
                                color: '#fff'
                            }">H</span>
                            <span :style="{
                                backgroundColor: getHighCount > 0 ? 'rgba(255, 153, 64, 0.2)' : '#C7C7C733',
                                color: getHighCount > 0 ? '#FF9940' : '#C7C7C7'
                            }">
                                {{ getHighCount }}</span>
                        </span>
                        <span class="num">
                            <span :style="{
                                backgroundColor: getMediumCount > 0 ? '#FCBE03' : '#EBEBEB',
                                color: '#fff'
                            }">M</span>
                            <span :style="{
                                backgroundColor: getMediumCount > 0 ? 'rgba(255, 204, 51, 0.2)' : '#C7C7C733',
                                color: getMediumCount > 0 ? '#FCBE03' : '#C7C7C7'
                            }">
                                {{ getMediumCount }}</span>
                        </span>
                        <span class="num">
                            <span :style="{
                                backgroundColor: getLowCount > 0 ? '#A7AECC' : '#EBEBEB',
                                color: '#fff'
                            }">L</span>
                            <span :style="{
                                backgroundColor: getLowCount > 0 ? 'rgba(167, 174, 204, 0.2)' : '#C7C7C733',
                                color: getLowCount > 0 ? '#A7AECC' : '#C7C7C7'
                            }">
                                {{ getLowCount }}
                            </span>
                        </span>
                    </div>
                </Tooltip>

                <div>
                    <span class="g-color-3 g-fw-500">漏洞标签：</span>
                    <Tooltip width="400"
                             content="POC（Proof of Concept）指的是用于验证特定漏洞或安全概念可行性的示例代码或步骤，主要用于展示漏洞的利用方式或验证安全措施的有效性。漏洞有POC时，意味着已经有了一种概念验证的方式，能够具体展示该漏洞如何被实际利用">
                        <span class="vuln-tag" v-if="vuln?.some((item: any) => item?.full_vuln_data?.poc)"
                              style="color: #0C296E;background: #3370FF33;">POC</span>
                        <span class="vuln-tag" v-else style="color: #C7C7C7;background: #F2F2F2;">POC</span>
                    </Tooltip>

                    <Tooltip width="400"
                             content="“漏洞利用成本”指的是攻击者为了成功利用某一安全漏洞所必须付出的全部成本与资源。当这一成本较低时，表明攻击者无需过多的资源、专业知识或时间就能够实施攻击，从而大大增加了该漏洞被有效利用的风险">
                        <span class="vuln-tag"
                              v-if="vuln?.some((item: any) => item?.full_vuln_data?.exploit_requirement_cost === '低')"
                              style="color: #6B3900;background: #FF880033;">利用成本低</span>
                        <span class="vuln-tag" v-else style="color: #C7C7C7;background: #F2F2F2;">利用成本低</span>
                    </Tooltip>

                    <Tooltip width="400" content="漏洞的影响范围指的是漏洞可能对系统、应用程序或网络造成的潜在损害程度和影响的广度，了解漏洞的影响范围有助于评估漏洞的严重程度">
                        <span class="vuln-tag"
                              v-if="vuln.some((item: any) => item?.full_vuln_data?.scope_influence === '广')"
                              style="color: #460B46;background: #D136D133;">影响范围广</span>
                        <span class="vuln-tag" v-else style="color: #C7C7C7;background: #F2F2F2;">影响范围广</span>
                    </Tooltip>

                    <el-tooltip placement="top">
                        <template #content>
                            <div class="max-w-[400px]">
                                当漏洞的触发函数在代码中被实际使用时，该漏洞将被定义为“可触发漏洞”；组件中若是存在一个可触发漏洞，则将出现“可触发漏洞”标签，<a href="/docs/glossary/vulnerability-reachability.html" target="_blank">查看文档</a>
                            </div>
                        </template>
                        <span class="vuln-tag" v-if="vuln?.some((item: any) => item?.full_vuln_data?.is_triggers)"
                              style="color: #024B41;background: #00D6B933;">可触发漏洞</span>
                        <span class="vuln-tag" v-else style="color: #C7C7C7;background: #F2F2F2;">可触发漏洞</span>
                    </el-tooltip>
                </div>
            </div>

            <div class="g-mb-24 g-bdr-4 g-bg-f7 g-color-1 g-fw-400" style="padding: 12px 16px;">
                该缺陷组件涉及
                <span v-if="vuln?.some((item: any) => item?.full_vuln_data?.level === 'Critical')">
                    严重漏洞，
                </span>
                <span v-else-if="vuln?.some((item: any) => item?.full_vuln_data?.level === 'High')">
                    高危漏洞，
                </span>
                <span v-else-if="vuln?.some((item: any) => item?.full_vuln_data?.level === 'Medium')">
                    中危漏洞，
                </span>
                <span v-else-if="vuln?.some((item: any) => item?.full_vuln_data?.level === 'Low')">
                    低危漏洞，
                </span>
                <span v-if="vuln?.some((item: any) => item?.full_vuln_data?.poc)">
                    有POC，
                </span>
                <span v-if="vuln?.some((item: any) => item?.full_vuln_data?.exploit_requirement_cost === '低')">
                    利用成本低，
                </span>
                <span v-if="vuln?.some((item: any) => item?.full_vuln_data?.scope_influence === '广')">
                    影响范围广，
                </span>
                <span v-if="vuln?.some((item: any) => item?.full_vuln_data?.is_triggers)">
                    可触发漏洞，
                </span>
                <span>{{ getRepaireLevelTool(info.highest_suggest).text }}！</span>
                <!-- 该缺陷组件涉及严重漏洞、有POC、利用成本低，影响范围广，可触发漏洞，故强烈建议修复！ -->
            </div>

            <el-button @click="vulnModal = true" class="minor_btn" style="height: 32px;width: 100%;">
                查看 {{ vuln?.length }} 个关联漏洞
            </el-button>
        </div>
    </div>

    <el-dialog width="840" v-model="rateModal" title="评级标准">
        <div class="g-pt-24 g-pb-24">
            <div style="line-height: 22px;" class="g-mb-24 g-f-14 g-fw-400 g-color-1">
                需同时满足 CVSS>=7（高危以上）、有POC 、可直接导致数据泄漏的漏洞类型 、利用成本不为「高」或「中」
            </div>

            <div class="g-color-1 g-mb-24">
                <div class="g-mb-8">
                    <i class="murphy icon-tanhao1 g-vertical--1 g-mr-8" style="color: #D83931;"></i>
                    <span class="g-color-1 g-fw-500">强烈建议修复</span>
                </div>
                <div style="padding: 12px 16px;background-color: #F7F8FB;border-radius: 6px;">
                    需同时满足 CVSS>=7（高危以上）、有POC 、可直接导致数据泄漏的漏洞类型 、利用成本不为「高」或「中」
                </div>
            </div>

            <div class="g-color-1 g-mb-24">
                <div class="g-mb-8">
                    <i class="murphy icon-tanhao1 g-vertical--1 g-mr-8" style="color: #DE7802;"></i>
                    <span class="g-color-1 g-fw-500">建议修复</span>
                </div>
                <div class="g-mb-8" style="padding: 12px 16px;background-color: #F7F8FB;border-radius: 6px;">
                    满足 有POC的其余情况、CVSS>=7（高危以上）两个中任意一个条件
                </div>
                <!-- <div class="g-mb-8" style="padding: 12px 16px;background-color: #F7F8FB;border-radius: 6px;">
                    条件2：CVSS>=7(高危以上)、有POC的、存在可直接导致数据泄漏的漏洞类型、利用成本为中
                </div>
                <div class="g-mb-8" style="padding: 12px 16px;background-color: #F7F8FB;border-radius: 6px;">
                    条件3：CVSS>=7(高危以上)、有POC的、不存在可直接导致数据泄漏的漏洞类型、利用成本为低
                </div>
                <div class="g-mb-8" style="padding: 12px 16px;background-color: #F7F8FB;border-radius: 6px;">
                    条件4：CVSS>=7(高危以上)、有POC的、不存在可直接导致数据泄漏的漏洞类型、利用成本为中
                </div>
                <div style="padding: 12px 16px;background-color: #F7F8FB;border-radius: 6px;">
                    条件5：CVSS>=7(高危以上)、有POC的、不存在可直接导致数据泄漏的漏洞类型、利用成本为高
                </div> -->
            </div>

            <div class="g-color-1">
                <div class="g-mb-8">
                    <i class="murphy icon-tanhao1 g-vertical--1 g-mr-8" style="color: #646A73;"></i>
                    <span class="g-color-1 g-fw-500">可选修复</span>
                </div>
                <div style="padding: 12px 16px;background-color: #F7F8FB;border-radius: 6px;">
                    除“强烈建议修复”和“建议修复”条件以外的其他条件
                </div>
            </div>

        </div>
    </el-dialog>

    <el-dialog width="840" v-model="vulnModal" title="关联漏洞信息">
        <div class="g-pb-24 g-mt-12" style="height: 500px;overflow: auto;">
            <div class="g-f-14 g-mb-16">共 <span class="g-color-1">{{ vuln?.length }}</span> 条数据</div>

            <div class="item" v-for="(item, key) in sortVuln" :key="key"
                 :style="{ borderColor: getDangerLevel(item.full_vuln_data.level).color }">
                <div class="top">
                    <div class="part_info">
                        <a class="hover_text g-f-14 g-fw-500 g-color-1 g-mr-4"
                           :href="generateVulnLink(item.mps_id, item.cve_id)" target="_blank">
                            {{ item.full_vuln_data.title }}
                        </a>
                        <TagComp class="g-mr-4" content="CVE未收录漏洞" v-if="!item?.full_vuln_data?.cve_id"></TagComp>
                        <TagComp class="g-mr-4" content="独家漏洞" v-if="item?.full_vuln_data?.is_sole"></TagComp>
                        <TagComp content="投毒组件" v-if="item?.full_vuln_data?.cwe_id === 'CWE-506'"></TagComp>
                        <TagComp bgc="#14C0FF33" c="#049FD7" class="g-mr-4" v-if="item?.full_vuln_data?.cavd_id"
                                 :content="'CAVD漏洞'" />
                    </div>
                </div>

                <div class="bottom">
                    <div class="part_info">
                        编号
                        <span class="info">{{ item?.full_vuln_data?.cve_id || item?.full_vuln_data?.mps_id }}</span>
                    </div>

                    <div class="part_info">
                        POC
                        <span class="info">{{ item?.full_vuln_data?.poc ? '有' : '无' }}</span>
                    </div>

                    <div class="part_info">
                        利用成本
                        <span class="info">{{ item?.full_vuln_data?.exploit_requirement_cost || '暂无' }}</span>
                    </div>

                    <div class="part_info">
                        影响范围
                        <span class="info">{{ item?.full_vuln_data?.scope_influence || '暂无' }}</span>
                    </div>

                    <div class="part_info">
                        可触发漏洞
                        <span class="info">{{ item?.full_vuln_data?.is_triggers ? '是' : '否' }}</span>
                    </div>
                </div>
            </div>

            <NoData v-if="!vuln?.length" />
        </div>
    </el-dialog>
</template>

<script setup lang='ts'>
import { ref, computed } from 'vue';
import { getRepaireLevelTool, getDangerLevel } from 'util/tools';
import NoData from '@/components/NoData.vue';

const { vuln } = defineProps(['vuln', 'info']);
const rateModal = ref(false);
const vulnModal = ref(false);

// 生成漏洞链接 xxx.com/hd/MPS-xxx-xxx
const generateVulnLink = (mpsId: any, cveId: any) => {
    const baseUrl = window.location.origin;
    const id = mpsId || cveId;
    return `${baseUrl}/hd/${id}`;
};

const sortVuln = ref([
    ...vuln.filter((a: any) => a.full_vuln_data.level === 'Critical'),
    ...vuln.filter((a: any) => a.full_vuln_data.level === 'High'),
    ...vuln.filter((a: any) => a.full_vuln_data.level === 'Medium'),
    ...vuln.filter((a: any) => a.full_vuln_data.level === 'Low'),
]);

// 计算各级别漏洞数量
const getCriticalCount = computed(() => vuln?.filter((a: any) => a?.full_vuln_data?.level === 'Critical')?.length || 0);
const getHighCount = computed(() => vuln?.filter((a: any) => a?.full_vuln_data?.level === 'High')?.length || 0);
const getMediumCount = computed(() => vuln?.filter((a: any) => a?.full_vuln_data?.level === 'Medium')?.length || 0);
const getLowCount = computed(() => vuln?.filter((a: any) => a?.full_vuln_data?.level === 'Low')?.length || 0);

</script>

<style scoped lang='less'>
.issue-vuln {
    border-radius: 6px;
    border: 1px solid #E7E8EB;
    margin-bottom: 16px;

    .head {
        padding: 16px 24px;
    }
}

.item {
    height: 84px;
    padding: 16px;
    padding-left: 0;
    box-sizing: border-box;
    background-color: #F7F8FB;
    margin-bottom: 8px;
    border-radius: 4px;
    border-left: 4px solid transparent;

    .tag {
        padding: 3px 6px;
        // background: #34C72433;
        border-radius: 4px;
        display: inline-block;
        font-size: 12px;
        // color: #2EA121;
        font-weight: 500;
        transform: scale(0.8);
        margin-left: -6px;

        i {
            font-size: 12px;
            margin-right: 5px;
        }
    }

    .info {
        font-size: 14px;
        color: #3c3c3c;
        // font-weight: 500;
        display: inline-block;
        vertical-align: -3px;
    }

    .top,
    .bottom {
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        color: #8F959E;
    }

    .bottom {
        font-size: 12px;
    }

    .comp-tag .tag {
        margin-left: -8px;
    }

    .part_info {
        margin-left: 16px;

        .tag {
            margin-right: -0;
            color: #2946C7 !important;
            background-color: #4966E633 !important;
        }

        .info {
            margin-left: 4px
        }

        .center();

        a {
            color: @text-color;
        }

        a:hover {
            color: #6c87ff;
            text-decoration: underline;
        }
    }
}

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

.vuln-tag {
    padding: 4px 6px;
    border-radius: 2px;
    margin-right: 8px;
}

.num {
    display: inline-block;
    border-radius: 4px;
    margin-right: 8px;

    span {
        &:nth-of-type(1) {
            border-top-left-radius: 2px;
            border-bottom-left-radius: 2px;
        }

        &:nth-of-type(2) {
            border-top-right-radius: 2px;
            border-bottom-right-radius: 2px;
            padding: 3px 6px;
        }

        display: inline-block;
        padding: 3px 5px;
    }
}
</style>
