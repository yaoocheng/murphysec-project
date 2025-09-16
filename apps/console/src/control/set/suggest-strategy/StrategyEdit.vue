<template>
    <el-dialog align-center :title="!editData.id ? '添加处置等级策略' : '编辑处置等级策略'" width="840px" :close-on-click-modal="false"
               @close="closeHandle">
        <el-form style="height: calc(100vh - 232px);overflow: auto;" :model="editData" label-position="top">
            <div class="text-base font-medium mb-2">
                <span class="text-err mr-1">*</span>策略基本信息
            </div>

            <div class="rounded-md bg-f7 p-6 mb-8">
                <el-form-item required :show-message="false" label="策略名称" prop="name">
                    <el-input v-model="editData.name" placeholder="请输入策略名称" maxlength="30" show-word-limit />
                </el-form-item>
                <el-form-item label="策略说明" prop="desc">
                    <el-input v-model="editData.desc" type="textarea" :rows="4" resize="none" placeholder="请输入策略说明"
                              maxlength="500" show-word-limit />
                </el-form-item>
                <el-form-item required :show-message="false" style="margin-bottom: 0;" label="是否开启策略" prop="is_open"
                              label-position="right">
                    <el-switch v-model="editData.is_open" :active-value="1" :inactive-value="2" />
                </el-form-item>
            </div>

            <div class="text-base font-medium mb-2">
                <span class="text-err mr-1">*</span>处置等级策略
            </div>

            <div v-for="(suggestItem, index) in editData.strategy_info.rules" :key="index"
                 class="rounded-md bg-f7 p-6 pb-5 mb-4">
                <div class="font-medium mb-1">{{ SuggestLevel[index] }}</div>
                <div class="text-85 mb-6">各条件之间默认为 “且”的关系，需同时满足</div>

                <div class="flex items-center gap-4 mb-4">
                    <el-select class="flex-1" v-model="selectValue[index].comp" multiple placeholder="组件条件">
                        <el-option v-for="item in compOptions" :key="item.value" :label="item.label"
                                   :value="item.value" />
                        <template #tag>
                            <span>组件条件</span>
                            <!-- <span v-for="ele in selectValue[index].comp" :key="ele">{{ suggestConf[ele]?.label }}</span> -->
                        </template>
                        <template #prefix>
                            <SvgIcon name="comp" class="w-4 h-4 align-[-3px]" />
                        </template>
                    </el-select>

                    <el-select class="flex-1 w-0" v-model="selectValue[index].vuln" multiple placeholder="漏洞条件">
                        <el-option v-for="item in vulnOptions" :key="item.value" :label="item.label"
                                   :value="item.value" />
                        <template #tag>
                            <div class="ellipsis">
                                <!-- <SvgIcon v-if="selectValue[index].vuln.length" name="vuln"
                                    class="w-4 h-4 ml-2 align-[-3px] mr-2" /> -->
                                <!-- <span class="mr-2" v-for="ele in selectValue[index].vuln" :key="ele">{{
                                    suggestConf[ele]?.label }}</span> -->
                                <span>漏洞条件</span>
                            </div>
                        </template>
                        <template #prefix>
                            <SvgIcon name="vuln" class="w-4 h-4 align-[-3px]" />
                        </template>
                    </el-select>
                </div>

                <div class="flex items-center rounded-md mb-1 h-12 px-3 bg-[#EBEBEB80]"
                     v-for="(condition, i) in [...selectValue[index].comp, ...selectValue[index].vuln]" :key="i">
                    <div class="flex-1 flex items-center font-medium">
                        <SvgIcon v-if="condition.includes('comp')" name="comp" class="w-4 h-4 mr-2" />
                        <SvgIcon v-if="condition.includes('vuln')" name="vuln" class="w-4 h-4 mr-2" />
                        {{ suggestConf[condition]?.label }}
                    </div>

                    <div class="flex-1">
                        {{ suggestConf[condition]?.express }}
                    </div>

                    <div class="flex-[2]">
                        <span @click="curSuggestComp = index; showCompList = true" class="hover_icon"
                              v-if="suggestConf[condition]?.type === 3 && condition.includes('comp')">组件列表（{{
                                  editData.strategy_info.rules[index][condition]?.length || 0 }}）</span>
                        <span @click="curSuggestVuln = index; showVulnList = true" class="hover_icon"
                              v-else-if="suggestConf[condition]?.type === 3 && condition.includes('vuln')">漏洞列表（{{
                                  editData.strategy_info.rules[index][condition]?.length || 0 }}）</span>
                        <el-select v-else class="flex-1" v-model="editData.strategy_info.rules[index][condition]"
                                   :multiple="suggestConf[condition]?.type === 2">
                            <el-option v-for="item in suggestConf[condition]?.option" :key="item.value"
                                       :label="item.label" :value="item.value" />
                        </el-select>
                    </div>

                    <span class="button-icon-grey ml-4 box-border">
                        <i @click="deleteCondition(index, condition)" class="murphy icon-shanchu2 cursor-pointer"
                           style="font-size: 12px;"></i>
                    </span>
                </div>
            </div>

            <div class="text-base font-medium mb-2 mt-8">
                <span class="text-err mr-1">*</span>兜底策略
            </div>
            <div class="rounded-md bg-f7 p-6 mb-8">
                <div class="flex items-center mb-6">
                    当组件未命中任何处置等级策略时，则默认为
                    <el-select class="ml-2 flex-1" v-model="editData.strategy_info.final.unhit">
                        <el-option v-for="item in unhitOptions" :key="item.value" :label="item.label"
                                   :value="item.value" />
                    </el-select>
                </div>

                <div class="flex items-center">
                    当组件同时满足多个处置等级条件时，则默认取
                    <el-select class="ml-2 flex-1" v-model="editData.strategy_info.final.hit_too_many">
                        <el-option v-for="item in hitTooManyOptions" :key="item.value" :label="item.label"
                                   :value="item.value" />
                    </el-select>
                </div>
            </div>

            <div class="text-base font-medium mb-2">
                <span class="text-err mr-1">*</span>应用范围
            </div>
            <div class="rounded-md bg-f7 p-6 pb-1">
                <el-form-item required label="策略范围">
                    <el-radio-group class="stra_range" v-model="editData.is_global" @change="editData.tags = []">
                        <el-radio :label="1">全部项目</el-radio>
                        <el-radio :label="2">指定项目</el-radio>
                    </el-radio-group>
                </el-form-item>

                <div v-if="editData.is_global === 2"
                     class="g-bg-ff g-bdr-6 g-w-100 g-border-box p-4 mb-6 pb-[1px] mt-[-8px]">
                    <el-form-item required label="项目标签">
                        <el-select class="g-w-100" v-model="editData.tags" :reserve-keyword="false" multiple filterable
                                   allow-create default-first-option placeholder="请搜索并选择项目标签">
                            <el-option v-for="item in tagList" :key="item.tag_id" :label="item.tag_name"
                                       :value="item.tag_id">
                                {{ item.tag_name }}（{{ item.tag_id }}）
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </div>
        </el-form>

        <CompList v-model="showCompList" :showData="editData.strategy_info.rules[curSuggestComp].comp_list"
                  v-if="showCompList" @confirm="compListConfirm" />
        <VulnList v-model="showVulnList" :showData="editData.strategy_info.rules[curSuggestVuln].vuln_no_list"
                  v-if="showVulnList" @confirm="vulnListConfirm" />

        <template #footer>
            <el-button class="minor_btn h-8 w-20" @click="closeHandle">取消</el-button>
            <el-button class="w-20" type="primary" @click="submitHandle" :disabled="isSubmitDisabled">确定</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import {
    ref, reactive, onBeforeMount, computed,
} from 'vue';
import { showMessage } from 'util/tools';
import { getProjectTagsApi } from 'api/project';
import { saveDetectSuggestLevelApi } from 'api/set';
import store from 'util/store';
import { SuggestLevel } from '@/constants';
import {
    compOptions, vulnOptions, suggestConf, unhitOptions, hitTooManyOptions,
} from './index';
import CompList from './CompList.vue';
import VulnList from './VulnList.vue';

