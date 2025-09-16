<template>
    <div class="g-bdr-6 g-bg-f7 g-p-16">
        <div class="g-flex-between">
            <div class="g-flex g-align-center">
                <div class="g-mr-8">
                    <el-select style="width: 240px" :disabled="refreshLoading" v-model="detectInfo.team_config_id"
                               @change="changeTeamIdHandle">
                        <el-option
                            v-for="item in store.allAccessInfo.ezone_package.map((e: any) => ({ value: e.config_id, label: e.config_name }))"
                            :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </div>
                <!-- <SearchComp @change="searchList" placeholder="输入制品名称回车搜索" v-model="keyword" @clear="handleClear"
                            clearable /> -->
            </div>
        </div>

        <div class="g-bg-ff g-bdr-6 g-mt-16">
            <div class="project-content g-flex">
                <div class="part g-f-15" style="padding: 0;">
                    <div style="border-bottom: 1px solid #EBEBEB;"
                         class="g-pb-12 g-flex g-justify-between g-pl-16 g-pr-16 g-pt-16">
                        <span class="g-color-1 g-fw-500">仓库列表</span>
                    </div>

                    <div class="h-[86%] p-2 box-border" style="overflow: auto;">
                        <div @click="repoItemClick(item)"
                             :class="`${item.repoId === filterOptions.repo_id ? 'bg-[#6c87ff1a]' : 'hover:bg-gray-100'}`"
                             class="flex items-center rounded px-2 py-2  cursor-pointer"
                             v-for="(item, index) in repoList" :key="index">
                            <img class="g-vertical--1" src="~ast/img/dir-icon.png" alt="">
                            <Tooltip width="370" :content="`${item.repoName}`">
                                <span :class="`${item.repoId === filterOptions.repo_id ? 'text-primary' : 'text-3c'}`"
                                      class="node-name text-sm">{{ item.repoName }}
                                </span>
                            </Tooltip>
                            <TagComp class="g-ml-4" :content="getRepoFormatText(item.repoType)" />
                            <TagComp class="g-ml-4" :content="getRepoFormatText(item.repoFormat)" />
                        </div>
                    </div>
                </div>

                <div v-if="packageList.length" class="g-flex-grow-1 g-p-12 overflow-auto h-full">
                    <div class="text-3c text-sm font-medium mb-4">
                        制品列表（{{ packageTotal }}）
                    </div>
                    <div class="h-[calc(100%-120px)]">
                        <TableComp height="100%" :data="packageList" @expand-change="handleExpandChange"
                                   row-key="pkgId">
                            <el-table-column type="expand">
                                <template #default="props">
                                    <div>
                                        <el-table :data="props.row.versions" :ref="(el:any)=>tableRefs[props.row.pkgId]=el" @select-all="(selection: any) => selectAllVersion(selection, props.row.versions, props.row)"
                                                  :cell-style="{ padding: '10px 0', color: '#3c3c3c' }"
                                                  :header-cell-style="{ padding: '12px 0', border: 'none', background: '#F7F8FB', color: '#8F959E', fontWeight: 400 }"
                                                  @select="(selection: any, currentRow: any) => selectVersion(selection, currentRow, props.row)"
                                                  v-loading="props.row.versionsLoading">
                                            <el-table-column type="selection" width="55" />
                                            <el-table-column prop="artVersion" label="版本" width="120" show-overflow-tooltip />
                                            <el-table-column prop="artSha1" label="Sha1" show-overflow-tooltip>
                                                <template #default="{ row }">
                                                    <div class="flex items-center w-full" v-if="row.artSha1">
                                                        <span class="text-xs font-mono truncate">{{ row.artSha1
                                                        }}</span>
                                                        <span class="button-icon-grey h-6 w-6 p-0 ml-1"
                                                              id="user_token_copy" :data-clipboard-text="row.artSha1"
                                                              @click="copyFunc('#user_token_copy')">
                                                            <i class="murphy icon-fuzhi1"></i>
                                                        </span>
                                                    </div>
                                                    <div v-else>
                                                        -
                                                    </div>
                                                </template>
                                            </el-table-column>
                                            <el-table-column prop="artModifiedTime" label="更新时间" width="160">
                                                <template #default="{ row }">
                                                    {{ formatDate(row.artModifiedTime) }}
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                        <PageComp
                                            @current-change="(page: number) => handleVersionPageChange(props.row, page)"
                                            v-model:currentPage="props.row.versionPagination.page"
                                            :total="props.row.versionPagination.total"
                                            :page-size="props.row.versionPagination.page_size" />
                                    </div>
                                </template>
                            </el-table-column>

                            <el-table-column prop="pkgName" label="包名" />
                            <el-table-column width="160" prop="pkgVersionCount" label="版本数" />
                        </TableComp>

                        <PageComp @current-change="getPackageList" v-model:currentPage="filterOptions.page"
                                  :total="packageTotal" :page-size="filterOptions.page_size" />
                    </div>
                </div>

                <div v-else class="mt-[8%] flex-1">
                    <NoData />
                    <p class="text-center mt-[-8px]">请点击左侧仓库列表，选择制品进行检测</p>
                </div>

                <!-- 已选择的版本列表 -->
                <div class="flex-1 p-3 w-0" v-if="selectedData.length > 0">
                    <div class="g-color-1 g-fw-500 text-sm mb-4">已选制品（{{ selectedData.length }}）</div>
                    <!-- <div style="border-bottom: 1px solid #EBEBEB;"
                         class="g-pb-12 g-flex g-justify-between g-pl-16 g-pr-16 g-pt-16">
                        <span class="g-color-1 g-fw-500">已选制品（{{ selectedData.length }}）</span>
                        <el-button type="text" size="small" @click="clearAllSelected">清空</el-button>
                    </div> -->

                    <div class="selected-list h-[calc(100%-50px)] overflow-auto">
                        <div v-for="(item, index) in selectedData" :key="index"
                             class="selected-item flex items-center text-3c justify-between p-3 mb-2 bg-f7 rounded border">
                            <div class="flex-1 flex items-center w-0 gap-4">
                                <div class="text-sm min-w-[100px] truncate">{{ item.artVersion }}</div>
                                <div class="text-sm ellipsis">{{ item.pkgName }}</div>
                            </div>

                            <span class="text-err cursor-pointer ml-4" @click.stop="removeSelectedVersion(item,index)">删除</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="fix-btn">
            <div class="btn">
                <el-button :disabled="selectedData.length === 0" @click="nextStepHandle">下一步</el-button>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { copyFunc, formatDate } from 'util/tools';
