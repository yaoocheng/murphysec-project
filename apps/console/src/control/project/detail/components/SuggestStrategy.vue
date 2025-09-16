<template>
    <el-dialog width="840px" align-center title="处置等级策略详情" :close-on-click-modal="false">
        <div class="h-[calc(100vh-176px)] overflow-auto">
            <!-- 策略基本信息 -->
            <div class="text-base font-medium mb-2">
                策略基本信息
            </div>
            <div class="rounded-md bg-f7 p-6 mb-8">
                <div class="mb-4">
                    <div class="text-sm text-3c font-medium mb-2">策略名称</div>
                    <div class="w-full font-normal text-sm">{{ info.name }}</div>
                </div>

                <div class="mb-4">
                    <div class="text-sm text-3c font-medium mb-2">策略说明</div>
                    <div class="w-full font-normal text-sm">{{ info.desc || '-' }}</div>
                </div>

                <div>
                    <div class="text-sm text-3c font-medium mb-2">是否开启策略</div>
                    <div class="text-sm font-normal">{{ info.is_open === 1 ? '已开启' : '未开启' }}</div>
                </div>
            </div>

            <!-- 处置等级策略 -->
            <div class="text-base font-medium mb-2">
                处置等级策略
            </div>
            <div v-for="(rules, level) in info.strategy_info.rules" :key="level" class="rounded-md bg-f7 p-6 mb-4">
                <div class="font-medium mb-1">{{ {
                    'strong_recommend': '强烈建议修复', 'recommend': '建议修复', 'optional':
                        '可选修复'
                }[level] }}</div>
                <div class="font-normal mb-6 text-85">各条件之间默认为 “且”的关系，需同时满足</div>

                <div class="flex items-center rounded-md mb-1 h-12 px-3 bg-[#EBEBEB80]"
                     v-for="(value, condition) in rules" :key="condition">
                    <div class="flex-1 flex items-center">
                        <SvgIcon v-if="String(condition).includes('comp')" name="comp" class="w-4 h-4 mr-2" />
                        <SvgIcon v-if="String(condition).includes('vuln')" name="vuln" class="w-4 h-4 mr-2" />
                        {{ suggestConf[condition]?.label }}
                    </div>

                    <div class="flex-1">
                        {{ suggestConf[condition]?.express }}
                    </div>

                    <div class="flex-[2]">
                        <span class="hover_icon" @click="showCompList = true; compListData = value"
                              v-if="suggestConf[condition]?.type === 3 && String(condition).includes('comp')">组件列表（{{
                                  value?.length }}）</span>
                        <span class="hover_icon" @click="showVulnList = true; vulnListData = value?.map((_:any)=>({id: _}))"
                              v-else-if="suggestConf[condition]?.type === 3 && String(condition).includes('vuln')">漏洞列表（{{
                                  value?.length }}）</span>
                        <div v-else-if="Array.isArray(value)">
                            <TagComp class="mr-1" v-for="tag in value" :key="tag"
                                     :content="suggestConf[condition]?.option?.find((_: any) => _.value === tag)?.label"
                                     bgc="#2A2B321A" c="#3c3c3c" />
                        </div>
                        <span v-else>{{ suggestConf[condition]?.option.find((_: any) => _.value === value)?.label
                        }}</span>
                    </div>
                </div>
            </div>

            <!-- 兜底策略 -->
            <div class="text-base font-medium mb-2">
                兜底策略
            </div>
            <div class="rounded-md bg-f7 p-6 mb-8">
                <div class="mb-4">当组件未命中任何处置等级策略时，则默认为：<span class="font-medium">「{{ unhitOptions.find(item =>
                    item.value === info.strategy_info.final.unhit)?.label }}」</span></div>
                <div>当组件同时满足多个处置等级条件时，则默认取：<span class="font-medium">「{{ hitTooManyOptions.find(item => item.value ===
                    info.strategy_info.final.hit_too_many)?.label }}」</span></div>
            </div>

            <!-- 应用范围 -->
            <div class="text-base font-medium mb-2">
                应用范围
            </div>
            <div class="rounded-md bg-f7 p-6">
                <div v-if="info.is_global === 1">
                    <div class="mb-2 font-medium">策略范围</div>
                    全部项目
                </div>
                <div v-else>
                    <div class="mb-3 font-medium">包含以下标签的项目应用该策略</div>
                    <div class="flex gap-2 flex-wrap">
                        <template v-if="info.tags?.length">
                            <TagComp class="mr-1" v-for="tag in info.tags" :key="tag" :content="tag" bgc="#2A2B321A"
                                     c="#3c3c3c" />
                        </template>
                        <template v-else>-</template>
                    </div>
                </div>
            </div>
        </div>

        <el-dialog v-model="showCompList" width="840px" align-center title="组件列表">
            <div class="text-sm font-normal text-85 mb-6 mt-[-16px]">
                组件之间为“或”的关系
            </div>
            <div class="g-color-3 g-f-14 mb-3">共 <span class="g-color-1">{{ compListData.length }}</span> 条数据</div>
            <div class="max-h-[500px]">
                <el-table :data="compListData" height="100%" :cell-style="{ padding: '12px 0', color: '#3c3c3c' }"
                          :header-cell-style="{ padding: '12px 0', border: 'none', background: '#F7F8FB', color: '#8F959E', fontWeight: 400 }"
                          style="width: 100%">
                    <el-table-column prop="comp_name" label="组件名称" />
                    <el-table-column width="140" prop="ecosystem" label="生态" />
                </el-table>
            </div>
        </el-dialog>

        <el-dialog v-model="showVulnList" width="840px" align-center title="漏洞列表">
            <div class="text-sm font-normal text-85 mb-6 mt-[-16px]">
                漏洞之间为“或”的关系
            </div>
            <div class="g-color-3 g-f-14 mb-3">共 <span class="g-color-1">{{ vulnListData.length }}</span> 条数据</div>
            <div class="max-h-[500px]">
                <el-table :data="vulnListData" height="100%" :cell-style="{ padding: '12px 0', color: '#3c3c3c' }"
                          :header-cell-style="{ padding: '12px 0', border: 'none', background: '#F7F8FB', color: '#8F959E', fontWeight: 400 }"
                          style="width: 100%">
                    <el-table-column prop="id" label="漏洞编号" />
                </el-table>
            </div>
        </el-dialog>
    </el-dialog>
