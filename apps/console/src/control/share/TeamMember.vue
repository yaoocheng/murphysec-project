<template>
    <el-dialog width="850px" top="5%" :show-close="false" :close-on-click-modal="false" @opened="openHandle">
        <template #header>
            <div class="invite_team_member_title">
                <i @click="store.isShowTeamMemberModal = false" class="murphy icon-fanhui"
                    style="cursor:pointer"></i>
                邀请团队成员
            </div>
        </template>
        <div class="invite_wrap">
            <div class="left_members">
                <div class="team_item" v-for="(item, index) in teamData" :key="index">
                    <div class="team_info" @click="item.is_expand = !item.is_expand">
                        <div style="display: flex;align-items: center;">
                            <span class="icon" :class="{ 'isExpand': item.is_expand }">
                                <i class="murphy icon-down1"></i>
                            </span>
                            <img src="~ast/img/class.png" alt="">
                            <span>
                                {{ item.group_name }}
                            </span>
                        </div>
                        <span>
                            <el-checkbox v-model="item.checked" @change="checkoutAllHandle(index, item.checked)" />
                        </span>
                    </div>
                    <div class="members" :class="{ 'isExpandMember': item.is_expand }">
                        <div class="item" @click="() => {
                            if (item.checked) return;
                            ele.checked = !ele.checked; checkItemHandle(ele, ele.checked, item)
                        }" v-for="(ele) in item.members" :key="ele.user_id">
                            <div style="display: flex;align-items: center;">
                                <img :src="ele.user_avatar || defaultAvatar">
                                <span>{{ ele.username }}</span>
                            </div>
                            <span>
                                <el-checkbox v-model="ele.checked" @click.stop :disabled="item.checked"
                                    @change="checkItemHandle(ele, ele.checked, item)" />
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="right_select">
                <div class="select_item">
                    <div class="is_invite_num">已选：{{ selectNum }} 人</div>
                </div>
                <div class="select_item" v-for="(item, index) in selectData" :key="index"
                    style="justify-content: space-between;">
                    <div style="display: flex;align-items: center;">
                        <img :src="item.group_name ? classImg : (item.user_avatar || defaultAvatar)" alt="">
                        <div class="name">
                            {{ item.group_name || item.username }} {{ item.members ? `（${item.members.length}）` : '' }}
                        </div>
                    </div>
                    <i class="murphy icon-cuo" style="cursor: pointer;" @click="clearSelectHandle(item, index)"></i>
                </div>
            </div>
        </div>
        <div class="btns">
            <el-button class="cancle_btn" @click="store.isShowTeamMemberModal = false">取消</el-button>
            <el-button @click="confirmHandle">确认</el-button>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import store from 'util/store';
import bus from 'util/tools';
import { getTeamMemberApi } from 'api/team';
import classImg from 'ast/img/class.png';
import defaultAvatar from 'ast/img/default_avatar.png';

const selectNum = ref<number>(0);
const teamData = ref<Array<any>>([]);
const selectData = ref<Array<any>>([]);

// 获取成员
const openHandle = async () => {
    const res = await getTeamMemberApi({ team_id: store.teamInfo.team_id });
    teamData.value = res.data;
};

// 右边清除
const clearRight = (selectItem: any) => {
    selectItem.members.forEach((item: any) => {
        selectData.value.forEach((ele, i) => {
            if (selectItem.group_id === ele.group_id) {
                selectData.value.splice(i, 1);
            }
            if (item.user_id === ele.user_id) {
                selectData.value.splice(i, 1);
                if (selectNum.value) {
                    selectNum.value -= 1;
                }
            }
        });
    });
};

// 选择全部
const checkoutAllHandle = (index: number, checkAll: boolean) => {
    const selectItem = teamData.value[index];
    // 清理右边选中的成员
    clearRight(selectItem);

    // 是否选择右边联动
    if (checkAll) {
        // eslint-disable-next-line no-return-assign
        selectItem.members.map((ele: any) => ele.checked = true);
        selectData.value.unshift(selectItem);
        selectNum.value += selectItem.members.length;
    } else {
        // eslint-disable-next-line no-return-assign
        selectItem.members.map((ele: any) => ele.checked = false);
        if (selectNum.value) {
            selectNum.value -= selectItem.members.length;
        }
    }
};

