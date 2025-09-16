<template>
    <div class="msg-wrapper">
        <div :class="msgItemClass">
            <div class="msg-header">
                <SvgIcon :name="msgHeaderIcon" style="width: 32px; height: 32px" />
            </div>
            <div class="msg-content">
                <div class="time g-c-85 g-f-14 g-fw-400">{{ info.chatime }}</div>
                <div class="content g-f-14 g-fw-400 g-lh-22"><slot /></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import SvgIcon from 'comp/SvgIcon.vue';
import { toRefs } from 'vue';

interface IProps {
    info: {
        username: string;
        chatime: string;
        content?: string;
    };
}

const props = defineProps<IProps>();
const { info } = toRefs(props);

const dir = info.value.username === 'murphysec_copilot' ? 'start' : 'end';

const msgItemClass = { 'msg-item': true, start: dir === 'start', end: dir === 'end' };
const msgHeaderIcon = dir === 'start' ? 'robot' : 'user';
</script>

<style scoped lang="less">
.msg-wrapper {
    font-family: PingFang SC;

    &:not(:last-child) {
        margin-bottom: 8px;
    }
    .msg-item {
        display: flex;

        .time {
            height: 32px;
            line-height: 32px;
            letter-spacing: 0em;
            text-align: left;
        }

        .content {
            display: inline-block;
            letter-spacing: 0em;
            padding: 10px 12px 10px 12px;
            background: #fff;
        }

        &.start {
            .msg-header {
                margin-right: 8px;
            }

            .msg-content {
                margin-right: 40px;
            }

            .content {
                border: 1px solid #2a2b3214;
                border-radius: 2px 16px 16px 16px;
            }
        }

        &.end {
            flex-direction: row-reverse;
            .msg-header {
                margin-left: 8px;
            }

            .msg-content {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                margin-left: 40px;
            }

            .time {
                text-align: right;
            }

            .content {
                border-radius: 16px 2px 16px 16px;
                background: linear-gradient(
                    270.5deg,
                    rgba(125, 96, 237, 0.15) -7.66%,
                    rgba(71, 100, 244, 0.15) 100%
                );
            }
        }
    }
}
</style>
