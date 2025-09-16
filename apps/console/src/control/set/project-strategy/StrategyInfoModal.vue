<template>
    <el-dialog width="1036px" top="5%" title="项目策略" :close-on-click-modal="false">
        <div class="edit_strategy">
            <div class="part_title">
                策略基本信息
            </div>
            <div class="part_content" style="padding-bottom: 1px;">
                <FormComp label-position="top" :hide-required-asterisk="false">
                    <el-form-item label="策略名称">
                        <div style="width: 100%;">
                            {{ info.name }}
                        </div>
                    </el-form-item>

                    <el-form-item v-if="info.desc" label="策略说明">
                        <div style="width: 100%;">
                            {{ info.desc }}
                        </div>
                    </el-form-item>
                </FormComp>
            </div>

            <div class="part_title">
                策略规则
                <div class="g-f-14 g-color-3 g-fw-400 g-mt-4">规则之间为“或”的关系，若项目检测后满足任意一项已开启的规则，则命中该策略</div>
            </div>
            <div class="part_content" v-if="info.strategy_info?.defect_comp_suggest">
                <div class="g-mb-16">
                    <span class="g-f-16 g-fw-500 g-color-1 g-mr-8">缺陷组件处置等级与数量</span>
                    <span class="g-fw-400 g-f-400 g-color-3">项目存在超过X个强烈建议修复（等级可选）的缺陷组件时阻断</span>
                </div>
                <div class="form">
                    <FormComp label-position="top" :hide-required-asterisk="false">
                        <el-form-item label="阻断条件">
                            <div style="width: 100%;">
                                {{ getRepaireLevelTool(info.strategy_info?.defect_comp_suggest?.suggest_levels).text }} >=
                                {{ info.strategy_info?.defect_comp_suggest?.num }} 时阻断
                            </div>
                        </el-form-item>
                    </FormComp>
                </div>
            </div>
            <div class="part_content" v-if="info.strategy_info?.defect_vuln_level">
                <div class="g-mb-16">
                    <span class="g-f-16 g-fw-500 g-color-1 g-mr-8">漏洞等级与数量</span>
                    <span class="g-fw-400 g-f-400 g-color-3">项目存在超过X个高危（等级可选）漏洞时阻断</span>
                </div>
                <div class="form">
                    <FormComp label-position="top" :hide-required-asterisk="false">
                        <el-form-item label="阻断条件">
                            <div style="width: 100%;">
                                {{ getDangerLevel(info.strategy_info?.defect_vuln_level?.levels).text }} >= {{
                                    info.strategy_info?.defect_vuln_level?.num }} 时阻断
                            </div>
                        </el-form-item>
                    </FormComp>
                </div>
            </div>

            <div v-if="info.strategy_info?.comps && info.strategy_info?.comps[0].comp_name"
                class="g-bg-f7 g-p-16 g-mb-16 g-bdr-6">
                <div>
                    <div class="form_title">
                        <div class="g-flex g-align-center g-color-1">
                            指定组件
                            <el-tooltip content="“指定组件”中多个组件之间为“或”的关系，当项目中存在任意一个指定组件的指定版本，则命中该规则" placement="top">
                                <i class="murphy icon-wenhaoxiao g-ml-4 g-mr-6"></i>
                            </el-tooltip>
                            <div class="g-f-14 g-fw-400 g-color-3">项目中存在指定组件的指定版本时阻断</div>
                        </div>
                    </div>

                    <div class="comp_item" style="margin-bottom: 0;">
                        <div style="color: #3c3c3c;margin-bottom: 16px;font-weight: 550;">
                            基本信息
                        </div>
                        <div v-for="item in info.strategy_info?.comps" :key="item.comp_name">
                            {{ item.comp_name }}
                            <span class="tag g-mr-8" style="transform: scale(1);" v-if="item.ecosystem">{{ item.ecosystem
                            }}</span>
                            <span class="tag" style="transform: scale(1);" v-for="ele in item.version" :key="ele">{{ ele
                            }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="info.strategy_info?.vuln?.length" class="g-bg-f7 g-p-16 g-mb-16 g-bdr-6">
                <div>
                    <div class="form_title g-color-1" style="justify-content: flex-start;">
                        指定漏洞
                        <el-tooltip content="“指定漏洞”中五个条件之间为“且”的关系；多个CVE/MPS编号之间为“或”的关系；多个漏洞级别是”或”的关系" placement="top">
                            <i class="murphy icon-wenhaoxiao g-ml-4 g-mr-6"></i>
                        </el-tooltip>
                        <div class="g-f-14 g-fw-400 g-color-3">项目中存在指定漏洞时阻断</div>
                    </div>

                    <div class="form g-mb-16" style="background-color: #fff;">
                        <FormComp label-position="top">
                            <el-form-item label="CVE编号" v-if="info.strategy_info?.vuln?.cve">
                                <div style="width: 100%;">
                                    <span v-for="item in info.strategy_info?.vuln?.cve" :key="item"
                                        class="tag content-tag">{{ item }}</span>
                                </div>
                            </el-form-item>
                            <el-form-item label="MPS编号" v-if="info.strategy_info?.vuln?.mps">
                                <div style="width: 100%;">
                                    <span v-for="item in info.strategy_info?.vuln?.mps" :key="item"
                                        class="tag content-tag">{{ item }}</span>
                                </div>
                            </el-form-item>
                            <el-form-item label="漏洞级别" v-if="info.strategy_info?.vuln?.level">
                                <div style="width: 100%;">
                                    <span v-for="item in info.strategy_info?.vuln?.level" :key="item"
                                        class="tag content-tag">{{ getDangerLevel(item).text }}</span>
                                </div>
                            </el-form-item>
                            <div class="g-mb-16" v-if="info.strategy_info?.vuln?.is_poc === true">
                                有POC
                            </div>
                            <div v-if="info.strategy_info?.vuln?.is_rec === true">
                                有RCE
                            </div>
                        </FormComp>
                    </div>
                </div>
            </div>

            <div class="part_title">
                应用范围
            </div>
            <div class="part_content">
                <div v-if="info.is_global === 1">
                    全部项目
                </div>
                <div v-else>
                    <div class="g-color-1 g-fw-500 g-mb-16">包含以下标签的项目应用该策略</div>
                    <div>
                        <span v-for="item in info.tags" :key="item" class="tag content-tag" style="display: inline-block;">{{ item }}</span>
                    </div>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang='ts'>
import { getDangerLevel, getRepaireLevelTool } from 'util/tools';
import FormComp from 'comp/FormComp.vue';

defineProps(['info']);

</script>

<style scoped lang='less'>
.edit_strategy {
    // position: absolute;
    // left: 0;
    // top: 0;
    width: 100%;
    height: 552px;
    overflow: auto;
    background-color: #fff;
    z-index: 99;
    box-sizing: border-box;

    :deep(.el-form-item__label) {
        color: #3c3c3c;
        font-weight: 500;
    }

    .content-tag {
        display: inline;
        font-size: 14px;
        color: #3c3c3c;
        font-weight: 400;
        margin-right: 8px;
        transform: scale(1);
        margin-bottom: 8px;
        background-color: #2A2B321A;
    }

    .part_title {
        font-weight: 600;
        font-size: 16px;
        margin-bottom: 8px;
        color: @text-color;
    }

    .part_content {
        background: #F7F8FB;
        border-radius: 6px;
        padding: 16px;
        font-size: 14px;
        margin-bottom: 24px;
    }

    .form {
        background: #FFFFFF;
        border-radius: 6px;
        padding: 16px;
        padding-bottom: 1px;

        .form_label {
            color: @text-color;
            font-weight: 500;
            margin-bottom: 8px;
        }
    }

    .form_title {
        // color: #858585;
        font-weight: 500;
        font-size: 16px;
        margin-bottom: 16px;
        .between();

        span {
            font-size: 14px;
            color: #6C87FF;
            font-weight: 400;
            cursor: pointer;

            i {
                vertical-align: middle;
            }
        }
    }

    .comp_item {
        background: #fff;
        border-radius: 6px;
        padding: 16px;
        margin-bottom: 16px;

        .version_wrap {
            .tip {
                background-color: #fff;
                border-radius: 6px;
                padding: 8px;
                color: #858585;
                margin-top: 8px;
            }
        }
    }
}
</style>
