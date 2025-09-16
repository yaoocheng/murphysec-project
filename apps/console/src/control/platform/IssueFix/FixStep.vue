<template>
    <div class="border border-solid border-[#E7E8EB] rounded-md"
         v-if="!curFixPlan.fix_plan_detail?.unfixed_vulns?.length && curFixPlan.fix_plan_detail?.fixed_vulns?.length">
        <div class="font-medium flex items-center pl-6 py-3 bg-[#E7E8EB]">
            <SvgIcon name="color-tips" class="w-4 h-4 mr-2" />
            修复步骤共 {{ curFixPlan.is_include_upgrade ? 1 + fixVulns.length : fixVulns.length }} 步
        </div>

        <div class="py-5 px-6 bg-f7">
            <!-- 升级方案 -->
            <div class="mb-2 rounded-md py-5 px-6 bg-ff" v-if="curFixPlan.is_include_upgrade">
                <div class="flex items-center justify-between">
                    <div class="flex items-center text-sm font-medium">
                        步骤1 将组件从 {{ issueInfo.comp_version }} 版本升级至 {{
                            curFixPlan.fix_plan_select_version ||
                                curFixPlan.fix_plan_suggest_version }} 版本
                    </div>
                    <div class="flex items-center cursor-pointer" @click="addExpandNum(0)">
                        {{ expandRepair === 0 ? '收起详情' : '查看详情' }}
                        <ExpandIcon :type="'t'" :expand="expandRepair === 0" class="expand_icon ml-1" />
                    </div>
                </div>

                <div class="mt-4 bg-[#F7F8FB] box-border py-4 px-6 rounded-md w-full pb-0" v-show="expandRepair === 0">
                    <v-md-preview :text="updateTranferMd()"></v-md-preview>
                </div>
            </div>

            <!-- 非升级方案 修复漏洞 -->
            <div class="mb-2 rounded-md py-5 px-6 bg-ff" v-for="(item, index) in fixVulns" :key="index">
                <div class="flex items-center justify-between">
                    <div class="flex items-center text-sm font-medium">
                        步骤{{ !curFixPlan.is_include_upgrade ? index + 1 : index + 2 }}
                        使用非升级版本方式修复 <a class="hover_text text-3c mx-2"
                                       :href="generateVulnLink(item.info?.mps_id, item.info?.cve_id)" target="_blank">{{
                                           item.info?.cve_id || item.info?.mps_id }}</a> 漏洞
                    </div>

                    <div class="flex items-center cursor-pointer"
                         @click="addExpandNum(!curFixPlan.is_include_upgrade ? index : index + 1)">
                        {{ expandRepair === (!curFixPlan.is_include_upgrade ? index : index + 1) ? '收起详情' : '查看详情' }}
                        <ExpandIcon :type="'t'"
                                    :expand="expandRepair === (!curFixPlan.is_include_upgrade ? index : index + 1)"
                                    class="expand_icon ml-1" />
                    </div>
                </div>

                <div class="mt-4" v-show="expandRepair === (!curFixPlan.is_include_upgrade ? index : index + 1)">
                    <!-- 大卡片 -->
                    <div class="mb-6 flex gap-4 flex-wrap">
                        <div v-for="(card, i) in item.fix_steps" :key="card.title" class="fix_card"
                             @click="item.activePCard = i" :class="{ 'active_card': item.activePCard === i }">
                            <span class="check_icon">方案{{ { 0: '一', 1: '二', 2: '三' }[i] }}</span>

                            <Tooltip :content="card.title" width="400">
                                <div class="font-normal title mb-2">
                                    {{ card.title }}
                                </div>
                            </Tooltip>

                            <!-- <TagComp class="mr-1" v-for="ty in [...new Set(card.steps?.map((step: any) => step.type))]"
                                     :key="ty" bgc="#1F23291A" c="#646A73" :content="editTypeMap[ty].label" /> -->
                        </div>
                    </div>

                    <!-- 卡片的步骤 -->
                    <div class="mb-6" v-for="(step, o) in item.fix_steps[item.activePCard]?.steps" :key="o">
                        <div class="flex items-center mb-2 text-sm font-normal">
                            <span v-if="item.fix_steps[item.activePCard]?.steps?.length > 1">{{ o + 1 }}、</span>{{
                                step.name
                            }}
                            <!-- <span>{{ o + 1 }}. {{ step.name }}</span> -->
                            <Tooltip :content="editTypeMap[step.type].description" width="370" placement="right">
                                <TagComp class="ml-2" bgc="#1F23291A" c="#646A73"
                                         :content="editTypeMap[step.type].label" />
                            </Tooltip>
                        </div>

                        <div class="flex gap-4">
                            <!-- 步骤里tab -->
                            <div v-if="step?.options?.length > 1" class="bg-f7 rounded-md w-full py-5 px-6">
                                <el-tabs class="step_tab" v-model="step.activeSCard">
                                    <el-tab-pane v-for="(scard, n) in step?.options" :key="scard?.content"
                                                 :label="scard?.name" :name="n">
                                        <div class="px-6 py-4 rounded-md bg-ff w-full overflow-auto box-border">
                                            <v-md-preview
                                                :text="step.options[step.activeSCard]?.content"></v-md-preview>
                                        </div>
                                    </el-tab-pane>
                                </el-tabs>
                            </div>

                            <div v-else class="bg-f7 rounded-md py-5 px-6 pb-1 w-full overflow-auto box-border">
                                <v-md-preview :text="step.options?.[0]?.content"></v-md-preview>
                            </div>
                        </div>
                    </div>

                    <!-- 链接 -->
                    <div>
                        <div class="text-sm font-medium mb-2 text-85">参考链接</div>
                        <div class="mb-2 flex items-center break-all"
                             v-for="link in item.fix_steps[item.activePCard]?.refer" :key="link.url">
                            <a class="hover_text text-3c" target="_blank" :href="link.url">{{ link.url }}</a>
                            <TagComp v-if="link.type === '官方'" class="ml-2" :content="link.type" />
                        </div>
                        <div v-if="!item.fix_steps[item.activePCard]?.refer?.length">暂无</div>
                    </div>
                </div>

                <!-- <el-divider class="my-4" /> -->
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue';
import { generateVulnLink } from 'util/tools';
import { fixState } from '../composable/use-issue-fix';

