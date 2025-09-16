<template>
    <el-dialog width="calc(100% - 80px)" align-center title="兼容性评估分析" @opened="openHandle">
        <div v-loading="loading" style="height: calc(100vh - 178px);" class="g-mt-24 overflow-auto">
            <div class="professor">
                <div class="title">
                    专家分析：从 {{ info.comp_version }} 版本升级至 {{ compatibleTargetVersion }} 版本
                    <span>
                        {{ !issuesData.length&&!releaseData.length&&!compData.length ? '暂未发现' : '可能存在' }}
                    </span>
                    兼容性风险
                </div>
                <div>
                    <!-- Release中{{ releaseData.length ? `涉及${releaseData.length}个` : '不涉及' }}兼容性风险<br /> -->
                    Issues中{{ issuesData.length ? `涉及${issuesData.length}个` : '暂未发现' }}兼容性风险<br />
                    项目中调用的组件方法{{ compData?.length ? `涉及${compData?.length}个` : '暂未发现' }}兼容性风险
                </div>
            </div>

            <el-tabs v-model="activeName">
                <el-tab-pane label="组件方法兼容性分析" name="1">
                    <div class="comp_item" v-for="(item, index) in compData" :key="index">
                        <div class="title">方法 {{ item.method_name }} 可能{{ item.diff_lines?.some((item:any) => item.code.includes('+++')) ? '存在变更' : '已被删除' }}</div>
                        <div class="code">
                            <div class="content" v-for="ele in item.diff_lines" :key="ele.code">
                                <div class="version">
                                    {{ ele.version }}
                                </div>
                                <div class="method">
                                    <highlightjs autodetect :code="ele.code" />
                                </div>
                            </div>
                        </div>
                        <div class="code_part" v-for="(ele) in item.code_fragment_list" :key="ele.file_path">
                            <div class="title">
                                <!-- <i class="murphy icon-arrow-right"></i> -->
                                <i class="murphy icon-arrow"></i>
                                {{ ele.file_path }}
                            </div>
                            <div class="code_content">
                                <div class="code_item" v-for="code in ele.source" :key="code.code">
                                    <span class="line">
                                        {{ code.line_number }}
                                    </span>
                                    <span class="code_wrap" v-if="compData.length">
                                        <highlightjs autodetect :code="code.code" />
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="text-sm mt-6 text-3c">
                            处置建议
                            <div class="mt-2 rounded-md bg-ff p-4">
                                {{ item.solution }}
                            </div>
                        </div>
                    </div>
                    <NoData v-if="!compData.length" description="暂未发现兼容性风险" />
                </el-tab-pane>

                <el-tab-pane label="Release兼容性分析" name="2">
                    <div class="release_item" v-for="(item, index) in releaseData" :key="index">
                        <div class="title" @click="item.isExpand = !item.isExpand">
                            <i class="murphy icon-arrow-right" v-if="!item.isExpand"></i>
                            <i class="murphy icon-arrow" v-else></i>
                            <a :href="item.url" target="_blank" @click.stop>{{ info.comp_name }} {{ item.version }}
                                Release</a>
                        </div>
                        <div class="content" v-if="item.isExpand">
                            <pre>
                                {{ item.body }}
                            </pre>
                        </div>
                    </div>
                    <NoData v-if="!releaseData.length" description="暂未发现兼容性风险" />
                </el-tab-pane>

                <el-tab-pane label="Issues兼容性分析" name="3">
                    <div class="issues" v-if="issuesData.length">
                        <div class="title" v-if="issuesData && issuesData.length">
                            版本区间【{{ info.comp_version }} - {{ compatibleTargetVersion }}】 组件{{ info.comp_name }}
                        </div>
                        <el-table :data="issuesData"
                                  :header-cell-style="{ padding: '8px 0', border: 'none', background: '#EBEBEB80', color: '#8F959E', fontWeight: 500 }"
                                  style="width: 100%">
                            <el-table-column label="版本" prop="version" width="160" />
                            <el-table-column label="issues标题">
                                <template #default="scope">
                                    <a :href="scope.row.url" target="_blank">{{ scope.row.title }}</a>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <NoData v-if="!issuesData.length" description="暂未发现兼容性风险" />
                </el-tab-pane>
            </el-tabs>
        </div>
    </el-dialog>
