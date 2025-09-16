<template>
    <div class="mf-chat-gpt">
        <ChatHeader
            class="g-sticky"
        />
        <div class="chat-content" ref="contentNode">
            <MsgWrapper v-for="item in replyList" :key="item.chatime" :info="item">
                <div v-markdown="item.content"></div>
            </MsgWrapper>

            <MsgWrapper
                v-show="loading"
                :info="{
                    username: 'murphysec_copilot',
                    chatime: formattedDate(Date.now()),
                }"
            >
                <Loading />
            </MsgWrapper>
            <div style="height: 140px" ref="shimNode"></div>
        </div>
        <div class="footer g-sticky-bottom">
            <SugQues :sugQuestion="sugQuestion" @click="onSugClick" />
            <MsgInput :disabled="disabledInput" @send="onSendMsg" />
            <div class="power-by">Powered By MurphySec Al x GPT-4</div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { toRefs, ref, onMounted } from 'vue';
import { formattedDate, debounceAI } from 'util/tools';
import { vMarkdown } from 'util/directive';
import { getCopilotContent, getCopilotReply } from 'api/chat';
import Loading from './Loading.vue';
import MsgWrapper from './MsgWrapper.vue';
import MsgInput from './MsgInput.vue';
import SugQues from './SugQuestion.vue';
import ChatHeader from './ChatHeader.vue';

interface IProps {
    componentName: string;
    chatID: string;
    sugQuestion: string[];
    showClose?: boolean;
    disabledInput?: boolean;
}

const props = (defineProps<IProps>(), {
    showClose: true,
});

// const emits = defineEmits<{
//     onClose: [];
// }>();

const {
    componentName, chatID, sugQuestion, disabledInput,
} = toRefs(props);

const loading = ref(false);
const replyList = ref<Array<any>>([]);
const contentNode = ref();
const shimNode = ref();
const firstQuestion = `从开源组件选型的角度对 ${componentName.value} 这个组件进行评估`;

const createReply = (reply: string, username: string) => ({
    username,
    content: reply,
    chatime: formattedDate(Date.now()),
});

// 获取回答列表
const fetchCopilotContent = async () => {
    const r = await getCopilotContent({ chatid: chatID.value });
    if (r && Array.isArray(r.data.reply) && r.data.reply.length > 0) {
        replyList.value = r.data.reply;
    } else {
        // 自动发起第一条提问
        // eslint-disable-next-line no-use-before-define
        fetchCopilotReply(firstQuestion);
    }
};

// 提问
const fetchCopilotReply = debounceAI(
    async (question: string) => {
        shimNode.value.scrollIntoView(true);
        // 模拟一条用户发送消息
        replyList.value.push(createReply(question, 'test'));

        // 开启loading提示
        loading.value = true;

        const r = await getCopilotReply({ chatid: chatID.value, content: question });

        if (r.data?.reply) {
            // 回答获取成功，生成一条回复消息
            replyList.value.push(createReply(r.data.reply, 'murphysec_copilot'));
        }

        loading.value = false;
    },
    1000,
    true,
);

const onSugClick = (val: string) => {
    fetchCopilotReply(val);
};

const onSendMsg = (val: string) => {
    fetchCopilotReply(val);
};

onMounted(() => {
    fetchCopilotContent();
});
</script>

<style scoped lang="less">
.mf-chat-gpt {
    display: flex;
    flex-direction: column;
    font-family: PingFang SC;
    border-radius: 8px 0px 0px 0px;
    height: 100%;
    background: #f8f8f8;

    .chat-content {
        flex-grow: 1;
        padding: 16px 24px 18px;
        background: #f8f8f8;
        overflow: auto;
    }

    .footer {
        padding: 12px 24px;
        background: #f8f8f8;

        .power-by {
            padding-top: 8px;
            font-size: 10px;
            font-weight: 400;
            line-height: 14px;
            letter-spacing: 0px;
            text-align: center;
            color: #858585;
        }
    }
}
</style>
