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
                选择已接入的简单云
            </div>
            <el-select @change="getTimeConfig" v-model="detectInfo.team_config_id">
                <el-option
                    v-for="item in store.allAccessInfo.ezone_code.map((e: any) => ({ value: e.config_id, label: e.config_name }))"
                    :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
        </div>

        <div v-if="!isConfig">
            <div class="g-p-16 g-bdr-6 g-bg-ff g-mb-16">
                <div class="g-color-3 g-mb-16 g-fw-500">设置检测范围</div>

                <div class="g-mb-4 g-fw-500">
                    <span class="text-err">*</span>
                    是否包含归档
                </div>
                <el-radio-group v-model="detectInfo.include_archiving_repo">
                    <el-radio :label="1">包含</el-radio>
                    <el-radio :label="2">不包含</el-radio>
                </el-radio-group>
            </div>

            <div class="g-p-16 g-bdr-6 g-bg-ff">
                <div class="g-color-3 mb-4 font-medium">设置检测时间</div>
                <div class="font-medium mb-2">
                    <span class="text-err">*</span>
                    定时检测时间
                </div>
                <div class="flex items-center">
                    <el-input v-model="detectInfo.crontab_spec" :disabled="isConfig" class="w-[370px] mr-2"
                              placeholder="请输入 Cron 表达式时间"></el-input>
                    <div class="button-text-blue" @click="dialogVisible = true">示例</div>
                    <CronDialog v-model="dialogVisible" />
                </div>
            </div>
        </div>

        <div v-else>
            <div class="g-p-16 g-bdr-6 g-bg-ff g-mb-16 g-fw-500">
                <div class="g-color-3 g-mb-16">检测范围</div>

                <div class="g-mb-8">是否包含归档</div>
                <div class="g-fw-400 g-mb-16">{{ detectInfo.include_archiving_repo === 1 ? '包含' : '不包含' }}</div>
            </div>

            <div class="g-p-16 g-bdr-6 g-bg-ff g-fw-500">
                <div class="g-color-3">检测时间</div>
                <div class="g-mt-16 g-fw-400">
                    {{ detectInfo.crontab_spec || '-' }}
                </div>
            </div>
        </div>

        <div class="fix-btn">
            <div class="btn" v-if="!isConfig">
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
import store, { detectInfo } from 'util/store';
import {
    getDetectConfigApi, timeExcDelApi,
} from 'api/detect';
import CronDialog from '../../components/CronDialog.vue';
import CronExcRecords from '../../components/CronExcRecords.vue';

const router = useRouter();
const isConfig = ref<boolean>(false);
const dialogVisible = ref(false);
const excModal = ref(false);

// 定时配置
const getTimeConfig = async (id: string) => {
    try {
        const { data } = await getDetectConfigApi({
            team_config_id: id,
            access_type: 'ezone_code',
            config_type: 'cron',
        });
        detectInfo.crontab_spec = '';
        detectInfo.include_archiving_repo = 1; // 默认不包含归档
        isConfig.value = Boolean(data.crontab_spec);
        if (isConfig.value) {
            Object.assign(detectInfo, data);
        }
    } catch (error) {
        console.log(error);
    }
};
getTimeConfig(detectInfo.team_config_id);

const delConfig = async () => {
    try {
        await timeExcDelApi({
            team_config_id: detectInfo.team_config_id,
            access_type: 'ezone_code',
        });
        isConfig.value = false;
        detectInfo.crontab_spec = '';
        detectInfo.include_archiving_repo = 1;
    } catch (error) {
        console.log(error);
    }
};

// 下一步
const nextStepHandle = () => {
    detectInfo.access_type = 'ezone_code';
    detectInfo.config_type = 'cron';
    router.push('/detect-config?from=ezone_code&type=detectConfig');
};

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

.tag {
    display: inline-block;
    padding: 2px 8px;
    font-size: 12px;
    border-radius: 4px;
    // background-color: #f0f0f0;
    // color: #666;
    // margin-left: 8px;
}

.button-text-blue {
    color: #6C87FF;
    cursor: pointer;
    font-size: 14px;
}

</style>
