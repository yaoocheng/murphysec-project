import { getFullDetectStatusApi, cancelFullDetectStatusApi } from 'api/detect';
import store, { detectInfo } from 'util/store';
import { ref } from 'vue';

export const isGetFullStatus = ref<boolean>(false);
export const isFullDetecting = ref<boolean>(false); // 是否在全量
export const showInfo = ref<any>({}); // 全量信息
export const getFullDetectStatus = async (type: string) => { // 获取全量状态
    const res = await getFullDetectStatusApi({
        team_id: store.teamInfo.team_id,
        access_type: type,
        team_config_id: detectInfo.team_config_id,
    });
    isGetFullStatus.value = true;
    isFullDetecting.value = res.data.data.status === 'running';
    showInfo.value = res.data.data;
    return isFullDetecting.value;
};

export const fullRollTimer = ref<any>(null); // 轮询状态
export const startRoll = (type: string) => {
    fullRollTimer.value = window.setInterval(async () => {
        const res = await getFullDetectStatus(type);
        if (!res) {
            isFullDetecting.value = false;
            clearInterval(fullRollTimer.value);
        }
    }, 4000);
};

// 取消全量
export const cancleFullDetect = async (type: string) => {
    await cancelFullDetectStatusApi({
        team_id: store.teamInfo.team_id,
        access_type: type,
        team_config_id: detectInfo.team_config_id,
    });
    clearInterval(fullRollTimer.value);
    isFullDetecting.value = false;
};

export const fullDetectTime = (time: number) => {
    if (time < 60) {
        return `${parseInt(`${time}`, 10)}秒`;
    }
    if (time >= 60 && time < 3600) {
        return `${parseInt(`${time / 60}`, 10)}分钟`;
    }
    if (time >= 3600 && time < 86400) {
        return `${parseInt(`${time / 60 / 60}`, 10)}小时`;
    }
    if (time >= 86400) {
        return `${parseInt(`${time / 60 / 60 / 24}`, 10)}天`;
    }
};

export const selectAllValue = ref<boolean>(false);
export const listData = ref<Array<any>>([]);
export const selectedData = ref<Array<any>>([]);
// 全选
export const selectAllHandle = () => {
    if (selectAllValue.value) {
        // 全部选中
        selectedData.value.push(...listData.value);
    } else {
        // 清空
        selectedData.value = selectedData.value.filter((ele) => !listData.value.some((a) => a.id === ele.id));
    }
    listData.value = listData.value.map((item) => {
        item.checked = selectAllValue.value;
        return item;
    });
};

// 选择项目
export const selectProjectHandle = (item: any) => {
    if (item.checked) {
        // 选中放右
        selectedData.value.push(item);
    } else {
        // 未选右清除
        selectedData.value = selectedData.value.filter((ele) => ele.id !== item.id);
    }
    selectAllValue.value = listData.value.every((e) => e.checked);
};

// 清除已选择项目
export const clearSelectProject = (item: any) => {
    // 右清除 左未选
    listData.value.forEach((ele) => {
        if (ele.id === item.id) {
            ele.checked = false;
        }
    });
    selectedData.value = selectedData.value.filter((ele) => ele.id !== item.id);
    selectAllValue.value = listData.value.every((o:any) => selectedData.value.some((ele) => ele.id === o.id));
};
