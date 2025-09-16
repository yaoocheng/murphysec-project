<template>
    <div class="execution_rule">
        <div style="font-size: 16px;color: #3c3c3c;margin-bottom: 16px;">检测配置</div>
        <div class="pattern" v-if="detectInfo.access_type !== 'comp'">
            <div class="title">
                <span class="g-color-err">*</span> 检测模式
                <a href="/docs/faqs/detection/detection-mode.html" target="_blank">说明</a>
            </div>

            <div v-if="checkProjectName()" class="tip g-f-14 g-fw-500 g-color-1 g-flex g-justify-between">
                <div>
                    <i class="murphy icon-gantanhao g-vertical--1 g-mr-4" style="color: #FF9940;"></i>
                    识别到待检测文件可能是固件，选择「固件扫描」模式可更精准识别固件中存在的开源组件及漏洞
                </div>
            </div>

            <div class="g-bg-f7 g-bdr-6 g-p-16">
                <div class="configs">
                    <div class="g-p-12 item-wrap g-flex-grow-1" :class="{ 'white': item.num === detectInfo.scan_mode }"
                         @click="selectScanModeHandle(index, item.num)" v-for="(item, index) in configs" :key="index">
                        <div class="item" :class="{ 'first': item.num === detectInfo.scan_mode }">
                            <i class="murphy icon-duihao1 check_icon"></i>
                            <div class="g-flex" style="height: 60px;">
                                <i class="murphy" :class="item.icon"></i>
                                <div>
                                    <div class="g-f-14 g-color-1 g-f-500 g-mb-4">{{ item.name }}</div>
                                    <div class="g-f-12 g-color-3 g-fw-400">{{ item.secondDesc }}</div>
                                </div>
                            </div>
                            <img style="width: 178px;margin-top: 8px;position: relative; left: -3px" :src="item.speed"
                                 alt="">
                        </div>
                    </div>
                </div>

                <div class="g-bg-ff g-p-16">
                    <div class="g-bg-f7 g-p-12 g-bdr-6 g-mb-16">
                        <span class="g-fw-500 g-color-1" style="line-height: 25px;">检测模式说明：
                        </span>{{ configs[activeSchema].desc }}
                    </div>

                    <div>
                        <div v-if="detectInfo.scan_mode === 1 || detectInfo.scan_mode === 3 || detectInfo.scan_mode === 6"
                             class="g-f-16 g-color-1 g-fw-500 g-bg-f7 g-pl-24 g-pt-24 g-pb-8"
                             style="border-top-left-radius: 6px; border-top-right-radius: 6px;">
                            扫描配置
                        </div>
                        <div class="scan-switch g-flex g-justify-between g-align-center"
                             style="border-top-left-radius: 6px;border-top-right-radius: 6px;"
                             v-if="detectInfo.scan_mode === 1 || detectInfo.scan_mode === 6">
                            <div>
                                <div class="g-fw-500 g-color-1 g-mb-6">编译/构建</div>
                                <div class="g-fw-400 g-color-3 g-f-12">开启后，扫描时会对 Maven
                                    包管理器类型的项目进行模拟构建，检测结果更准确；关闭后，扫描速度更快</div>
                            </div>
                            <el-tooltip placement="left">
                                <template #content>
                                    <div style="width: 400px;">
                                        关闭此项会导致检测结果的准确性受限（仅对 Maven 包管理器类型的项目有影响）
                                    </div>
                                </template>
                                <el-switch inline-prompt active-text="是" inactive-text="否" v-model="detectInfo.is_build"
                                           style="--el-switch-on-color: #6C87FF;" />
                            </el-tooltip>
                        </div>

                        <div v-if="detectInfo.scan_mode === 1 || detectInfo.scan_mode === 6"
                             style="height: 1px;background-color: #2A2C3214; margin: 0 12px;"></div>

                        <div class="scan-switch g-flex g-justify-between g-align-center"
                             v-if="detectInfo.scan_mode === 1 || detectInfo.scan_mode === 6">
                            <div>
                                <div class="g-fw-500 g-color-1 g-mb-6">漏洞真实影响评估</div>
                                <div class="g-fw-400 g-color-3 g-f-12">开启后，扫描时会深入分析漏洞是否会被真实触发；关闭后，将不分析此项</div>
                            </div>
                            <el-switch inline-prompt active-text="是" inactive-text="否" v-model="detectInfo.is_deep"
                                       style="--el-switch-on-color: #6C87FF;" />
                        </div>

                        <div v-if="detectInfo.scan_mode === 1 || detectInfo.scan_mode === 6"
                             style="height: 1px;background-color: #2A2C3214; margin: 0 12px;"></div>

                        <div class="scan-switch"
                             v-if="(detectInfo.scan_mode === 1 || detectInfo.scan_mode === 6) && store.conf?.add_code_similarity">
                            <div class="g-flex g-justify-between g-align-center">
                                <div>
                                    <div class="g-fw-500 g-color-1 g-mb-6">代码同源性分析</div>
                                    <div class="g-fw-400 g-color-3 g-f-12">
                                        开启后，扫描时会同步溯源代码片段，并识别项目中是否存在相似代码和抄袭代码的问题，但会增加耗时；关闭后，将不分析此项</div>
                                </div>
                                <el-switch inline-prompt active-text="是" inactive-text="否"
                                           v-model="detectInfo.is_autonomous" style="--el-switch-on-color: #6C87FF;" />
                            </div>

                            <div class="g-mt-16" v-if="detectInfo.is_autonomous">
                                <span class="g-mr-32">
                                    开源项目最小相似文件数
                                    <TipsComp placement="top" :width="370"
                                              content="当一个开源项目与被检测项目至少有 X 个文件相似时，该开源项目才会在同源性分析的检测结果中展示" />
                                    <el-input-number style="width: 120px;" :min="0" class="g-mr-8 g-ml-8"
                                                     v-model="detectInfo.match_min_feature_file_num" /> 个
                                </span>

                                <!-- <span class="g-mr-32">
                                    开源项目代码最小相似比例
                                    <TipsComp placement="top" :width="370"
                                        content="当一个开源项目中至少有 X% 的代码与被检测项目相似，该开源项目才会在同源性分析的检测结果中展示" />
                                    <el-input-number style="width: 120px;" class="g-mr-8 g-ml-8"
                                        v-model="detectInfo.match_min_projects_ratio" :min="1" :max="100" /> %
                                </span> -->

                                <span>
                                    检测项目代码最小相似比例
                                    <TipsComp placement="top" :width="370"
                                              content="当一个开源项目与被检测项目中至少 X% 的文件相似时，该开源项目才会在同源性分析的检测结果中展示" />
                                    <el-input-number style="width: 120px;" class="g-mr-8 g-ml-8"
                                                     v-model="detectInfo.match_min_ratio" :min="0" :max="100" /> %
                                </span>
                            </div>
                        </div>

                        <div v-if="(detectInfo.scan_mode === 1 || detectInfo.scan_mode === 6) && store.conf?.add_code_similarity"
                             style="height: 1px;background-color: #2A2C3214; margin: 0 12px;"></div>

                        <div class="scan-switch g-flex g-justify-between g-align-center"
                             v-if="store.conf?.module_binary_analysis && (detectInfo.scan_mode === 1 || detectInfo.scan_mode === 3)">
                            <div>
                                <div class="g-fw-500 g-color-1 g-mb-6">二进制文件同源性分析</div>
                                <div class="g-fw-400 g-color-3 g-f-12">开启后，扫描时会同步对项目中的二进制文件进行同源性对比分析，但会增加耗时；关闭后，扫描速度更快
                                </div>
                            </div>
                            <el-switch inline-prompt active-text="是" inactive-text="否"
                                       v-model="detectInfo.is_module_binary_analyze" style="--el-switch-on-color: #6C87FF;" />
                        </div>

                        <div v-if="store.conf?.module_binary_analysis && (detectInfo.scan_mode === 1 || detectInfo.scan_mode === 3)"
                             style="height: 1px;background-color: #2A2C3214; margin: 0 12px;"></div>

                        <div class="scan-switch g-flex g-justify-between g-align-center"
                             style="border-bottom-left-radius: 6px;border-bottom-right-radius: 6px;"
                             v-if="detectInfo.scan_mode === 1 || detectInfo.scan_mode === 3">
                            <div>
                                <div class="g-fw-500 g-color-1 g-mb-6">安卓制品深度扫描</div>
                                <div class="g-fw-400 g-color-3 g-f-12">开启后，针对安卓制品的扫描能力更强，但会增加耗时；关闭后，扫描速度更快</div>
                            </div>
                            <el-switch inline-prompt active-text="是" inactive-text="否" v-model="detectInfo.is_libloom"
                                       style="--el-switch-on-color: #6C87FF;" />
                        </div>

                        <!-- <div v-if="(detectInfo.scan_mode === 1)"
                            style="height: 1px;background-color: #2A2C3214; margin: 0 12px;"></div> -->

                        <div class="scan-switch g-flex g-justify-between g-align-center"
                             v-if="(detectInfo.scan_mode === 4)">
                            <div>
                                <div class="g-fw-500 g-color-1 g-mb-6">固件深度扫描</div>
                                <div class="g-fw-400 g-color-3 g-f-12">
                                    开启后，扫描时会对固件内的文件进行识别和分析，并用于后续进行差异对比的基础，但会增加耗时；关闭后，扫描速度更快
                                </div>
                            </div>
                            <el-switch inline-prompt active-text="是" inactive-text="否" v-model="detectInfo.is_iot_deep"
                                       style="--el-switch-on-color: #6C87FF;" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="pattern">
            <div class="title">
                <span style="color: red;">*</span>
                检测语言及目录范围
                <TipsComp content="设置的扫描语言仅对源代码项目生效" placement="top" />
            </div>
            <div class="configs">
                <el-select style="width: 100%" filterable v-model="detectInfo.detection_scope_id">
                    <el-option v-for="item in deectTempList" :disabled="item.is_open === 2" :key="item.id"
                               :label="item.name" :value="item.id">
                        <div>
                            {{ item.name }} - {{ item.id }}
                        </div>
                    </el-option>
                    <template #footer>
                        <span @click="isAddModal = true" class="g-color-5 g-f-14 g-cursor-pointer"><i
                            class="murphy icon-jia g-vertical--1"></i> 添加检测范围模板</span>
                    </template>
                </el-select>
            </div>
        </div>

        <div class="pattern">
            <div class="title">
                <span style="color: red;">*</span>
                所属项目组
            </div>
            <div class="configs">
                <el-select style="width: 100%" v-model="detectInfo.projects_id">
                    <el-option v-for="item in projectsOptions" :key="item.value" :label="item.label"
                               :value="item.value">
                               <!-- <div v-if="item.value !== 'add'">{{ item.label }}</div>
                        <div v-else style="color:#6C87FF; text-align: center;" @click.stop="isShowAddClass = true">新建项目组
                        </div> -->
                    </el-option>
                    <template #footer>
                        <span @click.stop="isShowAddClass = true" class="g-color-5 g-f-14 g-cursor-pointer"><i
                            class="murphy icon-jia g-vertical--1"></i> 新建项目组</span>
                    </template>
                </el-select>
            </div>
        </div>

        <div class="pattern"
             v-if="(!store.conf?.is_close_project_aggregation_modify && (detectInfo.access_type === 'upload' || detectInfo.access_type === 'git' || detectInfo.access_type === 'docker' || detectInfo.access_type === 'svn')) || detectInfo.access_type === 'comp'">
            <div class="title">
                <span
                    v-if="(!store.conf?.is_close_project_aggregation_modify && (detectInfo.access_type === 'upload' || detectInfo.access_type === 'git' || detectInfo.access_type === 'docker' || detectInfo.access_type === 'svn')) || detectInfo.access_type === 'comp'"
                    class="g-color-err">*</span>
                项目名称
            </div>
            <div class="configs">
                <el-input v-model="detectInfo.project_name" placeholder="请输入自定义项目名称"></el-input>
            </div>
        </div>

        <div class="pattern">
            <div class="title">
                自定义项目标签
            </div>
            <div class="configs">
                <el-select :reserve-keyword="false" @change="changeTagNames" multiple filterable allow-create
                           default-first-option style="width: 100%" v-model="detectInfo.project_tag_names">
                    <el-option v-for="item in tagList" :key="item.tag_id" :label="item.tag_name" :value="item.tag_name">
                    </el-option>
                </el-select>
            </div>
        </div>

        <div class="pattern" v-if="store.conf?.is_cmdb_open">
            <div class="title">
                <span style="color: red;">*</span>
                默认标签
            </div>
            <div class="configs">
                <el-select popper-class="default-tag-select" style="width: 100%" filterable
                           v-model="detectInfo.cmdb_tag">
                    <el-option v-for="(item, key) in defaultTagOption" :key="key" :label="item.name" :value="item.name">
                        <div style="height: 20px;" class="g-fw-400">
                            {{ item.name }}
                        </div>
                        <div>
                            <span class="g-f-12 g-color-3 g-fw-400" v-for="(ele, i) in item.primaryDep?.slice(0, 2)"
                                  :key="ele">{{ ele
                                  }}<span v-if="i === 0">-</span></span>
                        </div>
                    </el-option>
                </el-select>
            </div>
        </div>

        <div class="pattern"
             v-if="(detectInfo.scan_mode === 1 || detectInfo.scan_mode === 5 || detectInfo.scan_mode === 6) && privateList?.length">
            <div class="title">
                私有源
                <el-tooltip placement="top" content="未选择私有源时，默认通过系统全局私有源进行扫描">
                    <i class="murphy icon-doc g-color-3"></i>
                </el-tooltip>
            </div>
            <div class="configs">
                <el-select clearable style="width: 100%" v-model="detectInfo.package_private_id">
                    <el-option v-for="item in privateList" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </div>
        </div>

        <div class="pattern">
            <div class="title">
                应用组件策略
                <TipsComp :width="344" content="默认展示全局应用的组件策略且不可删除，可自由选择未全局应用的组件策略；组件命中后将自动应用策略设置的处置动作" />
                <!-- <el-tooltip placement="top" content="">
                    <i class="murphy icon-doc g-color-3"></i>
                </el-tooltip> -->
            </div>
            <div class="configs">
                <el-select style="width: 100%" v-model="detectInfo.strategy_info" @remove-tag="removeStrategyHandle"
                           multiple>
                    <el-option v-for="item in strageOptions" :key="item.id" :label="item.name" :value="item.id">
                        <div v-if="item.is_global === 1" @click.stop>{{ item.name }}</div>
                        <div v-if="item.is_global === 2">{{ item.name }}</div>
                    </el-option>
                </el-select>
            </div>
        </div>

        <div class="high_config" @click="expand = !expand">
            高级配置
            <i class="murphy icon-shouqi" v-if="expand"></i>
            <i class="murphy icon-xiala1" v-else></i>
        </div>

        <div v-show="expand">
            <!-- <div style="margin-bottom: 30px;">
                <span class="title" style="margin-right: 10px;">是否开启许可证合规分析</span>
                <el-switch inline-prompt active-text="开" inactive-text="关" :active-value="1" :inactive-value="2"
                    v-model="detectInfo.detector_license_disable" style="--el-switch-on-color: #6C87FF;" />
            </div> -->

            <div class="dispose_result">
                <div class="notice">
                    <div class="title">
                        设置通知条件
                        <span style="color:#8C95A1;font-size: 12px;">（满足以下任意一项）</span>
                    </div>

                    <div>
                        <el-checkbox v-model="detectInfo.notice_rule_leak_comp_disable" :true-label="1" :false-label="2"
                                     label="缺陷组件处置规则" />
                    </div>
                    <div class="scope" style="margin-bottom: 15px;">
                        <el-select v-model="detectInfo.notice_rule_leak_comp_high_suggest_low" style="width: 240px">
                            <el-option v-for="item in compRuleOptions" :key="item.value" :label="item.label"
                                       :value="item.value" />
                        </el-select>
                        <span style="margin: 0 14px">大于</span>
                        <el-input-number v-model.number="detectInfo.notice_rule_leak_comp_num" :min="0" :max="999" />
                        <span style="margin-left: 10px;">时通知</span>
                    </div>
                    <div>
                        <el-checkbox v-model="detectInfo.notice_rule_license_disable" :true-label="1" :false-label="2"
                                     label="许可证合规处置规则" />
                    </div>
                    <div class="scope">
                        <el-select v-model="detectInfo.notice_rule_license_risk_low" style="width: 240px">
                            <el-option v-for="item in licenseRuleOptions" :key="item.value" :label="item.label"
                                       :value="item.value" />
                        </el-select>
                        <span style="margin: 0 14px">大于</span>
                        <el-input-number v-model.number="detectInfo.notice_rule_license_num" :min="0" :max="999" />
                        <span style="margin-left: 10px;">时通知</span>
                    </div>
                </div>

                <div class="message_notice">
                    <div class="title">
                        消息通知
                        <span style="color:#8C95A1;font-size: 12px;">（可配置多项）</span>
                    </div>
                    <div class="desc">
                        当缺陷组件、漏洞信息及许可证风险与上次检测结果相同时，则将不重复推送检测结果
                    </div>
                    <div class="notice_wrap">
                        <div class="item" :class="{ 'active': activeMessageActive === -1 }"
                             @click="activeMessageActive = -1">
                            <i class="murphy icon-duihao1 check_icon"></i>
                            <img src="~ast/img/qyweixin.png" alt="">
                            <img src="~ast/img/feishu.png" alt="">
                            <img src="~ast/img/ding.png" alt="">
                            <div class="name">
                                办公软件
                                <i v-if="(detectInfo.notice_im_robots_disable === 1 && detectInfo.im_robots_addr[0]?.addr)"
                                   style="color:rgb(104, 191, 123)" class="murphy icon-tijiaochenggong"></i>
                            </div>
                            <div class="desc">支持企微、飞书、钉钉通知</div>
                        </div>

                        <div class="item" :class="{ 'active': activeMessageActive === index }"
                             @click="activeMessageActive = index" v-for="(item, index) in noticeData" :key="index">
                            <i class="murphy icon-duihao1 check_icon"></i>
                            <i :class="`murphy ${item.icon}`" style="color:#6C87FF; font-size: 22px;"></i>
                            <div class="name">
                                {{ item.name }}
                                <i v-if="((index === 0) && getUserInfo()?.email && detectInfo.notice_self_email_disable === 1)"
                                   style="color:rgb(104, 191, 123)" class="murphy icon-tijiaochenggong"></i>
                                <i v-if="((index === 1) && getUserInfo()?.phone && detectInfo.notice_self_phone_disable === 1)"
                                   style="color:rgb(104, 191, 123)" class="murphy icon-tijiaochenggong"></i>
                                <i v-if="((index === 2) && detectInfo.notice_api_addr && detectInfo.notice_api_disable === 1)"
                                   style="color:rgb(104, 191, 123)" class="murphy icon-tijiaochenggong"></i>
                                <i v-if="((index === 3) && detectInfo.other_contact.length && detectInfo.notice_other_disable === 1)"
                                   style="color:rgb(104, 191, 123)" class="murphy icon-tijiaochenggong"></i>
                            </div>
                            <div class="desc">{{ item.desc }}</div>
                        </div>
                    </div>
                </div>

                <OfficeSoftware v-show="activeMessageActive === -1" />
                <EmailNotice v-show="activeMessageActive === 0" />
                <ApiNotice v-show="activeMessageActive === 1" />
                <OtherNotice v-show="activeMessageActive === 2" />
            </div>

            <div style="margin-top: 30px;">
                <span class="title" style="margin-right: 10px;font-weight: 600;">自动检测</span>
                <el-switch inline-prompt active-text="开" inactive-text="关" :active-value="2" :inactive-value="1"
                           v-model="detectInfo.cron_type" style="--el-switch-on-color: #6C87FF;" />
            </div>
        </div>

        <el-dialog width="420px" v-model="isShowAddClass" :close-on-click-modal="false">
            <template #header>
                <div class="modal_title">
                    新建项目组
                </div>
                <div class="modal_desc">
                    给你的项目组取个有趣的名字
                </div>
            </template>

            <div>
                <el-input v-model="calssValue" placeholder="请输入项目组名称"></el-input>
            </div>
            <div class="btns">
                <el-button class="cancle_btn" @click="isShowAddClass = false">取消</el-button>
                <el-button @click="createClassHandle">确认</el-button>
            </div>
        </el-dialog>
    </div>

    <EditTemp v-model="isAddModal" v-if="isAddModal" @triggerEdit="triggerEdit" />
