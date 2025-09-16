<template>
    <el-dialog class="screen-dialog" width="100%">
        <div class="max">
            <div class="content">
                <div class="g-f-24 g-fw-600 g-color-1 g-mb-16 flex items-center">
                    {{ licenseInfo.spdx_id || licenseName }} 许可证详情
                    <span v-if="licenseRisk && !store.isLic" class="tag" style="color: #fff"
                          :style="{ backgroundColor: getLicenseLevelTool(licenseRisk).color }">{{
                              getLicenseLevelTool(licenseRisk).text }}</span>
                    <span v-else-if="!store.isLic" class="tag" style="color: #fff"
                          :style="{ backgroundColor: getLicenseLevelTool(projectList[0]?.risk).color }">{{
                              getLicenseLevelTool(projectList[0]?.risk).text }}</span>
                    <!-- <span class="tag" v-if="licenseInfo.category">{{ licenseInfo.category }}</span> -->

                    <TagComp class="ml-2 font-normal" v-if="licenseInfo.osi_approved" content="OSI认可" />
                    <TagComp class="ml-1 font-normal" v-if="licenseInfo.fsf_approved" content="FSF认可" />
                </div>

                <div class="g-p-16 g-bg-f7 g-bdr-6 g-f-14 g-color-1 g-mb-16">
                    <div class=" flex items-center">
                        <div class="flex-1 mr-4">
                            <span class="g-color-3">许可证类型：</span>
                            <span class="mr-4">{{ licenseInfo.license_family_name || '-' }}</span>
                        </div>
                        <div class="flex-1 mr-4">
                            <span class="g-color-3">许可证来源：</span>
                            <span class="mr-4">{{ licenseInfo.license_source === 'built_in' ? '系统内置' : '自定义' }}</span>
                        </div>
                        <div class="flex-1 ellipsis">
                            <span class="g-color-3">许可证链接：</span>
                            <a v-if="licenseInfo.home_page" class="hover_text" target="_blank"
                               :href="licenseInfo.home_page">{{ licenseInfo.home_page || '-' }}</a>
                            <span v-else class="g-color-1">-</span>
                        </div>
                    </div>
                </div>

                <el-tabs v-model="activeName" class="license-info-tabs">
                    <el-tab-pane label="许可证策略" name="4" v-if="route.path === '/set/license-manage' && !store.isLic">
                        <div style="height: 100%;overflow:auto;">
                            <TableComp :data="licenseStra">
                                <el-table-column prop="detection_license_name" width="200"
                                                 label="策略名称"></el-table-column>
                                <el-table-column prop="risk" width="120" label="许可证风险等级">
                                    <template #default="scope">
                                        <div :style="{ color: getLicenseLevelTool(scope.row.risk).color }">
                                            {{ getLicenseLevelTool(scope.row.risk).text }}
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="license_desc" label="许可证说明">
                                    <template #default="scope">
                                        {{ scope.row.license_desc || '暂无许可证说明' }}
                                    </template>
                                </el-table-column>
                            </TableComp>
                        </div>
                    </el-tab-pane>

                    <el-tab-pane label="相关项目" name="3" v-if="route.path === '/license'">
                        <!-- <div class="g-p-16 g-bdr-6 g-bg-f7"> -->
                        <div class="g-mb-16 g-bdr-6 ">
                            <SearchComp v-model="filterData.keyword" style="width: 240px;" clearable
                                        placeholder="请搜索项目名称" />
                            <CheckboxComp style="width: 150px" v-model="filterData.risks" :options="licenseLevelOption"
                                          clearable placeholder="风险等级" />
                            <el-button class="minor_btn" @click="filterData.keyword = ''; filterData.risks = []"
                                       style="height: 32px;width: 52px;">
                                重置
                            </el-button>
                        </div>

                        <div class="g-mb-16 g-bdr-6 " style="height: 100%;overflow:auto;">
                            <div class="g-mb-16 g-color-3 g-f-14">共 <span class="g-color-1">{{ projectList.length
                            }}</span>
                                条数据</div>
                            <TableComp :data="projectList" row-key="subtask_id" @expand-change="expandChange">
                                <el-table-column width="30" type="expand">
                                    <template #default="scope">
                                        <div v-for="item in scope.row.comps" :key="item.comp_name"
                                             class="g-bdr-6 g-p-16 g-bg-f7 g-mb-8 g-flex g-f-14 g-color-1">
                                            <div class="g-mr-16 flex items-center">
                                                <span class="max-w-[300px] ellipsis inline-block">组件名称：{{ item.comp_name
                                                }}</span>
                                                <span v-if="item.is_online" class="tag"
                                                      style="background: #4966E633;color: #2946C7;">线上依赖</span>
                                                <span class="tag" v-if="item.ecosystem"
                                                      style="background: #4966E633;color: #2946C7;">{{ item.ecosystem
                                                      }}</span>
                                                <span v-if="item.is_direct_dependency" class="tag"
                                                      style="background: #4966E633;color: #2946C7;">直接依赖</span>
                                                <span v-else class="tag"
                                                      style="background: #4966E633;color: #2946C7;">间接依赖</span>

                                            </div>
                                            <div class="mr-4">
                                                版本：{{ item.comp_version || '-' }}
                                            </div>

                                            <div v-if="store.isLic" class="mr-4">
                                                组件用法：{{ compUse[item.way_of_use] || '-' }}
                                            </div>

                                            <div>
                                                许可证风险等级：
                                                <span :style="{ color: getLicenseLevelTool(scope.row.risk).color }">{{
                                                    getLicenseLevelTool(scope.row.risk).text }}</span>
                                            </div>
                                        </div>
                                    </template>
                                </el-table-column>

                                <el-table-column prop="project_name" label="项目名称"
                                                 show-overflow-tooltip></el-table-column>
                                <el-table-column prop="branch" label="分支" width="130">
                                    <template #default="scope">
                                        <div>
                                            {{ scope.row.branch || '-' }}
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="languages" label="语言" width="200" show-overflow-tooltip>
                                    <template #default="scope">
                                        <div>
                                            {{ scope.row.languages || '-' }}
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="risk" label="许可证风险等级" width="130">
                                    <template #default="scope">
                                        <div :style="{ color: getLicenseLevelTool(scope.row.risk).color }">
                                            {{ getLicenseLevelTool(scope.row.risk).text }}
                                        </div>
                                    </template>
                                </el-table-column>
                            </TableComp>
                        </div>
                        <!-- </div> -->
                    </el-tab-pane>

                    <el-tab-pane label="涉及组件" name="5" v-if="route.path.includes('/detail')">
                        <div class="g-mb-16 g-bdr-6 ">
                            <SearchComp v-model="filterData.keyword" style="width: 240px;" clearable
                                        placeholder="请搜索组件名称" />
                            <CheckboxComp style="width: 150px" v-model="filterData.risks" :options="licenseLevelOption"
                                          clearable placeholder="风险等级" />
                            <el-button class="minor_btn" @click="filterData.keyword = ''; filterData.risks = []"
                                       style="height: 32px;width: 52px;">
                                重置
                            </el-button>
                        </div>

                        <div class="g-mb-16 g-bdr-6 " style="height: 100%;overflow:auto;">
                            <div class="g-mb-16 g-color-3 g-f-14">
                                共 <span class="g-color-1">{{ licenseCompList.length
                                }}</span>
                                条数据</div>

                            <TableComp :data="licenseCompList">
                                <el-table-column prop="comp_name" label="组件名称" show-overflow-tooltip>
                                    <template #default="{row}">
                                        <div class="flex items-center">
                                            <span
                                                @click="compJump({ name: row.comp_name, version: row.comp_version, ecosystem: row.ecosystem, repository: row.repository })"
                                                class="max-w-[300px] ellipsis inline-block cursor-pointer hover:underline hover:text-primary">
                                                {{ row.comp_name }}</span>
                                            <TagComp class="ml-1" v-if="row.ecosystem" :content="row.ecosystem" />
                                            <TagComp class="ml-1" v-if="row.is_online" content="线上依赖" />
                                            <TagComp class="ml-1" v-if="row.is_self" content="自身依赖" />
                                            <TagComp class="ml-1" v-else
                                                     :content="row.is_direct_dependency ? '直接依赖' : '间接依赖'" />
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="comp_version" label="版本" width="120">
                                    <template #default="{ row }">
                                        <div>
                                            {{ row.comp_version || '-' }}
                                            <el-tooltip placement="top"
                                                        v-if="row.the_chosen_version && row.comp_version">
                                                <template #content>
                                                    <div style="max-width: 344px;">
                                                        此版本为推测值，由于检测时获取到的特征有限，识别可能存在偏差，暂时无法提供精确版本。
                                                    </div>
                                                </template>
                                                <span class="hover_icon g-ml-4 g-vertical--1" style="padding:4px 6px">
                                                    <i class="murphy icon-wenhaoxiao g-f-14 g-color-1"></i>
                                                </span>
                                            </el-tooltip>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column v-if="store.isLic" prop="way_of_use" label="组件用法" width="120">
                                    <template #default="{ row }">
                                        <div>
                                            <span v-for="(a, i) in row.way_of_use?.split(',')" :key="a"
                                                  class="inline-block max-w-full leading-none">{{
                                                      compUse[a] }}<span
                                                    v-if="i !== row.way_of_use?.split(',')?.length - 1">、</span>
                                            </span>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="level" label="许可证风险等级" width="130">
                                    <template #default="scope">
                                        <div :style="{ color: getLicenseLevelTool(scope.row.level).color }">
                                            {{ getLicenseLevelTool(scope.row.level).text }}
                                        </div>
                                    </template>
                                </el-table-column>
                            </TableComp>
                        </div>
                    </el-tab-pane>

                    <el-tab-pane label="许可证解读" name="1">
                        <div style="height: 100%;overflow: auto;">
                            <div
                                v-if="licenseInfo.can_features?.length || licenseInfo.must_features?.length || licenseInfo.cannot_features?.length || licenseDesc">
                                <div v-if="$route.path.includes('detail')"
                                     class="g-f-14 g-mb-24 g-p-16 g-bdr-6 g-color-1" style=" background: #FF99401A;">
                                    <span class="g-fw-500">许可证说明：</span> {{ licenseDesc || '暂无数据' }}
                                </div>
                                <div class="g-p-12 g-color-1 desc">
                                    概述：{{ licenseInfo.summary || '暂无概述' }}
                                </div>
                                <div class="g-flex g-justify-between g-align-start">
                                    <div class="item-type">
                                        <div class="top">
                                            权力（允许）
                                        </div>
                                        <div class="g-p-16">
                                            <el-collapse v-if="licenseInfo.can_features?.length"
                                                         v-model="activeCollapse1">
                                                <el-collapse-item v-for="(item, index) in licenseInfo.can_features"
                                                                  :key="index" :title="item.cn_name" :name="index">
                                                    <div>
                                                        {{ item.cn_description }}
                                                    </div>
                                                </el-collapse-item>
                                            </el-collapse>
                                            <NoData description="暂未发现权利相关说明" v-else />
                                        </div>
                                    </div>
                                    <div class="item-type">
                                        <div class="top">
                                            义务（必须）
                                        </div>
                                        <div class="g-p-16">
                                            <el-collapse v-if="licenseInfo.must_features?.length"
                                                         v-model="activeCollapse2">
                                                <el-collapse-item v-for="(item, index) in licenseInfo.must_features"
                                                                  :key="index" :title="item.cn_name" :name="index">
                                                    <div>
                                                        {{ item.cn_description }}
                                                    </div>
                                                </el-collapse-item>
                                            </el-collapse>
                                            <NoData description="暂未发现义务相关说明" v-else />
                                        </div>
                                    </div>
                                    <div class="item-type">
                                        <div class="top">
                                            限制（不允许）
                                        </div>
                                        <div class="g-p-16">
                                            <el-collapse v-if="licenseInfo.cannot_features?.length"
                                                         v-model="activeCollapse3">
                                                <el-collapse-item v-for="(item, index) in licenseInfo.cannot_features"
                                                                  :key="index" :title="item.cn_name" :name="index">
                                                    <div>
                                                        {{ item.cn_description }}
                                                    </div>
                                                </el-collapse-item>
                                            </el-collapse>
                                            <NoData description="暂未限制权利相关说明" v-else />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- 自定义为空 -->
                            <!-- <img class="g-w-100" v-else-if="licenseName === '自定义许可证'" src="ast/svg/no-know-license.svg" alt=""> -->

                            <!-- 系统为空 -->
                            <img class="g-w-100" v-else-if="licenseName === '未知许可证'"
                                 src="ast/svg/custom-license-desc.svg" alt="">

                            <NoData v-else description="暂无许可证解读" />
                        </div>
                    </el-tab-pane>

                    <el-tab-pane label="许可证原文" name="2">
                        <div v-if="licenseInfo.full_text" class="g-bg-f7 g-p-16 g-bdr-6"
                             style="height: 100%;overflow: auto;">
                            <pre>{{ licenseInfo.full_text }}</pre>
                        </div>
                        <NoData description="暂无许可证原文" v-else />
                    </el-tab-pane>
                </el-tabs>
            </div>

            <!-- <div style="height: 100%;" class="g-flex-center" v-if="!licenseInfo.spdx_id">
                <NoData description="该许可证暂无解读信息" />
            </div> -->
        </div>

    </el-dialog>
