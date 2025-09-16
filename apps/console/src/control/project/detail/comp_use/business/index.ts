import { ref, reactive, watch } from 'vue';

export const isShowAdjustUseModal = ref(false);

export const isShowAppAdjustUseModal = ref(false);

export const temporaryStorageUseComp = reactive([]); // 暂存组件

export const isSinglePath = ref(false); // 单路径

export const editPathKey = ref(''); // 编辑路径key

watch(temporaryStorageUseComp, (val) => {
    if (val.length > 0) {
        window.onbeforeunload = () => '';
    } else {
        window.onbeforeunload = null;
    }
});