</template>

<script setup lang='ts'>
import { onBeforeMount, ref } from 'vue';
import bus, { getUserInfo, showMessage } from 'util/tools';
import { getPrivateListApi } from 'api/detect';
import { getProjectClassListApi, createProjectClassApi, getProjectTagsApi } from 'api/project';
import { getStrategyListApi } from 'api/team';
import { getDetectTempListApi, getGlobalSetApi, addDetectTempApi } from 'api/set';
import { getDefaultTagsApi } from 'api/asset';
import { useRoute } from 'vue-router';
import store, { detectInfo } from '@/utils/store';
import {
    configs, noticeData, licenseRuleOptions, compRuleOptions, sensitiveKeywords,
} from './constants/constant';
import OfficeSoftware from './notice/OfficeSoftware.vue';
import EmailNotice from './notice/EmailNotice.vue';
import ApiNotice from './notice/ApiNotice.vue';
import OtherNotice from './notice/OtherNotice.vue';
import { getOrgAuthInfo } from '@/control/org/hooks';
import TipsComp from '@/components/TipsComp.vue';
import EditTemp from '../set/detect-temp/EditTemp.vue';

const route = useRoute();
const { isUserSpace } = getOrgAuthInfo();
const activeMessageActive = ref<number>(-1); // 切换消息通知
const expand = ref<boolean>(false);
const projectsOptions = ref<Array<any>>([]);
const privateList = ref<any[]>([]);
const strageOptions = ref<Array<any>>([]);
const isShowAddClass = ref<boolean>(false);
const calssValue = ref<string>('');
const activeSchema = ref<number>(0);
const defaultTagOption = ref<any[]>([]);
const cacheStrategyInfo = ref<Array<any>>([]); // 缓存选中的策略项
const tagList = ref<any[]>([]);
const deectTempList = ref<any[]>([]);
const isAddModal = ref(false);

