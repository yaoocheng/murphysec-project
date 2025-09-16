<template>
    <el-dialog width="800px" top="5%" :close-on-click-modal="false">
        <template #header>
            <div class="doc_title">
                配置文档
            </div>
        </template>

        <div class="tabs">
            <div class="tab_item" @click="(activeName = 1)" :class="{ 'active': activeName === 1 }">企业微信</div>
            <div class="tab_item" @click="(activeName = 2)" :class="{ 'active': activeName === 2 }">钉钉</div>
            <div class="tab_item" @click="(activeName = 3)" :class="{ 'active': activeName === 3 }">飞书</div>
        </div>

        <div class="content" v-show="(activeName === 1)">
            <div>
                <p>1.【PC群聊->右上方三个点->添加群机器人】，点击【添加群机器人】</p>
                <el-image style="width: 157px; height: 97px" :hide-on-click-modal="true" :src="showImgs.wechat1.small"
                    :preview-src-list="showImgs.wechat1.big">
                </el-image>
            </div>
            <div>
                <p>2. 点击【新创建一个机器人】，进入群机器人弹窗，点击【添加机器人】</p>
                <el-image style="width: 84px; height: 104px; margin-right: 20px;" :hide-on-click-modal="true" :src="showImgs.wechat2.small"
                    :preview-src-list="showImgs.wechat2.big">
                </el-image>
                <el-image style="width: 147px;height: 104px;" :hide-on-click-modal="true" :src="showImgs.wechat3.small" :preview-src-list="showImgs.wechat3.big">
                </el-image>
            </div>
            <div>
                <p>3. 输入所添加的【机器人名称】，点击【添加机器人】</p>
                <el-image style="width: 147px; height: 104px" :hide-on-click-modal="true" :src="showImgs.wechat4.small"
                    :preview-src-list="showImgs.wechat4.big">
                </el-image>
            </div>
            <div>
                <p>4. 添加机器人后，即可得到Webhook地址，点击【复制地址】</p>
                <el-image style="width: 131px; height: 93px" :hide-on-click-modal="true" :src="showImgs.wechat5.small"
                    :preview-src-list="showImgs.wechat5.big">
                </el-image>
            </div>
            <div>
                <p>已添加的机器人也可在右侧查询Webhook地址</p>
                <el-image style="width: 169px; height: 104px" :hide-on-click-modal="true" :src="showImgs.wechat6.small"
                    :preview-src-list="showImgs.wechat6.big">
                </el-image>
            </div>
        </div>

        <div class="content" v-show="(activeName === 2)">
            <div>
                <p>1.【PC群聊->群设置->智能群助手->添加机器人】，点击【添加机器人】</p>
                <el-image style="width: 158px; height: 99px; margin-right: 20px;" :hide-on-click-modal="true" :src="showImgs.ding1.small"
                    :preview-src-list="showImgs.ding1.big">
                </el-image>
                <el-image style="width: 124px; height: 98px" :hide-on-click-modal="true" :src="showImgs.ding2.small"
                    :preview-src-list="showImgs.ding2.big">
                </el-image>
            </div>
            <div>
                <p>2. 机器人类型选择【自定义】</p>
                <el-image style="width: 149px; height: 118px;" :hide-on-click-modal="true" :src="showImgs.ding3.small"
                    :preview-src-list="showImgs.ding3.big">
                </el-image>
            </div>
            <div>
                <p>3.填写【机器人姓名】、【群组信息】、【安全设置】，点击【完成】</p>
                <el-image style="width: 149px; height: 118px" :hide-on-click-modal="true" :src="showImgs.ding4.small"
                    :preview-src-list="showImgs.ding4.big">
                </el-image>
            </div>
            <div>
                <p>4. 机器人添加完成后即可获得Webhook地址，点击【复制】</p>
                <el-image style="width: 149px; height: 118px" :hide-on-click-modal="true" :src="showImgs.ding5.small"
                    :preview-src-list="showImgs.ding5.big">
                </el-image>
            </div>
        </div>

        <div class="content" v-show="(activeName === 3)">
            <div>
                <p>1.【PC群聊->右上方三个点->设置->群机器人】，点击【添加机器人】</p>
                <el-image style="width: 175px; height: 110px; margin-right: 20px;" :hide-on-click-modal="true" :src="showImgs.feishu1.small"
                    :preview-src-list="showImgs.feishu1.big">
                </el-image>
                <el-image style="width: 175px; height: 110px;" :hide-on-click-modal="true" :src="showImgs.feishu2.small"
                    :preview-src-list="showImgs.feishu2.big">
                </el-image>
            </div>
            <div>
                <p>2. 选择【自定义机器人】</p>
                <el-image style="width:175px; height: 110px;" :hide-on-click-modal="true" :src="showImgs.feishu3.small"
                    :preview-src-list="showImgs.feishu3.big">
                </el-image>
            </div>
            <div>
                <p>3. 填写【机器人名称】和【描述】，点击【添加】</p>
                <el-image style="width: 175px; height: 110px;" :hide-on-click-modal="true" :src="showImgs.feishu4.small"
                    :preview-src-list="showImgs.feishu4.big">
                </el-image>
            </div>
            <div>
                <p>4. 添加成功后，即可得到Webhook地址，点击【复制】</p>
                <el-image style="width: 175px; height: 110px;" :hide-on-click-modal="true" :src="showImgs.feishu5.small"
                    :preview-src-list="showImgs.feishu5.big">
                </el-image>
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import wechat1 from 'ast/configImg/wechat1.png';
import wechat2 from 'ast/configImg/wechat2.png';
import wechat3 from 'ast/configImg/wechat3.png';
import wechat4 from 'ast/configImg/wechat4.png';
import wechat5 from 'ast/configImg/wechat5.png';
import wechat6 from 'ast/configImg/wechat6.png';
import ding1 from 'ast/configImg/ding1.png';
import ding2 from 'ast/configImg/ding2.png';
import ding3 from 'ast/configImg/ding3.png';
import ding4 from 'ast/configImg/ding4.png';
import ding5 from 'ast/configImg/ding5.png';

