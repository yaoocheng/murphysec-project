<template>
    <div v-if="InformationDetails" class="main-content flex flex-col gap-[8px] overflow-auto">
        <!-- 基本信息 -->
        <div class="basic_information flex flex-col gap-[30px] p-[24px] bg-white">
            <div class="flex items-center gap-6">
                <!-- <SecIssueLevel :text="InformationDetails.severity" shape="circle" /> -->
                <img :src="getLevelImg(InformationDetails.severity)" alt="漏洞等级" class="w-[68px] h-[68px]">
                <div class="flex flex-col gap-1">
                    <span class="detail-title">{{ InformationDetails.title }}</span>
                    <div class="flex gap-2">
                        <div class="flex gap-1">
                            <Tag text="POC" :type="InformationDetails.poc == false ? 'disable' : 'normal'" />
                            <!-- <Tag text="EXP" :type="InformationDetails.exp == false ? 'disable' : 'normal'" />
                            <Tag text="RCE" :type="InformationDetails.rce == false ? 'disable' : 'normal'" /> -->
                        </div>
                        <Tag v-if="InformationDetails.is_sole == true" text="独家漏洞" type="vulnerability_type" />
                        <Tag v-else text="公开漏洞" type="vulnerability_type" />
                        <Tag v-if="InformationDetails.problem_type.cwe === 'CWE-506'" text="投毒情报" type="vulnerability_type" />
                    </div>
                </div>
            </div>

            <div class="info_list">
                <div class="info_item" v-for="(item, index) in introList" :key="index">
                    <Svg :name="item.icon" width="16px" height="16px" class="icon" color="#666666"></Svg>
                    <div class="flex flex-col gap-1">
                        <span class="label flex items-center gap-1">
                            {{ item.title }}
                            <a-tooltip>
                                <template #title>
                                    <span>FIRST 提供的 EPSS(Exploit Prediction Scoring System)分数，是预测漏洞在未来30天内被攻击者利用的概率</span>
                                </template>
                                <Svg v-if="item.value === 'epss'" name="maybe" width="14px" height="14px" color="#666666"></Svg>
                            </a-tooltip>
                        </span>
                        <span class="value" v-if="['public_time', 'last_updated_time'].includes(item.value)">
                            {{ formatDate(InformationDetails[item.value], 'YYYY-MM-DD') || '-' }}
                        </span>
                        <span class="value" v-else-if="item.value === 'epss'">
                            {{ InformationDetails.epss == -1 ? '暂无' : (InformationDetails.epss * 100) + '%' }}
                        </span>
                        <span class="value" v-else>
                            {{ InformationDetails[item.value] || '-' }}
                        </span>
                    </div>
                </div>

            </div>
        </div>

        <div class="flex flex-row gap-2">
            <!-- 左侧 -->
            <div class="left w-0 flex-1 flex flex-col gap-[24px] bg-white p-6 ">
                <div class="sticky top-0 z-10 bg-white -mx-6 px-6">
                    <a-anchor class="anchor" direction="horizontal" :target-offset="36" :get-container="getContainer" @click="handleClickAnchor">
                        <a-anchor-link v-for="(item, $index) in tabs" :key="$index" :href="'#' + item.id" :title="item.title" />
                    </a-anchor>
                </div>

                <div class="flex flex-col gap-10">
                    <!-- 基本信息 -->
                    <BaseInfo :InformationDetails="InformationDetails"/>

                    <!-- 风险评估 -->
                    <RiskAssessment :InformationDetails="InformationDetails"/>

                    <!-- 影响范围与处置建议 -->
                    <ImpactAndFix :InformationDetails="InformationDetails"/>

                    <!-- 漏洞排查 -->
                    <VulnFix :InformationDetails="InformationDetails"/>

                </div>
            </div>

            <!-- 右侧 -->
            <div class="flex flex-col gap-2 w-80">
                <!-- 漏洞当前分析状态 -->
                <div class="w-full p-6 flex flex-col gap-4 bg-white">
                    <div class="flex flex-col gap-2">
                        <span class="text-gray-700 text-[14px]">漏洞当前分析状态</span>
                    </div>
                    <a-popover trigger="hover" overlayClassName="vuln_statu_popover" arrowPointAtCenter :arrow=false placement="bottom">
                        <template #content>
                            <span>漏洞全流程分析状态</span>
                            <a-timeline>
                                <a-timeline-item :class="{ 'ant-timeline-item-active': InformationDetails.status === item.status }" v-for="(item, index) in vuln_status_list" :key="index">
                                    {{ item.status }}
                                </a-timeline-item>
                            </a-timeline>
                        </template>
                        <div class="vuln_statu">
                            <span>{{ InformationDetails.status }}</span>
                        </div>
                    </a-popover>
                </div>

                <!-- 时间线 -->
                <div class="timeline w-full p-6 flex flex-col gap-4 bg-white">
                    <span class="text-gary-700 text-[14px]">时间线</span>
                    <a-timeline class="timeline" >
                        <a-timeline-item
                            v-for="(item, index) in isExpanded
                                ? InformationDetails.revision_history.slice().reverse()
                                : InformationDetails.revision_history.slice().reverse().slice(0, 3)"
                            :key="index"
                            color="#E5EAFF"
                        >
                            <div class="flex flex-col gap-2">
                                <span class="text-gary-400 text-xs font-normal">{{ item.revision_time }}</span>
                                <span class="text-gary-700 text-xs font-medium">{{ item.revision_message }}</span>
                            </div>
                        </a-timeline-item>
                        <a-timeline-item  color="#E5EAFF" v-if="InformationDetails.revision_history?.length > 3 && !isExpanded">
                            <div class="flex items-center text-button-blue gap-[6px] cursor-pointer"
                                 @click="isExpanded = !isExpanded">
                                查看更多
                                <Svg height="12px" width="12px" name="arrow" color="#6C87FF" :class="{ 'rotate-180': isExpanded }"></Svg>
                            </div>
                        </a-timeline-item>
                    </a-timeline>
                </div>

                <!-- 参考链接 -->
                <div v-if="InformationDetails.references?.length > 0" class="w-full p-6 flex flex-col gap-4 bg-white">
                    <span class="text-gray-700 text-[14px]">参考链接</span>

                    <div v-for="(item, index) in InformationDetails.references" :key="index" class="flex flex-col gap-2">
                        <span class="link break-all" @click="window.open(item.url)">{{ item.url }}</span>
                        <Tag :cssClass="url_tag_css" text="漏洞分析报告" type="vulnerability_type"  v-if="item.url.includes('https://www.oscs1024.com')"/>
                    </div>

                </div>

                <!-- 漏洞标签 -->
                <div v-if="InformationDetails.tags.length > 0" class="w-full p-6 flex flex-col gap-4 bg-white">
                    <span class="text-gray-700 text-[14px]">漏洞标签</span>
                    <div class="flex gap-[6px]">
                        <Tag v-for="(item, index) in InformationDetails.tags" :key="index" :cssClass="vuln_tag_css" :text="item" type="vulnerability_type" />
                    </div>
                </div>
            </div>
        </div>

    </div>