const changeTagNames = (value: string[]) => {
    if (value[value.length - 1].length > 10) {
        value.pop();
        showMessage('长度不能超过10个字符', 'warning');
    }
};

const getAutonomousInfo = async () => {
    if (!route.query.type) {
        try {
            const { data } = await getGlobalSetApi({ org_id: 2 });
            detectInfo.match_min_feature_file_num = data.match_min_feature_file_num;
            detectInfo.match_min_projects_ratio = data.match_min_projects_ratio;
            detectInfo.match_min_ratio = data.match_min_ratio;
        } catch (error) {
            console.log(error);
        }
    }
};
getAutonomousInfo();

// 获取项目组列表
const getClassListHandle = async () => {
    try {
        // 获取项目组列表
        const res = await getProjectClassListApi({ team_id: store.teamInfo.team_id });
        projectsOptions.value = res.data.list.map((item: any) => ({
            value: item.id,
            label: item.name,
        }));
        if (!detectInfo.projects_id || !detectInfo.projects_id?.length) {
            detectInfo.projects_id = projectsOptions.value[projectsOptions.value.length - 1].value;
        }
    } catch (error) {
        console.log(error);
    }

    if (store.conf?.is_cmdb_open) {
        try {
            const { data } = await getDefaultTagsApi();
            defaultTagOption.value = data;
        } catch (error) {
            console.log(error);
        }
    }

    try {
        const { data } = await getPrivateListApi({
            team_id: store.teamInfo.team_id,
        });
        privateList.value = data;
    } catch (error) {
        console.log(error);
    }

    try {
        const { data } = await getProjectTagsApi({
            team_id: store.teamInfo.team_id,
        });
        tagList.value = data;
    } catch (error) {
        console.log(error);
    }
};

