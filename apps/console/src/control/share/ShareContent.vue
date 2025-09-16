<template>
    <div class="invite_project_member">
        <FormComp>
            <el-form-item label="链接分享">
                <div class="link_inp">
                    <el-input v-if="!store.securityId" disabled
                        :input-style="{ width: '380px', paddingRight: (allowAction === 2 ? '170px' : '145px') }"
                        v-model="shareUrl" />
                    <el-input v-else disabled
                        :input-style="{ width: '380px', paddingRight: '70px' }"
                        v-model="shareUrl" />
                    <el-button id="invite_copy" @click="copyFunc('#invite_copy')"
                        :data-clipboard-text="shareUrl">复制链接</el-button>

                    <!-- 分享报告权限选择 -->
                    <!-- <div class="select_auth" v-if="!store.securityId">
                        <SelectCheckReportAuth @selectAuthHandle="selectAuthHandle" />
                    </div> -->
                </div>
            </el-form-item>

            <!-- <el-form-item v-if="!store.isAllTeam">
                <template #label>
                    <div>
                        账号分享
                        <el-tooltip placement="top">
                            <template #content>
                                <div>
                                    未配置邮件服务器及站点URL，无法发送邮件
                                </div>
                                <div>
                                    未配置站点URL，邮件中的报告链接无法点击
                                </div>
                            </template>
                            <i style="font-size: 14px;" class="murphy icon-tishishuoming"></i>
                        </el-tooltip>
                    </div>
                </template>
                <ShareAccount />
            </el-form-item> -->
        </FormComp>
    </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import { copyFunc } from 'util/tools';
import store from 'util/store';
import { useRoute } from 'vue-router';
// import SelectCheckReportAuth from './SelectCheckReportAuth.vue';
// import ShareAccount from './ShareAccount.vue';
import FormComp from '@/components/FormComp.vue';

const route = useRoute();
const shareUrl = ref<string>(''); // 分享链接
const allowAction = ref<number>(1); // 1-需要登陆，仅查看报告，2-需要登陆，加入团队并查看报告

onBeforeMount(async () => {
    if (store.securityId) {
        shareUrl.value = `${window.location.origin}/console/question-detail/${store.securityId}?allow=1`;
    } else {
        shareUrl.value = `${window.location.origin}/console/report/${route.params.tid}/${route.params.sid}?allow=${allowAction.value}`;
    }
});

// 权限切换
// const selectAuthHandle = async (value: number) => {
//     allowAction.value = value;
//     shareUrl.value = `${window.location.origin}/console/report/${route.params.tid}/${route.params.sid}?allow=${value}`;
// };
</script>

<style lang="less" scoped>
.invite_project_member {
    .link_inp {
        display: flex;
        position: relative;

        .select_auth {
            position: absolute;
            top: -1px;
            right: 130px;
        }

        .el-button {
            position: relative;
            left: -45px
        }
    }
}
</style>
