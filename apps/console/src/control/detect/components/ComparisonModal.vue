<template>
    <el-dialog class="screen-dialog" width="100%">
        <div class="container">
            <div class="g-f-24 g-color-1 g-fw-600 g-mb-16">
                <img class="file_icon g-mr-4" style="width: 26px;" :src="getFileImg(detailInfo.main)" alt="">
                {{ detailInfo.main }}
            </div>

            <el-tabs v-model="activeName">
                <el-tab-pane label="反汇编代码文件" name="3">
                    <div class="g-flex g-justify-end g-align-center g-mb-16">
                        <!-- <SearchComp clearable placeholder="请搜索函数名" /> -->
                        <DefaultBtn @click="switchCodeType = !switchCodeType">
                            <i class="murphy icon-qiehuan g-mr-4"></i>
                            {{ switchCodeType ? '汇编码' : '伪代码' }}
                        </DefaultBtn>
                    </div>
                    <div class="file-wrap g-flex">
                        <div v-infinite-scroll="loadMoreData2" :infinite-scroll-distance="150" infinite-scroll-immediate class="left-content g-mr-8">
                            <div class="top g-flex g-align-center g-justify-between">
                                共{{ funcList?.length }}条主文件函数
                                <el-tooltip placement="top" content="查看命中函数">
                                    <el-switch v-model="hitFunc" @change="checkHitFunc" size="small" />
                                </el-tooltip>
                            </div>
                            <div v-for="(item, index) in renderList"
                                @click="activeFunc=index; getFuncCode(item.main_function_address, item.main_function_name)"
                                :key="item.diff_function_address"
                                :class="{'active-func': activeFunc===index}"
                                class="item g-flex g-align-center g-justify-between g-bg-ff">
                                <div>
                                    <div class="fn-name">{{ item.main_function_name || '-' }}</div>
                                    <div class="fn-name">{{ item.diff_function_name || '-' }}</div>
                                </div>
                                <div class="hit" v-if="item.is_hit">
                                    命中
                                </div>
                            </div>
                        </div>

                        <div style="height: 100%;" class="right-content g-flex g-flex-grow-1">
                            <div style="height: 100%;width: 0;" class="g-flex-grow-1 g-mr-8 g-bg-f7 g-bdr-6  g-p-16">
                                <div class="g-f-16 g-color-1 g-mb-8">
                                    <span class="tag g-fw-500"
                                        style="background: rgba(51, 112, 255, 0.20);font-size: 14px;">主文件</span>
                                    {{ funcCode?.main?.function_name }}
                                </div>
                                <div class="g-f-14 g-mb-8 g-color-3">
                                    地址：{{ funcCode.main?.function_address || '-' }}
                                </div>
                                <div style="height: 80%;width:100%;overflow: auto;"
                                    class="g-f-14 g-color-3 g-flex-grow-1 g-bg-ff g-p-16 g-bfr-6 g-border-box">
                                    <highlightjs v-if="funcCode?.main?.disassembly&&funcCode?.main?.decompiled" class="g-mt-8" autodetect
                                        :code="switchCodeType ? funcCode.main?.disassembly : funcCode.main?.decompiled" />
                                    <NoData v-else />
                                </div>
                            </div>
                            <div style="height: 100%;width: 0;" class="g-flex-grow-1 g-bg-f7 g-bdr-6 g-p-16">
                                <div class="g-f-16 g-color-1 g-mb-8">
                                    <span class="tag g-fw-500"
                                        style="background: rgba(51, 112, 255, 0.20);font-size: 14px;">对比文件</span>
                                        {{ funcCode?.diff?.function_name }}
                                </div>
                                <div class="g-f-14 g-mb-8 g-color-3">
                                    地址：{{ funcCode.diff?.function_address || '-' }} &nbsp;&nbsp;
                                    相似度：{{ funcCode?.similarity ?  Math.round(funcCode?.similarity*100) + '%' : '-'  }}
                                </div>
                                <div style="height: 80%;width:100%;overflow: auto;"
                                    class="g-f-14 g-color-3 g-flex-grow-1 g-bg-ff g-p-16 g-bfr-6 g-border-box">
                                    <highlightjs v-if="funcCode?.diff?.disassembly&&funcCode?.diff?.decompiled" class="g-mt-8" autodetect
                                        :code="switchCodeType ? funcCode.diff?.disassembly : funcCode.diff?.decompiled" />
                                    <NoData v-else />
                                </div>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="ASCII字符串" name="2">
                    <ASCIIComp :sid="detailInfo.sid" :fileParams="{}" :reqFunc="getASCIIDataApi" />
                </el-tab-pane>

                <el-tab-pane label="文件详情" name="1">
                   <FileDetailComp :reqFunc="getFileDetailInfoApi" :fileParams="{}" :sid="detailInfo.sid" />
                </el-tab-pane>
            </el-tabs>
        </div>
    </el-dialog>
