<template>
    <div class="flex flex-col gap-4" id="vulnFix">
        <span class="tab-title">漏洞排查</span>

        <!-- 排查方式 -->
        <div class="tab_card">
            <div class="header">
                <span>排查方式</span>
            </div>
            <div class="body flex flex-col gap-2">
                <div v-for="item in InformationDetails.investigation.slice(0, methodExpanded ? InformationDetails.investigation.length : 3)"
                     :key="item"
                     class="flex items-center gap-2 text-sm text-[#3C3C3C]">
                    <div class="w-[6px] h-[6px] rounded-full bg-[#3C3C3C]"></div>
                    {{ item }}
                </div>

                <div v-if="InformationDetails.investigation?.length > 3"
                     class="flex items-center text-button-blue gap-[6px] cursor-pointer"
                     @click="methodExpanded = !methodExpanded">
                    {{ methodExpanded ? '收起' : '查看更多' }}
                    <Svg height="12px" width="12px" name="arrow" color="#6C87FF" :class="{ 'rotate-180': methodExpanded }"></Svg>
                </div>
            </div>
        </div>

        <!-- POC信息 -->
        <div v-if="InformationDetails.poc_url?.length > 0" class="tab_card">
            <div class="header">
                <span>POC信息</span>
            </div>
            <div class="body flex flex-col gap-8">
                <div class="flex flex-col gap-3" v-if="InformationDetails.poc_url.filter(item => !item.includes('murphysec')).length > 0">
                    <span class="flex items-center text-[13px] leading-[150%] tracking-[0px] font-semibold">
                        公开POC（{{ InformationDetails.poc_url.filter(item => !item.includes('murphysec')).length }}）
                    </span>
                    <div class="bg-white border border-solid border-[#E6E6E6] flex flex-col gap-6 rounded-md p-6">
                        <div v-for="item in InformationDetails.poc_url.filter(item => !item.includes('murphysec'))" :key="item" class="flex items-center gap-2">
                            <div class="h-[42px] w-0.5 bg-gray-100"></div>
                            <div class="flex flex-col gap-2">
                                <span @click="openUrl(item)" class="text-[#6C87FF] text-xs cursor-pointer">
                                    {{ item }}
                                </span>
                                <span class="text-gray-400 text-xs">
                                    来源：
                                    <span class="text-gray-700">
                                        {{ item.includes('github') ? 'GitHub' : '其他' }}
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="InformationDetails.poc_url.filter(item => item.includes('murphysec')).length > 0" class="flex flex-col gap-3">
                    <span class="flex items-center text-[13px] leading-[150%] tracking-[0px] font-semibold">
                        墨菲POC
                    </span>
                    <div class="bg-white border border-solid border-[#E6E6E6] flex flex-col gap-6 rounded-md p-6">
                        <div v-for="item in InformationDetails.poc_url.filter(item => item.includes('murphysec'))" :key="item" class="flex items-start gap-2">
                            <div class="h-[42px] w-0.5 bg-gray-100"></div>
                            <div class="flex flex-col gap-2">
                                <span class="text-gary-700 text-xs">墨菲POC验证</span>
                                <span class="text-gary-400 text-xs">来源：<span class="text-gray-700">墨菲安全实验室</span></span>
                            </div>
                            <div @click="downloadPOC(item)" class="text-button-gray ml-auto gap-1">
                                <Svg height="12px" width="12px" name="download" color="#3C3C3C"></Svg>
                                <span class="text-gray-700 text-xs">下载</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 指纹信息 -->
        <div v-if="InformationDetails.fingerprint.package_name?.length > 0 || InformationDetails.fingerprint.network_service_fingerprint?.length > 0 || InformationDetails.fingerprint.process?.length > 0 || InformationDetails.fingerprint.installer?.length > 0 || InformationDetails.fingerprint.filehash.length > 0 || InformationDetails.fingerprint.file_content.length > 0" class="tab_card">
            <div class="header">
                <span>指纹信息</span>
            </div>
            <div class="body flex flex-col gap-8">
                <FingerprintInfo :fingerprint="InformationDetails.fingerprint" />
            </div>
        </div>

        <!-- IOC信息 -->
        <div v-if="InformationDetails.ioc?.length > 0" class="tab_card">
            <div class="header">
                <span>IOC信息</span>
            </div>
            <div class="body flex flex-col gap-8">
                <div v-for="item in displayedItems"
                     :key="item"
                     class="flex items-center gap-2 text-sm text-[#3C3C3C]">
                    <div class="w-[6px] h-[6px] rounded-full bg-[#3C3C3C]"></div>
                    {{ item }}
                </div>

                <div v-if="InformationDetails.ioc?.length > 3"
                     class="flex items-center text-button-blue gap-[6px] cursor-pointer"
                     @click="toggleExpand">
                    {{ isExpanded ? '收起' : '查看更多' }}
                    <Svg height="12px" width="12px" name="arrow" color="#6C87FF" :class="{ 'rotate-180': isExpanded }"></Svg>
                </div>
            </div>
        </div>

        <!-- 漏洞触发点 -->
        <div v-if="InformationDetails.extension?.length > 0" class="tab_card">
            <div class="header">
                <span>漏洞触发点</span>
            </div>
            <div class="body flex flex-col gap-8">

                <div v-if="InformationDetails.extension?.[0].filter(item => item.type === 'code').length > 0" class="flex flex-col gap-3">
                    <span class="text-gray-700 text-[13px] font-semibold">通过代码触发</span>
                    <a-table  :scroll="{ x: '100%' }"  class="gray-table" :pagination="false"  :columns="codeColumns" :data-source="InformationDetails.extension[0].filter(item => item.type === 'code')" >
                        <template #emptyText>
                            <Empty />
                        </template>
                    </a-table>
                </div>

                <div v-if="InformationDetails.extension?.[0].filter(item => item.type === 'config').length > 0" class="flex flex-col gap-3">
                    <span class="text-gray-700 text-[13px] font-semibold">通过配置文件触发</span>
                    <a-table class="gray-table" :pagination="false"  :columns="configColumns" :data-source="InformationDetails.extension[0].filter(item => item.type === 'config')" >
                        <template #emptyText>
                            <Empty />
                        </template>
                    </a-table>

                </div>

                <div v-if="InformationDetails.extension?.[0].filter(item => item.type === 'dependency').length > 0" class="flex flex-col gap-3">
                    <span class="text-gray-700 text-[13px] font-semibold">依赖则可触发</span>
                    <div class="bg-white px-6 py-5 rounded-[3px]">
                        <span class="text-gray-700 text-xs">指该组件只要存在依赖中就会受到影响</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 漏洞流量特征 -->
        <div v-if="InformationDetails.fingerprint.package_download_url?.length > 0" class="tab_card">
            <div class="header">
                <span>漏洞流量特征</span>
            </div>

            <!-- todo 暂时取第一个 -->
            <div class="body flex flex-col gap-4 ">
                <span class="text-gray-700 text-xs font-normal">漏洞流量特征是指捕获到攻击者在利用系统或软件漏洞时产生的真实网络流量数据，比如 pcap 包或 HTTP 报文。它记录了攻击行为的实际痕迹，如异常的数据包结构或恶意的请求内容，这些流量包可以用来校准和识别入侵检测系统（IDS）的规则是否有效，帮助优化检测能力并验证防护措施</span>

                <div @click="downloadPackage(InformationDetails.fingerprint.package_download_url[0])" class="p-1 text-button-blue w-full flex justify-center items-center rounded-md border border-solid border-[#6C87FF]">
                    <Svg height="14px" width="14px" name="download" class="mr-1" color="#6C87FF"></Svg>
                    下载流量包
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>

