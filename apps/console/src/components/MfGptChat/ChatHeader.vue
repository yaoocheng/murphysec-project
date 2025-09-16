<template>
    <div class="chat-header g-flex g-main-between g-cross-center">
        <div class="g-flex">
            <SvgIcon class="g-mr-12" name="robot" style="width: 40px; height: 40px" />
            <div class="g-flex g-flex-column">
                <span class="g-fw-500 g-f-16 g-lh-22 g-mb-4 g-c-main"> MurphySec Al Copilot </span>
                <span class="g-fw-400 g-f-12 g-lh-16" style="color: #646a73">
                    您的开源组件选型智能助手
                </span>
            </div>
        </div>
        <!-- <div class="g-cursor-pointer">
            <SvgIcon
                v-if="showClose"
                name="close"
                @click="
                    () => {
                        emits('onClose');
                    }
                "
                style="width: 20px; height: 20px"
            />
        </div> -->
    </div>
</template>

<script lang="ts" setup>
// import { toRefs } from 'vue';

// interface IProps {
//     showClose?: boolean;
// }

// eslint-disable-next-line no-undef
// const props = withDefaults(defineProps<IProps>(), {
//     showClose: true,
// });

// const emits = defineEmits<{
//     onClose: [];
// }>();

// const { showClose } = toRefs(props);
</script>

<style scoped lang="less">
.chat-header {
    box-sizing: border-box;
    height: 63px;
    background-color: #fff;
    padding: 10px 24px;
}
</style>
