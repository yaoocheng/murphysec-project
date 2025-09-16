<template>
    <el-dialog @opened="openHandle" width="500px" :close-on-click-modal="false" :show-close="false">
        <template #header>
            <div class="title">
                安全问题指派
                <!-- <el-tooltip placement="top">
                    <template #content>
                        <div>
                            未配置邮件服务器及站点URL，无法发送邮件
                        </div>
                        <div>
                            未配置站点URL，邮件中的报告链接无法点击
                        </div>
                    </template>
<i style="font-size: 14px;" class="murphy icon-tishishuoming"></i>
</el-tooltip> -->
            </div>
            <!-- <div class="desc" v-if="store.securityId">
                不在团队？<span style="color: #6C87FF"
                    :data-clipboard-text="`${origin}/console/question-detail/${store.securityId}?allow=1`"
                    @click="copyFunc('#copy_url')" id="copy_url">复制链接去邀请</span>
            </div> -->
        </template>
        <div class="content">
            <!-- <div class="want">
                <div style="margin-bottom: 15px;font-weight: 600;">指派推荐</div>
                <div class="members">
                    <div class="item" @click="item.checked = !item.checked" v-for="(item, index) in recommendData"
                        :key="index">
                        <div style="display: flex;align-items: center;">
                            <img :src="item.user_avatar" v-if="item.user_avatar">
                            <img v-else src="~ast/img/default_avatar.png" alt="">
                            <span>{{ item.username }}</span>
                        </div>
                        <div>
                            <el-checkbox v-model="item.checked" @change="checkChangeHandle(item.user_id, 1)" @click.stop />
                        </div>
                    </div>
                </div>
            </div> -->

            <div class="want">
                <div style="margin-bottom: 15px;font-weight: 500;">请选择被指派的团队成员</div>
                <div class="members">
                    <div class="item" @click="item.checked = !item.checked" v-for="(item, index) in teamData"
                        :key="index">
                        <div style="display: flex;align-items: center;">
                            <img :src="item.user_avatar" v-if="item.user_avatar">
                            <img v-else src="~ast/img/default_avatar.png" alt="">
                            <span>{{ item.username }}</span>
                        </div>
                        <div>
                            <el-checkbox v-model="item.checked" @change="checkChangeHandle(item.user_id, 2)"
                                @click.stop />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="btns">
            <el-button class="cancle_btn"
                @click="emits('update:modelValue', false); store.securityId = ''; store.repoId = ''">取消</el-button>
            <el-button @click="confirmHandle">确认</el-button>
        </div>
    </el-dialog>
</template>

<script setup lang='ts'>
import store from 'util/store';
import { ref } from 'vue';
import {
    recommendAndMemberApi, distributeOwnerApi, recommendAndMemberCodeApi, distributeCodeOwnerApi,
} from 'api/project';
import { showMessage } from '@/utils/tools';

const props = defineProps(['currentUser']);
const teamData = ref<Array<any>>([]);
const recommendData = ref<Array<any>>([]);
const emits = defineEmits(['update:modelValue']);
// const { origin } = window.location;

// 代码项目 安全问题 负责人指派
const openHandle = async () => {
    if (store.securityId) {
        try {
            const res = await recommendAndMemberApi({ security_id: store.securityId });
            const mapMembers = res.data.team_list.map((item: any) => item.members);
            teamData.value = mapMembers.reduce((pre: any, cur: any) => pre.concat(cur), []);
            recommendData.value = res.data.recommend_list;

            teamData.value.forEach((item) => {
                item.checked = item.user_id === props.currentUser;
            });
        } catch (error) {
            console.log(error);
        }
    } else if (store.repoId) {
        try {
            const res = await recommendAndMemberCodeApi({ repository_id: store.repoId });
            const mapMembers = res.data.team_list.map((item: any) => item.members);
            teamData.value = mapMembers.reduce((pre: any, cur: any) => pre.concat(cur), []);
            recommendData.value = res.data.recommend_list;
        } catch (error) {
            console.log(error);
        }
    }
};

const checkChangeHandle = (id: string, type: number) => {
    if (type === 1) {
        recommendData.value.forEach((item) => {
            item.checked = item.user_id === id;
        });
        teamData.value.map((item) => {
            item.checked = false;
            return item;
        });
    } else {
        teamData.value.forEach((item) => {
            item.checked = item.user_id === id;
        });
        recommendData.value.map((item) => {
            item.checked = false;
            return item;
        });
    }
};

// 提交确认
const confirmHandle = async () => {
    // if ((teamData.value.filter((item) => item.checked).length + recommendData.value.filter((item) => item.checked).length) > 1) {
    //     showMessage('只能指派给一个人', 'warning');
    //     return;
    // }
    const memberId = teamData.value.filter((item) => item.checked)[0]?.user_id;
    const memberEmail = teamData.value.filter((item) => item.checked)[0]?.email;
    const recommendId = recommendData.value.filter((item) => item.checked)[0]?.user_id;
    const recommendEmail = recommendData.value.filter((item) => item.checked)[0]?.email;

    if (store.securityId) {
        try {
            await distributeOwnerApi({
                security_id: store.securityId,
                owner_user_id: memberId || recommendId || '0',
                commit_author_email: memberEmail || recommendEmail || '',
            });
            showMessage('指派成功', 'success');
            emits('update:modelValue', false);
        } catch (error) {
            console.log(error);
        }
    } else if (store.repoId) {
        try {
            await distributeCodeOwnerApi({
                repository_id: store.repoId,
                owner_user_id: memberId || recommendId || '0',
                commit_author_email: memberEmail || recommendEmail || '',
            });
            showMessage('指派成功', 'success');
            emits('update:modelValue', false);
        } catch (error) {
            console.log(error);
        }
    }
};
</script>

<style lang='less' scoped>
.title {
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 10px;
    color: #3c3c3c;
}

.desc {
    font-size: 14px;
    color: #8F959E;

    span {
        cursor: pointer;
    }
}

.content {
    max-height: 400px;
    overflow: auto;

    img {
        width: 32px;
        height: 32px;
        border-radius: 16px;
        margin-right: 15px;
        margin-left: 5px;
    }
}

// .left_members {
//     color: #555362;

//     .team_info {
//         &:hover {
//             background-color: #F0F5FC;
//         }

//         display: flex;
//         justify-content: space-between;
//         transition: all .2s;
//         align-items: center;
//         height: 48px;
//         padding-right: 18px;
//         cursor: pointer;

//         span.icon {
//             width: 20px;
//             height: 20px;
//             transition: all .2s;
//             transform: rotate(-90deg);
//         }

//         span.icon.isExpand {
//             transform: rotate(0);
//         }
//     }

//     .members {
//         &::-webkit-scrollbar {
//             display: none;
//         }

//         height: 0;
//         overflow: auto;
//         transition: all .2s;
//     }

//     .members.isExpandMember {
//         height: auto;
//     }

//     .members .item {
//         &:hover {
//             background-color: #F0F5FC;
//         }

//         justify-content: space-between;
//         height: 48px;
//         display: flex;
//         align-items: center;
//         padding: 0 38px;
//         padding-right: 18px;
//         transition: all .2s;
//         cursor: pointer;
//     }
// }

.want .item {
    margin-bottom: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 18px;
    cursor: pointer;
}

.btns {
    margin-top: 20px;
    margin-left: 70%;
}
</style>
