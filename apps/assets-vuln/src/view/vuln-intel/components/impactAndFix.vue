<template>
    <div class="flex flex-col gap-4" id="3">
        <span class="tab-title">影响范围与处置建议</span>
        <div class="tab_card">
            <div class="header">
                <span>影响厂商/产品/软件</span>
            </div>
            <div class="body flex flex-col gap-8">
                <div>
                    <div class="text-gray-700 text-[13px] font-medium mb-3">影响范围</div>
                    <div class="p-6 bg-white border border-solid border-gary-100 rounded-md">
                        <RangeOfImpact :stream="InformationDetails.affected_version" />
                    </div>
                </div>
                <div v-if="InformationDetails?.solutions?.filter(item => item.type !== '升级').length > 0">
                    <div class="text-gray-700 text-[13px] font-medium mb-3">处置建议（非升级修复方案）</div>
                    <div class="grid grid-cols-3 gap-4">
                        <div v-for="(item, index) in InformationDetails.solutions.filter(item => item.type !== '升级')" :key="index"
                             class="px-6 py-5 bg-white rounded-md border-solid border-[1px] border-[#E6E6E6]">
                            <div>
                                <!-- 简介部分 -->
                                <a-tooltip>
                                    <template #title>{{ item.description }}</template>
                                    <span class="text-xs text-gray-700 line-clamp-2 overflow-hidden text-ellipsis">{{ item.description }}</span>
                                </a-tooltip>

                                <!-- 标签部分 -->
                                <div class="flex gap-1">
                                    <span v-for="(tag, tagIndex) in item.tags"
                                          :key="tagIndex"
                                          class="px-2 py-1 bg-[#F2F2F2] text-xs text-[#666666] rounded">
                                        {{ tag }}
                                    </span>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <!-- CPE信息 -->
        <div v-if="InformationDetails.cpe?.length > 0" class="tab_card">
            <div class="header">
                <span>CPE信息</span>
            </div>
            <div class="body flex flex-col gap-2">
                <div v-for=" item in isExpanded ? InformationDetails.cpe : InformationDetails.cpe.slice(0, 3)"
                     :key="item"
                     class="flex items-center gap-2 text-sm text-[#3C3C3C]">
                    <div class="w-[6px] h-[6px] rounded-full bg-[#3C3C3C]"></div>
                    {{ item }}
                </div>

                <div v-if="InformationDetails.cpe?.length > 3"
                     class="flex items-center text-button-blue gap-[6px] cursor-pointer"
                     @click="toggleExpand">
                    {{ isExpanded ? '收起' : '查看更多' }}
                    <Svg color="#6C87FF" height="12px" width="12px" name="arrow" :class="{ 'rotate-180': isExpanded }"></Svg>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import RangeOfImpact from './RangeOfImpact.vue';

const { InformationDetails } = defineProps(['InformationDetails']);

const isExpanded = ref(false);

const toggleExpand = () => {
    isExpanded.value = !isExpanded.value;
};

</script>
