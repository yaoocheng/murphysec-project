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
                选择已接入的Amazon ECR
            </div>
            <el-select @change="changeTeamIdHandle(detectInfo.team_config_id)" v-model="detectInfo.team_config_id">
                <el-option
                    v-for="item in store.allAccessInfo.ecr.map((e: any) => ({ value: e.config_id, label: e.config_name }))"
                    :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
        </div>

        <div>
            <div class="g-p-16 g-bdr-6 g-bg-ff g-mb-16">
                <div class="g-color-3 g-mb-16 g-fw-500">设置检测范围</div>

                <div class="g-mb-8 g-fw-500">国家/区域</div>
                <el-select :disabled="isConfig" @change="reqData.next_token='';repoList=[];detectInfo.ecr_repositories = []; reqData.region_name=detectInfo.ecr_region_name; getEcrRepoListData()" v-model="detectInfo.ecr_region_name" class="w-[370px] mb-6">
                    <el-option-group v-for="group in regionOptions" :key="group.region_cate_zh"
                                     :label="group.region_cate_zh">
                        <el-option v-for="item in group.list" :key="item.region_name" :label="item.region_name_zh"
                                   :value="item.region_name">
                            <span class="pl-3">{{ item.region_name_zh }}</span>
                        </el-option>
                    </el-option-group>
                </el-select>

                <div class="g-mb-8 g-fw-500">公开/私有仓库</div>
                <SelectComp :disabled="isConfig" @change="reqData.next_token='';repoList=[]; detectInfo.ecr_repositories = []; reqData.is_public=detectInfo.ecr_is_public_repo; getEcrRepoListData()" style="width: 370px;margin-bottom: 24px;" v-model="detectInfo.ecr_is_public_repo"
                            :options="repoTypesOptions" placeholder="请选择仓库类型" />

                <div class="g-mb-8 g-fw-500">版本</div>
                <el-radio-group :disabled="isConfig" class="mb-6" v-model="detectInfo.ecr_is_only_least_version">
                    <el-radio :label="false">全部版本</el-radio>
                    <el-radio :label="true">最新版本</el-radio>
                </el-radio-group>

                <div class="g-mb-8 g-fw-500">指定仓库</div>
                <el-select :disabled="isConfig" v-model="detectInfo.ecr_repositories" value-key="repository_uri" clearable filterable multiple placeholder="请选择仓库"
                           style="width: 370px">
                    <el-option v-for="item in repoList" :key="item.repository_uri" :label="item.repository_name"
                               :value="item" />
                    <template v-if="reqData.next_token" #footer>
                        <div class="flex justify-center">
                            <span  @click="getEcrRepoListData" class="button-text-blue">加载更多</span>
                            <!-- <span v-else class="text-85">暂无更多</span> -->
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

            <div class="g-p-16 g-bdr-6 g-bg-ff">
                <div class="g-color-3 g-fw-500 mb-2">检测时间</div>
                <div>
                    Cron表达式：fasfsfas
                </div>
            </div>
        </div> -->

        <div class="fix-btn">
            <div class="btn " v-if="!isConfig">
                <el-button :disabled="!detectInfo.crontab_spec" @click="nextStepHandle">下一步</el-button>
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
import { ref, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { showMessage } from 'util/tools';
import store, { detectInfo } from 'util/store';
import {
    getDetectConfigApi, timeExcDelApi, getEcrRepositoryListApi, getEcrRegionApi,
} from 'api/detect';
import CronDialog from '../../components/CronDialog.vue';
import CronExcRecords from '../../components/CronExcRecords.vue';

const router = useRouter();
const isConfig = ref<boolean>(false);
const dialogVisible = ref(false);
const regionOptions = ref<any[]>([]);
const repoList = ref<any[]>([]);
const excModal = ref(false);
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
    region_name: detectInfo.ecr_region_name,
    is_public: detectInfo.ecr_is_public_repo,
    team_id: store.teamInfo.team_id,
    team_config_id: detectInfo.team_config_id,
});

onBeforeMount(async () => {
    const { data } = await getEcrRegionApi({
        team_config_id: detectInfo.team_config_id,
        team_id: store.teamInfo.team_id,
    });
    regionOptions.value = data.list || [];

    // 设置默认选中第一个地区
    if (regionOptions.value.length > 0 && regionOptions.value[0].list && regionOptions.value[0].list.length > 0) {
        detectInfo.ecr_region_name = regionOptions.value[0].list[0].region_name;
        reqData.value.region_name = detectInfo.ecr_region_name;
    }

    // eslint-disable-next-line no-use-before-define
    changeTeamIdHandle(detectInfo.team_config_id);
});

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

// 定时配置
const getTimeConfig = async (id: string) => {
    try {
        const { data } = await getDetectConfigApi({
            team_config_id: id,
            access_type: 'ecr',
            config_type: 'cron',
        });
        isConfig.value = Boolean(data.crontab_spec);
        if (isConfig.value) {
            Object.assign(detectInfo, data);
            reqData.value.region_name = detectInfo.ecr_region_name;
            reqData.value.is_public = detectInfo.ecr_is_public_repo;
        }
    } catch (error) {
        console.log(error);
    }
};

const delConfig = async () => {
    try {
        await timeExcDelApi({
            team_config_id: detectInfo.team_config_id,
            access_type: 'ecr',
        });
        isConfig.value = false;
        detectInfo.crontab_spec = '';
        detectInfo.ecr_repositories = [];
        detectInfo.ecr_is_public_repo = false;
        showMessage('删除成功', 'success');
    } catch (error) {
        console.log(error);
    }
};

// 下一步
const nextStepHandle = () => {
    detectInfo.access_type = 'ecr';
    detectInfo.config_type = 'cron';
    router.push('/detect-config?from=ecr&type=detectConfig');
};

// 选择配置ID
const changeTeamIdHandle = async (value: string) => {
    reqData.value.next_token = '';
    repoList.value = [];
    detectInfo.ecr_repositories = [];
    detectInfo.crontab_spec = '';
    detectInfo.ecr_is_public_repo = false;
    reqData.value.team_config_id = value;
    detectInfo.team_config_id = value;
    try {
        await getTimeConfig(value);
        getEcrRepoListData();
    } catch (error) {
        console.log(error);
    }
};

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
