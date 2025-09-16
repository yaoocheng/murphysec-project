<template>
    <div class="left_title">
        <div>
            <span></span>
            修复方案
        </div>
    </div>
    <div class="fix_plan">
        <el-tabs v-model="activeName" class="fix_plan_tabs">
            <el-tab-pane label="升级版本方式" name="1">
                <div class="g-bdr-6 g-p-16 g-bg-f7">
                    <div class="tip">
                        方案一：升级组件 {{ info.comp_name }}@{{ info.comp_version }} 修复安全问题
                    </div>
                    <div class="plan_item g-flex g-align-center g-justify-between">
                        <div>
                            最小修复版本：{{ info.comp_info?.fix_plans?.plan2?.target_version ||
            '暂无（当前没有可升级的安全版本可用，请持续关注该组件官方仓库以便获取新发布的安全更新）' }}
                            <span class="tag" v-if="info.comp_info?.fix_plans?.plan2?.target_version||info?.comp_info?.fix_plans?.plan2?.is_compatibility_risk">推荐</span>

                            <span v-if="info.comp_info?.fix_plans?.plan2?.target_version">
                                <span class="compa risk"
                                    v-if="info?.comp_info?.fix_plans?.plan2?.is_compatibility_risk"><i
                                        class="murphy icon-jinggaotubiaosvg g-f-14 g-vertical--1"></i> 存在兼容性风险</span>
                                <span class="compa no_risk"
                                    v-if="!info?.comp_info?.fix_plans?.plan2?.is_compatibility_risk"><i
                                        class="murphy icon-jinggaotubiaosvg g-f-14 g-vertical--1"></i> 暂未发现兼容性风险</span>
                            </span>
                        </div>
                        <el-button
                            @click="compatibleTargetVersion = info?.comp_info?.fix_plans?.plan2?.target_version; isShowCompatibleModal = true"
                            v-if="info.comp_info?.fix_plans?.plan2?.target_version" class="minor_btn">兼容性分析</el-button>
                    </div>

                    <div class="plan_item" v-if="info.comp_info?.fix_plans?.plan1?.target_version">
                        <div>
                            可选升级版本：{{ info.comp_info?.fix_plans?.plan1?.target_version || '暂无' }}
                            <span v-if="info.comp_info?.fix_plans?.plan1?.target_version">
                                <span class="compa risk"
                                    v-if="info?.comp_info?.fix_plans?.plan1?.is_compatibility_risk"><i
                                        class="murphy icon-jinggaotubiaosvg g-f-14 g-vertical--1"></i>
                                    存在兼容性风险</span>
                                <span class="compa no_risk"
                                    v-if="!info?.comp_info?.fix_plans?.plan1?.is_compatibility_risk">
                                    <i class="murphy icon-jinggaotubiaosvg g-f-14 g-vertical--1"></i> 暂未发现兼容性风险</span>
                            </span>
                        </div>

                        <el-button
                            @click="compatibleTargetVersion = info?.comp_info?.fix_plans?.plan1?.target_version; isShowCompatibleModal = true"
                            v-if="info.comp_info?.fix_plans?.plan1?.target_version" class="minor_btn">兼容性分析</el-button>
                    </div>

                    <div class="plan_item" v-if="info.comp_info?.fix_plans?.plan3?.target_version">
                        <div>
                            可选升级版本：{{ info.comp_info?.fix_plans?.plan3?.target_version || '暂无' }}
                            <!-- <span class="compa risk">存在兼容性风险</span> -->
                            <span v-if="info.comp_info?.fix_plans?.plan3?.target_version">
                                <span class="compa risk"
                                    v-if="info?.comp_info?.fix_plans?.plan3?.is_compatibility_risk">
                                    <i class="murphy icon-jinggaotubiaosvg g-f-14 g-vertical--1"></i> 存在兼容性风险</span>
                                <span class="compa no_risk"
                                    v-if="!info?.comp_info?.fix_plans?.plan3?.is_compatibility_risk">
                                    <i class="murphy icon-jinggaotubiaosvg g-f-14 g-vertical--1"></i> 暂未发现兼容性风险</span>
                            </span>
                        </div>

                        <el-button
                            @click="compatibleTargetVersion = info?.comp_info?.fix_plans?.plan3?.target_version; isShowCompatibleModal = true"
                            v-if="info.comp_info?.fix_plans?.plan3?.target_version" class="minor_btn">兼容性分析</el-button>
                    </div>

                    <div class="tip" style="margin-top: 24px;" v-if="isShowPlan2">
                        方案二：升级引入该组件的直接依赖修复安全问题
                    </div>
                    <div class="plan2" v-if="isShowPlan2">
                        <div class="plan2_item" v-for="item in plan2List" :key="item">
                            <div>
                                <div class="g-mb-8">
                                    {{ item?.comp_name }}
                                </div>

                                <div class="g-flex g-align-center">
                                    <div class="g-mr-16">
                                        当前版本： {{ item?.comp_version }}
                                    </div>
                                    <div class="g-mr-8">
                                        建议升级版本： {{ item?.fix_plan?.plan1?.target_version }}
                                    </div>
                                    <div>
                                        <span class="compa risk" v-if="item?.fix_plan?.plan1?.is_compatibility_risk"><i
                                                class="murphy icon-jinggaotubiaosvg g-f-14 g-vertical--1"></i>
                                            存在兼容性风险</span>
                                        <span class="compa no_risk" v-else><i
                                                class="murphy icon-jinggaotubiaosvg g-f-14 g-vertical--1"></i>
                                            暂未发现兼容性风险</span>
                                    </div>
                                </div>
                            </div>

                            <el-button
                                @click="compatibleTargetVersion = item?.fix_plan?.plan1?.target_version; isShowCompatibleModal = true"
                                class="minor_btn">兼容性分析</el-button>
                        </div>
                    </div>
                </div>
            </el-tab-pane>

            <el-tab-pane label="非升级版本方式" name="2">
                <div class="g-bdr-6 g-p-16 g-bg-f7">
                    <NoUpgrade v-if="activeName === '2'" :vulnRepairList="info.comp_info?.effects" />
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>

    <CompatibleModal v-model="isShowCompatibleModal" v-if="isShowCompatibleModal" :tid="info.project_id"
        :sid="info.subtask_id" :info="info.comp_info" :compatibleTargetVersion="compatibleTargetVersion" />
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import NoUpgrade from './NoUpgradePlan.vue';
import CompatibleModal from './CompatibleModal.vue';