</template>

<script setup>
import {
    ref,
    reactive,
    watch,
} from 'vue';
import { getChainIntelligenceListApi } from 'api/app';
import { useRoute } from 'vue-router';
import { formatDate } from '@/utils';
import BaseInfo from './components/baseInfo.vue';
import VulnFix from './components/vulnFix.vue';
import ImpactAndFix from './components/impactAndFix.vue';

import critical from '@/assets/svg/vulnerability_level/严重.png';
import high from '@/assets/svg/vulnerability_level/高危.png';
import medium from '@/assets/svg/vulnerability_level/中危.png';
import low from '@/assets/svg/vulnerability_level/低危.png';

import { usePageList } from '@/hooks';
import RiskAssessment from './components/RiskAssessment.vue';

const getLevelImg = (level) => {
    switch (level) {
        case '严重':
            return critical;
        case '高危':
            return high;
        case '中危':
            return medium;
        case '低危':
            return low;
        default:
            return '';
    }
};

const { window } = globalThis;

const route = useRoute();
const MPS_ID = route.params.id;

const filters = reactive({
    page: 0,
    limit: 15,
    severity: null,
    analysis_status: null,
    type: null,
    title: null,
    mps_id: MPS_ID,
});

const InformationDetails = ref(null);

const {
    listData,
} = usePageList(getChainIntelligenceListApi, filters);

// 保持 watch 以处理后续更新
watch(listData, ([firstItem]) => {
    if (firstItem) {
        InformationDetails.value = firstItem;
    }
});

const isExpanded = ref(false);

const introList = [
    {
        icon: 'buzz',
        title: '处置优先级',
        value: 'suggest',
    },
    {
        icon: 'attack_vector',
        title: '攻击向量',
        value: 'attack_vector',
    },
    {
        icon: 'digit',
        title: '漏洞被利用概率 EPSS',
        value: 'epss',
    },
    {
        icon: 'time',
        title: '发布时间',
        value: 'public_time',
    },
    {
        icon: 'time',
        title: '更新时间',
        value: 'last_updated_time',
    },
];

