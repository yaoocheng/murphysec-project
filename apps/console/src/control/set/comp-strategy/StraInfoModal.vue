<template>
    <el-dialog width="1036px" top="5%" title="组件策略" :close-on-click-modal="false">
        <div class="edit_strategy">
            <div class="part_title">
                <span class="g-color-err">*</span> 策略基本信息
            </div>
            <div class="part_content">
                <div class="form">
                    <FormComp label-position="top" :hide-required-asterisk="false">
                        <el-form-item :required="true" label="策略名称">
                            <div style="width: 100%;">
                                {{ formData1.name }}
                            </div>
                        </el-form-item>

                        <el-form-item label="策略说明" v-if="formData1.desc">
                            <div style="width: 100%;">
                                {{ formData1.desc }}
                            </div>
                        </el-form-item>

                        <el-form-item v-if="formData1.is_global===1">
                            <!-- <template #label>
                                是否应用到全局
                                <el-tooltip placement="top-start">
                                    <template #content>
                                        <div>全局应用</div>
                                        <div class="tooltip-width">
                                            全部项目将使用该个策略，若命中该策略，检测结果将显示该策略对应的标签。
                                        </div>
                                        <div>若不全局应用，则可在检测项目时选择是否应用该条规则</div>
                                    </template>
                                    <i style="font-size: 14px;cursor:pointer"
                                        class="murphy icon-wenhaoxiao g-color-3"></i>
                                </el-tooltip>
                            </template> -->
                            <div class="g-fw-500 g-color-1">
                                {{ formData1.is_global === 1 ? '应用全局' : '' }}
                            </div>
                        </el-form-item>

                        <el-form-item v-if="formData1.is_open===1">
                            <div class="g-fw-500 g-color-1">
                                开启策略
                                <!-- <el-switch inline-prompt v-model="formData1.is_open" active-text="是" inactive-text="否"
                                    :active-value="1" :inactive-value="2" style="--el-switch-on-color: #6C87FF;" /> -->
                            </div>
                        </el-form-item>
                    </FormComp>
                </div>
            </div>

            <div class="part_title">
                <span class="g-color-err">*</span> 处置动作配置
            </div>
            <div class="part_content">
                <div class="form">
                    <FormComp label-position="top" :hide-required-asterisk="false">
                        <el-form-item :required="true" label="处置动作">
                            <div style="width: 100%;">
                                {{ formData2.action === 'mark' ? '打标签' : '标记为缺陷组件' }}
                                <!-- <el-select style="width: 100%;" v-model="formData2.action" placeholder="请选择处置动作">
                                    <el-option v-for="(item) in disposeOptions" :key="item.value" :label="item.label"
                                        :value="item.value" />
                                </el-select> -->
                            </div>
                        </el-form-item>

                        <div v-if="formData2.action === 'mark'">
                            <el-form-item :required="true" label="标签">
                                <div style="width: 100%;">
                                    {{ formData2.mark }}
                                    <!-- <el-input v-model="formData2.mark"
                                        @input="formData2.mark = formData2.mark.slice(0, 6)"
                                        placeholder="请输入标签"></el-input> -->
                                </div>
                            </el-form-item>
                        </div>

                        <div class="g-bdr-6 g-bg-f7 g-p-16" v-else>
                            <div class="g-color-1 g-f-16 g-fw-500 g-mb-16">
                                设置缺陷组件信息
                                <span class="g-fw-400 g-f-14 g-color-3">设置后，被该策略命中的缺陷组件详情中，将展示以下内容</span>
                            </div>
                            <el-form-item :required="true" label="标题">
                                <div style="width: 100%;">
                                    {{ formData2.defect_title }}
                                    <!-- <el-input v-model="formData2.defect_title" placeholder="请输入标题"></el-input> -->
                                </div>
                            </el-form-item>

                            <el-form-item :required="true" label="处置等级">
                                <div style="width: 100%;">
                                    {{ suggestOptions.find(item => item.value === formData2.defect_suggest)?.label }}
                                    <!-- <el-select style="width: 100%;" v-model="formData2.defect_suggest"
                                        placeholder="请选择处置等级">
                                        <el-option v-for="(item) in suggestOptions" :key="item.value"
                                            :label="item.label" :value="item.value" />
                                    </el-select> -->
                                </div>
                            </el-form-item>

                            <el-form-item :required="true" label="说明">
                                <div style="width: 100%;">
                                    {{ formData2.defect_info }}
                                    <!-- <el-input type="textarea" resize="none" v-model="formData2.defect_info"
                                        placeholder="请输入说明"></el-input> -->
                                </div>
                            </el-form-item>

                            <el-form-item :required="true" label="修复方案">
                                <div style="width: 100%;">
                                    {{ formData2.defect_fix }}
                                    <!-- <el-input type="textarea" resize="none" v-model="formData2.defect_fix"
                                        placeholder="请输入修复方案"></el-input> -->
                                </div>
                            </el-form-item>
                        </div>
                    </FormComp>
                </div>
            </div>

            <div class="part_title">
                <span class="g-color-err">*</span> 策略规则配置
                <div class="g-fw-400 g-f-14 g-color-3 g-mt-4">规则之间为“或”的关系，若项目检测后满足任意一项已配置的规则，则命中该策略</div>
            </div>
            <div class="part_content">
                <div class="form">
                    <div class="form_title">
                        <div class="g-flex g-align-center g-color-1">
                            指定组件
                            <el-tooltip placement="top-end">
                                <template #content>
                                    <div class="tooltip-width">
                                        指定组件”中多个组件之间为“或”的关系，当项目中存在任意一个指定组件的指定版本，则命中该规则
                                    </div>
                                </template>
                                <i class="murphy icon-wenhaoxiao g-ml-4 g-mr-6 g-color-3"></i>
                            </el-tooltip>
                            <div class="g-f-14 g-fw-400 g-color-3">项目中存在指定组件的指定版本时命中该策略</div>
                        </div>
                        <!-- <span @click="addCompHandle">
                            <i class="murphy icon-jiahao-"></i>
                            新增
                        </span> -->
                    </div>

                    <div class="comp_item" v-for="(item, index) in formData3.comps" :key="index">
                        <div
                            style="color: #3c3c3c;margin-bottom: 18px;font-weight: 550;display: flex;justify-content: space-between;">
                            基本信息
                            <!-- <i :style="{ color: index !== formData3.comps?.length - 1 ? '#6C87FF' : '#C7C7C7' }"
                                @click="removeCompHandle(index)" class="murphy icon-shanchu"></i> -->
                        </div>
                        <FormComp label-position="top" :hide-required-asterisk="false">
                            <el-form-item label="组件名称" :required="true">
                                <div style="width: 100%;">
                                    {{ item.comp_name }}
                                    <!-- <el-select style="width: 100%;" v-model="item.comp_name"
                                        @change="changeEcosystem(item)" filterable allow-create remote
                                        placeholder="请输入组件名称搜索" :remote-method="remoteMethod">
                                        <el-option v-for="(ele, index) in compOptions" :key="index"
                                            :label="`${ele.name}${ele.ecosystem ? `（${ele.ecosystem}）` : ''}`"
                                            :value="ele.comp" />
                                    </el-select> -->
                                </div>
                            </el-form-item>

                            <!-- <el-form-item :required="true" label="生态-仓库类型">
                            <div style="width: 100%;">
                                <el-select style="width: 100%;" v-model="item.ecosystem" placeholder="生态-仓库类型">
                                    <el-option v-for="(item) in ecosystemOptions" :key="item.value" :label="item.label"
                                        :value="item.value" />
                                </el-select>
                            </div>
                        </el-form-item> -->

                            <el-form-item label="版本范围" :required="true">
                                <div class="version_wrap" style="width: 100%;">
                                    <span v-for="a in item.version" :key="a">{{ a }}</span>
                                    <!-- <el-select style="width: 100%;" remote multiple filterable allow-create
                                        default-first-option v-model="item.version"
                                        placeholder="请输入版本范围 例：[0,3)[*,*][2.3.1,2.3.1]（按Enter键继续添加）">
                                    </el-select> -->
                                    <!-- <div class="tip">
                                        <p>版本格式：</p>
                                        <p>“,”为区间分割符号，左侧为最小版本，右侧为最大版本</p>
                                        <p>“[” 为包含该版本</p>
                                        <p>“)” 为不包含该版本</p>
                                        <p>“*”表示为不限制版本</p>
                                    </div> -->
                                </div>
                            </el-form-item>
                        </FormComp>
                    </div>

                    <div class="form_title g-color-1" style="justify-content: flex-start;"
                        v-if="formData2.action === 'mark'&&formData3.vuln.cve?.length">
                        指定漏洞
                        <el-tooltip
                            placement="top-end">
                            <template #content>
                                <div class="tooltip-width" >
                                    指定漏洞”中五个条件之间为“且”的关系；多个CVE/MPS编号之间为“或”的关系；多个漏洞级别是”或”的关系
                                </div>
                            </template>
                            <i class="murphy icon-wenhaoxiao g-ml-4 g-mr-6 g-color-3"></i>
                        </el-tooltip>
                        <div class="g-f-14 g-fw-400 g-color-3">项目中存在指定漏洞时命中该策略</div>
                    </div>

                    <div class="g-bdr-6 g-p-16 g-bg-f7" v-if="formData3.vuln.cve?.length">
                        <FormComp label-position="top" v-if="formData2.action === 'mark'">
                            <el-form-item label="漏洞CVE编号" v-if="formData3.vuln.cve?.length">
                                <div style="width: 100%;">
                                    <span v-for="a in formData3.vuln.cve" :key="a">{{ a }}</span>
                                    <!-- <el-select style="width: 100%;" remote multiple filterable allow-create
                                        default-first-option v-model="formData3.vuln.cve"
                                        placeholder="请输入漏洞编号（按Enter键继续添加）">
                                    </el-select> -->
                                </div>
                            </el-form-item>
                            <el-form-item label="MPS编号" v-if="formData3.vuln.mps?.length">
                                <div style="width: 100%;">
                                    <span v-for="a in formData3.vuln.mps" :key="a">{{ a }}</span>
                                    <!-- <el-select style="width: 100%;" v-model="formData3.vuln.mps" remote multiple
                                        filterable allow-create default-first-option
                                        placeholder="请输入MPS编号（按Enter键继续添加）">
                                    </el-select> -->
                                </div>
                            </el-form-item>
                            <el-form-item label="漏洞级别" v-if="formData3.vuln.level?.length">
                                <div style="width: 100%;">
                                    <span v-for="a in formData3.vuln.level" :key="a">{{ levelOptions.find(item => item.value === a)?.label }}</span>
                                    <!-- <el-select style="width: 100%;" v-model="formData3.vuln.level" multiple>
                                        <el-option v-for="(item) in levelOptions" :key="item.value" :label="item.label"
                                            :value="item.value" />
                                    </el-select> -->
                                </div>
                            </el-form-item>
                            <el-form-item label="有POC" v-if="formData3.vuln.is_poc">
                                <!-- <div>
                                    <el-checkbox v-model="formData3.vuln.is_poc" label="启用该规则" size="large" />
                                </div> -->
                            </el-form-item>
                            <el-form-item label="有RCE" v-if="formData3.vuln.is_rce">
                                <!-- <div>
                                    <el-checkbox v-model="formData3.vuln.is_rce" label="启用该规则" size="large" />
                                </div> -->
                            </el-form-item>
                        </FormComp>
                    </div>
                </div>
            </div>
        </div>

        <!-- <div class="btns">
            <el-button class="minor_btn" @click="bus.emit('closeEdit', false)">取消</el-button>
            <el-button @click="confirmHandle">保存</el-button>
        </div> -->
    </el-dialog>
