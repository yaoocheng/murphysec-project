<template>
    <el-dialog class="token_popup" title="如何设置GitHub访问令牌" width="800px" top="5%" :close-on-click-modal="false">
        <div class="content">
            <div class="item">
                <p>1. 进入GitHub平台，点击右上角头像，点击“Settings”进入页面</p>
                <el-image style="width: 212px; height: 142px" :hide-on-click-modal="true" :src="showImgs.github1.small"
                    :preview-src-list="showImgs.github1.big">
                </el-image>
            </div>
            <div class="item">
                <p>2. 点击“Developersettings”进入页面</p>
                <el-image style="width: 212px; height: 142px" :hide-on-click-modal="true" :src="showImgs.github2.small"
                    :preview-src-list="showImgs.github2.big">
                </el-image>
            </div>
            <div class="item">
                <p>3. 点击“Personal access tokens”展示二级目录，选择Tokens(classic)；点击 Tokens(classic) 按钮，选择Generate new toker(classic)，进入新建访问令牌页面</p>
                <el-image style="width: 222px; height: 142px" :hide-on-click-modal="true" :src="showImgs.github3.small"
                    :preview-src-list="showImgs.github3.big">
                </el-image>
            </div>
            <div class="item">
                <p>4. 输入Note（如:murphysec）；在Expiration字段中，选择No expiration；全选repo后；点击按钮Generate token，进入完成创建页面</p>
                <el-image style="width: 222px; height: 72px" :hide-on-click-modal="true" :src="showImgs.github4.small"
                    :preview-src-list="showImgs.github4.big">
                </el-image> <br>

                <el-image style="width: 222px; height: 142px" :hide-on-click-modal="true" :src="showImgs.github5.small"
                    :preview-src-list="showImgs.github5.big">
                </el-image>
            </div>
            <div class="item">
                <p>5. 最后复制访问令牌即可</p>
                <el-image style="width: 222px; height: 72px" :hide-on-click-modal="true" :src="showImgs.github6.small"
                    :preview-src-list="showImgs.github6.big">
                </el-image>
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang='ts'>
import github1 from 'ast/configImg/github-tk1.png';
import github2 from 'ast/configImg/github-tk2.png';
import github3 from 'ast/configImg/github-tk3.png';
import github4 from 'ast/configImg/github-tk4.png';
import github5 from 'ast/configImg/github-tk5.png';
import github6 from 'ast/configImg/github-tk6.png';

const showImgs = {
    github1: {
        small: github1,
        big: [github1],
    },
    github2: {
        small: github2,
        big: [github2],
    },
    github3: {
        small: github3,
        big: [github3],
    },
    github4: {
        small: github4,
        big: [github4],
    },
    github5: {
        small: github5,
        big: [github5],
    },
    github6: {
        small: github6,
        big: [github6],
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
    height: 500px;
    overflow: auto;
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
