<template>
    <div class="filter_wrap">
        <SearchComp v-model="filterOptions.param" clearable placeholder="请搜索私有源名称" />
        <el-button v-if="normalTeamAuth||isUserSpace" @click="showAddModal = true">添加私有源配置</el-button>
    </div>

    <div style="height: calc(100% - 70px);">
        <TableComp height="100%" :data="listData">
            <el-table-column label="ID" prop="id" />
            <el-table-column label="私有源名称" width="200" prop="name" show-overflow-tooltip />
            <el-table-column label="描述" prop="desc" width="200">
                <template #default="scope">
                    <el-tooltip placement="top">
                        <template #content>
                            <div style="max-width: 344px;">
                                {{ scope.row.desc || '暂无'}}
                            </div>
                        </template>
                        <div class="ellipsis g-display-inline-block" style="max-width: 200px;">{{ scope.row.desc || '暂无' }}</div>
                    </el-tooltip>
                </template>
            </el-table-column>
            <!-- <el-table-column label="所属组织" width="140" prop="org_name" show-overflow-tooltip />

            <el-table-column label="所属团队" width="140" prop="team_name" show-overflow-tooltip /> -->
            <el-table-column label="添加人" width="140">
                <template #default="scope">
                    <UserComp :name="scope.row.username" />
                </template>
            </el-table-column>
            <el-table-column label="添加时间" prop="created_at" width="180">
                <template #default="scope">
                    <div>
                        {{ formatDate(scope.row.created_at) }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
                <template #default="scope">
                    <div class="flex items-center">
                        <span @click="downloadFile(downloadPrivateUrl, scope.row.id, scope.row.name)" class="button-text-blue">
                            下载
                            <!-- <a :href="downloadPrivateUrl(scope.row.id)" target="_blank">下载</a> -->
                        </span>
                        <el-popconfirm popper-class="cancle-popper confirm-popper" @confirm="deletePrivate(scope.row.id)" width="200" title="确定删除此私有源配置？">
                            <template #reference>
                                <span class="button-text-red">删除</span>
                            </template>
                        </el-popconfirm>
                    </div>
                </template>
            </el-table-column>
        </TableComp>

        <!-- <PageComp /> -->
    </div>

    <el-dialog v-model="showAddModal" @close="formData = {
        name: '',
        file_bases64: '',
        desc: '',
    };verify=true" width="664" title="添加私有源配置" :close-on-click-modal="false">
        <div class="g-mb-24">
            <div class="g-f-14 g-color-1 g-mb-8">
                <span style="color: #F34D3D;">*</span>
                私有源名称
            </div>
            <el-input v-model="formData.name" @input="inputPrivateName" @change="changePrivateName" placeholder="请输入私有源名称" maxlength="30"
                      show-word-limit></el-input>
            <div v-if="!verify" class="g-f-12 g-mt-4 g-color-err">支持中文、英文、数字及特殊字符 - _ .</div>
        </div>

        <div class="g-mb-24">
            <div class="g-f-14 g-color-1 g-mb-8">
                <span style="color: #F34D3D;">*</span>
                文件上传
            </div>
            <div class="g-bg-f7 g-p-24 g-bdr-6">
                <el-upload ref="upload" :headers="{'Authorization': getUserInfo()?.token}" :before-upload="beforeUpload" :action="uploadPrivateApi()" :on-exceed="handleExceed" :on-success="successUpload" :limit="1" :show-file-list="true" drag>
                    <div class="upload_text">
                        <!-- <i class="murphy icon-shangchuan upload_icon"></i> -->
                        <img class="w-10 h-10 mb-2" src="~ast/img/upload_add.png" alt="">
                        <p class="g-color-1">将文件拖拽至此区域或<span>选择文件上传</span></p>
                        <p>仅支持.xml文件格式，大小不超过10MB</p>
                    </div>
                </el-upload>
            </div>
        </div>

        <div class="g-mb-24">
            <div class="g-f-14 g-color-1 g-mb-8">
                描述
            </div>
            <el-input v-model="formData.desc" type="textarea" placeholder="请输入描述" maxlength="200"
                      show-word-limit></el-input>
        </div>

        <div class="group-btn">
            <el-button @click="showAddModal = false; formData = {
                name: '',
                file_bases64: '',
                desc: '',
            };verify=true">取消</el-button>
            <el-button @click="addPrivate">确认</el-button>
        </div>
    </el-dialog>