// 获取策略组
const getStrategyList = async () => {
    const res = await getStrategyListApi({
        list_type: 'current_team_and_parent_org',
        team_id: store.teamInfo.team_id,
        keyword: '',
    });
    strageOptions.value = res.data || [];

    if (!isUserSpace.value) {
        strageOptions.value.forEach((ele) => {
            ele.name = `${ele.name}-${ele.org_name}`;
        });
    }
    if (strageOptions.value.length) {
        // 上次配置后，策略被关闭下次也不会显示
        detectInfo.strategy_info = detectInfo.strategy_info?.filter((item) => strageOptions.value.find((ele) => ele.id && item === ele.id)?.is_open === 1);

        // 策略关闭不可选
        strageOptions.value = strageOptions.value?.filter((item) => item?.is_open === 1);

        // 默认选择全局策略
        detectInfo.strategy_info = [...new Set([...strageOptions.value.filter((item) => item.is_global === 1).map((ele) => ele.id), ...detectInfo.strategy_info])];

        cacheStrategyInfo.value = [...detectInfo.strategy_info];
    }
};

// 移除策略
const removeStrategyHandle = (val: string) => {
    if (strageOptions.value.find((item: any) => item.id === val)?.is_global === 1) {
        const index = cacheStrategyInfo.value.findIndex((ele: string) => ele === val);
        detectInfo.strategy_info.splice(index, 0, val);
        showMessage('全局配置策略不可移除', 'warning');
    }
};

