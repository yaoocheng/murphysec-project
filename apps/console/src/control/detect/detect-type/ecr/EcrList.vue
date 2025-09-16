<template>
    <div class="g-bdr-6 g-bg-f7 g-p-16">
        <div class="g-flex-between">
            <div class="g-flex g-align-center">
                <el-select class="mr-2" style="width: 180px" :disabled="refreshLoading"
                           v-model="detectInfo.team_config_id" @change="changeTeamIdHandle">
                    <el-option
                        v-for="item in store.allAccessInfo.ecr.map((e: any) => ({ value: e.config_id, label: e.config_name }))"
                        :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
                <el-select v-model="reqData.region_name"
                           @change="resetData(); getEcrRepoListData()"
                           class="w-[180px]">
                    <el-option-group v-for="group in regionOptions" :key="group.region_cate_zh"
                                     :label="group.region_cate_zh">
                        <el-option v-for="item in group.list" :key="item.region_name" :label="item.region_name_zh"
                                   :value="item.region_name">
                            <span class="pl-3">{{ item.region_name_zh }}</span>
                        </el-option>
                    </el-option-group>
                </el-select>
                <SelectComp class="ml-2" style="width: 180px"
                            @change="resetData();getEcrRepoListData()"
                            v-model="reqData.is_public" :options="repoTypesOptions" placeholder="请选择仓库类型" />
            </div>
        </div>

        <div class="g-bg-ff g-bdr-6 g-mt-16">
            <div class="project-content g-flex">
                <!-- 仓库列表 -->
                <div class="part g-f-15" style="padding: 0;">
                    <div style="border-bottom: 1px solid #EBEBEB;"
                         class="g-pb-12 g-mb-12 g-flex g-justify-between g-pl-16 g-pr-16 g-pt-16">
                        <span class="g-color-1 g-fw-500">仓库列表</span>
                    </div>

                    <SearchComp @change="resetData();getEcrRepoListData()"
                                style="width: 220px;margin-left: 16px;margin-right: 0;margin-bottom: 16px;"
                                placeholder="输入完整仓库名称回车搜索" v-model="reqData.keyword" clearable />

                    <div class="w-full h-[76%] px-4 box-border" style="overflow: auto;">
                        <div :class="{ 'activeRepo': activeRepo === index }"
                             @click="activeRepo = index; repoInfo = item; listData = []; versionListNextToken = ''; getRepoVersionList()"
                             class="rounded-md p-4 py-3 border-solid border border-[#99999938] text-sm mb-2 cursor-pointer ellipsis hover:bg-[#f2f2f2]"
                             v-for="(item, index) in repoList" :key="item.repository_name">
                            {{ item.repository_name }}
                        </div>
                        <div v-if="reqData.next_token" @click="getEcrRepoListData"
                             class="button-text-blue text-sm translate-x-[66%] mb-3">
                            点击加载更多
                        </div>
                        <NoData :image-size="80" v-if="!repoList.length" />
                    </div>
                </div>

                <div class="g-flex-grow-1 flex gap-2 g-p-12">
                    <div class="g-flex-grow-1 w-0">
                        <div v-if="repoInfo">
                            <div class="g-color-1 g-fw-500 g-mb-16">
                                仓库信息
                            </div>
                            <div class="g-p-16 g-bg-f7 g-bdr-6 g-mb-16">
                                <div class="g-color-1 g-mb-8">
                                    {{ repoInfo?.repository_name }}
                                </div>
                                <div class="g-flex items-center gap-6 g-fw-400 g-color-1">
                                    <span class="flex items-center flex-1 w-0">
                                        <span class="ellipsis">URL：{{ repoInfo?.repository_uri }}</span>
                                        <!-- <a class="hover_text text-3c" :href="repoInfo?.repository_uri" target="_blank">{{ repoInfo?.repository_uri }}</a> -->
                                        <span class="button-text-blue ml-1">
                                            <i class="murphy icon-fuzhi1" id="copy_repoInfo_url"
                                               :data-clipboard-text="repoInfo?.repository_uri"
                                               @click="copyFunc('#copy_repoInfo_url')"></i>
                                        </span>
                                    </span>
                                    <span>创建时间：{{ formatDate(repoInfo?.created_at) }}</span>
                                </div>
                            </div>
                        </div>

                        <div v-if="listData.length">
                            <div class="g-fw-500 g-color-1 g-f-14 g-mb-12">
                                镜像列表（{{listData.length}}）
                            </div>

                            <div class="g-flex">
                                <div class="g-flex-grow-1 w-0 g-mr-16">
                                    <el-table ref="tableRef" height="280" row-key="uri" :cell-style="{ height: '48px' }"
                                              :data="listData" @select="checkData" @select-all="checkAll"
                                              :header-cell-style="{ padding: '15px 0', border: 'none', background: '#F7F8FB', color: '#8F959E', fontWeight: 500 }">
                                        <el-table-column type="selection" width="30" />
                                        <el-table-column min-width="100" label="版本">
                                            <template #default="{ row }">
                                                {{ row.image_tag }}
                                            </template>
                                        </el-table-column>

                                        <el-table-column min-width="240" label="哈希">
                                            <template #default="{ row }">
                                                <Tooltip :content="row.image_digest" placement="top" width="370">
                                                    <div class="w-full ellipsis">{{ row.image_digest }}</div>
                                                </Tooltip>
                                            </template>
                                        </el-table-column>

                                        <el-table-column min-width="240" label="镜像URL">
                                            <template #default="{ row }">
                                                <!-- <Tooltip :content="row.uri" placement="top" width="370">
                                                    <div class="w-full ellipsis">{{ row.uri }}</div>
                                                </Tooltip> -->
                                                <el-tooltip placement="top">
                                                    <template #content>
                                                        <div class="break-all" style="max-width: 370px;">
                                                            点击复制
                                                        </div>
                                                    </template>

                                                    <div class="w-full ellipsis cursor-pointer" id="uri"
                                                         :data-clipboard-text="row.uri"
                                                         @click="copyFunc(`#uri`)">{{ row.uri }}</div>
                                                </el-tooltip>
                                            </template>
                                        </el-table-column>

                                        <template #append>
                                            <div class="flex justify-center my-3">
                                                <div v-if="versionListNextToken" @click="getRepoVersionList"
                                                     class="button-text-blue text-sm">
                                                    点击加载更多
                                                </div>
                                            </div>
                                        </template>
                                    </el-table>
                                </div>
                            </div>
                        </div>

                        <div v-else class="mt-[8%]">
                            <NoData />
                            <p class="text-center mt-[-8px]" v-if="!repoInfo">请点击左侧仓库列表，选择镜像进行检测</p>
                        </div>
                    </div>

                    <div class="g-flex-grow-1 w-0 overflow-auto pl-2" style="border-left: 1px solid #EBEBEB;"
                         v-show="selectedData.length">
                        <div class="g-color-3 g-fw-500 g-mb-16">
                            已选镜像（{{ selectedData.length }}）
                        </div>

                        <el-table height="400" row-key="uri" :cell-style="{ height: '48px' }" :data="selectedData"
                                  @select="checkData"
                                  :header-cell-style="{ padding: '15px 0', border: 'none', background: '#F7F8FB', color: '#8F959E', fontWeight: 500 }">
                            <el-table-column min-width="100" label="版本">
                                <template #default="{ row }">
                                    {{ row.image_tag }}
                                </template>
                            </el-table-column>

                            <el-table-column min-width="240" label="哈希">
                                <template #default="{ row }">
                                    <Tooltip :content="row.image_digest" placement="top" width="370">
                                        <div class="w-full ellipsis">{{ row.image_digest }}</div>
                                    </Tooltip>
                                </template>
                            </el-table-column>

                            <el-table-column min-width="240" label="镜像URL">
                                <template #default="{ row }">
                                    <Tooltip :content="row.uri" placement="top" width="370">
                                        <div class="w-full ellipsis">{{ row.uri }}</div>
                                    </Tooltip>
                                </template>
                            </el-table-column>

                            <el-table-column width="50" fixed="right" label="操作">
                                <template #default="{ row }">
                                    <span class="text-err cursor-pointer" @click.stop="clearCheck(row)">删除</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, onBeforeMount, nextTick } from 'vue';
