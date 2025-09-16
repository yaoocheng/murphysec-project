<template>
    <el-dialog width="1036px" top="5%" :title="`项目策略`" :close-on-click-modal="false">
        <div class="edit_strategy">
            <div class="part_title">
                <span class="g-color-err">*</span> 策略基本信息
            </div>

            <!-- 基本信息 -->
            <div class="part_content" style="padding-bottom: 1px;">
                <FormComp label-position="top" :hide-required-asterisk="false">
                    <el-form-item :required="true" label="策略名称">
                        <div style="width: 100%;">
                            {{ editData.name }}
                            <!-- <el-input v-model="editData.name" maxlength="30" show-word-limit
                                placeholder="请输入策略名称"></el-input> -->
                        </div>
                    </el-form-item>

                    <el-form-item label="策略说明" v-if="editData.desc">
                        <div style="width: 100%;">
                            {{ editData.desc || '-' }}
                            <!-- <el-input type="textarea" :rows="4" maxlength="500" show-word-limit resize="none"
                                v-model="editData.desc" placeholder="请输入策略说明"></el-input> -->
                        </div>
                    </el-form-item>

                    <el-form-item :required="true" label="是否开启策略">
                        <div>
                            {{ editData.is_open === 1 ? '是' : '否' }}
                            <!-- <el-switch inline-prompt v-model="editData.is_open" active-text="是" inactive-text="否"
                                :active-value="1" :inactive-value="2" style="--el-switch-on-color: #6C87FF;" /> -->
                        </div>
                    </el-form-item>
                </FormComp>
            </div>

            <div class="part_title">
                <span class="g-color-err">*</span> 规则设置
            </div>

            <!-- 组件规则 -->
            <div class="part_content" v-if="editData.strategy_info?.defect_comp_suggest?.suggest_levels||editData.strategy_info?.comp_ext||editData.strategy_info?.comps?.length">
                <div class="g-f-16 g-color-1 g-fw-500 g-mb-8">
                    <span class="g-color-err">*</span> 组件规则
                </div>
                <!-- <el-radio-group class="g-mb-12" v-model="editData.strategy_info.comp_logic">
                    <el-radio label="or" size="large">满足以下任一规则</el-radio>
                    <el-radio label="and" size="large">满足以下所有规则</el-radio>
                </el-radio-group> -->
                <div class="g-mb-8">{{ editData.strategy_info?.comp_logic === 'or' ? '满足以下任一规则' : '满足以下所有规则' }}</div>

                <div class="form">
                    <FormComp label-position="top" :hide-required-asterisk="false">
                        <el-form-item label="组件处置等级与数量" v-if="editData.strategy_info?.defect_comp_suggest?.suggest_levels">
                            <div style="width: 100%;">
                                {{ suggestOptions.find(item => item.value===editData.strategy_info.defect_comp_suggest.suggest_levels)?.label }}
                                >= {{ editData.strategy_info.defect_comp_suggest.num }} 时阻断
                                <!-- <SelectComp clearable
                                    v-model="editData.strategy_info.defect_comp_suggest.suggest_levels"
                                    :options="suggestOptions" placeholder="请选择处置等级" style="width: 240px;" /> -->
                                <!-- <span v-if="editData.strategy_info.defect_comp_suggest.suggest_levels">
                                    <span class="g-mr-8 g-ml-8">>=</span>

                                    <el-input-number clearable v-model="editData.strategy_info.defect_comp_suggest.num"
                                        :min="1" />
                                    时阻断
                                </span> -->
                            </div>
                        </el-form-item>

                        <el-form-item label="组件依赖类型" v-if="editData.strategy_info?.comp_ext?.is_direct_dependency !== undefined">
                            {{ editData.strategy_info.comp_ext.is_direct_dependency === true ? '直接依赖' : '间接依赖' }}
                            <!-- <el-radio-group v-model="editData.strategy_info.comp_ext.is_direct_dependency">
                                <el-radio :label="undefined">不启用该规则</el-radio>
                                <el-radio :label="true">直接依赖</el-radio>
                                <el-radio :label="false">间接依赖</el-radio>
                            </el-radio-group> -->
                        </el-form-item>

                        <el-form-item label="组件是否存在可触发漏洞" v-if="editData.strategy_info?.comp_ext?.is_triggers!==undefined">
                            {{ editData.strategy_info.comp_ext.is_triggers === true ? '组件存在可触发漏洞' : '组件不存在可触发漏洞' }}

                            <!-- <el-radio-group v-model="editData.strategy_info.comp_ext.is_triggers">
                                <el-radio :label="undefined">不启用该规则</el-radio>
                                <el-radio :label="true">是</el-radio>
                                <el-radio :label="false">否</el-radio>
                            </el-radio-group> -->
                        </el-form-item>

                        <el-form-item label="组件是否为线上依赖" v-if="editData.strategy_info?.comp_ext?.is_online!==undefined">
                            {{ editData.strategy_info.comp_ext.is_online === true ? '是线上依赖' : '不是线上依赖' }}

                            <!-- <el-radio-group v-model="editData.strategy_info.comp_ext.is_online">
                                <el-radio :label="undefined">不启用该规则</el-radio>
                                <el-radio :label="true">是</el-radio>
                                <el-radio :label="false">否</el-radio>
                            </el-radio-group> -->
                        </el-form-item>

                        <div class="g-color-1 g-fw-500 g-mb-16" v-if="editData.strategy_info.comps?.length">
                            指定组件 <span class="g-color-3 g-fw-400">组件之间为“或”的关系，项目中存在任一组件都会命中该规则</span>
                        </div>

                        <div class="comp_item" v-for="(item, index) in editData.strategy_info.comps" :key="index">
                            <div
                                style="color: #3c3c3c;margin-bottom: 18px;font-weight: 550;display: flex;justify-content: space-between;">
                                基本信息
                                <!-- <i :style="{ color: index !== editData.strategy_info.comps?.length - 1 ? '#6C87FF' : '#C7C7C7' }"
                                    @click="removeCompHandle(index)" class="murphy icon-shanchu"></i> -->
                                <!-- <i @click="removeCompHandle(index)"
                                    class="murphy icon-shanchu g-color-5 g-cursor-pointer"></i> -->
                            </div>

                            <FormComp label-position="top" :hide-required-asterisk="false">
                                <el-form-item label="组件名称" :required="true">
                                    <div style="width: 100%;">
                                        <span class="tag">{{ item.comp_name }}</span>
                                        <!-- <el-select style="width: 100%;" v-model="item.comp_name"
                                            @change="changeEcosystem(item)" filterable allow-create remote
                                            placeholder="请输入组件名称搜索" :remote-method="remoteMethod">
                                            <el-option v-for="(ele, index) in compOptions" :key="index"
                                                :label="`${ele.name}${ele.ecosystem ? `（${ele.ecosystem}）` : ''}`"
                                                :value="ele.comp" />
                                        </el-select> -->
                                    </div>
                                </el-form-item>

                                <el-form-item label="版本范围" :required="true">
                                    <div class="version_wrap" style="width: 100%;">
                                        <span class="tag">{{ item.version }}</span>

                                        <!-- <el-select style="width: 100%;" remote multiple filterable allow-create
                                            default-first-option v-model="item.version"
                                            placeholder="请输入版本范围 例：[0,3)[*,*][2.3.1,2.3.1]（按Enter键继续添加）">
                                        </el-select>
                                        <div class="tip">
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

                        <!-- <div @click="addCompHandle" class="g-p-16 g-bg-f7 g-bdr-6 g-ta-c">
                            <span class="g-color-5 g-cursor-pointer">
                                <i class="murphy icon-jiahao- g-vertical--1"></i>
                                新增
                            </span>
                        </div> -->
                    </FormComp>
                </div>
            </div>

            <!-- 漏洞规则 -->
            <div class="part_content" v-if="(editData.strategy_info?.vuln&&Object.keys(editData.strategy_info?.vuln)?.length) ||editData.strategy_info?.defect_vuln_level?.levels">
                <div class="g-f-16 g-color-1 g-fw-500">
                    <span class="g-color-err">*</span> 漏洞规则
                </div>

                <div class="g-mb-8">{{ editData.strategy_info?.vuln_logic === 'or' ? '满足以下任一规则' : '满足以下所有规则' }}</div>

                <!-- <el-radio-group class="g-mb-12" v-model="editData.strategy_info.vuln_logic">
                    <el-radio label="or" size="large">满足以下任一规则</el-radio>
                    <el-radio label="and" size="large">满足以下所有规则</el-radio>
                </el-radio-group> -->

                <div class="form">
                    <FormComp label-position="top" :hide-required-asterisk="false">
                        <el-form-item label="漏洞等级与数量" v-if="editData.strategy_info?.defect_vuln_level?.levels">
                            <div style="width: 100%;">
                                {{ levelOptions.find(item => item.value===editData.strategy_info?.defect_vuln_level?.levels)?.label }}
                                >= {{ editData.strategy_info.defect_vuln_level.num }} 时阻断
                                <!-- <SelectComp clearable v-model="editData.strategy_info.defect_vuln_level.levels"
                                    :options="levelOptions" placeholder="请选择漏洞等级" style="width: 240px;" />

                                <span v-if="editData.strategy_info.defect_vuln_level.levels">
                                    <span class="g-mr-8 g-ml-8">>=</span>

                                    <el-input-number clearable v-model="editData.strategy_info.defect_vuln_level.num"
                                        :min="1" />
                                    时阻断
                                </span> -->
                            </div>
                        </el-form-item>

                        <el-form-item v-if="editData.strategy_info?.vuln&&Object.keys(editData.strategy_info?.vuln)?.length">
                            <template #label>
                                <div>
                                    其他漏洞规则 <span class="g-color-3 g-fw-400">多个规则之间为“且”的关系</span>
                                </div>
                            </template>

                            <div class="g-bdr-6 g-bg-f7 g-p-16 g-w-100">
                                <FormComp label-position="top">
                                    <el-form-item label="漏洞CVE编号" class="g-mb-16" v-if="editData.strategy_info?.vuln?.cve?.length">
                                        <div style="width: 100%;">
                                            <span class="tag" v-for="a in editData.strategy_info.vuln.cve" :key="a">{{a}}</span>
                                            <!-- <el-select style="width: 100%;" remote multiple filterable allow-create
                                                default-first-option v-model="editData.strategy_info.vuln.cve"
                                                placeholder="请输入漏洞编号（按Enter键继续添加）">
                                            </el-select> -->
                                        </div>
                                    </el-form-item>
                                    <el-form-item label="MPS编号" class="g-mb-16" v-if="editData.strategy_info?.vuln?.mps?.length">
                                        <div style="width: 100%;">
                                            <span class="tag" v-for="a in editData.strategy_info.vuln.mps" :key="a">{{a}}</span>

                                            <!-- <el-select style="width: 100%;" v-model="editData.strategy_info.vuln.mps"
                                                remote multiple filterable allow-create default-first-option
                                                placeholder="请输入MPS编号（按Enter键继续添加）">
                                            </el-select> -->
                                        </div>
                                    </el-form-item>
                                    <el-form-item label="漏洞级别" class="g-mb-16" v-if="editData.strategy_info?.vuln?.level?.length">
                                        <div style="width: 100%;">
                                            <span class="tag" v-for="a in editData.strategy_info.vuln.level" :key="a">{{levelOptions.find(item => item.value===a)?.label}}</span>

                                            <!-- <el-select style="width: 100%;" v-model="editData.strategy_info.vuln.level"
                                                multiple>
                                                <el-option v-for="(item) in levelOptions" :key="item.value"
                                                    :label="item.label" :value="item.value" />
                                            </el-select> -->
                                        </div>
                                    </el-form-item>
                                    <el-form-item label="漏洞是否存在 POC" class="g-mb-16" v-if="editData.strategy_info?.vuln?.is_poc!==undefined">
                                        {{ editData.strategy_info.vuln.is_poc===true?'漏洞存在POC':'漏洞不存在POC' }}
                                        <!-- <el-radio-group v-model="editData.strategy_info.vuln.is_poc">
                                            <el-radio :label="undefined">不启用该规则</el-radio>
                                            <el-radio :label="true">是</el-radio>
                                            <el-radio :label="false">否</el-radio>
                                        </el-radio-group> -->
                                        <!-- <div>
                                            <el-checkbox v-model="editData.strategy_info.vuln.is_poc" label="启用该规则"
                                                size="large" />
                                        </div> -->
                                    </el-form-item>
                                    <el-form-item label="漏洞是否可 RCE" v-if="editData.strategy_info?.vuln?.is_rce!==undefined">
                                        {{ editData.strategy_info.vuln.is_rce===true?'漏洞可RCE':'漏洞不可RCE' }}

                                        <!-- <el-radio-group v-model="editData.strategy_info.vuln.is_rce">
                                            <el-radio :label="undefined">不启用该规则</el-radio>
                                            <el-radio :label="true">是</el-radio>
                                            <el-radio :label="false">否</el-radio>
                                        </el-radio-group> -->
                                        <!-- <div>
                                            <el-checkbox v-model="editData.strategy_info.vuln.is_rce" label="启用该规则"
                                                size="large" />
                                        </div> -->
                                    </el-form-item>
                                </FormComp>
                            </div>
                        </el-form-item>
                    </FormComp>
                </div>
            </div>

            <!-- 双方规则 -->
            <div class="g-f-16 g-color-1 g-fw-500">
                <span class="g-color-err">*</span> 组件与漏洞规则
            </div>
            <div class="g-mb-32 g-mt-12">{{ editData.strategy_info?.comp_vuln_logic === 'or' ? '满足以上任一规则' : '满足以上所有规则' }}</div>

            <!-- <el-radio-group class="g-mb-12" v-model="editData.strategy_info.comp_vuln_logic">
                <el-radio label="or" size="large">满足以下任一规则</el-radio>
                <el-radio label="and" size="large">满足以下所有规则</el-radio>
            </el-radio-group> -->

            <!-- 应用范围 -->
            <div class="g-f-16 g-color-1 g-fw-500 g-mb-8">
                <span class="g-color-err">*</span> 应用范围
            </div>
            <div class="part_content" style="padding-bottom: 1px;">
                <FormComp label-position="top" :hide-required-asterisk="false">
                    <el-form-item :required="true" label="策略范围">
                        {{ editData.is_global === 1 ? '全部项目' : '指定项目' }}
                        <!-- <el-radio-group v-model="editData.is_global" @change="editData.tags = []">
                            <el-radio :label="1" size="large">全部项目</el-radio>
                            <el-radio :label="2" size="large">指定项目</el-radio>
                        </el-radio-group> -->
                    </el-form-item>

                    <div v-if="editData.is_global === 2" class="g-bg-ff g-bdr-6 g-w-100 g-border-box"
                        style="padding: 16px;padding-bottom: 1px;">
                        <el-form-item :required="true" label="项目标签">
                            <span class="tag" v-for="a in editData.tags" :key="a">{{ a }}</span>
                            <!-- <el-select class="g-w-100" v-model="editData.tags" @change="changeTagNames"
                                :reserve-keyword="false" multiple filterable allow-create default-first-option
                                placeholder="请搜索并选择项目标签">
                                <el-option v-for="item in tagList" :key="item.tag_id" :label="item.tag_name"
                                    :value="item.tag_name" />
                            </el-select> -->
                        </el-form-item>
                    </div>
                </FormComp>
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang='ts'>
import FormComp from 'comp/FormComp.vue';
import { suggestOptions, levelOptions } from '@/control/set/constants/constant';
// import { useRoute, useRouter } from 'vue-router';
// import { } from 'api/project';
defineProps(['editData']);

