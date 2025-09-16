<template>
    <div class="issue-vuln">
        <div class="g-bg-f7 head g-flex g-align-center g-justify-between">
            <div class="g-f-16 g-fw-500 g-color-1 flex items-center">
                <i :style="{ 'color': isHasTrigger ? '#F34D3D' : '#C7C7C7' }"
                   class="murphy icon-tan g-f-22 g-vertical--3 g-mr-8"></i>
                <span v-if="isOpenTrigger && (isHasTrigger || isOpenVanir)">存在可触发漏洞</span>
                <span v-else-if="isOpenTrigger && !isHasTrigger && !isOpenVanir">未检测出可触发漏洞</span>
                <!-- <span v-else-if="isOpenTrigger && !isSupLang">组件语言暂不支持漏洞可达性分析</span> -->
                <span v-else-if="!isOpenTrigger">未开启漏洞可达性分析功能</span>
            </div>
            <el-tooltip popper-class="user_tooltip" placement="top" effect="light">
                <template #content>
                    <div class="g-p-16" style="width: 400px;">
                        <div class="g-f-14 g-color-1 g-fw-500">
                            当漏洞的触发函数在代码中被实际使用时，该漏洞将被定义为“可触发漏洞”；组件中若是存在一个可触发漏洞，则将出现“可触发漏洞”标签
                            <a target="_blank" href="/docs/glossary/vulnerability-reachability.html"
                               class="g-color-5">查看文档</a>
                        </div>
                        <!-- <el-image style="width: 380px; height: 123px;" :hide-on-click-modal="true"
                            :src="showImgs.triggerImg.small" :preview-src-list="showImgs.triggerImg.big">
                        </el-image> -->
                    </div>
                </template>
                <!-- <div class="g-color-5 hover_btn1 g-cursor-pointer" style="padding: 2px 4px;">
                    什么是可触发漏洞
                </div> -->
                <div class="button-text-blue">
                    <i class="murphy icon-wenhaoxiao"></i>
                    什么是可触发漏洞
                </div>
            </el-tooltip>
        </div>

        <div class="content g-p-24">
            <div class="g-flex g-align-center g-f-14 g-color-1">
                <!-- <div class="g-mr-16">
                    <i class="murphy icon-wancheng2 g-f-20 g-vertical--2 g-mr-4"
                        :style="{ 'color': !isSupLang ? '#C7C7C7' : '#38C728' }"></i>
                    当前组件语言支持此能力
                </div> -->
                <div class="g-mr-32">
                    <i class="murphy icon-wancheng2 g-f-20 g-vertical--2 g-mr-4"
                       :style="{ 'color': !isOpenTrigger ? '#C7C7C7' : '#38C728' }"></i>
                    漏洞可达性分析已开启
                </div>
                <div class="g-mr-32">
                    <i class="murphy icon-wancheng2 g-f-20 g-vertical--2 g-mr-4"
                       :style="{ 'color': !isHasTrigger ? '#C7C7C7' : '#38C728' }"></i>
                    代码调用了导致漏洞触发的函数
                </div>
                <div>
                    <i class="murphy icon-wancheng2 g-f-20 g-vertical--2 g-mr-4"
                       :style="{ 'color': !isOpenVanir ? '#C7C7C7' : '#38C728' }"></i>
                    代码中存在漏洞特征
                </div>
            </div>

            <div class="g-p-16 g-bg-f7 g-bdr-6 g-mt-16 g-color-1" style="line-height: 22px;">
                <div v-if="isOpenTrigger && (isHasTrigger || isOpenVanir)">
                    识别到 <span class="g-fw-500 g-color-1">{{ info?.comp_info?.effects?.filter((item: any) =>
                        item?.full_vuln_data?.is_triggers).length }}</span> 个漏洞在项目中真实受影响，
                    <!-- 共存在
                <span class="g-fw-500 g-color-1">
                    {{ info?.comp_info?.effects?.length }}
                </span>
                个缺陷点。 -->
                    已获取从组件引入到漏洞缺陷点调用的完整路径，此类漏洞应重点关注并及时完成修复！
                </div>

                <div v-else-if="isOpenTrigger && !isHasTrigger && !isOpenVanir">
                    该组件未检测出可触发漏洞，组件风险低
                </div>
                <!-- <div v-else-if="isOpenTrigger && !isSupLang">
                    目前支持java、JavaScript开发语言的组件
                </div> -->
                <div v-else-if="!isOpenTrigger">
                    未开启“漏洞真实影响评估”功能，可在检测配置中开启
                </div>

            </div>

            <div class="flex items-center gap-1">
                <el-button v-if="!isOpenVanir&&isHasTrigger" @click="realUseModal = true" class="minor_btn g-mt-24"
                           style="height: 32px;width: 100%;">
                    查看漏洞触发路径
                </el-button>
                <el-button v-if="isOpenVanir&&isHasTrigger" @click="codeFeatureModal = true" class="minor_btn g-mt-24"
                           style="height: 32px;width: 100%;">
                    漏洞代码特征识别
                </el-button>
            </div>

        </div>
    </div>

    <!-- 真实利用 -->
    <RealUseModal v-model="realUseModal" v-if="realUseModal" :info="info" />

    <!-- 代码特征 -->
    <IssueCodeFeatureModal v-model="codeFeatureModal" v-if="codeFeatureModal" :info="info"
    />
</template>

<script setup lang='ts'>
import { ref, onBeforeMount } from 'vue';
// import triggerImg from 'ast/img/trigger-img.png';
import { getDetailInfoApi } from 'api/project';
import RealUseModal from './RealUseModal.vue';
import IssueCodeFeatureModal from './IssueCodeFeatureModal.vue';

const { info } = defineProps(['info']);
const isOpenVanir = ref<boolean>(info?.comp_info?.is_only_vanir_used);
const realUseModal = ref<boolean>(false);
const codeFeatureModal = ref<boolean>(false);

// 是否有可触发漏洞
const isHasTrigger = info?.comp_info?.effects?.some((item: any) => item?.full_vuln_data?.is_triggers);

// 是否语言支持
// const isSupLang = ['maven', 'gradle', 'npm', 'yarn'].includes(info?.comp_info?.ecosystem);

// 是否开启漏洞可触发配置
const isOpenTrigger = ref(false);

onBeforeMount(async () => {
    try {
        const { data } = await getDetailInfoApi(info.subtask_id || '0', 'security');
        isOpenTrigger.value = data.is_deep === 1;
    } catch (error) {
        console.error(error);
    }
});

</script>

<style scoped lang='less'>
.issue-vuln {
    border-radius: 6px;
    border: 1px solid #E7E8EB;
    margin-bottom: 32px;

    .head {
        padding: 16px 24px;
    }

    .hover_btn1 {
        padding: 6px;
        border-radius: 6px;
    }
}
</style>