import feishu1 from 'ast/configImg/feishu1.png';
import feishu2 from 'ast/configImg/feishu2.png';
import feishu3 from 'ast/configImg/feishu3.png';
import feishu4 from 'ast/configImg/feishu4.png';
import feishu5 from 'ast/configImg/feishu5.png';

const activeName = ref<number>(1);
const showImgs = {
    wechat1: {
        small: wechat1,
        big: [wechat1],
    },
    wechat2: {
        small: wechat2,
        big: [wechat2],
    },
    wechat3: {
        small: wechat3,
        big: [wechat3],
    },
    wechat4: {
        small: wechat4,
        big: [wechat4],
    },
    wechat5: {
        small: wechat5,
        big: [wechat5],
    },
    wechat6: {
        small: wechat6,
        big: [wechat6],
    },
    ding1: {
        small: ding1,
        big: [ding1],
    },
    ding2: {
        small: ding2,
        big: [ding2],
    },
    ding3: {
        small: ding3,
        big: [ding3],
    },
    ding4: {
        small: ding4,
        big: [ding4],
    },
    ding5: {
        small: ding5,
        big: [ding5],
    },
    feishu1: {
        small: feishu1,
        big: [feishu1],
    },
    feishu2: {
        small: feishu2,
        big: [feishu2],
    },
    feishu3: {
        small: feishu3,
        big: [feishu3],
    },
    feishu4: {
        small: feishu4,
        big: [feishu4],
    },
    feishu5: {
        small: feishu5,
        big: [feishu5],
    },
};
</script>

<style lang='less' scoped>
.doc_title {
    font-size: 18px;
    font-weight: 600;
}

.tabs {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .tab_item {
        width: 56px;
        padding: 10px 0;
        font-size: 14px;
        color: #555362;
        text-align: center;
        margin-right: 15px;
        cursor: pointer;
    }

    .tab_item.active {
        color: #6C87FF;
        border-bottom: 2px solid #6C87FF;

    }
}
.content {
    padding: 0 50px;
    height: 400px;
    overflow: auto;
    p {
        margin: 10px 0;
    }
}
</style>
