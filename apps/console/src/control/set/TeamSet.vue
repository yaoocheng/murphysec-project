<template>
    <div class="set_info">
        <div class="flex">
            <span class="g-p-8 g-bdr-6 g-mr-8" style="background-color: rgba(108, 135, 255, 0.10);">
                <i class="murphy icon-tuanduiguanli g-color-5"></i>
            </span>
            <span class="g-f-20 g-fw-400 g-color-1 g-mr-8">
                {{ isUserSpace ? '个人空间' : store.teamInfo.team_name }}
            </span>
            <div v-if="!isUserSpace" @click="editModal = true" class="button-icon-grey">
                <!-- <i v-if="!isUserSpace" @click="editModal = true"
                   class="murphy icon-bianji g-fw-bold g-color-3 g-cursor-pointer"></i> -->
                <i class="murphy icon-bianji"></i>
            </div>
        </div>
        <div class="g-mt-16 g-mb-24 g-f-14 g-fw-400 g-color-3">
            团队ID: {{ store.teamInfo.team_id }}
        </div>

        <div>
            <!-- <div class="g-f-18 g-fw-500 g-color-1 g-mb-16">通用</div> -->

            <div class="g-w-100 g-flex g-justify-between g-align-center g-mb-16 g-pb-16"
                 style="border-bottom:1px solid rgba(42, 43, 50, 0.10);">
                <div>
                    <div class="g-fw-500 g-f-14 g-color-1 g-mb-8">
                        安全报告分享设置
                    </div>
                    <div class="g-fw-400 g-f-12 g-color-3">
                        设置后，会影响客户端和 OpenAPl 检测结果中的检测报告分享链接有效期
                    </div>
                </div>
                <el-button
                    @click="shareReportSetModal = true; reportModalData = reportSelect; reportModalData.type = 1;"
                    class="minor_btn" style="width: 80px; height: 32px">设置</el-button>
            </div>

            <div class="g-w-100 g-flex g-justify-between g-align-center g-mb-16 g-pb-16"
                 style="border-bottom:1px solid rgba(42, 43, 50, 0.10);">
                <div>
                    <div class="g-fw-500 g-f-14 g-color-1 g-mb-8">
                        安全问题分享设置
                    </div>
                    <div class="g-fw-400 g-f-12 g-color-3">
                        设置后，会影响客户端和 OpenAPl 检测结果中的检测问题分享链接有效期
                    </div>
                </div>
                <el-button @click="shareReportSetModal = true; reportModalData = issueSelect; reportModalData.type = 2;"
                           class="minor_btn" style="width: 80px; height: 32px">设置</el-button>
            </div>

            <!-- <div style="border: 1px solid #2A2B321A;" class="g-bdr-6 g-mb-24 g-w-100 g-p-24 g-border-box">
                <el-checkbox style="height: auto;" class="g-mb-12 g-f-16" :true-label="1" :false-label="2"
                    v-model="reportSelect.status" size="large">
                    <template #default>
                        <div class="g-f-16 g-fw-500">
                            自动生成检测报告分享链接
                        </div>
                    </template>
</el-checkbox>
<div class="g-mb-16 g-fw-400 g-f-12 g-color-3 g-pl-24">开启后，会在客户端和 OpenAPI 检测结果中增加生成的检测报告分享链接</div>
<div v-if="reportSelect.status === 1" class="g-bg-f7 g-bdr-6 g-p-24">
    <div class="g-f-14 g-fw-500 g-color-1">获得链接的人</div>
    <el-radio-group class="g-mb-24" v-model="reportSelect.allow_action">
        <el-radio :label="12" size="large">可查看报告（匿名）</el-radio>
        <el-radio :label="11" size="large">加入团队后可编辑报告（登录后）</el-radio>
    </el-radio-group>

    <div class="g-f-14 g-fw-500 g-color-1">链接有效期</div>
    <el-radio-group v-model="reportSelect.expire_day">
        <el-radio :label="14" size="large">14天有效</el-radio>
        <el-radio :label="-1" size="large">永久有效</el-radio>
    </el-radio-group>
</div>
</div>

