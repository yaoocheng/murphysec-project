<template>
    <CommonHead>
        <span>组织管理</span>
    </CommonHead>

    <div class="main_content g-overflow-auto g-flex ">
        <div class="g-bg-ff g-bdr-4 g-mr-6" style="width: 300px;">
            <div class="flex justify-between items-center g-f-14 g-color-1 g-p-20 g-fw-500 mb-4"
                 style="border-bottom: 1px solid #F7F8FB;">
                <span>组织架构</span>

                <el-tooltip v-if="userRole === 'SA' && store.conf.is_open_team_ext" content="批量导入团队"
                            placement="top">
                    <span @click="isShowImportTeamModal = true" class="hover_icon py-[3px] px-[6px]">
                        <img class="w-3" src="~ast/img/import-team.png" alt="">
                    </span>
                </el-tooltip>
            </div>

            <div class="g-pl-12 g-pr-12 g-border-box g-overflow-auto" style="height: calc(100% - 75px)">
                <el-tree v-if="showTree" node-key="id" :default-expanded-keys="defaultExpand" class="flow-tree"
                         @node-click="treeNodeClick" :load="loadTreeNode" lazy>
                    <template #default="{ data }">
                        <div :class="{ 'active-org': curOrgInfo.id === data.id }"
                             class="tree_content g-flex g-align-center g-justify-between">
                            <div class="g-mr-8 ellipsis" style="width: 150px;">
                                {{ data.name }}
                            </div>
                            <div class="g-flex g-align-center operate g-mr-8">
                                <span v-if="userRole === 'SA' || ownerOrgIDList.includes(data.id)" class="hover_icon">
                                    <i class="murphy icon-jia"
                                       @click.stop="showCreateOrgModal = true; modalType = 'add'; curOrgInfo = data"></i>
                                </span>
                                <el-tooltip v-if="userRole === 'SA' || ownerOrgIDList.includes(data.id)"
                                            popper-class="org-edit-poper" effect="light" trigger="click">
                                    <template #content>
                                        <div @click.stop="showCreateOrgModal = true; modalType = 'edit'; curOrgInfo = data"
                                             class="g-color-1 member-tree-edit">
                                            编辑
                                        </div>
                                        <div v-if="data.pid !== 1"
                                             @click.stop="showConfirmModal = true; curOrgInfo = data"
                                             class="member-tree-edit" style="color: #F34D3D;">
                                            删除
                                        </div>
                                    </template>
                                    <span class="hover_icon" @click.stop>
                                        <i class="murphy icon-diandian"></i>
                                    </span>
                                </el-tooltip>
                            </div>
                        </div>
                    </template>
                </el-tree>
            </div>
        </div>
        <div class="g-flex-grow-1 g-bg-ff g-bdr-4 g-w-0">
            <div class="g-f-14 g-color-1 g-p-16 g-fw-500 g-f-16">{{ curOrgInfo.name || '' }}</div>
            <div class="g-pr-16 g-pl-16 g-pb-16 g-border-box">
                <el-tabs v-model="tabsVal">
                    <el-tab-pane label="成员" name="1">
                        <MemberList :ownerOrgIDList="ownerOrgIDList" />
                    </el-tab-pane>
                    <el-tab-pane label="团队" name="2">
                        <TeamList :ownerOrgIDList="ownerOrgIDList" />
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>

    <!-- 创建组织 -->
    <CreateOrgModal v-model="showCreateOrgModal" v-if="showCreateOrgModal" :modalType="modalType"
                    @updateOrgTree="updateOrgTree" />

    <!-- 确认 -->
    <ConfirmModal @confirm="confirm" v-model="showConfirmModal" v-if="showConfirmModal">
        <template #header>
            确定删除此组织？
        </template>
    </ConfirmModal>

    <el-dialog @closed="reload" v-model="isShowImportTeamModal" width="600px">
        <template #header>
            <div class="text-base font-medium text-3c mb-2">
                批量导入团队
            </div>
            <div class="text-sm text-85 font-normal">
                请先 <a href="/console/team-template.xlsx" target="view_window" download="团队导入模板.xlsx"><span
                    class="text-primary">下载模板</span></a>，按照表格规范填写后上传
            </div>
        </template>
        <div>
            <el-upload ref="uploadRef" :auto-upload="true" :before-upload="beforeUpload" :action="batchAddTeamApi()"
                       :on-success="upSucc" :headers="{ Authorization: store.userInfo.token }" :limit="1"
                       :show-file-list="true" drag>
                <div class="upload_text">
                    <!-- <i class="murphy icon-shangchuan upload_icon"></i> -->
                    <img class="w-10 h-10 mb-2" src="~ast/img/upload_add.png" alt="">
                    <p class="text-3c">将文件拖拽至此区域或 <span>选择文件上传</span></p>
                    <p>仅支持：EXCEL，大小不超过 500MB</p>
                </div>
            </el-upload>
        </div>

        <!-- <template #footer>
            <div class="group-btn">
                <el-button @click="isShowImportTeamModal = false;">取消</el-button>
                <el-button @click="confirmImportTeam">确认</el-button>
            </div>
        </template> -->
    </el-dialog>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import store from 'util/store';