import store, { detectInfo } from 'util/store';
import { getEzoneRepoListApi, getEzonePackageListApi, getEzonePackageVersionListApi } from 'api/detect';
import { refreshLoading } from 'util/hook';

const router = useRouter();
const repoList = ref<any[]>([]);
const selectedData = ref<any[]>([]);
const tableRefs = ref<any>({});

// 获取仓库格式文本
const getRepoFormatText = (format: string) => {
    const formatMap: Record<string, string> = {
        snapshot: '半成品库',
        release: '成品库',
        mirror: '镜像库',
    };
    return formatMap[format] || format;
};

const loadRepoList = async () => {
    try {
        const { data } = await getEzoneRepoListApi({
            team_config_id: detectInfo.team_config_id,
        });
        repoList.value = data.list || [];
    } catch (error) {
        console.log(error);
    }
};
loadRepoList();

// 选择配置ID
const changeTeamIdHandle = (value: string) => {
    selectedData.value = [];
    // eslint-disable-next-line no-use-before-define
    packageList.value = [];
    detectInfo.team_config_id = value || detectInfo.team_config_id;
    loadRepoList();
};

// 下一步
const nextStepHandle = () => {
    // 格式化选中的制品数据
    const formattedData = selectedData.value.map((item: any) => ({
        addr: item.downLoadUrl,
        branch: item.artVersion,
        pkg_name: item.pkgName,
    }));

    (detectInfo as any).repos = formattedData;
    router.push('/detect-config?from=ezone-package');
};

// 获取制品列表
const filterOptions = reactive({
    team_config_id: detectInfo.team_config_id,
    repo_id: '',
    page: 1,
    page_size: 10,
});
const packageList = ref([]);
const packageTotal = ref(0);
const getPackageList = async () => {
    try {
        const { data } = await getEzonePackageListApi(filterOptions);
        packageList.value = data.list || [];
    } catch (error) {
        console.log(error);
    }
};

const repoItemClick = (data: any) => {
    if (data.repoId === filterOptions.repo_id) {
        return;
    }
    filterOptions.repo_id = data.repoId;
    packageTotal.value = Number(data.pkgCount);
    getPackageList();
};

