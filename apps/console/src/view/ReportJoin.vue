<template>
    <div class="background">
        <div class="report_login_content">
            <div class="left">
                <div class="tag">
                    3分钟提升代码安全质量80%
                </div>
                <div class="name1">
                    为开发者打造
                </div>
                <div class="name2">
                    极易使用的代码安全产品
                </div>
                <div class="flow">
                    <div class="item">
                        <span>代码分析</span>
                    </div>
                    <i class="murphy icon-youjiantou1"></i>
                    <div class="item">
                        <span>风险检测</span>
                    </div>
                    <i class="murphy icon-youjiantou1"></i>
                    <div class="item">
                        <span>一键修复</span>
                    </div>
                </div>
                <div class="lang">
                    <div class="desc">
                        支持多种方式的一键接入，主流语言全覆盖
                    </div>
                    <img style="width: 95%;margin-top: 20px;" src="~ast/img/report_login_lang.png" alt="">
                </div>
            </div>

            <div class="login_form">
                <div class="join-info g-color-1">
                    <AvatarComp class="g-mb-8" :size="32" :name="info.from_user_name" />
                    <div class="g-fw-400 g-f-16 g-mb-4">{{ info.from_user_name }}邀请你加入团队</div>
                    <div class="g-fw-500 g-f-18 g-mb-48">
                        {{ info.team_name }}
                    </div>
                    <el-button @click="joinTeam" class="g-f-16 g-fw-400"
                        style="width: 100%;height: 40px;">加入团队</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { onBeforeMount, ref } from 'vue';
import { getReportAllowApi, getIssueReportAllowApi } from 'api/asset';
import { shareJoinTeamApi } from 'api/user';
import { useRouter } from 'vue-router';
import AvatarComp from '@/components/AvatarComp.vue';
import { showMessage } from '@/utils/tools';

const router = useRouter();
const info = ref<any>({});

onBeforeMount(async () => {
    if (window.sessionStorage.getItem('c')) {
        try {
            const { data } = await getReportAllowApi({
                share_code: window.sessionStorage.getItem('c'),
            });
            info.value = data;
        } catch (error) {
            console.log(error);
        }
    } else if (window.sessionStorage.getItem('sc')) {
        try {
            const { data } = await getIssueReportAllowApi({
                share_code: window.sessionStorage.getItem('sc'),
            });
            info.value = data;
        } catch (error) {
            console.log(error);
        }
    }
});

const joinTeam = async () => {
    try {
        await shareJoinTeamApi({
            team_id: info.value.team_id,
        });
        showMessage('加入成功', 'success');
        if (window.sessionStorage.getItem('c')) {
            window.sessionStorage.removeItem('c');
            router.push(`/detail/${info.value.project_id}/${info.value.subtask_id}`);
        } else if (window.sessionStorage.getItem('sc')) {
            window.sessionStorage.removeItem('sc');
            router.push('/platform/issue');
            window.sessionStorage.setItem('sec-id', info.value.security_id);
        }
    } catch (error) {
        console.log(error);
    }
};
</script>

<style scoped lang='less'>
.background {
    height: 100%;
    background-image: url('ast/img/mainBack.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
}

.report_login_content {
    display: flex;
    height: 600px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .left {
        width: 700px;
        box-sizing: border-box;
        background-image: url('ast/img/report_login_back.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }

    .tag {
        width: 257px;
        height: 48px;
        background: linear-gradient(160deg, #B06BFF 0%, #6B86FF 100%);
        border-radius: 10px 0px 10px 0px;
        font-size: 18px;
        font-weight: 600;
        color: #fff;
        line-height: 48px;
        text-align: center;
        margin-bottom: 25px;
    }

    .name1 {
        font-size: 30px;
        font-weight: 600;
        color: #1D4BA2;
        margin-bottom: 20px;
        margin-left: 35px;
    }

    .name2 {
        font-size: 38px;
        font-weight: 600;
        margin-left: 35px;
        margin-bottom: 30px;
        background: linear-gradient(160deg, #9470ff 0%, #214aff 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .flow {
        display: flex;
        align-items: center;
        margin-left: 35px;

        i {
            font-size: 24px;
            background: linear-gradient(91deg, #4F6FFF 0%, #A658FF 35%, #4F6FFF 100%);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-right: 20px;
        }
    }

    .flow .item {
        width: 130px;
        height: 60px;
        border-radius: 11px;
        border: 1px solid;
        background: linear-gradient(160deg, #e6c9ff34 0%, #b3c1ff98 100%);
        border: none;
        font-size: 22px;
        line-height: 60px;
        text-align: center;
        margin-right: 20px;

        span {
            background: linear-gradient(91deg, #4F6FFF 0%, #A658FF 35%, #4F6FFF 100%);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    }

    .lang,
    .company {
        margin-top: 220px;
        margin-left: 35px;
        font-size: 16px;
        font-weight: bold;
        color: #3e5a93ad;
    }

    .company {
        margin-top: 25px;
    }
}

.login_form {
    width: 500px;
    background-color: #fff;
    border-radius: 0 10px 10px 0;
    padding: 0 90px;
    box-sizing: border-box;
}

.join-info {
    width: 300px;
    margin: 0 auto;
    text-align: center;
    margin-top: 210px;
}
</style>
