<template>
    <el-dialog class="screen-dialog" width="100%">
        <div class="diff-content">
            <div class="g-mb-24 g-flex g-justify-between g-align-center">
                <div class="g-flex-grow-1" style="width: 0;">
                    <div class="g-f-24 g-fw-500 g-mb-8">
                        {{ dialogRenderData?.name }}
                    </div>
                    <div class="g-f-14 g-fw-500 g-color-3 g-mb-8">
                        匹配开源项目
                        <img v-if="dialogRenderData?.url?.includes('github')" style="width: 21px"
                            class="g-vertical--4 g-mr-4" src="~ast/logos/github.png" alt="">
                        <a class="hover_text" :href="dialogRenderData?.url" target="_blank">{{ dialogRenderData?.url }}</a>
                    </div>

                    <div class="g-f-14 g-color-1 g-mb-12" v-if="dialogRenderData?.project_license_data?.licenses?.length">
                        <span class="g-color-3 g-fw-500">项目许可证类型</span> <span class="g-fw-500"
                            v-for="item in dialogRenderData?.project_license_data?.licenses" :key="item">{{ item
                            }}</span>
                        <span class="g-color-1 g-fw-500"
                            v-if="!dialogRenderData?.project_license_data?.licenses || !dialogRenderData?.project_license_data?.licenses?.length">未声明许可证</span>

                        <el-popover effect="light" trigger="click" v-if="dialogRenderData?.project_license_data?.licenses">
                            <template #default>
                                <div class="g-pr-8"
                                    style="width: 420px;height: 420px;overflow: auto;word-wrap: break-word;white-space: pre-wrap;">
                                    {{ dialogRenderData?.project_license_data?.license_file_text }}
                                </div>
                            </template>
                            <template #reference>
                                <span class="hover_btn1 g-p-4 g-bdr-2 g-fw-400 g-f-12 g-cursor-pointer g-color-5 g-ml-12">
                                    查看许可证声明内容
                                </span>
                            </template>
                        </el-popover>
                    </div>

                    <div class="g-f-14 g-color-1 g-mb-12" v-else-if="dialogRenderData?.project_licenses_data?.length">
                        <span class="g-color-3 g-fw-500">项目许可证类型</span> <span class="g-fw-500"
                            v-for="item in dialogRenderData?.project_licenses_data" :key="item">{{ item.license
                            }}</span>
                        <span class="g-color-1 g-fw-500"
                            v-if="!dialogRenderData?.project_licenses_data?.length">未声明许可证</span>

                        <el-popover effect="light" trigger="click" v-if="dialogRenderData?.project_licenses_data">
                            <template #default>
                                <div class="g-pr-8"
                                    style="width: 420px;height: 420px;overflow: auto;word-wrap: break-word;white-space: pre-wrap;">
                                    {{ dialogRenderData?.project_licenses_data[0]?.license_file_text || '-' }}
                                </div>
                            </template>
                            <template #reference>
                                <span class="hover_btn1 g-p-4 g-bdr-2 g-fw-400 g-f-12 g-cursor-pointer g-color-5 g-ml-12">
                                    查看许可证声明内容
                                </span>
                            </template>
                        </el-popover>
                    </div>
                </div>

                <!-- <div class="similer g-ta-center">
                    <div>
                        <div class="g-f-14 g-color-3 g-mb-8">代码相似度</div>
                        <div class="g-fw-600 g-f-18">{{ Math.round(dialogRenderData?.file_similarity * 100) }}%</div>
                    </div>
                </div> -->
            </div>

            <div class="g-flex g-bdr-4" style="height: calc(100vh - 230px);border: 1px solid #EFF0F1;">
                <div class="list g-mr-4 g-flex-grow-1" style="width: 0;">
                    <div class="g-f-18 g-border-box g-fw-500 g-bg-f7 g-p-16 g-flex g-justify-between">
                        <div>
                            溯源文件
                            <el-tooltip content="每种匹配方式（文件、代码）最多只展示 50 条数据" placement="top">
                                <i class="murphy icon-doc g-color-3"></i>
                            </el-tooltip>
                        </div>
                        <div class="g-flex">
                            <el-checkbox @change="changeCheck(fileCheck, 'fragmented')" v-model="fileCheck"
                                :disabled="!codeCheck" label="文件匹配" />
                            <el-checkbox @change="changeCheck(codeCheck, 'file')" v-model="codeCheck" :disabled="!fileCheck"
                                label="代码匹配" />
                        </div>
                    </div>
                    <!-- <div class="item g-bg-f7">
                        共 {{ Object.keys(dialogRenderData?.list)?.length }} 个相似代码片段
                    </div> -->
                    <div class="g-f-12 g-color-3 f-fw-400" style="padding: 12px 16px;">共 <span class="g-color-1 g-fw-600">{{
                        listData?.length }}</span> 条数据</div>

                    <div class="g-overflow-auto" style="height: 79%;">
                        <div @click="matchInfo = item; active = item.path + item.type; pageNum = 0"
                            :class="{ 'active-part': active === item.path + item.type }" v-for="(item, index) in listData"
                            :key="index" class="item g-flex g-align-center g-justify-between"
                            style="padding: 10px 16px;padding-right: 8px;">
                            <!-- <span class="line">{{ item.target_line_number_start }}-{{ item.target_line_number_end }}
                                行</span> -->
                            <el-tooltip :content="item.path" placement="top">
                                <span style="width: 85%;" class="ellipsis">
                                    {{ item.path }}
                                </span>
                            </el-tooltip>
                            <span v-if="item.type === 'file'" class="tag"
                                style="background-color: #4966E633;color: #2946C7;">文件</span>
                            <span v-if="item.type === 'fragmented'" class="tag"
                                style="background-color: #14c0ff33;color: #004761;">片段</span>
                        </div>
                    </div>
                </div>

                <div class="g-p-16 g-bg-f7 g-border-box g-flex-grow-1 g-bdr-4" style="height: 100%;width: 0;">
                    <div class="g-f-18 g-fw-500 g-mb-16 g-flex g-justify-between">
                        <div>
                            <span
                                style="display: inline-block;width: 2px;height: 16px;background-color: #6C87FF;margin-right: 4px;vertical-align: -1px;"></span>
                            匹配详情
                        </div>
                        <div v-if="matchInfo.type === 'fragmented'"
                            class="g-color-3 g-ml-16 g-cursor-pointer g-f-14 g-fw-400">
                            <i @click="pageNum = pageNum + 1 === 1 ? 0 : --pageNum;"
                                class="murphy icon-youjiantou11-copy g-f-18"></i>
                            <span class="g-vertical-2 g-ml-8 g-mr-8"><span class="g-color-1">{{ pageNum + 1 }}</span> / {{
                                matchInfo.fragments?.length }}</span>
                            <i @click="pageNum = pageNum + 1 === matchInfo.fragments?.length ? matchInfo.fragments?.length - 1 : ++pageNum;"
                                class="murphy icon-youjiantou11 g-f-18"></i>
                        </div>
                    </div>

                    <!-- 片段 -->
                    <div v-if="matchInfo.type === 'fragmented'" class="g-p-16 g-bg-ff g-bdr-6" style="height: 87%;">
                        <div class="g-f-14 g-fw-500 g-color-3 g-mb-8">
                            匹配开源文件
                            <a class="hover_text" target="_blank" v-if="dialogRenderData?.name.includes('/')"
                                :href="'https://github.com/' + dialogRenderData?.name + '/blob/' + dialogRenderData?.version + '/' + matchInfo.fragments[pageNum]?.target_path + '#L' + matchInfo.fragments[pageNum]?.target_line_begin">
                                {{ matchInfo.fragments[pageNum]?.target_path }}</a>
                            <span v-else>{{ matchInfo.fragments[pageNum]?.target_path }}</span>
                        </div>
                        <div class="g-f-14 g-fw-500 g-color-3 g-mb-8">
                            匹配文件行数
                            <span class="g-color-1">{{ matchInfo.fragments[pageNum].target_line_begin }} - {{
                                matchInfo.fragments[pageNum].target_line_end }}</span>
                        </div>
                        <div class="g-f-14 g-fw-500 g-mb-8">
                            <span class="g-color-3">文件许可证类型</span>&nbsp;
                            <span class="g-color-1" v-for="item in matchInfo.fragments[pageNum]?.target_license?.licenses"
                                :key="item"> {{
                                    item }}</span>
                            <span class="g-color-1"
                                v-if="!matchInfo.fragments[pageNum]?.target_license?.licenses || !matchInfo.fragments[pageNum]?.target_license?.licenses?.length">
                                未声明许可证</span>

                            <el-popover trigger="click" placement="right" effect="light"
                                v-if="matchInfo.fragments[pageNum]?.target_license?.license_text">
                                <template #default>
                                    <div
                                        style="width: 420px;height: 420px;overflow: auto;word-wrap: break-word;white-space: pre-wrap;">
                                        {{ matchInfo.fragments[pageNum]?.target_license?.license_text }}
                                    </div>
                                </template>
                                <template #reference>
                                    <span
                                        class="hover_btn1 g-p-4 g-fw-400 g-bdr-2 g-f-12 g-cursor-pointer g-color-5 g-ml-12">
                                        查看许可证声明内容
                                    </span>
                                </template>
                            </el-popover>
                        </div>

                        <div class="g-p-16 g-bg-f5 g-bdr-6 g-overflow-auto" style="height: 75%;">
                            <div class="g-mb-8">溯源文件行数 {{ matchInfo.fragments[pageNum].line_begin }} - {{
                                matchInfo.fragments[pageNum].line_end }}</div>
                            <highlightjs class="code-wrap" v-if="matchInfo.fragments[pageNum]?.target_code" autodetect
                                :code="matchInfo.fragments[pageNum]?.target_code" />
                        </div>
                    </div>

                    <!-- 文件 -->
                    <div v-if="matchInfo.type === 'file'" class="g-p-16 g-bg-ff g-bdr-6" style="height: 87%;">
                        <div class="g-f-14 g-fw-500 g-color-3 g-mb-8">
                            匹配开源文件
                            <a class="hover_text" target="_blank" v-if="dialogRenderData?.name.includes('/')"
                                :href="'https://github.com/' + dialogRenderData?.name + '/blob/' + dialogRenderData?.version + '/' + matchInfo?.target_path">
                                {{ matchInfo?.target_path }}</a>
                            <span v-else>{{ matchInfo?.target_path }}</span>
                        </div>
                        <div class="g-f-14 g-fw-500 g-mb-8">
                            <span class="g-color-3">文件许可证类型</span>&nbsp;
                            <span class="g-color-1" v-for="item in matchInfo?.target_license?.licenses" :key="item"> {{
                                item }}</span>
                            <span class="g-color-1"
                                v-if="!matchInfo?.target_license?.licenses || !matchInfo?.target_license?.licenses?.length">
                                未声明许可证</span>

                            <el-popover trigger="click" placement="right" effect="light"
                                v-if="matchInfo?.target_license?.license_text">
                                <template #default>
                                    <div
                                        style="width: 420px;height: 420px;overflow: auto;word-wrap: break-word;white-space: pre-wrap;">
                                        {{ matchInfo?.target_license?.license_text }}
                                    </div>
                                </template>
                                <template #reference>
                                    <span
                                        class="hover_btn1 g-p-4 g-fw-400 g-bdr-2 g-f-12 g-cursor-pointer g-color-5 g-ml-12">
                                        查看许可证声明内容
                                    </span>
                                </template>
                            </el-popover>
                        </div>
                    </div>

                    <NoData v-if="!Object.keys(matchInfo).length" description="点击左侧文件查看详情" />
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang='ts'>
import {
    ref,
} from 'vue';
import NoData from '@/components/NoData.vue';
// import { useRoute } from 'vue-router';
// import { getTranceSourceCodeApi } from 'api/project';