import store, { detectInfo } from 'util/store';
import {
    getEcrRepositoryListApi, getEcrRegionApi, getEcrVersionListApi,
} from 'api/detect';
import { refreshLoading } from 'util/hook';
// import { useRoute } from 'vue-router';
import { listData, selectedData } from '../../hooks/hook';
import SelectComp from '@/components/SelectComp.vue';
import { formatDate, copyFunc } from '@/utils/tools';

const tableRef = ref();
const regionOptions = ref<any[]>([]);
const repoList = ref<any[]>([]);
const activeRepo = ref(-1);
const repoInfo = ref<any>();
const repoTypesOptions = ([
    {
        label: '私有仓库',
        value: false,
    },
    {
        label: '公有仓库',
        value: true,
    },
]);

// 列表请求参数
const reqData = ref<any>({
    next_token: '',
    keyword: undefined,
    region_name: undefined,
    is_public: false,
    team_id: store.teamInfo.team_id,
    team_config_id: detectInfo.team_config_id,
});

onBeforeMount(async () => {
    listData.value = [];
    selectedData.value = [];
    const { data } = await getEcrRegionApi({
        team_config_id: detectInfo.team_config_id,
        team_id: store.teamInfo.team_id,
    });
    regionOptions.value = data.list || [];

    // 设置默认选中第一个地区
    if (regionOptions.value.length > 0 && regionOptions.value[0].list && regionOptions.value[0].list.length > 0) {
        reqData.value.region_name = regionOptions.value[0].list[0].region_name;
        // reqData.value.region_name = 'ap-southeast-2';
    }

    // eslint-disable-next-line no-use-before-define
    getEcrRepoListData();
});

const resetData = () => {
    listData.value = [];
    repoList.value = [];
    repoInfo.value = null;
    activeRepo.value = -1;
    // eslint-disable-next-line no-use-before-define
    versionListNextToken.value = '';
    reqData.value.next_token = '';
};

