<template>
    <!-- <CommonHead>
        <span>安全问题列表</span>
    </CommonHead> -->

    <div class="question_wrap">
        <!-- <div class="tip" v-if="isShowTip && !store.isAllTeam">
            <div>
                <i style="color:#FF9940" class="murphy icon-gantanhao"></i>
                {{ repairList.length }} 个安全问题超过 7 天未修复
            </div>
            <div style="color: #6C87FF;cursor: pointer;">
                <span @click="isShowRepair = true">立即处理</span>
                <i @click="isShowTip = false"
                    style="font-size: 20px;color: #858585;vertical-align: -2px;margin-left: 16px;"
                    class="murphy icon-cuo"></i>
            </div>
        </div> -->

        <div class="question_tabs">
            <div class="tab">
                <span v-for="item in tabs" :key="item.name"
                      :class="{ 'active': filterOptions.fix_status === item.fix_status, 'none': item.name === '7天忽略' && $systemConfig.isGf }"
                      @click="filterOptions.fix_status = item.fix_status; resetHandle()">{{ item.name }} {{ item.total
                      }}</span>
            </div>
        </div>

        <div class="filter_wrap">
            <SearchComp style="width: 200px;" clearable v-model="filterOptions.keyword" placeholder="搜索代码项目或组件" />
            <!-- <SelectComp style="width: 160px;" v-model="filterOptions.owner_user_id" placeholder="请选择团队"
                :options="store.teamList" /> -->
            <el-select v-if="store.isAllTeam" filterable style="margin-right: 8px; width: 140px;"
                       v-model="filterOptions.team_id" placeholder="请选择团队">
                <el-option v-for="item in store.teamList" :key="item.id" :label="item.team_name" :value="item.id" />
            </el-select>
            <SelectComp style="width: 140px;" v-model="filterOptions.high_suggest" placeholder="请选择处置等级"
                        :options="repairlOptions" />
            <SelectComp style="width: 140px;" v-model="filterOptions.owner_user_id" placeholder="请选择负责人"
                        :options="principalList" />
            <!-- <div>
                <el-date-picker style="width: 200px;margin-right: 8px;" v-model="filterOptions.created_at"
                    type="daterange" clearable range-separator="—" start-placeholder="开始时间" end-placeholder="结束时间" />
            </div> -->
            <el-date-picker v-model="filterOptions.created_at" style="width: 200px;margin-right: 8px"
                            type="datetimerange" start-placeholder="开始时间" end-placeholder="结束时间" />

            <el-checkbox style="margin-right: 10px;" :true-label="1" :false-label="0"
                         v-model="filterOptions.is_triggers" label="可触发漏洞" />
            <el-checkbox v-model="filterOptions.is_online" :true-label="1" :false-label="0" label="线上依赖" />
            <el-button class="minor_btn" @click="resetHandle"
                       style="height: 32px;width: 52px;margin-left: 16px;">重置</el-button>
            <el-button class="minor_btn" @click="store.isShowFilterConfig = true"
                       style="height: 32px;width: auto;margin-left: 8px;">筛选配置</el-button>
        </div>

        <div class="questions_content">
            <div class="wrap">
                <div class="item" v-for="(item, index) in listData" :key="index">
                    <IssueComp :data="item" :show="true" />
                </div>
            </div>

            <NoData v-if="!isHaveData" />

            <!-- 分页 -->
            <div class="pagination" v-if="total > 0">
                <el-pagination v-model:currentPage="curPage" background small :page-size="20"
                               layout="total, prev, pager, next" :total="total">
                </el-pagination>
            </div>
        </div>
    </div>

    <!-- <el-dialog width="900px" v-model="isShowRepair" :close-on-click-modal="false" title="待修复安全问题">
        <div style="height: 500px;overflow: auto;">
            <div class="item" v-for="(item, index) in repairList" :key="index">
                <IssueComp :data="item" :show="false" />
            </div>
        </div>
    </el-dialog> -->

    <FilterConfig v-model="store.isShowFilterConfig" :filterConfig="filterConfig" />

    <IssueDetailModal v-model="showIssueDetail" v-if="showIssueDetail" :securityId="securityId" />

</template>

<script setup lang='ts'>
import { ref, onBeforeMount, reactive } from 'vue';
import store from 'util/store';
import {
    getSafeQuestionListApi, getPrincipalListApi, getSafeQuestionStatusNumApi, getFilterConfigApi,
} from 'api/project';
import useList from 'util/hook';
import SearchComp from 'comp/SearchComp.vue';
import SelectComp from 'comp/SelectComp.vue';
import IssueComp from './comp/IssueComp.vue';
import NoData from '@/components/NoData.vue';
import FilterConfig from './FilterConfig.vue';
import IssueDetailModal from './IssueDetailModal.vue';

// const isShowRepair = ref<boolean>(false);
const isShowTip = ref<boolean>(false);
const repairlOptions = ref<Array<any>>([
    {
        value: 0,
        label: '全部',
    },
    {
        value: 4,
        label: '强烈建议修复',
    },
    {
        value: 3,
        label: '建议修复',
    },
    {
        value: 2,
        label: '可选修复',
    },
]);
const principalList = ref<Array<any>>([]);
const repairList = ref<Array<any>>([]);
const tabs = ref<Array<any>>([]);
const filterConfig = reactive<{
    is_online: number,
    is_triggers: number,
}>({
    is_online: 1,
    is_triggers: 1,
});
const showIssueDetail = ref<boolean>(false);
const securityId = ref<string>('');

