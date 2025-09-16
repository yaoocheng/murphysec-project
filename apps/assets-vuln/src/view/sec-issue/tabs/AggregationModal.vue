<template>
    <a-modal title="漏洞聚合分析" width="840px" centered :footer="false" :maskClosable="false">
        <div class="aggregation-modal bg-white rounded-[6px] w-full mt-4">
            <!-- 头部区域 -->
            <!-- <div class="modal-header flex justify-between items-center mb-[24px]">
                <div class="title-section flex flex-col justify-center gap-[4px]">
                    <h2 class="text-[16px] font-medium text-[#3C3C3C] leading-[1.5em]" style="font-family: 'PingFang SC', sans-serif; width: 520px;">
                        漏洞聚合分析
                    </h2>
                </div>
                <div class="close-icon w-[20px] h-[20px] cursor-pointer flex items-center justify-center" @click="handleClose">
                    <svg width="15.12" height="15.12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4L4 12M4 4L12 12" stroke="#3C3C3C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
            </div> -->

            <!-- 提示信息区域 -->
            <div class="priority-section mb-[24px] flex items-center px-[24px] py-[10px] rounded-[3px] w-full"
                 style="background: linear-gradient(270deg, rgba(108, 135, 255, 0.05) 0%, rgba(178, 115, 255, 0.05) 100%);
 border: 1px solid; border: 1px solid rgba(178, 115, 255, 0.05);">
                <div class="flex items-center gap-[8px] w-full">
                    <!-- 星形图标 -->
                    <div class="flex-shrink-0" style="width: 24px; height: 24px;">
                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin: 1px;">
                            <path d="M14.3 7.69999L9.90001 6.04999L14.3 4.39834L15.95 0L17.6016 4.39834L22 6.04999L17.6016 7.69999L15.95 12.1L14.3 7.69999ZM5.49997 16.5L0 14.3L5.49997 12.1L7.69999 6.60001L9.90001 12.1L15.4 14.3L9.90001 16.5L7.69999 22L5.49997 16.5Z" fill="url(#paint0_linear_priority_figma)"/>
                            <defs>
                                <linearGradient id="paint0_linear_priority_figma" x1="22" y1="11" x2="0" y2="11" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#B273FF"/>
                                    <stop offset="1" stop-color="#6C87FF"/>
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>

                    <!-- 文本内容 -->
                    <div class="ai-text" style="font-family: 'PingFang SC', sans-serif; font-weight: 500; font-size: 15px; line-height: 1.5em; background: linear-gradient(270deg, #6C87FF 0%, #B273FF 100%); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                        墨思已为您聚合以下同源漏洞，并对其聚合原因进行了智能分析
                    </div>
                    <!-- <div class="text-[15px] font-medium leading-[1.5em] flex-1"
                             style="color: white; font-family: 'PingFang SC', sans-serif; font-weight: 500; font-size: 15px; background: linear-gradient(270deg, #6C87FF 0%, #B273FF 100%);
 background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                            墨思已为您智能聚合了 {{ vulnerabilityTotal || 'X' }} 个同源漏洞，一次修复即可解决全部漏洞
                        </div> -->
                </div>
            </div>

            <!-- 主要内容区域 -->
            <!-- 被合并漏洞区域 -->
            <div class="merged-vulnerabilities rounded-[3px] mb-6 border border-[rgba(230,230,230,0.4)]">
                <div class="text-[14px] font-normal text-[#999999] leading-[1.5em] mb-[12px]"
                     style="font-family: 'PingFang SC', sans-serif;">
                    被聚合漏洞
                </div>

                <div class="vulnerability-list flex flex-col gap-[16px]">
                    <!-- 漏洞项1 -->
                    <div
                        class="vulnerability-item bg-[#fff] rounded-[6px] flex justify-between items-center gap-[10px] px-[20px] py-[16px]">
                        <div class="vulnerability-info flex flex-col gap-[8px] flex-1 w-full">
                            <div class="vulnerability-header flex items-center gap-[8px] w-full">
                                <span class="severity-tag flex-shrink-0"
                                      :style="{
                                          backgroundColor: getDangerLevel(mergeVulns.severity).bgc,
                                          color: getDangerLevel(mergeVulns.severity).color
                                      }">
                                    {{ getDangerLevel(mergeVulns.severity).text }}
                                </span>
                                <div class="vulnerability-title  gap-[4px] truncate">
                                    <span class="text-[15px] font-medium text-[#3C3C3C] leading-[1.5em]"
                                          style="font-family: 'PingFang SC', sans-serif;">
                                        {{ mergeVulns.title }}
                                    </span>
                                </div>
                            </div>
                            <div class="vulnerability-details flex items-center gap-[12px]">
                                <span class="text-[12px] font-normal text-[#8C8C8C] leading-[1.5em]"
                                      style="font-family: 'PingFang SC', sans-serif;">
                                    类型：{{ mergeVulns.vulnerability_type }}
                                </span>
                                <span class="text-[12px] font-normal text-[#8C8C8C] leading-[1.5em]"
                                      style="font-family: 'PingFang SC', sans-serif;">
                                    状态：{{ VULN_STATUS_OPTION.find(item => item.value === mergeVulns?.status)?.label }}
                                </span>
                                <span class="text-[12px] font-normal text-[#8C8C8C] leading-[1.5em]"
                                      style="font-family: 'PingFang SC', sans-serif;">
                                    安全能力：{{ mergeVulns.security_capability || '未知' }}
                                </span>
                                <span class="text-[12px] font-normal text-[#8C8C8C] leading-[1.5em]"
                                      style="font-family: 'PingFang SC', sans-serif;">
                                    所属载体：{{ mergeVulns.carrier_name || '未知' }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- 漏洞项2 -->
                    <div
                        class="vulnerability-item bg-[#fff] rounded-[6px] flex justify-between items-center gap-[10px] px-[20px] py-[16px]">
                        <div class="vulnerability-info flex flex-col gap-[8px] flex-1 w-full">
                            <div class="vulnerability-header flex items-center gap-[8px]">
                                <span class="severity-tag flex-shrink-0"
                                      :style="{
                                          backgroundColor: getDangerLevel(mergeVulns.merge_vuln?.severity).bgc,
                                          color: getDangerLevel(mergeVulns.merge_vuln?.severity).color
                                      }">
                                    {{ getDangerLevel(mergeVulns.merge_vuln?.severity).text }}
                                </span>
                                <div class="vulnerability-title flex items-center gap-[4px] w-full truncate">
                                    <span class="text-[15px] font-medium text-[#3C3C3C] leading-[1.5em]"
                                          style="font-family: 'PingFang SC', sans-serif;">
                                        {{ mergeVulns.merge_vuln?.title }}
                                    </span>
                                </div>
                            </div>
                            <div class="vulnerability-details flex items-center gap-[12px]">
                                <span class="text-[12px] font-normal text-[#8C8C8C] leading-[1.5em]"
                                      style="font-family: 'PingFang SC', sans-serif;">
                                    类型：{{ mergeVulns.merge_vuln?.vulnerability_type }}
                                </span>
                                <span class="text-[12px] font-normal text-[#8C8C8C] leading-[1.5em]"
                                      style="font-family: 'PingFang SC', sans-serif;">
                                    状态：{{ VULN_STATUS_OPTION.find(item => item.value === mergeVulns.merge_vuln?.status)?.label }}
                                </span>
                                <span class="text-[12px] font-normal text-[#8C8C8C] leading-[1.5em]"
                                      style="font-family: 'PingFang SC', sans-serif;">
                                    安全能力：{{ mergeVulns.merge_vuln?.security_capability || '未知' }}
                                </span>
                                <span class="text-[12px] font-normal text-[#8C8C8C] leading-[1.5em]"
                                      style="font-family: 'PingFang SC', sans-serif;">
                                    所属载体：{{ mergeVulns.merge_vuln?.carrier_name || '未知' }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 合并原因区域 -->
            <div class="text-[14px] font-normal text-[#999999] leading-[1.5em] mb-[8px]"
                 style="font-family: 'PingFang SC', sans-serif;">
                聚合原因
            </div>
            <div class="merge-reason rounded-[3px] p-6 flex flex-col gap-[12px]"
                 style="border: 1px solid #E6E6E6A6;">
                <MarkDown :text="mergeVulns.merge_reason" />

                <!-- <div class="reason-content flex flex-col gap-[12px]">
                    <p class="text-[14px] font-normal text-[#3C3C3C] leading-[1.5em] max-w-[520px]"
                       style="font-family: 'PingFang SC', sans-serif;">
                        通过代码指纹（Code Fingerprint）与依赖关系图（Dependency
                        Graph）交叉比对，确认以下漏洞源于同一安全缺陷。该缺陷在源代码阶段被SAST识别，并随代码构建打包进入制品，被SCA在制品中再次识别。
                    </p>

                    <div class="reason-details flex flex-col gap-[8px]">
                        <div class="reason-item flex items-center gap-[8px]">
                            <span class="text-[14px] font-normal text-[#52C41A] leading-[1.5em]"
                                  style="font-family: 'PingFang SC', sans-serif;">
                                漏洞类型一致_(CWE-89: SQL Injection)
                            </span>
                        </div>
                        <span class="text-[14px] font-normal text-[#52C41A] leading-[1.5em]"
                              style="font-family: 'PingFang SC', sans-serif;">
                            代码特征相似度 > 95%
                        </span>
                        <span class="text-[14px] font-normal text-[#52C41A] leading-[1.5em]"
                              style="font-family: 'PingFang SC', sans-serif;">
                            依赖组件及版本相同 (log4j:2.17.1)
                        </span>
                    </div>
                </div> -->
            </div>
        </div>
    </a-modal>
</template>

<script setup>
import { VULN_STATUS_OPTION } from '@/constants/app';
import { getDangerLevel } from '@/utils';

defineProps(['mergeVulns']);
</script>

<style scoped>
/* 自定义样式 */
.aggregation-modal {
    /* box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); */
}

.vulnerability-item {
    transition: all 0.2s ease;
    border: 1px solid #E6E6E6A6;
}

.vulnerability-item:hover {
    background-color: #FFFFFF;
}

.close-icon:hover {
    opacity: 0.7;
}

/* 漏洞等级标签样式 */
.severity-tag {
    display: inline-block;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    color: white;
}
</style>
