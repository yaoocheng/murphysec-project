<template>
    <div class="bg-f7 rounded-md p-4">
        <div v-if="quickDetectInfo.created_at" class="bg-[#6C87FF2E] mb-4 text-sm text-3c rounded-md py-[9px] px-4 flex justify-between items-center">
            <div class="flex items-center">
                <img class="w-4 h-4 mr-2" src="~@/assets/img/icon_info.png" alt="">
                最新检测时间为 {{ formatDate(quickDetectInfo.created_at) }}，如有更新请点击重新检测
            </div>
            <span @click="startDetect" v-if="detectStatus==='done'" class="text-primary cursor-pointer">重新检测</span>
        </div>

        <div class="rounded bg-ff p-3" v-if="isHasData">
            <div class="flex items-center gap-2 mb-3">
                <el-select :disabled="detectStatus==='running'" style="width: 106px" v-model="detectInfo.team_config_id"
                           @change="changeTeamIdHandle">
                    <el-option
                        v-for="item in store.allAccessInfo.nexus.map((e: any) => ({ value: e.config_id, label: e.config_name }))"
                        :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
                <SearchComp  style="margin-right: 0;" class="w-[320px] mr-0" placeholder="输入组件名回车搜索" v-model="reqData.keyword"
                             @change="listData = []; reqData.page = 1; getData();" clearable />
                <el-select v-model="reqData.repo_name" clearable multiple :collapse-tags="true"
                           @change="listData = []; reqData.page = 1; getData();"
                           style="width: 140px" placeholder="仓库">
                    <el-option v-for="item in repoKeysOptions" :key="item.value" :label="item.label"
                               :value="item.value" />
                </el-select>
                <el-select v-model="reqData.highest_suggest" clearable
                           @change="listData = []; reqData.page = 1; getData();"
                           style="width: 140px" placeholder="处置等级">
                    <el-option v-for="item in repairLevelOptions" :key="item.value" :label="item.label"
                               :value="item.value" />
                </el-select>
                <el-checkbox v-model="reqData.is_poison" @change="listData = []; reqData.page = 1; getData();" label="投毒组件" size="large" />
                <el-button @click="resethandle" class="ml-3 minor_btn h-8 w-[52px]">重置</el-button>
            </div>

            <div v-if="listData.length" class="flex justify-between items-center mb-3 text-sm text-3c">
                <div class="g-f-14 g-color-3">
                    共 <span class="text-3c">{{ total || 0 }}</span> 条数据
                </div>
                <el-button v-if="detectStatus==='done'"
                           @click="downloadFile"
                           class="minor_white_btn w-20" style="height: 32px;">导出</el-button>
            </div>

            <TableComp v-if="listData.length" :data="listData">
                <el-table-column prop="asset_name" label="组件名称" width="400">
                    <template #default="{row}">
                        <div class="name">
                            <span class="text">{{ row.asset_name }}</span>
                            <TagComp class="mr-1" v-if="row.ecosystem !== 'unmanaged'" :content="row.ecosystem" />
                            <el-tooltip effect="light" placement="top">
                                <TagComp class="mr-1" :content=" getRepaireLevelTool(row.highest_suggest).text"
                                         :style="{ color: getRepaireLevelTool(row.highest_suggest).color, background: getRepaireLevelTool(row.highest_suggest).bgc }">
                                </TagComp>
                                <template #content>
                                    <div style="color: #2A2B32;">
                                        什么是处置等级？<a href="/docs/faqs/security-issues/security-issue-priorities.html"
                                                   target="_blank">详情</a>
                                    </div>
                                </template>
                            </el-tooltip>
                            <TagComp v-if="row.is_poison" content="投毒组件"></TagComp>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="asset_version" show-overflow-tooltip label="版本" width="140">
                    <template #default="{row}">
                        <span class="ellipsis" style="max-width: 120px;display: inline-block;">
                            {{ row.asset_version }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="漏洞级别" width="260">
                    <template #default="{row}">
                        <span class="num">
                            <span style="background-color: #F34D3D;color: #fff;">C</span>
                            <span style="background-color: rgba(245, 74, 69, 0.2);color: #F34D3D;">{{ row.critical_num }}</span>
                        </span>
                        <span class="num">
                            <span style="background-color: #FF9940;color: #fff;">H</span>
                            <span style="background-color: rgba(255, 153, 64, 0.2);color: #FF9940;">{{ row.high_num }}</span>
                        </span>
                        <span class="num">
                            <span style="background-color: #FCBE03;color: #fff;">M</span>
                            <span style="background-color: rgba(255, 204, 51, 0.2);color: #FCBE03;">{{ row.medium_num }}</span>
                        </span>
                        <span class="num">
                            <span style="background-color: #A7AECC;color: #fff;">L</span>
                            <span style="background-color: rgba(167, 174, 204, 0.2);color: #A7AECC;">{{ row.low_num }}</span>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="repo_name" label="仓库名称" width="120" />
                <el-table-column prop="repo_type" label="仓库类型" width="100" />
                <el-table-column prop="repo_format" label="仓库包类型" width="100" />
                <el-table-column label="操作" width="120" fixed="right">
                    <template #default="{row}">
                        <span class="button-text-blue" @click="checkVuln(row.id)">查看涉及漏洞</span>
                    </template>
                </el-table-column>
            </TableComp>

            <NoData v-if="!listData.length" />

            <PageComp @change="getData()" v-if="listData.length" v-model:currentPage="reqData.page" :total="total"
                      :page-size="10" />
        </div>

        <div v-else class="h-[calc(100vh-330px)] flex justify-center items-center text-center">
            <div>
                <div v-if="detectStatus==='running'" class="g-f-16 g-color-1 g-mb-16">正在检测仓库制品...</div>
                <div v-else-if="detectStatus==='cancel'" class="g-f-16 g-color-1 g-mb-16">检测已取消</div>
                <div v-else class="g-f-16 g-color-1 g-mb-16">快速检测仓库全部制品</div>

                <el-popconfirm v-if="detectStatus==='running'" @confirm="cancelDetect" popper-class="cancle-popper confirm-popper" :width="180"
                               title="确定取消本次检测么?">
                    <template #reference>
                        <el-button class="minor_btn g-mr-8" style="height: 32px;width: 110px;">
                            <span class="loader g-mr-8"></span> 取消检测
                        </el-button>
                    </template>
                </el-popconfirm>
                <el-button class="minor_btn w-20 h-8" @click="startDetect" v-else-if="detectStatus==='cancel'">重新检测</el-button>
                <el-button class="minor_btn w-20 h-8" @click="startDetect" v-else>开始检测</el-button>
            </div>
        </div>
    </div>

    <el-dialog width="840" v-model="vulnModal" title="涉及漏洞信息">
        <div style="height: 500px;overflow: auto;">
            <div v-if="sortVuln.length" class="g-f-14 g-mb-16">共 <span class="g-color-1">{{ sortVuln.length }}</span>
                条数据
            </div>

            <div class="item" v-for="(item, key) in sortVuln" :key="key"
                 :style="{ borderColor: getDangerLevel(item.level).color }">
                <div class="top">
                    <div class="part_info">
                        <a class="hover_text g-f-14 g-fw-500 g-color-1 g-mr-4"
                           :href="generateVulnLink(item.mps_id, item.cve_id)" target="_blank">
                            {{ item.title }}
                        </a>
                        <TagComp class="mr-1" v-if="!item?.cve_id" content="CVE未收录漏洞"></TagComp>
                        <TagComp class="mr-1" v-if="item?.is_sole === 1" content="独家漏洞"></TagComp>
                        <TagComp v-if="item?.cwe_id === 'CWE-506'" content="投毒组件"></TagComp>
                    </div>
                </div>

                <div class="bottom">
                    <div class="part_info">
                        编号
                        <span class="info">{{ item?.cve_id || item?.mps_id }}</span>
                    </div>

                    <div class="part_info">
                        POC
                        <span class="info">{{ item?.is_poc === 1 ? '有' : '无' }}</span>
                    </div>

                    <div class="part_info">
                        攻击成本
                        <span class="info">{{ item?.exploit_requirement_cost || '暂无' }}</span>
                    </div>

                    <div class="part_info">
                        影响范围
                        <span class="info">{{ item?.scope_influence || '暂无' }}</span>
                    </div>

                    <!-- <div class="part_info">
                        可触发漏洞
                        <span class="info">{{ item?.is_triggers ? '是' : '否' }}</span>
                    </div> -->
                </div>
            </div>
            <NoData style="margin-top: 60px;" v-if="!sortVuln.length" />
        </div>
    </el-dialog>
</template>

<script setup lang='ts'>
import { ref, onUnmounted } from 'vue';
import {
    getNexusQuickStatusApi, getNexusQuickListApi, NexusQuickDetectApi, getNexusQuickVulnApi, exportExcApi, cancelNexusQuickApi, getNexusRepoKeyDataApi,
} from 'api/detect';
import {
    getDangerLevel, generateVulnLink, formatDate, getRepaireLevelTool,
    showMessage,
} from 'util/tools';
import NoData from 'comp/NoData.vue';
import store, { detectInfo } from 'util/store';
import SearchComp from '@/components/SearchComp.vue';
import PageComp from '@/components/PageComp.vue';
import TagComp from '@/components/TagComp.vue';
import TableComp from '@/components/TableComp.vue';

const vulnModal = ref(false);
const listData = ref<any[]>([]);
const total = ref(0);
const sortVuln = ref<any[]>([]);
const detectStatus = ref(''); // 检测状态 running done cancel
const quickDetectInfo = ref<any>({});
const isHasData = ref();

// 列表请求参数
const reqData = ref<any>({
    page: 1,
    limit: 10,
    team_id: store.teamInfo.team_id,
    keyword: undefined,
    repo_name: [],
    highest_suggest: undefined, // 处置等级筛选
    is_poison: false,
    team_config_id: detectInfo.team_config_id,
});

const resethandle = () => {
    reqData.value.keyword = undefined;
    reqData.value.repo_name = [];
    reqData.value.highest_suggest = undefined;
    reqData.value.is_poison = false;
    // eslint-disable-next-line no-use-before-define
    getData();
};

const getData = async () => {
    try {
        listData.value = [];
        const { data } = await getNexusQuickListApi(reqData.value);
        listData.value = data.remote_tripartite_asset_list || [];
        total.value = data.total;
        if (!isHasData.value) {
            isHasData.value = data.total;
        }
    } catch (error) {
        console.log(error);
    }
};
// getData();

// 查看漏洞
const checkVuln = async (id: string) => {
    try {
        const { data } = await getNexusQuickVulnApi(id);
        vulnModal.value = true;
        sortVuln.value = data;
    } catch (error) {
        console.log(error);
    }
};

// 选择配置ID
const changeTeamIdHandle = (value: string) => {
    listData.value = [];
    detectInfo.team_config_id = value;
    reqData.value.team_config_id = value;
    // eslint-disable-next-line no-use-before-define
    getRepoKeyData();
    // eslint-disable-next-line no-use-before-define
    getStatus();
};

const fullRollTimer = ref<any>(null);
const startRoll = () => {
    // detectStatus.value = 'running';
    fullRollTimer.value = window.setInterval(async () => {
        // eslint-disable-next-line no-use-before-define
        getStatus();
    }, 3000);
};

// 获取状态
const getStatus = async () => {
    try {
        const { data } = await getNexusQuickStatusApi(detectInfo.team_config_id);
        if (data.status === 'running') {
            if (!fullRollTimer.value) {
                startRoll();
            }
            isHasData.value = undefined;
            detectStatus.value = 'running';
            quickDetectInfo.value = data;
        } else if (data.status === 'done') {
            clearInterval(fullRollTimer.value);
            fullRollTimer.value = null;
            detectStatus.value = 'done';
            quickDetectInfo.value = data;
            getData();
        } else if (data.status === 'cancel') {
            clearInterval(fullRollTimer.value);
            isHasData.value = undefined;
            quickDetectInfo.value = data;
            fullRollTimer.value = null;
            detectStatus.value = 'cancel';
        }
    } catch (error) {
        console.log(error);
    }
};
getStatus();

const startDetect = async () => {
    try {
        await NexusQuickDetectApi({
            team_id: store.teamInfo.team_id,
            team_config_id: detectInfo.team_config_id,
        });
        isHasData.value = undefined;
        listData.value = [];
        detectStatus.value = 'running';
        startRoll();
    } catch (error) {
        console.log(error);
    }
};

const cancelDetect = async () => {
    try {
        await cancelNexusQuickApi({
            team_id: store.teamInfo.team_id,
            team_config_id: detectInfo.team_config_id,
        });
        clearInterval(fullRollTimer.value);
        fullRollTimer.value = null;
        detectStatus.value = 'cancel';
    } catch (error) {
        console.log(error);
    }
};
const repoKeysOptions = ref<any[]>([]);

// 处置等级选项
const repairLevelOptions = ref([
    { value: 4, label: '强烈建议修复' },
    { value: 3, label: '建议修复' },
    { value: 2, label: '可选修复' },
    { value: 1, label: '无风险' },

]);

const getRepoKeyData = async () => {
    const res = await getNexusRepoKeyDataApi({
        team_config_id: detectInfo.team_config_id,
        team_id: store.teamInfo.team_id,
    });
    repoKeysOptions.value = res.data;
    repoKeysOptions.value = repoKeysOptions.value?.map((item) => ({
        value: item.name,
        label: item.name,
        ...item,
    }));
};
getRepoKeyData();

const downloadFile = async () => {
    try {
        await exportExcApi(reqData.value);
        showMessage('正在导出中，请在导出管理查看', 'success');
    } catch (error) {
        console.log(error);
    }
};

onUnmounted(() => clearInterval(fullRollTimer.value));

</script>

<style scoped lang='less'>
.num {
    display: inline-block;
    border-radius: 4px;
    margin-right: 15px;

    span {
        &:nth-of-type(1) {
            border-top-left-radius: 2px;
            border-bottom-left-radius: 2px;
        }

        &:nth-of-type(2) {
            border-top-right-radius: 2px;
            border-bottom-right-radius: 2px;
            padding: 0px 6px;
        }

        display: inline-block;
        padding: 0px 5px;
    }
}

.name {
    .text {
        display: inline-block;
        margin-right: 8px;
    }

    span.tag {
        padding: 3px 5px;
        background: rgba(73, 102, 230, 0.2);
        border-radius: 4px;
        color: #2946C7;
        font-size: 12px;
        display: inline-block;
        transform: scale(0.8);
    }
}

.item {
    height: 84px;
    padding: 16px;
    padding-left: 0;
    box-sizing: border-box;
    background-color: #F7F8FB;
    margin-bottom: 8px;
    border-radius: 4px;
    border-left: 4px solid transparent;

    .tag {
        padding: 3px 6px;
        // background: #34C72433;
        border-radius: 4px;
        display: inline-block;
        font-size: 12px;
        // color: #2EA121;
        font-weight: 500;
        transform: scale(0.8);
        margin-left: -6px;

        i {
            font-size: 12px;
            margin-right: 5px;
        }
    }

    .info {
        font-size: 14px;
        color: #3c3c3c;
        // font-weight: 500;
        display: inline-block;
        vertical-align: -3px;
    }

    .top,
    .bottom {
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        color: #8F959E;
    }

    .bottom {
        font-size: 12px;
    }

    .comp-tag .tag {
        margin-left: -8px;
    }

    .part_info {
        margin-left: 16px;

        .tag {
            margin-right: -0;
            color: #2946C7 !important;
            background-color: #4966E633 !important;
        }

        .info {
            margin-left: 4px
        }

        .center();

        a {
            color: @text-color;
        }

        a:hover {
            color: #6c87ff;
            text-decoration: underline;
        }
    }
}
</style>