</template>

<script setup lang='ts'>
import { reactive } from 'vue';
import store from 'util/store';
// import bus, { showMessage } from 'util/tools';
// import { strategyConfigApi, searchCompApi } from 'api/team';
import FormComp from 'comp/FormComp.vue';

const props = defineProps(['editData']);

const formData1 = reactive<{
    id: string | null,
    team_id: string,
    name: string,
    desc: string,
    is_global: number,
    is_open: number,
}>({
    id: props.editData.id,
    team_id: store.teamInfo.team_id,
    name: props.editData.name,
    desc: props.editData.desc,
    is_global: props.editData.is_global,
    is_open: props.editData.is_open,
});

const formData2 = reactive<{
    action: string,
    mark: string,
    defect_title: string,
    defect_suggest: number,
    defect_info: string,
    defect_fix: string,
}>({
    action: props.editData.action,
    mark: props.editData.mark,
    defect_title: props.editData.defect_title,
    defect_suggest: props.editData.defect_suggest,
    defect_info: props.editData.defect_info,
    defect_fix: props.editData.defect_fix,
});

const formData3 = reactive<{
    comps: Array<{
        comp_name: string | undefined,
        ecosystem: string,
        repository: string,
        version: Array<string>,
    }>,
    vuln: {
        cve: Array<string>,
        mps: Array<string>,
        level: Array<number>,
        is_poc: boolean,
        is_rce: boolean,
    }
}>({
    comps: props.editData.strategy_info.comps,
    vuln: props.editData.strategy_info.vuln,
});

