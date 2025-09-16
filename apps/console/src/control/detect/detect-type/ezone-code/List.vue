<template>
    <div class="content">
        <!-- 列表 -->
        <div>
            <div class="g-flex-between">
                <div class="g-flex">
                    <div class="g-mr-8">
                        <el-select style="width: 180px" v-model="detectInfo.team_config_id"
                                   @change="changeTeamIdHandle">
                            <el-option
                                v-for="item in store.allAccessInfo.ezone_code.map((e: any) => ({ value: e.config_id, label: e.config_name }))"
                                :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                    </div>
                    <SearchComp placeholder="输入项目名回车搜索" v-model="reqData.keyword" clearable
                                @change="reqData.page = 1; listData = []; getListData();" />
                </div>

                <!-- <div>
                    <el-button class="minor_btn" style="height: 32px;width: auto;"
                               @click="changeTeamIdHandle('')">刷新列表</el-button>
                </div> -->
            </div>

            <!-- <div class="g-f-14 g-color-3 g-mr-8 g-mt-16" v-if="lastRefreshTime">
                列表于 {{ lastRefreshTime ? lastRefreshTime.split('+')[0] : '' }} 已更新
            </div> -->

            <div class="project_item" :class="{ 'active_item': item.checked }" v-for="item in listData" :key="item.id"
                 @click="handleItemClick(item)">
                <div style="display: flex;align-items: center; flex: 1; width: 0;">
                    <el-checkbox @click.stop v-model="item.checked" />
                    <div class="name truncate" style="flex:1;margin-right: 20px;">
                        代码项目名称：{{ item.name }}
                    </div>
                </div>
                <div class="w-[200px] truncate">
                    {{ item.createTime ? formatDate(item.createTime) : '' }}
                </div>
                <div class="w-[300px] truncate">
                    {{ item.desc }}
                </div>
                <div style="width: 150px;margin-right: 20px;">
                    <el-select @click.stop v-model="item.selectedBranch" size="small" placeholder="默认分支"
                               @visible-change="(visible: boolean) => dropOptionsHandle(item, visible)">
                        <el-option v-for="branch in item.branchOptions" :key="branch.name" :label="branch.name"
                                   :value="branch.name" />
                    </el-select>
                </div>
            </div>

            <NoData description="暂无数据" v-if="!isHaveAllData" />

            <div v-if="isHaveAllData && hasMoreData">
                <div v-if="!isNoMoreData" class="more" @click="loadMoreDataHandle">
                    点击加载更多
                </div>
                <div class="more" style="color: #858585;" v-else>
                    无更多数据
                </div>
            </div>
        </div>
    </div>

    <div class="fix-btn">
        <div class="btn" v-if="isHaveAllData">
            <el-button @click="nextStepHandle">下一步</el-button>
        </div>
    </div>
</template>

<script setup lang='ts'>
import {
    ref,
} from 'vue';
import { showMessage, formatDate } from 'util/tools';
import { useRouter, useRoute } from 'vue-router';
import store, { detectInfo } from 'util/store';
import { getEzoneCodeListApi, getEzoneCodeBranchApi } from 'api/detect';
// import {
//     lastRefreshTime,
// } from 'util/hook';
import SearchComp from '@/components/SearchComp.vue';
import NoData from '@/components/NoData.vue';

const router = useRouter();
const route = useRoute();
const total = ref<number>(0);
const listData = ref<Array<any>>([]);
const isHaveAllData = ref<boolean>(true);
const isNoMoreData = ref<boolean>(false);
const hasMoreData = ref<boolean>(false);

// 列表请求参数
const reqData = ref<any>({
    page: 1,
    page_size: 10,
    team_config_id: route.query.config_id || store.allAccessInfo.ezone_code[0]?.config_id,
    keyword: '',
});

// 检测配置信息
detectInfo.team_config_id = route.query.config_id || store.allAccessInfo.ezone_code[0]?.config_id;

// 获取状态颜色
// const getStatusColor = (status: string) => {
//     switch (status) {
//         case 'NORMAL':
//             return '#52c41a';
//         case 'ARCHIVED':
//             return '#faad14';
//         case 'LOCKED':
//             return '#f5222d';
//         default:
//             return '#666';
//     }
// };

// 获取状态文本
// const getStatusText = (status: string) => {
//     switch (status) {
//         case 'NORMAL':
//             return '正常';
//         case 'ARCHIVED':
//             return '已归档';
//         case 'LOCKED':
//             return '已锁定';
//         default:
//             return status;
//     }
// };

// 简单云代码仓库列表
const getListData = async () => {
    try {
        const res = await getEzoneCodeListApi(reqData.value);
        if (reqData.value.page === 1) {
            listData.value = res.data.list || [];
        } else {
            listData.value.push(...(res.data.list || []));
        }
        isNoMoreData.value = (res.data.list || []).length < reqData.value.page_size;
        isHaveAllData.value = listData.value.length > 0;
        hasMoreData.value = listData.value.length >= reqData.value.page_size;
        total.value = res.data.total || 0;
        listData.value.map((item: any) => {
            item.checked = !item.checked ? false : item.checked;
            return item;
        });
    } catch (error) {
        console.log(error);
    }
};
getListData();

// 选择配置ID
const changeTeamIdHandle = (value: string) => {
    reqData.value.page = 1;
    listData.value = [];
    reqData.value.team_config_id = value || reqData.value.team_config_id;
    detectInfo.team_config_id = value || detectInfo.team_config_id;
    getListData();
};

// 加载更多
const loadMoreDataHandle = () => {
    reqData.value.page += 1;
    getListData();
};

// 处理项目点击
const handleItemClick = (item: any) => {
    item.checked = !item.checked;
};

// 获取分支信息
const dropOptionsHandle = async (item: any, visible: boolean) => {
    if (visible && !item.branchOptions) {
        try {
            const res = await getEzoneCodeBranchApi({
                team_config_id: detectInfo.team_config_id,
                repo_key: item.id,
            });
            item.branchOptions = res.data.list || [];
        } catch (error) {
            console.log(error);
            showMessage('获取分支列表失败', 'error');
        }
    }
};

// 下一步
const nextStepHandle = () => {
    const filterData = listData.value.filter((item: any) => item.checked).map((ele: any) => ({
        git_addr: ele.cloneUrl?.http,
        git_branch: ele.selectedBranch,
        // repo_id: ele.id,
        // repo_name: ele.name,
    }));
    console.log(filterData);

    if (!filterData.length) {
        showMessage('请选择项目', 'warning');
        return;
    }
    detectInfo.repos = filterData;
    // detectInfo.detect_type = 4;
    router.push('/detect-config?from=ezone_code');
};
</script>

<style lang='less' scoped>
.top_btn {
    margin-bottom: 16px;
    .between();
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

.content {
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

    .project_item {
        display: flex;
        align-items: center;
        gap: 24px;
        height: 48px;
        background: #FFFFFF;
        border: 1px solid #C7C7C7;
        border-radius: 6px;
        padding-left: 24px;
        margin-top: 12px;
        cursor: pointer;

        .name {
            margin: 0 16px;
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
        background: rgba(108, 135, 255, 0.1);
        border: 1px solid #6C87FF;
    }
}

.btn {
    float: right;
    margin-top: 30px;
    margin-bottom: 30px;
}
</style>
