<template>
    <div class="pt-6 h-full box-border">
        <div class="mb-4 p-4 rounded-md bg-ff">
            <SearchComp style="width: 240px;" v-model="keyword" clearable placeholder="请搜索项目名称" />
            <el-button :disabled="!keyword" class="w-20" @click="getData">搜索</el-button>
        </div>

        <div class="table_wrap flex justify-center">
            <div class="w-full" v-if="listData.length">
                <div class="g-f-14 g-mb-16 g-color-3 g-fw-400 g-flex g-justify-between g-align-center">
                    <span>共 <span class="g-color-1">{{ total }}</span> 条数据</span>
                </div>

                <div class="thead">
                    <div class="th" style="width:18px"></div>
                    <div class="th" style="flex:1">项目名称</div>
                    <div class="th" style="width:18%">最新检测时间</div>
                    <div class="th" style="width:12%">语言</div>
                    <div class="th" style="width:10%">检测状态</div>
                </div>
                <div class="tbody" v-for="item in listData" :key="item.id" @click="expandHandle(item)">
                    <div class="list_item">
                        <div class="td" style="width:18px;">
                            <span class="expand_icon">
                                <i class="murphy icon-youjiantou" style="font-size: 12px;" v-if="!item.expand"></i>
                                <i class="murphy icon-xiala1" v-else></i>
                            </span>
                        </div>
                        <div class="td ellipsis" style="flex: 1;">
                            <div class="project_name g-flex g-align-center">
                                <el-tooltip :content="item.name" placement="top">
                                    <span class="name">{{ item.name }}</span>
                                </el-tooltip>

                                <div v-if="item.tags?.length > 1" class="g-flex">
                                    <TagComp class="g-mr-4 g-ml-4" bgc="rgba(31, 35, 41, 0.10)" c="#1F2329"
                                        :content="item.tags[0].tag_name" />
                                    <el-tooltip placement="top" effect="light">
                                        <template #content>
                                            <div style="max-width: 330px;padding: 8px 4px;">
                                                <div v-for="o in (item.tags)" :key="o" class="g-mb-8">
                                                    <TagComp bgc="rgba(31, 35, 41, 0.10)" c="#1F2329"
                                                        :content="o.tag_name" />
                                                </div>
                                            </div>
                                        </template>
                                        <TagComp bgc="rgba(31, 35, 41, 0.10)" c="#1F2329"
                                            :content="`+${item.tags?.length}`" />
                                    </el-tooltip>
                                </div>

                                <span v-if="item.tags?.length === 1">
                                    <TagComp class="g-mr-4 g-ml-4" bgc="rgba(31, 35, 41, 0.10)" c="#1F2329"
                                        :content="item.tags[0].tag_name" />
                                </span>

                                <el-tooltip v-if="item.detection_strategy_project_name?.length" placement="top">
                                    <template #content>
                                        <div>
                                            命中项目策略：
                                        </div>
                                        <div v-for="o in ((item.detection_strategy_project_name))" :key="o">
                                            {{ o }}
                                        </div>
                                    </template>
                                    <span class="status stra-icon g-ml-8">
                                        <i class="murphy icon-a-hitthetarget"
                                            style="color: #F34D3D;font-size: 16px;"></i>
                                    </span>
                                </el-tooltip>
                            </div>
                        </div>
                        <div class="td" style="width:18%">
                            <div>
                                {{ formatDate(item.updated_at) }}
                            </div>
                        </div>
                        <div class="td" style="width:12%">
                            <span v-if="!item.languages">未知</span>
                            <el-tooltip v-else placement="top">

                                <template #content>
                                    <div v-for="ele in item.languages.split(',')" :key="ele">
                                        {{ ele }}
                                    </div>
                                </template>
                                <span>
                                    {{ item.languages.split(',').length > 1 ? `${item.languages.split(',')[0]}...` :
                                        item.languages.split(',')[0] }}
                                </span>
                            </el-tooltip>
                        </div>
                        <div class="td" style="width:10%">
                            <span class="status" style=" background: #7F3BF533;color: #6425D0;"
                                v-if="item.status === 1">
                                <i class="murphy icon-shijian"></i>
                                队列中
                            </span>
                            <span class="status" style=" background: #14C0FF33;color: #049FD7;"
                                v-else-if="item.status === 2">
                                <i class="murphy icon-shijian"></i>
                                运行中
                            </span>
                            <span class="status" style=" background: #34c72433;color: #2EA121;"
                                v-else-if="item.status === 3">
                                <i class="murphy icon-wancheng2"></i>
                                检测成功
                            </span>
                            <span class="status" style="background: #1F23291A;color: #646A73;"
                                v-else-if="item.status === 8">
                                <i class="murphy icon-cuowu"></i>
                                检测取消
                            </span>
                            <div v-else>
                                <span class="status" style="background: #F54A4533;color: #D83931;">
                                    <i class="murphy icon-tixing" style="font-size: 16px;"></i>
                                    检测失败
                                </span>
                                <el-tooltip placement="top" :content="getDetectStatus(item.status)">
                                    <span class="tanhao">
                                        <i class="murphy icon-tixing"></i>
                                    </span>
                                </el-tooltip>
                            </div>
                        </div>
                    </div>

                    <div class="expand_content" @click.stop v-if="item.expand">
                        <div class="history_item" v-for="(ele, i) in item.history" :key="i">
                            <div class="td" style="flex: 1;">
                                <img style="margin-right: 4px;" :src="getAccessImg(ele.access_type)" alt="">

                                <!-- <el-tooltip effect="light" placement="right">
                            <template #content>
                                <TimeConsume :status="ele.status" :sid="ele.id" />
                            </template> -->
                                <span class="time">{{ formatDate(ele.created_at) }}</span>
                                <!-- </el-tooltip> -->

                                <el-tooltip v-if="ele.detection_strategy_project_name?.length" placement="top">
                                    <template #content>
                                        <div>
                                            命中项目策略：
                                        </div>
                                        <div v-for="o in ((ele.detection_strategy_project_name))" :key="o">
                                            {{ o }}
                                        </div>
                                    </template>
                                    <span class="status g-bdr-4 g-ml-8" style="display:
                            inline-block ;padding: 4px 5px;">
                                        <i class="murphy icon-a-hitthetarget"
                                            style="color: #F34D3D;font-size: 16px;"></i>
                                    </span>
                                </el-tooltip>
                            </div>

                            <div class="td" style="width: 8%;">
                                <i style="color: #858585;" class="murphy icon-code-branch"></i>
                                {{ ele.branch || '-' }}
                            </div>
                            <div class="td" style="width: 14%;">
                                <span style="font-size: 12px; color: #8F959E">检测模式</span>
                                {{ ele.scan_mode }}
                            </div>
                            <!-- <div class="td" style="width: 8%;">
                        <span style="font-size: 12px; color: #8F959E;margin-right: 3px;">语言</span>
                        <span v-if="!ele.langues">未知</span>
                        <el-tooltip v-else placement="top">
                            <template #content>
                                <div v-for="item in ele.langues.split(',')" :key="item">
                                    {{ item }}
                                </div>
                            </template>
                            <span>
                                {{ ele.langues.split(',')[0] }}
                            </span>
                        </el-tooltip>
                    </div> -->
                            <div class="td" style="width: 8%;">
                                <span style="font-size: 12px; color: #8F959E">组件</span>
                                {{ ele.comp_num || (ele.status !== 3 ? '-' : ele.comp_num) }}
                            </div>
                            <div class="td" style="width: 8%;color: #F34D3D;">
                                <span style="font-size: 12px;color: #8F959E">漏洞</span>
                                {{ ele.leak_num || (ele.status !== 3 ? '-' : ele.leak_num) }}
                            </div>
                            <div class="td" style="width: 10%;color: #F34D3D;">
                                <span style="font-size: 12px;color: #8F959E">缺陷组件</span>
                                {{ (ele.strong_num + ele.recommend_num + ele.optional_num) || (ele.status !== 3 ? '-' :
                                    ele.strong_num + ele.recommend_num + ele.optional_num) }}
                            </div>
                            <div class="td" style="width: 12%;">
                                <el-tooltip placement="top" content="强烈建议修复">
                                    <span class="tag">{{ ele.strong_num }}</span>
                                </el-tooltip>
                                <el-tooltip placement="top" content="建议修复">
                                    <span class="tag">{{ ele.recommend_num }}</span>
                                </el-tooltip>
                                <el-tooltip placement="top" content="可选修复">
                                    <span class="tag">{{ ele.optional_num }}</span>
                                </el-tooltip>
                            </div>
                            <div class="td g-flex g-align-center task-status" style="width: 11%">
                                <span style="color: #6425D0;" v-if="ele.status === 1">
                                    队列中
                                </span>
                                <span style="color: #049FD7;" v-else-if="ele.status === 2">
                                    运行中
                                </span>
                                <span style="color: #2EA121;" v-else-if="ele.status === 3">
                                    检测成功
                                </span>
                                <span style="color: #646A73;" v-else-if="ele.status === 8">
                                    检测取消
                                </span>
                                <span v-else style="color: #D83931;">
                                    检测失败
                                    <el-tooltip placement="top" :content="getDetectStatus(ele.status)">
                                        <span class="tanhao g-vertical--1">
                                            <i class="murphy icon-tixing"></i>
                                        </span>
                                    </el-tooltip>
                                </span>
                            </div>

                            <div class="td">
                                <el-button @click="compareHandle(ele, item)" class="w-16 h-7 text-xs">开始对比</el-button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 分页 -->
                <PageComp v-model:currentPage="page" :total="total" :page-size="20" />
            </div>

            <div v-else class="self-center">
                <NoData />
                <div class="font-normal text-sm text-85 text-center mt-[-8px]">请根据搜索及筛选条件查询所需对比的任务</div>
            </div>
        </div>
    </div>

