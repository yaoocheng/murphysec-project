<template>
    <div class="filter_wrap" v-loading="loading">
        <SearchComp style="width: 240px;" v-model="searchData.keyword" clearable placeholder="请输入完整的漏洞编号搜索" />
        <CheckboxComp style="width: 150px" v-model="searchData.level" :options="vulnLevelOption" clearable
                      placeholder="漏洞级别" />
        <el-checkbox style="margin-right: 10px;" v-model="searchData.triggers" label="可触发漏洞" />
        <el-checkbox style="margin-right: 10px;" v-model="searchData.poison" label="投毒" />
        <el-checkbox style="margin-right: 10px;" v-model="searchData.poc" label="POC" />
        <el-checkbox v-model="searchData.cavd" label="CAVD漏洞" />
        <el-button class="minor_btn" @click="resetHandle" style="height: 32px;width: 52px;margin-left: 16px;">
            重置
        </el-button>
        <el-button v-if="!$route.fullPath.includes('share-report')" class="minor_btn" @click="store.isShowFilterConfig = true"
                   style="height: 32px;width: auto;margin-left: 8px;">筛选配置</el-button>
    </div>

    <div class="g-color-3 g-fw-400 g-f-14 g-mb-12">
        共 <span class="g-color-1 g-fw-500">{{ curTotalData.length }}</span> 条数据
    </div>

    <div ref="infiniteWrapEl" style="max-height: 500px;overflow: auto">
        <div class="vuln_item" :style="{ borderColor: getDangerLevel(item.level).color }"
             v-for="(item, index) in listData" :key="index">
            <div class="left">
                <div class="item" style="width: 30%;">
                    <div class="name">
                        漏洞名称
                    </div>
                    <div style="width: 100%;" class="flex items-center">
                        <el-tooltip :content="item.title" placement="top">
                            <span class="vuln_title">{{ item.title }}</span>
                        </el-tooltip>
                        <TagComp bgc="#14C0FF33" c="#049FD7" v-if="item.cavd_id" class="ml-1"  :content="'CAVD漏洞'" />
                    </div>
                </div>
                <div class="item" style="width: 12%;">
                    <div class="name">
                        漏洞编号
                    </div>
                    <!-- <a style="color:#6C87FF" target="_blank" :href="generateVulnLink(item.mps_id, item.cve_id)"> -->
                    <a class="link_text" target="_blank" :href="generateVulnLink(item.mps_id, item.cve_id)">
                        {{ item.cve_id || item.mps_id }}
                    </a>
                </div>
                <div class="item">
                    <div class="name">
                        涉及文件数
                    </div>
                    <div>
                        {{ item?.file_count }}
                    </div>
                </div>
                <div class="item">
                    <div class="name">
                        涉及组件数
                    </div>
                    <div>
                        {{ item?.comp_count }}
                    </div>
                </div>
                <div class="item">
                    <div class="name">
                        POC
                    </div>
                    <div style="color:#F34D3D">
                        {{ item.poc ? '有' : '无' }}
                    </div>
                </div>
                <div class="item">
                    <div class="name">
                        攻击成本
                    </div>
                    <div>
                        {{ item.exploit_requirement_cost || '-' }}
                    </div>
                </div>
                <div class="item">
                    <div class="name">
                        影响范围
                    </div>
                    <div style="color:#F34D3D">
                        {{ item.scope_influence || '-' }}
                    </div>
                </div>
                <div class="item">
                    <div class="name">
                        可触发漏洞
                    </div>
                    <div>
                        {{ item.is_triggers ? '是' : '否' }}
                    </div>
                </div>
                <div class="item" style="margin-right: 0">
                    <div class="name">
                        投毒
                    </div>
                    <div>
                        {{ item.cwe_id === 'CWE-506' ? '是' : '否' }}
                    </div>
                </div>
            </div>
            <!-- <div class="item g-f-12" @click="isShowInvolve = true; fileInfo = item"
                 style="color:#6C87FF;cursor: pointer;width: 5%;"> -->
            <div class="item button-text-blue" @click="isShowInvolve = true; fileInfo = item">
                涉及文件
            </div>
        </div>
    </div>

    <NoData v-if="!isHaveData" />

    <!-- 分页 -->
    <!-- <div class="pagination" v-if="total > 0">
        <el-pagination v-model:currentPage="curPage" background small :page-size="20" layout="total, prev, pager, next"
            :total="total">
        </el-pagination>
    </div> -->
    <InvolveFileModal :fileInfo="fileInfo" v-model="isShowInvolve" v-if="isShowInvolve" />

    <FilterConfig v-model="store.isShowFilterConfig" :filterConfig="filterConfig" />
</template>