// 选择scanmode
const selectScanModeHandle = (index: number, type: number) => {
    activeSchema.value = index;
    detectInfo.scan_mode = type;
};

// 选择检测模板
const getDetectTemp = async () => {
    const { data } = await getDetectTempListApi({
        team_id: store.teamInfo.team_id,
        list_type: 'current_team_and_parent_org',
    });

    deectTempList.value = data.list;
    if (detectInfo.detection_scope_id === '0' || !detectInfo.detection_scope_id) {
        detectInfo.detection_scope_id = data.list.find((item: any) => item.is_default === 1)?.id;
    }
};
bus.on('updateDefaultConfig', () => {
    getDetectTemp();
    getClassListHandle();
});

const triggerEdit = async (data: any) => {
    if (data) {
        try {
            await addDetectTempApi(data);
            showMessage('添加成功', 'success');
            getDetectTemp();
        } catch (error) {
            console.log(error);
        }
    }
    isAddModal.value = false;
};

onBeforeMount(() => {
    getClassListHandle();
    getStrategyList();
    getDetectTemp();
});

const createClassHandle = async () => {
    try {
        await createProjectClassApi({
            team_id: store.teamInfo.team_id,
            projects_name: calssValue.value,
        });
        showMessage('创建成功', 'success');
        getClassListHandle();
        isShowAddClass.value = false;
    } catch (error) {
        console.log(error);
    }
};