const props = defineProps(['info']);
const activeName = ref<string>('1');
const compatibleTargetVersion = ref<string>('');
const isShowCompatibleModal = ref<boolean>(false);
const plan2List = ref<Array<any>>([]);

// 间接依赖有方案二 并且bixblockdata所有plan1都不为空
const isShowPlan2 = ref<boolean>(Boolean(props.info?.is_direct_dependency === 2 && props.info?.fix_block_data?.length && props.info?.fix_block_data?.every((item: any) => item.fix_plan?.plan1?.target_version)));
if (isShowPlan2.value) {
    plan2List.value = props.info?.fix_block_data;
}
</script>

<style lang='less' scoped>
.left_title {
    font-size: 18px;
    color: #3c3c3c;
    font-weight: 500;
    // margin-bottom: 8px;
    .between();

    span {
        width: 2px;
        height: 16px;
        display: inline-block;
        background: #6C87FF;
        border-radius: 100px;
        vertical-align: -2px;
        margin-right: 8px;
    }
}

.fix_plan {
    // padding: 24px;
    background-color: #fff;
    border-radius: 4px;
    position: relative;
    box-sizing: border-box;
    // overflow: auto;
    margin-bottom: 32px;
    padding-top: 12px;

    .tip {
        border-radius: 6px;
        color: #3c3c3c;
        margin-bottom: 8px;
        font-size: 14px;
        font-weight: 400;

        i {
            color: #6C87FF;
            margin-right: 8px;
            vertical-align: -1px;
        }
    }

    .plan_item {
        background-color: #fff;
        padding: 16px;
        border-radius: 4px;
        color: @text-color;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .minor_btn {
            width: 94px;
            height: 32px;
        }

        .select {}
    }

    span.compa {
        padding: 3px 6px;
        border-radius: 4px;
        font-size: 12px;
        margin-left: 4px;
        border: 1px solid #38C728;
        background: #38C7280D;
        color: #38C728;
        display: inline-block;
    }

    .no_risk.compa {
        // &:hover {
        //     background-color: #38C72833;
        // }

        border: 1px solid #38C728;
        background: #38C7280D;
        color: #38C728;
    }

    .risk.compa {
        // &:hover {
        //     background-color: #FF880033;
        // }

        border: 1px solid #F34D3D;
        background: #F34D3D0D;
        color: #F34D3D;
    }

    .plan2 {
        padding-bottom: 1px;
        border-radius: 4px;
        color: @text-color;

        .minor_btn {
            width: 94px;
            height: 32px;
        }

        .plan2_item {
            padding: 16px;
        background-color: #fff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;

            // div {
            //     width: 30%;
            //     .ellipsis();
            // }

            // div:nth-of-type(1) {
            //     width: 34%;
            // }

            // div:nth-last-of-type(1) {
            //     width: 24%;
            // }
        }
    }
}
</style>

<!-- <style lang="less">
.fix_plan_tabs .el-tabs__content {
    overflow: auto;
}
</style> -->