const { editRowData } = defineProps(['editRowData']);
const emits = defineEmits(['update:modelValue', 'updateList']);
const tagList = ref<any[]>([]);
const showCompList = ref(false); // 控制组件列表弹窗的显示状态
const showVulnList = ref(false); // 控制漏洞列表弹窗的显示状态
const curSuggestComp = ref(); // 当前选中的处置等级索引（用于组件列表）
const curSuggestVuln = ref(); // 当前选中的处置等级索引（用于漏洞列表）
const selectValue = reactive<any>({ // 存储各处置等级已选择的组件和漏洞条件
    strong_recommend: {
        comp: [],
        vuln: [],
    },
    recommend: {
        comp: [],
        vuln: [],
    },
    optional: {
        comp: [],
        vuln: [],
    },
});
const editData = reactive<any>({ // 编辑数据对象，存储策略的所有信息
    id: undefined, // 策略ID
    name: '', // 策略名称
    desc: '', // 策略描述
    is_open: 1, // 是否开启：1-是， 其他-否
    is_global: 1, // 是否应用到全局：1-是， 其他-否
    tags: [], // 标签ID列表
    strategy_info: {
        rules: { // 没设置的条件，相应字段将不存在
            strong_recommend: {},
            recommend: {}, // 同StrongRecommend的
            optional: {}, //  同StrongRecommend的
        },
        final: {
            unhit: 'Optional', // 当没有命中任何条件时，则默认的处置等级: 强烈建议修复-StrongRecommend,建议修复-Recommend,可选修复-Optional， 系统默认处置等级  - Origin
            hit_too_many: 'highest', // 当命中多个条件时， 则默认的处置等级:最高处置等级-highest 、   最低处置等级 - lowest  、  系统默认处置等级  - origin
        },
    },
});

