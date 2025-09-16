<template>
    <div class="h-full pt-6 box-border">
        <div v-for="ele in taskList" :key="ele.id"
            class="item g-flex g-align-center g-pl-16 g-pr-16 g-bg-ff g-bdr-6 g-mb-12" style="height: 56px;">
            <div class="td" style="width: 20%;">
                <div>
                    <img style="margin-right: 4px;" :src="getAccessImg(ele.access_type)" alt="">
                    <span class="time">{{ formatDate(ele.created_at) }}</span>
                </div>
            </div>
            <div class="td" style="width: 8%;">
                <i style="color: #858585;" class="murphy icon-code-branch"></i>
                {{ ele.branch || '-' }}
            </div>
            <div class="td" style="width: 15%;">
                <span style="font-size: 12px; color: #8F959E">检测模式</span>
                {{ ele.scan_mode }}
            </div>
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
            <div class="td g-flex g-align-center task-status" style="width: 12%">
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
            <el-button class="g-f-12" @click="compareHandle(ele)">开始对比</el-button>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { getCompareDataApi, getDiffFileTree } from 'api/project';
import { useRoute } from 'vue-router';
import {
    formatDate, getAccessImg, getDetectStatus,
} from '@/utils/tools';
import {
    isShowDiff, compareData, ids, otherCompareData,
} from './data';

const { info } = defineProps(['taskList', 'info']);

const route = useRoute();

const compareHandle = async (ele:any) => {
    try {
        const res = await getCompareDataApi({
            sid: ele.id,
            fid: route.params.sid,
        });
        compareData.value = res.data;
        otherCompareData.value.project = info.name;
        otherCompareData.value.task = formatDate(ele.created_at);
    } catch (error) {
        console.log(error);
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
