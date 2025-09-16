import axios from './index';

/**
 * 获取用户设置
 */
export const getUserSettingApi = () => axios({
    method: 'get',
    url: '/platform/user_preference',
});

/**
 * 保存用户设置
 */
export const saveUserSettingApi = (data) => axios({
    method: 'PATCH',
    url: '/platform/user_preference',
    data,
});

/**
 * 获取AI模型列表
 */
export const getAiModelListApi = () => axios({
    method: 'get',
    url: '/platform/llm_configuration',
});

/**
 * 创建AI模型
 */
export const createAiModelApi = (data) => axios({
    method: 'POST',
    url: '/platform/llm_configuration',
    data,
});

/**
 * 删除AI模型
 */
export const deleteAiModelApi = (id) => axios({
    method: 'DELETE',
    url: `/platform/llm_configuration/${String(id)}`,
});

/**
 * 更新AI模型
 */
export const updateAiModelApi = (data) => axios({
    method: 'PATCH',
    url: `/platform/llm_configuration/${data.id}`,
    data,
});

/**
 * 测试AI模型
 */
export const testAiModelApi = (data) => axios({
    method: 'post',
    url: '/platform/llm_configuration/do_test',
    data,
});
