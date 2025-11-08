
export const analyzeFile = async (zipFile) => {
    return new Promise((resolve, reject) => {
        // 创建Worker实例，使用URL.createObjectURL以支持Vite等构建工具
        const worker = new Worker(new URL('./work.js', import.meta.url), { type: 'module' });

        // 监听Worker返回的结果
        worker.addEventListener('message', (event) => {
            const { type, data } = event.data;

            if (type === 'result') {
                // 处理完成，返回结果并终止Worker
                resolve(data);
                worker.terminate();
            } else if (type === 'error') {
                // 处理出错
                reject(new Error(data.message));
                worker.terminate();
            }
        });

        // 监听Worker错误
        worker.addEventListener('error', (error) => {
            reject(error);
            worker.terminate();
        });

        // 发送数据到Worker进行处理
        worker.postMessage(zipFile);

    });
}