// 选择配置ID
const changeTeamIdHandle = (value: string) => {
    detectInfo.team_config_id = value || detectInfo.team_config_id;
    selectedData.value = [];
    resetData();
    // eslint-disable-next-line no-use-before-define
    getEcrRepoListData();
};

// 列表
const getEcrRepoListData = async () => {
    try {
        const { data } = await getEcrRepositoryListApi(reqData.value);
        repoList.value.push(...data.list || []);
        reqData.value.next_token = data.next_token;
    } catch (error) {
        console.log(error);
    }
};

const versionListNextToken = ref('');
const getRepoVersionList = async () => {
    try {
        const { data } = await getEcrVersionListApi({
            team_config_id: detectInfo.team_config_id,
            team_id: store.teamInfo.team_id,
            ...repoInfo.value,
            next_token: versionListNextToken.value,
        });
        listData.value.push(...data.list || []);
        versionListNextToken.value = data.next_token;

        // 自动选中已选择的数据
        nextTick(() => {
            data.list?.forEach((row:any) => {
                if (selectedData.value.some((selected) => selected.uri === row.uri)) {
                    tableRef.value?.toggleRowSelection(row, true);
                }
            });
        });
    } catch (error) {
        console.log(error);
    }
};

const checkAll = (data: any) => {
    if (data.length) {
        const newRecords = data.filter((record: any) => !selectedData.value.some((selected: any) => selected.uri === record.uri));
        selectedData.value = [...selectedData.value, ...newRecords];
        repoInfo.value.oldCheckAllData = data;
    } else {
        // 取消全选时从selectedData中移除之前选中的数据
        selectedData.value = selectedData.value.filter((selected: any) => !repoInfo.value.oldCheckAllData?.some((item: any) => item.uri === selected.uri));
        repoInfo.value.oldCheckAllData = [];
    }
};

const checkData = (data: any, row: any) => {
    const isSelected = data.some((item: any) => item.uri === row.uri);
    if (isSelected) {
        // 对数据进行去重处理
        const newRecords = data.filter((record: any) => !selectedData.value.some((selected: any) => selected.uri === record.uri));
        selectedData.value = [...selectedData.value, ...newRecords];
    } else {
        // 取消选择时从selectedData中移除
        selectedData.value = selectedData.value.filter((selected: any) => row.uri !== selected.uri);
    }
};

// 清除
const clearCheck = (row: any) => {
    tableRef.value?.toggleRowSelection(row, false);
    selectedData.value = selectedData.value.filter((ele) => ele.uri !== row.uri);
};
</script>

<style lang="less">
.project-content {
    .el-tree-node__content {
        display: inline-block !important;
        padding-right: 16px;
    }

    .el-tree-node__children {
        overflow: initial !important;
    }
}
</style>

<style scoped lang='less'>
.project-content {
    margin-top: 8px;
    color: #858585;
    border-radius: 6px;
    height: 58vh;

    .activeRepo {
        background-color: #6c87ff25;
    }

    .part {
        width: 22%;
        overflow: auto;
        box-sizing: border-box;
        padding: 12px;
        background-color: #fff;
        position: relative;

        .all-check {
            // position: absolute;
            // bottom: 0;
            // left: 0;
            padding: 0 16px;
            width: 100%;
            z-index: 99;
            background-color: #fff;
            box-sizing: border-box
        }

        .node-name {
            display: inline-block;
            width: 122px;
            margin-left: 4px;
            margin-right: 12px;
            .ellipsis();
        }

        &:nth-of-type(1) {
            border-right: 1px solid #F7F8FB;
            // background-color: #F7F8FB;
        }

        &:nth-of-type(2) {
            flex: 1;
            // background-color: #F7F8FB;
        }

        &:nth-of-type(3) {
            flex: 1;
            // background-color: #F7F8FB;

        }
    }
}

.more {
    &:hover {
        color: #6C87FF;
    }

    color: #858585;
    height: 46px;
    line-height: 46px;
    cursor: pointer;
    text-align: center
}

.icon {
    &:hover {
        background: #EBEBEB;
    }

    color: #3c3c3c;
    margin-right: 8px;
    padding: 7px;
    border-radius: 6px;
    cursor: pointer;
}

.project_item {
    &:hover .clear {
        opacity: 1;
    }

    .between();
    height: 48px;
    background: #FFFFFF;
    // border: 1px solid #C7C7C7;
    // border-radius: 6px;
    padding: 0 16px;
    position: relative;
    cursor: pointer;
    color: #3c3c3c;
    border-bottom: 1px solid #EFF0F1;

    .clear {
        opacity: 0;
        transition: opacity .1s linear;
        font-size: 13px;
        position: absolute;
        right: -6px;
        top: -6px;
    }

    .name {
        margin: 0 16px;
        margin-right: 0;
        .ellipsis();
    }

    .lang {
        font-size: 12px;
        background: rgba(108, 135, 255, 0.2);
        border-radius: 4px;
        padding: 3px 5px;
        color: #2946C7;
    }
}

.project_item.active_item {
    // background: rgba(108, 135, 255, 0.1);
    // border: 1px solid #6C87FF;
}
</style>