</template>

<script setup lang='ts'>
import UserComp from 'comp/UserComp.vue';
import TableComp from 'comp/TableComp.vue';
import { ref } from 'vue';
import useList from 'util/hook';
import {
    getPrivateListApi, downloadPrivateUrl, delPrivateApi, verifyPrivateNameApi, addPrivateApi, uploadPrivateApi,
} from 'api/detect';
import { genFileId } from 'element-plus';
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus';
import SearchComp from '@/components/SearchComp.vue';
import {
    formatDate, showMessage, getUserInfo, downloadFile,
} from '@/utils/tools';
import store from '@/utils/store';
import { getOrgAuthInfo } from '@/control/org/hooks';

const showAddModal = ref(false);
const verify = ref<boolean>(true);
const filterOptions = ref<any>({
    team_id: store.teamInfo.team_id,
    param: '',
});
const {
    normalTeamAuth, isUserSpace,
} = getOrgAuthInfo();

const formData = ref({
    name: '',
    file_bases64: '',
    desc: '',
});

const {
    listData,
    getData,
} = useList(getPrivateListApi, filterOptions);

const upload = ref<UploadInstance>();
const handleExceed: UploadProps['onExceed'] = (files) => {
    upload.value!.clearFiles();
    const file = files[0] as UploadRawFile;
    file.uid = genFileId();
    upload.value!.handleStart(file);
    upload.value!.submit();
};

const beforeUpload = (rawFile: any) => {
    // 1*1024*1024*10
    if (rawFile.size > 10485760) {
        showMessage('文件大小不超过10MB', 'warning');
        return false;
    }
    const types = ['xml'];
    if (!types.includes(rawFile.name.split('.')[rawFile.name.split('.').length - 1])) {
        showMessage('文件格式错误', 'warning');
        return false;
    }
};

const changePrivateName = async (name: string) => {
    if (name) {
        try {
            await verifyPrivateNameApi({
                team_id: store.teamInfo.team_id,
                name,
            });
        } catch (error) {
            console.log(error);
        }
    }
};

const inputPrivateName = (value:string) => {
    // eslint-disable-next-line no-useless-escape
    const reg = /[\u4e00-\u9fa5\w\-\_\.]+$/g;
    verify.value = reg.test(value);
};

const successUpload = (res: any) => {
    formData.value.file_bases64 = res;
};

const addPrivate = async () => {
    if (!verify.value) return;
    if (!formData.value.name || !formData.value.file_bases64) {
        showMessage('必填项不能为空', 'warning');
        return;
    }
    try {
        await addPrivateApi({
            team_id: store.teamInfo.team_id,
            ...formData.value,
        });
        showMessage('添加成功', 'success');
        getData();
        showAddModal.value = false;
        formData.value = {
            name: '',
            file_bases64: '',
            desc: '',
        };
        verify.value = true;
    } catch (error) {
        console.log(error);
    }
};

const deletePrivate = async (id: string) => {
    try {
        await delPrivateApi(id);
        showMessage('删除成功', 'success');
        getData();
    } catch (error) {
        console.log(error);
    }
};
</script>

<style scoped lang='less'>
.title {
    font-weight: 600;
    color: @text-color;
    margin-bottom: 8px;
}

.desc {
    font-size: 14px;
    color: #858585;
    margin-bottom: 24px;
}

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

.filter_wrap {
    margin-bottom: 16px;
    .between();

    .minor_btn {
        height: 32px;
        width: auto;
    }
}
</style>
