<template>
    <el-dialog width="850" top="32px" title="导出项目组设置" @close="emits('update:modelValue', false)">
        <div class="">
            <div class="title mb-1">
                <span class="g-color-err">*</span>
                导出模块
                <TipsComp content="请至少选择一项导出模块" />
            </div>
            <div class="mb-6">
                <el-checkbox v-model="reqData.is_comp" style="margin-bottom: -8px;" :indeterminate="indeterminate.compIsIndeterminate"
                    @change="changeComp" label="缺陷组件" size="large" />
                <div class="g-bg-ff pl-[22px] g-bdr-6">
                    <div class="flex items-center">
                        <div class="font-medium text-3c mr-2">
                            处置等级：
                        </div>
                        <el-checkbox-group class="g-mv-8" v-model="reqData.comp_suggest_level"
                            @change="handleCheckedChange('is_comp', 'compIsIndeterminate', 6, reqData.comp_suggest_level, reqData.comp_direct_dependency_type)">
                            <el-checkbox v-for="item in suggestData" :key="item" :label="item" :value="item">
                                {{ item }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </div>

                    <div class="flex items-center">
                        <div class="font-medium text-3c mr-2">
                            依赖类型：
                        </div>
                        <el-checkbox-group class="g-mv-8" v-model="reqData.comp_direct_dependency_type"
                            @change="handleCheckedChange('is_comp', 'compIsIndeterminate', 6, reqData.comp_suggest_level, reqData.comp_direct_dependency_type)">
                            <el-checkbox v-for="item in relayData" :key="item" :label="item" :value="item">
                                {{ item }}
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

            <div class="mb-6">
                <el-checkbox @change="changeSbom" style="margin-bottom: -8px;" v-model="reqData.is_sbom"
                    :indeterminate="indeterminate.sbomIndeterminate" label="SBOM清单" size="large" />
                <div class="g-bg-ff pl-[22px] g-bdr-6">
                    <div class="flex items-center">
                        <div class="font-medium text-3c mr-2">
                            依赖类型：
                        </div>
                        <el-checkbox-group class="g-mv-8" v-model="reqData.sbom_direct_dependency_type"
                            @change="handleCheckedChange('is_sbom', 'sbomIndeterminate', 3, reqData.sbom_direct_dependency_type)">
                            <el-checkbox v-for="item in relayData" :key="item" :label="item" :value="item">
                                {{ item }}
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

            <!-- <div class="g-p-12 g-bdr-6 g-bg-f5 g-mb-16">
                <el-checkbox @change="changeLicense" :indeterminate="indeterminate.licIndeterminate" v-model="reqData.is_license" label="许可证风险" size="large" />
                <div class="g-bg-ff g-p-12 g-bdr-6">
                    <div class="title">
                        风险等级
                    </div>
                    <el-checkbox-group class="g-mv-8" v-model="reqData.licsnes_tags" @change="handleCheckedChange('is_license', 'licIndeterminate', 3, reqData.licsnes_tags)">
                        <el-checkbox v-for="item in riskData" :key="item" :label="item" :value="item">
                            {{ item }}
                        </el-checkbox>
                    </el-checkbox-group>
                </div>
            </div> -->

            <div class="g-mb-24">
                <el-checkbox v-model="reqData.is_vuln" style="margin-bottom: -8px;" label="漏洞列表" size="large" />
                <div class="pl-[22px]">
                    <div class="flex items-center mt-3">
                        <div class="font-medium text-3c mr-2">
                            其他标签
                        </div>
                        <el-select v-model="reqData.vuln_tags" multiple class="flex-1" placeholder="请选择其他标签">
                            <el-option v-for="item in vulnOption" :key="item.value" :value="item.value"
                                :label="item.label"></el-option>
                        </el-select>
                    </div>
                </div>
            </div>

            <div v-if="(store.conf?.module_binary_analysis || store.conf?.add_code_similarity)">
                <el-checkbox @change="changeBinary" style="margin-bottom: -8px;" :indeterminate="indeterminate.sourceIndeterminate"
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
import { exportClassApi } from 'api/project';
// import TipsComp from '@/components/TipsComp.vue';
import { s_label_options } from './constants/constants';

const emits = defineEmits(['update:modelValue']);
const { id } = defineProps(['id']);
const suggestData = ['强烈建议修复', '建议修复', '可选修复'];
const relayData = ['直接依赖', '间接依赖'];
// const riskData = ['高风险', '中风险', '低风险'];
const analyzeData = ref<any[]>([]);
const indeterminate = ref<any>({
    compIsIndeterminate: false,
    sbomIndeterminate: false,
    licIndeterminate: false,
    sourceIndeterminate: false,
});

const vulnOption = [
    {
        value: '可POC',
        label: '可POC',
    },
    {
        value: '投毒',
        label: '投毒',
    },
];
const other_label_options = [
    {
        value: '可触发漏洞',
        label: '可触发漏洞',
    },
    {
        value: '线上依赖',
        label: '线上依赖',
    },
    {
        value: '投毒',
        label: '投毒',
    },
];

const reqData = ref<any>({
    projects_id: id,
    is_analyze: store.conf?.module_binary_analysis || store.conf?.add_code_similarity,
    is_comp: true,
    is_vuln: true,
    is_sbom: true,
    // is_license: true,
    comp_tags: [],
    sbom_tags: [],
    vuln_tags: [],
    comp_suggest_level: ['强烈建议修复', '建议修复', '可选修复'],
    comp_direct_dependency_type: ['直接依赖', '间接依赖'],
    sbom_direct_dependency_type: ['直接依赖', '间接依赖'],
    // licsnes_tags: ['高风险', '中风险', '低风险'],
    analyze_tags: [],
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
    reqData.value.comp_suggest_level = value ? ['强烈建议修复', '建议修复', '可选修复'] : [];
    // reqData.value.comp_fix_status_str = value ? ['待修复', '已修复', '7天忽略', '关闭'] : [];
    reqData.value.comp_direct_dependency_type = value ? ['直接依赖', '间接依赖'] : [];
    indeterminate.value.compIsIndeterminate = false;
};

const changeSbom = (value: boolean) => {
    // reqData.value.sbom_tags = value ? ['可触发漏洞', '线上依赖'] : [];
    indeterminate.value.sbomIndeterminate = false;
    reqData.value.sbom_direct_dependency_type = value ? ['直接依赖', '间接依赖'] : [];
};

const changeBinary = (value: boolean) => {
    indeterminate.value.sourceIndeterminate = false;
    // reqData.value.sbom_tags = value ? ['可触发漏洞', '线上依赖'] : [];
    reqData.value.analyze_tags = value ? ['代码同源性分析', '二进制文件同源性分析'] : [];
};

// const changeLicense = (value: boolean) => {
//     indeterminate.value.licIndeterminate = false;
//     // reqData.value.sbom_tags = value ? ['可触发漏洞', '线上依赖'] : [];
//     reqData.value.licsnes_tags = value ? ['高风险', '中风险', '低风险'] : [];
// };

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

    if (reqData.value.is_comp && !reqData.value.comp_suggest_level.length) {
        showMessage('请至少选择一种缺陷组件的处置等级', 'warning');
        return;
    }
    // if (reqData.value.is_comp && !reqData.value.comp_fix_status_str.length) {
    //     showMessage('请至少选择一种缺陷组件的安全问题状态', 'warning');
    //     return;
    // }
    if (reqData.value.is_comp && !reqData.value.comp_direct_dependency_type.length) {
        showMessage('请至少选择一种缺陷组件的依赖类型', 'warning');
        return;
    }
    if (reqData.value.is_sbom && !reqData.value.sbom_direct_dependency_type.length) {
        showMessage('请至少选择一种SBOM清单的依赖类型', 'warning');
        return;
    }
    // if (reqData.value.is_license && !reqData.value.licsnes_tags.length) {
    //     showMessage('请至少选择一种许可证风险等级', 'warning');
    //     return;
    // }
    try {
        await exportClassApi(reqData.value);
        showMessage('正在导出中，请在导出管理查看', 'success');
        emits('update:modelValue', false);
    } catch (error) {
        console.log(error);
    }
};
</script>

<style lang='less' scoped>
.title {
    font-size: 14px;
    font-weight: 500;
    color: #3c3c3c;
}
</style>