<script setup lang='ts'>
import {
    ref, watch, reactive,
} from 'vue';
import store from 'util/store';
import { useRoute } from 'vue-router';
import { getDangerLevel, generateVulnLink } from 'util/tools';
import { getDetailVulnListApi, getFilterConfigApi } from 'api/project';
import useList from 'util/hook';
import { useInfiniteScroll } from '@vueuse/core';
import NoData from 'comp/NoData.vue';
import CheckboxComp from 'comp/CheckboxComp.vue';
import { vulnLevelOption } from '../constants/constants';
import SearchComp from '@/components/SearchComp.vue';
import FilterConfig from '../../platform/FilterConfig.vue';
import InvolveFileModal from './components/InvolveFileModal.vue';

const isShowInvolve = ref<boolean>(false);
const fileInfo = ref();
const filterConfig = reactive<{
    is_online: number,
    is_triggers: number,
    is_poison: number,

}>({
    is_online: 1,
    is_triggers: 1,
    is_poison: 1,
});

const filterData = ref<{
    subtask_id: string,
    project_id: string,
}>({
    subtask_id: useRoute().params.sid as string,
    project_id: useRoute().params.tid as string,
});
const {
    listData, initData, isHaveData, loading,
} = useList(getDetailVulnListApi, filterData);

const searchData = ref<{
    keyword: string,
    poc: boolean
    triggers: boolean,
    poison: boolean,
    level: number[],
    cavd: boolean,
}>({
    keyword: '',
    poc: false,
    triggers: false,
    poison: false,
    level: [],
    cavd: false,
});

const infiniteWrapEl = ref();
const curTotalData = ref<any[]>([]); // 当前搜索总数
let count = 1;

const infiniteHandle = (renderData: any, curTotal: any) => {
    renderData.value = curTotal.value.slice(0, 10);
    count = 1;
    useInfiniteScroll(
        infiniteWrapEl,
        () => {
            renderData.value.push(...curTotal.value.slice((count * 10), ((count + 1) * 10)));
            count++;
        },
    );
};

watch(initData, (async (newVal: any) => {
    if (newVal.length) {
        curTotalData.value = [...initData.value];
        infiniteHandle(listData, curTotalData);

        const res = await getFilterConfigApi();
        Object.assign(filterConfig, res.data);
        // filterConfig.is_online = (res.data.is_online);
        // filterConfig.is_triggers = (res.data.is_triggers);
        searchData.value.triggers = Boolean(res.data.is_triggers);
        searchData.value.poison = Boolean(res.data.is_poison);
    }
}));

// 筛选
const filterHandle = (newVal: any) => {
    let filterdata: Array<any> = [];

    // 搜索过滤
    filterdata = initData.value.filter((item: any) => item.cve_id.includes(newVal.keyword));

    if (!filterdata.length) {
        filterdata = initData.value.filter((item: any) => item.mps_id.includes(newVal.keyword));
    }

    if (newVal.level.length) {
        filterdata = filterdata.filter((item: any) => newVal.level.includes(item.level));
    }

    // 触发漏洞
    if (newVal.triggers) {
        filterdata = filterdata.filter((item: any) => item.is_triggers);
    }

    // 触发漏洞
    if (newVal.poc) {
        filterdata = filterdata.filter((item: any) => item.poc);
    }

    // 触发漏洞
    if (newVal.poison) {
        filterdata = filterdata.filter((item: any) => item.cwe_id === 'CWE-506');
    }

    if (newVal.cavd) {
        filterdata = filterdata.filter((item: any) => item.cavd_id);
    }

    // listData.value = filterdata;
    curTotalData.value = [...filterdata];
    infiniteHandle(listData, curTotalData);

    isHaveData.value = listData.value.length > 0;
};

// 重置
const resetHandle = () => {
    Object.assign(searchData.value, {
        keyword: '',
        poc: false,
        triggers: false,
        online: false,
        poison: false,
        level: [],
        cavd: false,
    });

    filterHandle(searchData.value);
};

watch(searchData.value, (newVal: any) => {
    filterHandle(newVal);
});
</script>

<style lang='less' scoped>
.filter_wrap {
    margin-bottom: 16px;
    display: flex;
}

.vuln_item {
    height: 74px;
    background-color: #F7F8FB;
    border-left: 4px solid #F34D3D;
    border-radius: 4px;
    margin-bottom: 10px;
    .between();
    font-size: 14px;
    color: #3c3c3c;
    padding: 0 16px;

    .left {
        display: flex;
        width: 100%;

        span.tag {
            padding: 3px 5px;
            background: rgba(73, 102, 230, 0.2);
            border-radius: 4px;
            color: #2946C7;
            font-size: 12px;
            vertical-align: 3px;
            display: inline-block;
            transform: scale(0.8);
        }

        .name {
            font-size: 12px;
            height: 15px;
            line-height: 15px;
            color: #8F959E;
        }

        .vuln_title {
            // display: inline-block;
            // max-width: 80%;
            .ellipsis();
        }

        .item {
            &:nth-of-type(1) {
                .ellipsis();
            }

            margin-right: 10px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 45px;
            width: 8%;

            a:hover {
                text-decoration: underline;
            }
        }
    }
}
</style>