</template>

<script setup lang='ts'>
import SearchComp from 'comp/SearchComp.vue';
import { ref, onBeforeMount, watch } from 'vue';
import NoData from 'comp/NoData.vue';
import { getLicenseLevelTool } from 'util/tools';
import { getLicenseProjectApi, getLicenseProjectCompApi } from 'api/asset';
import { getLicenseDataApi } from 'api/project';
import { getLicenseDetailStraApi } from 'api/team';
import store from 'util/store';
import CheckboxComp from 'comp/CheckboxComp.vue';
import { useRoute } from 'vue-router';
import { compJump } from '@/utils/hook';
import { licenseLevelOption, compUse } from '../../constants/constants';
import TableComp from '@/components/TableComp.vue';

const route = useRoute();
const props = defineProps(['licenseName', 'licenseRisk', 'licenseDesc', 'licenseCompList']);
const licenseCompList = ref<any[]>(props.licenseCompList || []);

const activeName = ref<string>('1');
const activeCollapse1 = ref<number>(0);
const activeCollapse2 = ref<number>(0);
const activeCollapse3 = ref<number>(0);
const licenseInfo = ref<any>({});
const licenseRisk = ref<string>(props.licenseRisk);
const filterData = ref<any>({
    team_id: store.teamInfo?.team_id || route.meta.team_id,
    keyword: '',
    risks: [],
    license_name: props.licenseName,
    page: undefined,
    limit: undefined,
});
const projectList = ref<any[]>([]);
const licenseStra = ref<any[]>([]);