</template>

<script setup lang='ts'>
import { ref } from 'vue';
import SearchComp from 'comp/SearchComp.vue';
import store from 'util/store';
import { useRoute } from 'vue-router';
import { formatDate, getDetectStatus, getAccessImg } from 'util/tools';
import NoData from 'comp/NoData.vue';
import {
    getConsoleProjectListApi, getHistoryListApi, getDiffFileTree, getCompareDataApi,
} from 'api/project';
import PageComp from '@/components/PageComp.vue';
import {
    compareData, isShowDiff, otherCompareData, ids,
} from './data';

const keyword = ref<string>('');
const total = ref<number>(0);
const page = ref<number>(1);
const listData = ref<any[]>([]);
const route = useRoute();

const getData = async () => {
    try {
        const { data } = await getConsoleProjectListApi({
            limit: 10,
            page: page.value,
            team_id: store.teamInfo.team_id,
            keyword: keyword.value,
        });
        listData.value = data.list;
        total.value = data.total;
        listData.value = listData.value.map((item) => ({
            expand: false,
            ...item,
        }));
        // eslint-disable-next-line no-use-before-define
        expandHandle(listData.value[0]);
    } catch (error) {
        console.log(error);
    }
};

// 历史记录
const expandHandle = async (item: any) => {
    if (!item.history) {
        try {
            const res = await getHistoryListApi({
                project_id: item.id,
                limit: 5,
                page: 1,
                team_id: store.teamInfo.team_id,
            });
            item.history = res.data.list || [];
            item.created_at = item.history[0]?.created_at;
        } catch (error) {
            console.log(error);
        }
    }
    item.expand = !item.expand;
};

