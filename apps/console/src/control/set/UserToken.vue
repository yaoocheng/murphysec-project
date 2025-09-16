<template>
    <div class="user_token h-full">
        <div class="content">
            <div class="desc">
                主要用于CLI、IDEA插件等检测方式的认证
            </div>
            <div class="token_input">
                <el-input v-model="tokenVal" disabled type="password" />
                <span class="button-icon-grey" id="user_token_copy" :data-clipboard-text="tokenVal"
                      @click="copyFunc('#user_token_copy')">
                    <i class="murphy icon-fuzhi"></i>
                </span>
                <!-- <i class="murphy icon-fuzhi copy_btn" id="user_token_copy" :data-clipboard-text="tokenVal"
                   @click="copyFunc('#user_token_copy')"></i> -->
                <el-popconfirm width="300" @confirm="refreshToken" title="重新生成会导致之前的访问令牌失效，请确认是否继续">
                    <template #reference>
                        <el-button>重新生成</el-button>
                    </template>
                </el-popconfirm>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import store from 'util/store';
import { ref, onBeforeMount } from 'vue';
import { copyFunc } from 'util/tools';
import { getTokenApi, resetTokenApi } from '@/api/project';

const tokenVal = ref<string>('');
onBeforeMount(async () => {
    const res = await getTokenApi({
        team_id: store.teamInfo.team_id,
    });
    tokenVal.value = res.data.Token;
});

const refreshToken = async () => {
    const res = await resetTokenApi({
        team_id: store.teamInfo.team_id,
    });
    tokenVal.value = res.data.Token;
};

</script>

<style lang='less' scoped>
.content {
    .desc {
        font-size: 14px;
        color: #3c3c3c;
        margin-bottom: 20px;
        font-weight: 600;
    }

    .token_input {
        width: 450px;
        display: flex;
        position: relative;
        margin-bottom: 15px;

        :deep(.el-input__inner) {
            padding-right: 20px;
        }

        .el-button {
            margin-left: 10px;
        }

        .copy_btn {
            position: absolute;
            right: 105px;
            top: 8px;
            color: #8C95A1;
            z-index: 9;
            cursor: pointer;
        }
    }

    .time {
        font-size: 12px;
        color: #8C95A1;
    }
}
</style>
