<template>
    <a-tabs class='range-of-impact' v-model:activeKey="activeKey">
        <a-tab-pane v-for="tab in tabs.filter(item => item.content.length > 0)" :key="tab.key">
            <template #tab>
                <span class="flex items-center gap-1">
                    {{ tab.title }}（{{ tab.content.length || 0 }}）
                    <a-tooltip overlayClassName="range-of-impact-tooltip">
                        <template #title>
                            <div class="text-left text-xs">
                                {{ tab.tooltip }}
                            </div>
                        </template>
                        <Svg name="maybe" width="14px" height="14px" :color="activeKey === tab.key ? '#6C87FF ' : '#3C3C3C'"></Svg>
                    </a-tooltip>
                </span>
            </template>
            <div class="flex flex-col gap-6 p-6 bg-[#F2F2F280] rounded-md">
                <div v-for="(item,index) in tab.content" :key="item.name" class="flex flex-col gap-[10px] ">
                    <div class="flex items-center gap-[8px]">
                        <span>{{ (index + 1) + '. ' + item.name }}</span>
                        <Tag :text="item.software_type === 'application' ? '应用软件' : '组件'" type="software_type" />
                        <Tag :text="item.is_opensource == true ? '开源' : '闭源'" type="software_type" />
                        <div v-if="item.software_type === 'component'">
                            <Tag :text="'仓库' + '：' + item.repository" type="software_type" />
                        </div>
                    </div>
                    <div class="flex flex-col gap-2 p-4 bg-white">
                        <div v-for="(affected, index) in item.affected" :key="index" class="flex gap-4">
                            <div v-if="item.software_type === 'application'" class="flex gap-1">
                                <span class="text-gray-400 text-xs font-normal">供应商</span>
                                <span class="text-gray-700 text-xs font-normal">{{ item.vendor }}</span>
                            </div>
                            <div class="flex gap-1">
                                <span class="text-gray-400 text-xs font-normal">受影响版本</span>
                                <span class="text-gray-700 text-xs font-normal">{{ affected.version_range }}</span>
                            </div>
                            <div class="flex gap-1">
                                <span class="text-gray-400 text-xs font-normal">最小修复版本</span>
                                <span class="text-gray-700 text-xs font-normal">{{ affected.expression.fix_version || '-' }}</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </a-tab-pane>
    </a-tabs>
</template>

<script setup>
import { ref } from 'vue';

const { stream } = defineProps(['stream']);

const mergeItems = (items) => {
    const merged = {};

    items.forEach((item) => {
        const key = `${item.name}_${item.repository}`;

        if (!merged[key]) {
            merged[key] = { ...item };
            merged[key].affected = [item.affected];
        } else if (!merged[key].affected.includes(item.affected)) {
            // 将新的affected添加到数组中
            merged[key].affected.push(item.affected);
        }
    });

    return Object.values(merged);
};

const mergedStream = mergeItems(stream);

const activeKey = ref('1');

const tabs = [
    {
        key: '1',
        title: '上游软件',
        content: mergedStream.filter((item) => item.upstream),
        tooltip: '指基于官方版本的分支版本，如ubuntu中的curl是基于官方版本自行维护的分支版本',
    },
    {
        key: '2',
        title: '下游软件',
        content: mergedStream.filter((item) => !item.upstream),
        tooltip: '指软件的官方版本，代码通常由上游开发者先行提交，下游开发者在其基础上进行调整',
    },
];

</script>

<style>
.range-of-impact-tooltip {
    .ant-tooltip-inner{
        padding:  12px 8px;
    }
}
</style>
