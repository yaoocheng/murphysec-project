import axios from './index';

/**
 * 插件管理列表
 */
export const getPluginApi = () => axios({
    method: 'get',
    url: '/platform/plug/mark_all',
});

/**
 *  插件模板
 */
export const getPluginTempApi = () => axios({
    method: 'get',
    url: '/platform/plug/built_all',
});

/**
 * 插件模板文件
 */
export const getPluginTempCodeApi = (data) => axios({
    method: 'get',
    url: '/platform/plug/plug_file',
    params: data,
});

/**
 * 新增自定义插件
 */
export const addPluginApi = (data) => axios({
    method: 'post',
    url: '/platform/plug/add_mark',
    data,
    message: '操作成功',
});

/**
 * 更新自定义插件
 */
export const updatePluginApi = (data) => axios({
    method: 'post',
    url: '/platform/plug/update_mark',
    data,
    message: '更新成功',
});

/**
 * 删除插件
 */
export const delPluginApi = (data) => axios({
    method: 'delete',
    url: '/platform/plug/mark',
    params: data,
    message: '删除成功',
});

/**
 * 任务列表
 */
export const getTaskListApi = (data) => axios({
    method: 'post',
    url: '/platform/plug/get_factory',
    data,
});

/**
 * 执行插件任务
 */
export const execTaskApi = (data) => axios({
    method: 'get',
    url: '/platform/plug/start_factory',
    params: data,
    message: '执行成功',
});

/**
 * 执行记录
 */
export const getExecRecordApi = (data) => axios({
    method: 'get',
    url: '/platform/plug/get_plug_log',
    params: data,
});

/**
 * 获取执行日志（下载文件）
 */
export const getExecLogApi = (data) => axios({
    method: 'get',
    url: '/platform/plug/get_plug_log_file',
    params: data,
    responseType: 'blob',
});

/**
 * 获取执行日志文本内容（查看日志）
 */
export const getExecLogTextApi = (data) => axios({
    method: 'get',
    url: '/platform/plug/get_plug_log_file',
    params: data,
});

/**
 * 新增插件任务
 */
export const addPluginTaskApi = (data) => axios({
    method: 'post',
    url: '/platform/plug/add_factory',
    data,
    message: '添加成功',
});

/**
 * 更新插件任务
 */
export const updatePluginTaskApi = (data) => axios({
    method: 'post',
    url: '/platform/plug/update_factory',
    data,
    message: '更新成功',
});

/**
 * 删除插件任务
 */
export const delPluginTaskApi = (data) => axios({
    method: 'delete',
    url: '/platform/plug/del_factory',
    params: data,
    message: '删除成功',
});

/**
 * 获取任务执行时间
 */
export const getTaskExecTimeApi = (data) => axios({
    method: 'post',
    url: '/platform/plug/get_plan_time',
    data,
});

/**
 * 预处理业务系统
 */

// 获取列表
export const getDataPreparationBusinessSystemListApi = (data) => axios({
    method: 'post',
    url: '/platform/data_preparation/business_system_list',
    data,
});

// 删除
export const delDataPreparationBusinessSystemApi = (params) => axios({
    method: 'delete',
    url: '/platform/data_preparation/business_system_delete',
    data: {
        ids: params,
    },
});

// 批量删除业务系统
export const batchDelDataPreparationBusinessSystemApi = (data) => axios({
    method: 'post',
    url: '/platform/data_preparation/business_system_delete',
    data: {
        ids: data,
    },
});

// 编辑
export const editDataPreparationBusinessSystemApi = (data) => axios({
    method: 'post',
    url: '/platform/data_preparation/business_system_update',
    data,
});

// 发布
export const pushDataPreparationBusinessSystemApi = (data) => axios({
    method: 'post',
    url: '/platform/data_preparation/business_system_publish',
    data,
});

/**
 * 预处理应用
 */

// 获取列表
export const getPreparationAppListApi = (data) => axios({
    method: 'post',
    url: '/platform/data_preparation/application_list',
    data,
});

// 删除
export const delPreparationAppApi = (params) => axios({
    method: 'delete',
    url: '/platform/data_preparation/application_delete',
    data: {
        ids: params,
    },
});

// 批量删除应用
export const batchDelPreparationAppApi = (data) => axios({
    method: 'post',
    url: '/platform/data_preparation/application_delete',
    data: {
        ids: data,
    },
});

// 发布
export const pushPreparationAppApi = (data) => axios({
    method: 'post',
    url: '/platform/data_preparation/application_publish',
    data,
});

// 编辑
export const editPreparationAppApi = (data) => axios({
    method: 'post',
    url: '/platform/data_preparation/application_update',
    data,
});

/**
 * 预处理应用载体
 */

// 获取列表
export const getPreparationAppCarrierListApi = (data) => axios({
    method: 'post',
    url: '/platform/data_preparation/carrier_list',
    data,
});

// 删除
export const delPreparationAppCarrierApi = (params) => axios({
    method: 'delete',
    url: '/platform/data_preparation/carrier_delete',
    data: {
        ids: params,
    },
});

// 批量删除应用载体
export const batchDelPreparationAppCarrierApi = (data) => axios({
    method: 'post',
    url: '/platform/data_preparation/carrier_delete',
    data: {
        ids: data,
    },
});

// 发布
export const pushPreparationAppCarrierApi = (data) => axios({
    method: 'post',
    url: '/platform/data_preparation/carrier_publish',
    data,
});

// 编辑
export const editPreparationAppCarrierApi = (data) => axios({
    method: 'post',
    url: '/platform/data_preparation/carrier_update',
    data,
});

// 获取来源
export const getPreparationAppSourceListApi = () => axios({
    method: 'get',
    url: '/platform/data_preparation/carrier_type_list',
});

/**
 * 预处理安全问题
 */

// 获取列表
export const getPreparationSecurityQuestionListApi = (data) => axios({
    method: 'post',
    url: '/platform/issue/issue_prequalification_list',
    data,
});

// 安全问题批量删除/platform/issue/delete_issue
export const batchDelPreparationIssueApi = (data) => axios({
    method: 'post',
    url: '/platform/issue/delete_issue',
    data: {
        id: data,
    },
});
// 删除
export const delPreparationSecurityQuestionApi = (data) => axios({
    method: 'post',
    url: '/platform/issue/delete_issue',
    data: {
        id: data,
    },
});

// 发布
export const pushPreparationSecurityQuestionApi = (data) => axios({
    method: 'post',
    url: '/platform/issue/issue_release',
    data,
});

// 编辑
export const editPreparationSecurityQuestionApi = (data) => axios({
    method: 'post',
    url: '/platform/issue/update_issue',
    data,
});

/**
 * 插件测试
 */
export const testPluginApi = (data) => axios({
    method: 'post',
    url: '/platform/plug/test',
    data,
});

/**
 * 删除插件判断
 */
export const checkPluginDeleteApi = (id) => axios({
    method: 'get',
    url: `/platform/plug/mark/${id}`,
});

/**
 * 更新内置插件
 */
export const updateBuiltPluginApi = (data) => axios({
    method: 'post',
    url: '/platform/plug/update_built',
    data,
    message: '更新成功',
});

// 全量删除
export const batchDelPluginApi = (data) => axios({
    method: 'post',
    url: '/platform/data_preparation/batch_delete',
    data: {
        type: data,
    },
});

// 全量发布
export const batchPublishPluginApi = (data) => axios({
    method: 'post',
    url: '/platform/data_preparation/batch_publish',
    data: {
        type: data,
    },
});
