<template>
    <div class="full_detect">
        <div class="full-tip g-mb-24">
            <div class="flex items-center mr-2">
                <!-- <i class="murphy icon-tixing"></i> -->
                <span class="loader g-mr-8"></span>
                当前已有全量检测任务正在进行，请在任务结束后再次发起新的全量检测
            </div>
            <el-popconfirm popper-class="cancle-popper confirm-popper" title="确认取消检测？"
                           @confirm="cancleFullDetect(type)">
                <template #reference>
                    <div class="cancle font-normal">取消检测</div>
                </template>
            </el-popconfirm>
        </div>
        <!-- <div class="g-f-14 g-fw-500 g-color-1 g-mb-12">检测进度</div>
        <div class="g-mb-12">
            <el-progress :stroke-width="12"
                         :percentage="parseInt(`${showInfo.finish_project_count / showInfo.total_project_count * 100}`)" />
        </div>
        <div class="g-f-12 g-color-3 g-mb-24">
            <div class="g-mb-8 ellipsis" style="width: 100%;">正在检测&nbsp; {{ showInfo.current_project_name }}</div>
            <div class="g-mb-8">任务检测进度&nbsp; {{ showInfo.finish_project_count }}/{{ showInfo.total_project_count }}
            </div>
            <div class="g-mb-8">预计剩余时间&nbsp; {{ fullDetectTime(showInfo.estimated_remaining_seconds) }}</div>
        </div> -->
        <div class="g-f-14 g-fw-500 g-color-1 g-mb-6">基本信息</div>
        <div class="g-mb-24 g-color-1 g-fw-400">
            <span class="g-mr-24">检测发起时间：{{ showInfo.created_at ? formatDate(showInfo.created_at) : '-' }}</span>
            <span class="g-mr-24">检测人：{{ showInfo.created_user_name }}</span>
            <span>仓库配置：{{ showInfo.team_config_name }}</span>
        </div>

        <div class="g-f-14 g-fw-500 g-color-1 g-mb-6">检测范围</div>
        <div class="g-color-1 g-fw-400"
             v-if="$route.query.from === 'nexus' || $route.query.from === 'jfrog' || $route.query.from === 'folib'">
            仓库Format：{{ showInfo.repository_key ?`${showInfo.repository_key}（${showInfo.format_or_package_manager}）` : (showInfo.format_or_package_manager||'全部') }}
        </div>

        <div class="g-color-1 g-fw-400 flex items-center"
             v-else-if="$route.query.from === 'ecr'">
            <div class="mr-6">
                国家/地区：{{ regionOptions?.find((group:any) => group.list?.find((item:any) => item.region_name === showInfo.ecr_region_name))?.list?.find((item:any) => item.region_name === showInfo.ecr_region_name)?.region_name_zh || '-' }}
            </div>
            <div class="mr-6">
                仓库类型：{{ showInfo.ecr_is_public_repo ?'公有':'私有' }}
            </div>
            <div>
                版本：{{ showInfo.ecr_is_only_least_version ? '仅扫描最新版本' : '全部' }}
            </div>
        </div>

        <div class="g-fw-400" v-else>
            <div v-if="$route.query.from === 'github'" class="g-mb-24">仓库所属组织：
                <span>{{ showInfo.namespace || '-' }}</span>
                <!-- <span v-if="!showInfo.namespace?.length">-</span> -->
            </div>
            <span class="g-mr-24">
                仓库最后更新时间：
                <span v-if="showInfo.repo_last_active_time_start">
                    {{ formatDate1(showInfo.repo_last_active_time_start) }} - {{ formatDate1(showInfo.repo_last_active_time_end) }}
                </span>
                <span v-else-if="showInfo.repo_last_active_time_days">最近 {{ showInfo.repo_last_active_time_days }} 天活跃的仓库</span>
                <span v-else>-</span>
            </span>

            <span class="g-mr-24" v-if="$route.query.from !== 'bitbucket'">语言类型：{{ showInfo.repo_language || '-' }}</span>
            <span class="g-mr-24" v-if="$route.query.from !== 'bitbucket'">归档项目：{{ showInfo.include_archiving_repo === 1 ? '包含' : '不包含' }}</span>

            <span v-if="$route.query.from === 'github'">
                Fork项目：<span v-if="showInfo.is_fork === true">是</span>
                <span v-else-if="showInfo.is_fork === false">否</span>
                <span v-else>全部</span>
            </span>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { formatDate1, formatDate } from 'util/tools';
import {
    showInfo, startRoll, cancleFullDetect,
} from '../hooks/hook';

const props = defineProps(['type', 'regionOptions']);
startRoll(props.type);
</script>

<style lang='less' scoped>
.full_detect {
    color: #3c3c3c;
}

.full-tip {
    height: 40px;
    background: #6C87FF2E;
    border-radius: 6px;
    line-height: 40px;
    padding: 0 16px;
    margin-bottom: 24px;
    color: #3c3c3c;
    display: flex;
    justify-content: space-between;

    i {
        color: @primary;
    }
}

.cancle {
    color: @primary;
    cursor: pointer;
}
</style>