import { ref, computed } from 'vue';
import FingerprintInfo from './fingerprintInfo.vue';

const { InformationDetails } = defineProps(['InformationDetails']);

const methodExpanded = ref(false);

const isExpanded = ref(false);

const displayedItems = computed(() => {
    if (!InformationDetails.ioc) return [];
    return isExpanded.value
        ? InformationDetails.ioc
        : InformationDetails.ioc.slice(0, 3);
});

const toggleExpand = () => {
    isExpanded.value = !isExpanded.value;
};

const downloadPackage = (url) => {
    window.open(url, '_blank');
};

const downloadPOC = (url) => {
    window.open(url, '_blank');
};

const codeColumns = [
    {
        title: '漏洞触发类',
        dataIndex: 'fullclassname',
    },
    {
        title: '漏洞触发方法名',
        dataIndex: 'method_name',
        width: 140,
    },
    {
        title: '漏洞触发方法参数',
        dataIndex: 'parameter',
        width: 140,
    },
    {
        title: '参数数量',
        dataIndex: 'parameter_nums',
        width: 100,
    },
    {
        title: '参数偏移',
        dataIndex: 'parameter_space',
        width: 100,
    },
    {
        title: '需要请求可控',
        dataIndex: 'need_request_control',
        customRender: ({ text }) => (text ? '是' : '否'),
        width: 120,
    },
    {
        title: '影响子类',
        dataIndex: 'affect_subclass',
        customRender: ({ text }) => (text ? '是' : '否'),
        width: '100px',
        minWidth: 100,
    },
];

const configColumns = [
    {
        title: '触发的配置文件路径',
        dataIndex: 'file_path',
    },
    {
        title: '触发的配置文件内容正则',
        dataIndex: 'vuln_config',
    },
];

// 打开url
const openUrl = (url) => {
    window.open(url, '_blank');
};

</script>