onBeforeMount(async () => {
    if (route.path === '/license') {
        activeName.value = '3';
    } else if (route.path === '/set/license-manage' && !store.isLic) {
        activeName.value = '4';
    } else if (route.path.includes('/detail')) {
        activeName.value = '5';
    } else {
        activeName.value = '1';
    }

    try {
        const res = await getLicenseDataApi(props.licenseName, store.teamInfo?.team_id || route.meta.team_id as string);
        licenseInfo.value = res.data;
    } catch (error) {
        console.log(error);
    }

    if (route.path === '/license') {
        try {
            const { data } = await getLicenseProjectApi(filterData.value);
            projectList.value = data.list;
            // licenseRisk.value = projectList.value[0]?.risk;
        } catch (error) {
            console.log(error);
        }
    }

    if (route.path === '/set/license-manage') {
        try {
            const { data } = await getLicenseDetailStraApi({
                team_id: store.teamInfo?.team_id || route.meta.team_id,
                license_name: props.licenseName,
            });
            licenseStra.value = data.list || [];
        } catch (error) {
            console.log(error);
        }
    }
});

if (route.path.includes('/license')) {
    watch(filterData.value, async (newVal: any) => {
        try {
            const { data } = await getLicenseProjectApi(newVal);
            projectList.value = data.list;
        } catch (error) {
            console.log(error);
        }
    });
}
// 涉及组件筛选
watch([() => filterData.value.keyword, () => filterData.value.risks], () => {
    if (!props.licenseCompList) return;
    licenseCompList.value = props.licenseCompList.filter((item: any) => {
        const matchKeyword = !filterData.value.keyword || item.comp_name.toLowerCase().includes(filterData.value.keyword.toLowerCase());
        const matchRisks = !filterData.value.risks.length || filterData.value.risks.includes(item.level);
        return matchKeyword && matchRisks;
    });
});

