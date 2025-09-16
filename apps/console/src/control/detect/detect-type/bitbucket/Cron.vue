<template>
    <div class="timing g-color-1 g-bg-f7 g-p-16 g-bdr-6">
        <div class="g-mb-16 g-fw-500 g-f-16 g-flex justify-between">
            <div>
                定时检测配置
                <span class="tag" v-if="!isConfig">未配置</span>
                <span class="tag" v-else>已配置</span>
            </div>
            <div @click="excModal = true" class="g-color-3 g-f-14 g-fw-400 g-cursor-pointer">
                执行记录 <i class="murphy icon-youjiantou11"></i>
            </div>
        </div>
        <div class="g-mb-16">
            <div class="form_label g-fw-500" style="margin-bottom: 11px;">
                <span class="text-err">*</span>
                选择已接入的Bitbucket
            </div>
            <el-select @change="changeTeamIdHandle(detectInfo.team_config_id)" v-model="detectInfo.team_config_id">
                <el-option
                    v-for="item in store.allAccessInfo.bitbucket.map((e: any) => ({ value: e.config_id, label: e.config_name }))"
                    :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
        </div>

        <div>
            <div class="g-p-16 g-bdr-6 g-bg-ff g-mb-16">
                <div class="g-color-3 g-mb-16 g-fw-500">设置检测范围</div>

                <div class="g-mb-8 g-fw-500">角色</div>
                <el-select :disabled="isConfig" style="width: 370px; margin-bottom: 24px;" @change="reqData.page = 1; listData = []; detectInfo.bitbucket_repositories=[];reqData.bitbucket_role=detectInfo.bitbucket_role; getListData();" v-model="detectInfo.bitbucket_role">
                    <el-option label="成员" value="member" />
                    <el-option label="贡献者" value="contributor" />
                    <el-option label="管理员" value="admin" />
                    <el-option label="所有者" value="owner" />
                </el-select>

                <div class="g-mb-8 g-fw-500">工作空间</div>
                <el-select :disabled="isConfig" style="width: 370px;margin-bottom: 24px;" @change="reqData.page = 1; listData = [];detectInfo.bitbucket_repositories=[]; reqData.workspace=detectInfo.bitbucket_workspace; getListData();" v-model="detectInfo.bitbucket_workspace">
                    <el-option v-for="item in workspaceOptions" :key="item.value" :label="item.name"
                               :value="item.value" />
                </el-select>

                <div class="g-mb-8 g-fw-500">仓库最后活跃时间</div>
                <div style="width: 370px;margin-bottom: 24px;">
                    <el-date-picker :disabled="isConfig" v-model="activeTime"
                                    @change="[detectInfo.repo_last_active_time_start, detectInfo.repo_last_active_time_end] = activeTime"
                                    type="daterange" start-placeholder="开始时间" end-placeholder="结束时间" />
                </div>

                <div class="g-mb-8 g-fw-500">指定仓库</div>
                <el-select :disabled="isConfig" v-model="detectInfo.bitbucket_repositories" value-key="addr" clearable filterable multiple placeholder="请选择仓库"
                           style="width: 370px">
                    <el-option v-for="item in listData" :key="item.url" :label="item.name"
                               :value="item" />
                    <template v-if="reqData.page!==0" #footer>
                        <div class="flex justify-center">
                            <span @click="reqData.page++; getListData()" class="button-text-blue">加载更多</span>
                        </div>
                    </template>
                </el-select>
            </div>

            <div class="g-p-16 g-bdr-6 g-bg-ff">
                <div class="g-color-3 mb-4 font-medium">设置检测时间</div>
                <div class="font-medium mb-2">
                    <span class="text-err">*</span>
                    定时检测时间
                </div>
                <div class="flex items-center">
                    <el-input v-model="detectInfo.crontab_spec" :disabled="isConfig" class="w-[370px] mr-2" placeholder="请输入 Cron 表达式时间"></el-input>
                    <div class="button-text-blue" @click="dialogVisible = true">示例</div>
                    <CronDialog v-model="dialogVisible" />
                </div>
            </div>
        </div>

        <!-- <div v-else>
            <div class="g-p-16 g-bdr-6 g-bg-ff g-mb-16 ">
                <div class="g-color-3 g-mb-16 g-fw-500">检测范围</div>

                <div class="font-medium mb-2 g-fw-500">
                    仓库类型
                </div>
                <div class="mb-4">fsafsa</div>

                <div class="font-medium mb-2 g-fw-500">
                    指定仓库
                </div>
                <div class="mb-4">sfasa</div>
            </div>

        </div> -->

        <div class="fix-btn">
            <div class="btn " v-if="!isConfig">
                <el-button :disabled="isDisabled" @click="nextStepHandle">下一步</el-button>
            </div>

            <div class="btn" v-else>
                <el-popconfirm popper-class="cancle-popper confirm-popper" title="确定删除配置？" @confirm="delConfig">
                    <template #reference>
                        <el-button class="minor_btn del-btn">删除</el-button>
                    </template>
                </el-popconfirm>
                <el-button class="minor_btn" @click="isConfig = false">更改配置</el-button>
            </div>
        </div>

        <CronExcRecords v-model="excModal" v-if="excModal" />
    </div>
