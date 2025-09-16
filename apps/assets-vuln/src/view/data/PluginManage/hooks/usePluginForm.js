import { ref, reactive, computed } from 'vue';

export function usePluginForm() {
    // 表单数据
    const formState = reactive({
        plug_name: '',
        plug_data_type: undefined,
        plug_built_id: undefined,
        plug_program_parameters: undefined,
        plug_file_text: '', // 初始为空，在具体场景中设置
        plug_market_id: undefined,
        plug_description: '',
        config: {}, // 动态配置字段
    });

    // 创建类型和模板
    const createType = ref('direct');
    const selectedTemplate = ref(null);
    const originalPluginData = ref(null);

    // 表单验证
    const isFormValid = computed(() => {
        const basicValid = formState.plug_name && formState.plug_data_type;

        if (createType.value === 'config') {
            // 配置型：检查所有必填的配置项是否都有值
            const requiredParams = selectedTemplate.value?.required_params_schema || [];
            const hasRequiredConfig = requiredParams.length === 0
        || requiredParams.every((param) => {
            const value = formState.config[param.key];
            // 如果参数有required属性且为true，则必填
            if (param.required === true) {
                return value && value.toString().trim() !== '';
            }
            return true;
        });
            return basicValid && hasRequiredConfig;
        }
        return basicValid && formState.plug_file_text;
    });

    // 判断创建类型
    const determineCreateType = (templateData) => {
        if (!templateData) {
            return 'direct'; // 直接创建
        }

        // 编辑现有插件时，检查插件类型
        if (templateData.plug_market_id) {
            // 这是编辑现有插件，根据plug_type判断
            if (templateData.plug_type === 'config') {
                return 'config';
            }
            if (templateData.plug_type === 'code') {
                return 'code';
            }
            // 如果没有明确的plug_type，通过是否有required_params_schema来判断
            if (templateData.required_params_schema && templateData.required_params_schema.length > 0) {
                return 'config';
            }
            return 'code'; // 默认为代码型
        }

        // 从模板创建时，根据模板类型判断
        if (templateData.data_type === 'config' || templateData.type === 'config') {
            return 'config'; // 配置型模板
        }
        if (templateData.data_type === 'code' || templateData.type === 'code') {
            return 'code'; // 代码型模板
        }

        return 'direct';
    };

    // 初始化表单数据
    const initializeForm = (editData) => {
        if (!editData) return;

        // 保存原始数据，用于编辑时提交
        originalPluginData.value = { ...editData };

        // 判断创建类型
        createType.value = determineCreateType(editData);
        selectedTemplate.value = editData;

        // 直接设置表单数据
        formState.plug_name = editData.plug_name || editData.name || '';
        formState.plug_data_type = editData.plug_data_type || editData.data_type;
        formState.plug_description = editData.plug_desc
      || editData.description
      || editData.function_description
      || '';
        formState.plug_market_id = editData.plug_market_id;
        formState.plug_built_id = editData.plug_built_id; // 设置模板ID

        // 根据插件类型初始化数据
        if (formState.plug_market_id) {
            // 编辑现有插件
            if (createType.value === 'config') {
                // 配置型插件：初始化配置字段和代码
                const requiredParams = editData.required_params_schema || [];
                requiredParams.forEach((param) => {
                    formState.config[param.key] = param.value || param.default || '';
                });
                // 配置型插件也要设置现有代码
                formState.plug_file_text = editData.plug_code || '';
            } else {
                // 代码型插件：使用插件的代码内容
                formState.plug_file_text = editData.plug_code || '';
            }
        } else if (createType.value === 'config') {
            // 从配置型模板创建，初始化配置字段和代码
            const requiredParams = editData.required_params_schema || [];
            requiredParams.forEach((param) => {
                formState.config[param.key] = param.value || param.default || '';
            });
            // 配置型模板也要设置模板代码
            const templateCode = editData.default_code
        || editData.code
        || editData.plug_file_text
        || editData.template_code
        || '';
            if (templateCode) {
                formState.plug_file_text = templateCode;
            }
        } else if (createType.value === 'code') {
            // 从代码型模板创建，使用模板中的代码内容
            const templateCode = editData.default_code
        || editData.code
        || editData.plug_file_text
        || editData.template_code
        || '';
            if (templateCode) {
                formState.plug_file_text = templateCode;
            }
        }
    };

    return {
        formState,
        createType,
        selectedTemplate,
        originalPluginData,
        isFormValid,
        determineCreateType,
        initializeForm,
    };
}