const filterOptions = ref<{
    team_id: string,
    fix_status: number,
    high_suggest: number | string,
    keyword: string,
    created_at: Array<any> | null,
    owner_user_id: string,
    is_triggers: number,
    is_online: number,
}>({
    team_id: store.teamInfo.team_id,
    keyword: '',
    high_suggest: 0,
    fix_status: 0,
    created_at: null,
    is_triggers: 0,
    is_online: 0,
    owner_user_id: store.userInfo.id,
});

// tip提示
const getTipsData = async () => {
    const res1 = await getSafeQuestionListApi({
        team_id: store.teamInfo.team_id,
        fix_status: 1,
        created_at: ['2000-05-02T16:00:00.000Z', new Date(new Date().getTime() - 8 * 24 * 60 * 60 * 1000)],
        owner_user_id: store.userInfo.id,
        is_page: true,
    });
    isShowTip.value = res1.data.list && res1.data.list.length;
    repairList.value = res1.data.list;
};

onBeforeMount(async () => {
    const res = await getPrincipalListApi({
        team_id: store.teamInfo.team_id,
    });
    principalList.value = res.data?.list?.map((item: any) => ({
        value: item.owner_user_id,
        label: item.owner_user_name,
    }));
    if (!principalList.value.some((item) => item.value === store.userInfo.id)) {
        filterOptions.value.owner_user_id = principalList.value[0]?.value;
    }

    getTipsData();

    // 安全问题数量
    const res2 = await getSafeQuestionStatusNumApi({
        team_id: store.teamInfo.team_id,
    });
    const allNum = res2.data.reduce((pre: any, cur: any) => pre + cur.total, 0);
    tabs.value = [{
        name: '全部',
        fix_status: 0,
        total: allNum,
    }, ...res2.data];
    tabs.value.splice(tabs.value.length - 1, tabs.value.length, { ...tabs.value.find((item) => item.name === '永久忽略'), name: '关闭' });

    // 获取筛选配置
    const res3 = await getFilterConfigApi();
    Object.assign(filterConfig, res3.data);
    Object.assign(filterOptions.value, res3.data);

    // 安全问题分享加入 自动打开
    if (window.sessionStorage.getItem('sec-id')) {
        showIssueDetail.value = true;
        securityId.value = window.sessionStorage.getItem('sec-id') as string;
    }
});

const {
    total, curPage, listData, isHaveData,
} = useList(getSafeQuestionListApi, filterOptions);

// 重置
const resetHandle = () => {
    Object.assign(filterOptions.value, {
        keyword: '',
        high_suggest: 0,
        created_at: null,
        owner_user_id: store.userInfo.id,
        is_triggers: 0,
        is_online: 0,
        team_id: store.teamInfo.team_id,
    });
    if (!principalList.value.some((item) => item.value === store.userInfo.id)) {
        filterOptions.value.owner_user_id = principalList.value[0]?.value;
    }
};

</script>

<style lang='less' scoped>
.back {
    color: #5572F4;
    cursor: pointer;
}

.question_wrap {
    // height: calc(100% - 58px);
    background-color: #F7F8FB;
    box-sizing: border-box;

    .tip {
        height: 40px;
        background: linear-gradient(0deg, rgba(255, 153, 64, 0.2), rgba(255, 153, 64, 0.2)), #FFFFFF;
        border-radius: 6px;
        margin-bottom: 16px;
        font-size: 14px;
        .between();
        padding: 0 16px;
        color: #3c3c3c;
    }
}

.questions_content {
    // height: calc(100% - 192px);
    // overflow: auto;
    background-color: #fff;
    padding: 16px;
}

.question_tabs {
    display: flex;
    align-items: center;
    justify-content: space-between;
    // border-bottom: 1px solid rgba(30, 30, 30, 0.1);
    margin-bottom: 16px;

    img {
        width: 16px;
        vertical-align: -2px;
        margin-right: 5px;
    }

    // .tab {
    //     // width: 500px;
    //     // .between();
    // }

    .tab span {
        display: inline-block;
        background: #FFFFFF;
        border: 1px solid #C7C7C7;
        border-radius: 6px;
        padding: 3px 6px;
        margin-right: 12px;
        color: #3c3c3c;
        font-size: 14px;
        cursor: pointer;
    }

    .tab span.active {
        background: rgba(108, 135, 255, 0.1);
        border: 1px solid rgba(108, 135, 255, 0.5);
        border-radius: 6px;
        color: #6C87FF;
    }

    .tab span.none {
        display: none
    }
}

.filter_wrap {
    display: flex;
    align-items: center;
    background: #FFFFFF;
    border-radius: 4px;
    padding: 16px;
    margin-bottom: 12px;
}

.select_wrap {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 16px;

    i {
        font-size: 12px;
    }
}

.btns {
    margin-top: 20px;
    margin-left: 62%;
}
</style>