// const compOptions = ref<Array<any>>([]);
// const tagList = ref<any[]>([]);

// onBeforeMount(async () => {
//     try {
//         const { data } = await getProjectTagsApi({
//             team_id: store.teamInfo.team_id,
//         });
//         tagList.value = data;
//     } catch (error) {
//         console.log(error);
//     }
// });

// const editData = reactive<any>(props.editData);

// // 新增组件
// const addCompHandle = () => {
//     editData.strategy_info.comps.unshift({
//         comp_name: undefined,
//         version: [],
//         repository: '',
//         ecosystem: '',
//     });
// };

// // 远程搜索组件
// const remoteMethod = async (search: string) => {
//     if (!search) return;
//     const res = await searchProjectCompApi({
//         search,
//     });
//     compOptions.value = res.data;
//     compOptions.value = compOptions.value.map((item) => ({
//         comp: `${item.name}yaocheng${item.ecosystem}`,
//         ...item,
//     }));
// };

// // 移除组件
// const removeCompHandle = (index: number) => {
//     // eslint-disable-next-line no-unsafe-optional-chaining
//     // if (index === editData.strategy_info.comps?.length - 1) return;
//     editData.strategy_info.comps.splice(index, 1);
// };

// // changeEcosystem
// const changeEcosystem = (item: any) => {
//     [item.comp_name, item.ecosystem] = item.comp_name.split('yaocheng');
// };

// const changeTagNames = (value: string[]) => {
//     if (value.length && value[value.length - 1].length > 10) {
//         value.pop();
//         showMessage('长度不能超过10个字符', 'warning');
//     }
// };

// const confirmHandle = async () => {
//     if (!editData.strategy_info.defect_comp_suggest.suggest_levels) {
//         editData.strategy_info.defect_comp_suggest = undefined;
//     }

//     if (!editData.strategy_info.defect_vuln_level.levels) {
//         editData.strategy_info.defect_vuln_level = undefined;
//     }

//     await projectStrategySaveApi(editData);
//     showMessage('配置成功', 'success');
//     bus.emit('closeEdit', false);
// };

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
    .tag {
        display: inline;
        padding: 4px 6px;
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
        padding: 24px;
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
