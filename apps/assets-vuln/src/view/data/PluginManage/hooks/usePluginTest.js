import { ref, computed } from 'vue';
import { testPluginApi } from 'api/data';

export function usePluginTest() {
    // 测试相关状态
    const testing = ref(false);
    const testResult = ref('');
    const running = ref(false);
    const runResult = ref(null);

    // 测试结果样式
    const testResultClass = computed(() => ({
        'test-success': testResult.value.includes('成功'),
        'test-error': testResult.value.includes('失败'),
    }));

    // 运行结果状态样式
    const resultStatusClass = computed(() => ({
        'status-success': runResult.value?.status === 'success',
        'status-error': runResult.value?.status === 'error',
    }));

    // 测试连接
    const testConnection = async () => {
        testing.value = true;
        testResult.value = '';

        try {
            // 模拟测试连接
            await new Promise((resolve) => {
                setTimeout(resolve, 2000);
            });

            // 这里应该调用实际的测试连接API
            const success = Math.random() > 0.3; // 模拟成功率

            if (success) {
                testResult.value = '连接测试成功';
            } else {
                testResult.value = '连接测试失败：无法连接到服务器';
            }
        } catch (error) {
            testResult.value = `连接测试失败：${error.message}`;
        } finally {
            testing.value = false;
        }
    };

    // 解码并格式化文本内容
    const formatText = (text) => {
        if (!text) return '';

        // 处理换行符
        let formatted = text.replace(/\\n/g, '\n');

        // 处理unicode转义序列（如 \u003e）
        formatted = formatted.replace(/\\u([0-9a-fA-F]{4})/g, (match, code) => String.fromCharCode(parseInt(code, 16)));

        // 处理其他常见转义序列
        formatted = formatted.replace(/\\t/g, '\t');
        formatted = formatted.replace(/\\r/g, '\r');

        return formatted;
    };

    // 运行代码测试
    const runCode = async (plugCode) => {
        if (!plugCode.trim()) {
            runResult.value = {
                status: 'error',
                output: '请先输入代码',
                message: '请先输入代码内容',
            };
            return;
        }

        running.value = true;

        try {
            // 调用真实的插件测试API
            const { data } = await testPluginApi({
                plug_code: plugCode,
            });

            // 根据API返回结果判断是否成功
            if (data.code === 200 || data.code === '200' || data.code === 0) {
                // 解码base64内容
                let decodedData;
                try {
                    const base64Data = data.data;
                    const decodedString = atob(base64Data);
                    decodedData = JSON.parse(decodedString);
                } catch (decodeError) {
                    runResult.value = {
                        status: 'error',
                        output: '解析测试结果失败',
                        message: '解析返回数据失败',
                    };
                    return;
                }

                // 判断执行结果
                if (decodedData.data && decodedData.data.stdout && decodedData.data.stdout.trim()) {
                    // 有stdout输出，说明执行成功
                    runResult.value = {
                        status: 'success',
                        output: formatText(decodedData.data.stdout),
                        message: '运行成功',
                    };
                } else if (decodedData.data && decodedData.data.error) {
                    // 没有stdout但有error，说明执行失败
                    runResult.value = {
                        status: 'error',
                        output: formatText(decodedData.data.error),
                        message: '运行失败',
                    };
                } else {
                    // 没有输出也没有错误
                    runResult.value = {
                        status: 'success',
                        output: '代码执行完成，无输出内容',
                        message: '运行成功',
                    };
                }
            } else {
                runResult.value = {
                    status: 'error',
                    output: data.msg_zh || data.msg_en || '插件测试失败',
                    message: '测试失败',
                };
            }
        } catch (error) {
            console.error('插件测试失败:', error);
            runResult.value = {
                status: 'error',
                output: `运行失败：${error.response?.data?.msg_zh || error.response?.data?.msg_en || error.message}`,
                message: '网络错误',
            };
        } finally {
            running.value = false;
        }
    };

    return {
        testing,
        testResult,
        running,
        runResult,
        testResultClass,
        resultStatusClass,
        testConnection,
        runCode,
    };
}