const fileCheck = ref<boolean>(true);
const codeCheck = ref<boolean>(true);
const active = ref<string>('');
const matchInfo = ref<any>({});
const pageNum = ref<number>(0);

const props = defineProps({
    dialogRenderData: {
        type: Object,
        default: () => ({}),
    },
});
const listData = ref<any[]>(props.dialogRenderData?.list);

// const getDetailInfo = async (item: any) => {

// const res = await getTranceSourceCodeApi({
//     project_id: route.params.tid,
//     subtask_id: route.params.sid,
//     target_file_path: item.target_file_path,
//     target_line_number_start: item.target_line_number_start,
//     target_line_number_end: item.target_line_number_end,
// });
// detailInfo.value = {
//     code: res.data?.target_code,
//     ...item,
// };
// };

const changeCheck = (value: boolean, type: string) => {
    if (!value) {
        listData.value = props.dialogRenderData?.cache.filter((item: any) => item.type === type);
    } else {
        listData.value = [...props.dialogRenderData.cache];
    }
};

</script>

<style scoped lang='less'>
.diff-content {
    padding: 0 120px;
    // padding-top: 24px;
    height: 100%;
    // overflow: auto;
    color: #3c3c3c;

    .list {
        .item {

            // &:hover:not(.item:nth-of-type(1)) {
            //     background: #EBEBEB;
            // }
            &:hover {
                background: #EBEBEB;
            }

            padding: 12px 16px;
            border-bottom: 1px solid #EFF0F1;
            cursor: pointer;

            .line {
                max-width: 56%;
                .ellipsis();
            }
        }

        .active-part.item {
            color: #6C87FF;
            background: linear-gradient(0deg, rgba(108, 135, 255, 0.10) 0%, rgba(108, 135, 255, 0.10) 100%), #FFF;
        }

        // border: 1px solid #EFF0F1;
        border-radius: 4px;
        height: 100%;
        // overflow: auto;
    }

    // .code {
    //     border-radius: 6px;
    //     border: 1px solid var(--005, #EBEBEB);
    //     height: 100%;

    //     .code-wrap {
    //         .ellipsis();
    //         overflow: auto;
    //         height: calc(100% - 86px);
    //     }
    // }

    .similer {
        height: 96px;
        width: 90px;
        border-radius: 6px;
        border: 1px solid var(--purple, #6C87FF);
        background: rgba(108, 135, 255, 0.10);
        padding: 8px;
        padding-top: 24px;
        box-sizing: border-box;
    }

    .code-wrap {
        width: 100%;
        overflow-x: auto;
    }
}
</style>

<style>
.el-popover {
    width: auto !important;
}
</style>
