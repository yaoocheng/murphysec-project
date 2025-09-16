<template>
    <el-dialog class="token_popup" title="如何设置GitLab访问令牌" width="800px" top="5%" :close-on-click-modal="false">
        <div class="content">
            <div class="item">
                <p>1. 进入 GitLab 平台，右上角点击，选择 <span class="tag">Preferences</span></p>
                <el-image style="width: 157px; height: 72px" :hide-on-click-modal="true" :src="showImgs.gitlab1.small"
                    :preview-src-list="showImgs.gitlab1.big">
                </el-image>
            </div>
            <div class="item">
                <p>2. 左侧导航选择 Access Tokens，输入 Token name（如输入 murphysec）；在下方 scopes 中勾选 api；
                    然后点击 Create personal access token 按钮 </p>
                <el-image style="width: 212px; height: 142px" :hide-on-click-modal="true" :src="showImgs.gitlab2.small"
                    :preview-src-list="showImgs.gitlab2.big">
                </el-image>
            </div>
            <div class="item">
                <p>3. 在创建完成的页面中复制生成的 Access Token</p>
                <el-image style="width: 222px; height: 72px" :hide-on-click-modal="true" :src="showImgs.gitlab3.small"
                    :preview-src-list="showImgs.gitlab3.big">
                </el-image>
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang='ts'>
import gitlab1 from 'ast/configImg/gitlab_token1.png';
import gitlab2 from 'ast/configImg/gitlab_token2.png';
import gitlab3 from 'ast/configImg/gitlab_token3.png';

const showImgs = {
    gitlab1: {
        small: gitlab1,
        big: [gitlab1],
    },
    gitlab2: {
        small: gitlab2,
        big: [gitlab2],
    },
    gitlab3: {
        small: gitlab3,
        big: [gitlab3],
    },
};
</script>

<style lang="less" scoped>
.title {
    margin-bottom: 10px;
    font-size: 18px;
    font-weight: 600;
    color: #2F2E3F;
}

.content {
    // padding: 10px 40px;
    font-size: 14px;
    color: #555362;

    .item {
        &:nth-last-of-type(1) {
            margin-bottom: 0;
        }
        margin-bottom: 10px;
        line-height: 25px;
    }
    p {
        margin-bottom: 5px;
    }
    .tag {
        padding: 0 5px;
        background: #F5F7FA;
        border-radius: 4px;
        border: 1px solid #D2D9E2;
    }
}
</style>
