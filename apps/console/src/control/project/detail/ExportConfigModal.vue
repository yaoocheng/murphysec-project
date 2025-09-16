<template>
    <el-dialog width="802" top="32px" title="导出报告设置" @close="emits('update:modelValue', false)">
        <div class="g-mb-24" style="height: 600px;overflow: auto;">
            <div class="title g-mb-12">
                <span class="g-color-err">*</span>
                报告名称
            </div>
            <el-input class="g-mb-24" v-model="reqData.export_name" placeholder="请输入报告名称" show-word-limit
                maxlength="30"></el-input>

            <div class="title">
                <span class="g-color-err">*</span>
                导出格式
            </div>
            <el-radio-group class="g-mb-16" v-model="reqData.ext_type">
                <el-radio :label="1" size="large">Excel</el-radio>
                <el-radio :label="9" size="large">Word</el-radio>
                <el-radio :label="5" size="large">PDF</el-radio>
            </el-radio-group>

            <div class="g-mb-16" v-if="reqData.ext_type === 1">
                <div class="title">
                    <span class="g-color-err">*</span>
                    语言
                    <TipsComp :width="344" placement="right" content="根据所选语言导出中文报告或英文报告" />
                </div>
                <el-radio-group v-model="reqData.export_language">
                    <el-radio label="zh" size="large">中文</el-radio>
                    <el-radio label="en" size="large">英文</el-radio>
                </el-radio-group>
            </div>

            <div class="title mb-2">
                <span class="g-color-err">*</span>
                导出模块
                <TipsComp content="请至少选择一项导出模块" />
            </div>

            <div class="g-mb-16">
                <el-checkbox v-model="reqData.is_comp" :indeterminate="indeterminate.compIsIndeterminate"
                    @change="changeComp" label="缺陷组件" size="large" />
                <div class="pl-[22px]">
                    <div class="flex items-center">
                        <div class="title">
                            处置等级：
                        </div>
                        <el-checkbox-group class="g-mv-8" v-model="reqData.comp_suggest_level"
                            @change="handleCheckedChange('is_comp', 'compIsIndeterminate', totalOptionsCount, reqData.comp_suggest_level, reqData.comp_direct_dependency_type, reqData.fix_status)">
                            <el-checkbox v-for="city in suggestData" :key="city" :label="city" :value="city">
                                {{ city }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </div>
                    <!-- <div class="title">
                        安全问题状态
                    </div>
                    <el-checkbox class="g-mb-8"
                        @change="singleCheckChange(flawCompData.repair, 'fix_status', '待修复')"
                        v-model="flawCompData.repair" label="待修复" size="large" />
                    <el-checkbox class="g-mb-8"
                        @change="singleCheckChange(flawCompData.isRepair, 'fix_status', '已修复')"
                        v-model="flawCompData.isRepair" label="已修复" size="large" />
                    <el-checkbox v-if="!$systemConfig.isGf" class="g-mb-8"
                        @change="singleCheckChange(flawCompData.ignore, 'fix_status', '7天忽略')"
                        v-model="flawCompData.ignore" label="7天忽略" size="large" />
                    <el-checkbox class="g-mb-8"
                        @change="singleCheckChange(flawCompData.forever, 'fix_status', '关闭')"
                        v-model="flawCompData.forever" label="关闭" size="large" /> -->
                    <div class="flex items-center">
                        <div class="title">
                            依赖类型：
                        </div>
                        <el-checkbox-group class="g-mv-8" v-model="reqData.comp_direct_dependency_type"
                            @change="handleCheckedChange('is_comp', 'compIsIndeterminate', totalOptionsCount, reqData.comp_suggest_level, reqData.comp_direct_dependency_type, reqData.fix_status)">
                            <el-checkbox v-for="city in relayData" :key="city" :label="city" :value="city">
                                {{ city }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </div>

                    <div class="flex items-center">
                        <div class="title">
                            修复状态：
                        </div>
                        <el-checkbox-group class="g-mv-8" v-model="reqData.fix_status"
                            @change="handleCheckedChange('is_comp', 'compIsIndeterminate', totalOptionsCount, reqData.comp_suggest_level, reqData.comp_direct_dependency_type, reqData.fix_status)">
                            <el-checkbox v-for="city in fixStatusData" :key="city" :label="city" :value="city">
                                {{ city }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </div>

                    <div class="flex items-center mt-3">
                        <div class="font-medium text-3c mr-2">
                            其他标签
                        </div>
                        <el-select v-model="reqData.comp_tags" multiple class="flex-1" placeholder="请选择其他标签">
                            <el-option v-for="item in other_label_options" :key="item.value" :value="item.value"
                                :label="item.label"></el-option>
                        </el-select>
                    </div>
                </div>
            </div>

            <div class="g-mb-16">
                <el-checkbox @change="changeSbom" v-model="reqData.is_sbom"
                    :indeterminate="indeterminate.sbomIndeterminate" label="SBOM清单" size="large" />
                <div class="pl-[22px]">
                    <div class="flex items-center">
                        <div class="title">
                            依赖类型：
                        </div>
                        <el-checkbox-group class="g-mv-8" v-model="reqData.sbom_direct_dependency_type"
                            @change="handleCheckedChange('is_sbom', 'sbomIndeterminate', 3, reqData.sbom_direct_dependency_type)">
                            <el-checkbox v-for="city in relayData" :key="city" :label="city" :value="city">
                                {{ city }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </div>

                    <div class="flex items-center mt-3">
                        <div class="font-medium text-3c mr-2">
                            其他标签
                        </div>
                        <el-select v-model="reqData.sbom_tags" multiple class="flex-1" placeholder="请选择其他标签">
                            <el-option v-for="item in s_label_options" :key="item.value" :value="item.value"
                                :label="item.label"></el-option>
                        </el-select>
                    </div>
                </div>
            </div>

            <div class="mb-2">
                <el-checkbox @change="changeLicense" :indeterminate="indeterminate.licIndeterminate"
                    v-model="reqData.is_license" label="许可证风险" size="large" />
                <div class="pl-[22px]">
                    <div class="flex items-center">
                        <div class="title">
                            风险等级：
                        </div>
                        <el-checkbox-group class="g-mv-8" v-model="reqData.licsnes_tags"
                            @change="handleCheckedChange('is_license', 'licIndeterminate', 3, reqData.licsnes_tags)">
                            <el-checkbox v-for="city in riskData" :key="city" :label="city" :value="city">
                                {{ city }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </div>

                    <!-- <el-checkbox @change="singleCheckChange(licenseData.high, 'licsnes_tags', '高风险')"
                        v-model="licenseData.high" label="高风险" size="large" />
                    <el-checkbox @change="singleCheckChange(licenseData.mid, 'licsnes_tags', '中风险')"
                        v-model="licenseData.mid" label="中风险" size="large" />
                    <el-checkbox @change="singleCheckChange(licenseData.low, 'licsnes_tags', '低风险')"
                        v-model="licenseData.low" label="低风险" size="large" /> -->
                </div>
            </div>

            <div class="g-mb-16">
                <el-checkbox v-model="reqData.is_vuln" label="漏洞列表" size="large" />
                <div class="pl-[22px]">
                    <div class="flex items-center mt-3">
                        <div class="title">
                            其他标签
                        </div>
                        <el-select v-model="reqData.vuln_tags" multiple class="flex-1" placeholder="请选择其他标签">
                            <el-option v-for="item in sbom_label_options" :key="item.value" :value="item.value"
                                :label="item.label"></el-option>
                        </el-select>
                    </div>
                </div>
            </div>

            <div v-if="(store.conf?.module_binary_analysis || store.conf?.add_code_similarity)">
                <el-checkbox @change="changeBinary" :indeterminate="indeterminate.sourceIndeterminate"
                    v-model="reqData.is_analyze" label="同源性分析" size="large" />
                <div class="pl-[22px]">
                    <div class="flex items-center">
                        <div class="font-medium text-3c mr-2">
                            类型：
                        </div>
                        <el-checkbox-group class="g-mv-8" v-model="reqData.analyze_tags"
                            @change="handleCheckedChange('is_analyze', 'sourceIndeterminate', 2, reqData.analyze_tags)">
                            <el-checkbox v-for="item in analyzeData" :key="item" :label="item" :value="item">
                                {{ item }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </div>
                </div>
            </div>
        </div>

        <div class="group-btn">
            <el-button @click="emits('update:modelValue', false)">取消</el-button>
            <el-button @click="confirm">确认</el-button>
        </div>
    </el-dialog>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import store from 'util/store';
import { showMessage } from 'util/tools';
import { useRoute } from 'vue-router';
import { exportReportApi } from 'api/project';
// import TipsComp from '@/components/TipsComp.vue';
import { other_label_options, sbom_label_options, s_label_options } from '../constants/constants';
import systemConfig from '@/constants/system-config';

const emits = defineEmits(['update:modelValue']);
const { name } = defineProps(['name']);
const route = useRoute();
const suggestData = ['强烈建议修复', '建议修复', '可选修复'];
const relayData = ['自身依赖', '直接依赖', '间接依赖'];
const riskData = ['高风险', '中风险', '低风险', '无风险'];
const fixStatusData = systemConfig.value.isGf ? ['待修复', '已修复', '关闭'] : ['待修复', '已修复', '7天忽略', '关闭'];
const totalOptionsCount = systemConfig.value.isGf ? 9 : 10;
const analyzeData = ref<any[]>([]);
const indeterminate = ref<any>({
    compIsIndeterminate: false,
    sbomIndeterminate: false,
    licIndeterminate: false,
    sourceIndeterminate: false,
});

const reqData = ref<any>({
    subtask_id: route.params.sid as string,
    project_id: route.params.tid as string,
    url: `/export-report/${route.params.tid}/${route.params.sid}`,
    ext_type: 1,
    export_name: name.slice(0, 30),
    export_language: 'zh',
    is_analyze: store.conf?.module_binary_analysis || store.conf?.add_code_similarity,
    is_comp: true,
    is_vuln: true,
    is_sbom: true,
    is_license: true,
    comp_tags: [],
    sbom_tags: [],
    vuln_tags: [],
    comp_suggest_level: ['强烈建议修复', '建议修复', '可选修复'],
    fix_status: systemConfig.value.isGf ? ['待修复', '已修复', '关闭'] : ['待修复', '已修复', '7天忽略', '关闭'],
    comp_direct_dependency_type: ['自身依赖', '直接依赖', '间接依赖'],
    sbom_direct_dependency_type: ['自身依赖', '直接依赖', '间接依赖'],
    licsnes_tags: ['高风险', '中风险', '低风险', '无风险'],
    analyze_tags: [],
    host: window.location.origin,
});

if ((store.conf?.module_binary_analysis && store.conf?.add_code_similarity)) {
    reqData.value.analyze_tags = ['代码同源性分析', '二进制文件同源性分析'];
    analyzeData.value = ['代码同源性分析', '二进制文件同源性分析'];
} else if (store.conf?.module_binary_analysis) {
    reqData.value.analyze_tags = ['二进制文件同源性分析'];
    analyzeData.value = ['二进制文件同源性分析'];
} else if (store.conf?.add_code_similarity) {
    analyzeData.value = ['代码同源性分析'];
    reqData.value.analyze_tags = ['代码同源性分析'];
}

// 全选
const changeComp = (value: boolean) => {
    // reqData.value.comp_suggest_level = value ? ['强烈建议修复', '建议修复', '可选修复'] : [];
    // reqData.value.fix_status = value ? ['待修复', '已修复', '7天忽略', '关闭'] : [];
    // reqData.value.comp_direct_dependency_type = value ? ['自身依赖', '直接依赖', '间接依赖'] : [];
    if (value) {
        reqData.value.comp_suggest_level = ['强烈建议修复', '建议修复', '可选修复'];
        if (systemConfig.value.isGf) {
            reqData.value.fix_status = ['待修复', '已修复', '关闭'];
        } else {
            reqData.value.fix_status = ['待修复', '已修复', '7天忽略', '关闭'];
        }
        reqData.value.comp_direct_dependency_type = ['自身依赖', '直接依赖', '间接依赖'];
    } else {
        reqData.value.comp_suggest_level = [];
        reqData.value.fix_status = [];
        reqData.value.comp_direct_dependency_type = [];
    }
    indeterminate.value.compIsIndeterminate = false;
};

const changeSbom = (value: boolean) => {
    // reqData.value.sbom_tags = value ? ['可触发漏洞', '线上依赖'] : [];
    indeterminate.value.sbomIndeterminate = false;
    reqData.value.sbom_direct_dependency_type = value ? ['自身依赖', '直接依赖', '间接依赖'] : [];
};

const changeBinary = (value: boolean) => {
    indeterminate.value.sourceIndeterminate = false;
    // reqData.value.sbom_tags = value ? ['可触发漏洞', '线上依赖'] : [];
    reqData.value.analyze_tags = value ? ['代码同源性分析', '二进制文件同源性分析'] : [];
};

const changeLicense = (value: boolean) => {
    indeterminate.value.licIndeterminate = false;
    // reqData.value.sbom_tags = value ? ['可触发漏洞', '线上依赖'] : [];
    reqData.value.licsnes_tags = value ? ['高风险', '中风险', '低风险', '无风险'] : [];
};

// const changeVuln = (value: boolean) => {
//     reqData.value.vuln_tags = value ? ['可触发漏洞', '线上依赖'] : [];
// };

const handleCheckedChange = (checkAllStr: string, indeterminateStr: string, count: number, ...arg: any[]) => {
    const countArr = arg.flat();

    reqData.value[checkAllStr] = countArr.length > 0;

    indeterminate.value[indeterminateStr] = countArr.length > 0 && countArr.length < count;
};

const confirm = async () => {
    if ((store.conf?.module_binary_analysis || store.conf?.add_code_similarity)) {
        if (!reqData.value.is_comp && !reqData.value.is_vuln && !reqData.value.is_license && !reqData.value.is_sbom && !reqData.value.is_analyze) {
            showMessage('请至少选择一项导出模块', 'warning');
            return;
        }
        if (reqData.value.is_analyze && !reqData.value.analyze_tags.length) {
            showMessage('请至少选择一种同源类型', 'warning');
            return;
        }
    } else if (!reqData.value.is_comp && !reqData.value.is_license && !reqData.value.is_vuln && !reqData.value.is_sbom) {
        showMessage('请至少选择一项导出模块', 'warning');
        return;
    }

    if (!reqData.value.export_name) {
        showMessage('请输入报告名称', 'warning');
        return;
    }

    if (reqData.value.is_comp && !reqData.value.comp_suggest_level.length) {
        showMessage('请至少选择一种缺陷组件的处置等级', 'warning');
        return;
    }
    // if (reqData.value.is_comp && !reqData.value.fix_status.length) {
    //     showMessage('请至少选择一种缺陷组件的安全问题状态', 'warning');
    //     return;
    // }
    if (reqData.value.is_comp && !reqData.value.comp_direct_dependency_type.length) {
        showMessage('请至少选择一种缺陷组件的依赖类型', 'warning');
        return;
    }
    if (reqData.value.is_comp && !reqData.value.fix_status.length) {
        showMessage('请至少选择一种缺陷组件的修复状态', 'warning');
        return;
    }
    if (reqData.value.is_sbom && !reqData.value.sbom_direct_dependency_type.length) {
        showMessage('请至少选择一种SBOM清单的依赖类型', 'warning');
        return;
    }
    if (reqData.value.is_license && !reqData.value.licsnes_tags.length) {
        showMessage('请至少选择一种许可证风险等级', 'warning');
        return;
    }
    try {
        await exportReportApi(reqData.value);
        showMessage('正在导出中，请在导出管理查看', 'success');
        emits('update:modelValue', false);
    } catch (error) {
        console.log(error);
    }
};
</script>

<style lang='less' scoped>
.title {
    @apply font-medium text-3c mr-2;
}
</style>