const compareHandle = async (ele: any, item: any) => {
    try {
        const res = await getCompareDataApi({
            sid: ele.id,
            fid: route.params.sid,
        });
        compareData.value = res.data;
        otherCompareData.value.project = item.name;
        otherCompareData.value.task = formatDate(ele.created_at);
    } catch (error) {
        //
    }

    try {
        const res = await getDiffFileTree(ele.id, route.params.sid as string);
        Object.assign(compareData.value, res.data);
        isShowDiff.value = true;
    } catch (error) {
        console.log(error);
    }

    ids.value.fid = route.params.sid;
    ids.value.sid = ele.id;
};
</script>

<style scoped lang='less'>
.table_wrap {
    padding: 16px;
    background-color: #fff;
    color: #3c3c3c;
    font-size: 14px;
    height: calc(100% - 82px);
    overflow: auto;
    border-radius: 6px;
    box-sizing: border-box;

    .tbody {
        border-bottom: 1px solid #EFF0F1;
    }

    img {
        width: 20px;
        border-radius: 50%;
        vertical-align: -5px;
    }

    .project_name {
        .name {
            max-width: 80%;
            display: inline-block;
            .ellipsis();
        }

        .tag {
            background-color: rgba(31, 35, 41, 0.10);
            color: #1F2329;
        }

        width: 100%;
        cursor: pointer;
        color: #3c3c3c;
        padding: 10px 0;
    }

    .add {
        &:hover {
            background-color: #EBEBEB;
        }

        width: 28px;
        height: 28px;
        padding: 6px;
        border-radius: 6px;
        cursor: pointer;
        box-sizing: border-box;
        display: inline-block;

        i {
            font-size: 14px;
        }
    }

.tanhao {
    &:hover {
        background-color: #F54A4533;
    }

    width: 24px;
    height: 24px;
    text-align: center;
    line-height: 24px;
    border-radius: 4px;
    display: inline-block;
    vertical-align: middle;
    margin-left: 4px;

    i {
        color: #D83931;
    }
}

    .thead {
        display: flex;
        align-items: center;
        height: 56px;
        background: #F7F8FB;
        padding: 0 16px;
        font-size: 14px;
        color: #8F959E;
        border-radius: 4px;
        margin-bottom: 1px;
    }

    th {
        .ellipsis();
    }

    .list_item {
        &:hover {
            .expand_icon {
                display: inline-block;
            }

            background-color: #6c87ff0e;
        }

        .expand_icon {
            display: none;
        }

        cursor: pointer;
        display: flex;
        align-items: center;
        height: 56px;
        padding: 0 16px;
        margin-bottom: 1px;
        transition: background-color .2s;

        .status {
            padding: 5px 6px;
            font-size: 12px;
            border-radius: 4px;

            i {
                font-size: 14px;
                vertical-align: -1px;
            }
        }

        .stra-icon:hover {
            background: #f34d3d38;
        }

    }

    .history_item {
        display: flex;
        align-items: center;
        height: 56px;
        padding: 0 16px;
        background-color: #F7F8FB;
        border-radius: 8px;
        margin: 8px 0;
        margin-left: 20px;
        cursor: pointer;

        .status {
            &:hover {
                background: #f34d3d38;
            }
        }

        // .time:hover {
        //     text-decoration: underline;
        //     color: #6c87ff;
        // }

        .td {
            .ellipsis();
        }

        .user {
            display: inline-block;
            background-color: #EFF0F1;
            height: 20px;
            line-height: 20px;
            border-radius: 16px;
            padding-right: 5px;
        }

        img {
            border-radius: 0;
        }

        .tag {
            background: #f54a4533;
            border-radius: 4px;
            padding: 4px 6px;
            margin-right: 4px;
            font-size: 13px;
            color: #D83931;
            font-weight: 500;
        }

        .tag:nth-of-type(2) {
            background-color: #ff880033;
            color: #DE7802;
        }

        .tag:nth-of-type(3) {
            background-color: #1f23291a;
            color: #646A73;
        }
    }
}
</style>
