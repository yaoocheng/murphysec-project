<template>
    <el-dialog width="708px" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
        <template #header>
            <div class="role_title">
                欢迎使用墨菲安全检测工具
            </div>
            <div class="role_desc">
                请选择您在团队中担任的角色
            </div>
        </template>
        <div class="role_content">
            <div class="role_cards">
                <div class="item" @click="roleType = 10" :class="{ 'active_way': roleType === 10 }">
                    <i class="murphy icon-duihao1 check_icon"></i>
                    <img src="~ast/img/role1.png" alt="">
                    <div class="role_info">
                        <p>研发工程师</p>
                        <p>软件开发、算法、数据分析等角色</p>
                    </div>
                </div>
                <div class="item" @click="roleType = 11" :class="{ 'active_way': roleType === 11 }">
                    <i class="murphy icon-duihao1 check_icon"></i>
                    <img src="~ast/img/role2.png" alt="">
                    <div class="role_info">
                        <p>工程管理人员</p>
                        <p>研发leader、项目经理等角色</p>
                    </div>
                </div>
                <div class="item" @click="roleType = 12" :class="{ 'active_way': roleType === 12 }">
                    <i class="murphy icon-duihao1 check_icon"></i>
                    <img src="~ast/img/role3.png" alt="">
                    <div class="role_info">
                        <p>安全工程师</p>
                        <p>应用安全、安全运营等角色</p>
                    </div>
                </div>
                <div class="item" @click="roleType = 13" :class="{ 'active_way': roleType === 13 }">
                    <i class="murphy icon-duihao1 check_icon"></i>
                    <img src="~ast/img/role4.png" alt="">
                    <div class="role_info">
                        <p>工程效率人员</p>
                        <p>DevOps、运维等角色</p>
                    </div>
                </div>
                <div class="item" @click="roleType = 14" :class="{ 'active_way': roleType === 14 }">
                    <i class="murphy icon-duihao1 check_icon"></i>
                    <img src="~ast/img/role5.png" alt="">
                    <div class="role_info">
                        <p>软件供应商</p>
                        <p>外包公司、独立外包人员等角色</p>
                    </div>
                </div>
            </div>
            <el-button :disabled="!roleType" @click="selectRoleHandle">确定</el-button>
        </div>
    </el-dialog>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
// import store from 'util/store';
import { localStorageUtil, getUserInfo, encrypt } from 'util/tools';
import { selectRoleApi } from 'api/user';

const roleType = ref<number>(0);

const selectRoleHandle = async () => {
    const res = await selectRoleApi({
        profession: roleType.value,
    });
    if (res.data.code === 200) {
        localStorageUtil('set', 'g-u', encrypt({
            ...getUserInfo(),
            profession: roleType.value,
        }));
        // store.isShowRoleModal = false;
    }
};
</script>

<style lang='less' scoped>
.role_title {
    font-weight: 500;
    font-size: 28px;
    color: #3c3c3c;
    margin-bottom: 12px;
}

.role_desc {
    font-weight: 400;
    font-size: 16px;
    color: #3c3c3c;
}

.role_content {
    margin-top: 12px;

    .role_cards {
        .between();
        flex-wrap: wrap;
    }

    .item {
        &:hover {
            border-color: #6C87FF;
        }

        &:hover p:nth-of-type(1) {
            color: #6C87FF;
        }

        background: #FFFFFF;
        border: 0.498584px solid #EBEBEB;
        box-shadow: 0px 2.49292px 4.98584px rgba(31, 35, 41, 0.1);
        border-radius: 4px;
        width: 306px;
        height: 88px;
        padding: 16px 25px;
        box-sizing: border-box;
        display: flex;
        align-items: flex-start;
        margin-bottom: 16px;
        cursor: pointer;
        position: relative;

        img {
            width: 30px;
            margin-right: 18px;
        }

        p:nth-of-type(1) {
            font-size: 18px;
            color: #3c3c3c;
            margin-bottom: 12px;
        }

        p:nth-of-type(2) {
            font-size: 14px;
            color: #858585;
            max-width: 210px;
            .ellipsis();
        }

        .check_icon {
            display: none;
            font-size: 12px;
            color: #fff;
            transform: scale(0.8);
        }
    }

    .item.active_way {
        &::before {
            content: '';
            display: inline-block;
            width: 16px;
            height: 16px;
            background: #6C87FF;
            border-radius: 0px 4px 0px 4px;
            position: absolute;
            right: -1px;
            top: 0;
        }

        .check_icon {
            display: block;
            position: absolute;
            right: 1px;
            top: 2px;
        }

        background: #6C87FF0D;
        border: 1px solid rgba(108, 135, 255, 0.8);
    }

    .el-button {
        width: 100%;
        height: 40px;
        margin-top: 16px;
    }
}
</style>