import { delOrgApi, batchAddTeamApi } from 'api/org';
import bus, {
    showMessage,
} from 'util/tools';
import { ElNotification } from 'element-plus';
import { getOrgAuthInfo, updateUserManage } from '@/control/org/hooks';
import { curOrgInfo, loadTreeNode, treeNodeClick } from './hooks';
import ConfirmModal from './component/ConfirmModal.vue';
import CreateOrgModal from './CreateOrgModal.vue';
import CommonHead from '@/components/CommonHead.vue';
import MemberList from './MemberList.vue';
import TeamList from './TeamList.vue';

const {
    ownerOrgIDList, userRole,
} = getOrgAuthInfo();

const showTree = ref<boolean>(true);
const tabsVal = ref<string>('1');
const showCreateOrgModal = ref<boolean>(false);
const showConfirmModal = ref<boolean>(false);
const modalType = ref<string>('add');
const defaultExpand = ref<number[]>([1, 2]);
const isShowImportTeamModal = ref<boolean>(false);
const uploadRef = ref();

const upSucc = async (response: any) => {
    if (!response.msg) {
        showMessage('导入成功', 'success');
    } else if (!response.download_url) {
        uploadRef.value.clearFiles();
        showMessage(response.msg, 'error');
    } else {
        uploadRef.value.clearFiles();
        ElNotification({
            type: 'error',
            duration: 0,
            showClose: true,
            title: '导入失败',
            // onClose: () => window.location.reload(),
            dangerouslyUseHTMLString: true,
            // onClick: downloadErrorExcle,
            message: `导入成功数据 ${response?.success_count} 条，导入失败数据 ${response?.err_count} 条，请点击 <a href="${response.download_url}" class="text-primary cursor-pointer">下载</a> 失败数据，重新填写后上传！`,
        });
    }
};

function reload() {
    window.location.reload();
}

const updateOrgTree = async () => {
    showTree.value = false;
    const path = curOrgInfo.value.path.split(',')?.map((item: any) => +item)?.filter((item: any) => item);
    defaultExpand.value = path;

    // 更新用户负责组织架构信息
    try {
        await updateUserManage();

        // eslint-disable-next-line no-restricted-syntax
        for (const key in store.userInfo?.org_list) {
            if (store.userInfo?.org_list[key]) {
                ownerOrgIDList.value.push(Number(key));
            }
        }
        bus.emit('updateMember');
        showTree.value = true;
    } catch (error) {
        console.log(error);
    }
};

const confirm = async () => {
    try {
        await delOrgApi(curOrgInfo.value.id);
        showConfirmModal.value = false;
        updateOrgTree();
        showMessage('操作成功', 'success');
    } catch (error) {
        console.log(error);
    }
};

const beforeUpload = (file: any) => {
    const arr = file.name.split('.');
    if (arr[arr.length - 1] !== 'xlsx') {
        showMessage('文件类型不正确', 'error');
        return false;
    }
};
// const confirmImportTeam = () => {
//     uploadRef.value.submit();
    // isShowImportTeamModal.value = false;
    // isUpload.value = false;
// };
</script>

<style scoped lang='less'>
.upload_text {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    i {
        font-size: 60px;
        margin-bottom: 20px;
        color: #6c87ff;
    }

    p {
        span {
            color: #6c87ff;
        }

        &:nth-of-type(2) {
            color: #999;
            margin-top: 8px;
        }

        font-size: 13px;
    }
}

:deep(.el-tree-node__content) {
    height: 38px;

    // width: 275px;
    .el-icon {
        font-size: 14px;
    }

    .tree_content {
        // &:hover {
        //     background-color: #ebebeba0;
        // }

        // .operate {
        //     display: none;
        // }

        width: 100%;
        padding: 8px 0;
        padding-left: 0px;
        font-size: 14px;
        color: @text-color;
        border-radius: 4px;
        padding-left: 8px;
        // .ellipsis();

        .hover_icon {
            &:hover {
                background-color: rgba(108, 135, 255, 0.10);
            }

            color: #6C87FF;
            padding: 4px 5px;
            padding-bottom: 0;
        }
    }

    .active-org.tree_content {
        color: #6c87ff;

    }

    .folder {
        font-size: 12px;
        margin-right: 6px;
        color: #FFCB1F;
    }

    i {
        vertical-align: 3px;
    }
}

:deep(.el-tabs__item) {
    font-size: 16px;
}

.member-tree-edit {
    width: 70px;
    padding: 6px 0;
    box-sizing: border-box;
    text-align: center;
    font-size: 14px;
    border-radius: 6px;
    cursor: pointer;

    &:hover {
        background-color: #EBEBEB80;
    }
}
</style>

<style lang="less">
.org-edit-poper {
    padding: 8px 4px;
}
</style>
