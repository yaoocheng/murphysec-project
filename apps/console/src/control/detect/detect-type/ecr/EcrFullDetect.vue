<template>
    <div class="all">
        <div v-if="!isFullDetecting">
            <FormComp label-width="135px">
                <el-form-item>
                    <template #label>
                        <div class="form_label">
                            选择已接入的Amazon ECR
                        </div>
                    </template>
                    <el-select @change="getFullDetectStatus('ecr')" v-model="detectInfo.team_config_id" style="width: 370px">
                        <el-option
                            v-for="item in store.allAccessInfo.ecr.map((e: any) => ({ value: e.config_id, label: e.config_name }))"
                            :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <template #label>
                        <div class="form_label">
                            国家/区域
                        </div>
                    </template>
                    <el-select v-model="detectInfo.ecr_region_name" class="w-[370px]">
                        <el-option-group v-for="group in regionOptions" :key="group.region_cate_zh"
                                         :label="group.region_cate_zh">
                            <el-option v-for="item in group.list" :key="item.region_name" :label="item.region_name_zh"
                                       :value="item.region_name">
                                <span class="pl-3">{{ item.region_name_zh }}</span>
                            </el-option>
                        </el-option-group>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <template #label>
                        <div class="form_label">
                            公开/私有仓库
                        </div>
                    </template>
                    <SelectComp style="width: 370px" v-model="detectInfo.ecr_is_public_repo"
                                :options="repoTypesOptions" placeholder="请选择仓库类型" />
                </el-form-item>

                <el-form-item>
                    <template #label>
                        <div class="form_label">
                            版本
                        </div>
                    </template>
                    <div>
                        <el-radio-group v-model="detectInfo.ecr_is_only_least_version">
                            <el-radio :label="false">全部</el-radio>
                            <el-radio :label="true">仅扫描最新版本</el-radio>
                        </el-radio-group>
                    </div>
                </el-form-item>
            </FormComp>
        </div>

        <FullDetect v-else :type="'ecr'" :regionOptions="regionOptions" />
    </div>

</template>

<script setup lang="ts">
import { getEcrRegionApi } from 'api/detect';
import { onBeforeMount, onUnmounted, ref } from 'vue';
import store, { detectInfo } from 'util/store';
import FullDetect from '../../full-detect/FullDetect.vue';
import {
    isFullDetecting, fullRollTimer,
    getFullDetectStatus,
} from '../../hooks/hook';

const regionOptions = ref<any>([]);
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
onBeforeMount(async () => {
    const { data } = await getEcrRegionApi({
        team_config_id: detectInfo.team_config_id,
        team_id: store.teamInfo.team_id,
    });
    regionOptions.value = data.list || [];

    // 设置默认选中第一个地区
    if (regionOptions.value.length > 0 && regionOptions.value[0].list && regionOptions.value[0].list.length > 0) {
        detectInfo.ecr_region_name = regionOptions.value[0].list[0].region_name;
    }
});

// 是否在全量
getFullDetectStatus('ecr');

onUnmounted(() => {
    window.clearInterval(fullRollTimer.value);
    fullRollTimer.value = null;
});
</script>

<style lang="less" scoped>
.all {
    background: #F7F8FB;
    border-radius: 8px;
    padding: 24px;
    font-weight: 500;

    .form_label {
        color: #3c3c3c;
        font-weight: 500;
    }

    .tip {
        height: 40px;
        background: rgba(255, 153, 64, 0.18);
        border-radius: 6px;
        line-height: 40px;
        padding-left: 16px;
        margin-bottom: 24px;
        color: #3c3c3c;

        i {
            color: #FF9940;
        }
    }
}

.desc {
    font-size: 12px;
    color: #8F959E;
    margin-bottom: 8px;
}
</style>
