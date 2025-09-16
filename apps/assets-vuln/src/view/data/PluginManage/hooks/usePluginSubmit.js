import { useRouter } from 'vue-router';
import { addPluginApi, updatePluginApi } from 'api/data';
import { ROUTER_PATH } from '@/constants';

export function usePluginSubmit() {
    const router = useRouter();

    // 提交表单
    const handleSubmit = async (formRefs, formState, originalPluginData, createType, selectedTemplate) => {
        try {
            // 验证基本信息表单
            await formRefs.basic.value.validateFields();

            // 如果是配置型插件，还要验证配置表单
            if (createType.value === 'config' && formRefs.config?.value) {
                await formRefs.config.value.validateFields();
            }

            // 如果有插件ID就走更新，没有就走新建
            if (formState.plug_market_id) {
                // 编辑模式：保留原有数据，只修改用户改动的部分
                const submitData = {
                    plug_market_id: formState.plug_market_id,
                    plug_name: formState.plug_name,
                    plug_code: formState.plug_file_text,
                    plug_type: originalPluginData.value?.plug_type || 'code',
                    plug_data_type: formState.plug_data_type,
                    plug_desc: formState.plug_description,
                    func_desc: originalPluginData.value?.func_desc || formState.plug_description,
                    usage_guide: originalPluginData.value?.usage_guide || '请根据实际情况配置使用说明',
                    version: originalPluginData.value?.version || '1.0.0',
                    plug_path: originalPluginData.value?.plug_path, // 保留原有路径
                    required_params_schema: originalPluginData.value?.required_params_schema
                        ? originalPluginData.value.required_params_schema.map((param) => ({
                            ...param,
                            value: formState.config[param.key] || param.value || '',
                        }))
                        : [],
                };

                // 如果有模板ID也保留
                if (originalPluginData.value?.plug_built_id) {
                    submitData.plug_built_id = originalPluginData.value.plug_built_id;
                }

                await updatePluginApi(submitData);
            } else {
                // 新建模式：按原有逻辑构造数据
                const submitData = {
                    plug_name: formState.plug_name,
                    plug_code: formState.plug_file_text,
                    plug_type: createType.value === 'config' ? 'config' : 'code',
                    plug_data_type: formState.plug_data_type,
                    plug_desc: formState.plug_description,
                    func_desc: formState.plug_description,
                    usage_guide: selectedTemplate.value?.usage_guide || '请根据实际情况配置使用说明',
                    version: '1.0.0',
                    required_params_schema: createType.value === 'config' && selectedTemplate.value?.required_params_schema
                        ? selectedTemplate.value.required_params_schema.map((templateParam) => ({
                            key: templateParam.key,
                            type: templateParam.type,
                            label: templateParam.label,
                            value: formState.config[templateParam.key] || '',
                            desc: templateParam.desc,
                            required: templateParam.required === true,
                        }))
                        : [],
                };

                // 如果是基于模板创建，添加模板ID
                if (formState.plug_built_id) {
                    submitData.plug_built_id = formState.plug_built_id;
                }

                await addPluginApi(submitData);
            }

            router.push({ path: ROUTER_PATH.pluginMarket });
        } catch (error) {
            console.error(formState.plug_market_id ? '更新插件失败:' : '创建插件失败:', error);
        }
    };

    // 返回上一页
    const goBack = () => {
        router.push({ path: ROUTER_PATH.pluginMarket });
    };

    return {
        handleSubmit,
        goBack,
    };
}
