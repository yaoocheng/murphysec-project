<template>
    <div class="msg-input g-mb-8">
        <el-input v-model="val" placeholder="请输入文字" :disabled="disabled">
            <template #suffix>
                <SvgIcon
                    class="send-btn"
                    @click="send"
                    name="input-arrow"
                    style="width: 16px; height: 16px"
                />
            </template>
        </el-input>
    </div>
</template>

<script lang="ts" setup>
import { ref, toRefs } from 'vue';
import SvgIcon from 'comp/SvgIcon.vue';
import { useEnterPress } from 'util/hook';

interface IProps {
    disabled?: boolean;
}
const props = withDefaults(defineProps<IProps>(), {
    disabled: false,
});

const emits = defineEmits<{
    send: [val: string];
}>();

const { disabled } = toRefs(props);
const val = ref('');
const send = () => {
    if (!val.value) {
        return;
    }
    emits('send', val.value);
    val.value = '';
};
useEnterPress(() => {
    send();
});
</script>

<style scoped lang="less">
.msg-input {
    :deep(.el-input) {
        height: 40px;

        &.is-disabled {
            .el-input__wrapper {
                background-color: #ebebeb;
                box-shadow: 0 0 0 1px var(--el-disabled-border-color) inset;
            }

            .el-input__inner {
                color: #858585;
            }
        }
    }

    :deep(.el-input__wrapper) {
        border-radius: 6px;
    }

    :deep(.el-input__inner) {
        color: #2a2b32;
    }

    .send-btn {
        cursor: pointer;
    }
}
</style>
