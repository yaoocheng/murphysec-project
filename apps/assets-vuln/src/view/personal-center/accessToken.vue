<template>
    <div class="w-full h-[calc(100%-56px)] p-6">
        <div class="flex gap-6 flex-col">
            <div>
                <h3 class="text-[15px] font-medium">访问令牌</h3>
                <span class="text-[12px] text-gray-500">主要用于 OpenAPI 的授权/认证</span>
            </div>
            <div class="flex items-center gap-4">
                <div class="w-80 h-10 bg-gary-50 flex justify-between items-center rounded-3 border border-gary-50 border-solid box-border">
                    <span class="text-gary-400  px-3 py-2  text-base tetx-center">
                        ******************************
                    </span>

                    <div class="bg-white h-full w-[52px] flex items-center justify-center hover:cursor-pointer" @click="copyLinkHandle">
                        <Svg height="16px" width="16px" name="user-copy
                    "></Svg>
                    </div>
                </div>

                <div class="flex items-center gap-2 py-0.5 px-1 rounded-3 hover:bg-gary-50 cursor-pointer" @click="regenerateAccessToken">
                    <Svg height="16px" width="16px" name="user-refresh
                    "></Svg>
                    <span class="text-[12px] text-gary-700">
                        重新生成
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {
    h, ref,
} from 'vue';
import { Modal, message } from 'ant-design-vue';
import useClipboard from 'vue-clipboard3';
import { getUserInfoApi, setTokenApi } from '@/api/user';
import warningIcon from '/src/assets/svg/data/icon_warning_colorful-dm.svg';

const token = ref('');
const { toClipboard } = useClipboard();
const copyLinkHandle = async () => {
    try {
        await toClipboard(token.value);
        message.success('复制成功');
    } catch (err) {
        console.error('Failed to copy: ', err);
        message.error('复制失败');
    }
};

const getUserInfo = async () => {
    try {
        const res = await getUserInfoApi();
        token.value = res.data.data.token;
        console.log(res);
    } catch (error) {
        console.log(error);
    }
};
getUserInfo();

// 重新生成访问令牌
const regenerateAccessToken = () => {
    Modal.confirm({
        class: 'delete-confirm-modal',
        title: '确定重新生成访问令牌吗?',
        icon: h('span', { role: 'img', 'aria-label': 'exclamation-circle', class: 'anticon anticon-exclamation-circle' }, [
            h('img', { src: warningIcon, alt: '信息图标' }),
        ]),
        content: '重新生成后，之前的访问令牌将失效',
        async onOk() {
            try {
                // 调用接口
                const res = await setTokenApi();
                message.success('重新生成成功');
                token.value = res.data.data;
            } catch {
                return console.log('Oops errors!');
            }
        },
    });
};
</script>