// 处置动作
// const disposeOptions = [
//     {
//         label: '打标签',
//         value: 'mark',
//     },
//     {
//         label: '标记为缺陷组件',
//         value: 'defect',
//     },
// ];
// 处置等级
const suggestOptions = [
    {
        label: '强烈建议修复',
        value: 4,
    },
    {
        label: '建议修复',
        value: 3,
    },
    {
        label: '可选修复',
        value: 2,
    },
];
const levelOptions = [
    {
        label: '严重',
        value: 5,
    },
    {
        label: '高危',
        value: 4,
    },
    {
        label: '中危',
        value: 3,
    },
    {
        label: '低危',
        value: 2,
    },
];
// const compOptions = ref<Array<any>>([]);

// 新增组件
// const addCompHandle = () => {
//     formData3.comps.unshift({
//         comp_name: undefined,
//         version: [],
//         repository: '',
//         ecosystem: '',
//     });
// };

// 移除组件
// const removeCompHandle = (index: number) => {
//     // eslint-disable-next-line no-unsafe-optional-chaining
//     if (index === formData3.comps?.length - 1) return;
//     formData3.comps.splice(index, 1);
// };

// 远程搜索组件
// const remoteMethod = async (search: string) => {
//     if (!search) return;
//     const res = await searchCompApi({
//         search,
//     });
//     compOptions.value = res.data;
//     compOptions.value = compOptions.value.map((item) => ({
//         comp: `${item.name}yaocheng${item.ecosystem}`,
//         ...item,
//     }));
// };

// // changeEcosystem
// const changeEcosystem = (item: any) => {
//     [item.comp_name, item.ecosystem] = item.comp_name.split('yaocheng');
// };

// // 确认
// const confirmHandle = async () => {
//     if (!formData1.name) {
//         showMessage('必填项不能为空', 'warning');
//         return;
//     }

//     let info: any = formData3;
//     if (!formData3.vuln.cve.length && !formData3.vuln.mps.length && !formData3.vuln.level.length && !formData3.vuln.is_poc && !formData3.vuln.is_rce) {
//         info = {
//             comps: formData3.comps,
//         };
//     }
//     await strategyConfigApi({
//         ...formData1,
//         ...formData2,
//         strategy_info: info,
//     });
//     showMessage('配置成功', 'success');
//     bus.emit('closeEdit', false);
// };
</script>

<style lang='less' scoped>
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
        background: #F7F8FB;
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

.btns {
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;

    .el-button {
        width: 80px;
        height: 32px;
    }
}
</style>

<style>
.el-form-item__label {
    font-weight: 500;
    color: #3c3c3c;
}
</style>
