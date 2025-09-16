<template>
    <CommonHead>
        <div class="common_bread">
            <!-- <span class="front_nav" @click="$router.push('/group')">用户组</span>
            <i class="murphy icon-youjiantou"></i> -->
            <span>{{ tabName }}</span>
        </div>
    </CommonHead>

    <div class="main_content">
        <div class="question_tabs">
            <div class="tab">
                <span class="item" :class="{ 'active': tabsVal === 1 }" @click="tabsVal = 1;tabName='团队成员'">团队成员</span>
                <span v-if="!isUserSpace" class="item" @click="tabsVal = 2;tabName='上级组织负责人'" :class="{ 'active': tabsVal === 2 }">
                    上级组织负责人
                    <el-tooltip content="团队所属组织及其上级组织的负责人，拥有团队操作权" placement="top">
                        <i class="murphy icon-wenhaoxiao"></i>
                    </el-tooltip>
                </span>
            </div>
        </div>

        <TeamMember v-if="tabsVal === 1" />

        <UpOrgMember v-if="tabsVal === 2&&!isUserSpace" />
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import CommonHead from '@/components/CommonHead.vue';
import TeamMember from './TeamMember.vue';
import UpOrgMember from './UpOrgMember.vue';
import { getOrgAuthInfo } from '@/control/org/hooks';

// import { useRoute, useRouter } from 'vue-router';
// import {  } from 'util/tools';
// import store from 'util/store';
// import { } from 'api/project';
const tabName = ref<string>('团队成员');
const tabsVal = ref<number>(1);

const { isUserSpace } = getOrgAuthInfo();
// const route = useRoute();
// const router = useRouter();

// onBeforeMount(() => {
// })

// onMounted(() => {
// })
</script>

<style scoped lang='less'>
.question_tabs {
    border-bottom: 1px solid rgba(30, 30, 30, 0.1);
    margin-bottom: 16px;
    height: 37px;

    .tab span.item {
        margin-right: 28px;
        display: inline-block;
        color: #606C80;
        cursor: pointer;
        font-size: 16px;
        padding-bottom: 12px;
        color: #858585;
        font-weight: 400;
        border-bottom: 2px solid transparent;
    }

    .tab span.item.active {
        border-bottom-color: #5572F4;
        color: #5572F4;
        font-weight: 500;
    }
}
</style>
