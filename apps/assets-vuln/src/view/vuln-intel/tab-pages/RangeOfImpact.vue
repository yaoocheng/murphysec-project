<template>
    <a-tabs class='range-of-impact' v-model:activeKey="activeKey">
        <a-tab-pane v-for="tab in tabs" :key="tab.key">
            <template #tab>
                <span class="flex items-center gap-1">
                    {{ tab.title }} ({{ tab.content.length || 0 }})
                    <a-tooltip>
                        <template #title>
                            <div class="text-left px-3 py-2 w-56 text-xs">
                                {{ tab.tooltip }}
                            </div>
                        </template>
                        <Svg name="maybe" width="14px" height="14px" :color="activeKey === tab.key ? '#6C87FF ' : '#3C3C3C'"></Svg>
                    </a-tooltip>
                </span>
            </template>
            <div class="flex gap-6 p-6 bg-[#F2F2F280] rounded-md">
                <div v-for="(item,index) in tab.content" :key="item.name" class="flex flex-col gap-[10px] ">
                    <div class="flex gap-[8px]">
                        <span>{{ (index + 1) + '. ' + item.name }}</span>
                        <span class="title">组件名称</span>
                        <span class="value">生态类型</span>
                    </div>
                    <div class="flex gap-2 p-4 bg-white">
                        {{ tab.content }}
                    </div>
                </div>
            </div>
        </a-tab-pane>
    </a-tabs>
</template>

<script setup>
import { ref } from 'vue';

const { stream } = defineProps(['stream']);

const activeKey = ref('1');

const tabs = [
    {
        key: '1',
        title: '上游软件',
        content: stream.filter((item) => item.upstream),
        tooltip: '指基于官方版本的分支版本，如ubuntu中的curl是基于官方版本自行维护的分支版本',
    },
    {
        key: '2',
        title: '下游软件',
        content: stream.filter((item) => !item.upstream),
        tooltip: '指软件的官方版本，代码通常由上游开发者先行提交，下游开发者在其基础上进行调整',
    },
];

</script>
