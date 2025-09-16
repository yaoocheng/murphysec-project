<template>
    <el-dialog class="share_report_member_pop" @close="emits('update:modelValue', false)" width="480px"
        :close-on-click-modal="false" :close-on-press-escape="false">
        <template #header>
            <div class="title">
                {{ store.securityId ? '安全问题' : '安全报告' }}分享
            </div>
        </template>

        <div>
            <div class="g-mb-8 g-flex g-justify-between g-align-center">
                <div class="g-f-14 g-color-1 g-fw-400">获得链接的人</div>
                <SelectCheckReportAuth @selectAuthHandle="selectAuthHandle" />
            </div>

            <div class="g-mb-16 g-flex g-justify-between g-align-center">
                <div class="g-f-14 g-color-1 g-fw-400">
                    链接有效期
                    <TipsComp content="链接到期后无法通过此链接访问" />
                </div>
                <el-radio-group v-model="radio">
                    <el-radio :label="14" size="large">14天有效</el-radio>
                    <el-radio :label="-1" size="large">永久有效</el-radio>
                </el-radio-group>
            </div>

            <el-button @click="copyFunc('#copy-btn')" :data-clipboard-text="shareUrl" class="g-w-100" id="copy-btn"
                style="height: 40px;">
                复制链接
            </el-button>
        </div>
        <!-- <el-tab-pane name="email">
                <template #label>
                    <span>
                        <span class="g-mr-4">账号分享</span>
                        <TipsComp :width="260" content="未配置邮件服务器及站点URL，无法发送邮件。未配置站点URL，邮件中的报告链接无法点击。" />
                    </span>
                </template>

                <ShareAccount />
            </el-tab-pane> -->

        <!-- <div class="btns" v-if="!store.isAllTeam">
            <el-button class="cancle_btn"
                @click="emits('update:modelValue', false); store.securityId = ''">取消</el-button>
            <el-button @click="bus.emit('shareHandle')">分享</el-button>
        </div> -->

        <!-- 邀请团队成员 -->
        <!-- <TeamMember v-model="store.isShowTeamMemberModal" v-if="store.isShowTeamMemberModal" /> -->
    </el-dialog>
</template>

<script setup lang="ts">
import {
    onUnmounted, ref, watch,
} from 'vue';
import store from 'util/store';
import { useRoute } from 'vue-router';
import { getReportCodeApi, getIssueReportCodeApi } from 'api/asset';
import bus, { copyFunc } from 'util/tools';
import SelectCheckReportAuth from './SelectCheckReportAuth.vue';
import TipsComp from '@/components/TipsComp.vue';
// import ShareAccount from './ShareAccount.vue';

const route = useRoute();
const radio = ref<number>(14);
const allow = ref<number>(12);
const emits = defineEmits(['update:modelValue']);

const shareUrl = ref<string>('');

const getCode = async () => {
    if (store.securityId) {
        const { data } = await getIssueReportCodeApi({
            security_id: store.securityId,
            allow_action: allow.value,
            expire_day: radio.value,
        });
        shareUrl.value = `${window.location.origin}/console/issue-report/${data.share_code}`;
    } else {
        const { data } = await getReportCodeApi({
            subtask_id: route.params.sid,
            allow_action: allow.value,
            expire_day: radio.value,
        });
        shareUrl.value = `${window.location.origin}/console/share-report/${data.share_code}`;
    }
};
getCode();

// 权限切换
const selectAuthHandle = async (value: number) => {
    allow.value = value;
    getCode();
};

watch(radio, () => {
    getCode();
});

onUnmounted(() => {
    bus.off('shareHandle');
    store.securityId = '';
});
</script>

<style lang="less" scoped>
.title {
    font-size: 16px;
    font-weight: 600;
    color: #3c3c3c;
}

.tip {
    font-size: 14px;
    color: #4F4D5C;
    margin-bottom: 10px;
}

.btns {
    margin-left: 69%;
}
</style>
