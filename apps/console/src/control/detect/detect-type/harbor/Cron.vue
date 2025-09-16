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
                选择已接入的Harbor
            </div>
            <el-select @change="getTimeConfig" v-model="detectInfo.team_config_id">
                <el-option
                    v-for="item in store.allAccessInfo.harbor.map((e: any) => ({ value: e.config_id, label: e.config_name }))"
                    :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
        </div>

        <div>
            <div class="g-p-16 g-bdr-6 g-bg-ff g-mb-16">
                <div class="g-color-3 g-mb-16 g-fw-500">设置检测范围</div>

                <div class="g-mb-8 g-fw-500">指定镜像</div>
                <el-tree-select v-if="isShowTree" ref="treeRef" collapse-tags @node-expand="expandNode"
                                v-model="treeValue" :disabled="isConfig" lazy multiple value-key="key"
                                node-key="key" :props="{
                                    label: 'node_name',
                                    isLeaf: 'has_child',
                                }" show-checkbox :load="loadTreeNode" :default-expanded-keys="defauleExpands"
                                :default-checked-keys="defauleCheck" style="width: 100%;margin-bottom: 24px;" @check="checkNode"
                                :placeholder="loadingNodes.length ? '正在加载当前镜像...' : '请选择镜像'">
                </el-tree-select>

                <div class="g-mb-8 g-fw-500">版本</div>
                <el-radio-group :disabled="isConfig" class="mb-6" v-model="detectInfo.harbor_is_only_least_version">
                    <el-radio :label="false">全部版本</el-radio>
                    <el-radio :label="true">最新版本</el-radio>
                </el-radio-group>

                <!-- <el-select :disabled="isConfig" v-model="detectInfo.harbor_repositories" value-key="addr" clearable filterable multiple placeholder="请选择仓库"
                           style="width: 370px">
                    <el-option v-for="item in listData" :key="item.url" :label="item.name"
                               :value="item" />
                    <template v-if="filterOptions.page!==0" #footer>
                        <div class="flex justify-center">
                            <span @click="filterOptions.page++; getData()" class="button-text-blue">加载更多</span>
                        </div>
                    </template>
</el-select> -->
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
import store, { detectInfo } from 'util/store';
import { sortObjectKeys } from 'util/tools';
import {
    getDetectConfigApi, timeExcDelApi, getRepoListApi, getRepoTreeDataApi,
} from 'api/detect';
import CronDialog from '../../components/CronDialog.vue';
import CronExcRecords from '../../components/CronExcRecords.vue';

defineProps(['repoKeysOptions']);
const router = useRouter();
const isConfig = ref<boolean>(false);
const dialogVisible = ref(false);
const excModal = ref(false);

const treeRef = ref();
const treeValue = ref<string[]>([]);
const defauleExpands = ref<string[]>([]);
const defauleCheck = ref<string[]>([]);
const isShowTree = ref<boolean>(false);
const loadingNodes = ref<string[]>([]);

// 定时配置
const getTimeConfig = async (id: string) => {
    isShowTree.value = false;
    try {
        const { data } = await getDetectConfigApi({
            team_config_id: id,
            access_type: 'harbor',
            config_type: 'cron',
        });
        isShowTree.value = true;
        detectInfo.crontab_spec = '';
        treeValue.value = [];
        detectInfo.harbor_cron_filter = [];
        isConfig.value = Boolean(data.crontab_spec);
        if (isConfig.value) {
            Object.assign(detectInfo, data);
            const value = (detectInfo.harbor_cron_filter || []).map((item: any) => JSON.stringify(sortObjectKeys(item))) as any;

            defauleExpands.value = detectInfo.tree_expands_nodes;
            if (!defauleExpands.value.length) {
                treeValue.value = value;
            }
            defauleCheck.value = value;
        }
    } catch (error) {
        console.log(error);
    }
};
getTimeConfig(detectInfo.team_config_id);

// 检查是否所有需要展开的节点都已加载完成
const checkAllNodesLoaded = () => {
    if (loadingNodes.value.length === 0) {
        console.log('所有默认展开节点加载完成');
        // 这里可以触发你的回调函数
        treeValue.value = (detectInfo.harbor_cron_filter || []).map((item: any) => JSON.stringify(sortObjectKeys(item))) as any;
    }
};

// 默认展开的节点
const expandNode = (data: any) => {
    if (treeRef.value.getCheckedKeys().includes(data.key) && !detectInfo.tree_expands_nodes.includes(data.key)) {
        detectInfo.tree_expands_nodes.push(data.key);
    }
    // if (node.halfCheckedKeys.length > 0) {
    //     detectInfo.tree_expands_nodes = [...node.halfCheckedKeys, ...node.checkedKeys];
    // } else {
    //     detectInfo.tree_expands_nodes = node.checkedKeys;
    // }
};

const checkNode = (data: any, node: any) => {
    const currentKey = data.key;
    const updatedNodes = node.halfCheckedKeys.length > 0
        ? [...node.halfCheckedKeys, ...node.checkedKeys]
        : node.checkedKeys;

    detectInfo.tree_expands_nodes = updatedNodes.filter((key: string) => key !== currentKey);
};

// 懒加载树
const loadTreeNode = async (node: any, resolve: Function) => {
    const nodeKey = node.data?.key || 'root';
    if (defauleExpands.value.length && defauleExpands.value?.includes(nodeKey)) {
        loadingNodes.value.push(nodeKey);
    }

    if (!node.data.node_name) {
        // 仓库
        const { data } = await getRepoListApi({
            access_type: 'harbor',
            team_config_id: detectInfo.team_config_id,
            team_id: store.teamInfo.team_id,
        });
        data.forEach((ele: any) => {
            ele.key = JSON.stringify(sortObjectKeys(ele));
            ele.node_name = ele.repo_name;
            ele.has_child = false;
        });
        resolve(data);
        if (defauleExpands.value.length && defauleExpands.value?.includes(nodeKey)) {
            loadingNodes.value = loadingNodes.value.filter((key) => key !== nodeKey);
            checkAllNodesLoaded();
        }
    } else {
        // tree
        const { data } = await getRepoTreeDataApi({
            access_type: 'harbor',
            team_config_id: detectInfo.team_config_id,
            parent_directory: node.data?.current_directory || node.data?.node_name,
        });
        data.list?.forEach((item: any) => {
            item.key = JSON.stringify(sortObjectKeys(item));
            item.has_child = !item.has_child;
        });
        resolve(data.list);
        if (defauleExpands.value.length && defauleExpands.value?.includes(nodeKey)) {
            loadingNodes.value = loadingNodes.value.filter((key) => key !== nodeKey);
            checkAllNodesLoaded();
        }
    }
};

const delConfig = async () => {
    try {
        await timeExcDelApi({
            team_config_id: detectInfo.team_config_id,
            access_type: 'harbor',
        });
        isConfig.value = false;
        detectInfo.crontab_spec = '';

        detectInfo.harbor_cron_filter = [];
        treeValue.value = [];
        defauleExpands.value = [];
        defauleCheck.value = [];
    } catch (error) {
        console.log(error);
    }
};

// 下一步
const nextStepHandle = () => {
    detectInfo.repository_type = '';
    detectInfo.harbor_cron_filter = treeValue.value.map((item: any) => JSON.parse(item));
    detectInfo.access_type = 'harbor';
    detectInfo.config_type = 'cron';
    router.push('/detect-config?from=harbor&type=detectConfig');
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
</style>
