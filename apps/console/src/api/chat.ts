import axios from './index';
import store from '@/utils/store';

const isAddApi = store.envInfo.env === 'development' ? '/api/platform3' : '/platform3';

/**
 * 获取AI chat 回答内容
 */

export function getCopilotContent(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/copilot/getCopilotContent`,
        data,
    });
}

/**
 * 获取AI chat 对话记录
 */

export function getCopilotReply(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/copilot/getCopilotReply`,
        data,
    });
}