</template>

<script setup lang="ts">
import { onBeforeMount, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { suggestConf, hitTooManyOptions, unhitOptions } from '@/control/set/suggest-strategy/index';
import { getDetectionSuggestLevelApi } from '@/api/detail';

const { strategyName } = defineProps(['strategyName']);
const route = useRoute();
const showCompList = ref(false);
const compListData = ref([]);
const showVulnList = ref(false);
const vulnListData = ref([]);

const info: any = reactive({
    name: '默认策略',
    desc: '',
    is_open: 1,
    is_global: 1,
    tags: [],
    strategy_info: {
        rules: {
            strong_recommend: {
                vuln_suggest_level: ['StrongRecommend'],
            },
            recommend: {
                vuln_suggest_level: ['Recommend'],
            },
            optional: {
                vuln_suggest_level: ['Optional'],
            },
        },
        final: {
            unhit: 'Optional',
            hit_too_many: 'highest',
        },
    },
});

onBeforeMount(async () => {
    try {
        const { data } = await getDetectionSuggestLevelApi({
            project_id: route.params.tid,
            subtask_id: route.params.sid,
            detection_suggest_level_rule_file_name: strategyName,
        });
        if (data.name) {
            Object.assign(info, data);
        }
    } catch (error) {
        console.log(error);
    }
});

</script>

<style lang="less" scoped>
.hover_icon {
    &:hover {
        background-color: #6C87FF1A;
    }

    color: @primary;
}
</style>