<div style="border: 1px solid #2A2B321A;" class="g-bdr-6 g-mb-24 g-w-100 g-p-24 g-border-box">
    <el-checkbox style="height: auto;" class="g-mb-12 g-f-16" :true-label="1" :false-label="2"
        v-model="issueSelect.status" size="large">
        <template #default>
                        <div class="g-f-16 g-fw-500">
                            自动生成安全问题分享链接
                        </div>
                    </template>
    </el-checkbox>
    <div class="g-mb-16 g-fw-400 g-f-12 g-color-3 g-pl-24">开启后，可通过 OpenAPI 获取安全问题分享链接</div>
    <div v-if="issueSelect.status === 1" class="g-bg-f7 g-bdr-6 g-p-24">
        <div class="g-f-14 g-fw-500 g-color-1">获得链接的人</div>
        <el-radio-group class="g-mb-24" v-model="issueSelect.allow_action">
            <el-radio :label="12" size="large">可查看安全问题（匿名）</el-radio>
            <el-radio :label="11" size="large">加入团队后可编辑安全问题（登录后）</el-radio>
        </el-radio-group>

        <div class="g-f-14 g-fw-500 g-color-1">链接有效期</div>
        <el-radio-group v-model="issueSelect.expire_day">
            <el-radio :label="14" size="large">14天有效</el-radio>
            <el-radio :label="-1" size="large">永久有效</el-radio>
        </el-radio-group>
    </div>