</template>

<script setup lang='ts'>
import { ref, nextTick } from 'vue';
import { getReleaseApi, getIssueApi, getCompApi } from 'api/project';
import NoData from 'comp/NoData.vue';

const props = defineProps(['info', 'compatibleTargetVersion', 'sid', 'tid']);
const activeName = ref<string>('1');
const issuesData = ref<Array<any>>([]);
const releaseData = ref<Array<any>>([]);
const compData = ref<Array<any>>([]);
const loading = ref<boolean>(false);

const openHandle = async () => {
    loading.value = true;
    try {
        const res = await getCompApi({
            ...props.info,
            project_id: props.tid,
            subtask_id: props.sid,
            compatibleTargetVersion: props.compatibleTargetVersion,
        });
        compData.value = res.data?.version_compat_list;
    } catch (error) {
        console.log(error);
    }
    try {
        const res = await getReleaseApi({
            ...props.info,
            compatibleTargetVersion: props.compatibleTargetVersion,
        });
        releaseData.value = res.data.map((item: any, index: number) => {
            item.isExpand = false;
            if (index === 0) item.isExpand = true;
            return item;
        });
    } catch (error) {
        console.log(error);
    }

    try {
        const res = await getIssueApi({
            ...props.info,
            compatibleTargetVersion: props.compatibleTargetVersion,
        });
        issuesData.value = res.data;
    } catch (error) {
        console.log(error);
    }
    nextTick(() => {
        loading.value = false;
    });
};
</script>

<style lang='less' scoped>
.professor {
    background: #F7F8FB;
    border-radius: 6px;
    padding: 24px;
    font-size: 14px;
    color: #858585;
    line-height: 24px;
    margin-bottom: 16px;

    .title {
        color: @text-color;
        margin-bottom: 8px;
        font-weight: 500;
    }
}

.comp_item {
    background: #F7F8FB;
    border-radius: 4px;
    padding: 16px;
    margin-bottom: 16px;

    .title {
        color: @text-color;
        margin-bottom: 8px;
        font-weight: 500;
    }

    .code_part {
        margin-bottom: 10px;

        .title {
            font-size: 12px;
            color: @text-color;
            border-radius: 6px;
            padding: 16px;
            cursor: pointer;
            margin-bottom: 0;
            background-color: #fff;

            i {
                font-size: 12px;
                color: #525252;
                margin-right: 4px;
            }
        }

        .code_content {
            line-height: 32px;
            background-color: #eaf7ff;
        }

        .line {
            width: 80px;
            height: 100%;
            font-size: 14px;
            text-align: center;
            color: #8F959E;
            box-sizing: border-box;
        }

        .code_item {
            display: flex;
            align-items: center;
        }

        .code_wrap {
            flex: 1;
            width: 0;
            white-space: pre-wrap;
        }
    }

    .code {
        background: #FFFFFF;
        border-radius: 6px;
        padding: 16px;
        margin-bottom: 10px;
    }

    .content {
        .center();
        font-size: 12px;
        margin-bottom: 12px;
        background-color: #6C87FF1A;

        .version {
            width: 56px;
            height: 100%;
            text-align: center;
            padding: 6px;
        }

        .method {
            flex: 1;
            line-height: 24px;
            box-sizing: border-box;
        }
    }
}

.release_item {
    margin-bottom: 16px;

    .title {
        font-size: 12px;
        color: @text-color;
        background: #F7F8FB;
        border-radius: 6px;
        padding: 16px;
        cursor: pointer;

        i {
            font-size: 12px;
            color: #525252;
            margin-right: 4px;
        }
    }

    a {
        &:hover {
            color: #6C87FF;
            text-decoration: underline;
        }

        color: @text-color;
    }

    .content {
        padding: 16px;
    }
}

.issues {
    border-radius: 4px;
    background-color: #F7F8FB;
    padding: 16px;

    .title {
        color: @text-color;
        margin-bottom: 16px;
        font-weight: 500;
    }
}
</style>