const expandChange = async (row: any) => {
    if (!row.comps) {
        const { data } = await getLicenseProjectCompApi({
            license_name: props.licenseName,
            project_id: row.project_id,
            subtask_id: row.subtask_id,
        });
        row.comps = data;
    }
};
</script>

<style lang="less" scoped>
.max {
    background-color: #fff;
    height: 100%;
    // overflow: auto;
}

.content {
    margin: 0 auto;
    height: 100%;
    max-width: 1200px;

    .tag {
        padding: 3px 6px;
        border-radius: 4px;
        background-color: #4966E633;
        color: #fff;
        background-color: #6C87FF;
        font-size: 12px;
        margin-right: -4px;
    }

    .desc {
        border-radius: 6px;
        border: 1px solid #EBEBEB;
        background: #FFF;
        box-shadow: 0px 8px 24px 0px rgba(31, 35, 41, 0.04), 0px 6px 12px -10px rgba(31, 35, 41, 0.06);
        font-size: 14px;
        margin-bottom: 16px;
    }

    .item-type {
        flex: 1;
        border-radius: 6px;
        background: #FFF;

        .top {
            padding: 6px;
            text-align: center;
            color: #fff;
        }
    }

    .item-type:nth-of-type(1) {
        .top {
            background-color: #38C728;
        }

        border: 1px solid var(--green, #38C728);
        box-shadow: 0px 8px 24px 0px rgba(42, 148, 30, 0.10);
    }

    .item-type:nth-of-type(2) {
        .top {
            background-color: #6C87FF;
        }

        border: 1px solid var(--purple, #6C87FF);
        margin: 0 33px;
        box-shadow: 0px 8px 24px 0px rgba(86, 108, 204, 0.10);
    }

    .item-type:nth-of-type(3) {
        .top {
            background-color: #F34D3D;
        }

        border: 1px solid var(--red, #F34D3D);
        box-shadow: 0px 8px 24px 0px rgba(191, 61, 48, 0.10);
    }
}
</style>

<style lang="less">
.license-info-tabs {
    height: calc(100% - 178px);

    .el-tabs__content {
        height: calc(100% - 76px);
    }

    .el-tab-pane {
        height: 100%;
    }
}
</style>
