<template>
    <div ref="fileCodeRef" class="flex relative overflow-auto box-border h-full">
        <!-- 蒙层 -->
        <div ref="hide" @click.stop
            class="hide absolute cursor-pointer bg-[#6C87FF1A] hover:bg-[#6C87FF33] box-border w-full left-0"
            :style="{ top: `${(item.first_line_range - 1) * parseInt(ITEM_CODE_HEIGHT)}px`, height: `${(item.last_line_range - item.first_line_range + 1) * parseInt(ITEM_CODE_HEIGHT)}px` }"
            v-for="(item) in itemHighLightCodeList" :key="item.source_id">
        </div>
        <div class="mx-4 text-3c font-normal">
            <div class="line_num text-right" :style="{ height: ITEM_CODE_HEIGHT, lineHeight: ITEM_CODE_HEIGHT }"
                v-for="(item, index) in codeArr" :key="item">
                <span>{{ index + 1 }}</span>
            </div>
        </div>

        <div>
            <div class="item_code text-3c font-normal" :style="{ height: ITEM_CODE_HEIGHT, lineHeight: ITEM_CODE_HEIGHT }"
                v-for="(item) in codeArr" :key="item">
                <!-- <highlightjs autodetect :code="item" /> -->
                <pre>{{ item }}</pre>
            </div>
        </div>
    </div>
</template>

<script setup>
import {
    ref, onMounted,
} from 'vue';
import { ITEM_CODE_HEIGHT } from './business';

defineProps(['codeArr', 'itemHighLightCodeList']);
const fileCodeRef = ref();
const hide = ref();

// watchEffect(() => {
//     const dom = document.getElementById(`more_match_code_${fragCodeMatchFileId.value}`);
//     if (dom) {
//         dom.scrollIntoView({
//             behavior: 'smooth',
//         });
//     } else {
//         nextTick(() => {
//             const dom1 = document.getElementById(`more_match_code_${fragCodeMatchFileId.value}`);
//             if (dom1) {
//                 dom1.scrollIntoView({
//                     behavior: 'smooth',
//                 });
//             }
//         });
//     }
// });

onMounted(() => {
    if (hide.value?.length) {
        fileCodeRef.value.addEventListener('scroll', () => {
            hide.value.forEach((item) => {
                item.style.left = `${fileCodeRef.value.scrollLeft}px`;
            });
        });
    }
});
</script>

<style lang="less">
.active_frag {
    border: 2px solid #6C87FF;
}

.code_operate {
    opacity: 0
}

.hide:hover .code_operate {
    opacity: 1
}

.item_code pre code.hljs {
    padding: 0 !important;
    overflow-x: initial;
}
</style>
