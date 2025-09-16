<template>
    <el-tooltip v-if="temporaryStorageComp.length > 0" append-to=".affix" :visible="visible" placement="top-end"
        effect="light">
        <template #content>
            <div @mouseleave="visible = false;" class="w-[344px] p-2 text-sm flex items-center">
                「校准组件」信息会被暂时保存在此，点击可查看，应用后即生效
                <!-- <i @click.stop="visible = false" class="murphy icon-guanbi cursor-pointer"></i> -->
            </div>
        </template>
        <div ref="affixRef" @click="openAppAdjustModal" @mouseenter="visible = true;" @mouseleave="visible = false;"
            class="affix cursor-pointer fixed top-[36%] h-10 right-0 z-[99] w-[140px] px-3 bg-[#f1f3ff] flex items-center">
            <img class="w-4 mr-1" src="~ast/img/temporary.png" alt="">
            <span class="text-sm font-normal mr-1 ">待应用的校准</span>
            <TagComp class="rounded-xl text-xs leading-[13px] scale-75" :content="temporaryStorageComp.length" c="#fff" bgc="#F34D3D" />
        </div>
    </el-tooltip>
</template>

<script setup>
import { ref, watch } from 'vue';
import { temporaryStorageComp, isShowAppAdjustModal } from '../../business';

const visible = ref(false);
const affixRef = ref();
const startTime = ref(0);
const lastTime = ref(0);
const isClick = ref(true);
watch(temporaryStorageComp, (newVal) => {
    visible.value = newVal.length === 1;

    const timer = setTimeout(() => {
        visible.value = false;
        clearTimeout(timer);
    }, 3000);
});

watch(affixRef, (newVal) => {
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
        isShowAppAdjustModal.value = true;
    }
};
</script>

<style>
.affix {
    border: 1px solid #6C87FF;
    border-right: none;
    border-radius: 50px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;

    box-shadow: 0px 8px 25px -4px #1f232947;

}
</style>
