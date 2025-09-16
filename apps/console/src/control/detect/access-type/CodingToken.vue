<template>
    <el-dialog class="token_popup" title="如何设置 CODING 访问令牌" width="800px" top="5%">
        <div class="content text-3c font-normal">
            <div class="item">
                <p>1. 进入 CODING 平台，鼠标移入左下角「头像」</p>
                <el-image class="shadow-lg" style="width: 600px; height: 310px" :hide-on-click-modal="true" :src="showImgs.coding1.small"
                    :preview-src-list="showImgs.coding1.big">
                </el-image>
            </div>
            <div class="item">
                <p>2. 点击「个人账户设置」，进入详情 </p>
                <el-image class="shadow-lg" style="width: 600px; height: 310px" :hide-on-click-modal="true" :src="showImgs.coding2.small"
                    :preview-src-list="showImgs.coding2.big">
                </el-image>
            </div>
            <div class="item">
                <p>3. 在左侧导航选择「访问令牌」 ，点击「新建令牌」，开始新建</p>
                <el-image class="shadow-lg" style="width: 600px; height: 310px" :hide-on-click-modal="true" :src="showImgs.coding3.small"
                    :preview-src-list="showImgs.coding3.big">
                </el-image>
            </div>
            <div class="item">
                <p>4. 输入「令牌描述」如“ murphysec”，然后在「选择权限」中找到「代码仓库」模块，需根据示意图设置对应权限</p>
                <el-image class="shadow-lg mb-2" style="width: 600px; height: 310px" :hide-on-click-modal="true" :src="showImgs.coding4.small"
                    :preview-src-list="showImgs.coding4.big">
                </el-image>
                <el-image class="shadow-lg" style="width: 600px; height: 310px" :hide-on-click-modal="true" :src="showImgs.coding5.small"
                    :preview-src-list="showImgs.coding5.big">
                </el-image>
            </div>
            <div class="item">
                <p>5. 点击「确认」按钮，完成创建后即可复制生成的访问令牌</p>
                <el-image class="shadow-lg mb-2" style="width: 600px; height: 310px" :hide-on-click-modal="true" :src="showImgs.coding6.small"
                    :preview-src-list="showImgs.coding6.big">
                </el-image>
                <el-image class="shadow-lg" style="width: 600px; height: 310px" :hide-on-click-modal="true" :src="showImgs.coding7.small"
                    :preview-src-list="showImgs.coding7.big">
                </el-image>
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang='ts'>
import coding1 from 'ast/configImg/coding_token1.png';
import coding2 from 'ast/configImg/coding_token2.png';
import coding3 from 'ast/configImg/coding_token3.png';
import coding4 from 'ast/configImg/coding_token4.png';
import coding5 from 'ast/configImg/coding_token5.png';
import coding6 from 'ast/configImg/coding_token6.png';
import coding7 from 'ast/configImg/coding_token7.png';

const showImgs = {
    coding1: {
        small: coding1,
        big: [coding1],
    },
    coding2: {
        small: coding2,
        big: [coding2],
    },
    coding3: {
        small: coding3,
        big: [coding3],
    },
    coding4: {
        small: coding4,
        big: [coding4],
    },
    coding5: {
        small: coding5,
        big: [coding5],
    },
    coding6: {
        small: coding6,
        big: [coding6],
    },
    coding7: {
        small: coding7,
        big: [coding7],
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
    height: 600px;
    overflow: auto;
    // padding: 10px 40px;
    font-size: 14px;

    .item {
        &:nth-last-of-type(1) {
            margin-bottom: 0;
        }
        margin-bottom: 24px;
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