// 智能判断固件
const checkProjectName = () => {
    if (route.query.from === 'upload') {
        return sensitiveKeywords.some((item) => detectInfo.project_name.toLowerCase().includes(item));
    }
};
</script>

<style lang='less' scoped>
.execution_rule {
    font-size: 14px;
    color: #555362;
    // max-width: 978px;
    // margin: 0 auto;
}

.btn {
    margin-top: 40px;
}

.up_btn {
    &:hover {
        background-color: rgb(248, 248, 248);
    }

    background-color: #fff;
    color: #666 !important;
    border: 1px solid #E0E0E5 !important;
}

.config_title {
    font-size: 24px;
    font-weight: 600;
    color: #3D3D3D;
    margin-bottom: 50px;
}

.pattern {
    margin-bottom: 24px;

    .tip {
        padding: 8px 16px;
        border-radius: 6px;
        background-color: #FF994033;
        margin-bottom: 16px;
    }
}

.title {
    font-size: 14px;
    color: #3D3D3D;
    margin-bottom: 14px;
}

.configs {
    display: flex;
    justify-content: space-between;

    .white {
        background-color: #fff;
    }

    .item-wrap {
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
    }

    .mode_desc {
        font-size: 12px;
        color: #858585;
        margin-top: 4px;
        line-height: 18px;
    }

}