</template>

<script setup lang='ts'>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { showMessage } from 'util/tools';
import store, { detectInfo } from 'util/store';
import {
    getDetectConfigApi, timeExcDelApi, getBitbucketListApi, getBitbucketWorkspacesApi,
} from 'api/detect';
import CronDialog from '../../components/CronDialog.vue';
import CronExcRecords from '../../components/CronExcRecords.vue';

const router = useRouter();
const isConfig = ref<boolean>(false);
const activeTime = ref<Array<string>>([]);
const dialogVisible = ref(false);
const excModal = ref(false);

// 定时配置
const getTimeConfig = async (id: string) => {
    try {
        const { data } = await getDetectConfigApi({
            team_config_id: id,
            access_type: 'bitbucket',
            config_type: 'cron',
        });
        isConfig.value = Boolean(data.crontab_spec);
        if (isConfig.value) {
            Object.assign(detectInfo, data);
            activeTime.value = [detectInfo.repo_last_active_time_start as string, detectInfo.repo_last_active_time_end as string];
            // eslint-disable-next-line no-use-before-define
            reqData.value.workspace = detectInfo.bitbucket_workspace;
            // eslint-disable-next-line no-use-before-define
            reqData.value.bitbucket_role = detectInfo.bitbucket_role;
        }
    } catch (error) {
        console.log(error);
    }
};

const delConfig = async () => {
    try {
        await timeExcDelApi({
            team_config_id: detectInfo.team_config_id,
            access_type: 'bitbucket',
        });
        isConfig.value = false;
        detectInfo.bitbucket_repositories = [];
        detectInfo.crontab_spec = '';
        detectInfo.repo_last_active_time_start = null;
        detectInfo.repo_last_active_time_end = null;
        // detectInfo.bitbucket_role = '';
        // detectInfo.bitbucket_workspace = '';
        showMessage('删除成功', 'success');
    } catch (error) {
        console.log(error);
    }
};

// 下一步
const nextStepHandle = () => {
    detectInfo.access_type = 'bitbucket';
    detectInfo.config_type = 'cron';
    router.push('/detect-config?from=bitbucket&type=detectConfig');
};

// 列表请求参数
const reqData = ref<any>({
    team_id: store.teamInfo.team_id,
    access_type: 'bitbucket',
    page: 1,
    workspace: detectInfo.bitbucket_workspace,
    bitbucket_role: detectInfo.bitbucket_role,
    team_config_id: detectInfo.team_config_id,
});
// 检测配置信息

const listData = ref<Array<any>>([]);
const getListData = async () => {
    try {
        const res = await getBitbucketListApi(reqData.value);
        listData.value.push(...(res.data?.list || []));
        if (!res.data?.list?.length) {
            reqData.value.page = 0;
        }
    } catch (error) {
        console.log(error);
    }
};

const workspaceOptions = ref<Array<any>>([]);
// 获取workspace列表
const getWorkspaceList = async () => {
    try {
        const res = await getBitbucketWorkspacesApi({
            team_config_id: detectInfo.team_config_id,
        });
        workspaceOptions.value = res.data?.list || [];
        reqData.value.workspace = res.data?.list[0]?.value;
        detectInfo.bitbucket_workspace = res.data?.list[0]?.value;
    } catch (error) {
        console.log(error);
    }
};

// 选择配置ID
const changeTeamIdHandle = async (value: string) => {
    reqData.value.page = 1;
    listData.value = [];
    detectInfo.crontab_spec = '';
    detectInfo.repo_last_active_time_start = null;
    detectInfo.repo_last_active_time_end = null;
    detectInfo.bitbucket_repositories = [];
    reqData.value.team_config_id = value;
    detectInfo.team_config_id = value;
    try {
        await getWorkspaceList();
        await getTimeConfig(value);
        getListData();
    } catch (error) {
        console.log(error);
    }
};
changeTeamIdHandle(detectInfo.team_config_id);

const isDisabled = computed(() => !detectInfo.crontab_spec);
</script>

<style scoped lang='less'>
.btn {
    float: right;
    margin-top: 30px;
    margin-bottom: 30px;

    .el-button {
        width: 80px;
        height: 32px;
    }

    .del-btn {
        border-color: #F34D3D !important;
        background-color: #fff !important;
        color: #F34D3D !important;
    }
}

.fix-btn {
    width: 1200px;
    position: fixed;
    z-index: 999;

    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    background-color: #fff;
}
</style>