</div> -->
        </div>

        <div v-if="!isUserSpace && normalTeamAuth"
             class="g-w-100 g-flex g-justify-between g-align-center g-mb-16 g-pb-16"
             style="border-bottom:1px solid rgba(42, 43, 50, 0.10);">
            <div>
                <div class="g-fw-500 g-f-14 g-color-1 g-mb-8">
                    解散团队
                </div>
                <div class="g-fw-400 g-f-12 g-color-3">
                    团队解散后，该团队及相关数据将不存在，请谨慎操作
                </div>
            </div>
            <el-button
                @click="quitHandle(store.teamInfo.team_name, store.teamInfo.owner_user_id, store.teamInfo.team_id, 1)"
                class="red g-bg-ff g-color-err"
                style="border:1px solid #F34D3D;width: 80px; height: 32px">解散</el-button>
        </div>

        <div v-if="!normalTeamAuth && !isUserSpace"
             class="g-w-100 g-flex g-justify-between g-align-center g-mb-16 g-pb-16"
             style="border-bottom:1px solid rgba(42, 43, 50, 0.10);">
            <div>
                <div class="g-fw-500 g-f-14 g-color-1 g-mb-8">
                    退出团队
                </div>
                <div class="g-fw-400 g-f-12 g-color-3">
                    退出团队后，将无法进入该团队，请谨慎操作
                </div>
            </div>
            <el-button
                @click="quitHandle(store.teamInfo.team_name, store.teamInfo.owner_user_id, store.teamInfo.team_id, 2)"
                class="red g-bg-ff g-color-err"
                style="border:1px solid #F34D3D; width: 80px; height: 32px;">退出</el-button>
        </div>

        <!-- 改名 -->
        <el-dialog v-model="editModal" @closed="reload" :title="`${normalTeamAuth ? '修改' : ''}团队信息`"
                   :close-on-click-modal="false" width="600px">
            <div class="max-h-[400px] overflow-auto">
                <FormComp class="create-org-form" label-position="top" :hide-required-asterisk="false">
                    <el-form-item label="团队名称" :required="normalTeamAuth">
                        <el-input v-if="normalTeamAuth" v-model.trim="formData.team_name" placeholder="请输入团队名称"
                                  maxlength="30" show-word-limit></el-input>
                        <div v-else class="font-normal text-3c">{{ formData.team_name }}</div>
                    </el-form-item>

                    <div v-if="store.conf.is_open_team_ext" @click="expand = !expand"
                         class="cursor-pointer flex items-center mb-4 text-sm text-85">更多信息配置
                        <ExpandIcon :type="'t'" :expand="expand" />
                    </div>

                    <div v-if="expand && store.conf.is_open_team_ext">
                        <el-form-item label="团队编号">
                            <el-input v-if="normalTeamAuth" v-model.trim="formData.team_serial_name"
                                      placeholder="请输入团队编号" maxlength="30" show-word-limit></el-input>
                            <div v-else class="font-normal text-3c">{{ formData.team_serial_name || '-' }}</div>
                        </el-form-item>

                        <el-form-item label="团队中文简称">
                            <el-input v-if="normalTeamAuth" v-model.trim="formData.team_zh_short_name"
                                      placeholder="请输入团队中文简称" maxlength="30" show-word-limit></el-input>
                            <div v-else class="font-normal text-3c">{{ formData.team_zh_short_name || '-' }}</div>
                        </el-form-item>

                        <el-form-item label="团队英文简称">
                            <el-input v-if="normalTeamAuth" v-model.trim="formData.team_en_short_name"
                                      placeholder="请输入团队英文简称" maxlength="30" show-word-limit></el-input>
                            <div v-else class="font-normal text-3c">{{ formData.team_en_short_name || '-' }}</div>

                        </el-form-item>

                        <el-form-item label="团队状态">
                            <el-input v-if="normalTeamAuth" v-model.trim="formData.team_status" placeholder="请输入团队状态"
                                      maxlength="30" show-word-limit></el-input>
                            <div v-else class="font-normal text-3c">{{ formData.team_status || '-' }}</div>

                        </el-form-item>

                        <el-form-item label="团队重要性等级">
                            <el-input v-if="normalTeamAuth" v-model.trim="formData.team_importance"
                                      placeholder="请输入团队重要性等级" maxlength="30" show-word-limit></el-input>
                            <div v-else class="font-normal text-3c">{{ formData.team_importance || '-' }}</div>

                        </el-form-item>

                        <el-form-item label="恢复优先级">
                            <el-input v-if="normalTeamAuth" v-model.trim="formData.recovery_priority"
                                      placeholder="请输入恢复优先级" maxlength="30" show-word-limit></el-input>
                            <div v-else class="font-normal text-3c">{{ formData.recovery_priority || '-' }}</div>

                        </el-form-item>

                        <el-form-item label="安全风险等级">
                            <el-input v-if="normalTeamAuth" v-model.trim="formData.security_risk_level"
                                      placeholder="请输入安全风险等级" maxlength="30" show-word-limit></el-input>
                            <div v-else class="font-normal text-3c">{{ formData.security_risk_level || '-' }}</div>

                        </el-form-item>

                        <el-form-item label="安全保护等级">
                            <el-input v-if="normalTeamAuth" v-model.trim="formData.security_protection_level"
                                      placeholder="请输入安全保护等级" maxlength="30" show-word-limit></el-input>
                            <div v-else class="font-normal text-3c">{{ formData.security_protection_level || '-' }}
                            </div>

                        </el-form-item>

                        <el-form-item label="开发语言">
                            <el-input v-if="normalTeamAuth" v-model.trim="formData.program_language"
                                      placeholder="请输入开发语言" maxlength="30" show-word-limit></el-input>
                            <div v-else class="font-normal text-3c">{{ formData.program_language || '-' }}</div>
                        </el-form-item>

                        <el-form-item label="开发厂商信息">
                            <el-input v-if="normalTeamAuth" v-model.trim="formData.program_company"
                                      placeholder="请输入开发厂商信息" maxlength="100" show-word-limit></el-input>
                            <div v-else class="font-normal text-3c">{{ formData.program_company || '-' }}</div>
                        </el-form-item>
                    </div>
                </FormComp>
            </div>

            <template v-if="normalTeamAuth" #footer>
                <div class="group-btn">
                    <el-button class="cancle_btn" @click="editModal = false; reload()">取消</el-button>
                    <el-button :disabled="!formData.team_name" @click="teamSetHandle">确认</el-button>
                </div>
            </template>
        </el-dialog>

        <!-- 退出 -->
        <QuitModal v-model="quitModal" v-if="quitModal" :quitData="quitData" @closeTeam="closeTeam"
                   @quitTeam="quitTeam" />

        <!-- 报告设置 -->
        <el-dialog v-model="shareReportSetModal" :title="`${reportModalData.type === 1 ? '安全报告' : '安全问题'}分享设置`"
                   width="480px" :close-on-click-modal="false">
            <!-- <div class="g-mb-8 g-mt-16 g-flex g-justify-between g-align-center">
                <div class="g-f-14 g-color-1 g-fw-400">获得链接的人</div>
                <SelectCheckReportAuth @selectAuthHandle="selectAuthHandle" />
            </div> -->

            <div class="g-mb-16 g-flex g-justify-between g-align-center">
                <div class="g-f-14 g-color-1 g-fw-400">
                    链接有效期
                    <TipsComp content="链接到期后无法通过此链接访问" />
                </div>
                <el-radio-group v-model="reportModalData.expire_day">
                    <el-radio :label="14" size="large">14天有效</el-radio>
                    <el-radio :label="-1" size="large">永久有效</el-radio>
                </el-radio-group>
            </div>
            <div class="group-btn">
                <el-button class="cancle_btn" @click="shareReportSetModal = false">取消</el-button>
                <el-button @click="saveConfig">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import {
    closeTeamApi, quitTeamApi, getTeamInfoApi, getMoreTeamInfoApi, saveMoreTeamInfoApi,
} from 'api/org';
import { teamSetApi } from 'api/team';
import { getTeamShareSetApi, saveTeamShareSetApi } from 'api/asset';

import {
    localStorageUtil, getUserInfo, showMessage,
    delayReload,
} from 'util/tools';
import store from 'util/store';
import TipsComp from 'comp/TipsComp.vue';
import { getOrgAuthInfo } from '@/control/org/hooks';
// import SelectCheckReportAuth from '@/control/share/SelectCheckReportAuth.vue';
import QuitModal from '../navs/QuitModal.vue';

const {
    normalTeamAuth, isUserSpace,
} = getOrgAuthInfo();
const editModal = ref<boolean>(false);
const quitModal = ref<boolean>(false);
const quitData = ref<any>({});
const shareReportSetModal = ref(false);
const teamBelongOrgId = ref<string>('');
const reportModalData = ref<any>({});
const expand = ref<boolean>(false);