const { curFixPlan, fixVulns } = toRefs(fixState.fixPlan);
const { issueInfo } = toRefs(fixState);

const upgradeCommandMap: any = {
    npm: '`npm install {component}@{version} --save`',
    yarn: '`yarn upgrade {component}@{version}`',
    maven: '**定位组件：**\n在`pom.xml`中找到\n```xml\n<dependency>\n  <groupId>{group}</groupId>\n  <artifactId>{artifact}</artifactId>\n  <version>{old_version}</version>\n</dependency>\n```\n**修改版本：**\n```xml\n<version>{version}</version>\n```\n**执行升级：**\n运行项目构建命令`mvn clean install`',
    gradle: '**定位组件：**\n在`build.gradle`中找到\n```\nimplementation "{component}:{old_version}"\n```\n**修改版本：**\n```\nimplementation "{component}:{version}"\n```\n**执行升级：**\n运行项目构建命令`./gradlew build`',
    pip: '`pip install {component}=={version} --upgrade`',
    nuget: '`nuget update {component} -Version {version}`',
    gem: '`bundle update {component} --conservative`',
    cargo: '**定位组件：**\n在`Cargo.toml`中找到\n```\n{component} = "{old_version}"\n```\n**修改版本：**\n```\n{component} = "{version}"\n```\n**执行升级：**\n运行项目构建命令`cargo update`',
};

const editTypeMap: any = {
    edit_code: {
        label: '代码修改',
        description: '通过修改源代码来修复漏洞',
    },
    edit_parm: {
        label: '参数调整',
        description: '通过调整应用程序或组件的配置参数来修复漏洞',
    },
    edit_config: {
        label: '配置变更',
        description: '通过修改配置文件或配置项来修复漏洞',
    },
};

const updateTranferMd = () => {
    const template = upgradeCommandMap[issueInfo.value.ecosystem] || '定位项目中的目标组件`{component}`，并根据项目类型执行符合要求的组件升级操作。';
    const [group, artifact] = (issueInfo.value.comp_name || '').split(':');
    return template
        .replace(/{component}/g, issueInfo.value.comp_name)
        .replace(/{version}/g, curFixPlan.value.fix_plan_select_version || curFixPlan.value.fix_plan_suggest_version)
        .replace(/{old_version}/g, issueInfo.value.comp_version)
        .replace(/{group}/g, group || '')
        .replace(/{artifact}/g, artifact || '');
};

// 展开
const expandRepair = ref<number | null>(0);
const addExpandNum = (num: number) => {
    expandRepair.value = expandRepair.value === num ? null : num;
};
</script>

<style lang="less">
.step_tab .el-tabs__item {
    color: #858585;
}

.step_tab .el-tabs__item.is-active {
    color: #6C87FF;
}

.github-markdown-body {
    padding: 0;

    p {
        font-size: 14px !important;
    }

    .v-md-pre-wrapper {
        background-color: #fff !important;
        border: 1px solid #C7C7C7;
        margin-bottom: 24px;
        border-radius: 2px;

        pre {
            margin-bottom: 0 !important;
        }
    }
}

.fix_card {
    cursor: pointer;
    width: 31%;
    height: 82px;
    // flex: 1;
    border: 1px solid #EBEBEB;
    background-color: #EBEBEB33;
    padding: 20px 24px;
    box-sizing: border-box;
    border-radius: 6px;
    position: relative;

    .title {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
    }

    &::before {
        content: '';
        width: 36px;
        height: 18px;
        background: #3c3c3c;
        border-radius: 0px 6px 0px 6px;
        position: absolute;
        right: -1px;
        top: 0;
    }

    .check_icon {
        position: absolute;
        font-weight: 400;
        right: 0px;
        top: 1px;
        font-size: 12px;
        transform: scale(.7);
        color: #fff;
    }
}

.fix_card.active_card {
    .title {
        color: #6C87FF;
    }

    &::before {
        background: #6C87FF;
    }

    border: 1px solid #6C87FF;
    background-color: #6C87FF0D;
}
.flex.items-center.cursor-pointer {
    &:hover {
        color: #6C87FF;
        .expand_icon i {
            color: #6C87FF;
        }
    }
}
</style>
