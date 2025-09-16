<template>
    <div style="height: 100%;" v-loading.fullscreen="store.loading">
        <div class="detect_head">
            <div>
                <img :src="$systemConfig.whiteLogo" alt="">
                <span>新建项目检测</span>
            </div>

            <el-button class="cancle_btn hover_btn1" style="width: 80px"
                       v-if="!localStorageUtil('get', 'isGuide') && !$route.query.type" @click="$router.push('/integrate')">取消</el-button>
        </div>
        <div class="wrap">
            <div style="max-width: 1200px;margin: 0 auto;margin-top: 40px;padding-bottom: 30px;">
                <DetectConfig />
                <div class="fix-btn">
                    <div class="btn">
                        <template v-for="button in currentButtons" :key="button.text">
                            <el-button
                                :class="button.class"
                                :style="button.style"
                                @click="button.handler">
                                {{ button.text }}
                            </el-button>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import {
    onBeforeMount, computed, onMounted, onUnmounted, nextTick,
} from 'vue';
import { startDetectApi } from 'api/project';
import { getDetectConfigApi, saveDetectConfigApi, getRestartDetectApi } from 'api/detect';
import store, { detectInfo, createDetectInfo } from 'util/store';
import { useRoute, useRouter } from 'vue-router';
import bus, { showMessage, localStorageUtil } from '@/utils/tools';
import DetectConfig from './DetectConfig.vue';

const route = useRoute();
const router = useRouter();

// 开始检测
const startDetectHandle = async () => {
    if (!detectInfo.access_type) {
        showMessage('配置已丢失，请返回上一步重新配置', 'warning');
        return;
    }
    if ((!store.conf?.is_close_project_aggregation_modify && (detectInfo.access_type === 'upload' || detectInfo.access_type === 'git' || detectInfo.access_type === 'docker' || detectInfo.access_type === 'svn')) || detectInfo.access_type === 'comp') {
        if (!detectInfo.project_name) {
            showMessage('项目名称不能为空', 'warning');
            return;
        }
    }
    if (store.conf.is_cmdb_open && !detectInfo.cmdb_tag) {
        showMessage('请选择项目标签', 'warning');
        return;
    }

    if (!detectInfo.detection_scope_id) {
        showMessage('请选择检测语言及目录范围', 'warning');
        return;
    }
    detectInfo.package_private_id = detectInfo.package_private_id || undefined;

    try {
        await startDetectApi(detectInfo);
        showMessage('开始检测中', 'success');
        Object.assign(detectInfo, createDetectInfo());
        router.push('/project/list');
    } catch (error) {
        Object.assign(detectInfo, createDetectInfo());
        router.push('/project/list');
        console.log(error);
    }
};

// 保存配置
const saveConfigHandle = async () => {
    detectInfo.package_private_id = detectInfo.package_private_id || undefined;
    await saveDetectConfigApi(detectInfo);
    showMessage('保存成功', 'success');
    Object.assign(detectInfo, createDetectInfo());
    router.push('/project/list');
};

// 按钮配置
const buttonConfigs = {
    config: [ // 查看检测配置
        {
            text: '取消',
            class: 'cancle_btn',
            style: 'width: 80px',
            handler: () => router.back(),
        },
        {
            text: '保存',
            style: 'width: 80px',
            handler: saveConfigHandle,
        },
    ],
    restart: [ // 重新检测
        {
            text: '取消',
            class: 'cancle_btn',
            style: 'width: 80px',
            handler: () => router.back(),
        },
        {
            text: '开始检测',
            style: 'width: 80px',
            handler: startDetectHandle,
        },
    ],
    detectConfig: [ // 定时，webhook配置
        {
            text: '上一步',
            class: 'cancle_btn',
            style: 'width: 80px',
            handler: () => router.back(),
        },
        {
            text: '保存',
            style: 'width: 80px',
            handler: saveConfigHandle,
        },
    ],
    default: [ // 默认检测
        {
            text: '上一步',
            class: 'cancle_btn',
            style: 'width: 80px',
            handler: () => router.back(),
        },
        {
            text: '开始检测',
            style: 'width: 80px',
            handler: startDetectHandle,
        },
    ],
};

// 当前显示的按钮组
const currentButtons = computed(() => {
    const type = route.query.type as string;
    return buttonConfigs[type as keyof typeof buttonConfigs] || buttonConfigs.default;
});

// 规范化projects_id
const normalizeProjectsId = () => {
    if (Array.isArray(detectInfo.projects_id)) {
        [detectInfo.projects_id] = detectInfo.projects_id;
    }
};
normalizeProjectsId();

// 获取项目配置
const getProjectConfig = async (id: string, from: string) => {
    try {
        const res = await getDetectConfigApi({
            project_id: id,
            access_type: from,
            config_type: 'project',
        });
        Object.assign(detectInfo, res.data);
        detectInfo.package_private_id = detectInfo.package_private_id || undefined;
        normalizeProjectsId();
    } catch (error) {
        console.error('获取项目配置失败:', error);
    }
};

// 获取webhook配置
const getWebhookConfig = async (id: string, from: string) => {
    try {
        const res = await getDetectConfigApi({
            project_config_id: id,
            access_type: from,
            config_type: 'webhook',
        });

        if (!res.data.access_type) {
            Object.assign(detectInfo, createDetectInfo());
            detectInfo.access_type = from;
            detectInfo.project_config_id = id;
        } else {
            Object.assign(detectInfo, res.data);
            if (!detectInfo.notice_api_headers) {
                detectInfo.notice_api_headers = [{ key: '', value: '' }];
            }
            normalizeProjectsId();
        }
        nextTick(() => {
            bus.emit('updateDefaultConfig');
        });
        detectInfo.package_private_id = detectInfo.package_private_id || undefined;
    } catch (error) {
        console.error('获取webhook配置失败:', error);
    }
};

// 再次检测获取git_addr
const getAddr = async () => {
    try {
        const { data } = await getRestartDetectApi({
            subtask_id: route.query.sid as string,
            access_type: route.query.from as string,
        });
        detectInfo.repos.push({
            git_addr: data.addr,
            git_branch: data.branch,
        });
    } catch (error) {
        console.error(error);
    }
};

onBeforeMount(async () => {
    detectInfo.team_id = store.teamInfo.team_id;
    const { id, type, from } = route.query;
    if (!id) return;

    if (type === 'config' || type === 'restart') {
        await Promise.all([getProjectConfig(id as string, from as string), getAddr()]);
    } else if (from === 'gitlabwebhook') {
        await getWebhookConfig(id as string, from as string);
    }
});

onMounted(() => {
    window.onbeforeunload = () => '';
});

onUnmounted(() => {
    window.onbeforeunload = null;
});

</script>

<style lang='less' scoped>
.detect_head {
    height: 64px;
    padding: 0 24px;
    .between();
    background: linear-gradient(90deg, #6D38FF 0%, #385DFF 100%);
    color: #fff;

    img {
        width: 40px;
        height: 38px;
        margin-right: 15px;
        vertical-align: middle;
    }

    span {
        height: 22px;
        border-left: 1px solid #fff;
        padding-left: 15px;
    }

    .cancle_btn {
        width: 80px;
        background-color: #385DFF;
        color: #fff;
    }
}

.wrap {
    height: calc(100% - 126px);
    overflow: auto;
}

.btn {
    margin-top: 30px;
    margin-bottom: 30px;
    display: flex;
    justify-content: flex-end;

    .el-button {
        width: 80px;
    }
}

.fix-btn {
    width: 1205px;
    position: fixed;
    z-index: 999;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    background-color: #fff;
}
</style>
