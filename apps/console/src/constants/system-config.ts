import logo from '/small_logo.png';
import wLogo from '/white_logo.png';
import axios from 'api/index';
import { ref } from 'vue';

// 系统配置接口定义
interface SystemConfig {
    mainLogo: string;
    whiteLogo: string;
    titleName?: string;
    [key: string]: any; // 用于支持其他可能的配置项
}

// 初始系统配置
const systemConfig = ref<SystemConfig>({
    mainLogo: logo,
    whiteLogo: wLogo,
});

// 加载配置文件
const loadConfig = async () => {
    try {
        const response = await axios({
            method: 'get',
            url: '/console/config.json',
        });

        if (response?.data) {
            // 合并配置
            Object.assign(systemConfig.value, response.data);

            // 更新页面标题
            const { titleName } = systemConfig.value;
            if (titleName) {
                document.title = titleName;
            }
        }
    } catch (error) {
        console.error('加载系统配置失败:', error);
    }
};

// 立即加载配置
loadConfig();

export default systemConfig;
