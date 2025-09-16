<template>
    <el-tooltip v-if="temporaryStorageSnip.length > 0" append-to=".affix_snip" :visible="visible" placement="top-end"
        effect="light">
        <template #content>
            <div @mouseleave="visible = false;" class="w-[344px] p-2 text-sm flex items-center">
                「同源性分析来源校准」信息会被暂时保存在此,点击可查看,应用后即生效
            </div>
        </template>
        <div ref="affixSnipRef" @click="openAppAdjustModal" @mouseenter="visible = true;" @mouseleave="visible = false;"
            class="affix_snip cursor-pointer fixed top-[36%] h-10 right-0 z-[5000] w-[140px] px-3 bg-[#f1f3ff] flex items-center">
            <img class="w-4 mr-1" src="~ast/img/temporary.png" alt="">
            <span class="text-sm font-normal mr-1 ">待应用的校准</span>
            <TagComp class="rounded-xl text-xs leading-[13px] scale-75" :content="temporaryStorageSnip.length" c="#fff" bgc="#F34D3D" />
        </div>
    </el-tooltip>
</template>

<script setup>
import { ref, watch } from 'vue';
import { temporaryStorageSnip, isShowUseSnipModal } from './business';

const visible = ref(false);
const affixSnipRef = ref();
const startTime = ref(0);
const lastTime = ref(0);
const isClick = ref(true);
watch(temporaryStorageSnip, (newVal) => {
    visible.value = newVal.length === 1;
    const timer = setTimeout(() => {
        visible.value = false;
        clearTimeout(timer);
    }, 3000);
});

watch(affixSnipRef, (newVal) => {
    if (newVal) {
        newVal.onmousedown = (e) => {
            e.preventDefault();
            startTime.value = new Date().getTime();
            if (e.button !== 0) { // 不是鼠标左键
                return;
            }
            window.onmousemove = (ev) => {
                const style = window.getComputedStyle(newVal);
                const top = parseFloat(style.top);
                newVal.style.right = '0px';
                if (top + ev.movementY > 80 && (top + ev.movementY) < (document.documentElement.clientHeight - 42)) {
                    newVal.style.top = `${top + ev.movementY}px`;
                }
            };
            // eslint-disable-next-line no-multi-assign
            window.onmouseup = window.onmouseleave = (eve) => {
                lastTime.value = new Date().getTime();
                isClick.value = (lastTime.value - startTime.value) < 200;
                if (eve.button === 0) {
                    window.onmousemove = null;
                }
            };
        };
    }
});

const openAppAdjustModal = () => {
    if (isClick.value) {
        isShowUseSnipModal.value = true;
    }
};
</script>

<style>
.affix_snip {
    border: 1px solid #6C87FF;
    border-right: none;
    border-radius: 50px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;

    box-shadow: 0px 8px 25px -4px #1f232947;

}
</style>