// 单个选择
const checkItemHandle = (memberEle: any, checkItem: boolean, groupItem: any) => {
    // 选择了全部成员默认全选
    if (groupItem.members.every((n: any) => n.checked)) {
        clearRight(groupItem);
        groupItem.checked = groupItem.members.every((n: any) => n.checked);
        selectData.value.unshift(groupItem);
        selectNum.value += groupItem.members.length;
        return;
    }

    // 单选选择
    if (checkItem && !selectData.value.some((n) => memberEle.user_id === n.user_id)) {
        selectData.value.unshift(memberEle);
        selectNum.value += 1;
    } else if (!checkItem) {
        if (selectNum.value) {
            selectNum.value -= 1;
        }
        selectData.value.forEach((c: any, o) => {
            if (c.user_id === memberEle.user_id) {
                selectData.value.splice(o, 1);
            }
        });
    }
};

// 清除选项
const clearSelectHandle = (item: any, index: number) => {
    // 清除组
    if (item.group_id) {
        selectNum.value -= item.members.length;
        teamData.value.forEach((ele) => {
            if (ele.group_id === item.group_id) {
                ele.checked = false;
                // eslint-disable-next-line no-return-assign
                ele.members.map((n: any) => n.checked = false);
            }
        });
        // 清除成员
    } else if (selectNum.value) {
        selectNum.value -= 1;
        teamData.value.forEach((ele) => {
            ele.members.forEach((m: any) => {
                if (m.user_id === item.user_id) {
                    m.checked = false;
                }
            });
        });
    }
    selectData.value.splice(index, 1);
};

// 确定
const confirmHandle = () => {
    const data: Array<any> = [];
    selectData.value.forEach((item) => {
        if (item.group_id) {
            data.push(...item.members);
        } else {
            data.push(item);
        }
    });
    bus.emit('selectGroupMember', data);
    store.isShowTeamMemberModal = false;
};
</script>

<style lang="less" scoped>
.invite_team_member_title {
    font-size: 18px;
    font-weight: 600;
    color: #2F2E3F;
}

.btns {
    margin-left: 83.5%;
}

.invite_wrap {
    height: 350px;
    background: #FFFFFF;
    border-radius: 6px;
    border: 1px solid #ECECEC;
    display: flex;
    margin-bottom: 25px;

    img {
        width: 32px;
        height: 32px;
        border-radius: 16px;
        margin-right: 15px;
    }

    .left_members {
        flex: 1;
        border-right: 1px solid #ECECEC;
        color: #555362;
        overflow: auto;

        .team_info {
            &:hover {
                background-color: #F0F5FC;
            }

            display: flex;
            justify-content: space-between;
            transition: all .2s;
            align-items: center;
            height: 48px;
            padding: 0 18px;
            cursor: pointer;

            span.icon {
                width: 20px;
                height: 20px;
                transition: all .2s;
                transform: rotate(-90deg);
            }

            span.icon.isExpand {
                transform: rotate(0);
            }
        }

        .members {
            &::-webkit-scrollbar {
                display: none;
            }

            height: 0;
            overflow: auto;
            transition: all .2s;
        }

        .members.isExpandMember {
            height: auto;
        }

        .members .item {
            &:hover {
                background-color: #F0F5FC;
            }

            justify-content: space-between;
            height: 48px;
            display: flex;
            align-items: center;
            padding: 0 38px;
            padding-right: 18px;
            transition: all .2s;
            cursor: pointer;
        }
    }

    .right_select {
        flex: 1;
        overflow: auto;

        .select_item {
            &:hover {
                background-color: #F0F5FC;
            }

            cursor: pointer;
            color: #2F2E3F;
            display: flex;
            align-items: center;
            transition: all .2s;
            height: 48px;
            padding: 0 20px;

            .is_invite_num {
                color: #2F2E3F;
                font-weight: 600;
                font-size: 14px;
            }

            img {
                width: 32px;
                height: 32px;
                border-radius: 19px;
                margin-right: 10px;
            }

            span {
                display: inline-block;
                background-color: #6C87FF;
                color: #4668FF;
                width: 56px;
                height: 18px;
                line-height: 18px;
                text-align: center;
                background: rgba(108, 135, 255, 0.2);
                border-radius: 2px;
            }
        }
    }
}
</style>