const vuln_status_list = ref([
    {
        status: '原始情报',
    },
    {
        status: '影响确认中',
    },
    {
        status: '影响已确认',
    },
    {
        status: '初步分析完成',
    },
    {
        status: '排查方案已提供',
    },
    {
        status: '临时环节方案已提供',
    },
    {
        status: '完整分析',
    },
]);

const url_tag_css = {
    backgroundColor: '#E6E6E6',
    color: '#3C3C3C',
    border: 'none',
};

const vuln_tag_css = {
    backgroundColor: '#E5EAFF',
    color: '#001C99',
    border: 'none',
};

const tabs = ref([
    {
        id: 'baseInfo',
        title: '基本信息',
    },
    {
        id: 'riskAssessment',
        title: '风险评估',
    },
    {
        id: '3',
        title: '影响范围与处置建议',
    },
    {
        id: 'vulnFix',
        title: '漏洞排查',
    },
    // {
    //     id: '5',
    //     title: '漏洞分析',
    // },
]);

/** Anchor 锚点指定滚动的容器 */
function getContainer() {
    // 给组件指定渲染的容器，解决锚点不会随页面滚动而移动的问题
    return document.querySelector('.main-content');
}

</script>

<style scoped>

.vuln_statu{
    width: 100%;
    height: 36px;
    border-radius: 6px;
    background-color: #E5EAFF80;
    padding: 9px 16px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;

    span{
        font-size: 12px;
        line-height: 150%;
        letter-spacing: 0px;
        color: #0025CC;
    }

    &:hover{
        background-color: #ffffff;
        border: 1px solid #E5EAFF;
        box-sizing: border-box;
    }
}

.info_list{
    display: flex;
    gap: 16px;

    .info_item {
        height: fit-content;
        display: flex;
        flex-direction: row;
        gap: 4px;
        flex: 1;

        .label {
            font-weight: 400;
            font-size: 12px;
            line-height: 150%;
            letter-spacing: 0px;
            color: #999999;
        }

        .value {
            font-weight: 400;
            font-size: 14px;
            line-height: 150%;
            letter-spacing: 0px;
            color: #3C3C3C;
        }
    }
}

</style>

<style>

.timeline{

    .ant-timeline-item-head{
        background-color: #6C87FF;
    }

    .ant-timeline-item-content{
        top: -3px !important;
    }
}

.anchor{
    .ant-anchor-link:not(:nth-child(1)):not(:nth-child(2)) {
        padding-inline: 40px 0 !important;
    }
}

.vuln_statu_popover{
    .ant-popover-inner{
        width: 272px;
        border-radius: 4px;
        padding: 24px;
        border-radius: 4px;
        background: linear-gradient(0deg, rgba(229, 234, 255, 0.20) 0%, rgba(229, 234, 255, 0.20) 100%), #FFF;
        box-shadow: 0px 6px 12px -10px rgba(31, 35, 41, 0.06), 0px 8px 24px 0px rgba(31, 35, 41, 0.04), 0px 10px 36px 10px rgba(31, 35, 41, 0.04);

        /* background-color: linear-gradient(0deg, #FFFFFF, #FFFFFF),
linear-gradient(0deg, rgba(229, 234, 255, 0.2), rgba(229, 234, 255, 0.2)); */

        /* 添加渐变背景的伪元素 */
        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 57px;
            background: linear-gradient(180deg, rgba(229, 234, 255, 0.5) 0%, rgba(229, 234, 255, 0) 100%);
            pointer-events: none;
            z-index: 0;
        }

        .ant-popover-inner-content{
            display: flex;
            flex-direction: column;
            gap: 24px;

            .ant-timeline-item-last{
                padding-bottom: 0px;

                .ant-timeline-item-content{
                    min-height: auto !important;
                }
            }

            .ant-timeline-item{

                .ant-timeline-item-head{
                    background-color: #CCD5FF;
                    border: none;
                }

                .ant-timeline-item-content{
                    color: #3C3C3C;
                    font-weight: 400;
                }
            }

            .ant-timeline-item-active{

                .ant-timeline-item-head{
                    background-color: #0025CC;
                    border: none;
                }

                .ant-timeline-item-content{
                    color: #0025CC;
                    font-weight: 600;
                }
            }
        }
    }
}

.timeline{

    .ant-timeline-item{
        .ant-timeline-item-head{
            width: 12px;
            height: 12px;
        }
    }

    .ant-timeline-item-last{
        padding-bottom: 0px;
        .ant-timeline-item-content{
            min-height: auto !important;
        }
    }

    .ant-timeline-item-active{
        .ant-timeline-item-content{
            color: #0025CC;
            font-weight: 600;
        }
    }
}

.main-content{

    .ant-pagination-item-active {
        border: none;
        background-color: #F4F8FF;
        a {
        color: #5777FF;
        }
    }

}

</style>