</template>

<script setup lang='ts'>
import store from 'util/store';
import { ref, onBeforeMount } from 'vue';
import {
    getBinaryFuncListApi, getBinaryFuncCodeApi, getFileDetailInfoApi, getASCIIDataApi,
} from 'api/detect';
import { getFileImg } from '@/constants/file-icon';
import NoData from '@/components/NoData.vue';
import DefaultBtn from '@/components/DefaultBtn.vue';
import ASCIIComp from './ASCIIComp.vue';
import FileDetailComp from './FileDetailComp.vue';

const props = defineProps<{
    detailInfo: {
        main: string,
        diff: string,
        sid: string
    }
}>();

const activeFunc = ref<number>(0);
const switchCodeType = ref<boolean>(true);
const activeName = ref<string>('3');
const funcCode = ref<any>({});
const hitFunc = ref<boolean>(false);

const cacheFuncList = ref<Array<any>>([]); // 总数
const funcList = ref<Array<any>>([]); // scroll数
const renderList = ref<Array<any>>([]); // 渲染数

const checkHitFunc = (val: boolean) => {
    if (val) {
        funcList.value = cacheFuncList.value.filter((item) => item.is_hit);
        renderList.value = funcList.value.splice(0, 20);
    } else {
        funcList.value = [...cacheFuncList.value];
        renderList.value = funcList.value.splice(0, 20);
    }
};

const getFuncCode = async (addr: string, main: string) => {
    try {
        const { data } = await getBinaryFuncCodeApi({
            team_id: store.teamInfo.team_id,
            subtask_id: props.detailInfo.sid,
            main_function_name: main,
            main_function_address: addr,
        });
        funcCode.value = data;
    } catch (error) {
        console.log(error);
    }
};

onBeforeMount(async () => {
    try {
        const { data } = await getBinaryFuncListApi({
            team_id: store.teamInfo.team_id,
            subtask_id: props.detailInfo.sid,
        });
        cacheFuncList.value = [...data.list];
        funcList.value = [...data.list];
        renderList.value = funcList.value.splice(0, 20);
        if (renderList.value.length) {
            getFuncCode(renderList.value[0].main_function_address, renderList.value[0].main_function_name);
        }
    } catch (error) {
        console.log(error);
    }
});

const loadMoreData2 = () => {
    renderList.value.push(...funcList.value.splice(0, 20));
};
</script>

<style lang='less' scoped>
.container {
    // padding: 0 120px;
    margin: 0 auto;
    padding-bottom: 0;
    background-color: #fff;
    height: 100%;
    overflow: auto;
    box-sizing: border-box;

    .hit {
        color: #fff;
        background-color: #38C728;
        padding: 3px 4px;
        border-radius: 4px;
        font-weight: 500;
        font-size: 13px;
    }

    :deep(.el-tabs__item) {
        font-size: 16px;
    }

    .file-wrap {
        height: 65vh;

        .left-content {
            width: 208px;
            height: 100%;
            background-color: #F7F8FB;
            border-radius: 6px;
            overflow: auto;
        }

        .item,
        .top {
            padding: 12px;
            box-sizing: border-box;
            width: 100%;
            margin-bottom: 2px;
            cursor: pointer;

            .fn-name {
                &:nth-of-type(1) {
                    margin-bottom: 3px;
                }

                max-width: 128px;
                .ellipsis();
            }
        }
        .active-func {
            background-color: #6C87FF;
            color: #fff;
        }
        // .item:hover {
        //     background-color: #EBEBEB;
        // }

    }

    .part div {
        width: 380px;
        margin-right: 30px;
        .ellipsis();
    }
}
</style>