if (editRowData) {
    Object.assign(editData, editRowData);
    editData.strategy_info.rules = {
        strong_recommend: {},
        recommend: {},
        optional: {},
        ...editData.strategy_info.rules,
    };
}

onBeforeMount(async () => {
    try {
        const { data } = await getProjectTagsApi({
            team_id: store.teamInfo.team_id,
        });
        tagList.value = data;

        // 初始化selectValue
        Object.entries(editData.strategy_info.rules).forEach(([level, rules]: any[]) => {
            // 遍历每个规则的属性
            Object.keys(rules).forEach((key) => {
                if (key.includes('comp')) {
                    selectValue[level].comp.push(key);
                } else if (key.includes('vuln')) {
                    selectValue[level].vuln.push(key);
                }
            });
        });
    } catch (error) {
        console.log(error);
    }
});

// 删除条件
const deleteCondition = (suggestName: any, condition: string) => {
    // 从selectValue中删除条件
    const type = condition.includes('comp') ? 'comp' : 'vuln';
    const index = selectValue[suggestName][type].indexOf(condition);
    if (index > -1) {
        selectValue[suggestName][type].splice(index, 1);
    }

    // 从editData.strategy_info.rules中删除属性
    if (editData.strategy_info.rules[suggestName] && editData.strategy_info.rules[suggestName][condition]) {
        delete editData.strategy_info.rules[suggestName][condition];
    }
};

// 选择标签
// const changeTagNames = (value: string[]) => {
//     console.log(editData.tags);

//     // if (value.length && value[value.length - 1].length > 10) {
//     //     value.pop();
//     //     showMessage('长度不能超过10个字符', 'warning');
//     // }
// };

// 组件列表确认回调
const compListConfirm = (list: any[]) => {
    editData.strategy_info.rules[curSuggestComp.value].comp_list = list;
};

// 漏洞列表确认回调
const vulnListConfirm = (list: string[]) => {
    editData.strategy_info.rules[curSuggestVuln.value].vuln_no_list = list;
};

// 关闭弹框
const closeHandle = () => {
    emits('update:modelValue', false);
};

// 提交表单
const submitHandle = async () => {
    // 删除没有选择条件的处置等级
    Object.entries(selectValue).forEach(([level, value]: [string, any]) => {
        if (value.comp.length === 0 && value.vuln.length === 0) {
            delete editData.strategy_info.rules[level];
        }
    });

    let tags: any = [];
    if (editData.tags.length) {
        tags = editData.tags.map((item: any) => {
            const findIndex = tagList.value.findIndex((ele) => item === ele.tag_id);
            if (findIndex !== -1) {
                return tagList.value[findIndex].tag_name;
            }
            return item;
        });
    }

    try {
        await saveDetectSuggestLevelApi({
            ...editData,
            tags,
        });

        showMessage('保存成功', 'success');
        emits('updateList');
        closeHandle();
    } catch (error: any) {
        console.error(error);
    }
};

// 计算属性：检查必填项是否已填写
const isSubmitDisabled = computed(() => {
    // 检查策略名称是否为空
    if (!editData.name.trim()) return true;

    // 检查兜底策略是否已选择
    if (!editData.strategy_info.final.unhit || !editData.strategy_info.final.hit_too_many) return true;

    // 如果选择了指定项目，检查是否选择了项目标签
    if (editData.is_global === 2 && (!editData.tags || editData.tags.length === 0)) return true;

    // 检查是否至少有一个处置等级选择了条件并且所有选择的条件都有值
    const hasValidCondition = Object.entries(selectValue).some(([level, value]: [string, any]) => {
        // 检查是否有选择条件
        if (value.comp.length === 0 && value.vuln.length === 0) return false;

        // 检查所有选择的条件是否都有值
        return [...value.comp, ...value.vuln].every((condition) => {
            const conditionValue = editData.strategy_info.rules[level]?.[condition];
            return conditionValue;
        });
    });
    if (!hasValidCondition) return true;

    return false;
});
</script>

<style lang="less" scoped>
.hover_icon {
    &:hover {
        background-color: #6C87FF1A;
    }

    color: @primary
}

:deep(.el-select__selected-item .el-tag) {
    background-color: #2A2B321A;
}
</style>
