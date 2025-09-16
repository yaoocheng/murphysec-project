<template>
    <div class="flex flex-col gap-4" id="baseInfo">
        <span class="tab-title">基本信息</span>
        <div class="grid grid-cols-2 gap-4 bg-[#F2F2F280] p-6 rounded-md">
            <div v-for="(item, index) in vulnIds" :key="index" class="flex flex-col gap-1">
                <span class="text-[#999999] text-xs">{{ item.label }}</span>
                <span class="text-[#3C3C3C] text-sm">{{ item.value || '-' }}</span>
            </div>
            <div class="flex flex-col gap-1 col-span-2">
                <span class="text-[#999999] text-xs">漏洞描述</span>
                <div class="relative">
                    <span
                        class="text-[#3C3C3C] text-sm leading-6 line-clamp-3"
                        :class="{ 'line-clamp-none': isExpanded }"
                    >
                        {{ InformationDetails.description || '-' }}
                    </span>
                    <div
                        v-if="showMoreButton"
                        class="text-button-blue gap-[6px]"
                        @click="isExpanded = !isExpanded"
                    >
                        {{ isExpanded ? '收起' : '查看全部' }}
                        <Svg height="12px" width="12px" name="arrow" color="#6C87FF" :class="{ 'rotate-180': isExpanded, 'rotate-0': !isExpanded }"></Svg>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const { InformationDetails } = defineProps(['InformationDetails']);
const isExpanded = ref(false);

// const description = '用友NC是用友网络科技股份有限公司推出的一款面向大中型企业及集团化企业的企业资源规划（ERP）解决方案。\n受影响版本中的 /portal/pt/psnImage/download 接口存在SQL注入漏洞，未授权的攻击者可构造恶意的 pk_psndoc 参数进行注入，窃取数据库敏感信息。用友NC是用友网络科技股份有限公司推出的一款面向大中型企业及集团化企业的企业资源规划（ERP）解决方案。\n受影响版本中的 /portal/pt/psnImage/download 接口存在SQL注入漏洞，未授权的攻击者可构造恶意的 pk_psndoc 参数进行注入，窃取数据库敏感信息。用友NC是用友网络科技股份有限公司推出的一款面向大中型企业及集团化企业的企业资源规划（ERP）解决方案。\n受影响版本中的 /portal/pt/psnImage/download 接口存在SQL注入漏洞，未授权的攻击者可构造恶意的 pk_psndoc 参数进行注入，窃取数据库敏感信息。用友NC是用友网络科技股份有限公司推出的一款面向大中型企业及集团化企业的企业资源规划（ERP）解决方案。\n受影响版本中的 /portal/pt/psnImage/download 接口存在SQL注入漏洞，未授权的攻击者可构造恶意的 pk_psndoc 参数进行注入，窃取数据库敏感信息。';

const showMoreButton = computed(() => InformationDetails.description && InformationDetails.description.split('\n').length > 3);

const vulnIds = [
    {
        label: '墨菲编号',
        value: InformationDetails.mps_id,
    },
    {
        label: 'CVE编号',
        value: InformationDetails.cve_id,
    },
    {
        label: 'CNVD编号',
        value: InformationDetails.cnvd_id,
    },
    // {
    //     label: 'CNNVD编号',
    //     value: InformationDetails.cnnvd_id,
    // },
    // {
    //     label: 'CAVD编号',
    //     value: InformationDetails.cavd_id,
    // },
    {
        label: '漏洞类型',
        value: `${InformationDetails.problem_type.meaning} (${InformationDetails.problem_type.cwe})`,
    },
];

</script>
