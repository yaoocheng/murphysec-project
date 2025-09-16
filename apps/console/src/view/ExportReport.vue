<template>
    <div class="export_report" v-loading.fullscreen="store.loading" element-loading-text="正在获取报告数据">
        <div class="head">
            <div>
                <img :src="$systemConfig.whiteLogo" alt="">
                <span>软件成分分析报告</span>
            </div>
        </div>

        <div class="report_content">
            <div class="part">
                <div class="part_title">
                    基本信息
                </div>
                <table class="left" border="1" cellspacing="0" cellpadding="0">
                    <tr>
                        <td>检测编号</td>
                        <td>{{ data.subtask_id }}</td>
                    </tr>
                    <tr>
                        <td>项目名称</td>
                        <td>{{ data.project_name }}</td>
                    </tr>
                    <tr>
                        <td>项目地址</td>
                        <td>{{ data.project_addr || '-' }}</td>
                    </tr>
                    <tr>
                        <td>检测分支</td>
                        <td>{{ data.subtask_branch || '-' }}</td>
                    </tr>
                    <tr>
                        <td>检测方式</td>
                        <td>{{ data.subtask_detector_type }}</td>
                    </tr>
                    <tr>
                        <td>主体语言</td>
                        <td>{{ data.subtask_langues || '未知' }}</td>
                    </tr>
                    <!-- <tr>
                        <td>项目标签</td>
                        <td>{{data.task_tag}}</td>
                    </tr> -->
                    <tr>
                        <td>项目负责人</td>
                        <td>{{ data.project_owner_name }}</td>
                    </tr>
                    <tr>
                        <td>检测人员</td>
                        <td>{{ data.subtask_created_user_name }}</td>
                    </tr>
                    <tr>
                        <td>所属团队</td>
                        <td>{{ data.team_name }}</td>
                    </tr>
                    <tr>
                        <td>团队负责人</td>
                        <td>{{ data.team_owner_name }}</td>
                    </tr>
                    <tr>
                        <td>检测时间</td>
                        <td>{{ formatDate(data.subtask_created_at) }}</td>
                    </tr>
                    <tr>
                        <td>检测耗时</td>
                        <td>{{ data.used_time / 1000 }}s</td>
                    </tr>
                </table>
            </div>

            <div class="part">
                <div class="part_title">
                    组件概览
                </div>
                <table border="1" cellspacing="0" cellpadding="0">
                    <thead>
                        <th>组件数量</th>
                        <th>强烈建议修复</th>
                        <th>建议修复</th>
                        <th>可选修复</th>
                        <th>无风险</th>
                        <th>可触发漏洞组件</th>
                        <th>线上依赖组件</th>
                        <th>投毒组件</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{ data.comp_num }}</td>
                            <td>{{ data.strong_num }}</td>
                            <td>{{ data.recommend_num }}</td>
                            <td>{{ data.optional_num }}</td>
                            <td>{{ data.safe_num }}</td>
                            <td>{{ data.comp_trigger_num }}</td>
                            <td>{{ data.comp_online_num }}</td>
                            <td>{{ data.comp_cwe506_num }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="part">
                <div class="part_title">
                    漏洞概览
                </div>
                <table border="1" cellspacing="0" cellpadding="0">
                    <thead>
                        <th>漏洞数量</th>
                        <th>严重</th>
                        <th>高危</th>
                        <th>中危</th>
                        <th>低危</th>
                        <th>可POC</th>
                        <th>CVE未收录漏洞</th>
                        <th>独家漏洞</th>
                        <th>投毒</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{ data.leak_num }}</td>
                            <td>{{ data.critical_num }}</td>
                            <td>{{ data.high_num }}</td>
                            <td>{{ data.medium_num }}</td>
                            <td>{{ data.low_num }}</td>
                            <td>{{ data.vuln_poc_num }}</td>
                            <td>{{ data.vuln_cve_empty_num }}</td>
                            <td>{{ data.vuln_sole_num }}</td>
                            <td>{{ data.vuln_cwe506_num }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="part">
                <div class="part_title">
                    许可证概览
                </div>
                <table border="1" cellspacing="0" cellpadding="0">
                    <thead>
                        <th>许可证数量</th>
                        <th>许可证类型</th>
                        <th>高风险</th>
                        <th>中风险</th>
                        <th>低风险</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{ data.license_all_num }}</td>
                            <td>{{ data.license_num }}</td>
                            <td>{{ data.license_high_num }}</td>
                            <td>{{ data.license_medium_num }}</td>
                            <td>{{ data.license_low_num }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- 图表 -->
            <div class="part">
                <div class="part_title">
                    组件相关统计图表
                </div>
                <div class="chart_wrap">
                    <div class="chart">
                        <div class="title">
                            组件风险等级统计：
                        </div>
                        <div class="chart1_content chart_init"></div>
                        <div class="progress">
                            <SuggestProgress :text="'强烈建议修复'" :color="`#F34D3D`" :num="compNums.strong" />
                            <SuggestProgress :text="'建议修复'" :color="`#FFCC33`" :num="compNums.recommend" />
                            <SuggestProgress :text="'可选修复'" :color="`#C7C7C7`" :num="compNums.optional" />
                            <SuggestProgress :text="'安全'" :color="`#9de16e`" :num="compNums.safe" />
                        </div>
                    </div>

                    <div class="chart">
                        <div class="title">
                            可触发漏洞组件：{{ data.comp_trigger_num }}个
                        </div>
                        <!-- <div style="margin-top: 20px;margin-left: 70px;">
                            <el-progress type="circle" color="#6C87FF" :percentage="50" :stroke-width="26" :width="190">
                                <template #default>
                                    <p class="percentage_label">已检测项目</p>
                                    <p class="percentage_value">230个</p>
                                </template>
                            </el-progress>
                        </div> -->
                        <div class="chart7_content chart_init"></div>
                    </div>
                </div>

                <div class="chart_wrap">
                    <div class="chart">
                        <div class="title">
                            线上依赖占比：{{ parseInt(`${data.comp_online_num / data.comp_num * 100}`, 10) }}% （{{
                                data.comp_online_num }}个）
                        </div>
                        <div class="chart2_content chart_init"></div>
                    </div>

                    <div class="chart">
                        <div class="title">
                            缺陷组件依赖类型：直接依赖 {{ data.comp_is_direct_dependency_num
                            }}个，间接依赖{{ data.comp_not_direct_dependency_num }}个
                        </div>
                        <div class="chart3_content chart_init"></div>
                    </div>
                </div>

                <div class="chart_wrap">
                    <div class="chart">
                        <div class="title">
                            投毒组件占比：{{ parseInt(`${data.comp_cwe506_num / data.comp_num * 100}`, 10) }}% （{{
                                data.comp_cwe506_num }}个）
                        </div>
                        <div class="chart10_content chart_init"></div>
                    </div>
                </div>

                <div class="chart_wrap">
                    <div class="chart">
                        <div class="title" style="margin-bottom: 16px;">
                            缺陷组件状态分布：待修复{{ barOptions.series[0].data[0] }}个， 已修复{{ barOptions.series[0].data[1] }}个，
                            7天忽略{{ barOptions.series[0].data[2] }}个， 关闭{{ barOptions.series[0].data[3] }}个
                        </div>
                        <div class="chart4_content chart_init" style="width: 40%"></div>
                    </div>
                </div>
            </div>

            <div class="part">
                <div class="part_title">
                    许可证相关统计图表
                </div>
                <div class="chart_wrap">
                    <div class="chart">
                        <div class="title">
                            许可证风险等级：
                        </div>
                        <div class="chart5_content chart_init"></div>
                        <div class="progress">
                            <SuggestProgress :text="'高风险'" :color="`#F34D3D`" :num="licenseNums.high" />
                            <SuggestProgress :text="'中风险'" :color="`#FFCC33`" :num="licenseNums.mid" />
                            <SuggestProgress :text="'低风险'" :color="`#C7C7C7`" :num="licenseNums.low" />
                        </div>
                    </div>

                    <div class="chart">
                        <div class="title">
                            许可证数量：{{ data.license_all_num }}个
                        </div>
                        <!-- <div style="margin-top: 20px;margin-left: 70px;">
                            <el-progress type="circle" color="#6C87FF" :percentage="50" :stroke-width="26" :width="190">
                                <template #default>
                                    <p class="percentage_label">全部许可证</p>
                                    <p class="percentage_value">1685个</p>
                                </template>
                            </el-progress>
                        </div> -->
                        <div class="chart8_content chart_init"></div>
                    </div>
                </div>
            </div>

            <div class="part">
                <div class="part_title">
                    漏洞相关统计图表
                </div>
                <div class="chart_wrap">
                    <div class="chart">
                        <div class="title">
                            漏洞风险等级
                        </div>
                        <div class="chart6_content chart_init"></div>
                        <div class="progress" style="height: 75%;">
                            <SuggestProgress :text="'严重'" :color="`#F34D3D`" :num="vulnNums.critical_num" />
                            <SuggestProgress :text="'高危'" :color="`#FFCC33`" :num="vulnNums.high_num" />
                            <SuggestProgress :text="'中危'" :color="`#C7C7C7`" :num="vulnNums.medium_num" />
                            <SuggestProgress :text="'低危'" :color="`#C7C7C7`" :num="vulnNums.low_num" />
                        </div>
                    </div>

                    <div class="chart">
                        <div class="title">
                            可POC漏洞占比：{{ parseInt(`${data.vuln_poc_num / data.vuln_list?.length * 100}`, 10) }}% （{{
                                data.vuln_poc_num }}个）
                        </div>
                        <!-- <div style="margin-top: 20px;margin-left: 70px;">
                            <el-progress type="circle" color="#6C87FF" :percentage="50" :stroke-width="26" :width="190">
                                <template #default>
                                    <p class="percentage_label">全部漏洞</p>
                                    <p class="percentage_value">1685个</p>
                                </template>
                            </el-progress>
                        </div> -->
                        <div class="chart9_content chart_init"></div>
                    </div>
                </div>
            </div>

            <div class="part" v-if="data.leak_comp_list && data.leak_comp_list.length">
                <div class="part_title">
                    缺陷组件清单
                </div>
                <table border="1" cellspacing="0" cellpadding="0">
                    <thead>
                        <th style="width: 30px;">编号</th>
                        <th>组件</th>
                        <th>组件版本</th>
                        <th>最小修复版本</th>
                        <th>处置等级</th>
                        <th>生态-仓库类型</th>
                        <th>依赖类型</th>
                        <th>是否为线上依赖组件</th>
                        <th>是否为可触发漏洞组件</th>
                        <th>是否为投毒组件</th>
                        <th>组件引入路径</th>
                        <th>漏洞数量</th>
                        <th>组件链接</th>
                        <th>修复状态</th>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in data.leak_comp_list" :key="index">
                            <td>{{ index + 1 }}</td>
                            <td>{{ item.comp_name }}</td>
                            <td>{{ item.comp_version }}</td>
                            <td>{{ item.min_fixed_version }}</td>
                            <td>{{ item.suggest_level }}</td>
                            <td>{{ item.ecosystem }}</td>
                            <td>{{ item.is_direct_dependency }}</td>
                            <td>{{ item.is_online }}</td>
                            <td>{{ item.is_triggers }}</td>
                            <td>{{ item.is_cwe_506 }}</td>
                            <td style="width: 240px">
                                {{ item.dependent_path }}
                            </td>
                            <td>{{ item.vuln_distribution }}</td>
                            <td>{{ item.repo_url }}</td>
                            <td>{{ item.fix_status_str }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="part" v-if="data.leak_comp_list && data.leak_comp_list.length">
                <div class="part_title">
                    修复建议
                </div>
                <table border="1" cellspacing="0" cellpadding="0">
                    <thead>
                        <th>编号</th>
                        <th>组件</th>
                        <th>组件版本</th>
                        <th>最小修复版本</th>
                        <th>生态仓库类型</th>
                        <th>处置等级</th>
                        <th>依赖类型</th>
                        <th>漏洞</th>
                        <th>修复建议</th>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in data.leak_comp_list" :key="index">
                            <td>{{ index + 1 }}</td>
                            <td>{{ item.comp_name }}</td>
                            <td>{{ item.comp_version }}</td>
                            <td>{{ item.min_fixed_version }}</td>
                            <td>{{ item.ecosystem }}</td>
                            <td>{{ item.suggest_level }}</td>
                            <td>{{ item[5] }}</td>
                            <td style="width: 300px">{{ item.vuln_distribution }}</td>
                            <td>
                                {{ item.plan }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="part" v-if="data.vuln_list && data.vuln_list.length">
                <div class="part_title">
                    漏洞列表
                </div>
                <table border="1" cellspacing="0" cellpadding="0">
                    <thead>
                        <th>编号</th>
                        <th>漏洞标题</th>
                        <th>漏洞编号</th>
                        <th>等级</th>
                        <th>漏洞类型</th>
                        <th>攻击成本</th>
                        <th>影响范围</th>
                        <th>是否为可触发</th>
                        <th>漏洞标签</th>
                        <th>影响组件</th>
                        <th>漏洞链接</th>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in data.vuln_list" :key="index">
                            <td>{{ index + 1 }}</td>
                            <td>{{ item.title }}</td>
                            <td>{{ item.cve_id || item.mps_id }}</td>
                            <td>{{ getDangerLevel(item.level).text }}</td>
                            <td>{{ item.vuln_type }}</td>
                            <td>{{ item.attack_vector }}</td>
                            <td>{{ item.scope_influence }}</td>
                            <td>{{ item.triggers }}</td>
                            <td>{{ item.tag }}</td>
                            <td style="width: 300px">{{ item.plan }}</td>
                            <td>{{ item.vuln_url }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="part" v-if="data.vuln_list && data.vuln_list.length">
                <div class="part_title">
                    漏洞详情
                </div>
                <div style="margin-bottom: 32px" v-for="(item, index) in data.vuln_list" :key="index">
                    <div style="font-size: 16px;margin-bottom: 8px;color: #3c3c3c;">{{ item[0] }}</div>
                    <table class="left" border="1" cellspacing="0" cellpadding="0">
                        <tr>
                            <td>标题</td>
                            <td>{{ item.title }}</td>
                        </tr>
                        <tr>
                            <td>漏洞等级</td>
                            <td>{{ getDangerLevel(item.level).text }}</td>
                        </tr>
                        <tr>
                            <td>MPS编号</td>
                            <td>{{ item.mps_id }}</td>
                        </tr>
                        <tr>
                            <td>CVE编号</td>
                            <td>{{ item.cve_id }}</td>
                        </tr>
                        <tr>
                            <td>CNVD编号</td>
                            <td>{{ item.cnvd_id }}</td>
                        </tr>
                        <tr>
                            <td>漏洞类型</td>
                            <td>{{ item.vuln_type }}</td>
                        </tr>
                        <tr>
                            <td>发现时间</td>
                            <td>{{ formatDate(item.published_date) }}</td>
                        </tr>
                        <tr>
                            <td>更新时间</td>
                            <td>{{ formatDate(item.last_modified_date) }}</td>
                        </tr>
                        <tr>
                            <td>漏洞标签</td>
                            <td>{{ item.tag }}</td>
                        </tr>
                        <tr>
                            <td>漏洞描述</td>
                            <td>{{ item.description }}</td>
                        </tr>
                        <tr>
                            <td>专家分析</td>
                            <td>该项目{{ item.tag }} {{ item.suggest }}</td>
                        </tr>
                        <tr>
                            <td>{{ $systemConfig.shortName }}安全评级</td>
                            <td>{{ item.suggest }}</td>
                        </tr>
                        <tr>
                            <td>CVSS评分</td>
                            <td>{{ parseInt(item.cvss_score) }}</td>
                        </tr>
                        <tr>
                            <td>影响组件及修复版本</td>
                            <td>{{ item.plan }}</td>
                        </tr>
                        <tr>
                            <td>漏洞详情链接</td>
                            <td>{{ item.vuln_url }}</td>
                        </tr>
                    </table>
                </div>
            </div>

            <div class="part" v-if="data.sbom_list && data.sbom_list.length">
                <div class="part_title">
                    SBOM清单
                </div>
                <table border="1" cellspacing="0" cellpadding="0">
                    <thead>
                        <th>编号</th>
                        <th>模块</th>
                        <th>组件</th>
                        <th>组件版本</th>
                        <th>风险等级</th>
                        <th>生态-仓库类型</th>
                        <th>依赖类型</th>
                        <th>许可证协议</th>
                        <th>许可证风险等级</th>
                        <!-- <th>标签</th> -->
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in data.sbom_list" :key="index">
                            <td>{{ index + 1 }}</td>
                            <td>{{ item.module_name }}</td>
                            <td>{{ item.comp_name }}</td>
                            <td>{{ item.comp_version }}</td>
                            <td>{{ item.suggest_level || '无风险' }}</td>
                            <td>{{ item.ecosystem }}</td>
                            <td>{{ item.is_direct_dependency }}</td>
                            <td>{{ item.license }}</td>
                            <td>{{ getLicenseLevelTool(item.level.trim()).text }}</td>
                            <!-- <td>{{item[8]}}</td> -->
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import store from 'util/store';
import { useRoute } from 'vue-router';
import { getExportReportDataApi } from 'api/project';
import { createPieChart, renderChart, createBarOptions } from 'util/chart';
import { formatDate, getDangerLevel, getLicenseLevelTool } from '@/utils/tools';
import SuggestProgress from '../control/platform/comp/SuggestProgress.vue';

const pieOptions1 = createPieChart();
const pieOptions2 = createPieChart();
const pieOptions3 = createPieChart();
const pieOptions4 = createPieChart();
const pieOptions5 = createPieChart();
const pieOptions6 = createPieChart();
const pieOptions7 = createPieChart();
const pieOptions8 = createPieChart();
const pieOptions9 = createPieChart();
const barOptions = createBarOptions();
const compNums = ref<any>({});
const licenseNums = ref<any>({});
const vulnNums = ref<any>({});
const route = useRoute();
const data = ref<any>({});

onMounted(async () => {
    const res = await getExportReportDataApi({
        subtask_id: route.params.sid,
        project_id: route.params.tid,
        pdfuuid: route.query.pdfuuid,
    });
    data.value = res.data;
    pieOptions1.color = ['#F34D3D', '#FFCC33', '#C7C7C7', '#9de16e'];
    pieOptions1.series[0].label.formatter = `${data.value.comp_num}个`;
    pieOptions1.series[0].data = [
        { value: data.value.strong_num, name: '强烈建议修复' },
        { value: data.value.recommend_num, name: '建议修复' },
        { value: data.value.optional_num, name: '可选修复' },
        { value: data.value.comp_num - data.value.strong_num - data.value.recommend_num - data.value.optional_num, name: '安全' },
    ];
    compNums.value = {
        // eslint-disable-next-line no-mixed-operators
        strong: (data.value.strong_num / data.value.comp_num * 100).toFixed(2),
        // eslint-disable-next-line no-mixed-operators
        recommend: (data.value.recommend_num / data.value.comp_num * 100).toFixed(2),
        // eslint-disable-next-line no-mixed-operators
        optional: (data.value.optional_num / data.value.comp_num * 100).toFixed(2),
        // eslint-disable-next-line no-mixed-operators
        safe: ((data.value.comp_num - data.value.strong_num - data.value.recommend_num - data.value.optional_num) / data.value.comp_num * 100).toFixed(2),
    };
    renderChart(pieOptions1, document.getElementsByClassName('chart1_content')[0] as HTMLElement);

    pieOptions2.series[0].label.formatter = `${data.value.comp_num}个`;
    pieOptions2.color = ['#6C87FF', '#dbdbdb'];
    pieOptions2.legend.show = true;
    pieOptions2.series[0].data = [
        { value: data.value.comp_online_num, name: '线上依赖' },
        { value: data.value.comp_num - data.value.comp_online_num, name: '非线上依赖' },
    ];
    renderChart(pieOptions2, document.getElementsByClassName('chart2_content')[0] as HTMLElement);

    pieOptions3.series[0].label.formatter = `${data.value.comp_is_direct_dependency_num + data.value.comp_not_direct_dependency_num}个`;
    pieOptions3.color = ['#6C87FF', '#dbdbdb'];
    pieOptions3.legend.show = true;
    pieOptions3.series[0].data = [
        { value: data.value.comp_is_direct_dependency_num, name: '直接依赖' },
        { value: data.value.comp_not_direct_dependency_num, name: '间接依赖' },
    ];
    renderChart(pieOptions3, document.getElementsByClassName('chart3_content')[0] as HTMLElement);

    barOptions.series[0].data = [data.value?.security_fix_status[0]?.total, data.value?.security_fix_status[1]?.total, data.value?.security_fix_status[2]?.total, data.value?.security_fix_status[3]?.total];
    renderChart(barOptions, document.getElementsByClassName('chart4_content')[0] as HTMLElement);

    pieOptions4.series[0].label.formatter = `${data.value.license_num}个`;
    licenseNums.value = {
        // eslint-disable-next-line no-mixed-operators
        high: (data.value.license_high_num / data.value.license_num * 100).toFixed(2),
        // eslint-disable-next-line no-mixed-operators
        mid: (data.value.license_medium_num / data.value.license_num * 100).toFixed(2),
        // eslint-disable-next-line no-mixed-operators
        low: (data.value.license_low_num / data.value.license_num * 100).toFixed(2),
    };
    pieOptions4.series[0].data = [
        { value: data.value.license_high_num, name: '高风险' },
        { value: data.value.license_medium_num, name: '中风险' },
        { value: data.value.license_low_num, name: '低风险' },
    ];
    renderChart(pieOptions4, document.getElementsByClassName('chart5_content')[0] as HTMLElement);

    pieOptions5.series[0].label.formatter = `${data.value.vuln_list?.length}个`;
    pieOptions5.color = ['#F34D3D', '#FF9940', '#FFCC33', '#D9D9D9'];
    vulnNums.value = {
        // eslint-disable-next-line no-mixed-operators
        critical_num: (data.value.critical_num / data.value.leak_num * 100).toFixed(2),
        // eslint-disable-next-line no-mixed-operators
        high_num: (data.value.high_num / data.value.leak_num * 100).toFixed(2),
        // eslint-disable-next-line no-mixed-operators
        medium_num: (data.value.medium_num / data.value.leak_num * 100).toFixed(2),
        // eslint-disable-next-line no-mixed-operators
        low_num: (data.value.low_num / data.value.leak_num * 100).toFixed(2),
    };
    pieOptions5.series[0].data = [
        { value: data.value.critical_num, name: '严重' },
        { value: data.value.high_num, name: '高危' },
        { value: data.value.medium_num, name: '中危' },
        { value: data.value.low_num, name: '低危' },
    ];
    renderChart(pieOptions5, document.getElementsByClassName('chart6_content')[0] as HTMLElement);

    pieOptions6.series[0].label.formatter = `${data.value.comp_num}个`;
    pieOptions6.color = ['#6C87FF', '#dbdbdb'];
    pieOptions6.legend.show = true;
    pieOptions6.series[0].data = [
        { value: data.value.comp_trigger_num, name: '可触发漏洞组件' },
        { value: data.value.comp_num - data.value.comp_trigger_num, name: '其他' },
    ];
    renderChart(pieOptions6, document.getElementsByClassName('chart7_content')[0] as HTMLElement);

    pieOptions7.series[0].label.formatter = `${data.value.license_all_num}个`;
    pieOptions7.color = ['#6C87FF'];
    pieOptions7.series[0].data = [
        { value: data.value.license_all_num, name: '全部许可证' },
    ];
    renderChart(pieOptions7, document.getElementsByClassName('chart8_content')[0] as HTMLElement);

    pieOptions8.series[0].label.formatter = `${data.value.vuln_list?.length}个`;
    pieOptions8.color = ['#6C87FF', '#dbdbdb'];
    pieOptions8.legend.show = true;
    pieOptions8.series[0].data = [
        { value: data.value.vuln_poc_num, name: '可POC漏洞' },
        { value: data.value.vuln_list.length - data.value.vuln_poc_num, name: '其他' },
    ];
    renderChart(pieOptions8, document.getElementsByClassName('chart9_content')[0] as HTMLElement);

    // 投毒
    pieOptions9.series[0].label.formatter = `${data.value.comp_num}个`;
    pieOptions9.color = ['#6C87FF', '#dbdbdb'];
    pieOptions9.legend.show = true;
    pieOptions9.series[0].data = [
        { value: data.value.comp_cwe506_num, name: '投毒组件' },
        { value: data.value.comp_num - data.value.comp_cwe506_num, name: '非投毒组件' },
    ];
    renderChart(pieOptions9, document.getElementsByClassName('chart10_content')[0] as HTMLElement);
});
</script>

<style lang='less' scoped>
.head {
    height: 64px;
    padding: 0 24px;
    .between();
    background: linear-gradient(90deg, #6D38FF 0%, #385DFF 100%);
    color: #fff;

    img {
        width: 40px;
        height: 38px;
        margin-right: 15px;
        vertical-align: middle;
    }

    span {
        height: 22px;
        border-left: 1px solid #fff;
        padding-left: 15px;
    }
}

.report_content {
    max-width: 1300px;
    margin: 0 auto;
    padding-top: 40px;
    padding-bottom: 60px;

    .part {
        margin-bottom: 40px;
        width: 100%;
    }

    .part_title {
        font-size: 18px;
        font-weight: 600;
        color: @text-color;
        margin-bottom: 16px;
    }

    table {
        border-collapse: collapse;
        border-radius: 8px;
        width: 100%;
        color: @text-color;
        border-color: #e7e7e7;
        font-size: 14px;
        text-align: center;

        th {
            font-weight: 500;
            color: #858585;
            padding: 16px 0;
            background-color: #F2F3F5;
        }

        td {
            padding: 16px 8px;
            word-break: break-all;
        }
    }

    table.left td:nth-of-type(1) {
        width: 240px;
        text-align: left;
        padding: 16px;
        box-sizing: border-box;
        background-color: #F2F3F5;
    }

    table.left td {
        text-align: left;
        padding-left: 16px;
    }

    .chart_wrap {
        height: 360px;
        width: 100%;
        .between();
        background-color: #F7F8FB;
        border-radius: 4px;
        padding: 24px;
        box-sizing: border-box;
        margin-bottom: 16px;

        .percentage_label {
            font-size: 14px;
            color: #858585;
            margin-bottom: 16px;
        }

        .percentage_value {
            font-size: 24px;
            color: #3c3c3c;
            font-weight: 500;
        }

        .chart {
            height: 100%;
            position: relative;
            flex: 1;
            background-color: #fff;
            border-radius: 6px;
            box-sizing: border-box;
            padding: 16px;
            margin-right: 16px;

            .chart_init {
                height: 90%;
            }

            .progress {
                width: 110px;
                height: 60%;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                position: absolute;
                right: 25%;
                top: 50px;
            }
        }
    }
}
</style>

<style lang="less">
// .el-progress-bar__inner {
//     background: initial !important;
// }
</style>
