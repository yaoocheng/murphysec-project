<template>
    <el-dialog class="screen-dialog no-padding" width="100%">
        <div class="bg-ff px-[120px] pt-8">
            <div class="flex items-center font-medium text-2xl mb-6">
                <span :style="{ backgroundColor: licenseCopyrightLevel[modalInfo.key].riskColor }"
                      class="mr-2 w-[44px] h-[38px] text-ff rounded-md text-[20px] flex items-center justify-center">{{
                          licenseCopyrightLevel[modalInfo.key].riskLevel }}</span>
                {{ licenseCopyrightLevel[modalInfo.key].riskTitle }}
            </div>

            <div class="py-3 px-4 bg-f7 rounded-md text-sm flex items-center justify-between mb-3">
                <div class="text-3c leading-6">
                    {{ licenseCopyrightLevel[modalInfo.key].riskDescription }}
                </div>
                <!-- <div class="button-text-blue ml-4" @click="riskDescModal = true">
                    查看风险描述
                </div> -->
            </div>

            <!-- <el-dialog v-model="riskDescModal" title="风险描述" width="840px">
                <div class="text-3c text-sm mt-6">
                    <div class="mb-3">{{ licenseCopyrightLevel[modalInfo.key].riskDescription }}</div>
                    <div v-for="(item, index) in licenseCopyrightLevel[modalInfo.key].riskItems" :key="index"
                         class="mb-3">
                        <div class="mb-1 font-medium">{{ item.split('：')[0] }}：</div>
                        <div>{{ item.split('：')[1] }}</div>
                    </div>
                </div>
            </el-dialog> -->
        </div>

        <el-tabs v-model="activeName" class="lic-tab">
            <el-tab-pane label="风险文件" name="first">
                <div class="h-[calc(100vh-300px)] flex gap-1.5 border border-solid rounded-md border-[#EBEBEB]">
                    <div v-loading="loading" class="w-[280px] bg-ff rounded-md h-full">
                        <div class="h-12 flex items-center pl-4 font-medium" style="border-bottom: 1px solid #f7f8fb;">
                            风险文件
                        </div>
                        <div class="px-4 py-2 h-full">
                            <SearchComp v-model="searchKeyword" class="mb-2" placeholder="请搜索风险文件" clearable
                                        style="width: 100%;" />
                            <div v-if="riskFiles.length" class="g-color-3 g-fw-400 g-f-14 g-mb-8">
                                共 <span class="g-color-1 g-fw-500">{{ filteredFiles.length }}</span> 条数据
                            </div>

                            <div class="h-[calc(100%-140px)] overflow-auto">
                                <div v-for="file in filteredFiles" :key="file.id" :class="['rounded hover:bg-[#f2f2f2] cursor-pointer p-2 h-10 mb-1 box-border flex items-center',
                                                                                           { 'bg-[#f2f2f2]': selectedFile?.id === file.id }]"
                                     @click="handleSelectFile(file)">
                                    <Tooltip :content="file.file_path" width="370">
                                        <div class="ellipsis">
                                            {{ file.file_path }}
                                        </div>
                                    </Tooltip>
                                </div>
                                <NoData :image-size="100" v-if="!loading && !filteredFiles.length" />
                            </div>
                        </div>
                    </div>

                    <!-- 风险文件详情 -->
                    <div v-loading="codeLoading" class="flex-1 w-0 bg-ff rounded-md p-4 h-full box-border">
                        <div class="mb-3">
                            <div class="mb-1 font-medium">文件 {{ selectedFile.file_path?.split('/').pop() }} 的风险详情</div>
                            <div class="text-xs text-85">
                                <span class="mr-4">匹配类型：{{ selectedFile.data_type === 'file' ? '文件匹配' : '片段匹配' }}</span>
                                <span>文件相似度：{{ (selectedFile.similarity * 100).toFixed(2) }}%</span>
                            </div>
                        </div>

                        <div class="flex h-[calc(100%-52px)] gap-2">
                            <!-- 左 -->
                            <div class="rounded-md p-4 h-full bg-f7 flex-1 w-0 box-border">
                                <div class="w-full ellipsis mb-2 font-medium">项目文件名称 {{
                                    selectedFile.file_path?.split('/').pop() }}</div>
                                <div class="p-4 rounded-md bg-ff h-[calc(100%-60px)]">
                                    <div v-if="licenseCopyrightLevel[modalInfo.key].showType === 'license'"
                                         class="mb-3">
                                        许可证：{{ userCodeInfo.source_file_license?.spdx_list?.[0] || "暂未识别到许可证声明" }}</div>
                                    <div class="mb-3" v-else>版权声明内容：{{ userCodeInfo.source_file_copyright?.[0]?.text || "暂未识别到版权声明" }}
                                    </div>

                                    <div class="mb-2">文件相关片段</div>
                                    <div class="rounded-lg p-4 bg-f7 max-h-[calc(100%-88px)] overflow-auto">
                                        <pre>{{ userCodeInfo.code }}</pre>
                                    </div>
                                </div>
                            </div>

                            <!-- 右 -->
                            <div class="flex-1 w-0 h-full" v-if="modalInfo.key !== 'sources_not_copyright'">
                                <!-- item -->
                                <div class="p-4 rounded-md bg-f7 h-full box-border">
                                    <!-- title -->
                                    <div class="flex items-center mb-2">
                                        <!-- <span class="w-4 mr-2 cursor-pointer">
                                            <ExpandIcon :expand="true" type="r" />
                                        </span> -->
                                        <div class="flex-1 w-0">
                                            <div class="text-sm text-3c mb-2  flex items-center gap-1 font-medium">
                                                匹配开源文件 <a class="hover_text flex-1 ellipsis" target="_blank"
                                                          :href="'https://github.com/' + targetCodeInfo?.target_project_name + '/blob/' + targetCodeInfo?.tag + '/' + targetCodeInfo?.path">
                                                    {{ targetCodeInfo.path?.split('/')?.pop() }}
                                                </a>
                                            </div>

                                            <div class="text-[#8F959E] text-xs flex items-center w-full gap-4">
                                                <span class="flex-[2]  flex items-center gap-1">
                                                    开源项目
                                                    <Tooltip placement="top" :content="targetCodeInfo.path?.split('/').pop()" width="370">
                                                        <span class="text-sm text-3c flex-1 ellipsis">{{ targetCodeInfo.path?.split('/').pop()
                                                        }}</span>
                                                    </Tooltip>
                                                </span>
                                                <span class="flex-1 ellipsis flex items-center gap-1">
                                                    版本
                                                    <Tooltip placement="top" :content="targetCodeInfo.tag" width="370">
                                                        <span class="text-sm text-3c flex-1 ellipsis">{{ targetCodeInfo.tag }}</span>
                                                    </Tooltip>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- code -->
                                    <div class="p-4 rounded-md bg-ff h-[calc(100%-88px)] overflow-y-auto">
                                        <div v-if="licenseCopyrightLevel[modalInfo.key].showType === 'license'"
                                             class="mb-3">许可证：{{ targetCodeInfo.target_license?.[0]?.spdx_id ||
                                                 '暂未识别到许可证声明' }}</div>
                                        <div class="mb-3" v-else>版权声明内容：{{
                                            targetCodeInfo.target_file_copyright?.[0]?.text || '暂未识别到版权声明' }}</div>

                                        <div v-if="licenseCopyrightLevel[modalInfo.key].showType === 'license'">
                                            <div class="mb-2">许可证声明内容</div>
                                            <div class="rounded-lg p-4 bg-f7 mb-3 overflow-auto">
                                                <pre>{{ targetCodeInfo.licenseCode }}</pre>
                                                <NoData description="暂未获取到许可证声明" v-if="!targetCodeInfo.licenseCode" />
                                            </div>
                                        </div>

                                        <div class="mb-2">匹配开源文件原始内容</div>
                                        <div class="rounded-lg p-4 bg-f7 overflow-auto">
                                            <pre>{{ targetCodeInfo.fileCode }}</pre>
                                            <NoData description="暂未获取到文件内容" v-if="!targetCodeInfo.fileCode" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </el-tab-pane>

            <el-tab-pane label="处置建议" name="second">
                <div class="h-[calc(100vh-320px)] bg-ff px-4 py-5 box-border rounded-md">
                    <div class="text-3c">
                        <div v-for="(solution, index) in licenseCopyrightLevel[modalInfo.key].solutions" :key="index"
                             class="mb-6">
                            <div class="flex items-center mb-2">
                                <div class="font-medium">{{ index + 1 }}. {{ solution.title }}</div>
                            </div>
                            <div class="text-sm">
                                <div v-for="(step, stepIndex) in solution.steps" :key="stepIndex"
                                     :class="{ 'mb-1.5': stepIndex !== solution.steps.length - 1 }">
                                    • {{ step }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </el-dialog>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import store from 'util/store';
import { ref, onBeforeMount, computed } from 'vue';
import { getProjectFileCodeApi, getFileLicenseTxtApi, getOpenProCodeApi } from 'api/detail';
import { getLicenseComplianceSourceFilesApi, getLicenseComplianceSourceFileInfoApi, getOpenLicenseComplianceSourceFileInfoApi } from 'api/project';
import { licenseCopyrightLevel } from '../../constants/constants';
import SearchComp from '@/components/SearchComp.vue';

const props = defineProps({
    modalInfo: {
        type: Object,
        default: () => ({}),
    },
});
const route = useRoute();
const activeName = ref('first');
const loading = ref(false);

const riskFiles = ref<any[]>([]);
const selectedFile = ref<any>({});
const searchKeyword = ref('');
const userCodeInfo = ref<any>({});
const targetCodeInfo = ref<any>({});
const codeLoading = ref(false);

// 获取风险文件列表
const getRiskFiles = async () => {
    try {
        loading.value = true;
        codeLoading.value = true;
        const { data } = await getLicenseComplianceSourceFilesApi({
            project_id: route.params.tid as string,
            subtask_id: route.params.sid as string,
            source_file_ids: props.modalInfo.source_file_ids,
        });
        riskFiles.value = data.list || [];
        // eslint-disable-next-line no-use-before-define
        handleSelectFile(riskFiles.value?.[0] || {});
    } catch (error) {
        console.error('获取风险文件列表失败:', error);
    } finally {
        loading.value = false;
    }
};

// 选中文件
const handleSelectFile = async (file: any) => {
    try {
        const params = {
            project_id: route.params.tid as string,
            subtask_id: route.params.sid as string,
            source_id: file.id,
            data_type: file.data_type,
            source_file_id: file.file_id,
            exist_file_copyright: file.exist_file_copyright,
            compliance_type: props.modalInfo.key,
        };
        selectedFile.value = file;
        codeLoading.value = true;
        // 获取用户文件信息
        const { data } = await getLicenseComplianceSourceFileInfoApi(params);
        userCodeInfo.value = data;

        // 获取用户文件代码
        const { data: data1 } = await getProjectFileCodeApi({
            project_id: route.params.tid,
            subtask_id: route.params.sid,
            source_file_id: file.file_id,
        });
        userCodeInfo.value.code = data1.source_text;

        // 获取开源文件信息
        const { data: data2 } = await getOpenLicenseComplianceSourceFileInfoApi(params);
        targetCodeInfo.value = data2;

        // 获取开源文件许可证代码
        const { data: data3 } = await getFileLicenseTxtApi({
            project_id: route.params.tid,
            subtask_id: route.params.sid,
            target_project_id: targetCodeInfo.value?.target_project_id,
            text_index: targetCodeInfo.value?.target_license?.[0]?.text_index,
        });
        targetCodeInfo.value.licenseCode = data3.license_text;

        // 获取开源文件代码
        const { data: data4 } = await getOpenProCodeApi(targetCodeInfo.value?.file_sha256, store.conf.storage_domain);
        targetCodeInfo.value.fileCode = data4;
    } catch (error) {
        console.error('获取用户文件信息失败:', error);
    } finally {
        codeLoading.value = false;
    }
};

// 过滤后的文件列表
const filteredFiles = computed(() => {
    if (!searchKeyword.value) return riskFiles.value;
    return riskFiles.value.filter((file) => file.file_path.toLowerCase().includes(searchKeyword.value.toLowerCase()));
});

onBeforeMount(() => {
    getRiskFiles();
});
</script>

<style lang="less">
.no-padding.screen-dialog {
    padding: 0 !important;
}

.lic-tab {
    .el-tabs__header {
        padding: 0 120px;
        margin-bottom: 0;
    }

    .el-tabs__nav-wrap::after {
        display: none;
    }
}

.lic-tab .el-tabs__content {
    padding: 0 120px;
    padding-top: 16px;
    background-color: #F7F8FB;
    height: calc(100vh - 264px);
}
</style>