const formData = ref<any>({
    team_id: store.teamInfo.team_id,
    team_name: '',
    team_serial_name: '',
    team_zh_short_name: '',
    team_en_short_name: '',
    team_status: '',
    team_importance: '',
    recovery_priority: '',
    security_risk_level: '',
    security_protection_level: '',
    program_language: '',
    program_company: '',
});

const reportSelect = ref({
    team_config_share_id: '0',
    team_id: store.teamInfo.team_id,
    share_type: 1,
    status: 1,
    type: 1,
    allow_action: 12,
    expire_day: 14,
});
const issueSelect = ref({
    team_config_share_id: '0',
    team_id: store.teamInfo.team_id,
    share_type: 2,
    status: 1,
    type: 2,
    allow_action: 12,
    expire_day: 14,
});

function reload() {
    window.location.reload();
}

onBeforeMount(async () => {
    try {
        const { data } = await getTeamInfoApi({
            team_id: store.teamInfo.team_id,
        });
        teamBelongOrgId.value = data?.org_info?.id;
        formData.value.team_name = data.team.team_name;
    } catch (error) {
        console.log(error);
    }

    try {
        const { data } = await getMoreTeamInfoApi({
            team_id: store.teamInfo.team_id,
        });
        Object.assign(formData.value, data);
    } catch (error) {
        console.log(error);
    }

    try {
        const { data } = await getTeamShareSetApi({
            team_id: store.teamInfo.team_id,
        });

        const [info1, info2] = Object.values(data);
        reportSelect.value = Object.assign(reportSelect.value, info1);
        reportSelect.value.status = 1;
        reportSelect.value.type = 1;

        issueSelect.value = Object.assign(issueSelect.value, info2);
        issueSelect.value.status = 1;
        issueSelect.value.type = 2;
    } catch (error) {
        console.log(error);
    }
});

const saveConfig = async () => {
    await saveTeamShareSetApi(reportModalData.value);
    showMessage('设置成功', 'success');
    shareReportSetModal.value = false;
};

// 保存名称
const teamSetHandle = async () => {
    try {
        await teamSetApi({
            team_id: store.teamInfo.team_id, org_id: teamBelongOrgId.value, team_name: formData.value.team_name.trim(),
        });
        await saveMoreTeamInfoApi({
            ...formData.value,
            team_id: store.teamInfo.team_id,
        });
        editModal.value = false;
        delayReload('保存成功', 'success');
    } catch (error) {
        //
    }
    // if (!inpVal.value) return;
};

const quitHandle = (name: string, userId: string, id: string, type: number) => {
    quitData.value.type = type;
    quitData.value.name = name;
    quitData.value.id = id;
    quitModal.value = true;
};

const closeTeam = async () => {
    try {
        await closeTeamApi({
            team_id: quitData.value.id,
            org_id: teamBelongOrgId.value,
            op_from: 'team_setting',
        });
        const obj = {
            team_id: getUserInfo().private_team_id,
            org_id: 1,
        };
        localStorageUtil('set', 'g-t', obj);
        store.teamInfo = obj;
        window.location.href = '/console/platform/index';
    } catch (error) {
        console.log(error);
    }
};

const quitTeam = async () => {
    try {
        await quitTeamApi({
            team_id: quitData.value.id,
            op_from: 'team_setting',
        });
        const obj = {
            team_id: getUserInfo().private_team_id,
            org_id: 1,
        };
        localStorageUtil('set', 'g-t', obj);
        store.teamInfo = obj;
        window.location.href = '/console/platform/index';
    } catch (error) {
        console.log(error);
    }
};

</script>

<style lang="less" scoped>
.set_info {
    .red.el-button:hover {
        color: #F34D3D;
        background-color: #f98c8223;
    }

    .red.el-button {
        color: #F34D3D;
        background-color: #fff;
    }

    width : 100%;

    .upload_project_avatar {
        display: flex;
        align-items: flex-start;
        margin-bottom: 30px;
        margin-top: 10px;

        .project_avatar {
            width: 70px;
            height: 67px;
            box-sizing: border-box;
            background: #FFFFFF;
            border-radius: 8px;
            border: 1px solid #ECECEC;
            margin-right: 16px;
            display: flex;
            align-items: center;
            justify-content: center;

            img {
                width: 50px;
                height: 50px;
                border-radius: 10px;
            }
        }

        .upload_text {
            width: 330px;
        }
    }
}
</style>

<style lang="less">
.create-org-form .el-form-item__content {
    line-height: normal;
}

.el-upload-list {
    position: relative;
    left: -8px;

    .el-upload-list__item-name {
        text-align: left;
    }

    .el-upload-list__item-file-name {
        width: 80%;
    }
}
</style>
