import { reactive, ref, watch } from 'vue';
import { getAdjustDetectStatusApi } from 'api/project';

export const temporaryStorageComp = reactive([]); // 暂存组件

export const isShowAppAdjustModal = ref(false);

export const isShowAdjustModal = ref(false);

export const isAdjustDetect = ref(true); // 校准检测

export const adjustDetectType = ref();

export const canAdjust = ref(true);

watch(temporaryStorageComp, (val) => {
    if (val.length > 0) {
        window.onbeforeunload = () => '';
    } else {
        window.onbeforeunload = null;
    }
});

export const timer = ref<any>(null);
const startRoll = (sid: string) => {
    timer.value = setInterval(() => {
        // eslint-disable-next-line no-use-before-define
        getAdjustDetect(sid);
    }, 3000);
};

export const getAdjustDetect = async (sid: string) => {
    try {
        const { data } = await getAdjustDetectStatusApi(sid);
        adjustDetectType.value = data.fix_type;
        if (data.status === 1 || data.status === 2) {
            isAdjustDetect.value = true;
            if (!timer.value) {
                startRoll(sid);
            }
        } else {
            isAdjustDetect.value = false;
            clearInterval(timer.value);
            timer.value = null;
            // window.location.reload();
        }
    } catch (error) {
        console.log(error);
    }
};