// 加载版本列表
const loadVersionList = async (packageRow: any) => {
    packageRow.versionsLoading = true;
    packageRow.versionPagination = { page: 1, page_size: 10, total: Number(packageRow.pkgVersionCount) };

    try {
        const { data } = await getEzonePackageVersionListApi({
            team_config_id: detectInfo.team_config_id,
            pkg_id: packageRow.pkgId,
            repo_format: packageRow.repoFormat,
            page: packageRow.versionPagination.page,
            page_size: packageRow.versionPagination.page_size,
        });
        packageRow.versions = data.list || [];
    } catch (error) {
        console.log(error);
        packageRow.versions = [];
    } finally {
        packageRow.versionsLoading = false;
    }
};

// 处理表格展开变化
const handleExpandChange = async (row: any, expandedRows: any[]) => {
    const isExpanded = expandedRows.includes(row);
    if (isExpanded && !row.versions) {
        // 展开时加载版本列表
        await loadVersionList(row);
    }
};

// 处理版本分页变化
const handleVersionPageChange = async (packageRow: any, page: number) => {
    packageRow.versionPagination.page = page;
    packageRow.versionsLoading = true;

    try {
        const { data } = await getEzonePackageVersionListApi({
            team_config_id: detectInfo.team_config_id,
            pkg_id: packageRow.pkgId,
            repo_format: packageRow.repoFormat,
            page: packageRow.versionPagination.page,
            page_size: packageRow.versionPagination.page_size,
        });
        packageRow.versions = data.list || [];

        // packageRow.versionPagination.total = data.total || 0;
    } catch (error) {
        console.log(error);
        packageRow.versions = [];
    } finally {
        packageRow.versionsLoading = false;
    }
};

// 选择版本
const selectVersion = (select: any, currentRow: any, packageRow: any) => {
    // 判断当前行是否在选中列表中
    const isSelected = select.some((item: any) => item.artVersion === currentRow.artVersion);
    if (isSelected) {
        const newItem = {
            pkgName: packageRow.pkgName,
            ...currentRow,
            pkgId: packageRow.pkgId,
            repoFormat: packageRow.repoFormat,
        };
        const exists = selectedData.value.some((item) => item.artVersion === currentRow.artVersion);
        if (!exists) {
            selectedData.value.push(newItem);
        }
    } else {
        selectedData.value = selectedData.value.filter((item) => item.artVersion !== currentRow.artVersion);
    }
};

// 全选当前版本
const selectAllVersion = (select: any, packageRowVersions: any, packageRow: any) => {
    const isSelected = select.length > 0;
    const newSelects = select.map((item: any) => ({
        pkgName: packageRow.pkgName,
        ...item,
        pkgId: packageRow.pkgId,
        repoFormat: packageRow.repoFormat,
    }));
    if (isSelected) {
        const newSelectedData = newSelects.filter((item:any) => !selectedData.value.some((selectedItem) => selectedItem.artVersion === item.artVersion));
        selectedData.value = [...selectedData.value, ...newSelectedData];
    } else {
        selectedData.value = selectedData.value.filter((item) => !packageRowVersions.some((packageItem: any) => packageItem.artVersion === item.artVersion));
    }
};

// 移除选中的版本
const removeSelectedVersion = (item:any, index: number) => {
    selectedData.value.splice(index, 1);
    const tableRef = tableRefs.value[item.pkgId];

    if (tableRef) {
        const getSelectedRows = tableRef.getSelectionRows();
        tableRef.toggleRowSelection(getSelectedRows.find((row: any) => row.artVersion === item.artVersion), false);
    }
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
.ezone-package-version-table-header .el-table-column--selection .cell {
    display: none;
}
</style>

<style scoped lang='less'>
.project-content {
    margin-top: 8px;
    color: #858585;
    border-radius: 6px;
    height: 58vh;

    .part {
        width: 22%;
        overflow: auto;
        box-sizing: border-box;
        padding: 12px;
        background-color: #fff;
        position: relative;

        .node-name {
            margin-left: 4px;
            // flex: 1;
            .ellipsis();
        }

        &:nth-of-type(1) {
            border-right: 1px solid #F7F8FB;
        }

        &:nth-of-type(2) {
            flex: 1;
            border-right: 1px solid #F7F8FB;
        }

        &:nth-of-type(3) {
            width: 25%;
            border-right: none;
        }
    }
}

.btn {
    float: right;
    margin-top: 30px;
    margin-bottom: 30px;
}

.fix-btn {
    width: 1210px;
    position: fixed;
    z-index: 999;

    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    background-color: #fff;
}
</style>