.scan_desc {
    padding: 8px 12px;
    background: #F7F8FB;
    border-radius: 6px;
    color: @text-color;
    margin-bottom: 24px;
}

.configs .item {
    width: 206px;
    height: 128px;
    background: #FFFFFF;
    border-radius: 6px;
    border: 1px solid #EFEFEF;
    padding: 12px 16px;
    box-sizing: border-box;
    font-size: 14px;
    color: #555362;
    // display: flex;
    position: relative;
    cursor: pointer;

    i:not(.check_icon) {
        font-size: 26px;
        margin-right: 10px;
        color: #6C87FF;
    }

    &::before {
        content: '';
        display: none;
        width: 18px;
        height: 18px;
        background: #6C87FF;
        border-radius: 0px 6px 0px 6px;
        position: absolute;
        right: -1px;
        top: 0;
    }

    .check_icon {
        display: none;
        position: absolute;
        right: 2px;
        top: 2px;
        font-size: 12px;
        color: #fff;
    }
}

.configs .item.first {
    &::before {
        display: inline-block;
    }

    // background-color: #6C87FF0D;
    position: relative;
    border: 1px solid #6C87FF;

    .check_icon {
        display: block;
    }
}

.scan-switch {
    background-color: #F7F8FB;
    padding: 24px;
}

.high_config {
    color: #858585;
    cursor: pointer;
    margin-bottom: 16px;
}

.dispose_result {
    font-size: 14px;
    color: #555362;
}

.config_title {
    font-size: 24px;
    font-weight: 600;
    color: #3D3D3D;
    margin-bottom: 50px;
}

.title {
    font-size: 14px;
    color: #3c3c3c;
    margin-bottom: 10px;
}

.btn {
    margin-top: 40px;
}

.up_btn {
    &:hover {
        background-color: rgb(248, 248, 248);
    }

    background-color: #fff;
    color: #666 !important;
    border: 1px solid #E0E0E5 !important;
}

.notice {
    margin-bottom: 30px;
}

.scope {
    display: flex;
    align-items: center;
}

.message_notice {
    margin-bottom: 40px;

    .desc {
        font-size: 12px;
        color: rgb(140, 149, 161);
        margin-bottom: 10px;
    }
}

.message_notice .item {
    &:nth-of-type(5) {
        margin: 0;
    }

    position: relative;
    padding: 15px 10px;
    background: #FFFFFF;
    border-radius: 6px;
    border: 1px solid #EFEFEF;
    font-size: 14px;
    color: #555362;
    margin-right: 30px;
    cursor: pointer;

    .desc {
        font-size: 12px;
        color: rgb(140, 149, 161);
    }

    .name {
        margin: 10px 0;
    }

    img {
        width: 20px;
        margin-right: 10px;
    }

    .check_icon {
        display: none;
        font-size: 12px;
        color: #fff;
    }
}

.item.active {
    &::before {
        content: '';
        display: inline-block;
        width: 18px;
        height: 18px;
        background: #6C87FF;
        border-radius: 0px 6px 0px 6px;
        position: absolute;
        right: -1px;
        top: 0;
    }

    .check_icon {
        display: block;
        position: absolute;
        right: 2px;
        top: 2px;
    }

    box-shadow: 0px 3px 8px 0px rgba(108, 135, 255, 0.38);
    border: 1px solid #6C87FF;
}

.item.hide {
    display: none;
}

.btns {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
}

.notice_wrap {
    display: flex;
}
</style>

<style lang="less">
.default-tag-select .el-select-dropdown__item {
    height: auto;
}
</style>
